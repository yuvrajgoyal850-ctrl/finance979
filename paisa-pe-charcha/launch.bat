@echo off
title Paisa Pe Charcha - The Royal Financial Platform
color 0E

echo ========================================================
echo   PAISA PE CHARCHA (Paisa Pe Charcha)
echo   The Royal Indian Financial Intelligence Platform
echo ========================================================
echo.
echo Starting the local server on http://localhost:3000 ...
echo Opening your web browser...
echo.

cd /d "%~dp0"

start http://localhost:3000
node server.js

pause
