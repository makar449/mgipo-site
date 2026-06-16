$ErrorActionPreference = "Stop"
$repo = "https://github.com/makar449/mgipo-site.git"

git init
git branch -M main
git config user.name "makar449"
git config user.email "makar449@users.noreply.github.com"
git remote remove origin 2>$null
git remote add origin $repo
git add -A
git commit -m "v8.11 fix utf8 static pages speed" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "No new commit or commit already exists" }
git push -u origin main --force
