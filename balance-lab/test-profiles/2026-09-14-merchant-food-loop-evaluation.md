# EVAL-CM-001 — Merchant food loop (MER-2A)

## Question

Do Farmer's Delight, Slice & Dice, and Some Assembly Required form a legible Merchant food loop with meaningful manual preparation before automation, rather than redundant recipes and automatic food?

This is a compatibility and experience evaluation. It does not select a final modlist, declare final Merchant outputs, set prices/chances, or add a Core gate. Its evidence informs AB-025, AB-026, and AB-060 through AB-063; it cannot close those decisions alone.

## Exact current profile

- Instance: `Equilibrium - Test grounds`; Minecraft `1.21.1`; NeoForge `21.1.249`.
- Create `6.0.10`, Farmer's Delight `1.3.4`, Slice & Dice `4.3.3`, and Some Assembly Required `5.2.8`.
- KubeJS `2101.7.2-build.377` is present, but this evaluation adds or changes no script. EXP-CM-001 remains the separate retained rice-bale experiment.
- The active instance also contains Create addons and quality-of-life mods. Treat results as compatibility evidence for this profile, not an isolated performance or final-modlist conclusion.

## Static preflight

Run this before the manual session:

```powershell
.\tools\Assert-MerchantSupplyChainEvidence.ps1 `
  -FarmersDelightJarPath 'C:\Users\thiag\curseforge\minecraft\Instances\Equilibrium - Test grounds\mods\FarmersDelight-1.21.1-1.3.4.jar' `
  -SomeAssemblyRequiredJarPath 'C:\Users\thiag\curseforge\minecraft\Instances\Equilibrium - Test grounds\mods\someassemblyrequired-5.2.8.jar' `
  -SliceAndDiceJarPath 'C:\Users\thiag\curseforge\minecraft\Instances\Equilibrium - Test grounds\mods\sliceanddice-4.3.3-neoforge.jar'
```

The contract pins the rice tag and milling path, Farmer's Delight fried-rice ingredients, Slice & Dice configuration, and the Some Assembly Required station and bacon-sandwich pressing payload.

## One focused laboratory session

Use creative mode or controlled fixture inputs. Record a screenshot and the observed result for each stage. Do not change recipes/configs; no `/reload` or restart is required solely for this evaluation.

| Stage | Setup and action | Expected evidence | Record |
| --- | --- | --- | --- |
| A — manual preparation | Cook `farmersdelight:rice`, an egg, carrot, and onion in a heated Farmer's Delight Cooking Pot. | One `farmersdelight:fried_rice`; manual preparation is clear before automation. | Inputs, output, apparatus, and interaction clarity. |
| B — automatic cutting | Place an allowed knife in a powered Slice & Dice Slicer. Process one rice panicle. | The Slicer exposes the Farmer's Delight cutting route and yields rice plus straw. | Tool acceptance, power requirement, output, and mismatch if any. |
| C — automatic cooking | Use the same fried-rice ingredient set in a heated Create basin/mixer. | Slice & Dice exposes the Cooking Pot recipe as heated mixing and yields fried rice. | Heat/apparatus, output, and whether automation bypasses a meaningful decision. |
| D — component assembly | Craft/use a Sandwiching Station, assemble the bacon-sandwich components pinned by the contract, then execute Create pressing. Use the recipe viewer for station interaction if needed. | One `farmersdelight:bacon_sandwich` from a component-aware sandwich; no arbitrary output selection. | Component handling, press location, output, intermediate burden, and failure. |

## Evaluation rubric

For each stage, mark **clear**, **needs evidence**, or **problematic**, with a one-sentence reason. Do not assign final numeric balance.

| Axis | Evidence to record |
| --- | --- |
| Manual value | The manual apparatus teaches a recognizable food step before automation. |
| Automation boundary | Ingredient and infrastructure decisions remain; no generic food is minted. |
| Group usefulness | The output can plausibly support shared provisioning or a desired later input. |
| Intermediates and UX | Ingredient handling is understandable and avoids unjustified EMI/inventory pollution. |
| Conflict/risk | Conditions, tags, addons, and config do not silently duplicate or bypass a route. |

## Completion and rollback

Classify the loop only as **retain for a later isolated test**, **defer pending a content candidate**, or **revert/reject as a candidate**. No test data is copied, so no rollback exists. A later KubeJS/config hypothesis needs its own inventory row, rollback, and reload/restart evidence.

## Result

Pending the single focused laboratory session.
