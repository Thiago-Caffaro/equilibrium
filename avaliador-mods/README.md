# Equilibrium — Avaliador de Mods

Ferramenta local para duas ou poucas pessoas catalogarem mods, analisarem modpacks/listas de referência e registrarem os julgamentos humanos necessários antes de selecionar a modlist do Equilibrium.

O projeto usa somente HTML, CSS, JavaScript e recursos nativos do Node.js. Não há banco SQL, serviço externo ou dependências para instalar.

## Iniciar

Requisito: Node.js 20 ou mais recente.

No terminal, dentro desta pasta:

```powershell
npm start
```

No Windows, também é possível abrir `iniciar-avaliador.cmd` com um duplo clique.

A interface fica disponível em:

```text
http://127.0.0.1:8787
```

O servidor já escuta em `0.0.0.0`, permitindo acesso por outros dispositivos autorizados na rede local ou no Tailscale.

## Compartilhar pelo Tailscale

1. Inicie a aplicação no computador que guardará os dados.
2. Consulte o endereço Tailscale desse computador:

   ```powershell
   tailscale ip -4
   ```

3. Compartilhe com o colaborador o endereço no formato:

   ```text
   http://ENDERECO-TAILSCALE:8787
   ```

4. Se o Windows solicitar permissão para o Node.js receber conexões, autorize somente nos perfis de rede necessários.

A aplicação não possui login próprio. O controle de acesso deve ser feito pela sua tailnet e por suas ACLs do Tailscale. Não encaminhe a porta `8787` diretamente para a internet pública.

### Alterar endereço ou porta

```powershell
$env:HOST = "0.0.0.0"
$env:PORT = "8788"
npm start
```

## Fluxo de uso

### Mods

Cada ficha concentra informações que dependem de julgamento ou experiência do grupo:

- função única no Equilibrium;
- divisões relacionadas;
- evidências de testes ou campanhas anteriores;
- sobreposições e combinações perigosas;
- impacto na escassez e automação;
- relação com maestria e progressão;
- worldgen e desempenho observado;
- valor multiplayer;
- potencial para rupturas e eventos;
- alterações e testes necessários;
- parecer atual e justificativa.

### Referências

A aba **Referências** registra modpacks, listas, repositórios e documentos usados como inspiração. Ela separa padrões úteis daquilo que não deve ser reproduzido e permite listar mods que merecem uma ficha própria.

### Estados sugeridos

As fichas de mods podem passar por:

```text
Não avaliado → Em análise → Precisa de teste → Shortlist → Selecionado
                                                   ↘ Rejeitado
```

Esses estados organizam a análise; não substituem as decisões conceituais registradas na Baseline.

## Salvamento e colaboração

- Alterações são salvas automaticamente após uma breve pausa.
- `Ctrl+S` salva imediatamente.
- Cada salvamento registra data e nome do avaliador, mas não aumenta a contagem de revisões.
- **Marcar revisão +1** é uma ação humana explícita, disponível pelo botão da ficha ou por `Alt+R`.
- Se duas pessoas abrirem a mesma versão interna da ficha, o segundo salvamento recebe um aviso de conflito em vez de sobrescrever silenciosamente o trabalho da primeira.
- O usuário pode recarregar a versão mais recente ou salvar seu conteúdo como uma cópia.
- Cada ficha é um JSON independente, reduzindo conflitos no Git e facilitando recuperação manual.

O nome do avaliador fica apenas como preferência local do navegador; os dados oficiais permanecem no servidor.

## Metadados oficiais por link

Ao informar o link de um mod no Modrinth ou CurseForge, a ficha tenta importar somente dados factuais: nome, resumo oficial, autores, versões, loaders, categorias, ambiente declarado, licença, links e datas. Campos de julgamento — divisões, função no Equilibrium, riscos, gates, desempenho e parecer — nunca são preenchidos automaticamente.

O Modrinth permite leitura pública sem credencial. A API oficial do CurseForge exige uma chave. No terminal local, configure-a somente no ambiente que inicia o servidor:

```powershell
$env:CURSEFORGE_API_KEY = "SUA_CHAVE"
npm start
```

No Portainer, adicione `CURSEFORGE_API_KEY` como variável de ambiente da stack. Não grave a chave no repositório, no `docker-compose.yml` ou em uma ficha. Sem ela, o sistema informa que a consulta ao CurseForge não está configurada; as fichas continuam funcionando normalmente e o Modrinth permanece disponível.

## Estrutura dos dados

```text
data/
├── mods/             # uma ficha JSON por mod
├── references/       # uma ficha JSON por modpack/lista de referência
└── library/          # colas e documentos Markdown/JSON compartilhados
```

Os arquivos são formatados e legíveis. É possível editá-los manualmente com qualquer editor de texto.

Em cada ficha, `revision` é a contagem de revisões humanas confirmadas. `storageVersion` é um contador interno de salvamentos usado somente para detectar conflitos; ele não representa revisão editorial.

Cuidados ao editar manualmente:

1. mantenha JSON válido;
2. não altere o `id` de uma ficha existente;
3. preserve `revision`, `storageVersion`, `reviewedAt`, `reviewedBy`, `createdAt`, `updatedAt` e `updatedBy` quando não houver motivo para mudá-los;
4. evite editar o mesmo arquivo manualmente enquanto outra pessoa estiver com a ficha aberta;
5. atualize a página depois da edição para reler o arquivo.

Se um JSON for inválido, o catálogo mostra uma entrada de erro com o nome do arquivo para que ele possa ser corrigido.

## Cola lateral e edição Markdown/JSON

O painel direito oferece três modos:

- **Visualizar:** renderização segura e simples do Markdown;
- **Editar:** edição das notas da ficha ou de um arquivo compartilhado;
- **Ficha JSON:** visualização e edição direta do JSON da ficha atual.

Arquivos `.md` e `.json` em `data/library/` aparecem na lista lateral. O arquivo `criterios.md` traz a cola inicial, e `campos-humanos.json` registra a separação entre informações prioritariamente humanas e informações que podem ser complementadas por IA.

## Importação e exportação

O menu **Dados** exporta a coleção atualmente aberta em:

- JSON completo, indicado para backup, migração e reimportação sem perdas;
- CSV UTF-8, indicado para planilhas e revisão em massa.

Na importação, há três modos:

- **Ignorar existentes:** adiciona somente fichas cujo ID ou nome ainda não existe;
- **Atualizar existentes:** substitui fichas encontradas por ID ou nome;
- **Criar cópias:** gera novos IDs e mantém as fichas atuais.

Listas em CSV usam ` | ` como separador interno. Textos com vírgulas, aspas ou várias linhas são preservados por quoting CSV.

## Atalhos

| Atalho | Ação |
|---|---|
| `Alt+N` | Nova ficha |
| `Alt+R` | Salvar e marcar uma revisão humana |
| `Ctrl+S` | Salvar agora |
| `Ctrl+Enter` | Salvar e navegar para a próxima |
| `Ctrl+K` | Pesquisar |
| `[` e `]` | Ficha anterior ou seguinte |
| `Alt+1…9` | Focar uma seção da ficha |
| `?` | Mostrar atalhos |

## Backup e Git

Os dados estão dentro do mesmo repositório Git da documentação. Recomenda-se criar commits em marcos úteis — depois de uma rodada de avaliação, testes ou mudança de shortlist — em vez de tentar versionar cada tecla digitada.

O JSON exportado também pode ser guardado como snapshot externo antes de importações grandes.

## Testes

```powershell
npm test
```

Os testes cobrem CSV, persistência em arquivos, revisão explícita, concorrência, edição de documentos, CRUD da API, exportação e importação.
