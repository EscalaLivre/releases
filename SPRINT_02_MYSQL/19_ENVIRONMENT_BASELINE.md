# Environment Baseline

Execution host:

| Component | Value |
|---|---|
| OS | Windows 11 x64 (`10.0`) |
| Java | Eclipse Temurin 21.0.10 LTS |
| Maven | 3.9.9 |
| Docker client/server | 29.6.1 / 29.6.1 |
| NSIS | 3.12 |
| Gitleaks | 8.30.1 |
| Trivy | 0.70.0 |
| MySQL test image | 8.4.0 |
| Spring Boot | 3.5.16 |
| Testcontainers | 1.21.4 |

Benchmark conditions:

- SQLite and MySQL suites ran sequentially in separate Maven processes.
- MySQL image was locally available, but Testcontainers startup remained part of the startup metric.
- Dataset labels describe inserted logical records, not production data.
- Memory in the CSV is JVM allocated heap (`Runtime.totalMemory`), not process RSS.
- Results are a development-machine baseline and not a production capacity claim.
