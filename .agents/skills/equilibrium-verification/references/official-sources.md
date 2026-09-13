# Official source index — Verification

| Need | Primary reference | Use it for |
| --- | --- | --- |
| Java, Gradle, dedicated server | [NeoForge Getting Started — 1.21.1](https://docs.neoforged.net/docs/1.21.1/gettingstarted/) | Java 21, `gradlew build`, `runServer`, EULA, `online-mode=false` in a development server, and the dedicated-server testing recommendation. |
| JUnit and ephemeral server support | [ModDevGradle](https://docs.neoforged.net/toolchain/docs/plugins/mdg/) | The `unitTest` block, JUnit Platform dependencies, and the optional ephemeral-server test provider. |
| In-game tests | [NeoForge Game Tests — 1.21.1](https://docs.neoforged.net/docs/1.21.1/misc/gametest/) | `@GameTest`, registration, templates, `runGameTestServer`, and enabled namespaces. The force-exit note on that page applies to NeoGradle, not this ModDevGradle project. |
| Client/server test boundary | [NeoForge Networking — 1.21.1](https://docs.neoforged.net/docs/1.21.1/networking/) | Why interaction requests need a server handler and why UI checks cannot prove server correctness. |
| KubeJS reload tests | [KubeJS official site](https://kubejs.com/) | `/reload`, `/kubejs reload server_scripts`, and restart-only startup changes. |

## Minimal commands

Run from `equilibrium-core` on Windows:

```powershell
.\gradlew.bat build
.\gradlew.bat test
.\gradlew.bat runGameTestServer
.\gradlew.bat runServer
```

The last command is intentionally long-running. Stop it only after observing the expected dedicated-server state; preserve the relevant log excerpt in the verification evidence.
