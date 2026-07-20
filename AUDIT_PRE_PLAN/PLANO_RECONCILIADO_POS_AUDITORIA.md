# ESCALA LIVRE — PLANO RECONCILIADO PÓS-AUDITORIA E PRÓXIMAS SPRINTS

> Documento mestre atualizado após o fechamento pré-plano.
>
> Gate confirmado:
>
> ```text
> ESCALA_LIVRE_PLAN_UNCONDITIONALLY_READY
> ```
>
> Este documento substitui a ordem antiga que ainda tratava `EL-01` e `EL-15` como pendentes.

---

# 1. ESTADO CONFIRMADO

## 1.1 Infraestrutura

Foram criados 10 projetos privados no GitLab:

```text
gitlab.com/jf.aschenbrenner/
├── frontend
├── backend
├── desktop
├── contracts
├── activation-manager
├── activation-issuer
├── activation-registry
├── server
├── connect
└── mobile
```

Os repositórios existentes possuem:

```text
origin  → GitHub
gitlab  → GitLab
```

Foi executado:

```text
push --all
push --tags
```

Os SHAs foram confirmados entre:

```text
workspace local
GitHub
GitLab
```

## 1.2 CI/CD

Existem pipelines GitLab para:

```text
contracts
backend
frontend
desktop
activation-manager
```

Stages previstos:

```text
install
typecheck
test
build
secret-scan
```

## 1.3 Releases e continuidade

### Activation Manager QA6

```text
tag: v0.1.0-qa6
canal: GitLab privado
installer: publicado
blockmap: publicado
SHA256SUMS: publicado
```

### Escala Livre RC11

```text
tag: v1.0.0-rc11
canal de fallback: GitLab Generic Package
installer: publicado
blockmap: publicado
latest.yml: publicado
release-lock: publicado
```

O GitLab é o fallback operacional enquanto o GitHub estiver degradado.

O canal público oficial do Client continuará sendo o GitHub até o updater suportar fallback formal e testado.

## 1.4 Activation Manager

Implementado:

```text
GitLabRegistryApi
RegistryProvider selecionável
GitHub provider
GitLab provider
sync criptografado
```

Seleção atual:

```text
ACTIVATION_MANAGER_REGISTRY_PROVIDER=github
```

ou:

```text
ACTIVATION_MANAGER_REGISTRY_PROVIDER=gitlab
```

Resultados informados:

```text
typecheck: PASS
testes: 120/120 PASS
```

## 1.5 Sprints já atendidas

```text
EL-01 = SATISFIED_BY_RC11
EL-15 = SATISFIED_EARLY
```

Portanto:

- não reimplementar senha temporária automática;
- não reconstruir o sync cross-PC do zero;
- manter somente testes de regressão e evolução dos providers.

---

# 2. RECOMENDAÇÕES OBRIGATÓRIAS ANTES DA PRIMEIRA SPRINT

Essas recomendações não bloqueiam o início, mas devem ser incorporadas à primeira sprint.

## 2.1 Congelar o fechamento pré-plano

Criar um commit documental no repositório responsável pelo workspace contendo:

```text
AUDIT_PRE_PLAN/
plano reconciliado
SHAs confirmados
URLs GitHub/GitLab
hashes RC11/QA6
gate incondicional
```

Criar tag interna:

```text
pre-server-baseline-2026-07
```

A tag deve apontar para o commit documental correto.

Não usar a tag para release pública.

## 2.2 Não usar mirror circular

Proibido:

```text
GitHub → GitLab automático
+
GitLab → GitHub automático
```

Isso pode criar loops, divergências e alterações duplicadas.

Política recomendada durante a transição:

```text
GitHub = origin histórico e releases públicas
GitLab = CI, Registry, artifacts e fallback
push explícito para ambos
```

Depois de duas sprints estáveis, produzir ADR para decidir se o GitLab passa a ser o remoto primário dos repositórios privados.

## 2.3 Proteger branches nos dois provedores

Aplicar em `main`:

```text
sem force push
sem delete
merge request/pull request obrigatório
pipeline obrigatório
secret scan obrigatório
aprovação independente
```

Durante execução automatizada por agentes, commits diretos só podem ocorrer quando a política atual do projeto autorizar explicitamente.

## 2.4 Tags imutáveis

Nunca:

```text
mover tag
reutilizar tag
substituir asset publicado silenciosamente
```

Quando um artefato precisar mudar:

```text
nova versão
nova tag
novo hash
```

## 2.5 GitLab não substitui silenciosamente o updater

O RC11 no GitLab é fallback de distribuição e QA.

O updater público não deve trocar de origem sem:

