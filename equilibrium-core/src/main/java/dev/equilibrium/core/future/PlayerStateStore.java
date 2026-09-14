package dev.equilibrium.core.future;

import java.util.Optional;
import java.util.UUID;

/** Persistence seam; no player state is persisted until its conceptual rules and migration are approved. */
public interface PlayerStateStore<T> {
    Optional<VersionedState<T>> load(UUID playerId);

    void save(UUID playerId, VersionedState<T> state);
}
