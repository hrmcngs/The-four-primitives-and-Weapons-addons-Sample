package mawaddon.item;

import net.minecraft.world.item.Item;
import net.minecraft.world.item.Rarity;
import net.minecraft.world.item.SwordItem;
import net.minecraft.world.item.Tier;
import net.minecraft.world.item.crafting.Ingredient;

/** 刃・護拳・柄・柄頭を個別に構成できる細剣サンプル。 */
public class SampleRapierItem extends SwordItem {
    public SampleRapierItem() {
        super(new Tier() {
            public int getUses() { return 250; }
            public float getSpeed() { return 6.0f; }
            public float getAttackDamageBonus() { return 2.0f; }
            public int getLevel() { return 2; }
            public int getEnchantmentValue() { return 14; }
            public Ingredient getRepairIngredient() { return Ingredient.of(); }
        }, 2, -1.8f, new Item.Properties().rarity(Rarity.UNCOMMON));
    }
}
