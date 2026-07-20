# Architecture Couplings Audit

## Dependencias entre modulos

```
contracts  (NPM)                  ─┬─> frontend (importa types/validation)
                                   └─> manager  (importa types/validation)

backend (Maven Java)               ──> SQLite (via JDBC, embarcado)
                                    ──> desktop (electron-builder empacota JAR)

frontend (React/Vite)              ──> backend (API REST)
                                    ──> contracts (NPM)

desktop (Electron)                 ──> backend (JAR wrapper)
                                    ──> frontend (webapp wrapper)
                                    ──> electron-builder (NSIS)

activation-manager (Electron/TS)   ──> activation-issuer (REST API)
                                    ──> GitHub (registry sync)
                                    ──> desktop (coexistencia no mesmo PC)

activation-issuer (Maven Java)     ──> standalone (GHA)
                                    ──> manager (servico REST)
```

## Acoplamentos problematicos

| Acoplamento | Problema |
|---|---|
| desktop -> backend (JAR) | JAR nao pode ser independente do wrapper desktop |
| manager -> GitHub | Registry sync depende de GitHub API — unico meio de transporte |
| backend -> SQLite local | Nao ha fallback de banco. Perda do arquivo = perda dos dados |
| todos -> GitHub | Todos os repositorios usam GitHub como unico remote. Nao ha GitLab |

## Observacao

Nao ha acoplamento a MySQL ou Redis ainda — e neutro, mas sera trabalho novo.
