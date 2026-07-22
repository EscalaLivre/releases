# MySQL Functional Coverage

Automated coverage proven against MySQL 8.4.0:

- Fresh schema and Flyway history.
- Department, employee, schedule, assignment, code, license, audit, and activation persistence.
- Repository CRUD and schedule replacement behavior.
- Constraints, native JSON, LONGTEXT, UTF-8, and NULL values.
- Application restart with the same database.
- Backend restart, MySQL restart, and full stack stop/start using named volumes in the operational validation run.
- XLSX hash persistence in the operational validation run.

Not proven as a final human E2E:

- SmartScreen/download experience on a clean machine.
- Human-issued synthetic license flow for a newly installed ID.
- Human admin setup, password change, UI data entry, and XLSX inspection.
- Docker-absent installation/reboot/resume path.
- Destructive uninstall in a disposable clean environment.

Result: `MYSQL_FUNCTIONAL_E2E: PARTIAL_AUTOMATED_COVERAGE`; `MANUAL_E2E_REQUIRED: YES`.
