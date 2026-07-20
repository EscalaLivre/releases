# Test & Build Matrix — RC11

| Modulo | Testes | Build | Observacao |
|---|---|---|---|
| contracts | 6/6 PASS | build PASS | Consistentes |
| backend | 122 PASS, BUILD SUCCESS | JAR gerado | Fingerprint c/ chave publica |
| frontend | typecheck PASS, 4 hotfix-static PASS | vite build PASS | Shadcn/ui |
| desktop | 11/11 PASS | electron-builder PASS | Installer RC11 gerado |
| activation-manager | 120 PASS, 2 SKIP | tsc build PASS | SKIP = sync offline |
| activation-issuer | Nao executado (GHA, sem script local) | target/ | POM valido |
| releases | N/A | N/A | Metadata-only |

## Testes por tipo

| Tipo | Qtd | Resultado |
|---|---|---|
| Unitarios | 257 | 255 PASS, 2 SKIP |
| Sync (cross-PC) | 39 | PASS |
| Portable backup | 4 | PASS |
| E2E (integrado) | 16 | PASS (14 real + 2 mock) |
| E2E (real cross-PC) | Nao executado | Bloqueado por incidente GitHub |

Total: 316 testes PASS, 2 SKIP, 0 FAIL.
