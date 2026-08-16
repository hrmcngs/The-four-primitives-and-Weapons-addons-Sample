package mawaddon.item;

import net.minecraft.world.item.Item;
import net.minecraft.world.item.Rarity;
import net.minecraft.world.item.SwordItem;
import net.minecraft.world.item.Tier;
import net.minecraft.world.item.crafting.Ingredient;

/** 刃・鍔・柄・頭を個別に構成できる直刀サンプル。 */
public class SampleTyokutoItem extends SwordItem {
    public SampleTyokutoItem() {
        super(new Tier() {
            public int getUses() { return 250; }
            public float getSpeed() { return 6.0f; }
            public float getAttackDamageBonus() { return 2.0f; }
            public int getLevel() { return 2; }
            public int getEnchantmentValue() { return 14; }
            public Ingredient getRepairIngredient() { return Ingredient.of(); }
        }, 3, -2.4f, new Item.Properties().rarity(Rarity.UNCOMMON));
    }
}
