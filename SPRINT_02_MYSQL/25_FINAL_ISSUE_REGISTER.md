# Final Issue Register

## Closed Before Release

| Item | Resolution |
|---|---|
| MySQL free-text columns constrained as JSON | Three columns changed to LONGTEXT in V901 |
| UTF-8 test did not exercise emoji/CJK | Real round-trip coverage added |
| Restart test reused one Spring context | Replaced by two-context `MySQLRestartPersistenceIT` |
| Benchmark used three integer-ms measurements | Replaced by 1+5 fractional-ms statistics |
| Concurrent warmup exceptions were ignored | Exceptions now fail the benchmark |
| CI omitted restart IT | MySQL job now runs it explicitly |
| Gitleaks CI image used `latest` | Pinned to v8.30.1 |
| Preserve-data full removal left old copies | Confirmed remove-all path now deletes preserved directories |
| Log sanitizer missed JSON credentials | JSON key/value patterns added and tested |
| Partial duplicate release bundle | Removed; canonical source is backend bundle |

## Open Gates

| Item | Owner | Status |
|---|---|---|
| Clean-machine Windows matrix | Human QA | PENDING |
| Manual activation/admin/data/XLSX flow | Human QA | PENDING |
| Destructive remove-all test in disposable environment | Human QA | PENDING |
| Human decision and identity | Human reviewer | PENDING |

There is no open automated blocker for private QA delivery. Open human gates prevent Sprint 2 final closure and Sprint 3 authorization.
