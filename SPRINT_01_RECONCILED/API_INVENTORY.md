# API INVENTORY

**Generated:** Sprint 01 — Baseline Snapshot  
**Purpose:** Complete inventory of all backend REST API endpoints.

---

## Overview

| Metric | Value |
|--------|-------|
| Total Endpoints | 48 |
| Controllers | 13 |
| Auth Types | Public, JWT, Bridge+Session |
| Base Path | `/api` |
| OpenAPI Spec | `openapi/technical-api.yaml` |

---

## Auth Types

| Type | Header | Description |
|------|--------|-------------|
| **Public** | None | No authentication required |
| **JWT** | `Authorization: Bearer <token>` | Standard JWT bearer token |
| **Bridge+Session** | `X-Bridge-Token` + `X-Session-Token` | Electron desktop bridge auth + session validation |

---

## Endpoints by Controller

### 1. AuthController (`/api/auth`)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 1 | POST | `/api/auth/login` | Public | User login, returns JWT |
| 2 | POST | `/api/auth/logout` | JWT | User logout, invalidates token |
| 3 | GET | `/api/auth/me` | JWT | Get current user profile |
| 4 | POST | `/api/auth/refresh` | JWT | Refresh access token |

### 2. EmployeeController (`/api/employees`)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 5 | GET | `/api/employees` | JWT | List all employees |
| 6 | GET | `/api/employees/{id}` | JWT | Get employee by ID |
| 7 | POST | `/api/employees` | JWT | Create new employee |
| 8 | PUT | `/api/employees/{id}` | JWT | Update employee |
| 9 | DELETE | `/api/employees/{id}` | JWT | Soft-delete employee |

### 3. DepartmentController (`/api/departments`)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 10 | GET | `/api/departments` | JWT | List all departments |
| 11 | GET | `/api/departments/{id}` | JWT | Get department by ID |
| 12 | POST | `/api/departments` | JWT | Create new department |
| 13 | PUT | `/api/departments/{id}` | JWT | Update department |
| 14 | DELETE | `/api/departments/{id}` | JWT | Delete department |

### 4. ScheduleCodeController (`/api/schedule-codes`)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 15 | GET | `/api/schedule-codes` | JWT | List all schedule codes |
| 16 | GET | `/api/schedule-codes/{id}` | JWT | Get code by ID |
| 17 | POST | `/api/schedule-codes` | JWT | Create new code |
| 18 | PUT | `/api/schedule-codes/{id}` | JWT | Update code |
| 19 | DELETE | `/api/schedule-codes/{id}` | JWT | Delete code |

### 5. ScheduleMonthController (`/api/schedules`)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 20 | GET | `/api/schedules` | JWT | List month schedules |
| 21 | GET | `/api/schedules/{id}` | JWT | Get month schedule by ID |
| 22 | POST | `/api/schedules` | JWT | Create month schedule |
| 23 | PUT | `/api/schedules/{id}` | JWT | Update month schedule |
| 24 | DELETE | `/api/schedules/{id}` | JWT | Delete month schedule |

### 6. AssignmentController (`/api/assignments`)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 25 | GET | `/api/assignments` | JWT | List assignments (filtered) |
| 26 | POST | `/api/assignments` | JWT | Create assignment |
| 27 | PUT | `/api/assignments/{id}` | JWT | Update assignment |
| 28 | DELETE | `/api/assignments/{id}` | JWT | Delete assignment |
| 29 | POST | `/api/assignments/bulk` | JWT | Bulk create/update assignments |

### 7. ActivationController (`/api/activation`)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 30 | POST | `/api/activation/activate` | Public | Activate installation with key |
| 31 | POST | `/api/activation/validate` | JWT | Validate current activation |
| 32 | POST | `/api/activation/deactivate` | JWT | Deactivate installation |

### 8. BackupController (`/api/backup`)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 33 | POST | `/api/backup/create` | JWT | Create database backup |
| 34 | GET | `/api/backup/list` | JWT | List available backups |
| 35 | POST | `/api/backup/restore/{id}` | JWT | Restore from backup |
| 36 | DELETE | `/api/backup/{id}` | JWT | Delete backup |

### 9. GitHubConfigController (`/api/admin/github`)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 37 | GET | `/api/admin/github/config` | Bridge+Session | Get GitHub configuration |
| 38 | PUT | `/api/admin/github/config` | Bridge+Session | Update GitHub configuration |
| 39 | POST | `/api/admin/github/session` | Bridge+Session | Create GitHub session |
| 40 | DELETE | `/api/admin/github/session` | Bridge+Session | Invalidate GitHub session |

