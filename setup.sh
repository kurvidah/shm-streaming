#!/bin/bash

# Streaming App Setup Script for Linux
# This script sets up the streaming application environment

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Streaming App Setup...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo -e "${YELLOW}Please log out and log back in to apply Docker group changes.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Installing Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Ensure Docker daemon is running
if ! pgrep -x "dockerd" > /dev/null; then
    echo -e "${YELLOW}Docker daemon is not running. Starting Docker daemon...${NC}"
    sudo systemctl start docker
    echo -e "${GREEN}Docker daemon started.${NC}"
fi

# Stop the Docker Compose stack if it is already running
if docker-compose ps | grep -q "Up"; then
    echo -e "${YELLOW}Stopping the running Docker Compose stack...${NC}"
    docker-compose down
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}.env file created. Please edit it with your configuration.${NC}"
fi

# Create necessary directories
mkdir -p db frontend/src/components frontend/src/pages frontend/src/context backend/media

# Remove existing Docker volume if it exists
if docker volume ls | grep -q "shm-streaming_mariadb_data"; then
    echo -e "${YELLOW}Removing existing Docker volume shm-streaming_mariadb_data...${NC}"
    docker volume rm shm-streaming_mariadb_data
fi

# Check if database schema and seed files exist
if [ ! -f db/schema.sql ] || [ ! -f db/seed.sql ]; then
    echo -e "${YELLOW}Please place your database schema.sql and seed.sql files in the database directory.${NC}"
    echo -e "${YELLOW}Press Enter to continue once you've added the files...${NC}"
    read
fi

# Build and start the containers
echo -e "${GREEN}Building and starting containers...${NC}"
docker-compose up -d --build

echo -e "${GREEN}Setup complete! Your SHM Streaming app is now running.${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}Backend API: http://localhost:8000/api/${NC}"
echo -e "${GREEN}Admin panel: http://localhost:8000/admin/${NC}"

exit 0

