# Task 14 — Migration Manifest

## Migrated Assets

| Source (backend/qa-server-bundle) | Dest (server/) | Type |
|-----------------------------------|---------------|------|
| `.gitignore` | `.gitignore` | MOVE |
| `VERSION` | `VERSION` | MOVE |
| `payload/docker-compose.qa.yml` | `bootstrap/docker/compose/docker-compose.yml` | REWRITE |
| `payload/backend/Dockerfile` | `bootstrap/docker/images/backend.Dockerfile` | MOVE |
| `payload/config/.env.template` | `bootstrap/docker/config/.env.template` | MOVE |
| `payload/config/application-qa.yml` | `bootstrap/docker/config/application-server.yml` | RENAME |
| `payload/scripts/install.ps1` | `bootstrap/windows/scripts/install.ps1` | REWRITE |
| `payload/scripts/Install-Secrets.ps1` | `bootstrap/windows/scripts/Install-Secrets.ps1` | REWRITE |
| `payload/scripts/start.ps1` | `bootstrap/windows/scripts/start.ps1` | REWRITE |
| `payload/scripts/stop.ps1` | `bootstrap/windows/scripts/stop.ps1` | REWRITE |
| `payload/scripts/status.ps1` | `bootstrap/windows/scripts/status.ps1` | REWRITE |
| `payload/scripts/logs.ps1` | `bootstrap/windows/scripts/logs.ps1` | REWRITE |
| `payload/scripts/uninstall.ps1` | `bootstrap/windows/scripts/uninstall.ps1` | REWRITE |
| `payload/scripts/validate-restart.ps1` | `bootstrap/windows/scripts/validate-restart.ps1` | REWRITE |
| `payload/scripts/modules/Common.psm1` | `bootstrap/windows/scripts/modules/Common.psm1` | REWRITE |
| `payload/scripts/modules/Sanitize-Output.psm1` | `bootstrap/windows/scripts/modules/Sanitize-Output.psm1` | MOVE |
| `build-installer.ps1` | `bootstrap/installer/build-installer.ps1` | REWRITE |
| `setup/installer.nsi` | `bootstrap/installer/installer.nsi` | REWRITE |
| `docs/QA_README.md` | `docs/qa/QA_README.md` | MOVE |
| `docs/ACTIVATION_GUIDE.md` | `docs/qa/ACTIVATION_GUIDE.md` | MOVE |
| `docs/MANUAL_VALIDATION_CHECKLIST.md` | `docs/qa/MANUAL_VALIDATION_CHECKLIST.md` | MOVE |
| `docs/TROUBLESHOOTING.md` | `docs/qa/TROUBLESHOOTING.md` | MOVE |
| `docs/CLEAN_MACHINE_TEST_PLAN.md` | `docs/qa/CLEAN_MACHINE_TEST_PLAN.md` | MOVE |

## Not Migrated

| Asset | Reason |
|-------|--------|
| `dist/` (installer, checksums) | Build output; gitignored |
| `payload/backend/escalalivre-backend.jar` | Binary artifact; gitignored |
| `payload/evidence/` | Sprint 2 evidence; preserved in releases/SPRINT_02_MYSQL |
| `payload/logs/` | Runtime logs; gitignored |
| `payload/desktop-inventory.json` | QA inventory for unified installer; no longer relevant |

## Deleted from Backend

All migrated source files removed from `backend/qa-server-bundle/`. The entire
directory was deleted after confirmation that the canonical copy exists in
the `server/` repository.

## Commit Hashes

| Repository | Commit |
|------------|--------|
| server (GitHub) | `691bf84` |
| server (GitLab) | `691bf84` |
| backend (GitHub) | `28bb27e` |
| backend (GitLab) | `28bb27e` |
