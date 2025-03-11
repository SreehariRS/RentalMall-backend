# Use a lightweight Node.js image
FROM node:alpine3.18

# Install curl and other utilities
RUN apk add --no-cache curl bash

# Set working directory
WORKDIR /app

# Update npm and install dependencies
COPY package.json package-lock.json ./
RUN npm install -g npm@11.2.0 && npm install && npm install -g nodemon ts-node typescript

# Install TypeScript type definitions
RUN npm install --save-dev @types/cors @types/morgan @types/cookie-parser

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the entire project
COPY . .

# Expose application port
EXPOSE 5000

# Health check with start period
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5000 || exit 1

# Start the application
CMD ["npm", "run", "start"]