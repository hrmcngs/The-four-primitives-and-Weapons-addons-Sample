#!/bin/bash
# 本体MOD (The four primitives and Weapons) をビルドし直してから
# addon の runClient を実行する (フルフロー)
#
# 使い方:
#   ./run_client.sh                  通常実行
#   ./run_client.sh --offline        オフラインビルド (依存解決をスキップ)
#   ./run_client.sh -o               同上 (--offline の短縮形)
#
# 本体MOD の場所はデフォルトで $HOME/The-four-primitives-and-Weapons。
# 別の場所にある場合: MAW_DIR=/path/to/main-mod ./run_client.sh
set -e

ADDON_DIR="$(cd "$(dirname "$0")" && pwd)"
MAW_DIR="${MAW_DIR:-$HOME/The-four-primitives-and-Weapons}"

# ForgeGradle 5.1 (本体MOD) は systemProp 経由で証明書チェック無効化が効かない
# ケースがあるので、コマンドラインから -D で確実に渡す。
COMMON_FLAGS="-Dnet.minecraftforge.gradle.check.certs=false"

GRADLE_OPTS_EXTRA=""
for arg in "$@"; do
    case "$arg" in
        -o|--offline) GRADLE_OPTS_EXTRA="--offline" ;;
        *)            GRADLE_OPTS_EXTRA="$GRADLE_OPTS_EXTRA $arg" ;;
    esac
done

if [ -d "$MAW_DIR" ]; then
    echo "==> 本体MODをビルド: $MAW_DIR  $GRADLE_OPTS_EXTRA"
    (cd "$MAW_DIR" && ./gradlew build $GRADLE_OPTS_EXTRA $COMMON_FLAGS)
else
    echo "[skip] 本体MOD ソースが見つかりません: $MAW_DIR"
    echo "       libs/local/ の既存jarで起動します。"
fi

echo "==> addon runClient: $ADDON_DIR  $GRADLE_OPTS_EXTRA"
exec ./gradlew runClient $GRADLE_OPTS_EXTRA $COMMON_FLAGS
