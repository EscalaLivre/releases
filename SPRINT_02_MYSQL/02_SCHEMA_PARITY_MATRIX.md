# Schema Parity Matrix

MySQL V901 is the fresh-database equivalent of SQLite V1 through V8.

| Area | SQLite V1-V8 | MySQL V901 | Result |
|---|---:|---:|---|
| Tables | 18 | 18 | PASS |
| Auto-increment primary keys | 9 | 9 | PASS |
| User credential lifecycle fields | Present after V8 | Present | PASS |
| Activation technical fields | Present after V7 | Present | PASS |
| GitHub session token persistence | Removed by V6 | Never created | PASS |
| Schedule uniqueness | Year/month/department | Same | PASS |
| Assignment uniqueness | Schedule/employee/day | Same | PASS |

Intentional type mappings:

| Logical value | SQLite | MySQL |
|---|---|---|
| IDs and ISO timestamps | `TEXT` | bounded `VARCHAR` |
| Boolean flags | `INTEGER` | `TINYINT(1)` |
| Estimated hours | `REAL` | `DECIMAL(8,2)` |
| Free-form activation/audit text | `TEXT` | `LONGTEXT` |
| `features_json` | `TEXT` | `JSON` |

The three MySQL LONGTEXT columns are `app_activation.activation_payload_json`, `activation_events.detail`, and `audit_event.details`.

Result: `SCHEMA_PARITY: PASS_FOR_FRESH_MYSQL_DATABASE`.
