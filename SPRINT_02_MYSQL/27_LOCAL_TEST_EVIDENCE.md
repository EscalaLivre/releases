# Final Local Test and Package Evidence

## Backend Package

| Field | Value |
|---|---|
| File | `target/escalalivre-backend.jar` |
| Size | 75,556,374 bytes |
| SHA-256 | `fa8ca38c13002d067576292e7d2f1c54a8abc88191a1e0e7976e94ad8364b78f` |
| Trivy HIGH/CRITICAL | 0 / 0 |

## QA Installer

| Field | Value |
|---|---|
| File | `EscalaLivre-QA-Server-Sprint2-Setup.exe` |
| Size | 67,655,646 bytes |
| SHA-256 | `e9e09ff8e947a41fa608a274c6da9e7fcae5e1609b285cc8df817f287d8f92db` |
| Authenticode | `NotSigned` |
| NSIS | 3.12 |

Final smoke observations:

- Silent install exit code 0.
- MySQL and backend containers became healthy.
- `/api/health` returned `status=UP`.
- MySQL exposed no host port; backend bound `127.0.0.1:8087`.
- Eight Start Menu shortcuts were created.
- `.env` had one explicit FullControl ACL for the current user and no inherited rule.
- Sanitized logs contained no observed credential material.
- Silent preserve-data uninstall exit code 0.
- Install root, shortcuts, QA containers, and QA network were removed.
- Two named QA volumes were preserved.
- The pre-existing total of 22 non-QA containers was unchanged.

The EXE and `.sha256` were downloaded again from the private release through the authenticated GitLab API. Remote size and SHA-256 matched the local files exactly.
