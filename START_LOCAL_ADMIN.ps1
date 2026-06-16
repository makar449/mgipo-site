Set-Location -LiteralPath $PSScriptRoot
npm install
npm run setup:local
npx prisma generate
npm run doctor:admin
npm run dev
