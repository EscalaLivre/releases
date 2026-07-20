# Blockers & Risks

## Blockers (impedem inicio do plano)

| Blocker | Severidade | Responsavel | Desbloqueio |
|---|---|---|---|
| GitHub incident (API + Actions) | CRITICAL | GitHub | Aguardar status.github.com |
| GitLab nao configurado | MEDIUM | Dev | Criar conta GitLab, adicionar remote |
| Publicacao RC11/QA6 bloqueada | HIGH | GitHub incident | Apos recuperacao, publicar |
| SHA mismatch nao verificado apos publicacao | MEDIUM | Dev | Baixar e comparar SHA-256 apos publicacao |

## Riscos (podem afetar cronograma)

| Risco | Probabilidade | Impacto | Mitigacao |
|---|---|---|---|
| MySQL migration mais complexa que estimado | MEDIA | ALTO | Prototipo de datasource antes de comecar |
| Sync depende exclusivamente do GitHub | ALTA | ALTO | GitLab + S3 como fallback de sync |
| Sem backup do SQLite | ALTA | CRITICO | Implementar backup antes da migracao |
| Sem baseline de performance | MEDIA | MEDIO | Coletar assim que possivel |
| Novos repos (server, connect, mobile) sem tooling | ALTA | MEDIO | Bootstrap com templates existentes |
| Licenca Santa Casa expira durante desenvolvimento | BAIXA | ALTO | Renovar antes do prazo |
