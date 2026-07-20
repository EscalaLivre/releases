# Recommended Implementation Order (Server/Client/Connect)

Baseado na auditoria pre-plano. Ordem recomendada para as proximas sprints:

## Pre-requisitos externos

1. Aguardar recuperacao do GitHub
2. Publicar v1.0.0-rc11 e v0.1.0-qa6
3. Verificar SHA-256 apos publicacao
4. Configurar GitLab como remote mirror + CI secundario

## Fase A — Infraestrutura e Foundation

5. EL-02: Configurar GitLab mirror em todos os repos
6. Medicao de performance baseline do sistema atual (SQLite local)
7. Backup/recovery: copia segura do SQLite + exportacao JSON
8. E2E sync cross-PC real (com GitHub registry funcional)

## Fase B — Server Component

9. Criar repositorio server/ (Java/Spring Boot)
10. Implementar datasource MySQL configravel (Flyway + driver + pool)
11. Migrar schema de SQLite para MySQL (V8 -> V9 MySQL-ready)
12. EL-02: REST API server-client (health endpoint, version, status)
13. EL-03: User profile sync entre client/server
14. EL-04: Cache distribuido (Redis para licencas + usuarios)

## Fase C — Client Component

15. Criar repositorio client/ (Electron/TypeScript)
16. EL-05: Client offline queue + sync quando online
17. Interface de usuario para pairing server

## Fase D — Connect Component

18. EL-06: Conector de terceiros (API gateway padrao)
19. Webhook system
20. Documentacao de integracao

## Observacao

EL-01 (senha temporaria) JA ESTA SATISFEITO por RC11. Nao incluir no novo plano.
