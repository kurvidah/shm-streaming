FROM python:3.11-slim

WORKDIR /app

# Install system dependencies including pkg-config
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    pkg-config \
    default-libmysqlclient-dev \
    python3-dev \
    mariadb-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Run migrations and start server
CMD ["/start.sh"]

