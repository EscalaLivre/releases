# Final Release Report - v1.0.0-qa.s2.2

## Release

| Item | Value |
|---|---|
| Private release | https://gitlab.com/jf.aschenbrenner/escalalivre-backend/-/releases/v1.0.0-qa.s2.2 |
| Tag | `v1.0.0-qa.s2.2` |
| Tag type | annotated |
| Tag target | `9c7bedac1aa10430501bde51b75b2fb568df9afc` |
| Main pipeline | `2698077013` / success / 5 of 5 |
| Tag pipeline | `2698112641` / success / 5 of 5 |
| Direct uploaded assets | 8 |
| Total GitLab assets including source archives | 12 |
| Remote asset integrity | PASS, 8 of 8 |

The prior `v1.0.0-qa.s2.1` release remains unchanged.

## Final State

- Encrypted recovery backup: PASS.
- QA-only Activation Manager reset: PASS.
- RSA-3072 signing key preservation: PASS.
- Private activation registries empty: PASS.
- Final QA Docker resource count: zero.
- Unrelated Docker containers preserved: 22.
- Backend and Activation Manager GitHub/GitLab branch parity: PASS.
- Clean installer build, install, restart, removal, and remote hash verification: PASS.

## Gates

```text
ACTIVATION_RESET_BACKUP_CREATED: PASS
ACTIVATION_RESET_BACKUP_RECOVERY_VERIFIED: PASS
ACTIVATION_QA_DATA_RESET: PASS
CLEAN_STRUCTURE_AUDIT: PASS
POST_RESET_AUTOMATED_TESTS: PASS
CLEAN_INSTALLER_RELEASE_INTEGRITY: PASS
MYSQL_COMPATIBILITY_PROVEN: TECHNICALLY_PASS
READY_FOR_HUMAN_MANUAL_VALIDATION: YES
HUMAN_INSTALL_RESTART_VALIDATION: PENDING
QA_INSTALLER_CLEAN_MACHINE_TEST: PENDING
SPRINT_2_FINAL_GATE: PENDING_HUMAN_REVIEW
SPRINT_3_SERVER_MINIMAL_AUTHORIZED: NO
```

Automated work is complete. Final Sprint 2 approval still requires an identified human reviewer using the attached guide, checklist, and clean-machine plan.
