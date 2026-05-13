#!/bin/bash
# 本体MOD は今ある jar のまま、addon の runClient だけを実行する (高速)
#
# 使い方:
#   ./run_quick.sh                  通常実行
#   ./run_quick.sh --offline        オフライン実行
#   ./run_quick.sh -o               同上
set -e

COMMON_FLAGS="-Dnet.minecraftforge.gradle.check.certs=false"

GRADLE_OPTS_EXTRA=""
for arg in "$@"; do
    case "$arg" in
        -o|--offline) GRADLE_OPTS_EXTRA="--offline" ;;
        *)            GRADLE_OPTS_EXTRA="$GRADLE_OPTS_EXTRA $arg" ;;
    esac
done

echo "==> addon runClient (本体MODは再ビルドしない)  $GRADLE_OPTS_EXTRA"
exec ./gradlew runClient $GRADLE_OPTS_EXTRA $COMMON_FLAGS
