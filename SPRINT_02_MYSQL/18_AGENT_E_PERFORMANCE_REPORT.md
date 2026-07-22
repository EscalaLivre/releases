# Agent E Performance Report - Reconciled

Artifact label retained for continuity. The prior three-run, whole-millisecond output was discarded and regenerated after the harness correction.

Final methodology:

- 1 warmup plus 5 measured serial runs.
- 1 warmup plus 5 measured rounds for concurrency.
- Nanosecond monotonic clock converted to fractional milliseconds.
- Failed or timed-out concurrency actions fail the test.
- CSV fields are quoted where needed and carry aggregate distribution statistics.

Key observations:

- All 44 benchmark tests passed.
- Assignment replacement of 310 rows dominates both engines at about 919 ms mean.
- MySQL 20-client employee-list p95 was 14.230 ms with zero errors.
- SQLite 20-client employee-list p95 was 2.543 ms with zero errors.
- MySQL startup includes container creation and must not be compared directly with an already-local database startup.

Result: `PERFORMANCE_HARNESS_VALID: YES`; `PERFORMANCE_SLA: NOT_DEFINED`.
