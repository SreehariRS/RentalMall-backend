# Use a lightweight Node.js image
FROM node:alpine3.18

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --only=production && npm install -g nodemon ts-node typescript

# Copy Prisma schema before running `prisma generate`
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application files, including .env
COPY . .

# Expose application port
EXPOSE 5000

# Health check to ensure server is running
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:5000 || exit 1

# Start the application
CMD ["npm", "run", "start"]
