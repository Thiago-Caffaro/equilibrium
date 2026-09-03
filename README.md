# Equilibrium

Repositório de planejamento e ferramentas do modpack multiplayer Equilibrium.

## Publicação com Portainer

O repositório contém um `docker-compose.yml` na raiz. No Portainer, crie ou atualize uma Stack baseada neste Git e faça o deploy usando a branch `main`.

O avaliador ficará disponível na porta `8787` do host, ou na porta definida pela variável de ambiente `EQUILIBRIUM_PORT`. Os dados ficam no volume nomeado `equilibrium-data`, portanto alterações nas fichas sobrevivem a recriações e atualizações do container.

Ao publicar uma versão nova pelo Git, use **Pull and redeploy**. Não exclua o volume `equilibrium-data` a menos que queira apagar todas as fichas e documentos armazenados pela aplicação.

## Conteúdo

- [Baseline conceitual](planejamento-conceitual/README.md): decisões, diretrizes, propostas, pendências e histórico do projeto.
- [Avaliador de Mods](avaliador-mods/README.md): aplicação local para fichas críticas de mods e análises de modpacks/listas de referência.

## Abrir o avaliador

No Windows, abra `avaliador-mods/iniciar-avaliador.cmd` ou execute:

```powershell
cd avaliador-mods
npm start
```

Depois acesse `http://127.0.0.1:8787`.

Os registros ficam em arquivos JSON dentro de `avaliador-mods/data/` e podem ser versionados junto do restante do repositório.
