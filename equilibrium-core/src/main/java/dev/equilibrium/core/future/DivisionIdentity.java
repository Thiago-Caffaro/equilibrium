package dev.equilibrium.core.future;

import net.minecraft.resources.ResourceLocation;

import java.util.Objects;

/** Namespaced identity for a future player division; this class declares no final division names. */
public record DivisionIdentity(ResourceLocation id) {
    public DivisionIdentity {
        Objects.requireNonNull(id, "id");
    }
}
