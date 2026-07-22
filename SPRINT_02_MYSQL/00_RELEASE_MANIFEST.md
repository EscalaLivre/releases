# Sprint 2 MySQL - Release Manifest

Generated: `2026-07-22`

## Scope

- Backend: `EscalaLivre/backend`
- Final backend SHA: `079ce3c4c12846f5cd6229bca36a92c1a30d31f8`
- GitHub `main`: same SHA
- GitLab `main`: same SHA
- Private QA release: `v1.0.0-qa.s2.1`
- Release URL: https://gitlab.com/jf.aschenbrenner/escalalivre-backend/-/releases/v1.0.0-qa.s2.1
- Canonical bundle source: `backend/qa-server-bundle`

This directory contains exactly one numbered artifact for every identifier from `00` through `32`. The obsolete partial `qa-bundle` copy was removed; binaries and secrets are not stored in this documentation repository.

## Evidence Groups

| Range | Content |
|---|---|
| 00 | Manifest and gates |
| 01-08 | SQL, schema, Flyway, tests, and database compatibility |
| 09-17 | Focused audits, security, issues, and CI |
| 18-24 | Performance, environment, plans, and findings |
| 25-28 | Final issue/audit/local/E2E evidence |
| 29-32 | Gate, final SHA/pipeline, restart, and human review |

## Current Gates

```text
MYSQL_COMPATIBILITY_PROVEN: TECHNICALLY_PASS
SPRINT_2_FINAL_GATE: PENDING_HUMAN_REVIEW
HUMAN_INSTALL_RESTART_VALIDATION: PENDING
QA_INSTALLER_CLEAN_MACHINE_TEST: PENDING
SPRINT_3_SERVER_MINIMAL_AUTHORIZED: NO
```

Automated evidence must not change a human gate to PASS.
