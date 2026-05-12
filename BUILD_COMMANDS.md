# ビルド & 実行コマンド一覧

Forge 1.20.1 (MDK) 用のビルド・実行コマンドをまとめたものです。
プロジェクトルート（`gradlew` がある場所）で実行してください。

---

## 0. 事前準備（macOS / Linux 初回のみ）

`gradlew` に実行権限を付ける:

```bash
chmod +x ./gradlew
```

---

## 1. 基本ビルドコマンド

| 目的 | macOS / Linux | Windows |
|------|---------------|---------|
| MOD の jar をビルド | `./gradlew build` | `gradlew.bat build` |
| ビルド成果物を削除 | `./gradlew clean` | `gradlew.bat clean` |
| クリーン → ビルド | `./gradlew clean build` | `gradlew.bat clean build` |
| 成果物のみ作成（テスト省略） | `./gradlew assemble` | `gradlew.bat assemble` |
| テストのみ実行 | `./gradlew test` | `gradlew.bat test` |

ビルド成果物は [build/libs/](build/libs/) に出力されます。

---

## 2. 実行コマンド（開発用）

| 目的 | macOS / Linux | Windows |
|------|---------------|---------|
| クライアント起動 | `./gradlew runClient` | `gradlew.bat runClient` |
| サーバー起動 | `./gradlew runServer` | `gradlew.bat runServer` |
| データ生成 | `./gradlew runData` | `gradlew.bat runData` |
| ゲームテスト実行 | `./gradlew runGameTestServer` | `gradlew.bat runGameTestServer` |

---

## 3. Forge / MDK 固有のタスク

| 目的 | コマンド |
|------|----------|
| Eclipse 用ファイル生成 | `./gradlew genEclipseRuns` |
| IntelliJ IDEA 用ファイル生成 | `./gradlew genIntellijRuns` |
| VS Code 用ファイル生成 | `./gradlew genVSCodeRuns` |
| ソース jar も含めて生成 | `./gradlew build sourcesJar` |

---

## 4. 情報・診断コマンド

| 目的 | コマンド |
|------|----------|
| 利用可能なタスク一覧 | `./gradlew tasks` |
| 全タスク（非表示含む） | `./gradlew tasks --all` |
| 依存関係ツリー | `./gradlew dependencies` |
| プロジェクト情報 | `./gradlew projects` |
| Gradle のバージョン | `./gradlew --version` |

---

## 5. オフラインビルド

一度オンラインで依存関係をダウンロードした後は、オフラインで作業できます。

### 5.1 オフラインモードでビルド

依存解決をスキップしてキャッシュのみを使用:

```bash
./gradlew build --offline
```

### 5.2 よく使うオフラインコマンド

| 目的 | コマンド |
|------|----------|
| オフラインでビルド | `./gradlew build --offline` |
| オフラインでクライアント起動 | `./gradlew runClient --offline` |
| オフラインでサーバー起動 | `./gradlew runServer --offline` |
| オフラインでクリーン → ビルド | `./gradlew clean build --offline` |

### 5.3 永続的にオフラインモードにしたい場合

`gradle.properties`（プロジェクトルート、または `~/.gradle/`）に追記:

```properties
org.gradle.offline=true
```

> 元に戻すときはこの行を削除します。

### 5.4 オフライン作業前のキャッシュ準備（重要）

ForgeGradle 6 はビルド時に Minecraft メタファイル（`downloadMCMeta`）や
アセットを Mojang から取得します。これらのタスクは `--offline` を渡しても
キャッシュが無いと失敗するため、**最初に一度だけオンラインで実行**して
キャッシュを作っておく必要があります。

```bash
# 1) オンライン環境で1回だけ実行（依存とMCメタを全部取得）
./gradlew build --refresh-dependencies
./gradlew runClient   # ゲーム画面が出るところまで起動して終了

# 2) 以降はオフラインでもOK
./gradlew runClient --offline
./gradlew build --offline
```

### 5.5 証明書チェックの無効化（このプロジェクトでは設定済み）

ForgeGradle 6 は起動時に `maven.minecraftforge.net` の証明書検証を行い、
オフラインだとここで失敗します。`gradle.properties` に以下を入れてあるので
通常は意識不要です:

```properties
systemProp.net.minecraftforge.gradle.check.certs=false
```

---

## 6. 高速化・トラブル時に役立つオプション

| オプション | 効果 |
|------------|------|
| `--offline` | リモートリポジトリにアクセスしない |
| `--no-daemon` | Gradle デーモンを使わない（CI 向け / メモリ問題回避） |
| `--daemon` | デーモンを使う（デフォルト、起動高速化） |
| `--parallel` | 並列ビルド |
| `--build-cache` | ビルドキャッシュを利用 |
| `--refresh-dependencies` | 依存関係を強制再取得 |
| `--stacktrace` | エラー時にスタックトレース表示 |
| `--info` | 詳細ログ |
| `--debug` | デバッグログ |
| `--rerun-tasks` | キャッシュ無視で全タスク再実行 |

例:

```bash
./gradlew build --offline --parallel --build-cache
./gradlew build --stacktrace --info
```

---

## 7. キャッシュ・成果物の削除

| 目的 | コマンド |
|------|----------|
| プロジェクト内の build/ を削除 | `./gradlew clean` |
| Gradle デーモンを停止 | `./gradlew --stop` |
| グローバルキャッシュ確認 | `ls ~/.gradle/caches/` |
| Forge MDK の依存キャッシュ | `ls ~/.gradle/caches/forge_gradle/` |

> グローバルキャッシュ（`~/.gradle/caches`）は通常削除しないでください。再ダウンロードに時間がかかります。

---

## 8. 配布用 jar のビルド

```bash
./gradlew clean build
```

完成した jar:

- [build/libs/](build/libs/) 配下の `*.jar`

`-sources.jar` や `-dev.jar` ではなく、ファイル名に `sources` / `dev` が **付いていないもの** が配布用です。
