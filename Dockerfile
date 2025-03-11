# Use a lightweight Node.js image
FROM node:alpine3.18

# ✅ Install curl and other utilities
RUN apk add --no-cache curl bash

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies)
RUN npm install && npm install -g nodemon ts-node typescript

# Install missing TypeScript type definitions
RUN npm install --save-dev @types/cors @types/morgan @types/cookie-parser

# Copy Prisma schema before running `prisma generate`
COPY prisma ./prisma
RUN npx prisma generate

# Copy the entire project
COPY . .

# Expose application port
EXPOSE 5000

# ✅ Update Health Check (Now curl will be available)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:5000 || exit 1

# Start the application
CMD ["npm", "run", "start"]
