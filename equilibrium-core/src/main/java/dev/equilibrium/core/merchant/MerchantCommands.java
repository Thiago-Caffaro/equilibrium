package dev.equilibrium.core.merchant;

import com.mojang.brigadier.CommandDispatcher;
import com.mojang.brigadier.arguments.IntegerArgumentType;
import com.mojang.brigadier.builder.LiteralArgumentBuilder;
import com.mojang.brigadier.context.CommandContext;
import com.mojang.logging.LogUtils;
import net.minecraft.ChatFormatting;
import net.minecraft.commands.CommandSourceStack;
import net.minecraft.commands.Commands;
import net.minecraft.commands.arguments.EntityArgument;
import net.minecraft.commands.arguments.ResourceLocationArgument;
import net.minecraft.network.chat.ClickEvent;
import net.minecraft.network.chat.Component;
import net.minecraft.network.chat.Style;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.core.registries.BuiltInRegistries;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.event.AddReloadListenerEvent;
import net.neoforged.neoforge.event.RegisterCommandsEvent;
import org.slf4j.Logger;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static dev.equilibrium.core.EquilibriumCore.MOD_ID;

/** Server-only authority and transaction path for the temporary Merchant slice. */
@EventBusSubscriber(modid = MOD_ID)
public final class MerchantCommands {
    private static final Logger AUDIT = LogUtils.getLogger();
    private static final String ACCESS_TAG = "equilibrium_merchant_experimental";
    private static final String MASTERY_TAG_PREFIX = "equilibrium_merchant_mastery_";
    private static final Map<UUID, String> LAST_REQUEST = new HashMap<>();

    @SubscribeEvent
    public static void addReloadListener(AddReloadListenerEvent event) { event.addListener(MerchantOffers.INSTANCE); }

    @SubscribeEvent
    public static void register(RegisterCommandsEvent event) {
        register(event.getDispatcher());
    }

    /** Registers the command grammar used by both the NeoForge event and command-parser tests. */
    static void register(CommandDispatcher<CommandSourceStack> d) {
        LiteralArgumentBuilder<CommandSourceStack> merchant = Commands.literal("equilibrium").then(Commands.literal("merchant")
            .executes(MerchantCommands::open)
            .then(Commands.literal("grant").requires(s -> s.hasPermission(2))
                .then(Commands.argument("player", EntityArgument.player()).executes(MerchantCommands::grant)))
            .then(Commands.literal("revoke").requires(s -> s.hasPermission(2))
                .then(Commands.argument("player", EntityArgument.player()).executes(MerchantCommands::revoke)))
            .then(Commands.literal("execute")
                .then(Commands.argument("offer", ResourceLocationArgument.id())
                    .then(Commands.argument("amount", IntegerArgumentType.integer(1, MerchantTransaction.MAX_BATCH))
                        .executes(MerchantCommands::execute)))));
        d.register(merchant);
    }

