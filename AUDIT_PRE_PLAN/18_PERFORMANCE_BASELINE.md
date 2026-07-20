# Performance Baseline

## Status

**NA CO COLETADA.** A medicao requer:

1. Instalacao do RC11 em ambiente de teste (bloqueado: GitHub incident)
2. Execucao do QA6 em ambiente de teste (instalador disponivel no GitLab)
3. Base de dados com dados reais (50+ ativos)

## Bloqueios atuais

| Requisito | Bloqueio |
|---|---|
| Instalar RC11 | Publicacao bloqueada (GitHub incident) |
| Smoke test backend | Requer instalacao |
| Coleta de metricas | Nao iniciada |
| Definicao de metas | Postergada apos baseline real |

## Metodologia proposta

| Metrica | Ferramenta |
|---|---|
| Startup time (desktop) | `Process.Start` + `Measure-Command` |
| Backend ready | health endpoint |
| Frontend first paint | DevTools Performance |
| Ativacao | `Measure-Command` |
| Login | `Measure-Command` |
| Sync push | QA6 logs |
| Sync pull | QA6 logs |
| Importacao XLSX | `Measure-Command` |

## Recording format

```
Machine: <model>, <CPU>, <RAM>, <disk-type>, <Windows-version>
Connection: <local/LAN/WAN>
DB size: <MB>
Registry size: <KB>
Test: <name>
  Run 1: <ms>
  Run 2: <ms>
  Run 3: <ms>
  Average: <ms>
  Worst: <ms>
```
