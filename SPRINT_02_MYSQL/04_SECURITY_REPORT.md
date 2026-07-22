# Security Report

Final SHA: `079ce3c4c12846f5cd6229bca36a92c1a30d31f8`

| Check | Tool/version | Result |
|---|---|---|
| Git history secret scan | Gitleaks 8.30.1 | 16 commits, zero leaks |
| Working tree secret scan | Gitleaks 8.30.1 | zero leaks |
| POM dependency scan | Trivy 0.70.0 | zero HIGH/CRITICAL |
| Packaged JAR scan | Trivy 0.70.0 | zero HIGH/CRITICAL |
| Bundle source secret scan | Gitleaks 8.30.1 | zero leaks |
| Installer signature | Windows Authenticode | `NotSigned` |

Dependency remediation included Spring Boot `3.5.16` and Bouncy Castle `1.84`.

The Trivy result is limited to HIGH and CRITICAL severities; it must not be restated as zero findings at every severity. The unsigned installer is an explicit QA limitation and requires SHA-256 verification before SmartScreen bypass.

Result: `AUTOMATED_SECURITY_GATE: PASS_WITH_UNSIGNED_QA_LIMITATION`.
