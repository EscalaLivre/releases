# Agent D Security Report - Reconciled

Artifact label retained for continuity. Final review scope includes the backend SHA and canonical QA bundle.

Implemented controls:

- Random DB root password, DB user/password, JWT secret, bridge secret, and QA nonce generated locally with a CSPRNG.
- Filled `.env` is excluded from source and installer build inputs.
- `.env` ACL inheritance is removed and only the current Windows user receives FullControl.
- Private keys and complete JWS/JWT patterns are rejected by the build guard.
- Logs/evidence redact headers, environment secrets, generic credentials, JSON credential fields, and JWS/private-key material.
- MySQL is network-internal; only backend health is exposed on localhost.
- Default admin password bootstrap is disabled.
- Full removal requires two exact confirmations and now removes prior preserved copies.
- Preserve removal keeps credentials compatible with the preserved MySQL volume and fails closed when they are missing.

Known limitation: the QA EXE is unsigned. Integrity depends on private distribution plus attached SHA-256 verification.

Result: `AGENT_D_SECURITY_REVIEW: PASS_WITH_UNSIGNED_LIMITATION`.
