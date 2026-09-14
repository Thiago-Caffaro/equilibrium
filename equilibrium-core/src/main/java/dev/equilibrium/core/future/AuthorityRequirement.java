package dev.equilibrium.core.future;

import java.util.Objects;

/** A future authority request without deciding its source, cost, or borrowing rules. */
public record AuthorityRequirement(DivisionIdentity division, int minimumMastery) {
    public AuthorityRequirement {
        Objects.requireNonNull(division, "division");
        if (minimumMastery < 1) {
            throw new IllegalArgumentException("minimumMastery must be positive");
        }
    }
}
