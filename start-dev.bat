@echo off
echo Starting Job Portal Development Environment...
echo.

echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173 (or next available port)
echo.
pause