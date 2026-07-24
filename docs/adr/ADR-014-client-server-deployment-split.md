# ADR-014: Separação Client/Server — Dois Produtos Independentes

## Status

Accepted

## Date

2026-07-23

## Context

O Escala Livre começou como um aplicativo desktop único que embutia backend Java, SQLite, JRE e interface Electron. Para viabilizar multiusuário, foi criado um bundle Docker/MySQL instalado junto com o desktop (instalador unificado s2.3). Essa abordagem obrigava TODO cliente a instalar Docker Desktop, WSL 2 e habilitar virtualização na CPU — mesmo usuários de máquina única que nunca precisariam de servidor.

Isso gerava:

- Atrito na instalação (Docker é pesado e exige Windows Pro/Enterprise)
- Incompatibilidade com Windows Home (sem Hyper-V)
- Confusão entre "preciso de servidor" vs "só quero usar local"
- Retrabalho de manutenção de wizard Docker dentro do Electron

Os instaladores unificados da Sprint 2 (v1.0.0-qa.s2.2 e s2.3) são mantidos como prova técnica de compatibilidade MySQL, não como arquitetura final.

## Decision

O Escala Livre passa a ter duas distribuições independentes:

### 1. Escala Livre Client

- Produto: `EscalaLivre-Client-Setup.exe`
- Banco local: SQLite
- Backend local: JAR Java + JRE bundado
- Interface: Electron (existente RC11)
- Docker: NÃO instalado
- WSL 2: NÃO requisitado
- Virtualização: NÃO exigida
- Modo LOCAL: spawna JAR local, usa SQLite
- Modo SERVER: não spawna JAR, conecta ao Server via HTTPS

### 2. Escala Livre Server

- Produto: `EscalaLivre-Server-Setup.exe`
- Aplicação: Server Manager (wizard gráfico próprio)
- Banco: MySQL 8.4.0 via Docker Compose
- Backend: backend JAR em container
- Requisitos: Windows Pro+ com virtualização, WSL 2, Docker Desktop
- Gerencia: conexões, pareamento, backup, health, logs, rede

### Deployment Mode (client-config.json)

Arquivo persistido em `%LOCALAPPDATA%\EscalaLivre\client-config.json`:

```json
{
  "schemaVersion": 1,
  "deploymentMode": "LOCAL",
  "local": { "enabled": true },
  "server": {
    "url": null,
    "serverId": null,
    "paired": false,
    "deviceId": null,
    "certificateFingerprint": null
  }
}
```

Valores: `LOCAL` | `SERVER`

### Regras de inicialização do Client

```
LOCAL  → spawnar backend JAR local + SQLite
SERVER → não spawnar Java, conectar ao Server via URL configurada
```

### Licenciamento

- Licença LOCAL: vinculada ao Installation ID do Client, maxClients=1
- Licença SERVER: vinculada ao Installation ID do Server, maxClients conforme plano
- Clients conectados ao Server não precisam de licença individual

### Atualizações

- Client: canal `client-stable` / `client-qa`
- Server: canal `server-stable` / `server-qa`
- Compatibilidade versionada via `apiVersion` / `minimumClientVersion`

## Alternatives Rejected

| Alternativa | Motivo da rejeição |
|---|---|
| Instalador unificado como padrão | Obriga Docker para todos; rejeitado como produto final |
| Dois atalhos no mesmo EXE | Confunde usuário; mistura responsabilidades |
| Server como perfil do backend existente | Server Manager precisa de UI própria, não Electron |
| Apenas Server, Client como browser | Perde offline, perde performance, perde backup local |
| Docker obrigatório no Client | Inviabiliza Windows Home; atrito desnecessário |

## Consequences

### Positivas

- Usuário de máquina única instala apenas Client, sem Docker
- Usuário multiusuário instala Server (uma máquina) + Clients (demais)
- Código do Client permanece leve (Electron + JAR + JRE + SQLite)
- Docker/WSL fica isolado no produto Server
- RC11 vira a base do Client LOCAL (já testado, funciona)
- Prova técnica s2.3 é preservada como baseline

### Negativas

- Dois instaladores para manter e testar
- Contratos de deploymentMode, pareamento, compatibilidade e licença precisam ser criados
- Clientes existentes com bundle unificado precisam migrar
- Server Manager é um novo produto (UI desktop própria)

### Riscos

- Client em modo SERVER depende de rede — falhas de rede precisam ser tratadas
- Compatibilidade Client/Server versionada precisa ser enforced
- Pareamento inseguro pode expor o Server

## Migration

1. Preservar RC11 como base do Client LOCAL
2. Criar contratos (deploymentMode, server/info, pairing, device credential, version compatibility, license mode, errors)
3. Limpar dependências Docker do Client
4. Mover bundle Docker (qa-server-bundle) para o repositório `server/`
5. Gerar SDD da Sprint 3 Server

## Gates

```text
SPLIT_CLIENT_SERVER_ARCHITECTURE: APPROVED
CLIENT_LOCAL_INSTALLER: PENDING
CLIENT_LOCAL_NO_DOCKER: PENDING
CLIENT_DEPLOYMENT_MODE_CONFIG: PENDING
CLIENT_MODE_SELECTION_UI: PENDING
SERVER_GRAPHICAL_SETUP_WIZARD: PENDING
SECURE_CLIENT_SERVER_PAIRING: PENDING
SERVER_CONNECTION_MANAGEMENT: PENDING
LICENSE_DEPLOYMENT_MODE_ENFORCED: PENDING
CLIENT_SERVER_VERSION_COMPATIBILITY: PENDING
CLIENT_SERVER_CONTRACT_SUITE: PENDING
SPRINT_3_SERVER_MINIMAL_AUTHORIZED: NO
```
