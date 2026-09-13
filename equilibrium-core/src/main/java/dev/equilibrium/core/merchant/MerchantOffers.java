package dev.equilibrium.core.merchant;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
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
                MerchantOffer offer = MerchantOfferParser.parse(element);
                if (loaded.putIfAbsent(offer.id(), offer) != null) throw new IllegalArgumentException("duplicate offer id");
            } catch (RuntimeException error) {
                LOG.error("Equilibrium Merchant ignored invalid offer file {}: {}", fileId, error.getMessage());
            }
        });
        offers = Map.copyOf(loaded);
        LOG.info("Equilibrium Merchant loaded {} positive experimental offers", offers.size());
    }
}