- contrato de provider;
- manifesto versionado;
- testes de fallback;
- hash;
- assinatura;
- proteção contra downgrade;
- telemetria sanitizada.

## 2.6 RegistryProvider deve permanecer abstrato

Proibido espalhar condicionais:

```text
if github
if gitlab
```

por toda a aplicação.

Usar contrato único:

```text
RegistryProvider
├── GitHubRegistryApi
└── GitLabRegistryApi
```

Cobrir por testes contratuais compartilhados.

## 2.7 Segredos e vault

Nunca enviar para GitHub ou GitLab:

```text
private key RSA
.elamvault
blob DPAPI
senha mestra
token de provider
SQLite real
JWS real completo
```

Os snapshots do registry devem continuar criptografados antes de qualquer upload.

---

# 3. ORDEM RECONCILIADA DAS SPRINTS

A ordem antiga:

```text
EL-01 → EL-02 → EL-03 → EL-04 → EL-05 → EL-06
```

foi substituída porque:

```text
EL-01 já foi concluída
EL-15 já foi antecipada
Redis não deve entrar sem necessidade comprovada
EL-06 não deve absorver o Manager completo
```

Nova ordem:

```text
SPRINT 1  — EL-02 + EL-03: baseline, ADRs e contratos
SPRINT 2  — EL-04: compatibilidade MySQL
SPRINT 3  — EL-06A: Server mínimo
SPRINT 4  — EL-08: Client Windows desacoplado
SPRINT 5  — EL-09: Connect local e pareamento
SPRINT 6  — EL-11 + decisão EL-05: multiusuário, eventos e Redis
SPRINT 7  — EL-10: Server Manager
SPRINT 8  — EL-14: licença vinculada ao Server
SPRINT 9  — EL-07: backup e restauração completos
SPRINT 10 — EL-12: Relay remoto
SPRINT 11 — EL-13: resiliência e caos
SPRINT 12 — EL-16: atualização privada do Server
SPRINT 13 — EL-17: atualização pública do Client
SPRINT 14 — EL-18: implantação de referência Santa Casa
SPRINT 15 — EL-19: hardening de produção
SPRINT 16 — EL-20: Android RC1
SPRINT 17 — EL-21: segundo cliente sem fork
```

---

# 4. SPRINT 1 — BASELINE, ADRs E CONTRATOS

## Referências

```text
EL-02
EL-03
```

## Objetivo

Congelar formalmente o produto atual e definir as fronteiras da arquitetura Server + Client + Connect antes de alterar banco, desktop ou infraestrutura.

## Entregas

### 4.1 Baseline

Registrar:

```text
SHAs locais
SHAs GitHub
SHAs GitLab
tags
release-lock
RC11
QA6
hashes
testes
builds
E2E
performance
schema SQLite
migrations
endpoints
IPC
```

Criar:

```text
BASELINE/
├── repositories.json
├── releases.json
├── schema/
├── api/
├── ipc/
├── performance/
├── security/
└── BASELINE_REPORT.md
```

### 4.2 ADRs

Criar:

```text
ADR-001 — servidor local por instituição
ADR-002 — MySQL 8 como banco operacional
ADR-003 — Client sem backend local
ADR-004 — acesso local e remoto pelo Connect
ADR-005 — Relay sem dados operacionais
ADR-006 — sem Migrator dedicado
ADR-007 — identidade e pareamento de dispositivo
ADR-008 — compatibilidade de versões
ADR-009 — licença vinculada ao Server
ADR-010 — GitLab CI/Registry e GitHub releases públicas
ADR-011 — provider de registry GitHub/GitLab
ADR-012 — estratégia de transição SQLite → MySQL
ADR-013 — uso condicional de Redis
```

### 4.3 Contratos

Definir no repositório `contracts`:

```text
GET  /api/system/health
GET  /api/system/version
GET  /api/system/compatibility
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/pairing/start
POST /api/pairing/complete
POST /api/devices/revoke
GET  /api/license/status
GET  /api/backup/status
```

Definir também:

```text
erros versionados
correlationId
Idempotency-Key
optimistic version
event envelope
device identity
institution identity
server identity
```

## Testes

- contract tests;
- OpenAPI validation;
- backwards compatibility;
- GitHub/GitLab CI;
- secret scan;
- diff check.

## Gate

```text
BASELINE_AND_CONTRACTS_READY
```

## Stop point

Não iniciar MySQL antes do gate.

---

# 5. SPRINT 2 — COMPATIBILIDADE MYSQL

## Referência

```text
EL-04
```

## Objetivo

Executar uma transição segura de SQLite para MySQL 8 sem destruir o modo atual.

## Estratégia

