# Merchant supply-chain evidence map

This evidence map describes the exact laboratory JARs. It is not an approved
modlist, a final economy, a progression decision, or an exclusivity rule.

## Profile and boundary

- Instance: `Equilibrium - Test grounds`; Minecraft `1.21.1`; NeoForge `21.1.249`
- KubeJS `2101.7.2-build.377`; Create `6.0.10`; Farmer's Delight `1.3.4`
- Some Assembly Required `5.2.8`; Slice & Dice `4.3.3` is installed.

| Candidate chain | Declared path | Role and evidence state |
| --- | --- | --- |
| Rice storage | `9x farmersdelight:rice_panicle` -> `1x farmersdelight:rice_bale` | Farmer's Delight has the original 3x3 craft. EXP-CM-001 adds equivalent Create compacting without changing material cost. Validated and reversible; not a price or Core transaction. |
| Rice preparation | `rice_panicle` -> `rice` + `straw` through `create:milling`; `rice` is the sole current `c:crops/rice` member and feeds Farmer's Delight cooking. | Concrete agriculture -> Create -> food bridge. Static contract passed; the focused Millstone observation is OBS-CM-001. |
| Sandwich components | Some Assembly Required declares `minecraft:bread` -> `4x someassemblyrequired:bread_slice` through both Create cutting and a Farmer's Delight cutting-board route. | Its direct Create recipe is correctly withheld while Slice & Dice is installed. Slice & Dice declares automatic conversion of Farmer's Delight cutting recipes; that makes an equivalent Create pathway plausible, but not yet proven for this exact sandwich recipe. Source audited; no balance change proposed. |
| Prepared sandwiches | Component-tagged `someassemblyrequired:sandwich` -> Farmer's Delight sandwich through `create:pressing`. | Existing cross-mod prepared-food path. Its data components require any later automation test to cover both sandwich station and press. Source audited; manual system test deferred. |

## Exact data facts

- `data/c/tags/item/crops/rice.json` declares exactly `farmersdelight:rice`.
- Farmer's Delight's `integration/create/milling/rice_panicle` recipe is
  conditional on Create and declares one panicle input, one rice, one straw,
  and processing time 50. Its cutting-board counterpart accepts `c:tools/knife`.
- Some Assembly Required 5.2.8 contains 28 `create:cutting` and four
  `create:pressing` recipe fixtures. The verifier pins the direct bread-slice
  recipe's Slice & Dice exclusion and bacon-sandwich pressing rather than
  treating those totals as a forward guarantee.
- Slice & Dice 4.3.3 contains its Farmer's Delight compatibility and recipe
  injection classes. This is static evidence only; it does not claim that a
  dynamic conversion has been exercised in-game.

## Local configuration audit

No local configuration is changed. Exact generated files were inspected first:

| Owner | Observed settings | Decision |
| --- | --- | --- |
| Farmer's Delight | `richSoilBoostChance = 0.2`; `cuttingBoardFortuneBonus = 0.1`; crop crates, village trade/loot, and cutting-board dispenser behavior enabled. | Retain. Yield, rare-cutting output, and world availability need separate hypotheses. |
| Some Assembly Required | sandwich height 32, generated sandwich chest loot enabled, food effects/durations configured. | Retain. Stack limits and generated loot affect pacing and are not recipe-test fixes. |
| Slice & Dice | slicer consumes tool durability, requires rotation, and its basin cooking conversion is enabled with `HEATED` heat. | Retain. Automatic conversion and heat requirements are progression choices, not incidental compatibility switches. |

## Verification and next decision

```powershell
.\tools\Assert-MerchantSupplyChainEvidence.ps1 `
  -FarmersDelightJarPath 'C:\Users\thiag\curseforge\minecraft\Instances\Equilibrium - Test grounds\mods\FarmersDelight-1.21.1-1.3.4.jar' `
  -SomeAssemblyRequiredJarPath 'C:\Users\thiag\curseforge\minecraft\Instances\Equilibrium - Test grounds\mods\someassemblyrequired-5.2.8.jar' `
  -SliceAndDiceJarPath 'C:\Users\thiag\curseforge\minecraft\Instances\Equilibrium - Test grounds\mods\sliceanddice-4.3.3-neoforge.jar'
```

Then run [OBS-CM-001](test-profiles/2026-09-14-rice-milling-observation.md).
It validates existing owner-mod data and copies no file, so no reload, restart,
or rollback is needed. It cannot prove a final Merchant loop or future gate.

Recipe additions and replacements remain in KubeJS `server_scripts`; native
recipes are read from the versioned JAR as the compatibility fact for this
profile. The local official-source index links KubeJS, NeoForge tags, and
owner-mod sources.
