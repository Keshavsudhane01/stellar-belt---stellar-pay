# Script to initialize git and push to the repository
# Usage: .\scripts\push.ps1 "Your commit message"

param (
    [string]$CommitMessage = "Upgrade StellarPay to Level 4"
)

$RepoUrl = "https://github.com/Keshavsudhane01/stellar-belt---stellar-pay"

Write-Host "Initializing git..." -ForegroundColor Cyan
git init

Write-Host "Adding files..." -ForegroundColor Cyan
git add .

Write-Host "Committing changes..." -ForegroundColor Cyan
git commit -m $CommitMessage

Write-Host "Setting remote..." -ForegroundColor Cyan
git remote add origin $RepoUrl
git branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host "Done!" -ForegroundColor Green
