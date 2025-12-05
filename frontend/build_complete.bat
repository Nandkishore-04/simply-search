@echo off
echo ========================================
echo Building Motorcycle Parts Inventory
echo Self-Contained Desktop Application
echo ========================================
echo.

REM Step 1: Build Backend Executable
echo [1/3] Building backend executable...
cd ..\backend
python build_backend.py
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed!
    pause
    exit /b 1
)
echo.

REM Step 2: Build Frontend React App
echo [2/3] Building frontend React app...
cd ..\frontend
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo.

REM Step 3: Package Electron App with Backend
echo [3/3] Packaging Electron application...
call npm run electron:build:win
if %errorlevel% neq 0 (
    echo ERROR: Electron packaging failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo BUILD COMPLETE!
echo ========================================
echo.
echo Installer location: frontend\dist\
echo.
dir dist\*.exe
echo.
pause
