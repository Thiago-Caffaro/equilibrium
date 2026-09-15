# Balance-change inventory

Every non-baseline experiment gets one row before it is copied into a test
instance. Keep related changes on one balance axis in the same row; do not use
this file as a task list.

| ID | Owner mod | Intent and affected data | Source file | Reload or restart | Test profile | Rollback | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BASELINE-CM-001 | None | Untouched Create/Merchant candidate baseline | No copied data | Not applicable | [2026-09-13-create-merchant-baseline](test-profiles/2026-09-13-create-merchant-baseline.md) | Not applicable | Recorded |
| EXP-CM-001 | Create / Farmer's Delight compatibility | Add one mechanical-compacting route: nine rice panicles to one rice bale; original crafting route remains | [01-create-merchant-rice-bale-compacting.js](kubejs/server_scripts/01-create-merchant-rice-bale-compacting.js) | `/reload` after copying to the test instance | [2026-09-14-rice-bale-compacting](test-profiles/2026-09-14-rice-bale-compacting.md) | Remove that exact script, then run `/reload` | Validated — retained as a reversible balance experiment |

`Owner mod` is the mod whose gameplay data/configuration is changed. `Rollback`
must name the exact copied file or config key to remove or restore. Record the
installed mod version and observed outcome in the referenced test-profile note,
not in Core data.
