@echo off
REM 本体MOD は今ある jar のまま、addon の runClient だけを実行する (高速)
REM
REM jar がまだ無い場合だけ scripts\fetch-maw-jar.bat が用意する。
REM jar が既にあれば何もせず即起動する。
REM
REM 使い方:
REM   run_quick.bat                  通常実行
REM   run_quick.bat --offline        オフライン実行
REM   run_quick.bat -o               同上
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

echo ==^> 本体MOD jar を確認 %GRADLE_OPTS_EXTRA%
call "%~dp0scripts\fetch-maw-jar.bat" %GRADLE_OPTS_EXTRA%
if errorlevel 1 exit /b 1

echo ==^> addon runClient (本体MODは再ビルドしない) %GRADLE_OPTS_EXTRA%
call gradlew.bat runClient %GRADLE_OPTS_EXTRA% %COMMON_FLAGS%
