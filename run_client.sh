#!/bin/bash
# 本体MOD (The four primitives and Weapons) の jar を用意し直してから
# addon の runClient を実行する (フルフロー)
#
# 本体MOD の jar は scripts/fetch-maw-jar.sh が自動で用意する:
#   - ローカルに本体MODソースがあれば、それをビルド
#   - 無ければ GitHub から clone してビルド
#       https://github.com/Drowse-Lab/The-four-primitives-and-Weapons
# このため「Use this template」で複製しただけの環境でもそのまま動く。
#
# 使い方:
#   ./run_client.sh                  通常実行（本体MODを毎回ビルドし直す）
#   ./run_client.sh --offline        オフライン (clone せず既存ソース/jarを使用)
#   ./run_client.sh -o               同上 (--offline の短縮形)
#
# 本体MODソースの場所を明示する場合: MAW_DIR=/path/to/main-mod ./run_client.sh
set -e

# スクリプトの場所 = addon プロジェクトルート。どこから実行しても動くよう移動する。
ADDON_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ADDON_DIR"
[ -x ./gradlew ] || chmod +x ./gradlew 2>/dev/null || true

# ForgeGradle は systemProp 経由で証明書チェック無効化が効かないケースがあるので
# コマンドラインから -D で確実に渡す。
COMMON_FLAGS="-Dnet.minecraftforge.gradle.check.certs=false"

GRADLE_OPTS_EXTRA=""
for arg in "$@"; do
    case "$arg" in
        -o|--offline) GRADLE_OPTS_EXTRA="$GRADLE_OPTS_EXTRA --offline" ;;
        *)            GRADLE_OPTS_EXTRA="$GRADLE_OPTS_EXTRA $arg" ;;
    esac
done

# 本体MOD jar を最新化（毎回ビルドし直す）
echo "==> 本体MOD jar を準備$GRADLE_OPTS_EXTRA"
"$ADDON_DIR/scripts/fetch-maw-jar.sh" --force $GRADLE_OPTS_EXTRA

echo "==> addon runClient$GRADLE_OPTS_EXTRA"
exec ./gradlew runClient $GRADLE_OPTS_EXTRA $COMMON_FLAGS
