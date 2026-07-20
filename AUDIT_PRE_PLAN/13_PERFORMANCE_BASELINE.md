# Performance Baseline

## Estado

**Nao coletada.** A medicao de performance depende de:
1. Instalacao do RC11 em ambiente de teste
2. Smoke test com carga real (50 ativos, sync concorrente, etc)
3. Ambas bloqueadas pelo incidente GitHub (publicacao e E2E real)

## Metodologia proposta

| Metric | Ferramenta |
|---|---|
| Startup time (desktop) | `Process.Start` |
| API response time (backend) | curl + `%Time%` ou `Measure-Command` |
| Sync time (first sync) | log do manager |
| Memory usage (desktop) | `Get-Process` |
| Installer size | SHA-256 + `Get-Item` |
| DB query time | SQLite `.timer` |

## Gatilho para coleta

Assim que GitHub恢复正常 (recuperado):
1. Publicar RC11
2. Instalar na maquina de teste
3. Coletar baseline
4. Atualizar este relatorio
