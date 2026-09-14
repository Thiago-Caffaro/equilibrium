package dev.equilibrium.core.future;

import java.util.UUID;

/** Server-side extension point for a prerequisite before an offer can execute. */
public interface OfferPrerequisiteEvaluator {
    PrerequisiteDecision evaluate(UUID playerId, OfferPrerequisite prerequisite);

    enum PrerequisiteDecision {
        SATISFIED,
        UNSATISFIED,
        UNAVAILABLE
    }
}
