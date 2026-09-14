// EXP-CM-001 — test whether rice-bale packing can be automated through Create
// without discounting Farmer's Delight's existing nine-panicle material cost.
//
// This is intentionally additive: it does not remove or replace the vanilla
// crafting recipe. Delete this file and run /reload to roll the experiment back.
ServerEvents.recipes(event => {
  // The KubeJS Create recipe-helper addon is not installed in the test
  // profile. Use Create 6's native recipe schema instead of its unavailable
  // event.recipes.create.compacting(...) helper.
  event.custom({
    type: 'create:compacting',
    ingredients: [
      { item: 'farmersdelight:rice_panicle' },
      { item: 'farmersdelight:rice_panicle' },
      { item: 'farmersdelight:rice_panicle' },
      { item: 'farmersdelight:rice_panicle' },
      { item: 'farmersdelight:rice_panicle' },
      { item: 'farmersdelight:rice_panicle' },
      { item: 'farmersdelight:rice_panicle' },
      { item: 'farmersdelight:rice_panicle' },
      { item: 'farmersdelight:rice_panicle' }
    ],
    results: [
      { id: 'farmersdelight:rice_bale' }
    ]
  }).id('equilibrium:merchant_rice_bale_compacting')
})
