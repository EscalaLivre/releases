# Post-reset Test Report

## Activation Manager

| Check | Result |
|---|---|
| TypeScript typecheck | PASS |
| Vitest | 120 passed, 2 opt-in integrations skipped |
| Production build | PASS |
| Pre-reset recovery verification | PASS, 17 encrypted entries |
| Consolidated recovery verification | PASS, 41 encrypted entries |
| Post-reset database audit | schema v4, integrity `ok`, zero operational rows |
| GitHub Actions `29946981601` | PASS |
| GitLab pipeline `2698091666` | PASS, 4/4 |

The GitLab pipeline image was aligned with Node 22 after the previous Node 20 Alpine configuration failed before tests while building `better-sqlite3`.

## Backend

| Check | Result |
|---|---|
| Default Maven suite | 142 discovered, 122 passed, 20 MySQL tests skipped |
| `mysql-it` Maven suite | 142/142 passed |
| PowerShell parser | 11 files, zero errors |
| GitHub Actions `29946417773` | PASS |
| GitLab main pipeline `2698077013` | PASS, 5/5 |
| GitLab tag pipeline `2698112641` | PASS, 5/5 |

## Clean Installer Smoke

The first true zero-volume run exposed and fixed a PowerShell native-error path when `docker volume inspect` returned not found. The next run exposed and fixed a MySQL entrypoint collision caused by setting `MYSQL_PWD` to the application-user password inside the database container.

The final rebuilt installer passed:

- Silent installation exit code 0.
- Backend health `UP` and activation state `NOT_ACTIVATED` with an Installation ID.
- Backend bound only to `127.0.0.1:8087`.
- MySQL had no host port.
- Image label `1.0.0-qa.s2.2`.
- Eight Start Menu shortcuts and packaged activation guide.
- Hidden `.env` with a single current-user FullControl ACL.
- Stop/start returned to `UP`.
- Full removal deleted only QA resources.
- Repeated full removal passed with resources already absent.

Result: `POST_RESET_AUTOMATED_TESTS: PASS`.
