# Activation Guide - Sprint 2 QA

This flow applies only to private pre-release `1.0.0-qa.s2.2`. Use synthetic data and a short-lived, non-commercial license marked for QA.

## 1. Obtain the Installation ID

After the QA stack reports `UP`, open:

```text
http://127.0.0.1:8087/api/activation/installation-id
```

Retain only the `installationId` value. Do not publish the populated `.env`, raw logs, cookies, or local secrets.

## 2. Issue a Synthetic License

In Escala Livre Activation Manager:

1. Authenticate with the authorized account.
2. Confirm that the preserved RSA vault is available. Do not generate a replacement key.
3. Create a synthetic customer explicitly marked QA.
4. Register a homologation installation using the exact Installation ID.
5. Issue a short-lived license with minimum limits for the validation script and a non-commercial QA note.
6. Keep the JWS only as long as required to apply activation.

Do not export the private key. Do not place a complete JWS, vault password, token, fingerprint, or recovery key in evidence.

## 3. Validate and Apply

Use the authenticated technical administration flow in the Escala Livre desktop application:

1. Paste the license into the activation field.
2. Validate without persistence first.
3. Confirm the Installation ID, QA marker, expiration, and limits.
4. Apply only when every field matches.

Public `POST /api/activation/apply` intentionally returns `410 TECHNICAL_PROVISIONING_REQUIRED`. Do not bypass this control.

## 4. Confirm and Sanitize

Open:

```text
http://127.0.0.1:8087/api/activation/status
```

The expected state is `ACTIVE`. Clear the clipboard, keep the full license out of screenshots and logs, and continue with `MANUAL_VALIDATION_CHECKLIST.md`.

```text
MYSQL_COMPATIBILITY_PROVEN: TECHNICALLY_PASS
SPRINT_2_FINAL_GATE: PENDING_HUMAN_REVIEW
SPRINT_3_SERVER_MINIMAL_AUTHORIZED: NO
```
