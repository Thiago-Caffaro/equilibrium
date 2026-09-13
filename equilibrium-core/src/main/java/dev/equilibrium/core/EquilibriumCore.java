package dev.equilibrium.core;

import com.mojang.logging.LogUtils;
import net.neoforged.fml.common.Mod;
import org.slf4j.Logger;

@Mod(EquilibriumCore.MOD_ID)
public final class EquilibriumCore {
    public static final String MOD_ID = "equilibrium";
    public static final Logger LOG = LogUtils.getLogger();

    public EquilibriumCore() {
        LOG.info("Equilibrium Core experimental Merchant slice loaded");
    }
}
