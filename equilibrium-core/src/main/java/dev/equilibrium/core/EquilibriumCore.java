package dev.equilibrium.core;

import com.mojang.logging.LogUtils;
import dev.equilibrium.core.merchant.MerchantGameTests;
import net.neoforged.fml.ModLoadingContext;
import net.neoforged.fml.common.Mod;
import net.neoforged.neoforge.event.RegisterGameTestsEvent;
import org.slf4j.Logger;

@Mod(EquilibriumCore.MOD_ID)
public final class EquilibriumCore {
    public static final String MOD_ID = "equilibrium";
    public static final Logger LOG = LogUtils.getLogger();

    public EquilibriumCore() {
        ModLoadingContext.get().getActiveContainer().getEventBus().addListener(EquilibriumCore::registerGameTests);
        LOG.info("Equilibrium Core experimental Merchant slice loaded");
    }

    private static void registerGameTests(RegisterGameTestsEvent event) {
        event.register(MerchantGameTests.class);
    }
}
