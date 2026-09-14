package dev.equilibrium.core.future;

import java.util.UUID;

/** Transport seam for future client display snapshots, not for transaction authorization. */
public interface ClientViewSynchronizer {
    void synchronize(UUID playerId, ClientViewSnapshot snapshot);
}
