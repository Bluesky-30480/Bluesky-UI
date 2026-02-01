@echo off
setlocal

cd /d "%~dp0"
pnpm --filter showcaser dev

endlocal