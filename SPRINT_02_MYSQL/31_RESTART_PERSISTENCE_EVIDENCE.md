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

## Clean s2.2 Smoke

The `1.0.0-qa.s2.2` installer was installed from zero named volumes, reached `UP`, stopped both QA containers, and started them again successfully. Full removal then deleted only the two QA containers, network, image, and named volumes. A second full-removal execution also passed with all resources already absent.

This clean smoke did not create a signed license or the manual functional dataset. It supplements the persistence evidence above and does not change `HUMAN_INSTALL_RESTART_VALIDATION: PENDING`.
