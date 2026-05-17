#!/bin/bash
# 本体MOD は今ある jar のまま、addon の runClient だけを実行する (高速)
#
# jar がまだ無い場合だけ scripts/fetch-maw-jar.sh が用意する
# (ローカルソースをビルド / 無ければ GitHub から clone してビルド)。
# jar が既にあれば何もせず即起動する。
#
# 使い方:
#   ./run_quick.sh                  通常実行
#   ./run_quick.sh --offline        オフライン実行
#   ./run_quick.sh -o               同上
set -e

# スクリプトの場所 = addon プロジェクトルート。どこから実行しても動くよう移動する。
ADDON_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ADDON_DIR"
[ -x ./gradlew ] || chmod +x ./gradlew 2>/dev/null || true

COMMON_FLAGS="-Dnet.minecraftforge.gradle.check.certs=false"

GRADLE_OPTS_EXTRA=""
for arg in "$@"; do
    case "$arg" in
        -o|--offline) GRADLE_OPTS_EXTRA="$GRADLE_OPTS_EXTRA --offline" ;;
        *)            GRADLE_OPTS_EXTRA="$GRADLE_OPTS_EXTRA $arg" ;;
    esac
done

# jar が無ければ用意（あれば何もしない＝速い）
"$ADDON_DIR/scripts/fetch-maw-jar.sh" $GRADLE_OPTS_EXTRA

echo "==> addon runClient (本体MODは再ビルドしない)$GRADLE_OPTS_EXTRA"
exec ./gradlew runClient $GRADLE_OPTS_EXTRA $COMMON_FLAGS
