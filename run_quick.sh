#!/bin/bash
# 本体MOD は今ある jar のまま、addon の runClient だけを実行する (高速)
#
# 使い方:
#   ./run_quick.sh                  通常実行
#   ./run_quick.sh --offline        オフライン実行
#   ./run_quick.sh -o               同上
#
# どのディレクトリから実行しても動く。
set -e

# スクリプトの場所 = addon プロジェクトルート。ここへ移動して ./gradlew を確実に見つける。
ADDON_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ADDON_DIR"

# gradlew に実行権限を付ける（zip展開やWindows経由のcloneで失われた場合の保険）。
if [ -f "$ADDON_DIR/gradlew" ] && [ ! -x "$ADDON_DIR/gradlew" ]; then
    chmod +x "$ADDON_DIR/gradlew" 2>/dev/null || true
fi

COMMON_FLAGS="-Dnet.minecraftforge.gradle.check.certs=false"

GRADLE_OPTS_EXTRA=""
for arg in "$@"; do
    case "$arg" in
        -o|--offline) GRADLE_OPTS_EXTRA="$GRADLE_OPTS_EXTRA --offline" ;;
        *)            GRADLE_OPTS_EXTRA="$GRADLE_OPTS_EXTRA $arg" ;;
    esac
done

echo "==> addon runClient (本体MODは再ビルドしない)$GRADLE_OPTS_EXTRA"
exec ./gradlew runClient $GRADLE_OPTS_EXTRA $COMMON_FLAGS
