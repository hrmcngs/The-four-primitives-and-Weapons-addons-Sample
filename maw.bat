@echo off
setlocal
node "%~dp0scripts\run-command.mjs" %*
exit /b %errorlevel%
