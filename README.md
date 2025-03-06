# SHM-streaming

---

# Project Setup

This project uses **Docker** to containerize a PHP application with a MySQL database. It includes automated setup scripts to manage environment variables, MySQL schema, seed data, and the container lifecycle.

---

## Prerequisites

Before setting up the project, ensure you have the following tools installed:

- [Docker](https://www.docker.com/products/docker-desktop) (with Docker Compose)
- [Git](https://git-scm.com/downloads)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Kurvidah/shm-streaming.git
cd shm-streaming
```

### 2. Configure `.env` file

The project uses a `.env` file for configuration. If the `.env` file does not exist, the setup script will automatically copy the `.env.example` file and prompt you to update it.

#### Example `.env` content:

```ini
DB_HOST=db
DB_NAME=mydatabase
DB_USER=myuser
DB_PASS=mypassword
DB_ROOT_PASS=rootpassword

PORT=8080
PMA_PORT=8081
```

- **DB_HOST**: MySQL container name (usually `db`)
- **DB_NAME**: Database name (e.g., `mydatabase`)
- **DB_USER**: MySQL user for the application
- **DB_PASS**: Password for the MySQL user
- **DB_ROOT_PASS**: Root password for MySQL
- **PORT**: The port on which the PHP app will run (default: `8080`)
- **PMA_PORT**: The port on which phpMyAdmin will be accessible (default: `8081`)

You can manually edit the `.env` file or use the provided `setup.sh` or `setup.bat` to automatically copy it from `.env.example`.

### 3. Run the setup script

#### For **Linux/macOS**:
Use the `setup.sh` script to start the project:

```bash
chmod +x setup.sh
./setup.sh
```

#### For **Windows**:
Run the `setup.bat` script by double-clicking it or executing it in Command Prompt:

```cmd
setup.bat
```

The script will:

- **Check if Docker is running**.
- **Create the `.env` file** from `.env.example` if it doesn't already exist.
- **Stop and remove any existing containers**.
- **Clear the MySQL data volume**.
- **Rebuild and start the containers**.
- **Show the URLs** for accessing the app and phpMyAdmin.

---

## Containerized Services

### 1. **PHP Application**

Once the containers are up and running, the PHP app will be available at:

```
http://localhost:8080
```

### 2. **phpMyAdmin**

phpMyAdmin will be available for managing the MySQL database at:

```
http://localhost:8081
```

---

## Database Setup

The MySQL container will automatically:

1. **Create the database** from the `schema.sql` file.
2. **Populate it with seed data** from the `seed.sql` file.

Both the `schema.sql` and `seed.sql` files are located in the `db/` directory and are executed when the MySQL container starts for the first time.

---

## Troubleshooting

### Docker is not running

Ensure that **Docker Desktop** is running on your machine. You can verify this by running the following command:

```bash
docker info
```

If Docker is not running, start Docker Desktop and try running the setup script again.

### Containers are not starting correctly

To troubleshoot, view the logs of a specific container by running:

```bash
docker-compose logs <container_name>
```

Replace `<container_name>` with the name of the container, e.g., `mysql_db` or `php_app`.

---

## Customizing the Setup

You can modify the following files to change the default configuration:

- **`docker-compose.yml`**: Modify this file to adjust services, volumes, and other settings.
- **`db/schema.sql`**: Add or modify database schema and table definitions.
- **`db/seed.sql`**: Customize initial data inserted into the database.

---

## Stopping the Containers

To stop and remove the containers, run the following:

```bash
docker-compose down
```

---

## Contributing

If you'd like to contribute to the project, feel free to fork the repository and submit pull requests. Please make sure your code passes the basic tests and adheres to the project’s coding standards.

---