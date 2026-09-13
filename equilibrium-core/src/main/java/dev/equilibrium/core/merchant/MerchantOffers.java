package dev.equilibrium.core.merchant;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.mojang.logging.LogUtils;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.packs.resources.ResourceManager;
import net.minecraft.server.packs.resources.SimpleJsonResourceReloadListener;
import net.minecraft.util.profiling.ProfilerFiller;
import org.slf4j.Logger;

import java.util.LinkedHashMap;
import java.util.Map;

/** Positive-only offer registry. Nothing is inferred from the item registry. */
public final class MerchantOffers extends SimpleJsonResourceReloadListener {
    private static final Logger LOG = LogUtils.getLogger();
    public static final MerchantOffers INSTANCE = new MerchantOffers();
    private volatile Map<ResourceLocation, MerchantOffer> offers = Map.of();

    private MerchantOffers() { super(new Gson(), "merchant_offers"); }

    public MerchantOffer get(ResourceLocation id) { return offers.get(id); }
    public Map<ResourceLocation, MerchantOffer> all() { return offers; }

    @Override
    protected void apply(Map<ResourceLocation, JsonElement> json, ResourceManager manager, ProfilerFiller profiler) {
        Map<ResourceLocation, MerchantOffer> loaded = new LinkedHashMap<>();
        json.forEach((fileId, element) -> {
            try {
                JsonObject root = element.getAsJsonObject();
                if (root.get("schema_version").getAsInt() != MerchantOffer.SCHEMA_VERSION) {
                    throw new IllegalArgumentException("unsupported schema version");
                }
                JsonObject input = root.getAsJsonObject("input");
                JsonObject output = root.getAsJsonObject("output");
                double chance = root.get("chance").getAsDouble();
                int inputCount = input.get("count").getAsInt();
                int outputCount = output.get("count").getAsInt();
                if (chance < 0.0 || chance > 1.0 || inputCount < 1 || outputCount < 1) {
                    throw new IllegalArgumentException("invalid chance or count");
                }
                ResourceLocation id = ResourceLocation.parse(root.get("id").getAsString());
                MerchantOffer offer = new MerchantOffer(id, ResourceLocation.parse(input.get("item").getAsString()), inputCount,
                        ResourceLocation.parse(output.get("item").getAsString()), outputCount, chance,
                        root.has("required_mastery") ? root.get("required_mastery").getAsInt() : 1,
                        !root.has("enabled") || root.get("enabled").getAsBoolean());
                if (loaded.putIfAbsent(id, offer) != null) throw new IllegalArgumentException("duplicate offer id");
            } catch (RuntimeException error) {
                LOG.error("Equilibrium Merchant ignored invalid offer file {}: {}", fileId, error.getMessage());
            }
        });
        offers = Map.copyOf(loaded);
        LOG.info("Equilibrium Merchant loaded {} positive experimental offers", offers.size());
    }
}
