# EXP-CM-001 — Create compacting route for rice bales

## Hypothesis

Adding a Create mechanical-compacting route for one Farmer's Delight rice bale
will make rice packing automatable without reducing the existing material cost
of nine rice panicles. This experiment evaluates only that logistics route; it
does not establish a final economy value or Merchant price.

## Exact profile

- Instance profile: `Equilibrium - Test grounds`
- Minecraft: 1.21.1
- NeoForge: 21.1.249
- KubeJS: `kubejs-neoforge-2101.7.2-build.377.jar`
- Create: `create-1.21.1-6.0.10.jar`
- Farmer's Delight: `FarmersDelight-1.21.1-1.3.4.jar`
- Some Assembly Required: `someassemblyrequired-5.2.8.jar`

## Change under test

`01-create-merchant-rice-bale-compacting.js` adds the recipe
`equilibrium:merchant_rice_bale_compacting`:

- inputs: nine `farmersdelight:rice_panicle`;
- processing: Create mechanical press above a basin;
- output: one `farmersdelight:rice_bale`.

The original Farmer's Delight shaped recipe remains available. No recipe is
removed and no Core data is changed.

## API compatibility correction

The first `/reload` loaded both KubeJS scripts but failed to register the
recipe: `event.recipes.create.compacting(...)` reported that no two-argument
constructor existed. The loaded-plugin list contained no KubeJS Create helper
integration, so the experiment now uses `event.custom(...)` with the native
Create 6 compacting schema. This changes serialization only; inputs, output,
and balance hypothesis are unchanged.

Run the following static regression contract before each manual reload:

```powershell
.\tools\Assert-CreateCompactingExperiment.ps1 -CreateJarPath 'C:\Users\thiag\curseforge\minecraft\Instances\Equilibrium - Test grounds\mods\create-1.21.1-6.0.10.jar'
```

## Deployment and verification procedure

1. Copy the script to the instance's `kubejs/server_scripts` folder.
2. Load a test world and run `/reload`; confirm the server log has no KubeJS
   script or recipe errors.
3. Place a mechanical press above a basin, insert exactly nine rice panicles,
   and provide rotational power.
4. Confirm that the basin produces exactly one rice bale and consumes all nine
   panicles. Repeat once after a second `/reload`.
5. Confirm that the ordinary 3×3 Farmer's Delight crafting recipe still makes
   one rice bale from nine panicles.

## Rollback

Remove only `01-create-merchant-rice-bale-compacting.js` from the instance's
`kubejs/server_scripts` folder and run `/reload`. The existing Farmer's
Delight recipe is untouched throughout.

## Result

The first deployment produced one failed recipe during `/reload`; no in-game
test was attempted. The corrected script was copied to `Equilibrium - Test
grounds` on 2026-09-14 and its SHA-256 was verified against the tracked source.

The next `/reload` must report two KubeJS server scripts with zero errors and
one added recipe with zero failed recipes before the mechanical test is run.
