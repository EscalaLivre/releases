#!/usr/bin/env node
// PASSO 11 — Real update discovery validation against published GitHub releases.
// Reads the published manifests (via GitHub release download URLs) and verifies:
//   1. Each named manifest is reachable at its canonical GitHub download URL.
//   2. The manifest parses (YAML), has canonical product/appId/channel/assetName.
//   3. The assetName in the manifest corresponds to an asset listed at the GitHub release.
//   4. The size/sha256 fields in the manifest match the freshly downloaded artifact.
//   5. minimumClient-/Server-/CompatibleVersion gates are present per product type.
//
// Run: node tools/update-discovery-PASSO-11.mjs --root <ESCALA_ROOT>
import https from 'node:https';
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createReadStream } from 'node:fs';

let ROOT = process.env.ESCALA_ROOT || (process.argv.includes('--root') ? process.argv[process.argv.indexOf('--root')+1] : path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\//,''), '..'));
if (!path.isAbsolute(ROOT)) ROOT = path.resolve(process.cwd(), ROOT);

const { createRequire } = await import('node:module');
const yaml = createRequire(path.join(ROOT, 'desktop', 'node_modules', 'js-yaml', 'package.json'))('js-yaml');
let token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

function fetchFollow(url, destPath, redirects = 0, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('too many redirects'));
    const lib = url.startsWith('https') ? https : http;
    const headers = { 'User-Agent': 'escalalivre-discovery-test', ...extraHeaders };
    if (token) headers.Authorization = `Bearer ${token}`;
    lib.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchFollow(res.headers.location, destPath, redirects + 1, extraHeaders));
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      const ws = fs.createWriteStream(destPath);
      res.pipe(ws);
      ws.on('finish', () => { ws.close(); resolve(); });
      ws.on('error', reject);
    }).on('error', reject);
  });
}

function downloadText(url, redirects = 0, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('too many redirects'));
    const lib = url.startsWith('https') ? https : http;
    const headers = { 'User-Agent': 'escalalivre-discovery-test', ...extraHeaders };
    if (token) headers.Authorization = `Bearer ${token}`;
    lib.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadText(res.headers.location, redirects + 1, extraHeaders));
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function sha256File(p) {
  return new Promise((resolve, reject) => {
    const h = crypto.createHash('sha256');
    const s = createReadStream(p);
    s.on('data', c => h.update(c));
    s.on('end', () => resolve(h.digest('hex')));
    s.on('error', reject);
  });
}

const dlDir = path.join(ROOT, 'dist-manifests', 'rc', 'discovery-cache');
fs.mkdirSync(dlDir, { recursive: true });

const products = [
  { key: 'client', repo: 'EscalaLivre/releases', tag: 'v1.6.0-rc.1', manifest: 'client-rc.yml', appId: 'escalalivre', minField: 'minimumClientVersion' },
  { key: 'server', repo: 'EscalaLivre/releases', tag: 'v1.6.0-rc.1', manifest: 'server-rc.yml', appId: 'escalalivre-server-configurator', minField: 'minimumServerVersion' },
  { key: 'activation', repo: 'EscalaLivre/activation-manager', tag: 'v0.1.0-qa9', manifest: 'activation-rc.yml', appId: 'escalalivre-activation-manager', minField: 'minimumCompatibleVersion' },
];

const results = { passo: 11, channel: 'rc', timestamp: new Date().toISOString(), products: {} };

