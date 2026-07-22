# MySQL SQL EXPLAIN Report

Collected on `2026-07-22` from the QA MySQL 8.4.0 named volume using synthetic data.

| Repository query | Access type | Selected key | Rows estimate | Extra |
|---|---|---|---:|---|
| Employee by department, ordered by name | `ref` | `idx_emp_dept` | 1 | `Using filesort` |
| Schedule by department/year/month | `const` | `uq_schedule_month` | 1 | none |
| Assignments by schedule | `ref` | `uq_assign_sched_emp_day` | 1 | none |
| Latest audit rows by descending ID | `index` | `PRIMARY` | 2 | `Backward index scan` |

Interpretation:

- Predicate indexes are selected for the three filtered domain queries.
- Employee ordering still requires a filesort because the index covers department, not `(department_id, name)`.
- The measured synthetic set is too small to justify a new composite index solely from this result.
- Audit pagination uses reverse primary-key traversal for `ORDER BY id DESC LIMIT 50`.

Result: `MYSQL_EXPLAIN_BASELINE: RECORDED`; production-cardinality tuning remains out of scope.
