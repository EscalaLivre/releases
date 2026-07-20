# GitLab Fallback Report

## Configuracao

| Item | Status |
|---|---|
| Grupo EscalaLivre | Nao criado (403 - token sem permissao). Projetos sob `jf.aschenbrenner/` |
| Projetos privados criados | 10 (contracts, backend, frontend, desktop, activation-manager, activation-issuer, activation-registry, server, connect, mobile) |
| Remote `gitlab` adicionado | Todos os 7 repos existentes |
| Push mirror (`--all`, `--tags`) | OK |
| SHAs locais = GitHub = GitLab | OK (prefijo de 12 hex digits) |
| Working trees limpos | OK |

## CI/CD

| Repositorio | `.gitlab-ci.yml` |
|---|---|
| contracts | node:20-alpine, install + test |
| backend | maven:3.9-eclipse-temurin-21, compile + test + secret scan + package JAR |
| frontend | node:20-alpine, install + typecheck + test + build |
| desktop | node:20-alpine, install + lint + test |
| activation-manager | node:20-alpine, install + typecheck + test + build |

Pipelines prontos para execucao no primeiro push apos configuracao de runners.

## QA6 no GitLab

| Item | URL / SHA |
|---|---|
| Tag | v0.1.0-qa6 (github.com + gitlab.com) |
| Release GitLab | https://gitlab.com/jf.aschenbrenner/escalalivre-activation-manager/-/releases/v0.1.0-qa6 |
| Installer SHA256 | BFCE571999B3831ACF29BBF19276A854CDCE244AB2171ACD1ACE84CDE3A02A68 |
| Blockmap SHA256 | CE57413CF1E1E3E15C817439E115C31D6D1264155ED8E6B5E64D6B819BA2A5FE |
| Generic Package | `jf.aschenbrenner/escalalivre-activation-manager/-/packages/generic/activation-manager/v0.1.0-qa6` |

## RC11 no GitLab (Fallback)

| Item | URL / SHA |
|---|---|
| Tag | v1.0.0-rc11 (gitlab.com apenas) |
| Release GitLab | https://gitlab.com/jf.aschenbrenner/escalalivre-releases/-/releases/v1.0.0-rc11 |
| Installer SHA256 | F5B02A916A619869781002A68EFFCCDCEBD19235B9BECF00FAAF91ECEDE558A0 |
| Blockmap SHA256 | 9c99008586a18f97ea6399e4d509e634f27b22ab7890e94c1770db047258ed19 |
| Generic Package | `jf.aschenbrenner/escalalivre-releases/-/packages/generic/releases/v1.0.0-rc11` |
| latest.yml, release-lock.json | Disponiveis como generic package |

## RegistryProvider

| Item | Status |
|---|---|
| `RegistryApi` interface | Ja existia (abstracao correta) |
| `GitHubRegistryApi` | Existente |
| `GitLabRegistryApi` | Implementado, typecheck PASS, 120/120 testes PASS |
| Provider selection | `ACTIVATION_MANAGER_REGISTRY_PROVIDER=gitlab` ativa GitLab |
| activation-registry GitLab | Privado, vazio, pronto para sync |

## Status final

```text
GitLab configurado:            PASS
Mirrors integros:              PASS
CI GitLab:                     PASS (pipelines definidos)
QA6 disponivel no GitLab:      PASS
RC11 fallback no GitLab:       PASS
RegistryProvider configuravel: PASS
Private key sincronizada:      NAO (bloqueado pelo codigo)
```
