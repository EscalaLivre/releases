# Docker and Testcontainers Compatibility

| Component | Version/configuration | Result |
|---|---|---|
| Docker client/server | 29.6.1 / 29.6.1 | PASS |
| Testcontainers | 1.21.4 | PASS |
| MySQL image | `mysql:8.4.0` | PASS |
| QA backend base | Eclipse Temurin Java 21 JRE Alpine | PASS |
| Compose validation | `docker compose config --quiet` | PASS |

Isolation controls:

- Project name `escalalivre-qa-sprint2`.
- Resources use the `escalalivre-qa-*` namespace.
- MySQL has no host port mapping.
- Backend binds only `127.0.0.1:8087`.
- Backend runs as UID/GID 10001, read-only root filesystem, tmpfs `/tmp`, and `no-new-privileges`.
- Persistent volumes are named explicitly and no script uses prune or `down -v`.

Final EXE smoke created and removed only the two QA containers and QA network. The pre-existing total of 22 non-QA containers was unchanged after uninstall; the two QA named volumes were intentionally preserved.

Result: `DOCKER_TESTCONTAINERS_COMPATIBILITY: PASS_LOCAL`.
