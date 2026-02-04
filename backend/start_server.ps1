# Start the Roadmap Generation API Server
# This script sets up the Python path and starts uvicorn

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Roadmap Generation API Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set working directory to backend folder
Set-Location $PSScriptRoot

# Set Python path to backend directory
$env:PYTHONPATH = $PSScriptRoot

Write-Host "Python Path: $env:PYTHONPATH" -ForegroundColor Yellow
Write-Host "Starting server on http://127.0.0.1:8000" -ForegroundColor Green
Write-Host ""
Write-Host "Press CTRL+C to stop the server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start uvicorn server
python -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
