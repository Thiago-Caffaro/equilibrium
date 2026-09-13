# Equilibrium Core verification

This project targets Minecraft 1.21.1, NeoForge 21.1.249, and Java 21. The
wrapper script selects Java 21 for the Gradle process even if the shell's
`JAVA_HOME` still points to an older JDK.

## Fast feedback

Run from `equilibrium-core`:

```powershell
.\tools\Invoke-EquilibriumGradle.ps1 build
.\tools\Invoke-EquilibriumGradle.ps1 test
```

`test` is JUnit 5 through ModDevGradle. Add a test only when it can falsify a
real contract. `MerchantCommandsTest` locks down the namespaced offer-ID
grammar emitted by a clickable Merchant card; it must consume the complete
command rather than leave text after `equilibrium:`. There are no placeholder
tests.

## Dedicated development server

Bootstrap it once:

```powershell
.\tools\Initialize-EquilibriumDevServer.ps1
```

The script prepares the isolated `runs/server` directory and sets
`online-mode=false` only there so a development player can join. Then launch
the server with:

```powershell
.\tools\Invoke-EquilibriumGradle.ps1 runServer
```

This follows the dedicated-server approach described by the [NeoForge 1.21.1
getting-started guide](https://docs.neoforged.net/docs/1.21.1/gettingstarted/).
The current ModDevGradle development target does not generate an `eula.txt`;
if a future runtime does, accept its EULA before starting it. Do not reuse the
generated configuration as a public-server configuration.

## GameTests and manual checks

`runGameTestServer` is available but is intentionally not run until at least
one required `@GameTest` exists; NeoForge's game-test server fails when no
tests are supplied. Use it for registry, command, inventory, and server-world
behavior that cannot be covered by JUnit:

```powershell
.\tools\Invoke-EquilibriumGradle.ps1 runGameTestServer
```

Manual testing remains narrowly focused on visible behavior and modpack
compatibility. For the current merchant-click defect, record the full command
shown in chat, the parser result, server-side inventory change, and audit log.
The parser correction must first receive a red/green regression signal.
