# Final GitLab Pipeline Evidence

| Field | Value |
|---|---|
| Project visibility | private |
| Backend SHA | `079ce3c4c12846f5cd6229bca36a92c1a30d31f8` |
| Pipeline ID | `2695932975` |
| Pipeline IID | `3` |
| Source | push to `main` |
| Started | `2026-07-22T05:21:13.368Z` |
| Finished | `2026-07-22T05:26:15.307Z` |
| Duration | 295 s |
| Status | `success` |
| URL | https://gitlab.com/jf.aschenbrenner/escalalivre-backend/-/pipelines/2695932975 |

| Job | Job ID | Duration s | Status |
|---|---:|---:|---|
| build | 15468137823 | 42.756 | success |
| test | 15468137824 | 56.893 | success |
| mysql-integration | 15468137825 | 153.291 | success |
| secret-scan | 15468137826 | 15.518 | success |
| package | 15468137827 | 42.608 | success |

The MySQL job executes the 142-test profile and the separate `MySQLRestartPersistenceIT` command. Package artifact retention is 30 days.

Result: `FINAL_GITLAB_PIPELINE_5_OF_5: PASS`.
