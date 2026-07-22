# MySQL Execution Evidence

Final local executions on `2026-07-22`:

| Scope | Final result | Maven elapsed |
|---|---|---:|
| Default `verify` | 142 run, 20 skipped, 0 failures/errors | 26.108 s |
| `mysql-it verify` | 142/142, 0 skipped/failures/errors | 39.974 s |
| Restart IT | 1/1, 0 skipped/failures/errors | 20.585 s |
| SQLite benchmark | 22/22 | 1 min 25 s |
| MySQL benchmark | 22/22 | 1 min 40 s |

MySQL-specific observed facts:

- Image `mysql:8.4.0` started successfully through Testcontainers.
- V901 applied once and validated on subsequent contexts.
- Three required columns report `data_type=longtext`.
- `features_json` passed `JSON_VALID`.
- A 256 KiB payload passed integration coverage.
- A 512 KiB payload survived application restart coverage.
- Accents, emoji, CJK characters, newlines, and NULL values survived round trips.

Result: `MYSQL_EXECUTION_EVIDENCE: PASS`.
