# Unified Desktop + Server Installer - v1.0.0-qa.s2.3 Hotfix

## Overview

**QA-INSTALLER-CLIENT-001**: Hotfix to unify the Electron RC11 desktop app with the Docker/MySQL QA server bundle into a single NSIS installer. The resulting installer contains both the QA Docker backend (Docker Compose + MySQL 8.4.0 + Backend JAR) and the full Electron RC11 client (win-unpacked with JRE, JAR, frontend SPA, bridge security).

The Electron app detects `--docker-mode` at startup and connects to the Docker backend instead of spawning a local Java process.

## Release

| Item | Value |
|---|---|
| GitHub release | https://github.com/EscalaLivre/releases/releases/tag/v1.0.0-qa.s2.3 |
| GitLab release | https://gitlab.com/jf.aschenbrenner/escalalivre-backend/-/releases/v1.0.0-qa.s2.3 |
| Desktop commit | `8ed9e54` — `feat(hotfix): add Docker mode detection, bridge secret from .env, and awaitDockerBackend boot flow` |
| Backend (bundle) commit | `8df4ebc` — `feat(hotfix): unified QA installer with Electron Docker mode support` |
| Tag | `v1.0.0-qa.s2.3` |
| Tag type | annotated |

## Installer Assets

Built from `backend/qa-server-bundle/dist/`:

| Asset | Size | SHA-256 |
|---|---|---|
| `EscalaLivre-QA-Server-Sprint2-Setup.exe` | 182 MB | `97f0cb694b33f6bca5bc43ea7db757bd09c52f23c004115097127103831b3594` |
| `EscalaLivre-QA-Server-Sprint2-Setup.exe.sha256` | 107 B | `06520d52a582c0f56a0dc9a71e119e281ce27d11939e0ba75569f2b2bd8a5514` |
| `desktop-inventory.json` | 2233 B | `472ee0802f8382ad9a7d484f0281df6ac856fba6980b5c02eea2a9cfbbff49f6` |
| `CHECKSUMS.txt` | 756 B | `a20ad99a9afb382476ca3353af333daebd27f7e4ae6385aac7363c0ec21df02e` |

Release documentation (ACTIVATION_GUIDE.md, QA_README.md, MANUAL_VALIDATION_CHECKLIST.md, TROUBLESHOOTING.md, CLEAN_MACHINE_TEST_PLAN.md) also included.

## Verification

- Desktop EXE byte-for-byte identical between source (`desktop/dist/win-unpacked/`) and staged installer payload: PASS
- ASAR contains Docker mode code (`dockerMode`, `awaitDockerBackend`, `loadDockerBridgeSecret`): PASS
- NSIS compilation with desktop section: PASS
- Secret scan (private keys, JWT) on staged source: PASS
- All 8 assets present in CHECKSUMS with verified SHA-256 hashes: PASS

## Hotfix Gates

```text
QA-INSTALLER-CLIENT-001: PASS
MYSQL_COMPATIBILITY_PROVEN: TECHNICALLY_PASS (unchanged from s2.2)
SPRINT_2_FINAL_GATE: PENDING_HUMAN_REVIEW (unchanged from s2.2)
SPRINT_3_SERVER_MINIMAL_AUTHORIZED: NO (unchanged)
```

## Modified Source Files

### Desktop (`src/main/index.js`)
- `const dockerMode` — detects `--docker-mode` CLI arg or `ESCALA_DOCKER_MODE=true`
- `loadDockerBridgeSecret()` — reads `ESCALA_DESKTOP_BRIDGE_SECRET` from `%LOCALAPPDATA%\EscalaLivre\QA-Server-Sprint2\config\.env`
- `awaitDockerBackend()` — health-check loop (CHECKING→WAITING→READY|ERROR)
- Boot flow branches: Docker mode skips `validateResources()`, `startBackend()`, uses `awaitDockerBackend()`
- `window-all-closed`/`before-quit`: does not kill `backendProc` (null in Docker mode)

### Backend (qa-server-bundle)
- `setup/installer.nsi`: new `SEC_DESKTOP` section, CreateShortCut with `--docker-mode`
- `build-installer.ps1`: `-DesktopAppPath` param, robocopy staging
- `payload/scripts/install.ps1`: auto-launch Electron after Docker bootstrap
- `payload/desktop-inventory.json`: SHA-256 manifest for staged win-unpacked
