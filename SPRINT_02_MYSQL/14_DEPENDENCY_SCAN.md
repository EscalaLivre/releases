# Dependency Scan

Tool: Trivy `0.70.0`

Commands:

```powershell
trivy fs --scanners vuln --severity HIGH,CRITICAL --exit-code 1 --no-progress pom.xml
trivy rootfs --scanners vuln --severity HIGH,CRITICAL --exit-code 1 --no-progress target\escalalivre-backend.jar
```

| Target | HIGH | CRITICAL | Result |
|---|---:|---:|---|
| `pom.xml` | 0 | 0 | PASS |
| `escalalivre-backend.jar` | 0 | 0 | PASS |

Relevant versions:

| Component | Version |
|---|---|
| Spring Boot | 3.5.16 |
| Spring Framework | 6.2.19 |
| Bouncy Castle | 1.84 |
| MySQL Connector/J | 8.4.0 |
| Testcontainers | 1.21.4 |
| Flyway | 11.7.2 |

Scope is HIGH/CRITICAL vulnerability detection only. Result: `DEPENDENCY_HIGH_CRITICAL_GATE: PASS`.