for (const product of products) {
  const url = `https://github.com/${product.repo}/releases/download/${product.tag}/${product.manifest}`;
  const localManifest = path.join(dlDir, product.manifest);
  console.log(`[${product.key}] Discovering ${url}`);
  let status = {};
  try {
    // Manifest fetch: prefer API asset download (works for private repos like activation-manager)
    const assetListUrl = `https://api.github.com/repos/${product.repo}/releases/tags/${product.tag}`;
    const releaseJson = JSON.parse(await downloadText(assetListUrl));
    const assetNames = releaseJson.assets.map(a => a.name);
    const manifestMeta = releaseJson.assets.find(a => a.name === product.manifest);
    if (!manifestMeta) throw new Error(`manifest ${product.manifest} not found in release assets: ${JSON.stringify(assetNames)}`);
    const manifestUrl = manifestMeta.browser_download_url;
    const manifestApiUrl = `https://api.github.com/repos/${product.repo}/releases/assets/${manifestMeta.id}`;
    const txt = await downloadText(manifestApiUrl, 0, { 'Accept': 'application/octet-stream' });
    fs.writeFileSync(localManifest, txt);
    const manifest = yaml.load(txt);

    // 1. Schema validation
    for (const field of ['product', 'appId', 'version', 'channel', 'assetName', 'size', 'sha256', 'sha512', 'publishedAt']) {
      if (!(field in manifest)) throw new Error(`missing field ${field}`);
    }
    const prodValue = product.key === 'activation' ? 'activation-manager' : product.key;
    if (manifest.product !== prodValue) throw new Error(`product mismatch: got ${manifest.product}, expected ${prodValue}`);
    if (manifest.appId !== product.appId) throw new Error(`appId mismatch: got ${manifest.appId}, expected ${product.appId}`);
    if (manifest.channel !== 'rc') throw new Error(`channel mismatch: got ${manifest.channel}`);

    // cross-product rejection (the manifest's product must NOT match other products)
    for (const other of products) {
      if (other === product) continue;
      if (manifest.productId === other.key) throw new Error(`cross-product leak: ${product.key} contains ${other.key}`);
      if (manifest.appId === other.appId) throw new Error(`cross-product appId leak`);
    }

    // minimum gate field
    if (product.minField && !(product.minField in manifest)) throw new Error(`missing ${product.minField}`);

    // 2. Confirm assetName exists at the release
    if (!assetNames.includes(manifest.assetName)) {
      throw new Error(`assetName ${manifest.assetName} not found in release assets: ${JSON.stringify(assetNames)}`);
    }

    // 3. Download the asset and compare sha256/size (use API asset endpoint w/ octet-stream for private repos)
    const assetMeta = releaseJson.assets.find(a => a.name === manifest.assetName);
    const assetUrl = `https://api.github.com/repos/${product.repo}/releases/assets/${assetMeta.id}`;
    const localAsset = path.join(dlDir, manifest.assetName);
    console.log(`[${product.key}] Downloading ${manifest.assetName} (${Math.round(manifest.size/1024/1024)} MB)...`);
    await fetchFollow(assetUrl, localAsset, 0, { 'Accept': 'application/octet-stream' });
    const actualSize = fs.statSync(localAsset).size;
    if (actualSize !== manifest.size) throw new Error(`size mismatch: got ${actualSize}, expected ${manifest.size}`);
    const actualSha = await sha256File(localAsset);
    if (actualSha.toLowerCase() !== String(manifest.sha256).toLowerCase()) {
      throw new Error(`sha256 mismatch: got ${actualSha}, expected ${manifest.sha256}`);
    }

    status = { ok: true, name: product.key, manifestUrl: manifestUrl, assetName: manifest.assetName, size: actualSize, sha256: actualSha.toLowerCase(), version: manifest.version };
    results.products[product.key] = status;
  } catch (e) {
    status = { ok: false, name: product.key, manifestUrl: url, error: e.message };
    results.products[product.key] = status;
  }
  if (status.ok) console.log(`[${product.key}] PASS  asset=${status.assetName} v${status.version} sha256=${status.sha256.slice(0,16)}…`);
  else console.log(`[${product.key}] FAIL  ${status.error}`);
}

const overall = Object.values(results.products).every(p => p.ok);
results.overall = overall;
results.passo_status = overall ? 'PASS' : 'FAIL';
fs.writeFileSync(path.join(ROOT, 'dist-manifests', 'rc', 'discovery-evidence.json'), JSON.stringify(results, null, 2));
console.log('\nPASSO 11 overall:', results.passo_status);
process.exit(overall ? 0 : 1);
