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
│   ├── DaggerItem.java               ダガー（背後攻撃特化）
│   ├── SampleKatanaItem.java         刀テンプレート
│   ├── SampleRapierItem.java         細剣テンプレート
│   └── SampleTyokutoItem.java        直刀テンプレート
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
│   ├── models/item/                  各アイテムモデル
│   ├── models/custom/weapon/         武器種別の組み立てモデル
│   └── textures/                     blade と武器種別 fitting
└── data/the_four_primitives_and_weapons_addons_sample/
    ├── weapon_types/
    │   ├── weapon_types.json         ★ 武器タイプ宣言
    │   └── preferred_motions.jsonc   ★ 技適性
    ├── weapon_stats/
    │   └── weapon_stats.json         ★ 武器能力値
    └── maw_saya/
        └── saya.jsonc                ★ 鞘(納刀)対象アイテム宣言

assets/the_four_primitives_and_weapons_addons_sample/models/custom/saya/
├── katana/                            刀の鞘モデル置き場
├── tyokuto/                           直刀の鞘モデル置き場
├── sword/                             バニラ剣の鞘モデル置き場
│   └── saya_sample_sword.json         ★ 実動デモ (sample_sword の独自鞘)
└── rapier/                            レイピアの鞘モデル置き場
```

## セットアップ手順

### 最短手順: 雛形と武器をコマンドで生成

```bash
npm run create-addon -- ../my-addon
cd ../my-addon
./maw create-weapon
```

Windows のコマンドプロンプト／PowerShellでは `maw create-weapon` を実行します。Node.js 18 以上があれば `npm install` は不要です。従来の `npm run create-weapon` も利用できます。

`commands` ブランチの `scripts/<コマンド名>.mjs` に新しいコマンドを追加すると、既存の Use template リポジトリでも `./maw <コマンド名>` で即時利用できます。ランナー側へのコマンド名追加は不要です。

コマンド一覧と使い方は `./maw help` で確認できます。ターミナル補完を有効にすると、TabキーでMODコマンド名やオプションを選択できます。

```bash
# zsh
source <(./maw completion zsh)

# bash
source <(./maw completion bash)
```

PowerShell:

```powershell
Invoke-Expression (& .\maw completion powershell | Out-String)
```

新しいターミナルでも有効にする場合は、使用中のシェルの設定ファイルへ該当行を追加してください。

`create-weapon` は `dagger`、`katana`、`rapier`、`tyokuto` に対応し、Javaクラス、登録、モデル、翻訳、武器タイプ、能力値、クリエイティブタブ、鞘への納刀設定を一括生成します。`--creative-tab` で表示先タブを指定できます。全武器で通常のiron刀身をグレーの基準色として、`--blade-color` に色名または `#RRGGBB` を指定できます。柄・鍔・頭などの拵えも、本体MODの染色機能で任意色にできます。詳しくは [雛形ジェネレーター](docs/create-addon.md) を参照してください。

生成済みアドオンの `create-weapon` も実行時にこのリポジトリの `commands` ブランチから最新版を取得します。コマンド本体は「Use this template」の複製対象になりません。取得できない場合は前回のキャッシュへ切り替わるため、サンプルを作り直さず利用できます（初回取得のみオンライン接続が必要です）。

### 1. 本体MODの jar（自動で用意される）

addon のビルドには本体MOD「The four primitives and Weapons」の jar が必要ですが、`scripts/fetch-maw-jar.sh`（Windows は `scripts\fetch-maw-jar.bat`）が自動で用意します。実行スクリプトや GitHub Actions から呼ばれ、次の順で jar を確保します:

1. `libs/local/` に jar が既にあればそれを使う
2. ローカルに本体MODソースがあればビルドして取り込む
3. どちらも無ければ GitHub から clone してビルドする
   （<https://github.com/Drowse-Lab/The-four-primitives-and-Weapons>）

このため **「Use this template」で複製しただけの環境でも、追加準備なしにビルドできます。**

