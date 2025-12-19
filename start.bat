@echo off
echo Starting Task Manager Pro...
echo.

echo Killing any existing processes on port 8000...
netstat -ano | findstr :8000 > nul
if %errorlevel% == 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /f /pid %%a > nul 2>&1
)

echo Starting backend server...
cd backend
start "Backend" cmd /k "npm run dev"

timeout /t 3 > nul

echo Starting frontend development server...
cd ..\client
start "Frontend" cmd /k "npm run dev"

echo.
echo Task Manager Pro is starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
pause