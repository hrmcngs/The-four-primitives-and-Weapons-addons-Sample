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
    ├── weapon_types/
    │   └── weapons.json              ★ 武器タイプ宣言（最重要）
    └── maw_saya/
        └── saya.json                 ★ 鞘(納刀)対象アイテム宣言
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

### スクリプトで実行

```bash
bash build.sh          # 通常ビルド
bash run_client.sh     # テストプレイ（Minecraft クライアント起動）
```

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

## 鞘(saya) への納刀登録（maw_saya JSON）

本体の `SayaRegistry` はサーバー起動時に **全MODの** `data/*/maw_saya/*.json` を自動収集します。
アドオンはJavaコードなしに、JSONを置くだけで自分のアイテムを納刀対象にできます。

### フォーマット

```json
// data/your_mod/maw_saya/saya.json
{
  "katana":  { "your_mod:custom_katana": 1 },
  "tyokuto": { "your_mod:custom_tyokuto": 4 },
  "sword":   { "your_mod:custom_sword": 1 }
}
```

| キー | 対象サヤ | 説明 |
|---|---|---|
| `katana` | 本体の `saya` | 通常の刀の鞘 |
| `tyokuto` | 本体の `tyokuto_saya` | 直刀の鞘 |
| `sword` | 本体の `sword_saya` | バニラ剣ベースの鞘 |

値は本体 `assets/.../models/item/saya.json` (および tyokuto_saya / sword_saya) の
`overrides` で定義された `custom_model_data` です。
**既存のスロット番号を流用すれば本体に同梱されている鞘モデルをそのまま使えます**。

| サヤ | 既存スロット例 |
|---|---|
| katana | 1=iron, 2=gold, 3=stone, 4=netherite, 16=diamond, ... |
| tyokuto | 4=iron, 5=gold, 6=stone, 7=diamond, 8=netherite |
| sword | 1=iron, 2=gold, 3=stone, 4=diamond, 5=netherite |

### 独自の鞘モデルを出したい場合

本体の `saya.json` を上書きするリソースパック差分を自分のMODに含めて、
新しい `custom_model_data` 番号のエントリと対応モデルを追加してください。
同じ番号を別MODが先に登録していると衝突する点に注意。

**モデルファイルの配置先 (規約)** — 本体MODと同じ階層構造を踏襲してください:

```
assets/your_mod/models/custom/saya/katana/saya_xxx.json    # 通常の刀の鞘
assets/your_mod/models/custom/saya/tyokuto/saya_xxx.json   # 直刀の鞘
assets/your_mod/models/custom/saya/sword/saya_xxx.json     # バニラ剣の鞘
```

本体の `saya.json` overrides を上書きする際の `model` 値の例:

```json
{
  "predicate": { "custom_model_data": 20 },
  "model": "your_mod:custom/saya/katana/saya_your_katana"
}
```

> **ファイル名・パス規約** — 本体MODの命名: `saya_<weapon_name>.json` (通常刀), `saya_<weapon_name>_tyokuto.json` (直刀), `saya_sword_<weapon_name>.json` (バニラ剣ベース)。
> アドオン側も同じ命名にしておくと、本体・他アドオンと衝突しにくく分かりやすいです。

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
