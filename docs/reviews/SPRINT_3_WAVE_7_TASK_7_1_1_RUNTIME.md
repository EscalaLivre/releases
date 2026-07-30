# ESCALA LIVRE — REVISÃO DA TASK 7.1
## Reconciliação do runtime criptográfico antes da Task 7.2

# 1. VEREDITO

A Task 7.1 avançou corretamente e resolveu parte relevante dos findings anteriores.

Evidências informadas:

```text
Threat model com 20 cenários
CA e certificado TLS reais em testes
mTLS handshake
CA pinning
MITM negativo
certificado expirado
clock skew
CA key encryption
maxClients
private key redaction
pairing TTL de 300 segundos
single-use
rate limit
maxAttempts
binding a serverId e fingerprint
auditoria
```

Commits:

```text
server:   4cb1541
backend:  4d8365d
releases: 4519e93
```

Testes:

```text
22/22 unitários
15/15 integração TLS
37/37 informados
```

Entretanto, o relatório ainda não comprova o runtime completo exigido para declarar:

```text
TLS_RUNTIME_READY: YES
DEVICE_CREDENTIALS_READY: YES
MUTUAL_AUTHENTICATION_READY: YES
```

Classificação correta:

```text
WAVE_7_THREAT_MODEL: PASS
WAVE_7_PUBLIC_PAIRING_ENDPOINT_HARDENED: PASS_WITH_FINDINGS
WAVE_7_PORTS_HAVE_REAL_ADAPTERS: PARTIAL
WAVE_7_SERVER_IDENTITY_SECURITY: CONDITIONALLY_PASS
WAVE_7_MUTUAL_AUTHENTICATION: NOT_PROVEN_END_TO_END
WAVE_7_DEVICE_CREDENTIAL_ISSUANCE: NOT_PROVEN_END_TO_END
WAVE_7_CA_KEY_PROTECTION: NOT_PROVEN_ON_WINDOWS
WAVE_7_MAX_CLIENTS_ENFORCEMENT: CONDITIONALLY_PASS
TASK_7_1_SECURITY_RUNTIME: PASS_WITH_FINDINGS
TASK_7_2_UI_AND_DEVICE_LIFECYCLE_AUTHORIZED: NO
WAVE_8_IMPLEMENTATION_AUTHORIZED: NO
```

Não iniciar a Task 7.2 ainda.

# 2. HANDSHAKE mTLS NÃO PROVA API SPRING PROTEGIDA

O teste de handshake TLS prova criptografia de transporte, mas ainda precisa comprovar o caminho real:

```text
Launcher/client certificate
→ TLS connector
→ Spring Boot
→ extração do certificado
→ deviceId/serial
→ tabela device no MySQL
→ status ACTIVE
→ autorização da API
```

Executar com backend Spring real, MySQL real, certificado de servidor real de teste, certificado de cliente real e endpoint protegido real.

Cenários obrigatórios:

```text
sem certificado de cliente → rejeitado
certificado desconhecido → rejeitado
certificado de outro serverId → rejeitado
device ACTIVE → permitido
device REVOKED → rejeitado imediatamente
device EXPIRED → rejeitado
certificado expirado → rejeitado
```

Gate:

```text
WAVE_7_SPRING_MTLS_AUTHORIZATION: PASS/FAIL
```

# 3. EMISSÃO DE CREDENCIAL NÃO COMPROVADA END-TO-END

Comprovar:

```text
Launcher gera keypair
Launcher cria CSR/proof-of-possession
private key permanece local
backend valida CSR/proof
CA assina client certificate
certificado é ligado a deviceId/serverId
credencial é persistida
nova conexão mTLS funciona
```

Testar CSR adulterado, proof inválida, deviceId/serverId divergentes, serial único e validade.

Gate:

```text
WAVE_7_DEVICE_CREDENTIAL_ISSUANCE: PASS/FAIL
```

# 4. SAFE STORAGE/DPAPI NÃO COMPROVADO

O teste de CA key encryption não comprova Electron safeStorage/Windows DPAPI.

Executar no Windows:

```text
gerar device key
proteger com safeStorage/DPAPI
fechar processo
reabrir
descriptografar
usar em mTLS
```

Testes negativos:

```text
vault adulterado
blob copiado para outro usuário
safeStorage indisponível
decrypt falha
arquivo incompleto
```

Gate:

```text
WAVE_7_DEVICE_KEY_WINDOWS_PROTECTION: PASS/FAIL
```

# 5. PROTEÇÃO OPERACIONAL DA CA

Comprovar:

