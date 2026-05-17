#!/bin/bash
# 本体MOD (The four primitives and Weapons) をビルドし直してから
# addon の runClient を実行する (フルフロー)
#
# 使い方:
#   ./run_client.sh                  通常実行
#   ./run_client.sh --offline        オフラインビルド (依存解決をスキップ)
#   ./run_client.sh -o               同上 (--offline の短縮形)
#
# どのディレクトリから実行しても動く。本体MOD ソースの場所は次の優先順で
# 自動判定する:
#   1. 環境変数 MAW_DIR              例: MAW_DIR=/path/to/main-mod ./run_client.sh
#   2. gradle.properties の mawSourceProject
#   3. $HOME/The-four-primitives-and-Weapons          ← 標準配置（推奨）
#   4. addon の親 / 祖父フォルダにある The-four-primitives-and-Weapons
# どれにも見つからなければ libs/local/ の既存jarで起動する。
set -e

# --- スクリプトの場所 = addon プロジェクトルート -------------------------
# どのディレクトリから実行しても ./gradlew が見つかるよう、ここへ移動する。
ADDON_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ADDON_DIR"

# --- gradlew に実行権限を付ける ------------------------------------------
# zip展開やWindows経由のcloneで実行ビットが失われた場合の保険。
ensure_executable() {
    if [ -f "$1" ] && [ ! -x "$1" ]; then
        chmod +x "$1" 2>/dev/null || true
    fi
}

# --- 本体MOD ソースの場所を判定 ------------------------------------------
resolve_maw_dir() {
    if [ -n "$MAW_DIR" ]; then
        echo "$MAW_DIR"; return
    fi
    if [ -f "$ADDON_DIR/gradle.properties" ]; then
        local prop
        prop=$(sed -n 's/^[[:space:]]*mawSourceProject[[:space:]]*=[[:space:]]*//p' \
               "$ADDON_DIR/gradle.properties" | head -n1)
        if [ -n "$prop" ]; then echo "$prop"; return; fi
    fi
    local parent grandparent
    parent="$(dirname "$ADDON_DIR")"
    grandparent="$(dirname "$parent")"
    for cand in \
        "$HOME/The-four-primitives-and-Weapons" \
        "$parent/The-four-primitives-and-Weapons" \
        "$grandparent/The-four-primitives-and-Weapons"
    do
        if [ -d "$cand" ]; then echo "$cand"; return; fi
    done
    # 見つからなくても標準パスを返す（存在チェックは後段で行う）
    echo "$HOME/The-four-primitives-and-Weapons"
}
MAW_DIR="$(resolve_maw_dir)"
# 存在するなら絶対パスに正規化（gradle.properties に相対パスが入っていても安全）
if [ -d "$MAW_DIR" ]; then
    MAW_DIR="$(cd "$MAW_DIR" && pwd)"
fi

# ForgeGradle 5.1 (本体MOD) は systemProp 経由で証明書チェック無効化が効かない
# ケースがあるので、コマンドラインから -D で確実に渡す。
COMMON_FLAGS="-Dnet.minecraftforge.gradle.check.certs=false"

GRADLE_OPTS_EXTRA=""
for arg in "$@"; do
    case "$arg" in
        -o|--offline) GRADLE_OPTS_EXTRA="$GRADLE_OPTS_EXTRA --offline" ;;
        *)            GRADLE_OPTS_EXTRA="$GRADLE_OPTS_EXTRA $arg" ;;
    esac
done

ensure_executable "$ADDON_DIR/gradlew"

if [ -d "$MAW_DIR" ] && [ -f "$MAW_DIR/gradlew" ]; then
    ensure_executable "$MAW_DIR/gradlew"
    echo "==> 本体MODをビルド: $MAW_DIR$GRADLE_OPTS_EXTRA"
    ( cd "$MAW_DIR" && ./gradlew build $GRADLE_OPTS_EXTRA $COMMON_FLAGS )
else
    echo "[skip] 本体MOD ソースが見つかりません: $MAW_DIR"
    echo "       libs/local/ の既存jarで起動します。"
fi

echo "==> addon runClient: $ADDON_DIR$GRADLE_OPTS_EXTRA"
# 本体MODの場所を build.gradle にも渡し、jar 自動取り込みのパスを一致させる。
exec ./gradlew runClient $GRADLE_OPTS_EXTRA $COMMON_FLAGS -PmawSourceProject="$MAW_DIR"