本体MODソースを手元に置いて開発する場合は、次のいずれかの場所に置くと clone せずそのソースをビルドします:

| OS | デフォルトパス |
|---|---|
| macOS / Linux / WSL | `~/The-four-primitives-and-Weapons` |
| Windows | `%USERPROFILE%\The-four-primitives-and-Weapons` |

別の場所に置く場合は、環境変数 `MAW_DIR` を設定するか、`gradle.properties` に `mawSourceProject=/path/...` を書く。

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
  1. `scripts/fetch-maw-jar.sh` で本体MOD jar を用意（ローカルソースをビルド／無ければ GitHub から clone してビルド）
  2. addon の `./gradlew runClient` を実行
- [run_quick.sh](run_quick.sh) / [run_quick.bat](run_quick.bat) は jar が無いときだけ用意し、あれば即 `./gradlew runClient`。速い。

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

### 本体MOD jar の自動用意

`scripts/fetch-maw-jar.sh` / `scripts\fetch-maw-jar.bat` が次の順で jar を確保します:

1. `libs/local/the_four_primitives_and_weapons/1.20.1-test/` に jar があればそれを使う（`--force` で作り直し）
2. ローカルに本体MODソースがあれば `./gradlew build` してビルド成果物を取り込む
3. 無ければ GitHub から `--depth 1` で clone（`.maw-src/`）してビルド

取り込み時は `-sources` / `-dev` / `-javadoc` を除いた最新 jar を選び、`libs/local/the_four_primitives_and_weapons/1.20.1-test/the_four_primitives_and_weapons-1.20.1-test.jar` に固定名でコピーします（addon の [build.gradle](build.gradle) が参照する場所）。

直接 jar を確保したいときは単体でも実行できます:

```bash
./scripts/fetch-maw-jar.sh            # jar が無ければ用意
./scripts/fetch-maw-jar.sh --force    # 既存 jar があっても作り直す
```

GitHub Actions（[.github/workflows/build.yml](.github/workflows/build.yml)）も同じスクリプトを使い、push するたびに本体MOD jar と addon jar を自動ビルドします。生成物は Actions 実行ページの **Artifacts** からダウンロードできます。

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

[data/&lt;modid&gt;/weapon_types/weapon_types.json](src/main/resources/data/the_four_primitives_and_weapons_addons_sample/weapon_types/weapon_types.json) に書くだけで、本体の `WeaponTypeRegistry` が起動時に拾います。既存タイプ (`katana` `sword` `dagger` `rapier` `straight_sword` `bow` `crossbow` `throwing` `trident` `greatsword` `shield`) に乗せれば、その武器タイプのスキル一覧が `K キー` のスキル選択画面に出ます。

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

[data/&lt;modid&gt;/maw_saya/saya.jsonc](src/main/resources/data/the_four_primitives_and_weapons_addons_sample/maw_saya/saya.jsonc) に「アイテムID → 鞘モデルのパス」を書きます。

```jsonc
"sword": {
  "my_addon:my_sword": "my_addon:custom/saya/sword/saya_my_sword"
}
```

