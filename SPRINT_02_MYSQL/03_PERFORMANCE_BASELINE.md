# Performance Baseline

Execution date: `2026-07-22`

Method:

- One warmup run and five measured runs per serial scenario.
- Concurrency scenarios use one warmup round and five measured rounds.
- Durations use `System.nanoTime()` with sub-millisecond precision.
- Results include min, mean, median, p95, max, standard deviation, status, and error count.
- SQLite and MySQL ran in separate Maven processes.
- Startup is JVM-to-`ApplicationReady`; MySQL startup includes Testcontainers and container initialization.

Results:

| Database | Tests | Failures | Startup ms | Save 310 assignments mean ms | 20-client employee-list p95 ms |
|---|---:|---:|---:|---:|---:|
| SQLite | 22 | 0 | 3251 | 919.282 | 2.543 |
| MySQL 8.4.0 | 22 | 0 | 15946 | 919.844 | 14.230 |

No acceptance threshold was supplied, so this artifact records a baseline rather than claiming an SLA. Full data is in `20_PERFORMANCE_RESULTS.csv`.

Result: `PERFORMANCE_BASELINE_RECORDED: YES`.
