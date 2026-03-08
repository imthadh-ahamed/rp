@echo off
REM Start the Roadmap Generation API Server
REM This script sets up the Python path and starts uvicorn

echo ========================================
echo Starting Roadmap Generation API Server
echo ========================================
echo.

cd /d "%~dp0"
set PYTHONPATH=%CD%

echo Python Path: %PYTHONPATH%
echo Starting server on http://127.0.0.1:8000
echo.
echo Press CTRL+C to stop the server
echo ========================================
echo.

python -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
