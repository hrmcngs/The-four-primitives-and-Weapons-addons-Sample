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
- ジェネレーターは生成先にも同梱され、さらに別の雛形や武器を作成できます

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
npm run create-weapon -- \
  --type katana \
  --id moon_katana \
  --name 月光刀 \
  --name-en "Moon Katana"
```

`--type` は `dagger`、`katana`、`rapier`、`tyokuto` に対応しています。オプションを省略すると対話形式で入力できます。生成後は案内されたモデルJSONの `textures` を、自分で配置したPNGへ変更するだけです。

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
