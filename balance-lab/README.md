# Equilibrium balance laboratory

This directory is an isolated staging area for balance and compatibility work.
It is deliberately outside `equilibrium-core`: Java code owns authority and
offer validity, while recipes, tags, costs, chances, pacing, and local mod
configuration remain pack data.

Nothing in this directory is loaded automatically. Copy a reviewed experiment
into the root of the dedicated test instance only after recording it in
[CHANGE-INVENTORY.md](CHANGE-INVENTORY.md). Remove that copied experiment to
roll it back; the Core JAR must remain unchanged.

## Experiment order

1. Record an untouched baseline for the exact test-instance profile and mod
   versions.
2. Test one Create/Merchant candidate hypothesis in `kubejs/server_scripts`.
3. Test other content mods only after the Create/Merchant baseline is recorded.
4. Promote a stable finding only through its existing Project issue; do not
   turn candidate mods or provisional values into approved pack content here.

## Layout

- `kubejs/server_scripts`: reloadable recipes, tags, and server data.
- `kubejs/startup_scripts`: registration-time changes that genuinely require a
  full restart.
- `datapacks`: standalone datapack/tag experiments when KubeJS is not the
  appropriate owner.
- `config`: an affected mod's local configuration override only.
- `test-profiles`: reproducible profile notes and baseline records.

Follow the official-source index in the `equilibrium-pack-balance` skill
before adding an integration. In particular, verify the installed JAR's config
comments and version before changing a config key.
