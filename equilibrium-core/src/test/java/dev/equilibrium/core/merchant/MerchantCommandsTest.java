package dev.equilibrium.core.merchant;

import com.mojang.brigadier.CommandDispatcher;
import com.mojang.brigadier.ParseResults;
import net.minecraft.commands.CommandSourceStack;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MerchantCommandsTest {
    @Test
    void executeCommandConsumesNamespacedOfferIdFromClickableCard() {
        CommandDispatcher<CommandSourceStack> dispatcher = new CommandDispatcher<>();
        MerchantCommands.register(dispatcher);

        ParseResults<CommandSourceStack> parsed = dispatcher.parse(
                "equilibrium merchant execute equilibrium:experimental_copper_to_zinc 1", null);

        assertFalse(parsed.getReader().canRead(),
                () -> "Command parser left input unconsumed: " + parsed.getReader().getRemaining());
        assertTrue(parsed.getExceptions().isEmpty(),
                () -> "Command parser rejected a clickable-card command: " + parsed.getExceptions());
    }
}
