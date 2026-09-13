# Equilibrium

Repositório de planejamento e ferramentas do modpack multiplayer Equilibrium.

## Publicação com Portainer

O repositório contém um `docker-compose.yml` na raiz. No Portainer, crie ou atualize uma Stack baseada neste Git e faça o deploy usando a branch `main`. A imagem é construída pelo GitHub Actions e publicada no GitHub Container Registry (GHCR); o Portainer não precisa executar build local.

Como a imagem acompanha este repositório privado, configure no Portainer uma credencial de registro para `ghcr.io` com o usuário `Thiago-Caffaro` e um token do GitHub com permissão `read:packages`. Associe essa credencial à Stack antes do deploy.

O avaliador ficará disponível na porta `8787` do host, ou na porta definida pela variável de ambiente `EQUILIBRIUM_PORT`. Os dados ficam no volume nomeado `equilibrium-data`, portanto alterações nas fichas sobrevivem a recriações e atualizações do container.

Ao publicar uma versão nova pelo Git, aguarde o workflow **Publicar imagem do avaliador** concluir e então use **Pull and redeploy**. Não exclua o volume `equilibrium-data` a menos que queira apagar todas as fichas e documentos armazenados pela aplicação.

## Conteúdo

- [Baseline conceitual](planejamento-conceitual/README.md): decisões, diretrizes, propostas, pendências e histórico do projeto.
- [Avaliador de Mods](avaliador-mods/README.md): aplicação local para fichas críticas de mods e análises de modpacks/listas de referência.

- [Equilibrium Core](equilibrium-core/README.md): mod NeoForge experimental, server-authoritative.
- [Laboratorio de balanceamento](balance-lab/README.md): staging reversivel para KubeJS, datapacks/tags e configs locais.

## Abrir o avaliador

No Windows, abra `avaliador-mods/iniciar-avaliador.cmd` ou execute:

```powershell
cd avaliador-mods
npm start
```

Depois acesse `http://127.0.0.1:8787`.

Os registros ficam em arquivos JSON dentro de `avaliador-mods/data/` e podem ser versionados junto do restante do repositório.
