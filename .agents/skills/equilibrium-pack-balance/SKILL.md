---
name: equilibrium-pack-balance
description: Change or evaluate Equilibrium pack balance through KubeJS, datapacks, tags, recipes, or individual mod configuration. Use for adjustable costs, probabilities, progression pacing, and Create/Farmer's Delight/Some Assembly Required compatibility; do not use to change Core authority or transaction code.
---

# Equilibrium pack balance laboratory

Use this skill for balance experiments and compatibility data that should remain outside Equilibrium Core.

## First classify the change

- **Core**: validation, offer schema, access rules, persistent state, networking, or UI transaction behavior. Stop and use `equilibrium-core-development`.
- **Pack balance**: recipe graph, item/tag membership, numeric cost, chance, pacing, conversion, or a mod's local config. Continue here.
- **Mixed**: make the smallest Core seam generic, then put the concrete balance values in data/KubeJS/config. Do not encode a one-off economic decision in Java.

## Laboratory rules

1. Read `references/official-sources.md` for the exact active integration and its matching game version.
2. Use `server_scripts` for recipes/tags and other reloadable server data; reserve `startup_scripts` for registration/startup-only work. Treat a full restart as required whenever the official KubeJS guidance says a reload cannot apply.
3. Keep every experiment isolated, reversible, and named after its hypothesis. One KubeJS file or config change may cover a coherent balance axis, not a collection of unrelated micro-tweaks.
4. Record the baseline, proposed value, affected inputs/outputs, mod/JAR version, reload or restart command, and result. Promote only a stable conclusion into a tracked issue or release candidate.
5. Prefer shared tags (`c:` where applicable) over a single mod item when the balance intention is material-category based. Verify the actual tag contents in the loaded pack.
6. Do not put balance scripts inside the Core JAR and do not assume KubeJS is present for Core functionality.

## Completion evidence

Report the exact reload/restart performed, the target mod versions, the data/config files changed, and one in-game verification. If a value impacts a Core transaction, also run the relevant server-side checks from the verification skill.
