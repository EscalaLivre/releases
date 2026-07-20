# Plan Review — Proximas Sprints (Server/Client/Connect)

Documento base: `ESCALA_LIVRE_PLANO_TECNICO_PROXIMAS_SPRINTS_SERVIDOR_CLIENT_CONNECT.md`

## Verificacao de consistencia

| Requisito do plano | Status atual |
|---|---|
| EL-01: Senha temporaria automatica | SATISFIED_BY_RC11 — implementado e testado |
| EL-02 a EL-06 | Nao implementado — e o alvo das proximas sprints |
| Server component | Nao existe — sera criado |
| Connect component | Nao existe — sera criado |
| MySQL migration | Nao iniciada |
| Redis cache | Nao iniciado |
| GitLab mirror | Nao configurado |

## Conflitos com o estado atual

| Item do plano | Conflito |
|---|---|
| Assumir que RC11 esta publicado | Publicacao bloqueada por GitHub incident |
| Assumir GitLab disponivel | Nao ha remote GitLab em nenhum repo |
| Assumir E2E sync validado cross-PC | Nao executado por incidente GitHub |

## Recomendacoes pre-plano

1. Publicar RC11/QA6 apos recuperacao do GitHub
2. Configurar GitLab como remote secundario em todos os repos
3. Validar E2E sync cross-PC apos retorno do GitHub
4. Medir performance baseline antes de comecar
5. Incluir tarefa de datasource MySQL + pool + driver no backlog
6. Incluir tarefa de backup/recovery de SQLite antes da migracao
