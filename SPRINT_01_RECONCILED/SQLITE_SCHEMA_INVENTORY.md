# SQLITE SCHEMA INVENTORY

**Generated:** Sprint 01 — Baseline Snapshot  
**Purpose:** Complete inventory of all SQLite schemas across services.

---

## Overview

| Service | Database | Tables | Indexes | Migrations | Schema Version |
|---------|----------|--------|---------|------------|----------------|
| **Backend** | `escala.db` | 15 (+ 2 non-migration) | — | 8 (V1–V8) | V8 |
| **Activation Manager** | `activation_manager.db` | 8 | 8 | — | v4 |
| **Activation Issuer** | (none — stateless CLI) | 0 | 0 | 0 | — |
| **Desktop** | (none) | 0 | 0 | 0 | — |

---

## 1. Backend — `escala.db`

Flyway-managed. 8 migration files, 15 tables.

### V1 — Core Tables

#### `app_meta`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `key` | TEXT | PRIMARY KEY | Metadata key |
| `value` | TEXT | NOT NULL | Metadata value |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

#### `user_account`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | User ID |
| `username` | TEXT | UNIQUE NOT NULL | Login username |
| `password_hash` | TEXT | NOT NULL | Bcrypt password hash |
| `display_name` | TEXT | | Display name |
| `role` | TEXT | NOT NULL DEFAULT 'user' | User role (user/admin) |
| `is_active` | INTEGER | NOT NULL DEFAULT 1 | Active flag |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

#### `department`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Department ID |
| `name` | TEXT | UNIQUE NOT NULL | Department name |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### `employee`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Employee ID |
| `name` | TEXT | NOT NULL | Employee name |
| `department_id` | INTEGER | FOREIGN KEY → department(id) | Department assignment |
| `is_active` | INTEGER | NOT NULL DEFAULT 1 | Active flag |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

#### `schedule_code`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Schedule code ID |
| `code` | TEXT | UNIQUE NOT NULL | Code identifier (e.g., "A1", "B2") |
| `description` | TEXT | | Code description |
| `color` | TEXT | | Display color hex |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### `schedule_month`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Month schedule ID |
| `year` | INTEGER | NOT NULL | Year |
| `month` | INTEGER | NOT NULL | Month (1-12) |
| `department_id` | INTEGER | FOREIGN KEY → department(id) | Department |
| `is_published` | INTEGER | NOT NULL DEFAULT 0 | Published flag |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

#### `schedule_assignment`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Assignment ID |
| `schedule_month_id` | INTEGER | FOREIGN KEY → schedule_month(id) | Month schedule |
| `employee_id` | INTEGER | FOREIGN KEY → employee(id) | Employee |
| `day` | INTEGER | NOT NULL | Day of month (1-31) |
| `schedule_code_id` | INTEGER | FOREIGN KEY → schedule_code(id) | Assigned code |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### V2 — Admin Security

#### `admin_security`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Security ID |
| `user_account_id` | INTEGER | FOREIGN KEY → user_account(id) | Admin user |
| `security_level` | TEXT | NOT NULL DEFAULT 'standard' | Security level |
| `requires_bridge` | INTEGER | NOT NULL DEFAULT 1 | Bridge auth required |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### `admin_second_step_codes`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Code ID |
| `code_hash` | TEXT | NOT NULL | Hashed verification code |
| `user_account_id` | INTEGER | FOREIGN KEY → user_account(id) | Target user |
| `expires_at` | TEXT | NOT NULL | Expiration timestamp |
| `used` | INTEGER | NOT NULL DEFAULT 0 | Used flag |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### `admin_github_sessions`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Session ID |
| `user_account_id` | INTEGER | FOREIGN KEY → user_account(id) | Admin user |
| `github_token_encrypted` | TEXT | NOT NULL | Encrypted GitHub PAT |
| `session_token` | TEXT | UNIQUE NOT NULL | Session token |
| `expires_at` | TEXT | NOT NULL | Expiration timestamp |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### `admin_github_config`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Config ID |
| `key` | TEXT | UNIQUE NOT NULL | Config key |
| `value_encrypted` | TEXT | | Encrypted config value |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### V3 — Activation

#### `app_activation`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Activation ID |
| `installation_id` | TEXT | UNIQUE NOT NULL | Unique installation identifier |
| `activation_key` | TEXT | NOT NULL | License activation key |
| `activated_at` | TEXT | NOT NULL | Activation timestamp |
| `expires_at` | TEXT | | Expiration timestamp |
| `is_active` | INTEGER | NOT NULL DEFAULT 1 | Active flag |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### `activation_key_redeem`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Redeem ID |
| `activation_key` | TEXT | NOT NULL | Redeemed key |
| `installation_id` | TEXT | NOT NULL | Redeeming installation |
| `redeemed_at` | TEXT | NOT NULL | Redemption timestamp |
| `ip_address` | TEXT | | Client IP address |

#### `installation_id_store`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Store ID |
| `installation_id` | TEXT | UNIQUE NOT NULL | Installation identifier |
| `machine_fingerprint` | TEXT | | Machine fingerprint |
| `first_seen` | TEXT | DEFAULT CURRENT_TIMESTAMP | First seen timestamp |
| `last_seen` | TEXT | DEFAULT CURRENT_TIMESTAMP | Last seen timestamp |

