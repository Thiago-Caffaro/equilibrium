---
name: equilibrium-verification
description: "Prepare, run, or improve Equilibrium Core verification on NeoForge 1.21.1: Gradle/JUnit, GameTests, dedicated-server smoke tests, and focused manual client or modpack checks. Use whenever a build, test environment, regression test, or release-candidate evidence is requested."
---

# Equilibrium verification

Use an automated-first verification ladder. The goal is faster feedback without treating a green build as proof of a player transaction.

## Test ladder

| Layer | Use when | Expected signal |
| --- | --- | --- |
| Static/data | Every change | JSON/schema checks and `gradlew build` compile/package result. |
| JUnit | Pure parsing, schema, identifiers, and decision logic | A focused red/green test under `src/test/java`; no game client. |
| GameTest / ephemeral server | Registries, command behavior, inventories, and server world state | A required test that causes `runGameTestServer` to fail on regression. |
| Dedicated server | Client/server boundaries, production JAR loading, and optional-mod absence/presence | Headless server startup plus a documented connection or command smoke check. |
| Manual client/pack | Interaction rendering, click path, accessibility, and real mod compatibility | A short scenario with precise expected result and evidence. |

Do not run the expensive layers by habit. Choose the lowest layer that can falsify the change, then add higher layers only for boundaries it cannot observe.

## Environment setup and operation

1. Confirm Java 21 and the pinned NeoForge/ModDevGradle versions before debugging a build failure. On this Windows workspace, run every Gradle task from `equilibrium-core` through `./tools/Invoke-EquilibriumGradle.ps1`; it resolves Java 21 for that process instead of trusting the shell-wide `JAVA_HOME`.
2. Use `./tools/Invoke-EquilibriumGradle.ps1 build --console=plain --no-daemon` for the final automated build, `test` for the full JUnit suite, and `test --tests <fully-qualified-test>` only while iterating on one regression. Do not substitute an IDE build or raw `gradlew` as evidence.
3. Bootstrap the isolated development dedicated server with `./tools/Initialize-EquilibriumDevServer.ps1`, then start it with `./tools/Invoke-EquilibriumGradle.ps1 runServer --console=plain --no-daemon`. The script sets `online-mode=false` only under `runs/server`; never apply that development-only setting to a public server without an explicit security decision. A smoke passes after the Merchant reload message and the server `Done (...)` message, then the temporary server must be stopped.
4. Enable JUnit through ModDevGradle only after adding the official `unitTest` configuration and JUnit Platform dependencies. Keep tests small and deterministic.
5. Add `@GameTest` only when a world/server seam is essential. Register it under the `equilibrium` namespace and run `./tools/Invoke-EquilibriumGradle.ps1 runGameTestServer --console=plain --no-daemon`; avoid committing a configuration that only fails because no tests exist.
6. For a click, command, or inventory defect, first make a minimal regression signal. The signal must fail for the reported symptom and pass after the correction; a compile success cannot serve as that signal.

## Evidence record

For a completed verification run, retain: command, Java/NeoForge/mod versions, selected layers, pass/fail output, relevant logs, and the exact manual scenario if manual confirmation was necessary. Mark unrun layers explicitly rather than implying coverage.
