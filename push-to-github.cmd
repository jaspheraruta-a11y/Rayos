@echo off
REM Push this project to GitHub: jaspheraruta-a11y/Rayos
REM Run this from the project root after installing Git.
REM You will be prompted for your GitHub password or PAT when pushing.

set REPO=https://github.com/jaspheraruta-a11y/Rayos.git

git --version >nul 2>&1
if errorlevel 1 (
    echo Git is not installed or not in PATH. Install from https://git-scm.com/download/win
    exit /b 1
)

if not exist .git (
    git init
    git config user.email "jaspheraruta@gmail.com"
    git config user.name "Jaspher Aruta"
)

git remote remove origin 2>nul
git remote add origin %REPO%
git add .
git status
git diff --cached --quiet 2>nul || git commit -m "Initial commit: login form with routes (CodeIgniter-style)"
git branch -M main
echo.
echo Pushing to GitHub. You may be asked for your username and password/token.
git push -u origin main

pause
