package mawaddon.item;

import net.minecraft.core.particles.ParticleTypes;
import net.minecraft.network.chat.Component;
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
import net.minecraft.world.phys.Vec3;

/**
 * ダガー（短剣） — 高速近接武器、背後からの攻撃に特化
 *
 * 特性:
 *   - 攻撃速度: -1.2f（レイピアよりやや遅い、剣より大幅に速い）
 *   - ダメージはやや低め
 *   - バックスタブ: 対象の視線の背後から攻撃すると2倍ダメージ＋スニーク時は2.5倍
 *   - 命中時に煙パーティクル＋突き音
 *
 * Farmer's Delight のナイフとの違い:
 *   - ナイフ: 食材加工・農業ツール兼用、動物からのドロップボーナス
 *   - ダガー: 純粋な戦闘特化、背後攻撃に特化したコンバット武器
 */
public class DaggerItem extends SwordItem {

    /** バックスタブ判定角度 (コサイン値): 対象の視線と攻撃方向のなす角 > 120度で背後判定 */
    private static final double BACKSTAB_COS_THRESHOLD = -0.5; // cos(120°)
    /** バックスタブ乗数 (通常) */
    private static final float BACKSTAB_MULTIPLIER = 2.0f;
    /** バックスタブ乗数 (スニーク中) */
    private static final float BACKSTAB_SNEAK_MULTIPLIER = 2.5f;

    public DaggerItem() {
        super(
            new Tier() {
                public int getUses()                 { return 0; }
                public float getSpeed()              { return 4f; }
                public float getAttackDamageBonus()  { return 1f; }   // ダメージ低め
                public int getLevel()                { return 1; }
                public int getEnchantmentValue()     { return 18; }   // エンチャント付きやすい
                public Ingredient getRepairIngredient() { return Ingredient.of(); }
            },
            2,      // attackDamageModifier (低め)
            -1.2f,  // attackSpeedModifier  (高速)
            new Item.Properties().rarity(Rarity.UNCOMMON)
        );
    }

    @Override
    public boolean hurtEnemy(ItemStack stack, LivingEntity target, LivingEntity attacker) {
        if (!attacker.level().isClientSide && attacker instanceof Player player) {
            // バックスタブ判定
            float bonusDamage = calcBackstabBonus(player, target);

            if (bonusDamage > 0) {
                target.hurt(target.damageSources().playerAttack(player), bonusDamage);

                // バックスタブエフェクト
                if (attacker.level() instanceof ServerLevel serverLevel) {
                    serverLevel.sendParticles(ParticleTypes.CRIT,
                        target.getX(), target.getY() + target.getBbHeight() * 0.5, target.getZ(),
                        15, 0.3, 0.3, 0.3, 0.1);
                    serverLevel.sendParticles(ParticleTypes.SMOKE,
                        target.getX(), target.getY() + target.getBbHeight() * 0.5, target.getZ(),
                        8, 0.2, 0.2, 0.2, 0.02);
                }

                attacker.level().playSound(null,
                    attacker.getX(), attacker.getY(), attacker.getZ(),
                    SoundEvents.PLAYER_ATTACK_CRIT, SoundSource.PLAYERS, 1.0f, 1.3f);

                boolean isSneaking = player.isShiftKeyDown();
                player.displayClientMessage(
                    Component.literal(isSneaking ? "§4§lバックスタブ！" : "§c背後一撃！"),
                    true
                );
            } else {
                // 通常命中エフェクト
                if (attacker.level() instanceof ServerLevel serverLevel) {
                    serverLevel.sendParticles(ParticleTypes.SMOKE,
                        target.getX(), target.getY() + target.getBbHeight() * 0.5, target.getZ(),
                        4, 0.15, 0.2, 0.15, 0.02);
                }
                attacker.level().playSound(null,
                    attacker.getX(), attacker.getY(), attacker.getZ(),
                    SoundEvents.PLAYER_ATTACK_SWEEP, SoundSource.PLAYERS, 0.6f, 1.5f);
            }
        }
        return super.hurtEnemy(stack, target, attacker);
    }

    /**
     * バックスタブボーナスダメージを計算する。
     *
     * 対象の視線方向と、攻撃者から見た方向のなす角が 120度以上（背後）の場合に発動。
     *
     * @return ボーナスダメージ量（0 なら不発動）
     */
    private float calcBackstabBonus(Player attacker, LivingEntity target) {
        // 攻撃者 → 対象 方向ベクトル
        Vec3 toTarget = target.position().subtract(attacker.position()).normalize();

        // 対象の視線方向ベクトル
        Vec3 targetLook = target.getLookAngle();

        // 対象の視線と「攻撃者方向」の内積
        // 内積が負 → 対象は攻撃者の反対を向いている（背後）
        double dot = targetLook.dot(toTarget);

        if (dot > BACKSTAB_COS_THRESHOLD) return 0f; // 正面 or 側面なら不発動

        float baseMultiplier = attacker.isShiftKeyDown()
            ? BACKSTAB_SNEAK_MULTIPLIER
            : BACKSTAB_MULTIPLIER;

        // ボーナス = 基底ダメージ × (乗数 - 1)
        return this.getDamage() * (baseMultiplier - 1.0f);
    }
}
