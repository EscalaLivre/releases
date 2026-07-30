# ESCALA LIVRE — REVISÃO DA IMPLEMENTAÇÃO INICIAL DA WAVE 7
## Autorização da Task 7.1 — Runtime criptográfico, TLS/mTLS e pairing real

# 1. VEREDITO

A implementação atual criou uma boa fundação:

```text
11 schemas de segurança
11 ports
17 canais IPC
DeviceController
PairingController
migrations de device
maxClients
rename/revoke
22/22 testes unitários
documentação inicial
```

Porém, o resumo não comprova ainda os requisitos centrais da Wave 7:

```text
CA local real
certificado TLS real com SAN
HTTPS obrigatório
mTLS por dispositivo
emissão de certificado de cliente
pinning da CA
chave privada protegida por safeStorage/DPAPI
pairing single-use e resistente a replay
rate limiting
rotação
backup da identidade
integração TLS real
UI
Electron E2E
failure injection
red team
scans
validação empacotada
```

Estado correto:

```text
WAVE_7_FOUNDATION: PASS_WITH_FINDINGS
WAVE_7_SECURITY_CONTRACTS: PARTIAL
WAVE_7_DEVICE_REGISTRY: PARTIAL
WAVE_7_PAIRING_BACKEND: PARTIAL
WAVE_7_TLS_RUNTIME: NOT_PROVEN
WAVE_7_MUTUAL_AUTHENTICATION: NOT_PROVEN
WAVE_7_DEVICE_CREDENTIALS: NOT_PROVEN
WAVE_7_UI: NOT_STARTED
SPRINT_3_WAVE_7: IN_PROGRESS
WAVE_8_IMPLEMENTATION_AUTHORIZED: NO
```

Não iniciar a Wave 8.

# 2. FINDING W7-01 — PORTS NÃO PROVAM IMPLEMENTAÇÃO CRIPTOGRÁFICA

A existência de ports e schemas não comprova:

```text
geração de CA
proteção da private key
emissão de certificados
validação de SAN
mTLS
pinning
rotação
revogação criptográfica
```

Para cada port, documentar:

```text
interface
adapter concreto
storage
algoritmo
dependências
erros
testes
uso real no fluxo
```

Gate:

```text
WAVE_7_PORTS_HAVE_REAL_ADAPTERS: PASS/FAIL
```

# 3. FINDING W7-02 — `/api/pairing/**` PÚBLICO

A configuração:

```text
/api/pairing/** público
```

só é aceitável quando o endpoint permanece protegido por controles próprios.

Obrigatório:

```text
pairing session ativa
TTL curto
single-use
token CSPRNG
código manual separado
máximo de tentativas
rate limit
replay protection
correlationId
serverId binding
fingerprint binding
audit
```

O endpoint deve rejeitar:

```text
sessão ausente
sessão expirada
sessão consumida
token incorreto
token reutilizado
serverId divergente
fingerprint divergente
tentativas acima do limite
```

Gate:

```text
WAVE_7_PUBLIC_PAIRING_ENDPOINT_HARDENED: PASS/FAIL
```

# 4. FINDING W7-03 — THREAT MODEL AUSENTE NO RESUMO

Criar antes de continuar:

```text
docs/security/WAVE_7_THREAT_MODEL.md
```

Cobrir:

```text
MITM no primeiro pairing
QR/código capturado
replay
brute force
rogue server
rogue client
device cloning
credential theft
revoked device
stale session
clock skew
CA theft
backup theft
HTTP downgrade
certificate downgrade
maxClients bypass
IPC abuse
renderer compromise
```

Gate:

```text
WAVE_7_THREAT_MODEL: PASS/FAIL
```

# 5. TASK 7.1 — OBJETIVO

Implementar e provar o runtime criptográfico real:

```text
server identity
CA local
TLS leaf
HTTPS obrigatório
device keypair
CSR/proof-of-possession
client certificate
mTLS
trust store
CA pinning
secure persistence
```

# 6. SERVER IDENTITY

Criar no Server Configurator:

```text
serverId imutável
CA ECDSA P-256
TLS leaf ECDSA P-256
SHA-256 fingerprint
TLS 1.2 mínimo
TLS 1.3 preferencial
SANs explícitos
serials únicos
validade
metadados de rotação
```

