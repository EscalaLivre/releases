# RC11 / QA6 Status

## Escala Livre v1.0.0-rc11

| Item | Status |
|---|---|
| Installer | `EscalaLivre-1.0.0-rc11-x64.exe` |
| SHA256 | `F5B02A916A619869781002A68EFFCCDCEBD19235B9BECF00FAAF91ECEDE558A0` |
| Blockmap | Presente |
| latest.yml | Presente (releaseDate: 2026-07-19T18:47:25.656Z) |
| release-lock.json | Presente, 6 SHAs dirty=false |
| Release notes | Presentes |
| Auditoria | PASS (sem chave privada, .elamvault, SQLite, JWS) |
| Publicacao GitHub | BLOCKED_BY_GITHUB_INCIDENT (API Requests Partial Outage) |
| Tags | Nao criadas |
| Channel | prerelease=true, draft=false, latest=false |

## Activation Manager v0.1.0-qa6

| Item | Status |
|---|---|
| Version bump | Committed (5216f11) |
| Build | 120 PASS, 2 SKIP |
| Installer | Nao gerado (nao faz parte do build integrado) |
| Publicacao | BLOCKED_BY_GITHUB_INCIDENT |
| Tags | Nao criadas |

## Classificacao

Ambos: `NOT_CREATED` (no GitHub) — implementacao completa, publicacao bloqueada externamente.

## Assets preservados localmente

`C:\Users\USUARIO\AppData\Local\Temp\opencode\rc11-publication-staging\`

```
f5b02a916a619869... EscalaLivre-1.0.0-rc11-x64.exe (172323 KB)
9c99008586a18f97... EscalaLivre-1.0.0-rc11-x64.exe.blockmap (182.3 KB)
3111d3260376f80e... latest.yml (0.4 KB)
b6b8979c809da7c0... rc11-notes.md (2 KB)
672e80fe63c257b0... RELATORIO_OBRIGATORIO.md (10.2 KB)
2d18196f8b85c2cc... release-lock-rc11.json (1.5 KB)
c42955a60fe70a76... SHA256SUMS (0.6 KB)
```

## Proximos passos apos recuperacao GitHub

1. Verificar se nao ficou draft/tag/asset parcial
2. Publicar v1.0.0-rc11 (prerelease, latest=false)
3. Publicar v0.1.0-qa6 (privado)
4. Baixar novamente e comparar SHA-256
