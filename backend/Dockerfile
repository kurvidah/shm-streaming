FROM oven/bun:canary AS base

# Set the working directory explicitly to /app
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install ffmpeg
RUN apt-get update && apt install ffmpeg -y && \
    ffmpeg -version && \
    ffprobe -version

# Install dependencies with bun
RUN bun install

# Expose port
EXPOSE 8080

# Make sure we're in the correct directory when running the app
# Use absolute path to be explicit and pass environment variables
CMD ["sh", "-c", "bun install && bun dev"]