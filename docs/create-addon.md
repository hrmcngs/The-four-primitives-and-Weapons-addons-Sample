# アドオン雛形ジェネレーター

このリポジトリと同じ構成の MAW アドオンプロジェクトをターミナルから一発で生成できます。

## 使い方

### 対話モード（推奨）

```bash
npm run create-addon
# または
node scripts/create-addon.mjs
```

modId・表示名・作者・Java パッケージなどを 1 つずつ聞かれます。Enter キーで `[ ]` 内の既定値が使われます。

### 非対話モード（CI / スクリプト用）

```bash
node scripts/create-addon.mjs ../my-addon \
  --yes \
  --modid my_cool_addon \
  --name "My Cool Addon" \
  --author your-name \
  --group com.example.mycool \
  --package com.example.mycool \
  --class MyCoolAddon \
  --archive my-cool-addon
```

## オプション一覧

| フラグ | 説明 | 既定値 |
| --- | --- | --- |
| `<dir>` (位置引数) | 出力先ディレクトリ | `../my-maw-addon` |
| `--yes` / `-y` | 確認プロンプトをスキップ | `false` |
| `--modid` | modId（小文字英数 + `_`） | `my_maw_addon` |
| `--name` | mods.toml の `displayName` | `My MAW Addon` |
| `--author` | 作者名 | `your-name` |
| `--group` | Maven group ID | `com.example.<modid>` |
| `--package` | Java の完全修飾パッケージ | `--group` と同じ |
| `--class` | メインクラス名（PascalCase） | modId を PascalCase 化 |
| `--archive` | JAR ファイル名（archivesBaseName） | modId をダッシュ区切り化 |

## 自動置換される項目

- `modId`（スネーク・ダッシュ両形式）
- 表示名 / 作者名
- Java パッケージ + ディレクトリ構造（例: `mawaddon/` → `com/example/yourpkg/`）
- メインクラス名（ファイル名も含む）
- `assets/<modid>/` および `data/<modid>/` のフォルダ名
- `build.gradle` の `group` と `archivesBaseName`
- `package.json` の `name`

## 除外されるもの

- `.git/`, `.gradle/`, `build/`, `run/`, `bin/`, `node_modules/`
- `libs/local/`（本体MOD jar — `scripts/fetch-maw-jar.sh` で取り直す）
- `package-lock.json`（`npm install` で再生成）
- コマンドランナーだけが生成先に含まれ、武器生成コマンド本体は含まれません

## コマンドの更新方法

`npm run create-weapon` は、実行時に専用の `hrmcngs/The-four-primitives-and-Weapons-addon-commands` リポジトリから最新版を取得し、`.maw-tools/` にキャッシュしてから実行します。コマンド本体はこのテンプレートに置かないため、GitHub の「Use this template」で作ったリポジトリにはコピーされません。生成済みアドオンを作り直さなくても武器生成コマンドの更新を利用できます。

ネットワークに接続できない場合は、前回取得したキャッシュへ自動的に切り替わります。初回だけはオンラインでの取得が必要です。明示的に通信せず実行する場合は次を使います。

```bash
npm run create-weapon:offline
```

取得元とブランチは `.maw-addon.json` の `commands.repository` / `commands.ref` で固定できます。一時的に変更する場合は `MAW_COMMANDS_REPOSITORY`、`MAW_COMMANDS_REF`、`MAW_COMMANDS_BASE_URL` 環境変数も利用できます。

### 新しいコマンドの追加

コマンド専用リポジトリへ `scripts/<コマンド名>.mjs` を追加すると、すでに Use template で作成済みのリポジトリからも次の形式で実行できます。

```bash
./maw <コマンド名>
```

コマンド名には小文字英数字とハイフンを使用します。ランナーや生成済みリポジトリの更新は不要です。

`scripts/commands.json` にコマンド名、説明、候補に出したいオプションも登録します。利用者は `./maw help` で一覧を確認でき、次の設定でTab補完を有効にできます。

```bash
# zsh
source <(./maw completion zsh)

# bash
source <(./maw completion bash)
```

```powershell
# PowerShell
Invoke-Expression (& .\maw completion powershell | Out-String)
```

## 生成後の手順

```bash
cd ../my-addon

# 本体MOD jar の取り込み（任意 — 本体MODソースが ~/The-four-primitives-and-Weapons にあれば自動）
bash scripts/fetch-maw-jar.sh

# ビルド
./gradlew build
```

