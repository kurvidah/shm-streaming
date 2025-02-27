#!/bin/bash

# Check if .env exists, if not, create it from .env.example
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Done! Please update your .env file with the correct database credentials."
fi

# Load environment variables from .env
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Set defaults if variables are missing
HOST=${HOST:-"127.0.0.1"}
PORT=${PORT:-"8000"}
DB_HOST=${DB_HOST:-"remote-database-host"}
DB_NAME=${DB_NAME:-"your_database"}
DB_USER=${DB_USER:-"your_user"}
DB_PASS=${DB_PASS:-"your_password"}

# Apply schema.sql
echo "Applying database schema to remote server..."
mysql -u"$DB_USER" -p"$DB_PASS" -h"$DB_HOST" "$DB_NAME" < db/schema.sql
echo "Schema applied!"

# Apply seed.sql
echo "Seeding remote database with sample data..."
mysql -u"$DB_USER" -p"$DB_PASS" -h"$DB_HOST" "$DB_NAME" < db/seed.sql
echo "Database seeded!"

# Start PHP built-in server
echo "Starting PHP server on http://$HOST:$PORT"
php -S "$HOST:$PORT" -t public