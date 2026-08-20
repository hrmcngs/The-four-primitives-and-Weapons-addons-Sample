package mawaddon.init;

import mawaddon.MawSampleAddon;
import net.minecraft.resources.ResourceLocation;
import net.minecraftforge.event.BuildCreativeModeTabContentsEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;

/** 生成したアイテムを指定されたクリエイティブタブへ追加します。 */
@Mod.EventBusSubscriber(modid = MawSampleAddon.MODID, bus = Mod.EventBusSubscriber.Bus.MOD)
public final class AddonCreativeTabs {

    private AddonCreativeTabs() {}

    @SubscribeEvent
    public static void buildContents(BuildCreativeModeTabContentsEvent event) {
        if (isTab(event, "minecraft:combat")) event.accept(AddonItems.GRAY_KATANA.get().getDefaultInstance());

        // ここに新しいクリエイティブタブ項目を追加してください
    }

    private static boolean isTab(BuildCreativeModeTabContentsEvent event, String tabId) {
        return event.getTabKey().location().equals(new ResourceLocation(tabId));
    }
}
