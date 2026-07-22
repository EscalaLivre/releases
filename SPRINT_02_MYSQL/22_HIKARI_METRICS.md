# HikariCP Metrics

Point-in-time snapshots captured immediately after each benchmark Spring context became ready:

| Database | Active | Idle | Total | Awaiting | Max pool | Min idle |
|---|---:|---:|---:|---:|---:|---:|
| SQLite | 0 | 1 | 1 | 0 | 1 | 1 |
| MySQL | 0 | 1 | 1 | 0 | 1 | 1 |

Shared settings observed:

| Setting | Value ms |
|---|---:|
| Connection timeout | 30000 |
| Idle timeout | 600000 |
| Max lifetime | 1800000 |

The snapshots prove the pool was healthy and had no waiter at capture time. They do not independently prove the absence of transient waiting during every operation. The separate concurrency tests completed with zero errors/timeouts.

Result: `HIKARI_SNAPSHOT: HEALTHY`.