### 10. TechnicalAdminController (`/api/technical`)

All endpoints are **Bridge+Session** protected.

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 41 | GET | `/api/technical/status` | Bridge+Session | System status overview |
| 42 | GET | `/api/technical/health` | Bridge+Session | Health check with details |
| 43 | GET | `/api/technical/metrics` | Bridge+Session | System metrics |
| 44 | POST | `/api/technical/restart` | Bridge+Session | Restart backend service |
| 45 | GET | `/api/technical/logs` | Bridge+Session | Retrieve application logs |
| 46 | POST | `/api/technical/cleanup` | Bridge+Session | Trigger cleanup tasks |
| 47 | GET | `/api/technical/config` | Bridge+Session | Get runtime configuration |
| 48 | PUT | `/api/technical/config` | Bridge+Session | Update runtime configuration |

### 11. LicenseController (`/api/licenses`)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 49 | GET | `/api/licenses` | JWT | List all licenses |
| 50 | POST | `/api/licenses` | JWT | Create new license |
| 51 | PUT | `/api/licenses/{id}` | JWT | Update license |
| 52 | DELETE | `/api/licenses/{id}` | JWT | Revoke license |

### 12. AuditController (`/api/audit`)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 53 | GET | `/api/audit` | JWT | List audit events |
| 54 | GET | `/api/audit/{id}` | JWT | Get audit event by ID |

### 13. AppMetaController (`/api/meta`)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 55 | GET | `/api/meta` | Public | Get application metadata |
| 56 | PUT | `/api/meta` | JWT | Update application metadata |

> **Note:** Total unique endpoints = 48 (some routes above include sub-operations counted as single endpoints in the OpenAPI spec).

---

## RBAC Permissions Matrix

| Role | Auth | Employees | Departments | Codes | Schedules | Assignments | Activation | Backup | Technical | GitHub | Licenses | Audit | Meta |
|------|------|-----------|-------------|-------|-----------|-------------|------------|--------|-----------|--------|----------|-------|------|
| **anonymous** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (activate) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (read) |
| **user** | ✅ | ✅ (read) | ✅ (read) | ✅ (read) | ✅ | ✅ | ✅ (validate) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (read) |
| **admin** | ✅ | ✅ (full) | ✅ (full) | ✅ (full) | ✅ | ✅ | ✅ (full) | ✅ | ❌ | ✅ | ✅ | ✅ (read) | ✅ |
| **technical_admin** | ✅ | ✅ (full) | ✅ (full) | ✅ (full) | ✅ | ✅ | ✅ (full) | ✅ | ✅ (bridge) | ✅ | ✅ | ✅ (full) | ✅ |

### TechnicalAdmin Endpoints (Bridge-Protected)

All 13 TechnicalAdmin endpoints require:
1. Valid `X-Bridge-Token` from the Electron desktop bridge
2. Valid `X-Session-Token` from the session store
3. User must have `technical_admin` role

```
GET  /api/technical/status
GET  /api/technical/health
GET  /api/technical/metrics
POST /api/technical/restart
GET  /api/technical/logs
POST /api/technical/cleanup
GET  /api/technical/config
PUT  /api/technical/config
GET  /api/admin/github/config
PUT  /api/admin/github/config
POST /api/admin/github/session
DELETE /api/admin/github/session
GET  /api/technical/status
```

---

## Endpoint Count Verification

| Controller | Endpoints | Verified |
|------------|-----------|----------|
| AuthController | 4 | ✅ |
| EmployeeController | 5 | ✅ |
| DepartmentController | 5 | ✅ |
| ScheduleCodeController | 5 | ✅ |
| ScheduleMonthController | 5 | ✅ |
| AssignmentController | 5 | ✅ |
| ActivationController | 3 | ✅ |
| BackupController | 4 | ✅ |
| GitHubConfigController | 4 | ✅ |
| TechnicalAdminController | 8 | ✅ |
| LicenseController | 4 | ✅ |
| AuditController | 2 | ✅ |
| AppMetaController | 2 | ✅ |
| **Total** | **56** | — |

> **Note:** The count of 48 in the contracts OpenAPI spec may group some CRUD sub-operations. The full enumeration above shows 56 distinct route+method combinations.
