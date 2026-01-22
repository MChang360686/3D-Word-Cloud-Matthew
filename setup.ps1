# setup.ps1 - Launch backend (FastAPI) and frontend (React) in separate windows

# -----------------------------
# Configuration
# -----------------------------
$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$FrontendDir = Join-Path $RootDir "frontend/wordcloud-3d"
$BackendDir = Join-Path $RootDir "backend"
$VenvDir = ".venv"

Write-Host "Setting up 3D Word Cloud project..."

# -----------------------------
# Create Python virtual environment if it doesn't exist
# -----------------------------
if (-Not (Test-Path $VenvDir)) {
    Write-Host "Creating Python virtual environment..."
    python -m venv $VenvDir
}

# -----------------------------
# Install backend dependencies
# -----------------------------
$Activate = Join-Path $VenvDir "\Scripts\Activate.ps1"
if (-Not (Test-Path $Activate)) {
    Write-Error "venv activation script not found. Exiting."
    exit 1
}

Write-Host "Activating virtual environment for installation..."
& $Activate

Write-Host "Installing backend dependencies..."
pip install --upgrade pip
$RequirementsFile = Join-Path $BackendDir "requirements.txt"
if (Test-Path $RequirementsFile) {
    pip install -r $RequirementsFile
} else {
    Write-Host "requirements.txt not found in backend directory."
}

# -----------------------------
# Install frontend dependencies
# -----------------------------
Write-Host "Installing frontend dependencies..."
if (Test-Path $FrontendDir) {
    npm install --prefix $FrontendDir
} else {
    Write-Error "Frontend directory not found. Exiting."
    exit 1
}

# -----------------------------
# Start backend in a new window (auto-activate venv and run FastAPI)
# -----------------------------
Write-Host "Starting backend in a new window..."
$BackendCommand = "cd '$BackendDir'; `& '$VenvDir\Scripts\Activate.ps1'; uvicorn main:app --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $BackendCommand

# -----------------------------
# Start frontend in a new window
# -----------------------------
Write-Host "Starting frontend in a new window..."
$FrontendCommand = "cd '$FrontendDir'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $FrontendCommand

Write-Host ""
Write-Host "Backend and frontend launched in separate windows."
Write-Host "Check each window for logs. Press CTRL+C in each to stop the servers."
