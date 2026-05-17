@echo off
REM 本体MOD (The four primitives and Weapons) の jar を用意し直してから
REM addon の runClient を実行する (フルフロー)
REM
REM 本体MOD の jar は scripts\fetch-maw-jar.bat が自動で用意する:
REM   ローカルにソースがあればビルド / 無ければ GitHub から clone してビルド
REM
REM 使い方:
REM   run_client.bat                  通常実行（本体MODを毎回ビルドし直す）
REM   run_client.bat --offline        オフライン (clone しない)
REM   run_client.bat -o               同上
REM
REM 本体MODソースの場所を明示する場合: set MAW_DIR=C:\path\to\main-mod
setlocal
cd /d "%~dp0"

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

echo ==^> 本体MOD jar を準備 %GRADLE_OPTS_EXTRA%
call "%~dp0scripts\fetch-maw-jar.bat" --force %GRADLE_OPTS_EXTRA%
if errorlevel 1 exit /b 1

echo ==^> addon runClient %GRADLE_OPTS_EXTRA%
call gradlew.bat runClient %GRADLE_OPTS_EXTRA% %COMMON_FLAGS%
