# Cross-PC E2E Report

## Status

**NAO EXECUTADO EM AMBIENTE REAL (dois PCs fisicos).**

## O que foi feito

| Item | Status |
|---|---|
| Sync engine (39 cenarios unitarios) | PASS |
| Portable backup (4 cenarios) | PASS |
| GitLab API testado | PASS (authenticated, project accessible) |
| `GitLabRegistryApi` testado | PASS (typecheck + testes existentes) |
| activation-registry GitLab | Configurado, privado, pronto |

## O que impede o E2E real

- Necessario 2 PCs fisicos ou VMs com QA6 instalado
- Necessario token GitLab com acesso ao `escalalivre-activation-registry`
- Necessario `ACTIVATION_MANAGER_REGISTRY_PROVIDER=gitlab` configurado

## Procedimento para execucao futura

### PC1 (mestre)

```powershell
$env:ACTIVATION_MANAGER_REGISTRY_PROVIDER="gitlab"
.\EscalaLivre-Activation-Manager-0.1.0-qa6-x64.exe
```

1. Login tecnico
2. Configurar token GitLab (Settings > Registry)
3. Provider GitLab selecionado automaticamente
4. Inserir senha mestra
5. Push do snapshot criptografado
6. Confirmar revisao remota criada no `escalalivre-activation-registry`

### PC2 (escravo)

```powershell
$env:ACTIVATION_MANAGER_REGISTRY_PROVIDER="gitlab"
.\EscalaLivre-Activation-Manager-0.1.0-qa6-x64.exe
```

1. Instalar QA6
2. Autenticar com mesmo token GitLab
3. Provider GitLab selecionado automaticamente
4. Informar mesma senha mestra manualmente
5. Pull
6. Confirmar Santa Casa + Installation ID `dcbabc91-4f98-49e2-99b0-6aceea9733a9`

### Conflitos

1. PC1 altera registro, PC2 altera mesmo registro
2. PC1 sincroniza, PC2 sincroniza
3. Verificar: conflito detectado, nenhuma sobrescrita silenciosa, usuario informado

## Decisao

**Cross-PC E2E real: PENDS EXECUCAO EM 2 MAQUINAS.** 39 testes unitarios de sincronizacao cobrem a logica. API GitLab verificada funcional.
