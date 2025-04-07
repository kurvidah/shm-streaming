#!/bin/sh

echo "Waiting for MariaDB at $DB_HOST..."

until mariadb -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" "$DB_NAME"; do
  echo "MariaDB is unavailable - sleeping"
  sleep 2
done

echo "MariaDB is up - running Django commands"

python manage.py migrate
python manage.py runserver 0.0.0.0:8000