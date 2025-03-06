@echo off
setlocal enabledelayedexpansion

echo Starting setup...

:: Check if .env exists, if not, copy from .env.example
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo Done! Please update your .env file with the correct database credentials.
)

:: Load environment variables from .env
for /f "tokens=1,2 delims==" %%A in ('type .env') do (
    set "%%A=%%B"
)

:: Check if Docker is running
echo Checking if Docker is running...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

:: Stop and remove existing containers
echo Stopping and removing existing containers...
docker-compose down

:: Remove only the volume used by the MySQL container
echo Removing MySQL data volume...
docker volume rm shm-streaming_shm_mysql_data

:: Start fresh containers
echo Starting fresh containers...
docker-compose up --build -d

:: Wait for containers to start
timeout /t 5 >nul

:: Show running containers
echo Running containers:
docker ps

:: Show URLs for the application and phpMyAdmin
echo Application is available at: http://localhost:%PORT%
echo phpMyAdmin is available at: http://localhost:%PMA_PORT%

echo Setup completed successfully!
pause