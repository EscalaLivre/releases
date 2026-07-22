# SQLite Regression

Command: `mvn verify`

Final result:

```text
Tests run: 142
Active tests passed: 122
MySQL tests skipped by condition: 20
Failures: 0
Errors: 0
```

The default profile continued to use SQLite migrations V1 through V8. Test isolation fixes aligned `InstallationIdServiceTest` with the configured data directory and stopped `UserControllerTest` from deleting shared seeded schedule codes.

Result: `SQLITE_REGRESSION: PASS`.
