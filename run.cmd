@echo off
title Login Form - Dev Server
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo npm not found. Please install Node.js from https://nodejs.org/ and try again.
  pause
  exit /b 1
)

if not exist "frontend\node_modules" (
  echo Installing frontend dependencies...
  cd frontend
  call npm install
  cd ..
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

echo Starting frontend dev server...
echo Start the API separately with: npm run backend
call npm run dev
pause
