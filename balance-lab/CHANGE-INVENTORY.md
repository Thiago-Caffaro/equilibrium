# Balance-change inventory

Every non-baseline experiment gets one row before it is copied into a test
instance. Keep related changes on one balance axis in the same row; do not use
this file as a task list.

| ID | Owner mod | Intent and affected data | Source file | Reload or restart | Test profile | Rollback | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BASELINE-CM-001 | None | Untouched Create/Merchant candidate baseline | No copied data | Not applicable | [2026-09-13-create-merchant-baseline](test-profiles/2026-09-13-create-merchant-baseline.md) | Not applicable | Recorded |
| EXP-CM-001 | Create / Farmer's Delight compatibility | Add one mechanical-compacting route: nine rice panicles to one rice bale; original crafting route remains | [01-create-merchant-rice-bale-compacting.js](kubejs/server_scripts/01-create-merchant-rice-bale-compacting.js) | `/reload` after copying to the test instance | [2026-09-14-rice-bale-compacting](test-profiles/2026-09-14-rice-bale-compacting.md) | Remove that exact script, then run `/reload` | Validated — retained as a reversible balance experiment |
| OBS-CM-001 | Create / Farmer's Delight / Some Assembly Required / Slice & Dice compatibility | Read-only evidence map for rice milling, shared rice tag, bread slicing, sandwich pressing, and relevant local-config facts; no balance data is changed | [merchant-supply-chain-map.md](merchant-supply-chain-map.md), [Assert-MerchantSupplyChainEvidence.ps1](../tools/Assert-MerchantSupplyChainEvidence.ps1) | No reload or restart; existing owner-mod data only | [2026-09-14-rice-milling-observation](test-profiles/2026-09-14-rice-milling-observation.md) | Not applicable; no instance file is copied or changed | Validated — static contract and focused Millstone observation passed |

`Owner mod` is the mod whose gameplay data/configuration is changed. `Rollback`
must name the exact copied file or config key to remove or restore. Record the
installed mod version and observed outcome in the referenced test-profile note,
not in Core data.
