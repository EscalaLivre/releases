# SQL Compatibility Matrix

Final backend SHA: `079ce3c4c12846f5cd6229bca36a92c1a30d31f8`

| Concern | SQLite | MySQL 8.4 | Result |
|---|---|---|---|
| Identifier quoting | SQLite-compatible names | Reserved identifiers use backticks | PASS |
| Generated IDs | `INTEGER PRIMARY KEY AUTOINCREMENT` | `BIGINT AUTO_INCREMENT` | PASS |
| Boolean storage | `INTEGER` | `TINYINT(1)` | PASS with deprecation warnings recorded |
| Schedule UPSERT | `ON CONFLICT ... DO UPDATE` | `ON DUPLICATE KEY UPDATE` | PASS |
| Unknown JDBC driver | Not applicable | Fails closed instead of assuming SQLite | PASS |
| Text encoding | UTF-8 | `utf8mb4_unicode_ci` and Connector/J UTF-8 | PASS |
| Free-form payloads | `TEXT` | `LONGTEXT` | PASS |
| Feature JSON | `TEXT` | native `JSON` | PASS |
| Foreign keys | Declared in V1-V8 | InnoDB constraints in V901 | PASS |
| Parameter binding | `JdbcTemplate` placeholders | Same | PASS |

`ScheduleRepository` selects one of two constant UPSERT templates after inspecting JDBC metadata. Query values remain bound parameters.

Result: `SQL_COMPATIBILITY: PASS_AUTOMATED`.
