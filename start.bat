@echo off
echo ==========================================
echo   TaskFlow SQLite - Quick Start
echo ==========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [1/3] Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
)

REM Check if database exists
if not exist "backend\prisma\dev.db" (
    echo [2/3] Setting up database...
    cd backend
    npx prisma generate
    npx prisma migrate dev --name init
    npx prisma db seed
    cd ..
)

echo [3/3] Starting servers...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001/api
echo.
echo Login: demo@taskflow.app / demo123
echo.

REM Start both servers
start "Backend" cmd /k "cd backend && npm run start:dev"
timeout /t 3 >nul
start "Frontend" cmd /k "cd frontend && npm run dev"

echo TaskFlow is starting...
echo.
pause
