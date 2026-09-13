package dev.equilibrium.core.merchant;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import net.minecraft.resources.ResourceLocation;

/** Compiles one positive Merchant offer from its datapack JSON contract. */
public final class MerchantOfferParser {
    private MerchantOfferParser() { }

    public static MerchantOffer parse(JsonElement element) {
        JsonObject root = element.getAsJsonObject();
        if (root.get("schema_version").getAsInt() != MerchantOffer.SCHEMA_VERSION) {
            throw new IllegalArgumentException("unsupported schema version");
        }
        JsonObject input = root.getAsJsonObject("input");
        JsonObject output = root.getAsJsonObject("output");
        JsonObject failure = root.getAsJsonObject("failure");
        double chance = root.get("chance").getAsDouble();
        int inputCount = input.get("count").getAsInt();
        int outputCount = output.get("count").getAsInt();
        if (chance < 0.0 || chance > 1.0 || inputCount < 1 || outputCount < 1) {
            throw new IllegalArgumentException("invalid chance or count");
        }
        if (!failure.get("consume_inputs").getAsBoolean()) {
            throw new IllegalArgumentException("only consume_inputs=true is supported");
        }
        int requiredMastery = root.has("required_mastery") ? root.get("required_mastery").getAsInt() : 1;
        if (requiredMastery != 1) {
            throw new IllegalArgumentException("only required_mastery=1 is supported");
        }
        ResourceLocation id = ResourceLocation.parse(root.get("id").getAsString());
        return new MerchantOffer(id, ResourceLocation.parse(input.get("item").getAsString()), inputCount,
                ResourceLocation.parse(output.get("item").getAsString()), outputCount, chance,
                requiredMastery,
                !root.has("enabled") || root.get("enabled").getAsBoolean());
    }
}
