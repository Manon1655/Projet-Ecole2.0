# Setup script for Projet-Ecole2.0 dependencies
# Usage: Open PowerShell as Administrator and run: .\scripts\setup-environment.ps1

function Check-Command($cmd) {
    $proc = Get-Command $cmd -ErrorAction SilentlyContinue
    return $proc -ne $null
}

Write-Host "=== Projet-Ecole2.0 - Setup helper ===" -ForegroundColor Cyan

$hasJava = Check-Command java
$hasMvn = Check-Command mvn
$hasNpm = Check-Command npm

if (-not $hasJava) {
    Write-Host "Java n'est pas trouvé dans le PATH." -ForegroundColor Yellow
    Write-Host "Installez Java 17+ et ajoutez-le au PATH, puis relancez ce script." -ForegroundColor White
}
else {
    java -version
}

if (-not $hasMvn) {
    Write-Host "Maven n'est pas trouvé dans le PATH." -ForegroundColor Yellow
    Write-Host "Installez Maven ou utilisez le Maven Wrapper si disponible, puis relancez ce script." -ForegroundColor White
}
else {
    mvn -version
}

if (-not $hasNpm) {
    Write-Host "Node/npm n'est pas trouvé dans le PATH." -ForegroundColor Yellow
    Write-Host "Installez Node.js (recommandé LTS) puis relancez ce script." -ForegroundColor White
}
else {
    npm -v
}

if ($hasNpm) {
    Write-Host "\nInstalling frontend dependencies (root)..." -ForegroundColor Green
    Push-Location -Path (Join-Path $PSScriptRoot "..")
    npm install
    Pop-Location
}

if ($hasMvn) {
    Write-Host "\nBuilding backend (api)..." -ForegroundColor Green
    Push-Location -Path (Join-Path $PSScriptRoot "..\api")
    mvn clean install -DskipTests
    Pop-Location
}

Write-Host "\nSetup script finished. If some tools were missing, please install them and re-run this script." -ForegroundColor Cyan
