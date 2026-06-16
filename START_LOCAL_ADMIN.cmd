@echo off
setlocal
cd /d "%~dp0"
call npm install
call npm run setup:local
call npx prisma generate
call npm run doctor:admin
call npm run dev
