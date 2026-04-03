package mawaddon.item;

import net.minecraft.core.particles.ParticleTypes;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.sounds.SoundEvents;
import net.minecraft.sounds.SoundSource;
import net.minecraft.world.entity.LivingEntity;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.Rarity;
import net.minecraft.world.item.SwordItem;
import net.minecraft.world.item.Tier;
import net.minecraft.world.item.crafting.Ingredient;

/**
 * サンプル剣 — アドオンでアイテムを追加する最小サンプル
 *
 * 命中時に炎パーティクルとサウンドが出る剣です。
 * このクラスをコピーして独自のアイテムを作成してください。
 *
 * ポイント:
 *   - getUses() = 0 で耐久無限
 *   - attackSpeedModifier: -2.4f が標準、値を大きくするほど速くなる
 *   - attackDamageModifier: SwordItem の基底 + Tier.getAttackDamageBonus() + この値 = 実際のダメージ
 */
public class SampleSwordItem extends SwordItem {

    public SampleSwordItem() {
        super(
            new Tier() {
                public int getUses()                 { return 0; }      // 耐久値 (0=無限)
                public float getSpeed()              { return 4f; }
                public float getAttackDamageBonus()  { return 4f; }     // 素のボーナスダメージ
                public int getLevel()                { return 1; }
                public int getEnchantmentValue()     { return 10; }
                public Ingredient getRepairIngredient() { return Ingredient.of(); }
            },
            3,      // attackDamageModifier
            -2.4f,  // attackSpeedModifier (バニラ標準)
            new Item.Properties().rarity(Rarity.UNCOMMON)
        );
    }

    /**
     * 敵に命中したときの処理
     * ここにカスタム効果を実装します
     */
    @Override
    public boolean hurtEnemy(ItemStack stack, LivingEntity target, LivingEntity attacker) {
        if (!attacker.level().isClientSide && attacker instanceof Player player) {
            // 炎パーティクル
            if (attacker.level() instanceof ServerLevel serverLevel) {
                serverLevel.sendParticles(
                    ParticleTypes.FLAME,
                    target.getX(), target.getY() + target.getBbHeight() * 0.5, target.getZ(),
                    10, 0.2, 0.3, 0.2, 0.05
                );
            }

            // サウンド
            attacker.level().playSound(null,
                attacker.getX(), attacker.getY(), attacker.getZ(),
                SoundEvents.FIRECHARGE_USE, SoundSource.PLAYERS, 0.5f, 1.2f);
        }
        return super.hurtEnemy(stack, target, attacker);
    }
}
