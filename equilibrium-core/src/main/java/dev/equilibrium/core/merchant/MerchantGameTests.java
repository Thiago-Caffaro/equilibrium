package dev.equilibrium.core.merchant;

import net.minecraft.gametest.framework.GameTest;
import net.minecraft.gametest.framework.GameTestHelper;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.entity.item.ItemEntity;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.GameType;
import net.minecraft.world.level.block.Blocks;
import net.neoforged.neoforge.gametest.GameTestHolder;
import net.neoforged.neoforge.gametest.PrefixGameTestTemplate;

import static dev.equilibrium.core.EquilibriumCore.MOD_ID;

/** Required server-world assertions for the experimental Merchant transaction boundary. */
@GameTestHolder(MOD_ID)
@PrefixGameTestTemplate(false)
public final class MerchantGameTests {
    private static final ResourceLocation CROP_EXCHANGE = ResourceLocation.fromNamespaceAndPath(MOD_ID, "experimental_crop_exchange");

    private MerchantGameTests() { }

    @GameTest(templateNamespace = "minecraft", template = "bastion/mobs/empty")
    public static void executesOnceAndRejectsDuplicateRequest(GameTestHelper helper) {
        ServerPlayer player = helper.makeMockServerPlayerInLevel();
        player.setGameMode(GameType.SURVIVAL);
        player.addTag("equilibrium_merchant_experimental");
        player.addTag("equilibrium_merchant_mastery_1");
        player.getInventory().add(new ItemStack(Blocks.HAY_BLOCK.asItem(), 32));

        int accepted = MerchantCommands.execute(player, CROP_EXCHANGE, 1, () -> 0.0);
        helper.assertValueEqual(accepted, 1, "the authorised transaction should succeed");
        helper.assertValueEqual(count(player, Blocks.HAY_BLOCK.asItem()), 16, "input should be consumed exactly once");
        helper.assertValueEqual(count(player, net.minecraft.world.item.Items.EMERALD), 2, "success should deliver the declared output");

        int duplicate = MerchantCommands.execute(player, CROP_EXCHANGE, 1, () -> 0.0);
        helper.assertValueEqual(duplicate, 0, "the same request must be rejected in the same tick");
        helper.assertValueEqual(count(player, Blocks.HAY_BLOCK.asItem()), 16, "duplicate request must not consume input");

        player.getInventory().add(new ItemStack(Blocks.HAY_BLOCK.asItem(), 16));
        int declaredFailure = MerchantCommands.execute(player, CROP_EXCHANGE, 2, () -> 1.0);
        helper.assertValueEqual(declaredFailure, 1, "a declared chance failure still completes the transaction");
        helper.assertValueEqual(count(player, Blocks.HAY_BLOCK.asItem()), 0, "declared failure should consume the batch once");
        helper.assertValueEqual(count(player, net.minecraft.world.item.Items.EMERALD), 2, "declared failure must not mint output");

        int insufficient = MerchantCommands.execute(player, CROP_EXCHANGE, 3, () -> 0.0);
        int unknown = MerchantCommands.execute(player, ResourceLocation.fromNamespaceAndPath(MOD_ID, "missing_offer"), 1, () -> 0.0);
        helper.assertValueEqual(insufficient, 0, "insufficient input must be rejected before mutation");
        helper.assertValueEqual(unknown, 0, "unknown offers must be rejected before mutation");
        helper.assertValueEqual(count(player, net.minecraft.world.item.Items.EMERALD), 2, "rejected requests must not create output");

        fillInventoryExceptForInput(player);
        int safeDrop = MerchantCommands.execute(player, CROP_EXCHANGE, 3, () -> 0.0);
        helper.assertValueEqual(safeDrop, 1, "a valid transaction should complete even when output cannot fit");
        helper.assertValueEqual(count(player, Blocks.HAY_BLOCK.asItem()), 1, "only the declared input should be removed from a full inventory");
        var drops = player.level().getEntitiesOfClass(ItemEntity.class, player.getBoundingBox().inflate(2.0),
            item -> item.getItem().is(net.minecraft.world.item.Items.EMERALD));
        helper.assertValueEqual(drops.size(), 1, "overflow output must be dropped instead of discarded");
        helper.assertValueEqual(drops.getFirst().getItem().getCount(), 6, "the dropped stack must contain the full output");
        helper.succeed();
    }

    private static void fillInventoryExceptForInput(ServerPlayer player) {
        for (int slot = 0; slot < player.getInventory().items.size(); slot++) {
            player.getInventory().items.set(slot, new ItemStack(Blocks.COBBLESTONE.asItem(), 64));
        }
        for (int slot = 0; slot < player.getInventory().offhand.size(); slot++) {
            player.getInventory().offhand.set(slot, new ItemStack(Blocks.COBBLESTONE.asItem(), 64));
        }
        player.getInventory().items.set(0, new ItemStack(Blocks.HAY_BLOCK.asItem(), 49));
    }

    private static int count(ServerPlayer player, Item item) {
        int total = 0;
        for (ItemStack stack : player.getInventory().items) {
            if (stack.is(item)) total += stack.getCount();
        }
        return total;
    }
}
