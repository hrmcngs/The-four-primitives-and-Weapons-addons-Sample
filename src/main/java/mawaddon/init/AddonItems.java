package mawaddon.init;

import mawaddon.MawSampleAddon;
import mawaddon.item.DaggerItem;
import mawaddon.item.SampleSwordItem;
import net.minecraft.world.item.Item;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

/**
 * アドオンのアイテム登録
 *
 * 新しいアイテムを追加する際は:
 *   1. item/ パッケージにアイテムクラスを作成する
 *   2. このクラスに RegistryObject を追加する
 *   3. models/item/ にモデルJSONを追加する
 *   4. lang/ に翻訳を追加する
 */
public class AddonItems {

    public static final DeferredRegister<Item> REGISTRY =
        DeferredRegister.create(ForgeRegistries.ITEMS, MawSampleAddon.MODID);

    // サンプル剣
    public static final RegistryObject<Item> SAMPLE_SWORD =
        REGISTRY.register("sample_sword", SampleSwordItem::new);

    // ダガー — 背後攻撃特化の短剣
    public static final RegistryObject<Item> DAGGER =
        REGISTRY.register("dagger", DaggerItem::new);

    // ここに新しいアイテムを追加してください
    // public static final RegistryObject<Item> MY_ITEM =
    //     REGISTRY.register("my_item", () -> new MyItem());
}
