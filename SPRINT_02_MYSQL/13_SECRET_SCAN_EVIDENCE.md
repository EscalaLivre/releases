# Secret Scan Evidence

Tool: Gitleaks `8.30.1`

Commands:

```powershell
gitleaks git . --no-banner --redact --config .gitleaks.toml --log-opts="--all"
gitleaks dir . --no-banner --redact --config .gitleaks.toml
gitleaks dir qa-server-bundle --no-banner --redact --config .gitleaks.toml
```

Final results:

| Target | Result |
|---|---|
| Git history | 16 commits scanned; no leaks found |
| Backend working tree | no leaks found |
| Canonical bundle source | no leaks found |
| GitLab `secret-scan` job `15468137826` | success |

The CI image is pinned to `zricethezav/gitleaks:v8.30.1`; it no longer uses a mutable `latest` tag.

Result: `SECRET_SCAN: PASS`.
