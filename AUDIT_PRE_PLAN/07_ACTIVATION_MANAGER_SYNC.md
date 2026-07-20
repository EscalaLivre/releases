# Activation Manager & Sync Audit

## Repository

`activation-manager/` — Electron app gerenciando ativacoes de licenca, registro de ativos, e sincronizacao cross-PC.

## Testes

| Test suite | Resultado |
|---|---|
| Unitarios | 120 PASS, 2 SKIP |
| Sync (39 cenarios) | 39/39 PASS |
| Portable backup | 4/4 PASS |

E2E real cross-PC via GitHub registry nao executado (bloqueado por incidente GitHub).

## Funcionalidades verificadas

| Funcionalidade | Status |
|---|---|
| CAS registry | Implementado |
| Snapshot criptografado | Presente |
| 3-way merge de licencas | Testado |
| Tentativas de ativacao | Implementado |
| Issuer protocol | Documentado |
| Banimento de chave privada no sync | Verificado (nao sincroniza) |
| Machine-lock portable | Implementado |

## Conclusao

Sync esta implementado e testado. E2E real requer GitHub funcional.
