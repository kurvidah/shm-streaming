# Use the Bun image as the base image
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /app

# Expose the port on which the API will listen
EXPOSE 3000

# Initialize the project
COPY bun.lockb package.json /app/
RUN bun install

# Run the server when the container launches
CMD ["bun", "dev"]