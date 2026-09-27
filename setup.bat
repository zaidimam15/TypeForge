@echo off
echo ========================================
echo     TypeForge - Setup Script
echo ========================================
echo.

echo [1/4] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Server npm install failed.
    pause
    exit /b 1
)

echo.
echo [2/4] Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Client npm install failed.
    pause
    exit /b 1
)

echo.
echo [3/4] Setup complete!
echo.
echo ========================================
echo     NEXT STEPS:
echo ========================================
echo.
echo 1. Edit server\.env with your MongoDB URI:
echo    MONGODB_URI=mongodb://localhost:27017/typeforge
echo    (or your MongoDB Atlas connection string)
echo.
echo 2. Seed the database (optional but recommended):
echo    cd server ^&^& npm run seed
echo.
echo 3. Start the backend:
echo    cd server ^&^& npm run dev
echo.
echo 4. Start the frontend (new terminal):
echo    cd client ^&^& npm run dev
echo.
echo 5. Open: http://localhost:5173
echo.
echo ========================================
pause
