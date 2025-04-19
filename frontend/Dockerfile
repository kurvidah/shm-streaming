FROM oven/bun:canary AS base

# Set the working directory explicitly to /app
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies with bun
RUN bun install

# Expose port
EXPOSE 3000

# Force bun install before running the app
CMD ["sh", "-c", "bun install && bun --watch dev"]