```text
SQLite preservado
+
profile MySQL novo
+
Testcontainers MySQL
+
Flyway específico
```

## Entregas

- driver MySQL;
- profile `mysql`;
- profile `sqlite-legacy`;
- datasource por configuração;
- migrations compatíveis;
- `utf8mb4`;
- collation definida;
- timestamps UTC;
- HikariCP;
- constraints;
- índices;
- testes de importação/exportação;
- testes de autenticação;
- testes de ativação;
- testes da senha temporária;
- relatório de incompatibilidades.

## Pontos a auditar

```text
AUTOINCREMENT
BOOLEAN
DATETIME
JSON
BLOB
UPSERT
case sensitivity
native queries
pagination
foreign keys
```

## Proibições

- não remover SQLite;
- não converter o banco real automaticamente;
- não modificar release RC11;
- não executar migration destrutiva.

## Gate

```text
MYSQL_COMPATIBILITY_PROVEN
```

---

# 6. SPRINT 3 — SERVER MÍNIMO

## Referência

```text
EL-06A
```

## Objetivo

Criar a primeira stack local institucional sem Connect, Relay ou Manager completo.

## Repositório

```text
EscalaLivre/server
```

O repositório já existe no GitHub/GitLab e deve ser inicializado nesta sprint.

## Containers iniciais

```text
escalalivre-proxy
escalalivre-core
escalalivre-mysql
escalalivre-backup
```

Não incluir ainda:

```text
Relay
Mobile
Manager completo
Redis sem decisão
```

## Entregas

```text
server/
├── compose/
├── proxy/
├── backup/
├── scripts/
├── config/
├── docs/
├── tests/
└── docker-compose.yml
```

Também:

- volumes nomeados;
- rede de dados interna;
- MySQL sem porta pública;
- Core sem porta pública;
- Proxy como entrada única;
- secret files;
- healthchecks;
- bootstrap PowerShell;
- uninstall preservando volumes;
- backup manual;
- restore isolado;
- logs com rotação;
- smoke test.

## Gate

```text
ESCALA_LIVRE_SERVER_MINIMAL_RC1
```

---

# 7. SPRINT 4 — CLIENT WINDOWS DESACOPLADO

## Referência

```text
EL-08
```

## Objetivo

Separar o aplicativo desktop do backend e banco locais.

## Entregas

Adicionar modo:

```text
SERVER_CLIENT
```

Fluxo:

```text
abrir Client
→ conectar a uma instituição
→ informar endpoint de QA
→ testar conexão
→ login
→ usar dados do Server
```

Remover do novo modo:

```text
spawn do JAR
SQLite operacional
Flyway local
backend embutido
```

Manter temporariamente:

```text
LEGACY_LOCAL_MODE
```

apenas para regressão e recuperação.

## Testes

- Client → Proxy → Core → MySQL;
- Server offline;
- reconexão;
- timeout;
- login;
- logout;
- compatibilidade;
- atualização obrigatória;
- ausência de banco operacional no pacote Client.

## Gate

```text
WINDOWS_CLIENT_SERVER_MODE_READY
```

---

# 8. SPRINT 5 — CONNECT LOCAL E PAREAMENTO

## Referência

```text
EL-09
```

## Objetivo

Substituir o endpoint informado manualmente por uma conexão local segura e pareada.

## Repositório

```text
EscalaLivre/connect
```

## Entregas

- protocolo versionado;
- Connect Agent;
- SDK do Client;
- mTLS;
- fingerprint do Server;
- identidade da instituição;
- identidade por dispositivo;
- código de uso único;
- QR Code;
- expiração;
- emissão de certificado;
- armazenamento seguro;
- revogação;
- renovação;
- descoberta LAN mínima;
- fallback manual.

## Gate

```text
LOCAL_CONNECT_AND_PAIRING_READY
```

---

# 9. SPRINT 6 — MULTIUSUÁRIO E DECISÃO REDIS

## Referências

```text
EL-11
EL-05
```

## Objetivo

Garantir que dois ou mais Clients operem simultaneamente sem duplicação ou sobrescrita silenciosa.

## Entregas

- optimistic locking;
- campo `version`;
- `409 CONFLICT`;
- Idempotency-Key;
- Outbox Pattern;
- SSE ou WebSocket;
- auditoria por usuário e dispositivo;
- atualização reativa das telas;
- testes concorrentes.

## Decisão Redis

Redis entra nesta sprint somente se necessário para:

```text
sessões distribuídas
revogação
pareamento
rate limit compartilhado
event fan-out
locks temporários
```

Resultado obrigatório:

```text
REDIS_REQUIRED_NOW
```

