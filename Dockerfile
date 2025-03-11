# Use a lightweight Node.js image
FROM node:alpine3.18

# Set working directory
WORKDIR /app

# Install dependencies first
COPY package.json package-lock.json ./

RUN npm install && npm install -g nodemon ts-node typescript

# Install missing TypeScript type definitions
RUN npm install --save-dev @types/cors @types/morgan @types/cookie-parser

# ✅ Install curl inside the container
RUN apk add --no-cache curl

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
