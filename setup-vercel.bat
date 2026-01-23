@echo off
echo =====================================
echo    VERCEL DEPLOY HELPER SCRIPT
echo =====================================
echo.

echo [1/5] Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not installed!
    echo Download from: https://nodejs.org
    pause
    exit
)
echo ✅ Node.js installed
echo.

echo [2/5] Installing Vercel CLI...
call npm install -g vercel
echo ✅ Vercel CLI installed
echo.

echo [3/5] Checking project files...
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Make sure you're in the project directory
    pause
    exit
)
if not exist "server.js" (
    echo ERROR: server.js not found!
    pause
    exit
)
if not exist "playlist.js" (
    echo ERROR: playlist.js not found!
    pause
    exit
)
if not exist "vercel.json" (
    echo ERROR: vercel.json not found!
    pause
    exit
)
echo ✅ All required files found
echo.

echo [4/5] Installing dependencies...
call npm install
echo ✅ Dependencies installed
echo.

echo [5/5] Ready to deploy!
echo.
echo =====================================
echo   NEXT STEPS:
echo =====================================
echo 1. Run: vercel login
echo 2. Run: vercel
echo 3. Follow the prompts
echo 4. Copy your deployment URL
echo.
echo Press any key to start deployment...
pause > nul

echo.
echo Starting Vercel login...
call vercel login

echo.
echo Starting deployment...
call vercel

echo.
echo =====================================
echo   DEPLOYMENT COMPLETE!
echo =====================================
echo.
echo Copy your URL and paste it in Roblox:
echo local API_URL = "https://your-url.vercel.app/api/playlist"
echo.
pause