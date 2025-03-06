#!/bin/bash

echo "Starting setup..."

# Check if .env exists, if not, copy from .env.example
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Done! Please update your .env file with the correct database credentials."
fi

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

# Check if Docker is running
echo "Checking if Docker is running..."
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop and remove existing containers
echo "Stopping and removing existing containers..."
docker-compose down

# Remove only the volume used by the MySQL container
echo "Removing MySQL data volume..."
docker volume rm "shm_mysql_data" 2>/dev/null || true

# Start fresh containers
echo "Starting fresh containers..."
docker-compose up --build -d

# Wait for containers to start
sleep 5

# Show running containers
echo "Running containers:"
docker ps

# Show URLs for the application and phpMyAdmin
echo "Application is available at: http://localhost:${PORT}"
echo "phpMyAdmin is available at: http://localhost:${PMA_PORT}"

echo "Setup completed successfully!"