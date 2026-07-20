# REPOSITORY SHA MATRIX

**Generated:** Sprint 01 — Baseline Snapshot  
**Purpose:** Single source of truth for all repository HEAD commits across remotes.

---

## Matrix

| # | Repo | HEAD SHA | Status | origin/main SHA | gitlab/main SHA | Tech Stack | Description |
|---|------|----------|--------|-----------------|-----------------|------------|-------------|
| 1 | **contracts** | `a036287` | ✅ Local / On-disk | `a036287` | `a036287` | TypeScript, JSON Schema, OpenAPI 3.1 | Shared types, validation schemas, OpenAPI spec |
| 2 | **backend** | `293a12d` | ✅ Local / On-disk | `293a12d` | `293a12d` | Java 21, Spring Boot, SQLite, Flyway | REST API — 48 endpoints, 15 DB tables |
| 3 | **frontend** | `7370fa7` | ✅ Local / On-disk | `7370fa7` | `7370fa7` | React 19, Vite 6, Tailwind 4 | Web SPA — schedule management UI |
| 4 | **desktop** | `b19742f` | ✅ Local / On-disk | `b19742f` | `b19742f` | Electron 31.7.7, Plain JS | Desktop shell — 27 IPC channels |
| 5 | **activation-manager** | `3610d55` | ✅ Local / On-disk | `3610d55` | `3610d55` | Electron, TypeScript, SQLite | License management — 38 IPC channels, RegistrySync |
| 6 | **activation-issuer** | `71af3c3` | ✅ Local / On-disk | `71af3c3` | `71af3c3` | Java 21, CLI, JWS RS256 | License key signing & issuance |
| 7 | **activation-registry** | — | 🔴 Remote only | Private GitHub/GitLab | Private GitHub/GitLab | Unknown | License validation service (not cloned locally) |
| 8 | **releases** | `db58172` | ✅ Local / On-disk | `db58172` | `db58172` | Git catch-all | Release artifacts & inventory files |
| 9 | **server** | — | ⬜ Not on disk | — | — | Unknown | Backend variant or infra (not yet cloned) |
| 10 | **connect** | — | ⬜ Not on disk | — | — | Unknown | Integration / connector service (not yet cloned) |
| 11 | **mobile** | — | ⬜ Not on disk | — | — | Unknown | Mobile client (not yet cloned) |

---

## Legend

| Status | Meaning |
|--------|---------|
| ✅ Local / On-disk | Repo cloned locally, SHA verified |
| 🔴 Remote only | Repo exists on remote but not cloned to workspace |
| ⬜ Not on disk | Repo not yet created or cloned |

---

## Consistency Check

All 6 on-disk repositories show **identical SHAs** across local, `origin/main` (GitHub), and `gitlab/main` (GitLab). No drift detected at baseline capture time.

```
contracts:             a036287  ✅ consistent
backend:               293a12d  ✅ consistent
frontend:              7370fa7  ✅ consistent
desktop:               b19742f  ✅ consistent
activation-manager:    3610d55  ✅ consistent
activation-issuer:     71af3c3  ✅ consistent
releases:              db58172  ✅ consistent
```

---

## Missing Repos — Action Items

| Repo | Action Required |
|------|-----------------|
| activation-registry | Request access / clone from private remote |
| server | Clarify purpose; clone or deprecate |
| connect | Clarify purpose; clone or deprecate |
| mobile | Clarify purpose; clone or deprecate |
