package dev.equilibrium.core.merchant;

import net.minecraft.resources.ResourceLocation;

public record MerchantOffer(ResourceLocation id, ResourceLocation input, int inputCount,
                            ResourceLocation output, int outputCount, double chance,
                            int requiredMastery, boolean enabled) {
    public static final int SCHEMA_VERSION = 1;
}
