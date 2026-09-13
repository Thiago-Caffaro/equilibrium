# Equilibrium Core

Original MIT-licensed NeoForge 1.21.1 mod. This experimental vertical slice
only implements Merchant offers; it does not decide or implement final mastery,
insignia, station, economy, or balance rules.

Use `/equilibrium merchant grant <player>` as an operator, then
`/equilibrium merchant` to open the temporary clickable chat interface. The
grant command deliberately assigns only the temporary Merchant identity and
mastery-1 entity tags; neither tag is a final division or mastery system.
Offers are positive-only data in `data/equilibrium/merchant_offers`.

Use Java 21 and run `gradlew.bat build`.
