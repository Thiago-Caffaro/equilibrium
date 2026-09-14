package dev.equilibrium.core.future;

/** Marker for a future server-authored client view; it carries no client authority. */
public interface ClientViewSnapshot {
    int schemaVersion();
}
