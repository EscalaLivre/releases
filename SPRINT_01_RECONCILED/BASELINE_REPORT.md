# BASELINE REPORT — Sprint 01

**Generated:** Sprint 01 — Baseline Snapshot  
**Purpose:** Executive summary of all baselines captured at sprint start.

---

## Executive Summary

This report consolidates the baseline state of the Escala+ platform across all repositories, databases, APIs, IPC channels, and type contracts. It serves as the reference point for Sprint 1 planning and change tracking.

### Key Metrics

| Metric | Value |
|--------|-------|
| Total Repositories | 11 |
| On-disk Repos | 6 (55%) |
| Missing from Disk | 5 (activation-registry, releases, server, connect, mobile) |
| Database Tables | 26 (18 backend + 8 manager) |
| API Endpoints | 68 (backend) |
| IPC Channels | 72 (27 desktop + 45 manager) |
| Contract Types | 15 (canonical) |
| Duplicate Type Definitions | 10+ (across frontend & manager) |
| SHA Consistency | ✅ All on-disk repos consistent across remotes |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ESCALA+ PLATFORM                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │   mobile      │    │  frontend    │    │   desktop            │  │
│  │   (TBD)       │    │  React 19    │    │   Electron 31.7.7    │  │
│  │               │    │  Vite 6      │    │   Plain JS           │  │
│  └──────┬───────┘    │  Tailwind 4  │    │   27 IPC channels    │  │
│         │            └──────┬───────┘    └──────────┬───────────┘  │
│         │                   │                       │               │
│         │            HTTP   │            IPC        │  Bridge       │
│         │                   │                       │  Token        │
│         ▼                   ▼                       ▼               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    backend (Java 21)                         │   │
│  │                    Spring Boot                               │   │
│  │                    SQLite + Flyway                           │   │
│  │                    48 REST endpoints                         │   │
│  │                    15 database tables                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                                                           │
│         │  HTTP                                                     │
│         ▼                                                           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │  activation   │    │  activation  │    │   activation          │  │
│  │  -manager     │    │  -issuer     │    │   -registry           │  │
│  │  Electron+TS  │    │  Java 21     │    │   (TBD - remote)      │  │
│  │  38 IPC ch    │    │  JWS RS256   │    │                       │  │
│  │  8 tables     │    │  CLI tool    │    │                       │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │  contracts    │    │  releases    │    │   server (TBD)       │  │
│  │  TS types     │    │  git catch   │    │   connect (TBD)      │  │
│  │  JSON Schema  │    │  all repos   │    │                       │  │
│  │  OpenAPI 3.1  │    │              │    │                       │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Repository Status

| Status | Repos | SHAs |
|--------|-------|------|
| ✅ On-disk & consistent | contracts, backend, frontend, desktop, activation-manager, activation-issuer, releases | All verified |
| 🔴 Remote only | activation-registry | Not cloned |
| ⬜ Not on disk | server, connect, mobile | Unknown state |

Full details: [REPOSITORY_SHA_MATRIX.md](REPOSITORY_SHA_MATRIX.md)

---

## Database Status

| Service | Tables | Migrations | Schema Version |
|---------|--------|------------|----------------|
| Backend | 15 | 8 (V1–V8) | V8 |
| Activation Manager | 8 | — | v4 |

Full details: [SQLITE_SCHEMA_INVENTORY.md](SQLITE_SCHEMA_INVENTORY.md)

---

## API Status

| Metric | Value |
|--------|-------|
| Total Endpoints | 48 |
| Controllers | 13 |
| Auth Types | Public, JWT, Bridge+Session |
| OpenAPI Coverage | 25% (12/48 admin endpoints documented) |
| RBAC Roles | 4 (anonymous, user, admin, technical_admin) |

Full details: [API_INVENTORY.md](API_INVENTORY.md)

---

## IPC Status

| Service | Channels | Security |
|---------|----------|----------|
| Desktop | 27 | Bridge Token |
| Activation Manager | 38 | Internal IPC |

Full details: [IPC_INVENTORY.md](IPC_INVENTORY.md)

---

## Contract Status

| Aspect | Status |
|--------|--------|
| Canonical types | 15 (in `@escalalivre/contracts`) |
| Duplicate definitions | 10+ (frontend + manager) |
| OpenAPI spec | 13 admin endpoints, 15 schemas |
| Workspace sharing | ❌ Not configured |

Full details: [CONTRACT_COMPATIBILITY_REPORT.md](CONTRACT_COMPATIBILITY_REPORT.md)

---

## Key Findings

### Critical

| # | Finding | Impact |
|---|---------|--------|
| 1 | **Type duplication across 3 packages** — frontend and activation-manager each define their own copies of types that already exist in `@escalalivre/contracts` | Type drift risk; changes in one package won't propagate |
| 2 | **4 repos missing from workspace** — activation-registry, server, connect, mobile not on disk | Cannot assess full system architecture |

### Important

| # | Finding | Impact |
|---|---------|--------|
| 3 | **OpenAPI only covers 25% of endpoints** — 35 CRUD endpoints undocumented | No contract enforcement for most APIs |
| 4 | **Desktop has no type system** — plain JS with no type definitions | No compile-time safety |
| 5 | **Backend Java entities manually aligned** with TS interfaces | Drift risk if contracts change |

### Informational

| # | Finding | Impact |
|---|---------|--------|
| 6 | **All SHAs consistent** across local/GitHub/GitLab | No drift at baseline time |
| 7 | **Activation Manager has 38 IPC channels** — complex service | High maintenance surface |
| 8 | **Two separate SQLite databases** with overlapping schemas | Cross-service data alignment needed |

---

## Sprint 1 Next Steps

| Priority | Action | Owner | Effort |
|----------|--------|-------|--------|
| P0 | Clone missing repos (activation-registry, server, connect, mobile) | DevOps | Low |
| P0 | Add `@escalalivre/contracts` as workspace dependency in frontend & manager | Backend | Low |
| P0 | Replace duplicate type definitions with imports from contracts | Frontend, Manager | Medium |
| P1 | Extend OpenAPI spec to cover all 48 endpoints | Backend | Medium |
| P1 | Add CI check for type drift detection | DevOps | Low |
| P1 | Document activation-registry API surface | Backend | Medium |
| P2 | Migrate desktop to TypeScript or add JSDoc types | Desktop | High |
| P2 | Add Java DTO codegen from OpenAPI spec | Backend | Medium |
| P2 | Create cross-service data alignment guide for SQLite schemas | Backend | Medium |

---

## File Index

| File | Description |
|------|-------------|
| [REPOSITORY_SHA_MATRIX.md](REPOSITORY_SHA_MATRIX.md) | Repository HEAD SHA tracking across remotes |
| [SQLITE_SCHEMA_INVENTORY.md](SQLITE_SCHEMA_INVENTORY.md) | Complete SQLite schema documentation |
| [API_INVENTORY.md](API_INVENTORY.md) | Backend REST API endpoint inventory |
| [IPC_INVENTORY.md](IPC_INVENTORY.md) | Electron IPC channel inventory |
| [CONTRACT_COMPATIBILITY_REPORT.md](CONTRACT_COMPATIBILITY_REPORT.md) | Type/schema contract alignment analysis |
| [BASELINE_REPORT.md](BASELINE_REPORT.md) | This file — executive summary |
