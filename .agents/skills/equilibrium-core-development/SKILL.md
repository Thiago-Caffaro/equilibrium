---
name: equilibrium-core-development
description: Implement, review, or design Equilibrium Core behavior for NeoForge 1.21.1, especially merchant offers, data schemas, commands, networking, and server-authoritative transactions. Use for code inside equilibrium-core; do not use for recipe or local-config tuning alone.
---

# Equilibrium Core development

Use this skill for changes inside `equilibrium-core` that affect what the Core owns: offer definitions, validation, command/UI contracts, persistence/audit, networking, or a server-side transaction.

## First orient

1. Read the root `AGENTS.md`, `equilibrium-core/HANDOFF.md`, and the applicable Project issue.
2. Read `references/official-sources.md` only for the subsystem being changed. It links to the target-version primary sources; it is an index, not a substitute for the sources.
3. State the boundary in one sentence: Core behavior, pack balance, or both. Split the work when a recipe/config alteration is independent of the Core change.

## Design rules

- Treat all client input as a request, never authority. Send the minimum stable identifier and intent; resolve the offer and re-check player state, inventory, permissions, cooldown/token, inputs, and outputs on the server.
- Use `ResourceLocation`-aware parsing and codecs whenever identifiers can contain a namespace. A command argument that only accepts a word is not valid for `namespace:path` identifiers.
- Make an offer either fully accepted or fully rejected. Do not consume inputs before output feasibility has been checked, and log exceptional drops or rejected requests with enough context to audit them.
- Keep data deterministic and data-driven. Parse and validate the declared schema at reload time; reject or visibly report unknown/invalid values instead of silently ignoring fields that authors believe are active.
- Do not claim replay protection, mastery checks, or config support unless the implementation actually enforces it. A same-tick duplicate guard is not a general replay boundary.
- Prefer tags and data conditions for compatibility. A mod-specific item must be optional or a documented required dependency; do not hide the failure until a player clicks a button.
- Before adding a proper GUI, consult the 1.21.1 networking reference. The client needs display data; the server remains the sole transaction authority.

## Completion evidence

For every Core change, provide: changed contract/schema, validation path, tests run, and one risk deliberately left out of scope. Follow the verification skill when the behavior crosses a client/server or inventory boundary.
