@echo off
echo ==============================================
echo   Iniciando Servidor Local - Fusion Culinaria
echo ==============================================
echo.
echo Mantenga esta ventana abierta.
echo.
IF NOT EXIST "node_modules\" (
    echo Instalando dependencias...
    call npm install
)
echo Abriendo servidor...
call npx -y http-server . -c-1 -o
pause
