# Backup & Recovery Audit

## Estado atual

| Item | Status |
|---|---|
| Backup automatico do SQLite | Nao implementado |
| Exportacao de dados | Nao implementada |
| Recovery point | Nao definido |
| RPO/RTO | Nao definido |
| Teste de restauracao | Nunca executado |
| Documentacao de disaster recovery | Nao existe |

## Cenario de risco atual

Dados de licenciamento, ativos e ativacoes estao em um unico arquivo SQLite local.
Perda do arquivo = perda irreversivel de todos os registros de ativacao.

## Recomendacao pre-plano

Implementar antes da migracao MySQL:

1. Backup periodico (copia do .db + WAL)
2. Exportacao JSON assinada (para recovery independente de formato)
3. Teste de restauracao automatizado
4. Documentar RPO (1h, 6h, 24h?) e RTO (minutos, horas?)
5. Validar sync cross-PC como mecanismo de recovery indireto