Proibir:

```text
self-signed leaf sem CA controlada
CN-only
wildcard desnecessário
certificado sem SAN
rejectUnauthorized=false
NODE_TLS_REJECT_UNAUTHORIZED=0
fallback HTTP
```

Gate:

```text
WAVE_7_SERVER_IDENTITY_SECURITY: PASS/FAIL
```

# 7. PROTEÇÃO DA CA

A private key da CA deve:

```text
ficar criptografada em repouso
não entrar no repositório
não aparecer em logs
não ser passada por argumento de processo
não chegar ao renderer
ter ACL mínima
```

No Windows:

```text
KEK protegida por DPAPI/Windows Credential Manager
material criptografado montado no backend/container
```

Gate:

```text
WAVE_7_CA_KEY_PROTECTION: PASS/FAIL
```

# 8. DEVICE KEY E CREDENTIAL

No Launcher:

```text
deviceId
keypair local
CSR ou prova de posse
installationId
metadata mínima
```

A private key:

```text
nunca sai do dispositivo
safeStorage/DPAPI
vault versionado
não aparece no renderer
não aparece no IPC response
```

O servidor emite certificado exclusivo:

```text
deviceId
serverId
serialNumber
issuedAt
expiresAt
status ACTIVE
```

Gate:

```text
WAVE_7_DEVICE_CREDENTIAL_ISSUANCE: PASS/FAIL
```

# 9. mTLS E PINNING

O Launcher deve validar:

```text
cadeia até a CA pareada
fingerprint da CA
serverId
SAN
validade
revogação/estado do device
```

O backend deve exigir certificado de cliente nas APIs protegidas.

Comprovar:

```text
sem client cert → rejeitado
client cert inválido → rejeitado
client cert de outro serverId → rejeitado
device REVOKED → rejeitado
device ACTIVE → permitido
```

Gates:

```text
WAVE_7_MUTUAL_AUTHENTICATION: PASS/FAIL
WAVE_7_SERVER_TRUST_AND_PINNING: PASS/FAIL
```

# 10. MAXCLIENTS E REGISTRY

O backend deve aplicar `maxClients` antes da emissão.

Testar concorrência:

```text
duas emissões simultâneas no último slot
```

O limite deve ser transacional.

Gate:

```text
WAVE_7_MAX_CLIENTS_ENFORCEMENT: PASS/FAIL
```

# 11. REVOGAÇÃO

Ao revogar:

```text
status REVOKED
novas conexões negadas imediatamente
sessões derivadas invalidadas
evento auditado
Launcher recebe erro claro
sem fallback inseguro
```

Gate:

```text
WAVE_7_DEVICE_REVOCATION: PASS/FAIL
```

# 12. CONTRACTS E IPC

Validar schemas com:

```text
additionalProperties=false
schemaVersion
requestId
correlationId
serverId
timestamps
status
error codes
```

Os 17 canais devem possuir:

```text
allowlist
request schema
response schema
timeout
ownership
listener cleanup
product isolation
redaction
```

Proibir private key, raw command, shell e filesystem path arbitrário vindo do renderer.

Gates:

```text
WAVE_7_SECURITY_CONTRACTS: PASS/FAIL
WAVE_7_IPC_SECURITY: PASS/FAIL
```

# 13. TESTES DA TASK 7.1

## Unitários

```text
CA generation
leaf issuance
SAN validation
fingerprint
pairing TTL
single-use
rate limit
device key vault
maxClients
revocation
```

## Integração real

```text
Spring backend real
TLS real
MySQL real
CA real de teste
client certificate real
mTLS handshake
```

## Negativos

```text
MITM com CA diferente
leaf expirado
client cert expirado
client cert revogado
serverId divergente
token replay
brute force
vault adulterado
DPAPI decrypt falha
```

Gates:

```text
WAVE_7_UNIT_TESTS: PASS/FAIL
WAVE_7_TLS_INTEGRATION_TESTS: PASS/FAIL
WAVE_7_NEGATIVE_SECURITY_TESTS: PASS/FAIL
```

# 14. DOCUMENTAÇÃO

Criar ou atualizar:

