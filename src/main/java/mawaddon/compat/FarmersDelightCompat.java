package mawaddon.compat;

import mawaddon.MawSampleAddon;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.entity.LivingEntity;
import net.minecraft.world.entity.item.ItemEntity;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.Items;
import net.minecraftforge.event.entity.living.LivingDeathEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.ModList;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.registries.ForgeRegistries;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Set;

/**
 * Farmer's Delight 連携クラス
 *
 * FD が導入されている場合のみ動作するイベントハンドラです。
 * ロード時に FD の有無を確認し、ない場合は何もしません。
 *
 * 機能:
 *   - FD のナイフで敵を倒したとき、本体 (MAW) の難易度に応じて
 *     ボーナスドロップを付与する（高難易度ほど豪華なドロップ）
 *   - 動物系エンティティを倒した場合は追加で革・羽などがドロップ
 *
 * このクラスは @Mod.EventBusSubscriber で自動登録されますが、
 * isFDLoaded() チェックで FD がない環境では処理をスキップします。
 */
@Mod.EventBusSubscriber(modid = MawSampleAddon.MODID)
public class FarmersDelightCompat {

    private static final Logger LOGGER = LogManager.getLogger(FarmersDelightCompat.class);

    /** FD のナイフアイテム ID 一覧 */
    private static final Set<String> FD_KNIFE_IDS = Set.of(
        "farmersdelight:flint_knife",
        "farmersdelight:iron_knife",
        "farmersdelight:golden_knife",
        "farmersdelight:diamond_knife",
        "farmersdelight:netherite_knife"
    );

    /** 動物系エンティティの型名キーワード（簡易判定） */
    private static final Set<String> ANIMAL_KEYWORDS = Set.of(
        "cow", "pig", "sheep", "chicken", "rabbit", "fox", "wolf",
        "cat", "horse", "donkey", "mule", "llama", "goat", "axolotl"
    );

    public static boolean isFDLoaded() {
        return ModList.get().isLoaded("farmersdelight");
    }

    // =====================================================================
    // FD ナイフで敵を倒したときのボーナスドロップ
    // =====================================================================
    @SubscribeEvent
    public static void onLivingDeath(LivingDeathEvent event) {
        if (!isFDLoaded()) return;
        if (!(event.getSource().getEntity() instanceof Player player)) return;
        if (player.level().isClientSide) return;

        // メインハンドに FD のナイフを持っているか
        ItemStack held = player.getMainHandItem();
        String heldId = ForgeRegistries.ITEMS.getKey(held.getItem()) != null
            ? ForgeRegistries.ITEMS.getKey(held.getItem()).toString()
            : "";

        if (!FD_KNIFE_IDS.contains(heldId)) return;

        LivingEntity victim = event.getEntity();
        if (!(victim.level() instanceof ServerLevel serverLevel)) return;

        // MAW 本体がある場合は難易度スケール、なければ固定値
        int aiLevel = getMawAiLevel();

        // ボーナスドロップを与える
        spawnBonusDrops(serverLevel, victim, player, aiLevel);
    }

    /**
     * MAW の難易度 aiLevel を取得する。
     * MAW が導入されていない場合は 0 を返す。
     */
    private static int getMawAiLevel() {
        try {
            // リフレクションや直接参照で MAW のクラスを呼ぶ
            // MAW が compileOnly で参照可能な場合はそのまま import して呼ぶ:
            //   return minecraftarmorweapon.command.CustomDifficultyCommand
            //              .getCurrentDifficulty().getAiLevel();
            //
            // MAW が compileOnly でない場合はリフレクションを使う:
            Class<?> cmdClass = Class.forName(
                "minecraftarmorweapon.command.CustomDifficultyCommand");
            Object difficulty = cmdClass.getMethod("getCurrentDifficulty").invoke(null);
            return (int) difficulty.getClass().getMethod("getAiLevel").invoke(difficulty);
        } catch (Exception e) {
            return 0; // MAW がない、またはリフレクション失敗
        }
    }

    /**
     * ナイフでの討伐ボーナスドロップを付与する。
     *
     * aiLevel 0: ボーナスなし
     * aiLevel 1: 経験値 +5
     * aiLevel 2: 経験値 +10、動物なら革または羽 x1
     * aiLevel 3+: 経験値 +15、動物なら追加マテリアル x1〜2
     */
    private static void spawnBonusDrops(ServerLevel level, LivingEntity victim,
                                         Player player, int aiLevel) {
        if (aiLevel <= 0) return;

        double x = victim.getX(), y = victim.getY(), z = victim.getZ();

        // 経験値ボーナス
        int xpBonus = switch (aiLevel) {
            case 1 -> 5;
            case 2 -> 10;
            default -> 15;
        };
        player.giveExperiencePoints(xpBonus);

        if (aiLevel < 2) return;

        // 動物判定（エンティティ型名で簡易チェック）
        String entityId = ForgeRegistries.ENTITY_TYPES.getKey(victim.getType()) != null
            ? ForgeRegistries.ENTITY_TYPES.getKey(victim.getType()).getPath()
            : "";

        boolean isAnimal = ANIMAL_KEYWORDS.stream().anyMatch(entityId::contains);
        if (!isAnimal) return;

        // ボーナスドロップアイテム
        Item bonusItem = level.random.nextBoolean() ? Items.LEATHER : Items.FEATHER;
        int count = aiLevel >= 3 ? 1 + level.random.nextInt(2) : 1;

        ItemEntity drop = new ItemEntity(level, x, y + 0.5, z, new ItemStack(bonusItem, count));
        drop.setPickUpDelay(10);
        level.addFreshEntity(drop);

        LOGGER.debug("[FD Compat] Knife bonus drop: {} x{} at ({},{},{})",
            bonusItem.getDescriptionId(), count, (int)x, (int)y, (int)z);
    }
}