ou:

```text
REDIS_DEFERRED
```

Se aprovado, adicionar:

```text
escalalivre-redis
```

sem torná-lo fonte oficial de dados.

## Gate

```text
MULTI_USER_DATA_CONSISTENCY_READY
```

---

# 10. SPRINT 7 — SERVER MANAGER

## Referência

```text
EL-10
```

## Objetivo

Criar o painel técnico da stack já funcional.

## Entregas

- GitHub Device Flow;
- numeric GitHub user ID;
- fallback técnico GitLab sem transformar GitLab em login de funcionários;
- status dos containers;
- versão;
- schema;
- disco;
- MySQL;
- Redis, quando existir;
- Agent;
- backups;
- restore;
- dispositivos;
- pareamento;
- revogação;
- logs sanitizados;
- diagnóstico;
- pacote de suporte;
- update controlado.

## Segurança

O Manager não pode:

- ficar público;
- expor Docker Socket diretamente;
- mostrar secrets;
- mostrar private keys;
- transportar dados operacionais pelo Relay.

## Gate

```text
SERVER_MANAGER_RC1
```

---

# 11. SPRINT 8 — LICENÇA NO SERVER

## Referência

```text
EL-14
```

## Modelo

```text
1 instituição
→ 1 Server Installation ID
→ 1 licença institucional
→ vários Clients e dispositivos
```

## Entregas

- Installation ID do Server;
- licença persistida no Server;
- plano;
- validade;
- limite de usuários;
- limite de dispositivos;
- features;
- Clients consultam status por API;
- renovação sem reconfigurar Clients;
- compatibilidade com Activation Manager atual;
- migração controlada do modelo desktop.

## Gate

```text
SERVER_LICENSE_MODEL_READY
```

---

# 12. SPRINT 9 — BACKUP E RESTORE COMPLETOS

## Referência

```text
EL-07
```

## Entregas

- backup diário;
- backup manual;
- backup pré-update;
- compressão;
- criptografia;
- SHA-256;
- retenção;
- cópia externa;
- restore isolado;
- validação de schema;
- validação de contagens;
- alerta de backup vencido.

Política inicial:

```text
diários: 14
semanais: 8
mensais: 12
```

## Gate

```text
BACKUP_RESTORE_VERIFIED
```

---

# 13. SPRINT 10 — RELAY REMOTO

## Referência

```text
EL-12
```

## Objetivo

Permitir acesso externo sem abrir banco, Redis ou Core diretamente.

## Fluxo

```text
Client externo
→ Relay
→ Agent
→ Proxy
→ Core
→ MySQL
```

## Entregas

- Relay Docker;
- TLS;
- canal persistente;
- roteamento por instituição;
- autenticação do Agent;
- autenticação do Client;
- heartbeat;
- timeout;
- backoff;
- jitter;
- rate limit;
- métricas;
- revogação;
- logs sem dados operacionais.

## Gate

```text
REMOTE_CONNECT_MVP_READY
```

---

# 14. SPRINT 11 — RESILIÊNCIA

## Referência

```text
EL-13
```

## Testes

- internet da instituição cai;
- internet do Client cai;
- Relay reinicia;
- Agent reinicia;
- Proxy reinicia;
- Core reinicia;
- Redis cai;
- MySQL cai;
- Wi-Fi muda para 4G;
- resposta de escrita se perde;
- certificado expira;
- dispositivo é revogado;
- disco enche.

## Entregas

- circuit breaker;
- retry budget;
- idempotência validada;
- reconexão;
- graceful degradation;
- alertas;
- chaos report.

## Gate

```text
CONNECT_RESILIENCE_READY
```

---

# 15. SPRINT 12 — UPDATE PRIVADO DO SERVER

## Referência

```text
EL-16
```

## Infraestrutura

Usar:

```text
GitLab Container Registry
```

Fluxo:

```text
Manager detecta versão
→ cria backup
→ baixa imagem por digest
→ verifica assinatura/hash
→ atualiza
→ Flyway
→ healthcheck
→ smoke test
→ rollback
```

Nunca usar `latest`.

## Gate

```text
SERVER_UPDATE_PLATFORM_READY
```

---

# 16. SPRINT 13 — UPDATE PÚBLICO DO CLIENT

## Referência

```text
EL-17
```

## Recomendação de resiliência

Criar manifesto com:

```text
primary provider
fallback provider
SHA-256
signature
minimumBackendVersion
mandatory
```

GitHub permanece canal público principal.

GitLab pode ser fallback após teste formal.

## Gate

```text
CLIENT_UPDATE_PLATFORM_READY
```

---

