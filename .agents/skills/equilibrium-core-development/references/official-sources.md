# Official source index — Equilibrium Core

Use target-version pages first. The project currently targets Minecraft 1.21.1 and NeoForge 21.1.249.

| Situation | Primary reference | Use it for |
| --- | --- | --- |
| Bootstrap, Java, build and dedicated server | [NeoForge Getting Started — 1.21.1](https://docs.neoforged.net/docs/1.21.1/gettingstarted/) | Java 21, Gradle runs, EULA and development-server setup. |
| Build configuration and JUnit runtime | [ModDevGradle](https://docs.neoforged.net/toolchain/docs/plugins/mdg/) | `unitTest`, JUnit, ephemeral server and run configuration syntax. Check compatibility with the pinned plugin version before changing Gradle. |
| Client/server payloads | [NeoForge Networking — 1.21.1](https://docs.neoforged.net/docs/1.21.1/networking/) | Structured payload registration, direction, encoding and handler ownership. |
| Identifier parsing | [Resource Locations — 1.21.1](https://docs.neoforged.net/docs/1.21.1/misc/resourcelocation/) | Namespaced IDs such as `equilibrium:offer_id`; do not guess parser behavior. |
| Data-driven compatibility | [Tags — 1.21.1](https://docs.neoforged.net/docs/1.21.1/resources/server/tags/) | Tag paths, optional entries, `c` namespace conventions and additive behavior. |
| Conditional pack data | [Data Load Conditions — 1.21.1](https://docs.neoforged.net/docs/1.21.1/resources/server/datapack/conditions/) | Guarding data that relies on optional integrations. |
| Existing local intent | [`equilibrium-core/HANDOFF.md`](../../../../equilibrium-core/HANDOFF.md) | Explicitly accepted architecture and deferred product decisions. |

## Source policy

- A documentation link guides an implementation; it is not copied into the mod or distributed with it.
- Prefer the exact 1.21.1 NeoForge page. If a toolchain page is version-neutral, verify its API against the pinned ModDevGradle release and compile it.
- Add a mod integration to the pack reference index before coding against it. Record its exact tested JAR version in test evidence, not in a Core protocol by default.
