package dev.equilibrium.core.future;

import net.minecraft.resources.ResourceLocation;

/** Marker for a future data-defined offer prerequisite. */
public interface OfferPrerequisite {
    ResourceLocation kind();
}
