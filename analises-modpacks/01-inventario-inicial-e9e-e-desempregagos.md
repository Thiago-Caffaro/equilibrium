# Inventário inicial — E9E e Desempregagos

> Estado: leitura estática inicial, em 03/09/2026.  
> Escopo: arquivos locais das instâncias; nenhuma instalação foi alterada.

## Objetivo desta primeira passagem

Estabelecer onde está a informação útil de cada referência antes de gastar tempo jogando. Esta não é uma avaliação de qualidade, nem uma shortlist de mods para o Equilibrium.

## Evidências observadas

| Referência | Versão / loader | JARs em `mods` | Curadoria de scripts | Quests estruturadas |
| --- | --- | ---: | --- | --- |
| Enigmatica 9 Expert (E9E) | Minecraft 1.19.2 / Forge 43.4.23 | 232 | 928 arquivos `.js` em `kubejs` | 44 arquivos `.snbt` de quest |
| Desempregagos | Minecraft 1.21.1 / NeoForge 21.1.216 | 256 | nenhum diretório KubeJS | apenas os arquivos-base do FTB Quests; não há capítulos de quests instalados |

### E9E: progressão está explícita nos arquivos

**Fatos observados**

- O E9E separa scripts em `base`, `normal` e `expert`, inclusive em receitas, tabelas de loot e tags.
- Há diretórios próprios de receitas expert para, entre outros, Mekanism (12 arquivos), Immersive Engineering (12), Create (11), Ars Nouveau (10), Thermal (10), PneumaticCraft (9), Nature's Aura (7), Industrial Foregoing (6), Occultism (5), Twilight Forest (4), AE2 (3) e Powah (3).
- Nas receitas expert dos principais sistemas, aparecem referências a vários outros domínios. A interdependência é codificada em receitas, não apenas explicada em texto.
- A questline possui capítulos específicos para aventura, automação, armazenamento, Create, AE2, Mekanism, Ars Nouveau, Nature's Aura, Occultism, PneumaticCraft, Powah, Industrial Foregoing, Thermal e outros; vários têm capítulo normal e capítulo expert.
- Há alteração deliberada de loot e estruturas, incluindo conteúdo de Twilight Forest, Blue Skies e baús de mods específicos.

**Leitura para análise**

O E9E é uma referência especialmente útil para estudar como uma progressão de especialista torna dependências entre sistemas auditáveis: scripts de receita, loot e chapters podem ser lidos sem completar a campanha. A unidade de estudo correta não é “o mod Mekanism” isolado, mas os gates que relacionam Mekanism aos outros sistemas.

**Não concluído**

- O simples número de referências cruzadas não mede se a experiência é agradável, justa ou adequada para seis jogadores.
- Não se conclui daqui que a estrutura `normal/expert`, os mods presentes ou as receitas do E9E devam ser reutilizados.
- Ainda é necessário escolher uma amostra pequena de gates para leitura linha a linha e, depois, testar no jogo somente hipóteses concretas.

### Desempregagos: abundância de rotas paralelas

**Fatos observados**

- A instância é de Minecraft 1.21.1 com NeoForge e possui 257 registros de addons instalados no metadado do launcher.
- Ela reúne, simultaneamente, sistemas de tecnologia e automação como Create, Mekanism, Industrial Foregoing, Powah, RFTools Builder, Applied Energistics 2, Refined Storage, Hostile Neural Networks, Mob Grinding Utils e Mystical Agriculture.
- Também contém Ars Nouveau, Occultism, The Twilight Forest, End Remastered e Draconic Evolution, entre outros sistemas de magia, exploração e endgame.
- O diretório de quests contém somente os arquivos de dados, idioma e grupos do FTB Quests; não há capítulos de conteúdo instalados.
- Não há diretório KubeJS na instância examinada.

**Leitura para análise**

O pack anterior é a melhor fonte para mapear sobreposição de papéis: quando várias opções resolvem o mesmo problema — armazenamento, processamento, energia, recursos ou mobs — o grupo pode pular sistemas e concentrar poder cedo. Essa leitura conversa diretamente com a origem do Equilibrium, mas não transforma qualquer mod do pack em problema ou veto automático.

**Não concluído**

- Ainda não foi determinada a rota concreta que o grupo efetivamente usou, nem em que momento ela ultrapassou as demais.
- A presença de dois sistemas não prova que ambos sejam equivalentes ou igualmente acessíveis.
- Nenhuma mudança conceitual do Equilibrium decorre deste inventário.

## Próxima coleta recomendada

1. Selecionar de 8 a 12 recipes/gates expert do E9E que cruzem tecnologia, magia e aventura; registrar entrada, saída, sistemas exigidos e intenção aparente.
2. Mapear no Desempregagos as famílias que concorrem pela mesma função (energia, storage, processamento, minérios, mobs e recursos renováveis), sem julgar ainda qual deve ficar.
3. Repetir o mesmo inventário para E6E, E10, FTB Evolution e Cisco's Fantasy Medieval RPG antes de abrir fichas de candidatos no Avaliador de Mods.

## Rastreabilidade local

As evidências acima foram lidas nas seguintes instâncias locais:

- `C:\Users\thiag\curseforge\minecraft\Instances\Enigmatica 9 Expert - E9E`
- `C:\Users\thiag\curseforge\minecraft\Instances\Desempregagos`

Os caminhos são informativos para reprodução local e não fazem parte da distribuição do repositório.