```text
CA privada criptografada em repouso
KEK fora do arquivo criptografado
ACL restrita
sem argumento de linha de comando
sem logs
sem renderer
restart funcional
backup/restore controlado
```

Gate:

```text
WAVE_7_CA_KEY_PROTECTION: PASS/FAIL
```

# 6. SINGLE-USE E MAXCLIENTS DEVEM SER ATÔMICOS

Testar concorrência:

```text
duas chamadas complete simultâneas com a mesma sessão
duas emissões simultâneas no último slot maxClients
retry após timeout
replay após sucesso
restart do backend durante sessão
```

Resultado obrigatório:

```text
somente uma emissão
nenhum dispositivo duplicado
limite nunca ultrapassado
sessão consumida atomicamente
```

Gates:

```text
WAVE_7_PAIRING_ATOMICITY: PASS/FAIL
WAVE_7_MAX_CLIENTS_TRANSACTIONAL: PASS/FAIL
```

# 7. RATE LIMIT POR IP

Testar IPv4, IPv6, X-Forwarded-For não confiável, proxy reverso, cleanup e memória limitada.

Gate:

```text
WAVE_7_PAIRING_RATE_LIMIT: PASS/FAIL
```

# 8. TASK 7.1.1 — RECONCILIAÇÃO DO RUNTIME

Executar somente:

```text
Spring mTLS real com MySQL
emissão end-to-end de certificado de dispositivo
safeStorage/DPAPI real no Windows
proteção operacional da CA
revogação aplicada na API
atomicidade de pairing
maxClients transacional
rate-limit tests
```

Não iniciar UI completa ainda.

# 9. GATES

```text
WAVE_7_SPRING_MTLS_AUTHORIZATION
WAVE_7_DEVICE_CREDENTIAL_ISSUANCE
WAVE_7_DEVICE_KEY_WINDOWS_PROTECTION
WAVE_7_CA_KEY_PROTECTION
WAVE_7_PAIRING_ATOMICITY
WAVE_7_MAX_CLIENTS_TRANSACTIONAL
WAVE_7_PAIRING_RATE_LIMIT
TASK_7_1_1_RUNTIME_RECONCILIATION
```

# 10. RESULTADO ESPERADO

```text
TASK_7_1_SECURITY_RUNTIME: PASS
TASK_7_1_1_RUNTIME_RECONCILIATION: PASS
TLS_RUNTIME_READY: YES
SPRING_MTLS_READY: YES
PAIRING_PROTOCOL_READY: YES
DEVICE_CREDENTIALS_READY: YES
DEVICE_KEY_PROTECTION_READY: YES
TASK_7_2_UI_AND_DEVICE_LIFECYCLE_AUTHORIZED: PENDING_HUMAN_REVIEW
WAVE_8_IMPLEMENTATION_AUTHORIZED: NO
```

# 11. COMANDO PARA A IA EXECUTORA

```text
NÃO INICIE A TASK 7.2 AINDA.

EXECUTE A TASK 7.1.1.

O HANDSHAKE TLS ISOLADO NÃO SUBSTITUI AUTORIZAÇÃO mTLS NO BACKEND SPRING.

SUBA SPRING BOOT E MYSQL REAIS. EXIJA CLIENT CERT NAS APIS PROTEGIDAS E
MAPEIE CERTIFICADO PARA device ACTIVE NO REGISTRY.

IMPLEMENTE E PROVE O FLUXO END-TO-END:

DEVICE KEYPAIR LOCAL
→ CSR/PROOF-OF-POSSESSION
→ EMISSÃO DE CLIENT CERT
→ SAFE STORAGE/DPAPI
→ CONEXÃO mTLS
→ REVOGAÇÃO IMEDIATA.

PROVE QUE PRIVATE KEYS NÃO ENTRAM EM RENDERER, IPC, LOGS OU REQUESTS.

TESTE CONCORRÊNCIA: DUAS CONCLUSÕES DA MESMA SESSÃO E DUAS EMISSÕES NO
ÚLTIMO SLOT maxClients. SOMENTE UMA PODE PASSAR.

PROVE PROTEÇÃO OPERACIONAL DA CA, INCLUINDO ACL, RESTART E BACKUP/RESTORE.

TESTE RATE LIMIT SEM CONFIAR EM X-FORWARDED-FOR ARBITRÁRIO.

PARE APÓS O RELATÓRIO DA TASK 7.1.1.

TASK_7_2_UI_AND_DEVICE_LIFECYCLE_AUTHORIZED DEVE PERMANECER NO.

WAVE_8_IMPLEMENTATION_AUTHORIZED DEVE PERMANECER NO.
```
