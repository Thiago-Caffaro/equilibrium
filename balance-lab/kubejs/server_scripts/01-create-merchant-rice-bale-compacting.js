// EXP-CM-001 — test whether rice-bale packing can be automated through Create
// without discounting Farmer's Delight's existing nine-panicle material cost.
//
// This is intentionally additive: it does not remove or replace the vanilla
// crafting recipe. Delete this file and run /reload to roll the experiment back.
ServerEvents.recipes(event => {
  event.recipes.create.compacting(
    'farmersdelight:rice_bale',
    [
      'farmersdelight:rice_panicle',
      'farmersdelight:rice_panicle',
      'farmersdelight:rice_panicle',
      'farmersdelight:rice_panicle',
      'farmersdelight:rice_panicle',
      'farmersdelight:rice_panicle',
      'farmersdelight:rice_panicle',
      'farmersdelight:rice_panicle',
      'farmersdelight:rice_panicle'
    ]
  ).id('equilibrium:merchant_rice_bale_compacting')
})
