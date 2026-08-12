#!/usr/bin/env node
/**
 * publish-update-manifests.mjs
 * Pipeline de geração, validação e publicação de manifestos de atualização
 * para Client, Server e Activation Manager.
 *
 * Uso:
 *   node tools/publish-update-manifests.mjs --dry-run --channel rc --client --server --activation
 *   node tools/publish-update-manifests.mjs --channel stable --verify-only
 *   node tools/publish-update-manifests.mjs --channel rc --client --server --activation --upload
 */

import { program } from 'commander';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync, createReadStream, createWriteStream, openSync, readSync, closeSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import https from 'node:https';
import { URL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let ROOT = process.env.ESCALA_ROOT ? path.resolve(process.env.ESCALA_ROOT) : path.resolve(__dirname, '..');

// Configuração dos produtos
const PRODUCTS = {
  client: {
    name: 'Escala Livre',
    appId: 'escalalivre',
    repoDir: 'desktop',
    packageJson: 'package.json',
    distDir: 'dist',
    assetPattern: 'EscalaLivre-${version}-${arch}.exe',
    manifestNames: { rc: 'client-rc.yml', stable: 'client-stable.yml' },
    feedRepo: 'EscalaLivre/releases',
    buildScript: 'build:win',
    extraFields: ['protocolVersion', 'contractVersion', 'minimumClientVersion', 'minimumServerVersion'],
  },
  server: {
    name: 'Escala Livre Server',
    appId: 'escalalivre-server-configurator',
    repoDir: 'server',
    packageJson: 'package.json',
    distDir: 'dist',
    assetPattern: 'EscalaLivreServer-${version}-${arch}.exe',
    manifestNames: { rc: 'server-rc.yml', stable: 'server-stable.yml' },
    feedRepo: 'EscalaLivre/releases',
    buildScript: 'build:server',
    extraFields: ['protocolVersion', 'contractVersion', 'minimumClientVersion', 'minimumServerVersion'],
  },
  activation: {
    name: 'Escala Livre Activation Manager',
    appId: 'escalalivre-activation-manager',
    repoDir: 'activation-manager',
    packageJson: 'package.json',
    distDir: 'dist',
    assetPattern: 'EscalaLivreActivationManager-${version}-${arch}.exe',
    manifestNames: { rc: 'activation-rc.yml', stable: 'activation-stable.yml' },
    feedRepo: 'EscalaLivre/activation-manager',
    isPrivate: true,
    buildScript: 'dist:win',
    extraFields: ['minimumCompatibleVersion'],
  },
};

const ARCH = process.arch === 'x64' ? 'x64' : process.arch;

class ManifestPipeline {
  constructor(options = {}) {
    this.dryRun = options.dryRun ?? false;
    this.channel = options.channel ?? 'rc';
    this.verifyOnly = options.verifyOnly ?? false;
    this.mock = options.mock ?? false;
    this.upload = options.upload ?? false;
    this.products = options.products ?? ['client', 'server', 'activation'];
    this.githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  }

  log(...args) { console.log('[manifest]', new Date().toISOString(), ...args); }
  logErr(...args) { console.error('[manifest ERROR]', new Date().toISOString(), ...args); }
  logWarn(...args) { console.warn('[manifest WARN]', new Date().toISOString(), ...args); }

  async run() {
    this.log('Iniciando pipeline de manifestos', { channel: this.channel, dryRun: this.dryRun, verifyOnly: this.verifyOnly, upload: this.upload });

    // 1. Validar ambiente
    await this.validateEnvironment();

    // 2. Build clean-room (se não verify-only e não dry-run)
    if (!this.verifyOnly && !this.dryRun) {
      await this.buildCleanRoom();
    } else if (this.dryRun) {
      this.log('DRY-RUN: Pulando build clean-room (usar dist existente ou mock)');
    }

    // 3. Gerar manifestos
    const manifests = await this.generateManifests();

    // 4. Validar manifestos
    await this.validateManifests(manifests);

    // 5. Gerar checksums
    await this.generateChecksums(manifests);

    // 6. Gerar SBOM
    await this.generateSBOM(manifests);

    // 7. Dry-run ou upload
    if (this.dryRun || this.verifyOnly) {
      this.log('DRY-RUN / VERIFY-ONLY concluído. Manifestos válidos.');
      return { ok: true, manifests };
    }

    if (this.upload) {
      await this.uploadManifests(manifests);
      await this.freshDownloadVerify(manifests);
    }

    return { ok: true, manifests };
  }

  async validateEnvironment() {
    this.log('Validando ambiente...');

    // Verificar Node, npm, electron-builder
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    this.log('Node:', nodeVersion);

    // Verificar repositórios
    for (const productKey of this.products) {
      const product = PRODUCTS[productKey];
      const repoPath = path.join(ROOT, product.repoDir);
      if (!existsSync(path.join(repoPath, '.git'))) {
        throw new Error(`Repositório ${productKey} não encontrado em ${repoPath}`);
      }
    }

    // Verificar token para activation-manager (privado)
    if (this.products.includes('activation') && this.upload) {
      if (!this.githubToken) {
        throw new Error('GITHUB_TOKEN necessário para upload do Activation Manager (repo privado)');
      }
    }

    this.log('Ambiente validado.');
  }

  async buildCleanRoom() {
    this.log('Build clean-room...');

    // Limpar dist anteriores
    for (const productKey of this.products) {
      const product = PRODUCTS[productKey];
      const distPath = path.join(ROOT, product.repoDir, product.distDir);
      if (existsSync(distPath)) {
        this.log('Limpando:', distPath);
        rmSync(distPath, { recursive: true, force: true });
      }
    }

    // Build cada produto
    for (const productKey of this.products) {
      const product = PRODUCTS[productKey];
      const repoPath = path.join(ROOT, product.repoDir);

      this.log('Building:', productKey);
      const buildScript = product.buildScript || 'build';
      try {
        execSync(`npm run ${buildScript}`, { cwd: repoPath, stdio: 'inherit', env: { ...process.env, ESCALA_SERVER_DEV: '0' } });
      } catch (e) {
        throw new Error(`Build falhou para ${productKey}: ${e.message}`);
      }
    }

    this.log('Build clean-room concluído.');
  }

  async generateManifests() {
    this.log('Gerando manifestos...');
    const manifests = {};

    for (const productKey of this.products) {
      const product = PRODUCTS[productKey];
      const repoPath = path.join(ROOT, product.repoDir);

      // Ler versão do package.json
      const pkg = JSON.parse(readFileSync(path.join(repoPath, product.packageJson), 'utf8'));
      const version = pkg.version;

      let assetPath, assetName, size, sha256, sha512;

      if (this.mock || this.dryRun) {
        // Criar artefato mock para dry-run
        const distPath = path.join(repoPath, product.distDir);
        mkdirSync(distPath, { recursive: true });
        
        assetName = product.assetPattern
          .replace('${version}', version)
          .replace('${arch}', ARCH);
        assetPath = path.join(distPath, assetName);
        
        // Criar arquivo mock com header MZ válido e tamanho razoável
        const mockContent = Buffer.concat([
          Buffer.from('MZ'), // PE header
          Buffer.alloc(1024 * 100), // ~100KB mock content
        ]);
        writeFileSync(assetPath, mockContent);
        
        size = mockContent.length;
        sha256 = await this.hashFile(assetPath, 'sha256');
        sha512 = await this.hashFile(assetPath, 'sha512');
        
        this.log(`Mock asset criado: ${assetName} (${size} bytes)`);
      } else {
        // Encontrar asset no dist real
        const distPath = path.join(repoPath, product.distDir);
        if (!existsSync(distPath)) {
          throw new Error(`Dist não encontrado: ${distPath}`);
        }

        const files = readdirSync(distPath).filter(f => f.endsWith('.exe') || f.endsWith('.yml') || f.endsWith('.blockmap'));
        assetName = files.find(f => f.endsWith('.exe') && f.includes(version));
        if (!assetName) {
          throw new Error(`Asset .exe não encontrado para ${productKey} v${version} em ${distPath}`);
        }

        assetPath = path.join(distPath, assetName);
        const stats = statSync(assetPath);
        size = stats.size;

        // Calcular hashes
        sha256 = await this.hashFile(assetPath, 'sha256');
        sha512 = await this.hashFile(assetPath, 'sha512');

        // Verificar PE header
        if (!await this.verifyPEHeader(assetPath)) {
          throw new Error(`Asset ${assetName} não tem header PE válido (MZ)`);
        }
      }

      // Manifest
      const manifest = {
        product: productKey === 'client' ? 'client' : productKey === 'server' ? 'server' : 'activation-manager',
        appId: product.appId,
        version,
        channel: this.channel,
        assetName,
        size,
        sha256,
        sha512,
        publishedAt: new Date().toISOString(),
      };

      // Extra fields
      if (product.extraFields.includes('protocolVersion')) manifest.protocolVersion = '1.0';
      if (product.extraFields.includes('contractVersion')) manifest.contractVersion = '1.0';
      if (product.extraFields.includes('minimumClientVersion')) manifest.minimumClientVersion = '1.5.0';
      if (product.extraFields.includes('minimumServerVersion')) manifest.minimumServerVersion = '1.5.0';
      if (product.extraFields.includes('minimumCompatibleVersion')) manifest.minimumCompatibleVersion = '0.1.0-qa8';

      const manifestName = product.manifestNames[this.channel];
      const manifestYaml = this.toYAML(manifest);

      // Salvar manifesto localmente para validação
      const manifestDir = path.join(ROOT, 'dist-manifests', this.channel);
      mkdirSync(manifestDir, { recursive: true });
      const manifestPath = path.join(manifestDir, manifestName);
      writeFileSync(manifestPath, manifestYaml, 'utf8');

      // Copiar asset para pasta de manifestos (se não for mock)
      let assetDest = path.join(manifestDir, assetName);
      if (!this.mock && !this.dryRun) {
        copyFileSync(assetPath, assetDest);
      } else {
        // Para mock/dry-run, copiar o mock também
        copyFileSync(assetPath, assetDest);
      }

      manifests[productKey] = { manifest, manifestName, manifestPath, assetPath, assetDest, assetName, version };
      this.log(`Manifesto ${manifestName} gerado para ${productKey} v${version}`);
    }

    return manifests;
  }

  async validateManifests(manifests) {
    this.log('Validando manifestos...');

    for (const [productKey, data] of Object.entries(manifests)) {
      const product = PRODUCTS[productKey];
      const { manifest, version } = data;

      // Validações obrigatórias
      if (!manifest.product) throw new Error(`${productKey}: product ausente`);
      if (!manifest.appId) throw new Error(`${productKey}: appId ausente`);
      if (!manifest.version) throw new Error(`${productKey}: version ausente`);
      if (!manifest.channel) throw new Error(`${productKey}: channel ausente`);
      if (!manifest.assetName) throw new Error(`${productKey}: assetName ausente`);
      if (!manifest.size || manifest.size <= 0) throw new Error(`${productKey}: size inválido`);
      if (!manifest.sha256 || !/^[a-f0-9]{64}$/i.test(manifest.sha256)) throw new Error(`${productKey}: sha256 inválido`);
      if (manifest.sha512 && !/^[a-f0-9]{128}$/i.test(manifest.sha512)) throw new Error(`${productKey}: sha512 inválido`);

      // Consistência de versão
      if (manifest.version !== version) {
        throw new Error(`${productKey}: version mismatch - manifest ${manifest.version} vs package.json ${version}`);
      }

      // Channel consistency
      if (manifest.channel !== this.channel) {
        throw new Error(`${productKey}: channel mismatch - manifest ${manifest.channel} vs --channel ${this.channel}`);
      }

      // Product/appId consistency
      if (productKey === 'client' && manifest.product !== 'client') throw new Error(`${productKey}: product deve ser 'client'`);
      if (productKey === 'server' && manifest.product !== 'server') throw new Error(`${productKey}: product deve ser 'server'`);
      if (productKey === 'activation' && manifest.product !== 'activation-manager') throw new Error(`${productKey}: product deve ser 'activation-manager'`);

      if (productKey === 'client' && manifest.appId !== 'escalalivre') throw new Error(`${productKey}: appId deve ser 'escalalivre'`);
      if (productKey === 'server' && manifest.appId !== 'escalalivre-server-configurator') throw new Error(`${productKey}: appId deve ser 'escalalivre-server-configurator'`);
      if (productKey === 'activation' && manifest.appId !== 'escalalivre-activation-manager') throw new Error(`${productKey}: appId deve ser 'escalalivre-activation-manager'`);
    }

    // Cross-product validation
    if (manifests.client && manifests.server) {
      if (manifests.client.version !== manifests.server.version) {
        this.logWarn(`Versões divergentes: client ${manifests.client.version} vs server ${manifests.server.version}`);
      }
    }

    this.log('Manifestos validados.');
  }

  async generateChecksums(manifests) {
    this.log('Gerando checksums...');

    const manifestDir = path.join(ROOT, 'dist-manifests', this.channel);
    const sha256File = path.join(manifestDir, 'SHA256SUMS.txt');
    const sha512File = path.join(manifestDir, 'SHA512SUMS.txt');

    let sha256Content = '';
    let sha512Content = '';

    for (const [productKey, data] of Object.entries(manifests)) {
      const { manifest, assetName, assetDest } = data;

      // Re-calcular do asset final (já copiado)
      const sha256 = await this.hashFile(assetDest, 'sha256');
      const sha512 = await this.hashFile(assetDest, 'sha512');

      sha256Content += `${sha256}  ${assetName}\n`;
      sha512Content += `${sha512}  ${assetName}\n`;
    }

    writeFileSync(sha256File, sha256Content, 'utf8');
    writeFileSync(sha512File, sha512Content, 'utf8');

    this.log('Checksums gerados:', sha256File, sha512File);
  }

  async generateSBOM(manifests) {
    this.log('Gerando SBOM...');

    const manifestDir = path.join(ROOT, 'dist-manifests', this.channel);
    const sbomPath = path.join(manifestDir, 'sbom.json');

    const components = [];

    for (const [productKey, data] of Object.entries(manifests)) {
      const product = PRODUCTS[productKey];
      const repoPath = path.join(ROOT, product.repoDir);

      // package.json dependencies
      const pkg = JSON.parse(readFileSync(path.join(repoPath, product.packageJson), 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      for (const [name, version] of Object.entries(deps)) {
        components.push({
          type: 'library',
          name,
          version: version.replace(/^[\^~]/, ''),
          purl: `pkg:npm/${name}@${version.replace(/^[\^~]/, '')}`,
        });
      }
    }

    const sbom = {
      bomFormat: 'CycloneDX',
      specVersion: '1.5',
      version: 1,
      metadata: {
        timestamp: new Date().toISOString(),
        tools: [{ name: 'manifest-pipeline', version: '1.0.0' }],
        component: {
          type: 'application',
          manufacturer: 'Escala Livre',
          name: 'EscalaLivre Suite',
          version: manifests.client?.version || manifests.server?.version || manifests.activation?.version,
        },
      },
      components,
    };

    writeFileSync(sbomPath, JSON.stringify(sbom, null, 2), 'utf8');
    this.log('SBOM gerado:', sbomPath);
  }

  async uploadManifests(manifests) {
    this.log('Upload de manifestos e assets...');

    if (!this.githubToken) {
      throw new Error('GITHUB_TOKEN não configurado');
    }

    for (const [productKey, data] of Object.entries(manifests)) {
      const product = PRODUCTS[productKey];
      const { manifest, manifestName, manifestPath, assetDest, assetName, version } = data;

      this.log(`Upload ${productKey}: ${assetName} + ${manifestName}`);

      // Criar/atualizar release no GitHub
      const tagName = `v${version}`;
      const releaseName = `${product.name} ${version}`;

      // Verificar se release existe
      const release = await this.getOrCreateRelease(product.feedRepo, tagName, releaseName, product.isPrivate);

      // Upload asset
      await this.uploadAsset(release.id, assetDest, assetName, product.isPrivate);
      await this.uploadAsset(release.id, manifestPath, manifestName, product.isPrivate);

      // Upload checksums (uma vez)
      if (productKey === this.products[0]) {
        const manifestDir = path.join(ROOT, 'dist-manifests', this.channel);
        await this.uploadAsset(release.id, path.join(manifestDir, 'SHA256SUMS.txt'), 'SHA256SUMS.txt', product.isPrivate);
        await this.uploadAsset(release.id, path.join(manifestDir, 'SHA512SUMS.txt'), 'SHA512SUMS.txt', product.isPrivate);
        await this.uploadAsset(release.id, path.join(manifestDir, 'sbom.json'), 'sbom.json', product.isPrivate);
      }

      this.log(`Upload ${productKey} concluído.`);
    }
  }

  async getOrCreateRelease(repo, tagName, releaseName, isPrivate) {
    const url = `https://api.github.com/repos/${repo}/releases/tags/${tagName}`;
    const headers = this.getAuthHeaders(isPrivate);

    let response = await this.fetch(url, { headers });
    if (response.ok) {
      return response.json();
    }

    if (response.status !== 404) {
      throw new Error(`Erro ao buscar release ${tagName}: ${response.status}`);
    }

    // Criar release
    const createUrl = `https://api.github.com/repos/${repo}/releases`;
    const createResponse = await this.fetch(createUrl, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tag_name: tagName,
        name: releaseName,
        prerelease: true,
        draft: false,
        generate_release_notes: false,
      }),
    });

    if (!createResponse.ok) {
      const err = await createResponse.text();
      throw new Error(`Erro ao criar release ${tagName}: ${createResponse.status} ${err}`);
    }

    return createResponse.json();
  }

  async uploadAsset(releaseId, filePath, fileName, isPrivate) {
    const url = `https://uploads.github.com/repos/${isPrivate ? 'EscalaLivre/activation-manager' : 'EscalaLivre/releases'}/releases/${releaseId}/assets?name=${encodeURIComponent(fileName)}`;
    const headers = this.getAuthHeaders(isPrivate);
    headers['Content-Type'] = fileName.endsWith('.exe') ? 'application/octet-stream' : 'text/plain';

    const fileContent = readFileSync(filePath);
    const response = await this.fetch(url, { method: 'POST', headers, body: fileContent });

    if (!response.ok && response.status !== 422) { // 422 = já existe
      const err = await response.text();
      throw new Error(`Erro ao upload ${fileName}: ${response.status} ${err}`);
    }

    if (response.status === 422) {
      this.logWarn(`Asset ${fileName} já existe (422), pulando.`);
    }
  }

  async freshDownloadVerify(manifests) {
    this.log('Fresh download verify...');

    for (const [productKey, data] of Object.entries(manifests)) {
      const product = PRODUCTS[productKey];
      const { manifest, assetName, version } = data;

      // URL do asset na release
      const tagName = `v${version}`;
      const downloadUrl = `https://github.com/${product.feedRepo}/releases/download/${tagName}/${assetName}`;

      this.log(`Verificando download: ${downloadUrl}`);

      const tempFile = path.join(ROOT, 'temp-verify', assetName);
      mkdirSync(path.dirname(tempFile), { recursive: true });

      await this.downloadFile(downloadUrl, tempFile, product.isPrivate);

      // Verificar
      const stats = statSync(tempFile);
      if (stats.size !== manifest.size) {
        throw new Error(`Fresh download size mismatch: ${stats.size} vs ${manifest.size}`);
      }

      const sha256 = await this.hashFile(tempFile, 'sha256');
      if (sha256.toLowerCase() !== manifest.sha256.toLowerCase()) {
        throw new Error(`Fresh download SHA-256 mismatch: ${sha256} vs ${manifest.sha256}`);
      }

      if (!await this.verifyPEHeader(tempFile)) {
        throw new Error(`Fresh download PE header inválido`);
      }

      rmSync(tempFile, { force: true });
      this.log(`Fresh download verify OK: ${assetName}`);
    }
  }

  getAuthHeaders(isPrivate) {
    const token = isPrivate ? this.githubToken : (this.githubToken || '');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async fetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      const req = https.request(url, { ...options, timeout: 30000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, json: () => Promise.resolve(JSON.parse(data)), text: () => Promise.resolve(data) }));
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
      if (options.body) req.write(options.body);
      req.end();
    });
  }

  async downloadFile(url, destPath, isPrivate) {
    return new Promise((resolve, reject) => {
      const headers = this.getAuthHeaders(isPrivate);
      const req = https.get(url, { headers }, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const writeStream = createWriteStream(destPath);
        res.pipe(writeStream);
        writeStream.on('finish', () => resolve());
        writeStream.on('error', reject);
      });
      req.on('error', reject);
      req.setTimeout(300000, () => { req.destroy(); reject(new Error('timeout')); });
    });
  }

  hashFile(filePath, algorithm) {
    return new Promise((resolve, reject) => {
      const hash = createHash(algorithm);
      const stream = createReadStream(filePath);
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  async verifyPEHeader(filePath) {
    return new Promise((resolve) => {
      const fd = openSync(filePath, 'r');
      const buffer = Buffer.alloc(2);
      readSync(fd, buffer, 0, 2, 0);
      closeSync(fd);
      resolve(buffer[0] === 0x4D && buffer[1] === 0x5A);
    });
  }

  toYAML(obj) {
    const lines = [];
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined || value === null) continue;
      if (typeof value === 'string' && (value.includes(':') || value.includes('\n'))) {
        lines.push(`${key}: "${value}"`);
      } else {
        lines.push(`${key}: ${value}`);
      }
    }
    return lines.join('\n') + '\n';
  }
}

