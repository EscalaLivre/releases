# CONTRACT COMPATIBILITY REPORT

**Generated:** Sprint 01 — Baseline Snapshot  
**Purpose:** Analyze type/schema contract alignment across all services.

---

## Canonical Sources

| # | Source | Location | Types | Schemas | Endpoints |
|---|--------|----------|-------|---------|-----------|
| 1 | `@escalalivre/contracts` — `src/index.ts` | contracts repo | 15 types | — | — |
| 2 | `schemas/license.schema.json` | contracts repo | — | 1 JSON Schema | — |
| 3 | `openapi/technical-api.yaml` | contracts repo | 15 schemas | — | 13 endpoints |

---

## Type Inventory — `contracts/src/index.ts`

| # | Type Name | Kind | Used By |
|---|-----------|------|---------|
| 1 | `UserAccount` | Interface | backend, frontend (partial) |
| 2 | `Department` | Interface | backend, frontend (partial) |
| 3 | `Employee` | Interface | backend, frontend (partial) |
| 4 | `ScheduleCode` | Interface | backend, frontend (partial) |
| 5 | `ScheduleMonth` | Interface | backend, frontend (partial) |
| 6 | `ScheduleAssignment` | Interface | backend, frontend (partial) |
| 7 | `Activation` | Interface | backend, activation-manager (own copy) |
| 8 | `License` | Interface | backend, activation-manager (own copy) |
| 9 | `AuditEvent` | Interface | backend, activation-manager (own copy) |
| 10 | `BackupHistory` | Interface | backend |
| 11 | `AdminSecurity` | Interface | backend |
| 12 | `GitHubSession` | Interface | backend, desktop (no types) |
| 13 | `GitHubConfig` | Interface | backend, desktop (no types) |
| 14 | `AppMeta` | Interface | backend, frontend (partial) |
| 15 | `InstallationIdStore` | Interface | backend, activation-manager (own copy) |

---

## Schema Inventory — `openapi/technical-api.yaml`

| # | Schema Name | Corresponding Type | Notes |
|---|-------------|-------------------|-------|
| 1 | `SystemStatus` | — | Technical admin only |
| 2 | `HealthStatus` | — | Technical admin only |
| 3 | `SystemMetrics` | — | Technical admin only |
| 4 | `RuntimeConfig` | — | Technical admin only |
| 5 | `LogEntry` | — | Technical admin only |
| 6 | `CleanupResult` | — | Technical admin only |
| 7 | `AuditEntry` | `AuditEvent` | Maps to backend audit_event |
| 8 | `GitHubRepo` | — | GitHub integration |
| 9 | `GitHubBranch` | — | GitHub integration |
| 10 | `GitHubCommit` | — | GitHub integration |
| 11 | `GitHubSession` | `GitHubSession` | Maps to backend admin_github_sessions |
| 12 | `AuthResult` | — | Auth flow |
| 13 | `UpdateInfo` | — | App update |
| 14 | `ScheduleUpdateEvent` | — | Event channel |
| 15 | `ActivationChangeEvent` | — | Event channel |

**OpenAPI Admin Endpoints (13):**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/technical/status` | System status |
| GET | `/api/technical/health` | Health check |
| GET | `/api/technical/metrics` | System metrics |
| POST | `/api/technical/restart` | Restart service |
| GET | `/api/technical/logs` | Retrieve logs |
| POST | `/api/technical/cleanup` | Cleanup tasks |
| GET | `/api/technical/config` | Get config |
| PUT | `/api/technical/config` | Update config |
| GET | `/api/admin/github/config` | GitHub config |
| PUT | `/api/admin/github/config` | Update GitHub config |
| POST | `/api/admin/github/session` | Create session |
| DELETE | `/api/admin/github/session` | Invalidate session |
| GET | `/api/technical/status` | Status (duplicate) |

---

## Type Duplication Analysis

### Problem: Three Independent Type Definitions

```
┌─────────────────────────────────────────────────────────────┐
│                    @escalalivre/contracts                    │
│                    src/index.ts (15 types)                   │
└──────────────┬──────────────────────┬───────────────────────┘
               │                      │
               │  ❌ NOT IMPORTED     │  ❌ NOT IMPORTED
               │                      │
    ┌──────────▼──────────┐  ┌────────▼──────────────┐
    │      frontend       │  │  activation-manager   │
    │   desktop.ts (own)  │  │   contracts.ts (own)  │
    │   ~15 duplicate     │  │   ~10 duplicate       │
    └─────────────────────┘  └───────────────────────┘
