@echo off
echo ========================================
echo    SALES MANAGEMENT SYSTEM
echo ========================================
echo.

echo [1/4] Checking dependencies...
cd server
if not exist node_modules (
    echo Installing server dependencies...
    npm install
) else (
    echo Server dependencies OK
)

cd ../user
if not exist node_modules (
    echo Installing user frontend dependencies...
    npm install
) else (
    echo User frontend dependencies OK
)

echo.
echo [2/4] Seeding address data...
cd ../server
echo Running address data seed...
npm run seed-full-address-data

echo.
echo [3/4] Starting backend server...
start "Backend Server" cmd /k "cd /d %CD% && npm run dev"

echo.
echo [4/4] Starting user frontend...
cd ../user
start "User Frontend" cmd /k "cd /d %CD% && npm start"

echo.
echo ========================================
echo    SYSTEM STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo User Frontend: http://localhost:3000
echo Admin Frontend: http://localhost:3001 (if needed)
echo.
echo Press any key to exit...
pause > nul 