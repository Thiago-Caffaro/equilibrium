# Auditoria técnica — Upgrader Items

**Data:** 13/09/2026

**Versão inspecionada:** `upgrader-neoforge-1.2.0+1.21.1.jar`

**Instância:** `Equilibrium - Test grounds`

**Estado:** candidato experimental; inadequado para uso controlado sem uma camada adicional

## Objetivo pretendido pelo Equilibrium

Usar a conversão probabilística como uma mecânica exclusiva dos Comerciantes, com:

- acesso restrito pela divisão e futuramente pela maestria;
- fabricação difícil e integrada à progressão comercial;
- itens de resultado selecionados manualmente;
- valores e chances balanceados para o modpack;
- operação segura no servidor;
- impossibilidade de acessar itens arbitrários de outros mods.

## Arquivos locais encontrados

- `mods/upgrader-neoforge-1.2.0+1.21.1.jar`
- `config/upgrader-common.toml`

O JAR é pequeno e registra um único item principal, sua tela, menu, pacotes de rede, cálculo de valores, limitador de tentativas e configuração NeoForge.

## Configuração disponível

O TOML gerado oferece:

- `houseEdge` — multiplicador aplicado à razão de valores;
- `minChance` e `maxChance` — limites da chance;
- `spinDurationTicks` — duração da animação;
- `valueOverrides` — valores absolutos por item;
- `globalValueMultiplier` — multiplicador global;
- `valueMultipliers` — multiplicadores por item;
- `blacklist` — itens proibidos como entrada **e** como resultado;
- `maxTargetCount` — quantidade máxima solicitável;
- `attemptLimit` e `attemptWindowSeconds` — limitação de tentativas por janela.

Não foram encontradas opções de whitelist, tags permitidas, namespaces permitidos, filtro separado para entradas e resultados ou restrição por jogador/divisão.

## Como o catálogo é construído

A inspeção do bytecode de `ItemValues.catalog(Level)` mostrou que o mod:

1. percorre `BuiltInRegistries.ITEM`, ou seja, todo o registro de itens carregado;
2. chama `isBlacklisted` para cada item;
3. adiciona ao catálogo tudo o que não for rejeitado;
4. ordena o catálogo por valor.

O filtro interno rejeita:

- `minecraft:air`;
- bloqueios internos definidos pelo mod;
- spawn eggs;
- IDs que começam com `upgrader:`;
- IDs listados em `UpgraderConfig.blacklist`.

Não há consulta a tags ou a uma lista positiva. Isso explica a interface apresentar itens de todos os mods, inclusive máquinas e componentes que não deveriam fazer parte da mecânica comercial.

## Limitação fundamental da blacklist

Seria possível gerar uma blacklist enorme contendo todos os itens exceto uma seleção aprovada. Porém, a mesma lista proíbe o item tanto como entrada quanto como alvo.

Isso impede um modelo desejável como:

> aceitar uma variedade ampla de mercadorias como aposta, mas disponibilizar apenas um catálogo pequeno de recompensas.

Além disso, a lista teria de ser regenerada sempre que um mod adicionasse, removesse ou renomeasse itens. Um item novo entraria no catálogo por padrão até a configuração ser atualizada.

## Limites do KubeJS neste caso

KubeJS pode:

- substituir a receita do Upgrader;
- criar componentes comerciais e gates caros;
- ajustar receitas que influenciam parte dos valores;
- prototipar uma condição de interação por jogador, caso o evento de uso possa ser cancelado antes da abertura da tela.

KubeJS, por si só, não altera a implementação interna de `ItemValues.catalog`. A versão inspecionada também não expõe configuração ou datapack para uma whitelist de resultados.

Usar alterações globais de receita para esconder itens seria inadequado: afetaria o restante do modpack, não apenas o Upgrader, e ainda deixaria itens avaliados por fallback de raridade.

## Caminhos possíveis

### 1. Solicitar suporte ao autor

Pedir oficialmente:

- `targetWhitelist`;
- `inputBlacklist` e `targetBlacklist` separados;
- suporte a tags para entradas e resultados;
- opção de catálogo vazio por padrão;
- evento/API para validar o jogador e o alvo no servidor.

Este é o caminho de menor manutenção se o autor aceitar.

### 2. Addon de compatibilidade do Equilibrium

Criar um mod separado que intercepte a construção ou validação do catálogo e aplique uma whitelist mantida pelo pack. Esse addon também poderia verificar divisão e maestria no servidor.

Como o Upgrader Items está publicado como **All Rights Reserved**, não devemos redistribuir um JAR modificado nem copiar seus assets ou código. A viabilidade jurídica e técnica de uma integração por addon deve ser confirmada; pedir autorização ou uma API ao autor é preferível.

### 3. Mecânica própria inspirada no conceito

Criar uma implementação original e pequena para o Equilibrium, sem reutilizar código ou assets do Upgrader Items. Ela poderia oferecer desde o princípio:

- catálogo positivo em JSON ou tags;
- entradas e resultados configurados separadamente;
- valores explícitos por mercadoria;
- validação de divisão e maestria no servidor;
- limites por jogador;
- integração com KubeJS;
- comportamento determinístico ou probabilístico configurável.

Esse caminho dá o maior controle e evita depender de detalhes internos de um mod muito novo.

## Recomendação vigente

Não balancear ainda centenas ou milhares de entradas na `blacklist`.

Manter o mod apenas no laboratório enquanto se testa a sensação da roleta. Para o modpack final, priorizar nesta ordem:

1. solicitar ao autor uma whitelist de alvos e validação extensível;
2. avaliar um addon separado se houver permissão e ponto de integração estável;
3. caso contrário, implementar uma mecânica comercial original e mínima.

A receita cara e a restrição de crafting não resolvem o problema principal: depois de obtido ou emprestado, o item continuaria oferecendo todo o catálogo e poderia ser usado por outra divisão. A validação precisa existir no momento da abertura e novamente no momento em que o servidor processa a conversão.