```

### Duplication Matrix

| Type | contracts | frontend/desktop.ts | manager/contracts.ts | desktop (JS) |
|------|-----------|---------------------|----------------------|--------------|
| `UserAccount` | ✅ | ⚠️ Duplicate | ❌ | ❌ |
| `Department` | ✅ | ⚠️ Duplicate | ❌ | ❌ |
| `Employee` | ✅ | ⚠️ Duplicate | ❌ | ❌ |
| `ScheduleCode` | ✅ | ⚠️ Duplicate | ❌ | ❌ |
| `ScheduleMonth` | ✅ | ⚠️ Duplicate | ❌ | ❌ |
| `ScheduleAssignment` | ✅ | ⚠️ Duplicate | ❌ | ❌ |
| `Activation` | ✅ | ❌ | ⚠️ Duplicate | ❌ |
| `License` | ✅ | ❌ | ⚠️ Duplicate | ❌ |
| `AuditEvent` | ✅ | ❌ | ⚠️ Duplicate | ❌ |
| `InstallationIdStore` | ✅ | ❌ | ⚠️ Duplicate | ❌ |
| `BackupHistory` | ✅ | ❌ | ❌ | ❌ |
| `AdminSecurity` | ✅ | ❌ | ❌ | ❌ |
| `GitHubSession` | ✅ | ❌ | ❌ | ❌ |
| `GitHubConfig` | ✅ | ❌ | ❌ | ❌ |
| `AppMeta` | ✅ | ⚠️ Duplicate | ❌ | ❌ |

**Legend:** ✅ Canonical source | ⚠️ Duplicate definition | ❌ Not defined

---

## Service-by-Service Analysis

### contracts (`@escalalivre/contracts`)

| Aspect | Status |
|--------|--------|
| Package name | `@escalalivre/contracts` |
| Exported types | 15 interfaces |
| JSON Schema | `schemas/license.schema.json` |
| OpenAPI | `openapi/technical-api.yaml` (13 admin endpoints, 15 schemas) |
| Published to npm | No (local workspace reference) |
| Used by frontend | ❌ No — frontend duplicates types |
| Used by manager | ❌ No — manager defines own types |
| Used by desktop | ❌ No — plain JS, no type system |

### frontend

| Aspect | Status |
|--------|--------|
| Type file | `src/types/desktop.ts` |
| Imports `@escalalivre/contracts` | ❌ No |
| Duplicate types | ~6 core types duplicated |
| Risk | Drift between contracts and frontend |
| Recommendation | Import from `@escalalivre/contracts` or create workspace dependency |

### activation-manager

| Aspect | Status |
|--------|--------|
| Type file | `src/types/contracts.ts` |
| Imports `@escalalivre/contracts` | ❌ No |
| Duplicate types | ~4 types duplicated (Activation, License, AuditEvent, InstallationIdStore) |
| API methods | `ActivationManagerApi` has 30+ methods |
| Risk | Drift between contracts and manager |
| Recommendation | Import from `@escalalivre/contracts` or create workspace dependency |

### desktop

| Aspect | Status |
|--------|--------|
| Language | Plain JavaScript (no TypeScript) |
| Type definitions | ❌ None |
| Uses contracts | ❌ No |
| Risk | No type safety at all |
| Recommendation | Migrate to TypeScript or add JSDoc types from contracts |

### backend

| Aspect | Status |
|--------|--------|
| Language | Java (mirrors types via JPA entities) |
| Imports contracts | ❌ No (Java can't import TS types) |
| Alignment | Manual — entities mirror TS interfaces |
| Risk | Drift if contracts change without backend update |
| Recommendation | Use OpenAPI codegen for Java DTOs from `technical-api.yaml` |

---

## OpenAPI Coverage

| Endpoint Group | Total Endpoints | In OpenAPI | Coverage |
|----------------|----------------|------------|----------|
| Admin + Technical + GitHub | 22 | 13 | 59% |
| Auth + Activation | 12 | 0 | 0% |
| Business (users, employees, departments, schedules) | 27 | 0 | 0% |
| System (health, exports, imports, audit, backup) | 7 | 0 | 0% |
| **Total** | **68** | **13** | **19%** |

> The OpenAPI spec currently only covers the 13 admin/technical endpoints (Dashboard, Activation, ClientAdmin, Diagnostics, Audit, Support, Backup). The remaining 55 endpoints (auth, business CRUD, system) have no OpenAPI contract documentation.

---

## Activation Manager API

`ActivationManagerApi` class exposes 30+ methods covering:

| Category | Methods |
|----------|---------|
| Customers | CRUD + search + get-installations + get-licenses |
| Installations | CRUD + deactivate + by-customer + heartbeat |
| Licenses | CRUD + revoke + validate + redeem + by-customer |
| Audit | list + get + by-entity + by-date-range + export |
| Sync | status + trigger + history + config + update-config + conflicts |
| App | info + version + quit + minimize |

---

## Contract Classification (Sprint 1 Gate)

| Contrato | Classificacao | Evidencia |
|---|---|---|
| GET /api/system/health | **MISSING** | Backend tem /api/health — path diferente, fora do OpenAPI |
| GET /api/system/version | **MISSING** | Nao existe no backend nem no OpenAPI |
| GET /api/system/compatibility | **MISSING** | Nao existe |
| POST /api/auth/login | **DEFINED_FOR_FUTURE** | Implementado no backend, NAO documentado no OpenAPI |
| POST /api/auth/refresh | **MISSING** | Nao existe (JWT 60min sem refresh) |
| POST /api/auth/logout | **DEFINED_FOR_FUTURE** | Implementado no backend, NAO documentado no OpenAPI |
| POST /api/pairing/start | **MISSING** | Nao existe |
| POST /api/pairing/complete | **MISSING** | Nao existe |
| POST /api/devices/revoke | **MISSING** | Nao existe |
| GET /api/license/status | **MISSING** | Backend tem /api/activation/status — namespace diferente |
| GET /api/backup/status | **MISSING** | Backend tem GET /api/backups (lista), sem status |

### Cross-cutting contracts

| Contrato | Status | Evidencia |
|---|---|---|
| correlationId header | **MISSING** | Nao implementado em nenhum endpoint |
| Idempotency-Key header | **MISSING** | Nao implementado |
| Optimistic versioning (ETag/If-Match) | **MISSING** | Nao implementado |
| Event envelope | **MISSING** | Audit events retornados como arrays JSON simples |
| Institution identity | **MISSING** | Nao modelado |
| Server identity | **MISSING** | Nao modelado |
| Device identity | **MISSING** | Apenas installationId em ActivationStatus |
| Versioned error responses | **PARTIAL** | ErrorResponse(code, message) existe mas sem campo version |

### Decisao sobre duplicacoes de tipos

| Tipo | Fonte canonica | Duplicado em | Decisao |
|---|---|---|---|
| ActivationState | contracts/src/index.ts | frontend/desktop.ts | **Manter duplicacao temporaria** ate Sprint 3 |
| LicensePayload | contracts/src/index.ts | frontend/desktop.ts | **Manter duplicacao temporaria** ate Sprint 3 |
| TechnicalActivationStatus | frontend/desktop.ts | contracts chama ActivationStatus | **Renomear** no contracts para TechnicalActivationStatus |
| ClientAdminOneTimeCredentials | frontend/desktop.ts | contracts separa em 2 tipos | **Unificar** em 1 tipo no contracts |
| TechnicalBackupResponse | frontend/desktop.ts | Nao existe no contracts | **Adicionar** ao contracts |
| TechnicalSupportExportResult | frontend/desktop.ts | Nao existe no contracts | **Adicionar** ao contracts |
| ActivationManagerApi | activation-manager/contracts.ts | Unico no manager | **Extrair** tipos compartilhados para contracts |

## Key Findings

| # | Finding | Severity | Impact |
|---|---------|----------|--------|
| 1 | 11 contratos futuros (pairing, devices, system/*) estao MISSING — nao implementados | 🔴 High | Indicam que server/connect repos ainda nao existem |
| 2 | OpenAPI cobre apenas 13/68 endpoints (19%) | 🔴 High | 55 endpoints sem documentacao contratual |
| 3 | Frontend duplica 11+ tipos do contracts com nomes divergentes | 🔴 High | TechnicalActivationStatus vs ActivationStatus |
| 4 | Cross-cutting contracts (correlationId, idempotency, versioning) estao MISSING | 🟡 Medium | Serao necessarios na arquitetura multi-instancia |
| 5 | Desktop (plain JS) nao tem tipos | 🟡 Medium | Sem type safety no IPC bridge |
| 6 | Backend Java entities alinhados manualmente | 🟡 Medium | Sincronizacao manual required |
| 7 | Nenhum workspace-level type sharing configurado | 🔴 High | Root cause da duplicacao |

---

## Recommended Fixes

| Priority | Action | Effort |
|----------|--------|--------|
| P0 | Add `@escalalivre/contracts` as workspace dependency in frontend & manager | Low |
| P0 | Replace duplicate frontend types with imports from contracts | Medium |
| P1 | Extend OpenAPI spec to cover auth + business endpoints | Medium |
| P1 | Implement correlationId header pattern | Medium |
| P1 | Add Java DTO codegen from OpenAPI spec | Medium |
| P2 | Renomear ActivationStatus → TechnicalActivationStatus no contracts | Low |
| P2 | Unificar tipos de resposta ClientAdmin no contracts | Low |
| P2 | Adicionar TechnicalBackupResponse e TechnicalSupportExportResult ao contracts | Low |
| P2 | Implementar contratos future (pairing, devices, system) quando server/connect existirem | High |
| P3 | Migrar desktop para TypeScript | High |
