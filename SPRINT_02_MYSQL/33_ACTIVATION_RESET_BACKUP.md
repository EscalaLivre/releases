# Activation Reset Backup

Generated and validated before destructive QA cleanup on `2026-07-22`.

## Gates

| Gate | Result |
|---|---|
| `ACTIVATION_RESET_BACKUP_CREATED` | PASS |
| `ACTIVATION_RESET_BACKUP_RECOVERY_VERIFIED` | PASS |
| Windows current-user recovery | PASS |
| SQLite recovered snapshot integrity | `ok` |
| Portable RSA vault recovery | PASS |
| Backend public-material match | PASS |
| Owner-only backup ACL audit | PASS |

## Pre-reset Bundle

| Item | Value |
|---|---|
| Format | `ELAMRESET` v1 |
| Encryption | AES-256-GCM with scrypt-derived key |
| Encrypted entries | 17 |
| Encrypted file size | 806285 bytes |
| SHA-256 | `119f64daace7166a33d9b113a67cdc8695ff0abb0b19513664542e0e1b98e21c` |
| Database schema | v2 |
| Customers / installations / licenses | 2 / 2 / 2 |
| Audit events | 11 |
| Legacy database files and sidecars | 9 |
| Signing key | RSA-3072, preserved |

## Consolidated Bundle

| Item | Value |
|---|---|
| Encrypted entries | 41 |
| Encrypted file size | 1863065 bytes |
| SHA-256 | `79f9c4b419f1558d1a7c796c8f795273cdfa4f505676172ea042882b06d4ecc8` |
| Embedded pre-reset bundle | Recovery reverified |
| Preserved QA-server directories | 8 |
| Preserved QA-server files | 27 |
| Clean database snapshot | schema v4, zero operational rows |

The backup files, recovery key, portable vault, private key, and fingerprint are deliberately excluded from Git and from the release. This evidence records only non-secret integrity metadata.
