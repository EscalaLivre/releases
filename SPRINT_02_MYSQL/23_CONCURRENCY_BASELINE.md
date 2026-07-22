# Concurrency Baseline

Each scenario used one warmup round and five measured rounds. Statistics include all client actions from those measured rounds.

| Database | Scenario | Clients | Mean ms | P95 ms | Max ms | Errors |
|---|---|---:|---:|---:|---:|---:|
| SQLite | SELECT 1 | 1 | 0.022 | 0.040 | 0.040 | 0 |
| SQLite | SELECT 1 | 5 | 0.071 | 0.161 | 0.188 | 0 |
| SQLite | List departments | 5 | 0.346 | 0.571 | 0.598 | 0 |
| SQLite | List employees | 20 | 1.387 | 2.543 | 2.915 | 0 |
| MySQL | SELECT 1 | 1 | 0.644 | 0.727 | 0.727 | 0 |
| MySQL | SELECT 1 | 5 | 1.834 | 3.104 | 3.117 | 0 |
| MySQL | List departments | 5 | 2.350 | 3.965 | 3.972 | 0 |
| MySQL | List employees | 20 | 7.810 | 14.230 | 15.375 | 0 |

Timeouts and action exceptions are test failures in the final harness; none occurred.

Result: `CONCURRENCY_BASELINE: PASS_WITH_ZERO_ERRORS`.
