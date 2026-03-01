@echo off
REM PostgreSQL Database Setup Script for Windows
REM Usage: Run this script to create the PostgreSQL database and tables

setlocal enabledelayedexpansion

REM Configuration
set POSTGRES_USER=postgres
set POSTGRES_PORT=5432
set POSTGRES_HOST=localhost

echo.
echo ============================================================
echo PostgreSQL Database Setup Script
echo ============================================================
echo.

REM Check if psql is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: psql command not found. 
    echo Please ensure PostgreSQL is installed and added to PATH.
    pause
    exit /b 1
)

echo Attempting to connect to PostgreSQL...
echo User: %POSTGRES_USER%
echo Host: %POSTGRES_HOST%
echo Port: %POSTGRES_PORT%
echo.

REM Check connection
psql -U %POSTGRES_USER% -h %POSTGRES_HOST% -p %POSTGRES_PORT% -tc "SELECT 1" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Could not connect to PostgreSQL.
    echo Make sure:
    echo - PostgreSQL is running
    echo - User '%POSTGRES_USER%' exists
    echo - Password is correct
    echo.
    echo If you need to provide a password, set it as an environment variable:
    echo   set PGPASSWORD=your_password
    echo.
    pause
    exit /b 1
)

echo ✓ Connection successful!
echo.
echo Running SQL setup script...
echo.

REM Run SQL setup script
psql -U %POSTGRES_USER% -h %POSTGRES_HOST% -p %POSTGRES_PORT% -f postgresql-setup.sql

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Database setup failed.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo ✓ Database setup complete!
echo ============================================================
echo.
echo Next steps:
echo 1. Copy backend\.env.example to backend\.env
echo 2. Update database credentials in backend\.env if needed
echo 3. Run: cd backend && npm install
echo 4. Run: npm start
echo.
pause