#### `activation_events`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Event ID |
| `installation_id` | TEXT | NOT NULL | Related installation |
| `event_type` | TEXT | NOT NULL | Event type (activate/deactivate/validate) |
| `details` | TEXT | | JSON details payload |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Event timestamp |

### V6 — License Extended

#### `license`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | License ID |
| `key` | TEXT | UNIQUE NOT NULL | License key |
| `customer_name` | TEXT | NOT NULL | Customer identifier |
| `max_installations` | INTEGER | NOT NULL DEFAULT 1 | Max allowed installations |
| `expires_at` | TEXT | | Expiration date |
| `is_valid` | INTEGER | NOT NULL DEFAULT 1 | Validity flag |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### V7 — Backup

#### `backup_history`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Backup ID |
| `filename` | TEXT | NOT NULL | Backup filename |
| `size_bytes` | INTEGER | | File size in bytes |
| `status` | TEXT | NOT NULL DEFAULT 'created' | Backup status |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### V8 — Audit

#### `audit_event`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Audit ID |
| `user_id` | INTEGER | FOREIGN KEY → user_account(id) | Acting user |
| `action` | TEXT | NOT NULL | Action performed |
| `resource_type` | TEXT | | Resource type affected |
| `resource_id` | INTEGER | | Resource ID affected |
| `details` | TEXT | | JSON details payload |
| `ip_address` | TEXT | | Client IP |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Event timestamp |

---

## 2. Activation Manager — `activation_manager.db`

Schema version 4. Not Flyway-managed (custom versioning).

### Tables

#### `app_metadata`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `key` | TEXT | PRIMARY KEY | Metadata key |
| `value` | TEXT | NOT NULL | Metadata value |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

#### `customers`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Customer ID |
| `name` | TEXT | NOT NULL | Customer name |
| `email` | TEXT | | Contact email |
| `company` | TEXT | | Company name |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

#### `installations`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Installation ID |
| `customer_id` | INTEGER | FOREIGN KEY → customers(id) | Owner customer |
| `installation_uuid` | TEXT | UNIQUE NOT NULL | Unique installation identifier |
| `machine_name` | TEXT | | Machine hostname |
| `os_info` | TEXT | | Operating system info |
| `is_active` | INTEGER | NOT NULL DEFAULT 1 | Active flag |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | First seen timestamp |
| `last_seen_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Last communication timestamp |

#### `licenses`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | License ID |
| `customer_id` | INTEGER | FOREIGN KEY → customers(id) | Owner customer |
| `license_key` | TEXT | UNIQUE NOT NULL | License key |
| `type` | TEXT | NOT NULL | License type |
| `max_installations` | INTEGER | NOT NULL DEFAULT 1 | Max allowed installations |
| `expires_at` | TEXT | | Expiration date |
| `is_valid` | INTEGER | NOT NULL DEFAULT 1 | Validity flag |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

#### `audit`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Audit ID |
| `action` | TEXT | NOT NULL | Action performed |
| `entity_type` | TEXT | | Entity type affected |
| `entity_id` | INTEGER | | Entity ID affected |
| `details` | TEXT | | JSON details payload |
| `performed_by` | TEXT | | Actor identifier |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Event timestamp |

#### `synced_license_metadata`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Sync metadata ID |
| `license_id` | INTEGER | FOREIGN KEY → licenses(id) | Synced license |
| `source` | TEXT | NOT NULL | Sync source (github/gitlab) |
| `remote_id` | TEXT | | Remote identifier |
| `last_synced_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Last sync timestamp |

#### `synced_audit`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Synced audit ID |
| `audit_id` | INTEGER | FOREIGN KEY → audit(id) | Local audit event |
| `source` | TEXT | NOT NULL | Sync source |
| `remote_id` | TEXT | | Remote identifier |
| `synced_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Sync timestamp |

#### `sync_state`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | State ID |
| `source` | TEXT | UNIQUE NOT NULL | Sync source (github/gitlab) |
| `last_sync_at` | TEXT | | Last successful sync timestamp |
| `last_cursor` | TEXT | | Pagination cursor for incremental sync |
| `status` | TEXT | NOT NULL DEFAULT 'idle' | Current sync status |
| `error_message` | TEXT | | Last error message if failed |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Indexes

| # | Index Name | Table | Columns | Unique |
|---|------------|-------|---------|--------|
| 1 | `idx_installations_customer` | installations | `customer_id` | No |
| 2 | `idx_installations_uuid` | installations | `installation_uuid` | Yes |
| 3 | `idx_licenses_customer` | licenses | `customer_id` | No |
| 4 | `idx_licenses_key` | licenses | `license_key` | Yes |
| 5 | `idx_audit_action` | audit | `action` | No |
| 6 | `idx_audit_entity` | audit | `entity_type`, `entity_id` | No |
| 7 | `idx_synced_license_license` | synced_license_metadata | `license_id` | No |
| 8 | `idx_sync_state_source` | sync_state | `source` | Yes |

---

## Schema Cross-Reference

| Concept | Backend Table | Manager Table | Notes |
|---------|---------------|---------------|-------|
| App Metadata | `app_meta` | `app_metadata` | Equivalent |
| Customers | — | `customers` | Manager-only |
| Installations | `installation_id_store` | `installations` | Manager has richer schema |
| Licenses | `license` | `licenses` | Both have similar columns |
| Audit | `audit_event` | `audit` | Backend has user_id FK |
| Activation | `app_activation` | — | Backend-only |
| Sync | — | `sync_state`, `synced_*` | Manager-only (RegistrySync) |
