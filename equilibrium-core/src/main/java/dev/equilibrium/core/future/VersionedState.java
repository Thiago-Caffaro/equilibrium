package dev.equilibrium.core.future;

import java.util.Objects;

/** A future persisted payload paired with its independently migratable schema version. */
public record VersionedState<T>(int schemaVersion, T value) {
    public VersionedState {
        if (schemaVersion < 1) {
            throw new IllegalArgumentException("schemaVersion must be positive");
        }
        Objects.requireNonNull(value, "value");
    }
}
