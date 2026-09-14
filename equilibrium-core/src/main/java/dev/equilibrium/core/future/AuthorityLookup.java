package dev.equilibrium.core.future;

import java.util.UUID;

/** Server-side extension point for resolving a player's future division authority. */
public interface AuthorityLookup {
    AuthorityDecision evaluate(UUID playerId, AuthorityRequirement requirement);

    enum AuthorityDecision {
        GRANTED,
        DENIED,
        UNAVAILABLE
    }
}
