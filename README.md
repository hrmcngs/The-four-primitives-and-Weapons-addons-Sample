# MAW Sample Addon

**The four primitives and Weapons** のアドオン開発用テンプレートです。

## ディレクトリ構成

```
src/main/java/mawaddon/
├── MawSampleAddon.java               メインクラス (@Mod)
├── init/
│   └── AddonItems.java               アイテム登録
├── item/
│   ├── SampleSwordItem.java          サンプル剣（カスタムアイテムの実装例）
│   └── DaggerItem.java               ダガー（背後攻撃特化）
├── event/
│   └── SampleEventHandler.java       イベントハンドラのサンプル
└── compat/
    └── FarmersDelightCompat.java     Farmer's Delight 連携

src/main/resources/
├── META-INF/mods.toml                Mod定義・依存関係
├── assets/maw_sample_addon/
│   ├── lang/
│   │   ├── ja_jp.json                日本語翻訳
│   │   └── en_us.json                英語翻訳
│   └── models/item/
│       ├── sample_sword.json         サンプル剣モデル
│       └── dagger.json               ダガーモデル
└── data/maw_sample_addon/
    └── weapon_types/
        └── weapons.json              ★ 武器タイプ宣言（最重要）
```

## セットアップ手順

### 1. 本体JARを用意する

```bash
# 本体プロジェクトのルートで
cd ../The-four-primitives-and-Weapons
./gradlew build

# 生成されたJARをlibsフォルダにコピー
cp build/libs/*.jar ../The-four-primitives-and-Weapons-addons-Sample/libs/
```

### 2. build.gradle の依存を有効化

`build.gradle` を開き、以下のコメントを解除:

```groovy
compileOnly fileTree(dir: 'libs', include: '*.jar')
```

### 3. Mod IDを変更する

`maw_sample_addon` を自分のMod IDに一括置換:

| ファイル | 変更箇所 |
|---|---|
| `MawSampleAddon.java` | `MODID` 定数 |
| `META-INF/mods.toml` | `modId=` の値 |
| `build.gradle` | `archivesBaseName`、runsブロック |
| `SampleEventHandler.java` | `@Mod.EventBusSubscriber(modid=...)` |
| `assets/` フォルダ名 | `maw_sample_addon` → 新しいID |
| `lang/*.json` のキー | `maw_sample_addon` の部分 |

### 4. ビルド

```bash
./gradlew build
```

`build/libs/` にJARが生成されます。

---

## 武器タイプ登録（weapon_types JSON）

本体の `WeaponTypeRegistry` はサーバー起動時に **全MODの** `data/*/weapon_types/*.json` を自動収集します。
アドオンはJavaコードなしに、JSONを置くだけで武器をタイプ登録できます。

### 既存タイプにアイテムを追加する

```json
// data/your_mod/weapon_types/weapons.json
{
  "types": {
    "dagger": {
      "items": [
        "your_mod:your_dagger",
        "farmersdelight:iron_knife"
      ]
    }
  }
}
```
`items` のみ定義すれば `motions` は本体の定義を引き継ぎます。

### 新しいタイプを作る

```json
{
  "types": {
    "spear": {
      "display_name": "槍",
      "items": ["your_mod:iron_spear"],
      "motions": {
        "combat": ["thrust", "upper_left_slash"],
        "dash":   ["dash_rush"],
        "right_click": ["dodge"],
        "shift_right_click": ["guard", "none_shift"]
      }
    }
  }
}
```

### 特殊技を持つ武器を宣言する

```json
{
  "special_weapons": {
    "your_mod:legendary_sword": {
      "enabled": true,
      "special_motions": {
        "right_click": ["your_custom_skill_id"],
        "combat":      ["your_combat_skill_id"]
      }
    }
  }
}
```

> **ファイル名の注意**: `_` で始まるファイルは読み込まれません（本体の `_template_for_addons.json` 参照）。

---

## Farmer's Delight 連携

`FarmersDelightCompat.java` はFDが導入されている場合のみ動作します。

- FDのナイフで動物を倒すと、本体の難易度に応じてボーナスドロップ（革・羽）が発生
- `FarmersDelightCompat.isFDLoaded()` でFDの有無を確認できます

FDのナイフは `data/maw_sample_addon/weapon_types/weapons.json` で `dagger` タイプに登録済みです。

---

## 本体クラスの参照例

本体のアイテムや難易度システムを参照したい場合:

```java
// 本体のアイテムを参照
import minecraftarmorweapon.init.MinecraftArmorWeaponModItems;
ItemStack katana = MinecraftArmorWeaponModItems.IRON_KATANA.get().getDefaultInstance();

// カスタム難易度を参照
import minecraftarmorweapon.command.CustomDifficultyCommand;
int aiLevel = CustomDifficultyCommand.getCurrentDifficulty().getAiLevel();

// Mob特性を参照
import minecraftarmorweapon.trait.MobTrait;
MobTrait trait = MobTrait.rollTrait(random.nextFloat(), aiLevel);
```

## 動作確認済み環境

- Minecraft 1.20.1
- Forge 47.1.0
- Java 17
