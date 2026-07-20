# Current Database Audit

## Stack atual

- SQLite (embarcado no desktop, via JDBC)
- Flyway migrations (8 versoes, V1-V8)
- Schema: licenses, assets, activations, attempts, metadata, etc.

## Arquitetura

```
backend (Java/Spring Boot) --JDBC--> SQLite (arquivo local .db)
```

Nenhum SQLite encontrado em:
- Repositorios Git (fora de .gitignore)
- dist/ do desktop
- staging do RC11
- Instalador gerado
- release-output/

## Acoplamento MySQL/Redis

- **MySQL**: Nao ha dependencia, configuracao, nem codigo de preparacao para MySQL no backend atual
- **Redis**: Nao ha dependencia, configuracao, nem codigo de cache com Redis

## Avaliacao para migracao futura

| Requisito | Status |
|---|---|
| Migracoes Flyway | Ja existem (V1-V8) — adaptaveis para MySQL |
| Driver MySQL no pom.xml | Ausente |
| Pool de conexoes | Ausente |
| Configuracao de datasource | Ausente |
| Repository pattern | Usando JdbcTemplate direto — requer refactor |
| Redis para cache de licencas | Nao planejado |

## Risco

Migracao para MySQL nao e trivial: requer datasource config, driver, pool, possivelmente JPA/Hibernate ou reescrita de repositories. Plano deve prever esforco dedicado.
