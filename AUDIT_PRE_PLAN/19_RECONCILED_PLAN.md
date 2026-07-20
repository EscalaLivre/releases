# Reconciled Plan

## Classificacao das entregas

### EL-01: Senha temporaria automatica -> **SATISFIED_BY_RC11**

Ja implementado e testado no RC11:
- `TemporaryPasswordGenerator.java` (CSPRNG 16 chars)
- `PasswordResetRequiredFilter.java` (403 PASSWORD_CHANGE_REQUIRED)
- `PasswordChangePage.tsx` (tela obrigatoria)
- `OneTimeCredentials.tsx` (exibicao unica com scrub)
- E2E 16/16 PASS

**Nao incluir na sprint. Remover do backlog.**

### EL-02 a EL-06: Pendentes -> **Primeira sprint real**

Conforme plano tecnico canônico.

### EL-15: Sync cross-PC -> **SATISFIED_EARLY**

Ja implementado e parcialmente testado no QA6:
- 39 cenarios de sync testados
- 4 cenarios de portable backup testados
- Engine de 3-way merge com CAS
- Criptografia AES-256-GCM + scrypt
- `GitLabRegistryApi` implementado (provider configuravel)
- Pendente: E2E real em 2 PCs

**Nao incluir na sprint.** Acompanhar como pos-implantacao.

## Sprints reconciliadas

### Pre-requisitos (ja executados neste fechamento)

| Tarefa | Status |
|---|---|
| GitLab configurado | PASS |
| Mirrors criados | PASS |
| CI definido | PASS |
| QA6 publicado (GitLab) | PASS |
| RC11 fallback (GitLab) | PASS |
| RegistryProvider abstraido | PASS |
| GitHub publicacao | BLOCKED (incidente) |

### Sprint 1 — Foundation

| ID | Tarefa | Prioridade |
|---|---|---|
| EL-02 | Performance baseline (coletar apos instalacao) | Alta |
| EL-03 | Backup/recovery do SQLite | Alta |
| EL-04 | Datasource MySQL configravel (Flyway + driver + pool) | Alta |
| EL-06 | Server component minimo (health, version, status) | Alta |

### Sprint 2 — Server + Client

| ID | Tarefa | Prioridade |
|---|---|---|
| EL-05 | Redis cache (licencas + usuarios) | Media |
| EL-08 | Client offline queue + sync online | Alta |
| EL-09 | User profile sync | Media |

### Sprint 3 — Connect + Avancado

| ID | Tarefa | Prioridade |
|---|---|---|
| EL-10 | Conector de terceiros (API gateway) | Media |
| EL-11 | Webhook system | Baixa |
| EL-12 | Mobile (futuro) | Baixa |

## Observacoes

- Redis (EL-05) reclassificado para Sprint 2. Auditoria nao comprovou necessidade imediata.
- MySQL migration (EL-04) priorizada antes do Server component para evitar retrabalho.
- Backup/recovery (EL-03) nao estava no plano original. Incluido por seguranca.
- Cross-PC ja implementado (EL-15 = SATISFIED_EARLY). Nao repetir.
- GitHub publication permanece bloqueada — nao deve travar o inicio das sprints.
