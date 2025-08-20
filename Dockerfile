FROM node:20-alpine

# Install curl and other utilities
RUN apk add --no-cache curl bash

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Install TypeScript type definitions
RUN npm install --save-dev @types/cors @types/morgan @types/cookie-parser

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the entire project
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose application port
EXPOSE 8080

# Start the application in production mode
CMD ["npm", "run", "start:prod"]