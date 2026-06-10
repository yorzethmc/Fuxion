@echo off
echo ==============================================
echo   Iniciando Aplicacion React - Fusion Culinaria
echo ==============================================
echo.
echo Mantenga esta ventana abierta.
echo.
IF NOT EXIST "node_modules\" (
    echo Instalando dependencias (solo la primera vez)...
    call npm install
)
echo.
echo Abriendo servidor de desarrollo...
call npm run dev -- --open
pause