モデルファイル `assets/my_addon/models/custom/saya/sword/saya_my_sword.json` を置けば、本体MOD の `SayaModelWrapper` が起動時に自動スキャン・ベイクして納刀表示時に差し替えてくれます。**`custom_model_data` は使わないので無制限に追加できて他アドオンと衝突しません。** 詳細は [鞘(saya) への納刀登録](#鞘saya-への納刀登録maw_saya-jsonc) セクション。

`katana` `tyokuto` `sword` `rapier` の 4 種類の鞘に対応しています。各種類ごとに上の例と同じパターンで登録します。

> 旧版では値に整数 (鉄=1, 金=2 など) を書いて本体内蔵モデルを流用する方式もありましたが、現在は **文字列パス方式に統一されています**。整数も互換のため受理されますが新規アイテムでは使わないでください。

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
// data/your_mod/weapon_types/weapon_types.json
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
| `rapier` | 本体の `rapier_saya` | レイピアの鞘 |

### 書き方 — ResourceLocation 文字列で書く

値には **「鞘モデルの ResourceLocation 文字列」** を書きます:

```jsonc
{
  "katana":  { "your_mod:custom_katana":  "your_mod:custom/saya/katana/saya_custom_katana" },
  "tyokuto": { "your_mod:custom_tyokuto": "your_mod:custom/saya/tyokuto/saya_custom_tyokuto" },
  "sword":   { "your_mod:custom_sword":   "your_mod:custom/saya/sword/saya_sword_custom" },
  "rapier":  { "your_mod:custom_rapier":  "your_mod:custom/saya/rapier/saya_custom_rapier" }
}
```

指定したパスのモデル JSON を本体MOD の `SayaModelWrapper` (BakedModel) が起動時に自動ベイク・キャッシュし、納刀表示時に動的差し替えします。**`custom_model_data` 番号を一切経由しない**ので、いくらでも追加できて他アドオンと衝突しません。

> 仕組み: `ModelEvent.RegisterAdditional` で `assets/<*>/models/custom/saya/{katana,sword,tyokuto,rapier}/*.json` を全mod横断で再帰スキャン → 自動ベイク登録 → `ModelEvent.ModifyBakingResult` で本体4種の saya モデルを SayaModelWrapper に差し替え → 描画時に NBT (`StoredKatana` / `StoredSword` / `StoredRapier`) → SayaRegistry → カスタムモデル解決。

> **旧整数方式について** — 値に整数 (鉄=1, 金=2 など) を書く方式も互換のため残っていますが、現在は文字列パス方式に統一されています。新規アイテムでは文字列方式で書いてください。

### 独自モデルの配置先（規約）

```
assets/<your_mod>/models/custom/saya/katana/saya_xxx.json    # 通常の刀の鞘
assets/<your_mod>/models/custom/saya/tyokuto/saya_xxx.json   # 直刀の鞘
assets/<your_mod>/models/custom/saya/sword/saya_xxx.json     # バニラ剣の鞘
assets/<your_mod>/models/custom/saya/rapier/saya_xxx.json    # レイピアの鞘
```

> **ファイル名規約** — 本体MODの命名に揃えると分かりやすい:
> - 通常刀: `saya_<weapon_name>.json`
> - 直刀: `saya_<weapon_name>_tyokuto.json`
> - バニラ剣ベース: `saya_sword_<weapon_name>.json`
> - レイピア: `saya_<weapon_name>_rapier.json`
> - `_` で始まるファイル名はスキャンから除外（テンプレ用）

### モデルの中身

シンプルに本体MOD の既存モデルを `parent` 継承する形が一番楽:

```json
{
  "parent": "the_four_primitives_and_weapons:custom/saya/sword/saya_sword_iron_sword"
}
```

これだけで本体MOD の鉄剣鞘テクスチャをそのまま借りられます。BlockBench で独自 3D モデルを作って `elements` を書く場合は、本体MOD の同種モデルを参考にしてください。

サンプル: [saya_sample_sword.json](src/main/resources/assets/the_four_primitives_and_weapons_addons_sample/models/custom/saya/sword/saya_sample_sword.json) が実動デモとして同梱されています。各タイプの空テンプレ (`_example_*.json`) も `custom/saya/{katana,tyokuto,sword,rapier}/` 各サブディレクトリに置いてあるので、`_` を外してリネームすれば使えます。

---

## Farmer's Delight 連携

`FarmersDelightCompat.java` はFDが導入されている場合のみ動作します。

- FDのナイフで動物を倒すと、本体の難易度に応じてボーナスドロップ（革・羽）が発生
- `FarmersDelightCompat.isFDLoaded()` でFDの有無を確認できます

FDのナイフは [weapon_types.json](src/main/resources/data/the_four_primitives_and_weapons_addons_sample/weapon_types/weapon_types.json) で `dagger` タイプに登録済みです。

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