```text
docs/security/WAVE_7_THREAT_MODEL.md
docs/waves/WAVE_7_ARCHITECTURE.md
docs/waves/WAVE_7_SERVER_IDENTITY.md
docs/waves/WAVE_7_PAIRING_PROTOCOL.md
docs/waves/WAVE_7_DEVICE_CREDENTIALS.md
docs/waves/WAVE_7_DEVICE_REGISTRY.md
docs/waves/WAVE_7_IPC_SECURITY.md
docs/waves/WAVE_7_TLS_INTEGRATION_EVIDENCE.md
docs/waves/WAVE_7_NEGATIVE_SECURITY_TESTS.md
releases/docs/reviews/SPRINT_3_WAVE_7_REPORT.md
```

# 15. GATES DA TASK 7.1

```text
WAVE_7_THREAT_MODEL
WAVE_7_PORTS_HAVE_REAL_ADAPTERS
WAVE_7_PUBLIC_PAIRING_ENDPOINT_HARDENED
WAVE_7_SERVER_IDENTITY_SECURITY
WAVE_7_CA_KEY_PROTECTION
WAVE_7_DEVICE_CREDENTIAL_ISSUANCE
WAVE_7_MUTUAL_AUTHENTICATION
WAVE_7_SERVER_TRUST_AND_PINNING
WAVE_7_MAX_CLIENTS_ENFORCEMENT
WAVE_7_DEVICE_REVOCATION
WAVE_7_SECURITY_CONTRACTS
WAVE_7_IPC_SECURITY
WAVE_7_UNIT_TESTS
WAVE_7_TLS_INTEGRATION_TESTS
WAVE_7_NEGATIVE_SECURITY_TESTS
TASK_7_1_SECURITY_RUNTIME
```

# 16. RESULTADO ESPERADO

```text
TASK_7_1_SECURITY_RUNTIME: PASS
TLS_RUNTIME_READY: YES
PAIRING_PROTOCOL_READY: YES
DEVICE_CREDENTIALS_READY: YES
TASK_7_2_UI_AND_DEVICE_LIFECYCLE_AUTHORIZED: PENDING_REVIEW
WAVE_8_IMPLEMENTATION_AUTHORIZED: NO
```

# 17. COMANDO PARA A IA EXECUTORA

```text
A WAVE 7 AINDA ESTÁ IN_PROGRESS.

NÃO INICIE A WAVE 8.

EXECUTE A TASK 7.1 — RUNTIME CRIPTOGRÁFICO REAL.

COMECE PELO THREAT MODEL.

PROVE QUE OS PORTS POSSUEM ADAPTERS CONCRETOS E NÃO SÃO APENAS INTERFACES
OU STUBS.

HARDEN /api/pairing/** COM TTL, SINGLE-USE, RATE LIMIT, LIMITE DE
TENTATIVAS, REPLAY PROTECTION, SERVER BINDING E AUDIT.

IMPLEMENTE CA LOCAL PROTEGIDA, CERTIFICADO TLS COM SAN, HTTPS OBRIGATÓRIO,
DEVICE KEYPAIR LOCAL, CSR/PROOF-OF-POSSESSION, CERTIFICADO DE CLIENTE,
mTLS E PINNING DA CA.

PROTEJA PRIVATE KEYS COM DPAPI/SAFE STORAGE. NENHUMA PRIVATE KEY PODE
CHEGAR AO RENDERER, IPC RESPONSE OU LOGS.

IMPLEMENTE maxClients TRANSACIONAL E REVOGAÇÃO IMEDIATA.

EXECUTE INTEGRAÇÃO TLS REAL COM SPRING, MYSQL, CA E CERTIFICADOS REAIS DE
TESTE.

EXECUTE TESTES NEGATIVOS DE MITM, REPLAY, BRUTE FORCE, CERTIFICADO
EXPIRADO/REVOGADO, SERVERID DIVERGENTE E VAULT ADULTERADO.

PARE APÓS O RELATÓRIO DA TASK 7.1.

TASK_7_2_UI_AND_DEVICE_LIFECYCLE_AUTHORIZED DEVE PERMANECER NO.

WAVE_8_IMPLEMENTATION_AUTHORIZED DEVE PERMANECER NO.
```
