@echo off
REM 本体MOD (The four primitives and Weapons) をビルドし直してから
REM addon の runClient を実行する (フルフロー)
REM
REM 使い方:
REM   run_client.bat                  通常実行
REM   run_client.bat --offline        オフラインビルド
REM   run_client.bat -o               同上
REM
REM 本体MOD の場所はデフォルトで %USERPROFILE%\The-four-primitives-and-Weapons
REM 別の場所にある場合は事前に: set MAW_DIR=C:\path\to\main-mod
setlocal

REM どのフォルダから実行しても gradlew.bat が見つかるよう、スクリプトの場所へ移動する。
cd /d "%~dp0"

if "%MAW_DIR%"=="" set "MAW_DIR=%USERPROFILE%\The-four-primitives-and-Weapons"

REM ForgeGradle 5.1 (本体MOD) は systemProp 経由で証明書チェック無効化が
REM 効かないケースがあるので、コマンドラインから -D で確実に渡す。
set "COMMON_FLAGS=-Dnet.minecraftforge.gradle.check.certs=false"

set "GRADLE_OPTS_EXTRA="
:ARG_LOOP
if "%~1"=="" goto ARG_DONE
if /i "%~1"=="-o"        set "GRADLE_OPTS_EXTRA=%GRADLE_OPTS_EXTRA% --offline" & goto ARG_NEXT
if /i "%~1"=="--offline" set "GRADLE_OPTS_EXTRA=%GRADLE_OPTS_EXTRA% --offline" & goto ARG_NEXT
set "GRADLE_OPTS_EXTRA=%GRADLE_OPTS_EXTRA% %~1"
:ARG_NEXT
shift
goto ARG_LOOP
:ARG_DONE

if exist "%MAW_DIR%\gradlew.bat" (
    echo ==^> 本体MODをビルド: %MAW_DIR% %GRADLE_OPTS_EXTRA%
    pushd "%MAW_DIR%"
    call gradlew.bat build %GRADLE_OPTS_EXTRA% %COMMON_FLAGS%
    if errorlevel 1 (
        popd
        exit /b 1
    )
    popd
) else (
    echo [skip] 本体MOD ソースが見つかりません: %MAW_DIR%
    echo        libs\local\ の既存jarで起動します。
)

echo ==^> addon runClient: %~dp0 %GRADLE_OPTS_EXTRA%
call gradlew.bat runClient %GRADLE_OPTS_EXTRA% %COMMON_FLAGS% -PmawSourceProject="%MAW_DIR%"