// CLI
program
  .name('publish-update-manifests')
  .description('Pipeline de manifestos de atualização Escala Livre')
  .option('--dry-run', 'Apenas gerar e validar, não publicar', false)
  .option('--verify-only', 'Apenas validar manifestos existentes', false)
  .option('--mock', 'Usar artefatos mock para dry-run (sem build real)', false)
  .option('--channel <channel>', 'Canal: rc ou stable', 'rc')
  .option('--client', 'Incluir Client', false)
  .option('--server', 'Incluir Server', false)
  .option('--activation', 'Incluir Activation Manager', false)
  .option('--upload', 'Fazer upload para GitHub (requer GITHUB_TOKEN)', false)
  .option('--root <path>', 'Raiz do workspace (default: pai do diretório do script)', undefined)
  .parse();

const options = program.opts();
if (options.root) ROOT = path.resolve(options.root);
const products = [];
if (options.client) products.push('client');
if (options.server) products.push('server');
if (options.activation) products.push('activation');
if (products.length === 0) products.push('client', 'server', 'activation');

const pipeline = new ManifestPipeline({
  dryRun: options.dryRun,
  channel: options.channel,
  verifyOnly: options.verifyOnly,
  upload: options.upload,
  products,
});

pipeline.run()
  .then(result => {
    if (result.ok) {
      console.log('\n✅ Pipeline concluído com sucesso');
      process.exit(0);
    } else {
      console.error('\n❌ Pipeline falhou');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('\n❌ Erro fatal:', err.message);
    process.exit(1);
  });