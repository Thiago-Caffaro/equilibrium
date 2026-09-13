# Controlled lab installation

Artifact: `build/libs/equilibrium-0.1.0-experimental.jar`

SHA-256 for the validated build: `F67BF630881DA17F0CC36783A0EE3CF880DA760DB945AFE7847412430E35B358`.

Before copying, stop the CurseForge instance. Copy this one JAR into its
`mods` directory without replacing any existing JAR. Start once, then confirm
the log contains `Equilibrium Merchant loaded 3 positive experimental offers`.
If a rollback is needed, remove only this exact JAR while the instance is
stopped. No mod configuration or world data is changed by this slice.