    private static int grant(CommandContext<CommandSourceStack> context) throws com.mojang.brigadier.exceptions.CommandSyntaxException {
        ServerPlayer player = EntityArgument.getPlayer(context, "player");
        player.addTag(ACCESS_TAG);
        player.addTag(MASTERY_TAG_PREFIX + "1");
        context.getSource().sendSuccess(() -> Component.literal("Experimental Merchant access granted to " + player.getGameProfile().getName()), true);
        audit(player, "ACCESS_GRANTED", "operator=" + context.getSource().getTextName());
        return 1;
    }
    private static int revoke(CommandContext<CommandSourceStack> context) throws com.mojang.brigadier.exceptions.CommandSyntaxException {
        ServerPlayer player = EntityArgument.getPlayer(context, "player");
        player.removeTag(ACCESS_TAG);
        player.removeTag(MASTERY_TAG_PREFIX + "1");
        context.getSource().sendSuccess(() -> Component.literal("Experimental Merchant access revoked from " + player.getGameProfile().getName()), true);
        audit(player, "ACCESS_REVOKED", "operator=" + context.getSource().getTextName());
        return 1;
    }
    private static int open(CommandContext<CommandSourceStack> context) {
        ServerPlayer player = context.getSource().getPlayer();
        if (player == null) return 0;
        if (!authorised(player)) return denied(player, "OPEN_DENIED");
        player.sendSystemMessage(Component.literal("Experimental Merchant offers — temporary laboratory interface").withStyle(ChatFormatting.GOLD));
        MerchantOffers.INSTANCE.all().values().stream().filter(MerchantOffer::enabled).forEach(offer -> {
            String command = "/equilibrium merchant execute " + offer.id() + " 1";
            Component card = Component.literal("[EXPERIMENTAL] " + offer.id() + "  " + offer.inputCount() + "x " + offer.input()
                    + " → " + offer.outputCount() + "x " + offer.output() + " (" + Math.round(offer.chance() * 100) + "%)")
                .setStyle(Style.EMPTY.withColor(ChatFormatting.AQUA).withClickEvent(new ClickEvent(ClickEvent.Action.RUN_COMMAND, command)));
            player.sendSystemMessage(card);
        });
        audit(player, "OPEN_OK", "offers=" + MerchantOffers.INSTANCE.all().size());
        return 1;
    }
    private static int execute(CommandContext<CommandSourceStack> context) {
        ServerPlayer player = context.getSource().getPlayer();
        if (player == null) return 0;
        ResourceLocation id = ResourceLocationArgument.getId(context, "offer");
        int amount = IntegerArgumentType.getInteger(context, "amount");
        MerchantOffer offer = MerchantOffers.INSTANCE.get(id);
        if (!authorised(player)) return denied(player, "EXECUTE_DENIED");
        if (offer == null || !offer.enabled()) return reject(player, "UNKNOWN_OR_DISABLED");
        if (!hasExperimentalMastery(player, offer.requiredMastery())) return reject(player, "MASTERY_REQUIREMENT");
        MerchantTransaction.Plan plan = MerchantTransaction.preflight(offer, amount);
        if (!plan.accepted()) return reject(player, plan.rejection());
        String nonce = id + ":" + amount + ":" + player.level().getGameTime();
        synchronized (LAST_REQUEST) {
            if (nonce.equals(LAST_REQUEST.put(player.getUUID(), nonce))) return reject(player, "DUPLICATE_REQUEST");
        }
        Item input = BuiltInRegistries.ITEM.get(offer.input());
        Item output = BuiltInRegistries.ITEM.get(offer.output());
        if (input == null || output == null || input == net.minecraft.world.item.Items.AIR || output == net.minecraft.world.item.Items.AIR) return reject(player, "MISSING_REGISTERED_ITEM");
        int requestedInput = plan.inputToConsume();
        if (count(player, input) < requestedInput) return reject(player, "INSUFFICIENT_INPUT");
        remove(player, input, requestedInput); // exactly once, after every validation above.
        boolean success = player.getRandom().nextDouble() < offer.chance();
        if (success) {
            deliver(player, output, plan.outputToDeliver());
            player.sendSystemMessage(Component.literal("Experimental offer succeeded.").withStyle(ChatFormatting.GREEN));
        } else player.sendSystemMessage(Component.literal("Experimental offer failed; inputs were consumed by this declared test rule.").withStyle(ChatFormatting.RED));
        audit(player, success ? "SUCCESS" : "FAILURE", "offer=" + id + " amount=" + amount + " input=" + requestedInput);
        return 1;
    }
    private static boolean authorised(ServerPlayer player) { return player.getTags().contains(ACCESS_TAG); }
    /** Temporary laboratory replacement for the future identity/mastery system. */
    private static boolean hasExperimentalMastery(ServerPlayer player, int requiredMastery) {
        return requiredMastery == 1 && player.getTags().contains(MASTERY_TAG_PREFIX + "1");
    }
    private static int denied(ServerPlayer p, String event) { p.sendSystemMessage(Component.literal("Merchant access is experimental and not authorised.").withStyle(ChatFormatting.RED)); audit(p, event, ""); return 0; }
    private static int reject(ServerPlayer p, String reason) { p.sendSystemMessage(Component.literal("Merchant request rejected: " + reason).withStyle(ChatFormatting.RED)); audit(p, "REJECTED", reason); return 0; }
    private static int count(ServerPlayer p, Item item) { int n = 0; for (ItemStack s : p.getInventory().items) if (s.is(item)) n += s.getCount(); return n; }
    private static void remove(ServerPlayer p, Item item, int n) { for (ItemStack s : p.getInventory().items) { if (s.is(item)) { int take = Math.min(n, s.getCount()); s.shrink(take); n -= take; if (n == 0) return; } } }
    private static void deliver(ServerPlayer player, Item output, int total) {
        while (total > 0) {
            int chunk = Math.min(total, output.getDefaultMaxStackSize());
            ItemStack result = new ItemStack(output, chunk);
            if (!player.getInventory().add(result)) player.drop(result, false); // safe fallback; items are never discarded.
            total -= chunk;
        }
    }
    private static void audit(ServerPlayer p, String event, String detail) { AUDIT.info("EquilibriumAudit event={} player={} uuid={} {}", event, p.getGameProfile().getName(), p.getUUID(), detail); }
}
