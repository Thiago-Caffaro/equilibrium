# Plano de evolução — importação real de modpacks

## Objetivo

Substituir a comparação estática baseada em inventários locais por uma comparação baseada nos mods realmente declarados em versões específicas de modpacks do CurseForge e do Modrinth.

O inventário atual de `analises-modpacks` continuará disponível como registro histórico. A nova comparação será a fonte operacional assim que houver modpacks importados.

## Escopo e privacidade

- O usuário escolhe a plataforma, o modpack e a versão.
- O servidor consulta apenas APIs e arquivos públicos da plataforma escolhida.
- Arquivos `.mrpack` ou ZIP de modpacks são lidos transitoriamente para extrair somente o manifesto; não serão persistidos.
- A importação salva identificadores de projeto/arquivo, versão, data, origem e a lista normalizada de mods. Não salva os arquivos do modpack.

## Fluxo do Modrinth

1. O usuário informa a URL de um modpack do Modrinth.
2. O servidor confirma que o projeto é do tipo `modpack` e lista as versões disponíveis.
3. O usuário escolhe uma versão; a mais recente estável pode ser pré-selecionada, nunca importada silenciosamente.
4. O servidor baixa transitoriamente o `.mrpack` escolhido e lê `modrinth.index.json`.
5. Os hashes declarados pelo manifesto são consultados em lote em `/version_files` para obter os projetos e versões reais.
6. Cada entrada recebe proveniência: pack, versão escolhida, ambiente declarado e hash do arquivo declarado.

## Fluxo do CurseForge

1. O usuário informa a URL de um modpack do CurseForge.
2. O servidor confirma a classe `modpack`, lista os arquivos/versões disponíveis e exige escolha explícita.
3. O arquivo escolhido é baixado transitoriamente quando houver URL pública disponível.
4. O servidor lê `manifest.json`, que contém pares `projectID` e `fileID`.
5. Os projetos são consultados em lote na API do CurseForge; o arquivo específico é mantido como evidência de versão.
6. Se a plataforma não disponibilizar o download público do arquivo, a interface deve explicar a limitação e oferecer importação local do manifesto/arquivo já baixado pelo usuário.

## Modelo persistente proposto

Uma nova coleção `pack-imports` guardará um retrato imutável por importação:

```text
plataforma + id do projeto + id da versão/arquivo + data da importação
  └─ lista de entradas normalizadas
       ├─ provedor e ID externo do mod
       ├─ versão/arquivo externo
       ├─ título, slug e URL canônica
       ├─ loaders e versões de jogo quando disponíveis
       ├─ lado cliente/servidor quando disponível
       └─ proveniência do modpack
```

Uma reimportação cria um novo retrato. Isso permite comparar versões diferentes do mesmo modpack sem reescrever evidências antigas.

## Comparação

A tela **Análises** passará a ter dois modos:

1. **Importações reais** — padrão quando houver pelo menos duas importações. Mostra uma matriz de presença por modpack/versão, interseção, exclusivos e diferenças entre dois retratos escolhidos.
2. **Auditoria histórica** — preserva o comparador atual e seus relatórios locais, deixando claro que é uma triagem anterior e não uma leitura ao vivo das plataformas.

O usuário poderá filtrar por nome, loader, versão de Minecraft, plataforma, presença em todos, presença em pelo menos dois e exclusivos.

## Entrada no catálogo do Equilibrium

Cada linha da comparação terá seleção individual e seleção múltipla.

- **Adicionar ao staging:** cria ou atualiza uma ficha de staging com metadados factuais oficiais e a proveniência dos modpacks em que o mod aparece.
- **Duplicata:** antes de criar, verifica provedor + ID externo e URL canônica; se já houver ficha em Mods ou Staging, abre/associa a ficha existente em vez de duplicar.
- **Avaliação humana:** status, parecer, notas, tags, divisão e decisões já registradas nunca são substituídos pela reimportação.

A importação de modpack identifica o projeto externo com alta confiança, mas não seleciona o mod para o Equilibrium automaticamente.

## Relação com leitura de JAR

São entradas complementares:

- **JAR local:** identifica o arquivo efetivamente instalado por hash e metadados internos (`modId`, nome, versão, loader e dependências).
- **Modpack importado:** identifica o conjunto oficialmente declarado por um modpack e uma versão específica.

Quando as duas fontes apontarem para o mesmo projeto, a ficha deve mostrar ambas como evidência. Quando divergirem, a divergência deve ser apresentada ao usuário, não resolvida silenciosamente.

## Critérios de conclusão da implementação futura

- Importar uma versão escolhida de cada plataforma sem armazenar o arquivo do pack.
- Exibir quantidade de mods e fonte/versionamento de cada importação.
- Comparar pelo menos duas importações reais em matriz de presença.
- Enviar uma ou várias linhas selecionadas para Staging sem criar duplicatas.
- Conservar a auditoria estática atual como referência histórica.
- Cobrir com testes: manifesto Modrinth, manifesto CurseForge, versão inválida, falha de download, duplicata e preservação de avaliação humana.
