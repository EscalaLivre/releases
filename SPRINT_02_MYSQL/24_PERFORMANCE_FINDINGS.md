# Performance Findings

1. Assignment persistence is the dominant measured path on both databases: approximately 919 ms mean for 310 assignments. The current implementation deletes and rewrites assignments one row at a time.
2. MySQL and SQLite produced nearly identical means for that write path, indicating application/JDBC round trips dominate more than engine choice in this local setup.
3. MySQL repository reads remained below 3.5 ms mean in the large-list scenario and below 1.3 ms mean for assignment reads.
4. MySQL 20-client employee listing completed with zero errors and p95 14.230 ms.
5. MySQL startup at 15.946 s includes Testcontainers and MySQL process initialization; it is not an application-only cold-start number.
6. The employee-by-department plan uses `idx_emp_dept` plus filesort. No index change is justified without production-like cardinality and an explicit target.
7. The benchmark records JVM allocated heap, not RSS or CPU utilization.

No SLA, regression threshold, or production workload was supplied. These findings are a reproducible local baseline, not a capacity certification.

Result: `PERFORMANCE_BLOCKER_FOUND: NO`; `PERFORMANCE_TUNING_REQUIRED_NOW: NO`.
