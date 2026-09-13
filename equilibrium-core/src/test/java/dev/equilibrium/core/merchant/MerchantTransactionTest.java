package dev.equilibrium.core.merchant;

import net.minecraft.resources.ResourceLocation;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MerchantTransactionTest {
    @Test
    void createsExactInputAndOutputPlanForAnAcceptedBatch() {
        MerchantTransaction.Plan plan = MerchantTransaction.preflight(offer(3, 5), 4);

        assertTrue(plan.accepted());
        assertEquals(12, plan.inputToConsume());
        assertEquals(20, plan.outputToDeliver());
    }

    @Test
    void rejectsOverflowBeforeAnyInventoryOperation() {
        MerchantTransaction.Plan plan = MerchantTransaction.preflight(offer(Integer.MAX_VALUE, 1), 2);

        assertFalse(plan.accepted());
        assertEquals("OVERFLOW", plan.rejection());
    }

    private static MerchantOffer offer(int inputCount, int outputCount) {
        return new MerchantOffer(ResourceLocation.fromNamespaceAndPath("equilibrium", "test_offer"),
                ResourceLocation.withDefaultNamespace("bread"), inputCount,
                ResourceLocation.withDefaultNamespace("emerald"), outputCount, 1.0, 1, true);
    }
}
