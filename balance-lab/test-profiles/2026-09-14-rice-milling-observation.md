# OBS-CM-001 — existing rice milling integration

## Question

Does the installed Farmer's Delight/Create integration convert one rice panicle
into one rice and one straw in a powered Create Millstone, without KubeJS or a
configuration change?

## Exact profile

- Instance: `Equilibrium - Test grounds`
- Minecraft `1.21.1`; NeoForge `21.1.249`
- Create `create-1.21.1-6.0.10.jar`
- Farmer's Delight `FarmersDelight-1.21.1-1.3.4.jar`
- KubeJS `kubejs-neoforge-2101.7.2-build.377.jar`
- Some Assembly Required `someassemblyrequired-5.2.8.jar`
- Slice & Dice `sliceanddice-4.3.3-neoforge.jar`

## Static source evidence

`farmersdelight:integration/create/milling/rice_panicle` is conditional on
Create and uses `create:milling`: one `farmersdelight:rice_panicle` yields one
`farmersdelight:rice` plus one `farmersdelight:straw`, with processing time 50.
The current `c:crops/rice` tag contains `farmersdelight:rice`.

Run the static verifier in [the supply-chain map](../merchant-supply-chain-map.md)
before the manual observation.

## Manual procedure

1. Start the existing test world. Copy no script, datapack, or config and do
   not run `/reload` solely for this observation.
2. Place a Create Millstone, provide rotational power, and insert exactly one
   `farmersdelight:rice_panicle`.
3. Confirm exactly one `farmersdelight:rice` and one `farmersdelight:straw`.
4. Record normal completion, or attach a screenshot/log excerpt on failure.

## Result and rollback

Expected: the Millstone completes using the installed owner-mod recipe. No
instance file changes, so no rollback exists.

**Result:** validated on 2026-09-14. The user confirmed the powered
Millstone route in the recorded test profile and supplied in-game evidence of
the rice-panicle processing path with rice and straw outputs. No script,
datapack, config, reload, or restart was needed for this owner-mod recipe.
