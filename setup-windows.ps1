$ErrorActionPreference = "Stop"

Write-Host "Checking project folder..." -ForegroundColor Cyan
if (!(Test-Path ".\package.json")) {
  throw "package.json not found. Open PowerShell inside the project root folder."
}

$packageRaw = Get-Content ".\package.json" -Raw
if ($packageRaw -notmatch "institutional-qualification-next-v5") {
  throw "Wrong package.json. This folder is not institutional-qualification-next-v5 or it is mixed with another project. Delete the folder and extract the archive again."
}

if (!(Test-Path ".\.env.local")) {
  if (Test-Path ".\.env.example") {
    Copy-Item ".\.env.example" ".\.env.local"
    Write-Host "Created .env.local from .env.example" -ForegroundColor Green
  } elseif (Test-Path ".\env.example.txt") {
    Copy-Item ".\env.example.txt" ".\.env.local"
    Write-Host "Created .env.local from env.example.txt" -ForegroundColor Green
  } else {
    throw "No .env.example or env.example.txt found."
  }
} else {
  Write-Host ".env.local already exists" -ForegroundColor Yellow
}

Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

Write-Host "\nNext steps:" -ForegroundColor Cyan
Write-Host "1) Run: npm run admin:hash -- \"my-strong-admin-password-2026\""
Write-Host "2) Put the generated hash into ADMIN_PASSWORD_HASH inside .env.local"
Write-Host "3) If Docker Desktop is installed: docker compose up -d"
Write-Host "4) Run: npm run db:push"
Write-Host "5) Run: npm run db:seed"
Write-Host "6) Run: npm run dev"