# 17. SPRINT 14 — IMPLANTAÇÃO SANTA CASA

## Referência

```text
EL-18
```

## Fluxo

```text
preparar servidor
→ instalar Docker
→ instalar Server
→ aplicar licença
→ criar administrador
→ importar planilha
→ validar dados
→ backup
→ restore test
→ instalar Clients
→ parear
→ testar LAN
→ testar Relay
→ revogar dispositivo
→ UAT
```

## Gate

```text
SANTA_CASA_SERVER_CLIENT_ACCEPTED
```

---

# 18. SPRINT 15 — HARDENING

## Referência

```text
EL-19
```

Entregas:

- BitLocker;
- firewall;
- usuário administrativo separado;
- MySQL e Redis não expostos;
- sem SMB para banco;
- rotação de certificados;
- rate limit;
- backup externo;
- nobreak;
- monitoramento;
- runbooks;
- restore drill.

Gate:

```text
SANTA_CASA_PRODUCTION_READY
```

---

# 19. SPRINT 16 — ANDROID

## Referência

```text
EL-20
```

Escopo inicial:

- QR;
- pareamento;
- login;
- biometria local;
- consulta de escalas;
- notificações;
- logout;
- revogação;
- sem banco institucional no celular.

Gate:

```text
ANDROID_CLIENT_RC1
```

---

# 20. SPRINT 17 — SEGUNDO CLIENTE

## Referência

```text
EL-21
```

Objetivo:

```text
nova instituição
+
nova stack
+
novo banco
+
mesmo produto
+
sem fork
```

Gate:

```text
SECOND_CLIENT_WITHOUT_PRODUCT_FORK
```

---

# 21. REGRAS DE EXECUÇÃO MULTIAGENTE

Cada sprint deve ter agentes separados para:

```text
arquitetura
implementação
testes
segurança
infraestrutura
documentação
auditoria de gate
```

Nenhum agente aprova sozinho o próprio trabalho.

Obrigatório:

- TDD-first;
- Testcontainers;
- unitários;
- integração;
- E2E;
- Gitleaks;
- dependency scan;
- `git diff --check`;
- staging seletivo;
- nunca `git add .`;
- commits pequenos;
- push GitHub e GitLab;
- relatório;
- stop point.

---

# 22. CONTINUIDADE GITHUB/GITLAB

Se GitHub estiver operacional:

```text
push GitHub
push GitLab
CI GitLab
release pública GitHub
```

Se GitHub estiver degradado:

```text
push GitLab
CI GitLab
artifacts GitLab
release privada/fallback GitLab
preservar release pública para publicação posterior
```

O incidente do GitHub não deve bloquear desenvolvimento privado, testes ou Container Registry.

Ele pode bloquear somente a conclusão do canal público quando o updater ainda depender exclusivamente do GitHub.

---

# 23. PRIMEIRA AUTORIZAÇÃO DE EXECUÇÃO

O próximo comando operacional deve ser:

```text
Inicie a Sprint 1 reconciliada — EL-02 + EL-03
```

A Sprint 1 deve parar no gate:

```text
BASELINE_AND_CONTRACTS_READY
```

Não iniciar MySQL na mesma execução sem nova autorização.

---

# 24. SAÍDA OBRIGATÓRIA DA SPRINT 1

Criar:

```text
SPRINT_01_RECONCILED/
├── BASELINE_REPORT.md
├── REPOSITORY_SHA_MATRIX.md
├── RELEASE_BASELINE.md
├── SQLITE_SCHEMA_INVENTORY.md
├── API_INVENTORY.md
├── IPC_INVENTORY.md
├── PERFORMANCE_BASELINE.md
├── ADR_INDEX.md
├── CONTRACT_COMPATIBILITY_REPORT.md
├── SECURITY_REPORT.md
└── FINAL_GATE.md
```

Relatório final:

```text
SPRINT 1 — BASELINE + CONTRACTS REPORT

Baseline:
GitHub:
GitLab:
RC11:
QA6:
SQLite:
API:
IPC:
ADRs:
Contracts:
Tests:
Security:
Blockers:

Gate:
BASELINE_AND_CONTRACTS_READY
```

---

# 25. DECISÃO FINAL

Estado atual:

```text
infraestrutura GitLab: READY
continuidade de repositórios: READY
CI/CD: READY
RC11 fallback: READY
QA6 privada: READY
Activation Manager providers: READY
EL-01: SATISFIED
EL-15: SATISFIED
plano: RECONCILED
```

Autorização técnica:

```text
ESCALA_LIVRE_FIRST_REAL_SPRINT_AUTHORIZED
```

Primeira sprint:

```text
EL-02 + EL-03
```
