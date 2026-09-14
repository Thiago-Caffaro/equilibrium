# Equilibrium Core verification

This project targets Minecraft 1.21.1, NeoForge 21.1.249, and Java 21. The
wrapper script selects Java 21 for the Gradle process even if the shell's
`JAVA_HOME` still points to an older JDK.

## Fast feedback

Run from `equilibrium-core`:

```powershell
.\tools\Invoke-EquilibriumGradle.ps1 test --console=plain --no-daemon
.\tools\Invoke-EquilibriumGradle.ps1 build --console=plain --no-daemon
```

`test` is JUnit 5 through ModDevGradle. Add a test only when it can falsify a
real contract. `MerchantCommandsTest` locks down the namespaced offer-ID
grammar emitted by a clickable Merchant card; it must consume the complete
command rather than leave text after `equilibrium:`. `MerchantOfferParserTest`
ensures the datapack schema cannot declare a failure policy or mastery level
that the temporary Merchant runtime cannot honor. `MerchantTransactionTest`
proves that batch quantities are calculated before inventory mutation and that
an overflowing request is rejected. There are no placeholder tests.

## Required verification gates

| Change or handoff | Required evidence | Manual session? |
| --- | --- | --- |
| Every Core implementation change | Focused regression test while iterating, then full `build` | No |
| Before installing a JAR | Full `build`, artifact SHA-256, and the dedicated smoke if server data or loading changed | No |
| Client presentation/click transport | Relevant automated regression plus the focused manual scenario and local evidence record | Yes |
| Pack compatibility or KubeJS/local config | Reload/restart from the balance lab, targeted in-game check, and local evidence record | Only for the changed integration |

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

The dedicated smoke passes when the log reports both `Equilibrium Merchant
loaded … positive experimental offers` and `Done (...)`. It verifies mod
loading and datapack reload only; it does not replace the focused manual
interaction check.

## Repeatable server and client smoke

After the server reports `Done (...)`, use one known development player such
as `EquilibriumSmoke`. From an operator console, run these commands in order:

```text
/equilibrium merchant grant EquilibriumSmoke
/give EquilibriumSmoke minecraft:bread 16
```

Join as that player, run `/equilibrium merchant`, and click exactly one card.
Record the offered command, the inventory delta, its success or declared
failure message, and the corresponding `EquilibriumAudit` event. Then prove
the access gate and close the run:

```text
/equilibrium merchant revoke EquilibriumSmoke
stop
```

The expected audit events are `ACCESS_GRANTED`, `OPEN_OK`, one transaction
result (`SUCCESS` or `FAILURE`), and `ACCESS_REVOKED`; `INSUFFICIENT_INPUT`
is the focused negative case. `stop` must complete before another smoke run.
Before any JAR installation, run the full `build` command above and record its
SHA-256 together with the manual result using
`New-EquilibriumManualEvidence.ps1` in `verification-evidence`.

## GameTests and manual checks

Run the GameTest server for registry, command, inventory, and server-world
behavior that cannot be covered by JUnit:

```powershell
.\tools\Invoke-EquilibriumGradle.ps1 runGameTestServer
```

`MerchantGameTests` registers an explicit server-world transaction scenario.
It proves an authorised success and same-tick duplicate rejection, declared
failure consumption, insufficient and unknown-offer rejection without output,
and safe world-drop delivery when a survival player's inventory is full. The
runner enables `equilibrium` and `minecraft` because the test uses the
existing vanilla empty-bastion fixture; it does not register vanilla tests.

Manual testing remains narrowly focused on visible behavior and modpack
compatibility. For the current merchant-click defect, record the full command
shown in chat, the parser result, server-side inventory change, and audit log.
The parser correction must first receive a red/green regression signal.
