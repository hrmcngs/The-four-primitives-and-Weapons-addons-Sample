package mawaddon.item;

import the_four_primitives_and_weapons.util.KatanaFittings;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.nbt.Tag;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.item.*;
import net.minecraft.world.item.crafting.Ingredient;
import net.minecraft.world.level.Level;

public class GrayKatanaItem extends SwordItem {
    public GrayKatanaItem() {
        super(new Tier() {
            public int getUses() { return 250; }
            public float getSpeed() { return 6.0f; }
            public float getAttackDamageBonus() { return 2.0f; }
            public int getLevel() { return 2; }
            public int getEnchantmentValue() { return 14; }
            public Ingredient getRepairIngredient() { return Ingredient.of(); }
        }, 3, -2.4f, new Item.Properties().rarity(Rarity.UNCOMMON));
    }

    private static void applyDefaultColors(ItemStack stack) {
        CompoundTag tag = stack.getOrCreateTag();
        if (!tag.contains(KatanaFittings.TSUKA_KEY, Tag.TAG_INT)) {
            KatanaFittings.setTsuka(stack, 0xFFFFFF);
        }
        if (!tag.contains(KatanaFittings.TSUBA_KEY, Tag.TAG_INT)) {
            KatanaFittings.setTsuba(stack, 0x000000);
        }
        if (!tag.contains(KatanaFittings.KASHIRA_KEY, Tag.TAG_INT)) {
            KatanaFittings.setKashira(stack, 0x000000);
        }
    }

    @Override
    public ItemStack getDefaultInstance() {
        ItemStack stack = super.getDefaultInstance();
        applyDefaultColors(stack);
        return stack;
    }

    @Override
    public void inventoryTick(ItemStack stack, Level level, Entity entity, int slot, boolean selected) {
        applyDefaultColors(stack);
        super.inventoryTick(stack, level, entity, slot, selected);
    }
}
