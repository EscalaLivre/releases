# SPRINT 1 POST-REVIEW REPORT

## Commit

- local: `56983e7c9ca3b7dd3eb9f7b35cd2a8aa70053347`
- GitHub: `56983e7c9ca3b7dd3eb9f7b35cd2a8aa70053347`
- GitLab: `56983e7c9ca3b7dd3eb9f7b35cd2a8aa70053347`
- working tree: LIMPO
- branch: main

## Inventario (corrigido apos revisao)

| Metrica | Reportado original | Real apos auditoria |
|---|---|---|
| Endpoints REST | 48 | **68** (15 controllers) |
| Canais IPC (desktop) | 27 | **27** (25 handle + 2 push) |
| Canais IPC (manager) | 38 | **45** |
| IPC total | 65 | **72** |
| Tabelas SQLite (backend) | 15 | **18** |
| Tabelas SQLite (manager) | 8 | **8** |
| Tabelas total | 23 | **26** |
| Repositorios | 11 | **11** (6 on-disk, 5 remote only) |
| SHAs consistentes | SIM | SIM (local=GitHub=GitLab em todos) |

## ADRs

| ADR | Status | Titulo |
|---|---|---|
| ADR-001 | PASS | Architecture Overview (4-tier, 11 repos, dual-remote) |
| ADR-002 | PASS | License File Format (JWS RS256 compact) |
| ADR-003 | PASS | Communication Protocol (REST localhost:8087, 3-layer auth) |
| ADR-004 | PASS | Database Engine (SQLite + Flyway per component) |
| ADR-005 | PASS | Authentication and Authorization (JWT + GitHub Device Flow + Bridge) |
| ADR-006 | PASS | Registry Sync (CAS encrypted snapshot, scrypt + AES-256-GCM) |
| ADR-007 | PASS | Desktop IPC Architecture (contextBridge, 27 channels) |
| ADR-008 | PASS | Frontend Tech Stack (React 19 + Vite 6 + Tailwind 4) |
| ADR-009 | PASS | Activation Manager (Electron + SQLite + 45 IPC channels) |
| ADR-010 | PASS | GitLab CI e Registry como fallback |
| ADR-011 | PASS | Estrategia de mirror GitHub/GitLab |
| ADR-012 | CRIADO | Estrategia de transicao SQLite para MySQL |
| ADR-013 | CRIADO | Uso condicional de Redis |

## Contracts

### Contratos futuros (server/connect/mobile)

| Contrato | Classificacao | Evidencia |
|---|---|---|
| GET /api/system/health | MISSING | Backend tem /api/health (path diferente) |
| GET /api/system/version | MISSING | Nao existe |
| GET /api/system/compatibility | MISSING | Nao existe |
| POST /api/auth/login | DEFINED_FOR_FUTURE | Backend implementa, OpenAPI NAO documenta |
| POST /api/auth/refresh | MISSING | Nao existe (JWT 60min sem refresh) |
| POST /api/auth/logout | DEFINED_FOR_FUTURE | Backend implementa, OpenAPI NAO documenta |
| POST /api/pairing/start | MISSING | Nao existe — sera implementado no repo connect |
| POST /api/pairing/complete | MISSING | Nao existe |
| POST /api/devices/revoke | MISSING | Nao existe |
| GET /api/license/status | MISSING | Backend tem /api/activation/status |
| GET /api/backup/status | MISSING | Backend tem GET /api/backups (lista, sem status) |

### Cross-cutting contracts

| Contrato | Status |
|---|---|
| correlationId header | MISSING |
| Idempotency-Key header | MISSING |
| Optimistic versioning (ETag/If-Match) | MISSING |
| Event envelope | MISSING |
| Institution identity | MISSING |
| Server identity | MISSING |
| Device identity | MISSING (apenas installationId) |
| Versioned error responses | PARTIAL (ErrorResponse sem version) |

### Duplicacoes de tipos

| Tipo | Decisao |
|---|---|
| ActivationState, LicensePayload | Manter duplicacao temporaria ate Sprint 3 |
| TechnicalActivationStatus vs ActivationStatus | Renomear no contracts |
| ClientAdminOneTimeCredentials | Unificar no contracts |
| TechnicalBackupResponse, TechnicalSupportExportResult | Adicionar ao contracts |
| ActivationManagerApi (manager) | Extrair tipos compartilhados para contracts |

## Tests

| Teste | Resultado |
|---|---|
| contracts typecheck | PASS |
| contracts npm test (6 suites) | PASS |
| schema validation (AJV 2020-12) | PASS |
| OpenAPI validation (13 endpoints, 15 schemas) | PASS |
| backwards compatibility | NAO TESTADO (nao ha testes de compatibilidade) |
| secret scan | PASS (nenhum segredo real encontrado) |

## Gate

```
BASELINE_AND_CONTRACTS_READY: PASS
```

## Proxima sprint

```
SPRINT 2 — EL-04: COMPATIBILIDADE MYSQL
```

- Redis iniciado: **NAO** (ADR-013 condiciona a REDIS_REQUIRED_NOW)
- Server iniciado: **NAO**
- MySQL autorizado: **SIM** (via ADR-012)
- Seguranca e performance: gates internos da sprint, nao o objetivo
