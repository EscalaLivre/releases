# Clean Installer Evidence

## Binary

| Item | Value |
|---|---|
| File | `EscalaLivre-QA-Server-Sprint2-Setup.exe` |
| Product version | `1.0.0-qa.s2.2` |
| Windows file version | `1.0.0.2` |
| Size | 67656254 bytes |
| SHA-256 | `b1dacf62fffcbbbe5785437e2a9ef06141c6cff978ef1b9dffbc7faf6182122d` |
| Authenticode | `NotSigned` |
| Backend source | `9c7bedac1aa10430501bde51b75b2fb568df9afc` |

The packaged JAR matched the freshly built Maven artifact. The source payload had no populated `.env`; runtime secrets were generated only after installation and were protected for the current Windows user.

## Private Release Assets

| Asset | Bytes | SHA-256 |
|---|---:|---|
| `EscalaLivre-QA-Server-Sprint2-Setup.exe` | 67656254 | `b1dacf62fffcbbbe5785437e2a9ef06141c6cff978ef1b9dffbc7faf6182122d` |
| `EscalaLivre-QA-Server-Sprint2-Setup.exe.sha256` | 107 | `44d2844f79a9b4f251524924ba0bed0ca9f822bf2df3f3c41b435a6a2df2e744` |
| `CHECKSUMS.txt` | 666 | `7eeb0fdaa1c80ece52fec8521bb54ece218f00d09a308d4c5fc27ddbdfedccb8` |
| `QA_README.md` | 3748 | `86e96e8b9ae1499dbcfbf14ec4b2405285047f215841ca5da9ed458e09cb4568` |
| `ACTIVATION_GUIDE.md` | 2101 | `7ccf99d1c255a630e86c3cc541ce52f81925c8191b81051ca181e394550aae2d` |
| `MANUAL_VALIDATION_CHECKLIST.md` | 3429 | `466415e0118dff22687fc0c587864407eb0791c789afd4dd6f76b81997f4c282` |
| `TROUBLESHOOTING.md` | 2621 | `6340ed743f22bdda4f4a94ab13502ec82b105622e238870f72ffdc8357356199` |
| `CLEAN_MACHINE_TEST_PLAN.md` | 1909 | `1767682f39035040afd62b4550f9fd546f93b41eff98e9424f1986cd680256e3` |

All eight assets were downloaded through the authenticated GitLab project-upload API. Every remote byte count and SHA-256 matched the local release source.

Result: `CLEAN_INSTALLER_RELEASE_INTEGRITY: PASS`.
