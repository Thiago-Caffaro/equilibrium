# Panorama das demais referências locais

> Estado: leitura estática inicial, em 03/09/2026.  
> Escopo: inventário de arquivos locais; nenhuma instância foi alterada.

## Objetivo

Definir a ordem útil de leitura entre as referências restantes. Os números abaixo indicam onde há material de curadoria a investigar; não medem qualidade, complexidade real ou adequação ao Equilibrium.

## Evidências observadas

| Referência | Versão / loader | JARs em `mods` | Arquivos `.js` em KubeJS | Scripts em caminhos de receitas | Capítulos FTB Quests |
| --- | --- | ---: | ---: | ---: | ---: |
| Enigmatica 6 Expert (E6E) | Minecraft 1.16.5 / Forge 36.2.39 | 359 | 852 | 13 | 38 |
| Enigmatica 10 (E10) | Minecraft 1.21.1 / NeoForge 21.1.244 | 312 | 320 | 146 | 28 |
| FTB Evolution | Minecraft 1.21.1 / NeoForge 21.1.248 | 523 | 78 | 56 | 40 |
| Cisco's Fantasy Medieval RPG [Ultimate] | Minecraft 1.19.2 / Forge 43.5.1 | 288 | 4 | 0 | 17 |

## Leitura de prioridade

### Enigmatica 6 Expert

**Fato observado:** possui uma quantidade alta de scripts KubeJS e uma questline com 38 capítulos.  
**Leitura para análise:** é a próxima referência natural para comparar padrões de gates expert com o E9E, inclusive quais ideias persistem entre gerações diferentes.  
**Não concluído:** não foi avaliado ainda se seus gates envelheceram bem, nem quais são relevantes para uma versão moderna.

### Enigmatica 10

**Fato observado:** em uma base 1.21.1/NeoForge, concentra 146 scripts localizados em caminhos de receitas e 28 capítulos de quests.  
**Leitura para análise:** é a referência principal para investigar curadoria moderna por receitas antes de considerar versão, loader ou candidatos concretos.  
**Não concluído:** a quantidade de scripts não determina profundidade, qualidade de pacing ou compatibilidade futura.

### FTB Evolution

**Fato observado:** é a maior instância local desta comparação por número de JARs (523), com 56 scripts em caminhos de receitas e 40 capítulos de quests.  
**Leitura para análise:** é especialmente útil para mapear sistemas concorrentes e soluções modernas de larga escala, isto é, onde a amplitude pode gerar sobreposição ou atalhos.  
**Não concluído:** nenhum sistema presente foi classificado como redundante, aprovado ou rejeitado.

### Cisco's Fantasy Medieval RPG [Ultimate]

**Fato observado:** tem somente quatro arquivos KubeJS, nenhum em caminho de receitas, e 17 capítulos de quests.  
**Leitura para análise:** sua contribuição mais provável é a experiência de Aventura — exploração, bosses, estruturas, dimensões e orientação — e não um modelo de reescrita extensa de receitas.  
**Não concluído:** ainda será preciso ler as quests, configurações e conteúdo de mundo para saber o que pode informar a divisão de Aventura.

## Sistemas recorrentes observados por nome de JAR

Em pelo menos três das quatro referências deste relatório aparecem Ars Nouveau, Create, Immersive Engineering, Mekanism, Occultism, PneumaticCraft e Powah. Esse é apenas um sinal de recorrência no ecossistema estudado. Não estabelece candidatura, disponibilidade na versão final, nem papel definitivo de cada sistema.

AE2 e Industrial Foregoing aparecem em duas dessas quatro referências; Mystical Agriculture, Thermal e Twilight Forest aparecem em somente uma delas nessa passagem. A contagem não inclui E9E nem Desempregagos, que foram documentados no relatório anterior.

## Ordem de aprofundamento resultante

1. E9E e Desempregagos: continuar a coleta já iniciada sobre gates e redundâncias.
2. E6E: comparar organização e pacing de expertização.
3. E10: identificar receitas, integrações e candidatos modernos.
4. FTB Evolution: mapear amplitude, concorrência funcional e automação.
5. Cisco: estudar Aventura, com leitura de quests e conteúdo de mundo.

Essa ordem é operacional e pode mudar se uma pergunta concreta do planejamento exigir outra referência antes.

## Rastreabilidade local

- `C:\Users\thiag\curseforge\minecraft\Instances\Enigmatica 6 Expert - E6E`
- `C:\Users\thiag\curseforge\minecraft\Instances\Enigmatica 10 - E10`
- `C:\Users\thiag\curseforge\minecraft\Instances\FTB Evolution`
- `C:\Users\thiag\curseforge\minecraft\Instances\Cisco's Fantasy Medieval RPG [Ultimate]`
