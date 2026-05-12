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
├── assets/the_four_primitives_and_weapons_addons_sample/
│   ├── lang/
│   │   ├── ja_jp.json                日本語翻訳
│   │   └── en_us.json                英語翻訳
│   └── models/item/
│       ├── sample_sword.json         サンプル剣モデル
│       └── dagger.json               ダガーモデル
└── data/the_four_primitives_and_weapons_addons_sample/
    ├── weapon_types/
    │   └── weapons.json              ★ 武器タイプ宣言（最重要）
    └── maw_saya/
        └── saya.json                 ★ 鞘(納刀)対象アイテム宣言
```

## セットアップ手順

### 1. 本体MODのソースを配置

本体MOD「The four primitives and Weapons」のソースプロジェクトを次のパスに置く（addon の build.gradle がデフォルトで参照する場所）:

| OS | デフォルトパス |
|---|---|
| macOS / Linux / WSL | `~/The-four-primitives-and-Weapons` |
| Windows | `%USERPROFILE%\The-four-primitives-and-Weapons` |

別の場所に置きたい場合は、addon の [build.gradle](build.gradle) 内の `mawSourceProject` を編集するか、環境変数 `MAW_DIR` を設定するか、`gradle.properties` に `mawSourceProject=/path/...` を書く。

> 既に本体MOD jar を手で `libs/local/the_four_primitives_and_weapons/<version>/` に置いている場合はこの手順を飛ばしてもよい（自動取込は最新を見つけたら上書きする）。

### 2. Mod ID を自分のものに変える

`the_four_primitives_and_weapons_addons_sample` / `mawaddon` を自分の Mod ID に一括置換:

| ファイル | 変更箇所 |
|---|---|
| [MawSampleAddon.java](src/main/java/mawaddon/MawSampleAddon.java) | `MODID` 定数 |
| [META-INF/mods.toml](src/main/resources/META-INF/mods.toml) | `modId=` の値 |
| [build.gradle](build.gradle) | `group`, `archivesBaseName` |
| `SampleEventHandler.java` | `@Mod.EventBusSubscriber(modid=...)` |
| `assets/the_four_primitives_and_weapons_addons_sample/` フォルダ名 | 新しい ID に |
| `data/the_four_primitives_and_weapons_addons_sample/` フォルダ名 | 新しい ID に |
| `lang/*.json` のキー | `the_four_primitives_and_weapons_addons_sample` の部分 |

### 3. ビルド + 実行

下記の「ビルド & 実行」を参照。

---

## ビルド & 実行

### スクリプト1発で実行（推奨）

用途別に2種類のスクリプトを同梱しています。

| やりたいこと | macOS / Linux / WSL | Windows |
|---|---|---|
| 本体MODを最新からビルドして addon を起動 | `./run_client.sh` | `run_client.bat` |
| 本体MODは再ビルドせず addon を起動 (高速) | `./run_quick.sh` | `run_quick.bat` |

- [run_client.sh](run_client.sh) / [run_client.bat](run_client.bat) は内部で:
  1. 本体MOD (`$MAW_DIR`) の `./gradlew build` を実行
  2. addon の `./gradlew runClient` を実行（addon の build.gradle が config phase で本体MOD の最新jarを `libs/local/` に自動コピー）
- [run_quick.sh](run_quick.sh) / [run_quick.bat](run_quick.bat) は `./gradlew runClient` を呼ぶだけ。本体MOD のソースに触らないので速い。

> 本体MOD のソース位置がデフォルトと違うとき:
> - bash: `MAW_DIR=/path/to/main-mod ./run_client.sh`
> - cmd: `set MAW_DIR=C:\path\to\main-mod` してから `run_client.bat`

**オフラインビルド** — `--offline` (短縮 `-o`) を渡すと依存解決をスキップしてキャッシュのみで実行:

```bash
./run_client.sh --offline
./run_quick.sh -o
```
```cmd
run_client.bat --offline
run_quick.bat -o
```

初回はオンラインで `./gradlew build` / `runClient` を一度通してキャッシュを作っておく必要があります（[BUILD_COMMANDS.md §5.4](BUILD_COMMANDS.md) 参照）。

### 自動取込の仕組み

addon の [build.gradle](build.gradle) は configuration phase で次を行います:

1. `${MAW_DIR}/build/libs/` を探す（デフォルトはホーム直下）
2. そこに `-sources` / `-dev` / `-javadoc` を含まない最新の jar があり、かつ addon 側の jar より新しければ、`libs/local/the_four_primitives_and_weapons/<version>/the_four_primitives_and_weapons-<version>.jar` にコピー（デフォルト version は `1.20.1-test`）
3. 本体MOD のソースが無い場合は静かにスキップ（既に libs/local/ にある jar をそのまま使う）

つまり「本体MOD を `./gradlew build` した直後に addon の runClient/build を叩けば、勝手に新しい jar が取り込まれる」状態です。

### 直接 gradle を叩く場合

| 目的 | macOS / Linux / WSL | Windows |
|---|---|---|
| addon の jar をビルド | `./gradlew build` | `gradlew.bat build` |
| addon クライアント起動 | `./gradlew runClient` | `gradlew.bat runClient` |
| addon サーバー起動 | `./gradlew runServer` | `gradlew.bat runServer` |
| クリーンビルド | `./gradlew clean build` | `gradlew.bat clean build` |
| データ生成 | `./gradlew runData` | `gradlew.bat runData` |

成果物は [build/libs/](build/libs/) に出ます。詳しいオプションは [BUILD_COMMANDS.md](BUILD_COMMANDS.md) 参照。

### 前提MODについて

addon の build.gradle は次の前提MOD を Maven / CurseMaven から自動取得します（本体MOD と同じバージョン）:

| MOD | バージョン | Maven |
|---|---|---|
| Curios | `5.10.0+1.20.1` | TheIllusiveC4 Maven |
| GeckoLib | `4.7.3` | Cloudsmith Maven |
| JEI | `15.20.0.129` | Progwml6 Maven (+ ModMaven fallback) |

CurseForge fileId で取得したい場合は [build.gradle](build.gradle) 内の `geckolib_file_id` / `farmers_delight_file_id` を埋める（任意）。

### オフラインモード

ForgeGradle は初回はオンラインで Minecraft メタファイルを取得しますが、以降はオフラインで作業できます:

```bash
./gradlew build --offline
./gradlew runClient --offline
```

詳しくは [BUILD_COMMANDS.md](BUILD_COMMANDS.md) 参照。

---

## アドオン作成ガイド（はじめての人向け）

The four primitives and Weapons は **データ駆動** で設計されており、武器の追加・スキル割当て・納刀対応のほとんどが Java を書かずに JSON だけで完結します。Java は「特殊な攻撃挙動を持たせる」「Mob とのインタラクションを追加する」など独自ロジックが必要な時だけ書きます。

### 0. テンプレート起動チェック

このプロジェクトを `git clone` して `./run_client.sh` (Windows なら `run_client.bat`) が通る状態なのを確認してから着手するのが楽です。

### 1. 自分のアドオン用に Mod ID を変える

このサンプルは `the_four_primitives_and_weapons_addons_sample` という Mod ID で動いてます。一括置換でリブランディング:

| 変更対象 | 値の例 |
|---|---|
| [src/main/java/mawaddon/MawSampleAddon.java](src/main/java/mawaddon/MawSampleAddon.java) の `MODID` 定数 | `"my_addon"` |
| [META-INF/mods.toml](src/main/resources/META-INF/mods.toml) の `modId` と `[[dependencies.<modid>]]` の `<modid>` 部分 | `"my_addon"` |
| `assets/the_four_primitives_and_weapons_addons_sample/` フォルダ名 | `assets/my_addon/` |
| `data/the_four_primitives_and_weapons_addons_sample/` フォルダ名 | `data/my_addon/` |
| `lang/ja_jp.json` `lang/en_us.json` のキーの `the_four_primitives_and_weapons_addons_sample` 部分 | `my_addon` |
| [build.gradle](build.gradle) の `group` と `archivesBaseName` | お好み |

正規表現一括置換できる IDE なら一発。

### 2. 新しい武器アイテムを追加する

3 ステップ:

**(a) Java クラスを書く** — [SampleSwordItem.java](src/main/java/mawaddon/item/SampleSwordItem.java) や [DaggerItem.java](src/main/java/mawaddon/item/DaggerItem.java) を真似する。`SwordItem` を継承し、Tier と攻撃力・速度を設定。特殊挙動を入れたければ `hurtEnemy` などをオーバーライド。

**(b) [AddonItems.java](src/main/java/mawaddon/init/AddonItems.java) に登録**

```java
public static final RegistryObject<Item> MY_SWORD =
    REGISTRY.register("my_sword", MySwordItem::new);
```

**(c) リソース3つ** を addon の assets/ に置く:

| ファイル | 内容 |
|---|---|
| `assets/<modid>/models/item/my_sword.json` | `parent: item/handheld` のシンプルなアイテムモデル |
| `assets/<modid>/textures/item/my_sword.png` | 16×16 (またはお好み) アイテムテクスチャ |
| `assets/<modid>/lang/{ja_jp,en_us}.json` に `"item.<modid>.my_sword": "..."` | 表示名翻訳 |

### 3. 武器を「武器タイプ」に登録する（スキル割当て）

[data/&lt;modid&gt;/weapon_types/weapons.json](src/main/resources/data/the_four_primitives_and_weapons_addons_sample/weapon_types/weapons.json) に書くだけで、本体の `WeaponTypeRegistry` が起動時に拾います。既存タイプ (`katana` `sword` `dagger` `rapier` `tyokuto` `bow` `crossbow` `throwing` `trident` `greatsword` `shield`) に乗せれば、その武器タイプのスキル一覧が `K キー` のスキル選択画面に出ます。

```json
{
  "types": {
    "sword": {
      "items": [ "my_addon:my_sword" ]
    }
  }
}
```

`items` だけ書けば motions は本体定義を継承。新規タイプを作る場合は `motions` セクションも書く（詳細は下の [武器タイプ登録](#武器タイプ登録weapon_types-json) セクション）。

### 4. 武器に納刀（鞘）対応をつける

[data/&lt;modid&gt;/maw_saya/saya.jsonc](src/main/resources/data/the_four_primitives_and_weapons_addons_sample/maw_saya/saya.jsonc) に書きます。2通り選べる:

**(A) 本体内蔵の鞘モデルを流用 (簡単)**

```jsonc
"sword": {
  "my_addon:my_sword": 1   // 1 = 鉄剣の鞘
}
```

数字は本体の `sword_saya.json` 等の `custom_model_data` スロット。番号一覧は saya.jsonc のコメント参照。

**(B) 独自の鞘モデルを作って差し替え (推奨)**

```jsonc
"sword": {
  "my_addon:my_sword": "my_addon:custom/saya/sword/saya_my_sword"
}
```

モデルファイル `assets/my_addon/models/custom/saya/sword/saya_my_sword.json` を置けば、本体MOD の `SayaModelWrapper` が起動時に自動スキャン・ベイクして納刀表示時に差し替えてくれます。 **`custom_model_data` 番号を使わないので無制限に追加できて他アドオンと衝突しません。** 詳細は [鞘(saya) への納刀登録](#鞘saya-への納刀登録maw_saya-jsonc) セクション。

### 5. 動作確認

```bash
./run_client.sh           # 本体MODをビルド + addon dev 起動
```

ゲーム内で:
- クリエイティブ検索やコマンド `/give @p my_addon:my_sword` で武器を取得
- `K キー` でスキル選択画面を開いて武器スロットに入れる → そのタイプのスキルが選べる
- `R キー` で鞘 (`/give @p the_four_primitives_and_weapons:sword_saya`) との納刀を試す → 設定した saya モデルが反映

ソースを編集したら `/reload` (データ JSON 変更) または F3+T (モデル変更) で大体ホットリロードできます。

### 6. オプション機能の連携

各前提MODは addon の build.gradle が自動取得しますが、addon コード上での参照は任意です。連携を入れる時は `mods.toml` の依存に `mandatory=true` を立てるか、本体MODと同じく `mandatory=false` + コード側で導入チェック (例: [FarmersDelightCompat.java](src/main/java/mawaddon/compat/FarmersDelightCompat.java)) を使う。

| 連携 | やれる事 |
|---|---|
| Curios | アクセサリスロット (ベルト/背中) への装着・刀掛け対応 |
| GeckoLib | 武器の独自アニメーション (3D handheld など) |
| JEI | レシピをUIに表示 |
| Farmer's Delight | ナイフ系を `dagger` タイプに登録 (既にサンプル済み) |

### 7. リリース用 jar をビルド

```bash
./gradlew build
```

→ `build/libs/<your_addon>-<version>.jar` ができる。これを本体MOD + 前提MODが入った Forge クライアントの `mods/` に入れるだけで動く。

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

## 鞘(saya) への納刀登録（maw_saya jsonc）

本体の `SayaRegistry` はサーバー起動時に **全MODの** `data/*/maw_saya/*.jsonc` (および `.json`) を自動収集します。`//` `/* */` コメントOK、`_` 始まりのファイルは無視。

| キー | 対象サヤ | 説明 |
|---|---|---|
| `katana` | 本体の `saya` | 通常の刀の鞘 |
| `tyokuto` | 本体の `tyokuto_saya` | 直刀の鞘 |
| `sword` | 本体の `sword_saya` | バニラ剣ベースの鞘 |

### 書き方は2通り

**(A) 整数** — 本体に内蔵されている鞘モデルの `custom_model_data` スロット番号を流用。

```jsonc
{
  "katana":  { "your_mod:custom_katana": 1 },     // 1 = 鉄刀の鞘
  "tyokuto": { "your_mod:custom_tyokuto": 4 },    // 4 = 鉄直刀の鞘
  "sword":   { "your_mod:custom_sword":   1 }     // 1 = 鉄剣の鞘
}
```

スロット番号の対応:

| サヤ | 既存スロット |
|---|---|
| katana | 1=iron, 2=gold, 3=stone, 4=netherite, 5=wither, 7=darkness, 8=magical, 9-15=他, 16=diamond, 19=replica |
| tyokuto | 1=luna, 4=iron, 5=gold, 6=stone, 7=diamond, 8=netherite |
| sword | 1=iron, 2=gold, 3=stone, 4=diamond, 5=netherite |

**(B) 文字列 (ResourceLocation)** — アドオン独自の鞘モデルを動的に差し替え。★推奨★

```jsonc
{
  "sword": {
    "your_mod:custom_sword": "your_mod:custom/saya/sword/saya_my_sword"
  }
}
```

値で指定したパスのモデル JSON を本体MOD の `SayaModelWrapper` (BakedModel) が起動時に自動ベイク・キャッシュし、納刀表示時に動的差し替えします。**`custom_model_data` 番号を一切経由しない**ので、いくらでも追加できて他アドオンと衝突しません。

> 仕組み: `ModelEvent.RegisterAdditional` で `assets/<*>/models/custom/saya/{katana,sword,tyokuto}/*.json` を全mod横断で再帰スキャン → 自動ベイク登録 → `ModelEvent.ModifyBakingResult` で本体の3つの saya モデルを SayaModelWrapper に差し替え → 描画時に NBT `StoredSword` → SayaRegistry → カスタムモデル解決。

### 独自モデルの配置先（規約）

```
assets/<your_mod>/models/custom/saya/katana/saya_xxx.json    # 通常の刀の鞘
assets/<your_mod>/models/custom/saya/tyokuto/saya_xxx.json   # 直刀の鞘
assets/<your_mod>/models/custom/saya/sword/saya_xxx.json     # バニラ剣の鞘
```

> **ファイル名規約** — 本体MODの命名に揃えると分かりやすい:
> - 通常刀: `saya_<weapon_name>.json`
> - 直刀: `saya_<weapon_name>_tyokuto.json`
> - バニラ剣ベース: `saya_sword_<weapon_name>.json`
> - `_` で始まるファイル名はスキャンから除外（テンプレ用）

### モデルの中身

シンプルに本体MOD の既存モデルを `parent` 継承する形が一番楽:

```json
{
  "parent": "the_four_primitives_and_weapons:custom/saya/sword/saya_sword_iron_sword"
}
```

これだけで本体MOD の鉄剣鞘テクスチャをそのまま借りられます。BlockBench で独自 3D モデルを作って `elements` を書く場合は、本体MOD の同種モデルを参考にしてください。

サンプル: [saya_sample_sword.json](src/main/resources/assets/the_four_primitives_and_weapons_addons_sample/models/custom/saya/sword/saya_sample_sword.json) が実装デモとして同梱されています。

---

## Farmer's Delight 連携

`FarmersDelightCompat.java` はFDが導入されている場合のみ動作します。

- FDのナイフで動物を倒すと、本体の難易度に応じてボーナスドロップ（革・羽）が発生
- `FarmersDelightCompat.isFDLoaded()` でFDの有無を確認できます

FDのナイフは [data/the_four_primitives_and_weapons_addons_sample/weapon_types/weapons.json](src/main/resources/data/the_four_primitives_and_weapons_addons_sample/weapon_types/weapons.json) で `dagger` タイプに登録済みです。

---

## 本体クラスの参照例

本体のアイテムや難易度システムを参照したい場合:

```java
// 本体のアイテムを参照
import the_four_primitives_and_weapons.init.TheFourPrimitivesAndWeaponsModItems;
ItemStack katana = TheFourPrimitivesAndWeaponsModItems.IRON_KATANA.get().getDefaultInstance();

// カスタム難易度を参照
import the_four_primitives_and_weapons.command.CustomDifficultyCommand;
int aiLevel = CustomDifficultyCommand.getCurrentDifficulty().getAiLevel();

// Mob特性を参照
import the_four_primitives_and_weapons.trait.MobTrait;
MobTrait trait = MobTrait.rollTrait(random.nextFloat(), aiLevel);
```

## 動作確認済み環境

- Minecraft 1.20.1
- Forge 47.1.0
- Java 17
