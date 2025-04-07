@echo off
setlocal enabledelayedexpansion

echo Starting Streaming App Setup...

REM Check if Docker is installed
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Docker is not installed. Please install Docker Desktop for Windows.
    echo Visit: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker daemon is running
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Docker daemon is not running. Attempting to start it...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo Waiting for Docker daemon to start...
    timeout /t 30 >nul
    docker info >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to start Docker daemon. Please start it manually and rerun this script.
        pause
        exit /b 1
    )
    echo Docker daemon started successfully.
)

REM Stop and remove the Docker Compose stack if it is running
docker-compose ps >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Stopping and removing existing Docker Compose stack...
    docker-compose down >nul
    echo Existing Docker Compose stack stopped and removed.
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file from example...
    copy .env.example .env
    echo .env file created. Please edit it with your configuration.
)

REM Create necessary directories
mkdir db 2>nul
mkdir frontend\src\components 2>nul
mkdir frontend\src\pages 2>nul
mkdir frontend\src\context 2>nul
mkdir backend\media 2>nul

REM Delete Docker volume if it exists
docker volume inspect shm-streaming_mariadb_data >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Deleting existing Docker volume shm-streaming_mariadb_data...
    docker volume rm shm-streaming_mariadb_data >nul
    echo Docker volume shm-streaming_mariadb_data deleted.
)

REM Check if database schema and seed files exist
if not exist db\schema.sql (
    echo Please place your database schema.sql and seed.sql files in the database directory.
    echo Press any key to continue once you've added the files...
    pause >nul
)

REM Build and start the containers
echo Building and starting containers...
docker-compose up -d --build

# Update the output messages
echo Setup complete! Your SHM Streaming app is now running.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000/api/
echo Admin panel: http://localhost:8000/admin/

pause
exit /b 0