## 武器を追加する

生成したアドオンのディレクトリで次を実行すると、Java登録、モデル、翻訳、武器タイプ、能力値がまとめて追加されます。

```bash
./maw create-weapon \
  --type katana \
  --id moon_katana \
  --name 月光刀 \
  --name-en "Moon Katana" \
  --creative-tab minecraft:combat \
  --blade-color gray \
  --tsuka-color red \
  --tsuba-color "#708090" \
  --kasira-color 1a1a1a
```

Windows では `maw create-weapon ...` と入力します。Node.js 18 以上があれば依存関係のインストールは不要です。`npm run create-weapon -- ...` も引き続き利用できます。

`--type` は `dagger`、`katana`、`rapier`、`tyokuto` に対応しています。オプションを省略すると対話形式で入力できます。生成後は案内されたモデルJSONの `textures` を、自分で配置したPNGへ変更するだけです。

`--id` または対話入力のアイテムIDに空白が含まれる場合は、自動的に `_` へ変換されます。半角・全角・連続した空白に対応します（例: `moon katana` → `moon_katana`）。

`--creative-tab` には表示先のクリエイティブタブIDを指定します。既定値は `minecraft:combat` です。Minecraft名前空間は省略できるため、`--creative-tab tools_and_utilities` も使用できます。他MODのタブは `modid:tab_id` の形式で指定します。

生成アイテムはクリエイティブタブへ色NBT付きで追加されます。`/give` などでNBTなしのスタックを作った場合も、インベントリへ入ると指定した初期色が補完されます。ゲーム内で染色済みの色は上書きしません。

代表的なバニラタブ:

- `minecraft:combat`
- `minecraft:tools_and_utilities`
- `minecraft:ingredients`
- `minecraft:functional_blocks`
- `minecraft:building_blocks`

全武器で `--blade-color` による刀身色の指定ができます。刀身テクスチャは通常のironをグレーの基準色として使い、拵えと同様に色名または16進数RGBで着色します。`gray` は無着色の通常iron（既定値）です。

```bash
--blade-color gray       # 通常のiron
--blade-color red        # 色名
--blade-color "#12ABEF" # 16進数RGB
```

拵えは本体MODの染色機能を利用するため、色名または16進数RGBで任意の色を指定できます。16進数は `#RRGGBB`、`RRGGBB`、`0xRRGGBB`、短縮形の `#RGB` に対応しています。`#` 付きの値はシェルでコメントにならないよう引用符で囲んでください。

| フラグ | 指定例 | 既定値 |
| --- | --- | --- |
| `--tsuka-color`（柄） | `red`, `水色`, `"#12ABEF"` | `black` |
| `--tsuba-color`（鍔） | `gold`, `紫`, `708090` | `black` |
| `--kasira-color`（頭） | `white`, `茶`, `0x442211` | `black` |

- ダガー: `--grip-color`, `--tsuba-color`
- 細剣: `--grip-color`, `--guard-color`, `--pommel-color`
- 直刀: `--tsuka-color`, `--tsuba-color`, `--kasira-color`

英語の基本色名・Minecraft系の色名（`dark_blue`、`light_purple` など）に加え、日本語の `赤`、`青`、`緑`、`黄`、`白`、`黒`、`灰`、`紫`、`桃`、`橙`、`水色`、`茶` が使えます。それ以外の色は16進数で指定できます。生成後も、本体MODの通常の染色レシピで拵えを染め直せます。

### 鞘への納刀

`create-weapon` で生成した全武器は自動的に対応する鞘へ納刀できます。次の2ファイルも武器と同時に生成されます。

- `data/<modid>/maw_saya/<item_id>.json` — 納刀対象の登録
- `assets/<modid>/models/custom/saya/<type>/saya_<item_id>.json` — 鞘モデル

既定の鞘モデルはiron用の本体MODモデルを継承します。独自デザインにする場合は、生成された鞘モデルの `parent` を変更してください。

## 例

`my_cool_addon` を `~/Documents/github/mods/my-cool-addon` に作成:

```bash
node scripts/create-addon.mjs ~/Documents/github/mods/my-cool-addon \
  --yes \
  --modid my_cool_addon \
  --name "My Cool Addon" \
  --author atsn-ngs
```

省略した項目（`--group`, `--package`, `--class`, `--archive`）は modId から自動で導出されます。
