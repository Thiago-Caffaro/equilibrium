# Local manual-verification records

Generate one evidence record after every focused manual client or modpack run:

```powershell
.\tools\New-EquilibriumManualEvidence.ps1 `
  -JarPath .\build\libs\equilibrium-0.1.0-experimental.jar `
  -InstanceProfile 'Equilibrium - Test grounds' `
  -Scenario 'Merchant card click with a granted player and fixture bread.' `
  -Outcome Passed `
  -LogPath '<instance>\logs\latest.log'
```

Generated `manual-*.md` records stay local because they can disclose local
paths and instance-log content. Attach the relevant record or its factual
summary to the related issue or release evidence when sharing it is needed.
