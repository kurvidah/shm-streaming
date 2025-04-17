FROM oven/bun:latest as base

# Set the working directory explicitly to /app
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies with bun
RUN bun install

# Expose port
EXPOSE 3000

# Make sure we're in the correct directory when running the app
# Use absolute path to be explicit and pass environment variables
CMD ["bun", "--watch", "dev"]