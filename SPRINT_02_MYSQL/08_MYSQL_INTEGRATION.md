# MySQL Integration

Command: `mvn -Pmysql-it verify`

Environment: Testcontainers `1.21.4`, image `mysql:8.4.0`, server charset `utf8mb4`, collation `utf8mb4_unicode_ci`, timezone UTC.

```text
Tests run: 142
Passed: 142
Skipped: 0
Failures: 0
Errors: 0
```

The 20 MySQL-specific tests cover migration/schema, repository CRUD, schedule replacement semantics, constraints, UTF-8 accents/emoji/CJK, native JSON validity, large LONGTEXT values, NULL preservation, and JDBC connectivity.

The profile uses a real MySQL container. It is not an H2 or mocked compatibility result.

Result: `MYSQL_INTEGRATION_20_OF_20: PASS`.
