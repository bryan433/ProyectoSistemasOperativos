@echo off
setlocal

chcp 65001 >nul

set "ROOT=%~dp0"

echo.
echo ==========================================
echo  Proyecto Sistemas Operativos - Arranque
echo ==========================================
echo.

where docker >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Docker no esta instalado o no esta en el PATH.
  exit /b 1
)

where docker-compose >nul 2>nul
if errorlevel 1 (
  echo [ERROR] docker-compose no esta instalado o no esta en el PATH.
  exit /b 1
)

docker info >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Docker no esta corriendo o no hay permisos para usar el daemon.
  echo Abre Docker Desktop y vuelve a ejecutar este archivo.
  exit /b 1
)

call :compose_up "servidor-3-datos" "--build"
if errorlevel 1 exit /b 1

echo.
echo Esperando 15 segundos para que Patroni, PostgreSQL y db-init preparen las bases...
timeout /t 15 /nobreak >nul

call :compose_up "servidor-4-respaldo" ""
if errorlevel 1 exit /b 1

call :compose_up "servidor-1-principal" "--build"
if errorlevel 1 exit /b 1

call :compose_up "servidor-2-replica" "--build"
if errorlevel 1 exit /b 1

call :compose_up "load-balancer" ""
if errorlevel 1 exit /b 1

echo.
echo Verificando endpoints principales...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { (Invoke-WebRequest -UseBasicParsing 'http://localhost/health' -TimeoutSec 10).Content.Trim() } catch { 'ERROR localhost/health: ' + $_.Exception.Message }"
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { 'HTTP localhost: ' + (Invoke-WebRequest -UseBasicParsing 'http://localhost' -TimeoutSec 10).StatusCode } catch { 'ERROR localhost: ' + $_.Exception.Message }"
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { 'HTTP HAProxy DB: ' + (Invoke-WebRequest -UseBasicParsing 'http://localhost:7000' -TimeoutSec 10).StatusCode } catch { 'ERROR HAProxy DB: ' + $_.Exception.Message }"

echo.
echo ==========================================
echo  Proyecto levantado
echo ==========================================
echo App balanceada:       http://localhost
echo Servidor 1 directo:   http://localhost:5173
echo Firewall servidor 1:  http://localhost:8081
echo Firewall servidor 2:  http://localhost:8082
echo HAProxy base datos:   http://localhost:7000
echo.
echo Para instrucciones manuales y acceso a BD:
echo GUIA_EJECUCION_MANUAL.md
echo.

exit /b 0

:compose_up
set "DIR=%~1"
set "ARGS=%~2"
echo.
echo [INFO] Levantando %DIR%...
pushd "%ROOT%%DIR%" >nul
if errorlevel 1 (
  echo [ERROR] No se pudo entrar a %ROOT%%DIR%.
  exit /b 1
)

if "%ARGS%"=="" (
  docker-compose up -d
) else (
  docker-compose up -d %ARGS%
)

set "CODE=%ERRORLEVEL%"
popd >nul

if not "%CODE%"=="0" (
  echo [ERROR] Fallo docker-compose en %DIR%.
  exit /b %CODE%
)

echo [OK] %DIR% iniciado.
exit /b 0
