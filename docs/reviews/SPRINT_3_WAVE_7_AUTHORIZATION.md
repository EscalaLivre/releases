# ESCALA LIVRE — REVISÃO FINAL DA WAVE 6
## Autorização da Sprint 3 / Wave 7 — TLS, pairing e credenciais por dispositivo

# 1. VEREDITO DA WAVE 6

Com base no relatório final apresentado, os bloqueios da Task 6.5.1 foram encerrados:

```text
migração empacotada SQLite → MySQL 8.4.10: 23/23 PASS
Electron E2E: 42/42 PASS
Gitleaks filesystem: 0 leaks
Trivy filesystem: 0 vulnerabilidades
repositórios canônicos reconciliados: 7
working trees: limpas
server HEAD: c42ec61d
```

Contagem final informada:

```text
623 PASS
0 FAIL
```

A matriz final deve permanecer como fonte canônica para distinguir testes únicos, suites transversais e E2E.

Estado aprovado:

```text
TASK_6_5_1_FINAL_RECONCILIATION: PASS
TASK_6_5_REBUILD: PASS
SPRINT_3_WAVE_6: PASS
SPRINT_3_WAVE_6_FINAL_REVIEW: PASS
LOCAL_TO_SERVER_MIGRATION_READY: YES
PACKAGED_MIGRATION_PROVEN: YES
WAVE_7_ENTRY_GATE: PASS
```

Autorização:

```text
WAVE_7_IMPLEMENTATION_AUTHORIZED: YES
WAVE_8_IMPLEMENTATION_AUTHORIZED: NO
```

# 2. RISCOS RESIDUAIS NÃO BLOQUEANTES

Manter documentado:

```text
WINDOWS_CODE_SIGNING: DEFERRED
NPM_AUDIT_BUILD_TIME_FINDINGS: ACCEPTED_WITH_TRIAGE
```

Regras:

```text
artefatos sem assinatura podem ser usados em QA interno
release pública final permanece bloqueada sem decisão explícita
findings build-time devem continuar no risk register
nenhuma vulnerabilidade runtime pode ser reclassificada silenciosamente
```

# 3. OBJETIVO DA WAVE 7

Implementar comunicação segura entre:

```text
EscalaLivre.exe
↔
backend do Escala Livre Server
```

A Wave 7 deve entregar:

```text
TLS obrigatório
identidade criptográfica do servidor
pairing de dispositivos
credenciais exclusivas por dispositivo
autenticação mútua ou prova criptográfica equivalente
pinning da autoridade do servidor
registro e revogação de dispositivos
limite maxClients
rotação e expiração
auditoria
zero fallback para HTTP
```

# 4. PRINCÍPIOS IMUTÁVEIS

```text
nunca aceitar HTTP após o servidor seguro ser configurado
nunca reutilizar a mesma credencial em vários dispositivos
nunca armazenar chave privada em plaintext
nunca enviar chave privada ao servidor
nunca colocar segredo de pairing em logs
nunca aceitar código expirado ou reutilizado
nunca confiar somente no nome/IP do servidor
nunca permitir dispositivo revogado
nunca exceder maxClients da licença
```

Em qualquer falha:

```text
conexão segura falha fechada
não há downgrade
modo LOCAL permanece disponível quando aplicável
credenciais existentes não são apagadas automaticamente
```

# 5. ARQUITETURA CRIPTOGRÁFICA RECOMENDADA

## 5.1 Autoridade local do servidor

No primeiro setup seguro, o Server Configurator deve criar:

```text
serverId imutável
CA local do servidor
certificado TLS leaf
fingerprint da CA
keystore protegido
metadados de rotação
```

Recomendação:

```text
CA: ECDSA P-256
TLS leaf: ECDSA P-256
hash/fingerprint: SHA-256
TLS mínimo: 1.2
TLS preferencial: 1.3
```

O certificado leaf deve conter SANs explícitos:

```text
hostname configurado
IPs autorizados
localhost apenas para desenvolvimento controlado
```

Não usar certificado com validação global desabilitada.

## 5.2 Proteção da chave da CA

A chave privada da CA deve ser:

```text
criptografada em repouso
armazenada fora do repositório
fora de logs e relatórios
com permissões mínimas
incluída em backup seguro da identidade do servidor
```

Quando a proteção depender do Windows:

```text
KEK protegida por DPAPI/Windows Credential Manager
material criptografado montado no container
container nunca recebe a KEK em argumento de linha de comando
```

Gate:

```text
WAVE_7_SERVER_IDENTITY_SECURITY: PASS/FAIL
```

# 6. MODELO DE PAIRING

## 6.1 Sessão de pairing

O Server Configurator deve oferecer:

