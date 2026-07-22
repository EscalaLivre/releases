# Test Matrix

| Command/scope | Tests | Passed | Skipped | Failures/errors | Result |
|---|---:|---:|---:|---:|---|
| `mvn verify` | 142 | 122 | 20 MySQL | 0 | PASS |
| `mvn -Pmysql-it verify` | 142 | 142 | 0 | 0 | PASS |
| `mvn -Pmysql-it -Dtest=MySQLRestartPersistenceIT test` | 1 | 1 | 0 | 0 | PASS |
| `PerformanceBenchmarkSQLite` | 22 | 22 | 0 | 0 | PASS |
| `PerformanceBenchmarkMySQL` | 22 | 22 | 0 | 0 | PASS |
| PowerShell parser | 11 scripts/modules | 11 | 0 | 0 | PASS |
| `docker compose config --quiet` | 1 config | 1 | 0 | 0 | PASS |

The Maven profile `mysql-it` sets the system property `mysql.integration=true`; it does not activate a Spring profile by itself. `MySQLRestartPersistenceIT` explicitly activates Spring profile `test-mysql` and is executed separately because Surefire does not include `*IT` by default.

The final GitLab MySQL job executes both the 142-test profile and the separate restart IT.
