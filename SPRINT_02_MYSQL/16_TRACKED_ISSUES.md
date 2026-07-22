# Tracked Issues and Limitations

| ID | Item | Severity | Status |
|---|---|---|---|
| S2-01 | Clean Windows VM matrix not executed | Gate | PENDING HUMAN |
| S2-02 | Human functional installer checklist not signed | Gate | PENDING HUMAN |
| S2-03 | QA EXE is not Authenticode signed | Expected limitation | OPEN / DOCUMENTED |
| S2-04 | Flyway 11.7.2 warns MySQL 8.4 exceeds tested maximum 8.1 | Low residual risk | OPEN / TESTS PASS |
| S2-05 | MySQL warns about `TINYINT(1)` display width | Low | OPEN / NON-FATAL |
| S2-06 | V901 was changed before freeze and is now present in a local QA volume | Migration discipline | FROZEN; USE V902+ |
| S2-07 | No external performance SLA or threshold supplied | Informational | BASELINE ONLY |
| S2-08 | Destructive remove-all path should be exercised only in disposable VM/snapshot | Gate | PENDING HUMAN |

No item authorizes Sprint 3. No global Docker prune operation is permitted.