```text
ADICIONAR DISPOSITIVO
```

Ao iniciar:

```text
criar pairingSessionId
criar token de alta entropia
criar código manual
definir expiresAt
habilitar endpoint de pairing temporariamente
mostrar QR Code e código
```

Recomendação:

```text
QR token: pelo menos 256 bits aleatórios
código manual: 10 caracteres Crockford Base32
TTL: 5 minutos
single-use
máximo de 5 tentativas
rate limit por sessão e origem
```

O endpoint de pairing deve ficar desabilitado quando não existir sessão ativa.

## 6.2 Conteúdo do QR

O QR pode conter:

```text
schemaVersion
serverEndpoint
serverId
caFingerprint
pairingSessionId
bootstrapToken
expiresAt
```

O QR contém segredo e não deve ser persistido em logs ou screenshots automáticos.

## 6.3 Fluxo manual

O Launcher deve permitir:

```text
endpoint
código manual
nome do dispositivo
confirmação do fingerprint
```

Gate:

```text
WAVE_7_PAIRING_SESSION_SECURITY: PASS/FAIL
```

# 7. CREDENCIAL POR DISPOSITIVO

O dispositivo deve gerar localmente:

```text
deviceId
keypair
CSR ou prova de posse
device metadata mínima
```

A chave privada:

```text
nunca sai do dispositivo
fica protegida por Electron safeStorage/DPAPI
é armazenada no vault local versionado
não aparece no renderer
```

O servidor emite:

```text
certificado de cliente mTLS
ou credencial assinada equivalente com proof-of-possession
```

Preferência arquitetural:

```text
mTLS com certificado exclusivo por dispositivo
```

Campos mínimos:

```text
deviceId
serverId
installationId
issuedAt
expiresAt
serialNumber
status
```

Gate:

```text
WAVE_7_DEVICE_CREDENTIAL_ISSUANCE: PASS/FAIL
```

# 8. PINNING E VALIDAÇÃO DO SERVIDOR

O Launcher deve validar:

```text
cadeia até a CA local
fingerprint da CA pareada
serverId esperado
SAN do endpoint
validade temporal
revogação/rotação quando aplicável
```

Preferir pinning da CA/identidade do servidor, não do leaf isolado.

Proibir:

```text
NODE_TLS_REJECT_UNAUTHORIZED=0
rejectUnauthorized=false
callback que aceite qualquer certificado
fallback para HTTP
```

Gate:

```text
WAVE_7_SERVER_TRUST_AND_PINNING: PASS/FAIL
```

# 9. AUTENTICAÇÃO MÚTUA

Após pairing, toda API protegida deve exigir:

```text
TLS válido
credencial do dispositivo
device status ACTIVE
serverId correto
limite/licença válida
```

O backend deve mapear:

```text
cert serial/deviceId
→ registro do dispositivo
→ status
→ permissões
```

Gate:

```text
WAVE_7_MUTUAL_AUTHENTICATION: PASS/FAIL
```

# 10. REGISTRO DE DISPOSITIVOS

O Server Configurator deve possuir tela:

```text
Dispositivos conectados
```

Campos:

```text
nome
deviceId abreviado
tipo/plataforma
issuedAt
expiresAt
lastSeenAt
status
versão do app
```

Ações:

```text
renomear
revogar
remover após revogação
gerar nova sessão de pairing
```

Status:

```text
PENDING
ACTIVE
EXPIRED
REVOKED
BLOCKED
```

Gate:

```text
WAVE_7_DEVICE_REGISTRY: PASS/FAIL
```

# 11. LIMITE `maxClients`

Antes de emitir uma nova credencial:

```text
contar dispositivos ACTIVE
ler maxClients da licença
bloquear quando o limite for atingido
```

Não contar REVOKED, EXPIRED ou PENDING expirado.

Gate:

```text
WAVE_7_MAX_CLIENTS_ENFORCEMENT: PASS/FAIL
```

# 12. REVOGAÇÃO

Ao revogar:

```text
status muda para REVOKED
novas conexões são negadas imediatamente
sessões/tokens derivados são invalidados
evento é auditado
dispositivo recebe erro claro
```

Gate:

```text
WAVE_7_DEVICE_REVOCATION: PASS/FAIL
```

# 13. EXPIRAÇÃO E ROTAÇÃO

Sugestão inicial:

```text
device certificate: 90 dias
renovação: iniciar com 30 dias restantes
server leaf: até 397 dias
CA local: 5 anos
```

A renovação deve exigir:

```text
credencial atual válida
proof-of-possession
device ACTIVE
serverId correspondente
```

Gate:

```text
WAVE_7_CERTIFICATE_ROTATION: PASS/FAIL
```

