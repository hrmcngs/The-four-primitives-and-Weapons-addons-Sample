package mawaddon.event;

import mawaddon.MawSampleAddon;
import mawaddon.init.AddonItems;
import net.minecraft.world.entity.player.Player;
import net.minecraftforge.event.entity.living.LivingHurtEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;

/**
 * サンプルイベントハンドラ
 *
 * Forgeのイベントシステムを使ってカスタム処理を追加するサンプルです。
 *
 * @Mod.EventBusSubscriber の MODID は自分のMOD IDに変更してください。
 * 本体 (minecraft_armor_weapon) のクラスを import して参照することもできます。
 */
@Mod.EventBusSubscriber(modid = MawSampleAddon.MODID)
public class SampleEventHandler {

    /**
     * プレイヤーがサンプル剣を持っているときにダメージを受けた場合の処理例
     */
    @SubscribeEvent
    public static void onLivingHurt(LivingHurtEvent event) {
        if (!(event.getEntity() instanceof Player player)) return;
        if (player.level().isClientSide) return;

        // メインハンドにサンプル剣を持っていれば被ダメージを5%軽減
        boolean holdingSampleSword = player.getMainHandItem().getItem() == AddonItems.SAMPLE_SWORD.get();
        if (holdingSampleSword) {
            event.setAmount(event.getAmount() * 0.95f);
        }
    }

    // 他のイベントは https://github.com/MinecraftForge/MinecraftForge のwikiを参照
}
