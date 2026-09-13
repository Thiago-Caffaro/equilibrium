# Handoff — desenvolvimento do Equilibrium Core

**Preparado em:** 13/09/2026

**Objetivo da nova tarefa:** iniciar a arquitetura e o primeiro protótipo executável do mod próprio `Equilibrium Core`, sem reabrir decisões conceituais já registradas e sem implementar prematuramente sistemas ainda em aberto.

## Ambiente confirmado

- Projeto principal: `C:\Users\thiag\Desktop\Equilibrium`
- Instância CurseForge de laboratório: `C:\Users\thiag\curseforge\minecraft\Instances\Equilibrium - Test grounds`
- Minecraft: 1.21.1
- Mod loader: NeoForge 21.1.249
- Java necessário para desenvolvimento: Java 21
- KubeJS já faz parte da instância de teste.
- Create e o primeiro conjunto comercial já foram testados na instância.

## Contexto conceitual indispensável

O Equilibrium é um modpack multiplayer baseado em especializações pessoais. O princípio social central é:

> O jogador não deve ser obrigado a dominar todos os mods; o grupo deve ser obrigado a dominar o modpack coletivamente.

As divisões conceituais vigentes incluem Magia, Tecnologia, Aventura e Comerciantes. O trabalho inicial do mod próprio será concentrado exclusivamente na infraestrutura necessária aos Comerciantes.

Create está sendo avaliado como eixo mecânico da divisão dos Comerciantes. Farmer's Delight, Some Assembly Required e addons selecionados do Create formam o primeiro recorte de conteúdo comercial.

O sistema completo de divisões, maestria, insígnias, empréstimos, estabilidade e World Progress possui documentação própria. Não implementar versões definitivas desses sistemas sem consultar a Baseline Conceitual e confirmar os pontos ainda em aberto.

## Motivação imediata

O mod `Upgrader Items` foi testado como possível mecânica exclusiva dos Comerciantes. A experiência visual de conversão probabilística é promissora, mas sua implementação inclui por padrão praticamente todo item registrado como possível resultado.

A auditoria local mostrou que:

- o catálogo percorre todo `BuiltInRegistries.ITEM`;
- existe somente uma `blacklist`;
- a mesma blacklist bloqueia entradas e resultados;
- não há whitelist, filtro por tag, namespaces autorizados ou filtros separados;
- KubeJS pode alterar a receita do item, mas não substitui diretamente a construção interna do catálogo;
- dificultar o crafting não impede outra divisão de usar um item recebido de um Comerciante.

A auditoria completa está em [`avaliador-mods/data/library/auditoria-upgrader-items.md`](../avaliador-mods/data/library/auditoria-upgrader-items.md).

## Decisão de direção

Criar uma implementação original e enxuta dentro de `Equilibrium Core`, inspirada apenas no conceito geral de uma conversão comercial probabilística.

O código, os assets, os textos e a interface não devem ser copiados do Upgrader Items ou do QShop.

O QShop possui código publicamente visível e uma branch NeoForge 1.21.1, mas o projeto está classificado como **All Rights Reserved** no CurseForge. Ele pode ser estudado em nível arquitetural, porém não deve ser tratado como código licenciando um fork.

Referências com licenças mais permissivas devem ser priorizadas para padrões concretos:

- documentação e exemplos oficiais do NeoForge;
- VillagerShop, publicado sob LGPL-3.0;
- MMO Econ NeoForge, publicado sob MIT;
- templates NeoForge 1.21.1 sob MIT.

Registrar no projeto a licença escolhida para o Equilibrium Core antes de copiar qualquer trecho de uma referência licenciada. Uma implementação clean-room, baseada em documentação oficial e conceitos gerais, é preferível.

## Escopo do primeiro vertical slice

Implementar somente o necessário para provar a arquitetura:

1. bootstrap de um mod NeoForge 1.21.1 compilável;
2. um módulo comercial isolado dentro do Equilibrium Core;
3. catálogo positivo de ofertas definido por dados;
4. três ofertas experimentais e claramente marcadas como temporárias;
5. uma interface provisória para visualizar e selecionar ofertas;
6. processamento e sorteio exclusivamente no servidor;
7. validação da oferta, quantidade, inventário e resultado no servidor;
8. uma identificação experimental de Comerciante, adequada somente ao laboratório;
9. bloqueio de abertura e execução para jogadores não autorizados;
10. logs suficientes para auditar tentativas e resultados;
11. build do JAR e instalação controlada na instância de teste;
12. smoke test em cliente e, se possível, dedicated server.

## Fora do escopo inicial

Não implementar ainda:

- fórmula definitiva de chances;
- aparência definitiva da estação ou interface;
- número definitivo de tiers;
- fluxo definitivo de escolha de divisão;
- maestria completa;
- insígnia permanente;
- empréstimo e desgaste;
- shards;
- World Progress;
- estabilidade global;
- questline definitiva;
- economia monetária genérica;
- catálogo calculado automaticamente a partir de todas as receitas.

Esses itens devem permanecer desacoplados ou representados por interfaces provisórias.

## Modelo de dados pretendido

As ofertas devem ser positivas: nada entra no catálogo sem um arquivo ou registro explícito.

Exemplo conceitual, ainda sujeito a refinamento técnico:

```json
{
  "id": "equilibrium:experimental/zinc_exchange",
  "inputs": [
    {
      "ingredient": {
        "tag": "c:ingots/copper"
      },
      "count": 8
    }
  ],
  "outputs": [
    {
      "item": "create:zinc_ingot",
      "count": 4
    }
  ],
  "chance": 0.65,
  "failure": {
    "consumeInputs": true
  },
  "access": {
    "division": "merchant",
    "mastery": 1
  }
}
```

O schema inicial deve permitir evolução sem obrigar a decidir agora todos os campos finais. Versão de schema e validação explícita são desejáveis desde o começo.

## Regras de segurança

O cliente nunca deve informar livremente o item resultante. Ele pode enviar apenas o identificador de uma oferta já sincronizada e a quantidade desejada.

Antes de executar, o servidor deve confirmar:

1. a oferta existe e está habilitada;
2. o jogador possui acesso experimental de Comerciante;
3. os requisitos declarados são satisfeitos;
4. a quantidade está dentro dos limites;
5. os itens de entrada existem no inventário correto;
6. o resultado é exatamente o declarado pela oferta;
7. limites de frequência foram respeitados, quando presentes;
8. há espaço ou estratégia segura para entregar o resultado;
9. a entrada só é consumida uma vez;
10. pacotes repetidos, atrasados ou forjados não duplicam itens.

## Integração KubeJS

O JSON ou datapack deve funcionar sem KubeJS. KubeJS será uma camada adicional para facilitar autoria e testes.

API desejada futuramente:

```js
EquilibriumMerchants.offer('equilibrium:zinc_exchange')
  .input('#c:ingots/copper', 8)
  .output('create:zinc_ingot', 4)
  .chance(0.65)
  .mastery(1)
  .register()
```

Não bloquear o primeiro build tentando entregar toda essa DSL. Primeiro estabilizar o carregamento de dados, a validação server-side e a transação.

## Decisões que permanecem abertas

- estação física, item portátil ou outra forma de acesso;
- nome narrativo da mecânica;
- fórmula e limites finais de chance;
- consequências definitivas da falha;
- moeda, barter puro ou modelo híbrido;
- comportamento de lotes;
- limites por jogador ou por mundo;
- visibilidade de ofertas bloqueadas;
- relação final com maestria e insígnia;
- possibilidade de ofertas condicionadas ao World Progress.

O vertical slice pode usar escolhas provisórias claramente marcadas e facilmente substituíveis.

## Documentos obrigatórios para consulta

- [`planejamento-conceitual/README.md`](../planejamento-conceitual/README.md)
- [`planejamento-conceitual/02-divisoes.md`](../planejamento-conceitual/02-divisoes.md)
- [`planejamento-conceitual/03-insignias-e-maestria.md`](../planejamento-conceitual/03-insignias-e-maestria.md)
- [`planejamento-conceitual/05-progressao-e-automacao.md`](../planejamento-conceitual/05-progressao-e-automacao.md)
- [`planejamento-conceitual/09-decisoes-em-aberto.md`](../planejamento-conceitual/09-decisoes-em-aberto.md)
- [`planejamento-conceitual/10-registro-de-decisoes.md`](../planejamento-conceitual/10-registro-de-decisoes.md)
- [`avaliador-mods/data/library/rodada-MER-1A.md`](../avaliador-mods/data/library/rodada-MER-1A.md)
- [`avaliador-mods/data/library/proximas-rodadas-MER-1B.md`](../avaliador-mods/data/library/proximas-rodadas-MER-1B.md)
- [`avaliador-mods/data/library/auditoria-upgrader-items.md`](../avaliador-mods/data/library/auditoria-upgrader-items.md)

## Resultado esperado da primeira etapa

Ao final da primeira etapa, o repositório deve conter um projeto compilável do Equilibrium Core, documentação de desenvolvimento, testes proporcionais ao risco e um JAR experimental instalado na instância de laboratório. O trabalho deve parar antes de transformar decisões conceituais abertas em regras definitivas.