# 14. RECUPERAÇÃO DA IDENTIDADE DO SERVIDOR

Criar backup criptografado de:

```text
CA
certificado do servidor
serverId
registro de dispositivos
metadados de rotação
```

Se a CA for perdida:

```text
não gerar outra silenciosamente
marcar identidade perdida/comprometida
exigir novo pairing dos dispositivos
```

Gate:

```text
WAVE_7_SERVER_IDENTITY_BACKUP_RECOVERY: PASS/FAIL
```

# 15. MIGRAÇÃO DE CONFIGURAÇÕES EXISTENTES

Fluxo obrigatório:

```text
detectar servidor sem identidade TLS
mostrar SECURE_PAIRING_REQUIRED
abrir Server Configurator
provisionar identidade
realizar pairing
persistir endpoint HTTPS
remover uso operacional de HTTP
```

Não alterar silenciosamente `http://host` para `https://host`.

Gate:

```text
WAVE_7_EXISTING_SERVER_SECURITY_UPGRADE: PASS/FAIL
```

# 16. UX

## Server Configurator

Adicionar:

```text
SEGURANÇA DO SERVIDOR
DISPOSITIVOS
ADICIONAR DISPOSITIVO
ROTACIONAR CERTIFICADO
BACKUP DA IDENTIDADE
```

## Launcher

Fluxo:

```text
Conectar a um servidor
→ endpoint/QR
→ validar fingerprint
→ gerar chave local
→ pairing
→ receber credencial
→ teste de conexão
→ persistir configuração
→ abrir Client
```

Gate:

```text
WAVE_7_PAIRING_UX: PASS/FAIL
```

# 17. CONTRACTS

Criar:

```text
server-identity.schema.json
pairing-session.schema.json
pairing-request.schema.json
pairing-result.schema.json
device-registration.schema.json
device-certificate-metadata.schema.json
device-revocation.schema.json
certificate-rotation.schema.json
server-trust-record.schema.json
secure-connection-error.schema.json
```

Gate:

```text
WAVE_7_SECURITY_CONTRACTS: PASS/FAIL
```

# 18. PORTS E ADAPTERS

Interfaces mínimas:

```text
ServerIdentityPort
CertificateAuthorityPort
TlsCertificatePort
PairingSessionPort
PairingApprovalPort
DeviceKeyPort
DeviceCredentialPort
DeviceRegistryPort
DeviceRevocationPort
CertificateRotationPort
ServerTrustPort
SecureConnectionPort
SecurityAuditPort
IdentityBackupPort
```

Gate:

```text
WAVE_7_PORT_ADAPTER_BOUNDARIES: PASS/FAIL
```

# 19. IPC

Launcher:

```text
security:get-server-trust
security:start-pairing
security:submit-pairing
security:get-pairing-state
security:cancel-pairing
security:test-secure-connection
security:get-device-status
security:remove-local-credential
```

Server Configurator:

```text
security:get-server-identity
security:create-pairing-session
security:cancel-pairing-session
security:list-devices
security:rename-device
security:revoke-device
security:rotate-server-certificate
security:export-identity-backup
security:restore-identity-backup
```

Todos com allowlist, schemas, timeout, correlationId, ownership e product isolation.

Gate:

```text
WAVE_7_IPC_SECURITY: PASS/FAIL
```

# 20. AUDITORIA

Eventos mínimos:

```text
server_identity_created
pairing_session_created
pairing_attempt_failed
device_paired
device_pairing_denied
device_revoked
device_certificate_renewed
server_certificate_rotated
identity_backup_created
identity_restored
secure_connection_rejected
```

Gate:

```text
WAVE_7_SECURITY_AUDIT: PASS/FAIL
```

# 21. THREAT MODEL

Cobrir:

```text
MITM no primeiro pairing
QR/código capturado
replay
brute force
rogue server
rogue client
device clone
credential theft
revoked device
stale pairing session
clock skew
CA key theft
backup theft
certificate downgrade
HTTP downgrade
DNS/IP change
maxClients bypass
IPC abuse
renderer compromise
```

Gate:

```text
WAVE_7_THREAT_MODEL: PASS/FAIL
```

# 22. TESTES

## Unitários

```text
pairing state machine
TTL
single-use
rate limit
fingerprint
certificate validation
device limits
revocation
rotation
trust store
error mapping
```

## Integração

```text
backend Spring real
TLS real
CA e certificados de teste
MySQL real
Launcher main/preload
Server Configurator main/preload
```

## Electron E2E

```text
criar sessão
pairing
persistência
mTLS
registry
revogação
novo pairing
```

## Failure injection e red team

