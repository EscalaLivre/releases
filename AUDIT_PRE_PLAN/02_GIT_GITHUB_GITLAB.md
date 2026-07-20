# Git / GitHub / GitLab Audit

## Git Status (todos os repos)

| Repositorio | Branch | HEAD | origin/main | Ahead/Behind | Dirty | Tags |
|---|---|---|---|---|---|---|
| contracts | main | 584e3b1 | 584e3b1 | 0/0 | clean | — |
| backend | main | 369f954 | 369f954 | 0/0 | clean | — |
| frontend | main | aea12da | aea12da | 0/0 | clean | — |
| desktop | main | ed836bc | ed836bc | 0/0 | clean | — |
| activation-manager | main | 5216f11 | 5216f11 | 0/0 | clean | qa4, qa3, qa2, qa1 |
| activation-issuer | main | 71af3c3 | 71af3c3 | 0/0 | clean | — |
| releases | main | cb05c1a | cb05c1a | 0/0 | clean | rc9, rc8 |

## SHA Reconciliation

| Repositorio | SHA Canonico (release-lock) | SHA Local | SHA GitHub | Match |
|---|---|---|---|---|
| contracts | 584e3b1 | 584e3b1 | 584e3b1 | OK |
| backend | 369f954 | 369f954 | 369f954 | OK |
| frontend | aea12da | aea12da | aea12da | OK |
| desktop | ed836bc | ed836bc | ed836bc | OK |
| activation-manager | 5216f11 | 5216f11 | 5216f11 | OK |
| activation-issuer | 71af3c3 | 71af3c3 | 71af3c3 | OK |

Nenhuma divergencia. `BASELINE_SHA_MISMATCH` nao aplicavel.

## GitHub

| Repositorio | Visibilidade | Default Branch |
|---|---|---|
| EscalaLivre/contracts | Publico | main |
| EscalaLivre/backend | Privado | main |
| EscalaLivre/frontend | Privado | main |
| EscalaLivre/desktop | Privado | main |
| EscalaLivre/activation-manager | Privado | main |
| EscalaLivre/activation-issuer | Privado | main |
| EscalaLivre/activation-registry | Privado | main |
| EscalaLivre/releases | Publico | main |

## GitLab

**Nenhum repositorio possui remote GitLab configurado.** Ausencia de mirror, CI, Container Registry ou releases.

**Impacto:** Durante incidente GitHub (como o atual), nao ha fallback para CI, artefatos, registry ou releases privadas.

**Recomendacao:** Configurar GitLab como:
- CI/CD secundario
- Container Registry
- Artefatos internos
- Mirror dos repos privados
- Releases privadas (QA builds)
- Continuidade quando GitHub falhar
