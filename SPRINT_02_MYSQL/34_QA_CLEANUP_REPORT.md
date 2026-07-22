# QA Cleanup Report

## Authorized Scope

- Activation Manager records classified as QA and cryptographically bound to the verified pre-reset backup.
- Nine legacy Activation Manager backup files and SQLite sidecars.
- Eight `QA-Server-Sprint2-Preserved-*` directories containing 27 QA files.
- Docker resources named or labeled for project `escalalivre-qa-sprint2`.
- Empty local `qa-bundle` directory contradicted by the existing manifest.

One customer had an explicit QA text marker. The second was manually reviewed as synthetic QA data; that approval was accepted only for the exact verified backup SHA-256. No orphan customer, installation, or license rows existed.

## Result

| Resource | Before | After |
|---|---:|---:|
| Activation Manager customers | 2 | 0 |
| Installations | 2 | 0 |
| Licenses | 2 | 0 |
| Audit events | 11 | 0 |
| Sync rows | 0 | 0 |
| Legacy manager files | 9 | 0 |
| Preserved QA-server directories | 8 | 0 |
| QA Docker containers | 0 | 0 |
| QA Docker volumes | 2 | 0 |
| QA Docker networks | 0 | 0 |
| QA Docker images | 1 | 0 |
| Unrelated Docker containers | 22 | 22 |

The Activation Manager database was recreated at schema v4 with integrity `ok`. The RSA-3072 signing key remained byte-for-byte unchanged and unlocked successfully after reset.

Both private activation registries remained empty. No repository, branch, non-QA Docker resource, global cache, or Docker configuration was pruned.

Result: `ACTIVATION_QA_DATA_RESET: PASS`.
