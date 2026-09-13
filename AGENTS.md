# Equilibrium working agreement

## Target and planning

- Runtime target: Minecraft `1.21.1`, NeoForge `21.1.249`, Java `21`, and ModDevGradle `2.0.147`.
- The technical plan lives in GitHub Project **Equilibrium Core — Technical Delivery**. Work that changes scope, code, or pack balance must map to one of its four existing issues; do not open a separate issue for a small implementation step.
- Preserve the three milestones: Core technical foundation; Balance laboratory — KubeJS & local configs; and Future Core integrations. Update project status only when the work meaningfully changes state.

## Ownership boundary

- **Equilibrium Core** owns authority, validation, offer-data schema, networking, persistence/audit, and its own interface behavior. Gameplay-changing requests are validated by the server.
- **KubeJS and local mod configuration** own recipes, tags, costs, chance, pacing, and compatibility tuning. They must not become a second transaction engine.
- Keep KubeJS optional: shipped Core data must load and function without it. Prefer tags over hard-coded items when interoperability is intended.
- Do not implement mastery progression, insignias, final stations, global economy, or final balance until their corresponding decision has been made.

## Source and licensing discipline

- Start with the relevant local Equilibrium skill under `.agents/skills/`. Its `references/official-sources.md` is the routing index for the authoritative documentation.
- For version-sensitive behavior, use documentation or source matching the target version. Do not port an API pattern from a newer NeoForge release without checking 1.21.1.
- Keep the code and assets original. Do not copy another mod's code, artwork, proprietary configuration, or datapack data. Record compatibility facts and source links, not vendored documentation.

## Verification standard

- Use the smallest automated signal that proves the change, then expand only when the risk requires it: static/data validation → JUnit → GameTest or server integration → dedicated-server smoke → focused manual client/pack check.
- A reported defect needs a regression signal that can fail before its fix whenever a viable seam exists. Manual confirmation alone does not prove server authority or a safe transaction.
- Build output is not release evidence by itself. Record the command, runtime version, and the relevant result for each verification layer actually run.
