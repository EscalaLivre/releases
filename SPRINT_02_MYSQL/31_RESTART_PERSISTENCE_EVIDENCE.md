# Restart Persistence Evidence

## Java Integration Test

`MySQLRestartPersistenceIT` starts one MySQL 8.4.0 container, opens a Spring context, inserts synthetic state, closes that context, and opens a second context against the same container.

Validated across contexts:

- 512 KiB activation payload.
- Unicode and newline-rich audit/event details.
- NULL values in all three LONGTEXT columns.
- User, department, employee, schedule, assignment, license, and backup rows.
- `features_json` validity.
- V901 `installed_rank` and checksum stability.

Final local result: 1/1 PASS. Final GitLab MySQL job also ran the test and passed.

## Operational Bundle Validation

The local QA named-volume run validated:

```text
BACKEND_RESTART_PERSISTENCE_PASS: PASS
MYSQL_RESTART_PERSISTENCE_PASS: PASS
FULL_STACK_RESTART_PERSISTENCE_PASS: PASS
LONGTEXT_PERSISTENCE_PASS: PASS
FLYWAY_RESTART_INTEGRITY_PASS: PASS
```

Evidence timestamp: `2026-07-22T00:55:23` local artifact name. V901 checksum observed: `-1583371606`.

The operational result remains automated. `HUMAN_INSTALL_RESTART_VALIDATION: PENDING`.
