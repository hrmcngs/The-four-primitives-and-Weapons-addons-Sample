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
├── assets/minecraft_armor_weapon_sample/
│   ├── lang/
│   │   ├── ja_jp.json                日本語翻訳
│   │   └── en_us.json                英語翻訳
│   └── models/item/
│       ├── sample_sword.json         サンプル剣モデル
│       └── dagger.json               ダガーモデル
└── data/minecraft_armor_weapon_sample/
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

`minecraft_armor_weapon_sample` / `mawaddon` を自分の Mod ID に一括置換:

| ファイル | 変更箇所 |
|---|---|
| [MawSampleAddon.java](src/main/java/mawaddon/MawSampleAddon.java) | `MODID` 定数 |
| [META-INF/mods.toml](src/main/resources/META-INF/mods.toml) | `modId=` の値 |
| [build.gradle](build.gradle) | `group`, `archivesBaseName` |
| `SampleEventHandler.java` | `@Mod.EventBusSubscriber(modid=...)` |
| `assets/minecraft_armor_weapon_sample/` フォルダ名 | 新しい ID に |
| `data/minecraft_armor_weapon_sample/` フォルダ名 | 新しい ID に |
| `lang/*.json` のキー | `minecraft_armor_weapon_sample` の部分 |

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

FDのナイフは [data/minecraft_armor_weapon_sample/weapon_types/weapons.json](src/main/resources/data/minecraft_armor_weapon_sample/weapon_types/weapons.json) で `dagger` タイプに登録済みです。

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
