# Flyway Report

| Item | Value |
|---|---|
| MySQL migration | `V901__init_mysql.sql` |
| Applied version | `901` |
| Observed checksum | `-1583371606` |
| Engine | MySQL 8.4.0 |
| Flyway libraries | 11.7.2 |
| Migration count in fresh MySQL | 1 |
| Validate on migrate | Enabled |

V901 was validated in an empty MySQL container, in the QA named volume, after backend restart, after MySQL restart, and after full stack stop/start. The restart IT confirmed the same `installed_rank` and checksum across two independent Spring contexts.

V901 contains the final three LONGTEXT mappings. It has been consumed by the local QA volume and is frozen at the final backend SHA. Any future schema change must use V902 or later.

Observed non-fatal warnings:

- Flyway 11.7.2 reports MySQL 8.4 newer than its tested maximum of 8.1.
- MySQL reports integer display-width deprecation for `TINYINT(1)` declarations.

Result: `FLYWAY_V901_INTEGRITY: PASS`; warnings remain tracked.
