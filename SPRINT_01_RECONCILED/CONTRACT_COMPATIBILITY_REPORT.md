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
| Technical Admin | 8 | 8 | 100% |
| GitHub Config | 4 | 4 | 100% |
| All other controllers | 36 | 0 | 0% |
| **Total** | **48** | **12** | **25%** |

> The OpenAPI spec currently only covers the 13 admin/technical endpoints. The 35 regular CRUD endpoints are not documented in the spec.

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

## Key Findings

| # | Finding | Severity | Impact |
|---|---------|----------|--------|
| 1 | Frontend duplicates 6+ types from contracts | 🔴 High | Type drift risk |
| 2 | Activation Manager duplicates 4+ types from contracts | 🔴 High | Type drift risk |
| 3 | Desktop has no type definitions at all | 🟡 Medium | No type safety |
| 4 | OpenAPI only covers 25% of endpoints | 🟡 Medium | Incomplete contract |
| 5 | Backend Java entities are manually aligned | 🟡 Medium | Manual sync required |
| 6 | No workspace-level type sharing configured | 🔴 High | Root cause of duplication |

---

## Recommended Fixes

| Priority | Action | Effort |
|----------|--------|--------|
| P0 | Add `@escalalivre/contracts` as workspace dependency in frontend & manager | Low |
| P0 | Replace duplicate types with imports from contracts | Medium |
| P1 | Extend OpenAPI spec to cover all 48 endpoints | Medium |
| P1 | Add Java DTO codegen from OpenAPI spec | Medium |
| P2 | Migrate desktop to TypeScript or add JSDoc types | High |
| P2 | Add CI check for type drift detection | Low |
