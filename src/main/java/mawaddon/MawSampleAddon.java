package mawaddon;

import mawaddon.init.AddonItems;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * MAW Sample Addon — メインクラス
 *
 * アドオンを作る際は:
 *   1. このクラスの MODID を変更する
 *   2. mods.toml の modId を同じ値に変更する
 *   3. build.gradle の archivesBaseName とグループIDを変更する
 *   4. AddonItems に自分のアイテムを追加する
 */
@Mod(MawSampleAddon.MODID)
public class MawSampleAddon {

    public static final String MODID = "maw_sample_addon";
    public static final Logger LOGGER = LogManager.getLogger(MawSampleAddon.class);

    public MawSampleAddon() {
        IEventBus bus = FMLJavaModLoadingContext.get().getModEventBus();

        // アイテム登録
        AddonItems.REGISTRY.register(bus);

        LOGGER.info("[{}] Addon loaded!", MODID);
    }
}
