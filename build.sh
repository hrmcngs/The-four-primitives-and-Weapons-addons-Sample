#!/bin/bash
set -e

# WSL のパスを Windows パスに変換して cmd.exe 経由で実行
WIN_DIR=$(wslpath -w "$(cd "$(dirname "$0")" && pwd)")

echo "=== ビルド開始 ==="
cmd.exe /c "cd /d ${WIN_DIR} && gradlew.bat build $*"
echo "=== ビルド完了 ==="
