@echo off
echo ==========================================
echo   TaskFlow PORTFOLIO EDITION
echo   Full-Stack Demo avec SQLite
echo ==========================================
echo.

cd "%~dp0"

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Node.js n'est pas installe
    echo Telechargez-le sur: https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Installation des dependances backend...
cd backend
call npm install
if errorlevel 1 (
    echo [ERREUR] Installation backend echouee
    pause
    exit /b 1
)

echo [2/4] Generation Prisma + Database SQLite...
call npx prisma generate
call npx prisma migrate dev --name init --skip-generate
call npx prisma db seed

cd ..

echo [3/4] Installation des dependances frontend...
cd frontend
call npm install
if errorlevel 1 (
    echo [ERREUR] Installation frontend echouee
    pause
    exit /b 1
)

cd ..

echo [4/4] Demarrage des serveurs...
echo.
echo ==========================================
echo   🚀 TaskFlow Portfolio est demarre!
echo ==========================================
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔌 Backend:  http://localhost:3001/api
echo.
echo Identifiants demo:
echo   Email: demo@taskflow.app
echo   Password: demo123
echo.
echo Features a tester:
echo   ✨ Ouvrir 2 navigateurs pour voir le temps reel
echo   ⌨️  Appuyer sur "?" pour les raccourcis
echo   📊 Dashboard avec graphiques
echo   🎯 Drag & drop sur le Kanban
echo.
echo Appuyez sur une touche pour demarrer...
pause >nul

REM Start servers
start "Backend API" cmd /k "cd backend && npm run start:dev"
timeout /t 3 >nul
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Les serveurs demarrent dans de nouvelles fenetres...
echo.
timeout /t 5
echo ✅ C'est parti! Ouvrez http://localhost:3000
echo.
pause
