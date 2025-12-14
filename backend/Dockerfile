
FROM node:20-slim

# Use a consistent working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create a non-root user for better security
RUN groupadd -r app && useradd -r -g app app || true

# Install production dependencies only and clean apt cache to reduce image size
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Mudei para 'npm install' normal para ser menos arriscado agora
RUN npm install

# Copy application source
COPY . .

# Run as non-root user
USER app

# Expose the application port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]