```text
token expirado
token replay
MITM
cert expirado
cert revogado
vault adulterado
DPAPI falha
backup adulterado
clock skew
rotação interrompida
```

Gates:

```text
WAVE_7_UNIT_TESTS
WAVE_7_INTEGRATION_TESTS
WAVE_7_ELECTRON_E2E
WAVE_7_FAILURE_INJECTION
WAVE_7_RED_TEAM
```

# 23. SEGURANÇA AUTOMATIZADA

Executar:

```text
Gitleaks
npm audit
backend dependency audit
Trivy filesystem
Trivy imagens
SBOM
TLS configuration scan
certificate/key permission checks
log redaction tests
```

Gate:

```text
WAVE_7_SECURITY: PASS/FAIL
```

# 24. BUILD E VALIDAÇÃO EMPACOTADA

Gerar:

```text
EscalaLivre-<versão>-x64.exe
EscalaLivreServer-<versão>-x64.exe
backend SERVER atualizado
```

Validar fora do workspace:

```text
TLS
pairing
conexão segura
persistência
revogação
novo pairing
maxClients
```

Gate:

```text
WAVE_7_PACKAGED_VALIDATION: PASS/FAIL
```

# 25. DOCUMENTAÇÃO

Criar:

```text
docs/waves/WAVE_7_IMPLEMENTATION_PLAN.md
docs/waves/WAVE_7_ARCHITECTURE.md
docs/security/WAVE_7_THREAT_MODEL.md
docs/waves/WAVE_7_SECURITY_CONTRACTS.md
docs/waves/WAVE_7_SERVER_IDENTITY.md
docs/waves/WAVE_7_PAIRING_PROTOCOL.md
docs/waves/WAVE_7_DEVICE_CREDENTIALS.md
docs/waves/WAVE_7_DEVICE_REGISTRY.md
docs/waves/WAVE_7_CERTIFICATE_ROTATION.md
docs/waves/WAVE_7_IDENTITY_BACKUP.md
docs/waves/WAVE_7_IPC_SECURITY.md
docs/waves/WAVE_7_E2E_EVIDENCE.md
docs/waves/WAVE_7_FAILURE_INJECTION.md
docs/waves/WAVE_7_RED_TEAM_REPORT.md
docs/waves/WAVE_7_SECURITY_REPORT.md
docs/waves/WAVE_7_BUILD_EVIDENCE.md
releases/docs/reviews/SPRINT_3_WAVE_7_REPORT.md
```

# 26. RESULTADO ESPERADO

```text
SPRINT_3_WAVE_7: PASS
TLS_READY: YES
PAIRING_READY: YES
DEVICE_CREDENTIALS_READY: YES
DEVICE_REVOCATION_READY: YES
WAVE_8_ENTRY_GATE: PASS/FAIL
WAVE_8_IMPLEMENTATION_AUTHORIZED: NO
```

# 27. COMANDO PARA A IA EXECUTORA

```text
A WAVE 7 ESTÁ AUTORIZADA.

IMPLEMENTE TLS OBRIGATÓRIO, IDENTIDADE LOCAL DO SERVIDOR, PAIRING E
CREDENCIAL EXCLUSIVA POR DISPOSITIVO.

USE CA LOCAL PROTEGIDA, CERTIFICADO TLS COM SAN, PINNING DA CA E mTLS POR
DISPOSITIVO.

O PAIRING DEVE SER TEMPORÁRIO, SINGLE-USE, RATE-LIMITED E RESISTENTE A
REPLAY.

A CHAVE PRIVADA DO DISPOSITIVO DEVE SER GERADA LOCALMENTE E PROTEGIDA POR
safeStorage/DPAPI. ELA NUNCA DEVE SER ENVIADA AO SERVIDOR OU AO RENDERER.

IMPLEMENTE REGISTRY, maxClients, REVOGAÇÃO, EXPIRAÇÃO, RENOVAÇÃO, ROTAÇÃO
E BACKUP DA IDENTIDADE DO SERVIDOR.

PROÍBA HTTP FALLBACK, rejectUnauthorized=false E QUALQUER VALIDAÇÃO TLS
GLOBALMENTE DESABILITADA.

CRIE THREAT MODEL E CONTRACTS ANTES DE FECHAR A IMPLEMENTAÇÃO.

EXECUTE UNITÁRIOS, INTEGRAÇÃO TLS REAL, ELECTRON E2E, FAILURE INJECTION,
RED TEAM, SCANS E VALIDAÇÃO EMPACOTADA.

NÃO INICIE A WAVE 8.

PARE APÓS SPRINT_3_WAVE_7_REPORT.md.

WAVE_8_IMPLEMENTATION_AUTHORIZED DEVE PERMANECER NO.
```
