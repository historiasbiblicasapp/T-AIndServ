@echo off
cd /d "C:\src\Projetos\T&AIndServ\backend"
echo Starting server... > server.log 2>&1
node ./node_modules/tsx/dist/cli.mjs src/server.ts >> server.log 2>&1
