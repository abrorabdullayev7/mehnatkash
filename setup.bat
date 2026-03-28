@echo off
echo ========================================
echo UZUM E-commerce Setup
echo ========================================
echo.

echo 1. Checking Node.js...
node --version

echo.
echo 2. Installing backend dependencies...
cd backend
call npm install

echo.
echo 3. Seeding database...
call node seed.js

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Open Terminal 1: cd backend && npm start
echo 2. Open Terminal 2: npx http-server
echo.
echo Frontend: http://localhost:8000
echo Backend:  http://localhost:5000
echo.
echo Test login:
echo Email: admin@uzum.uz
echo Password: admin123
echo.
pause
