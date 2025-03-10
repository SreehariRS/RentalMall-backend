# Base image
FROM node:alpine3.18
WORKDIR /app

# Copy package files first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install && npm install -g nodemon ts-node typescript

# Copy the entire project, including the prisma folder
COPY . .

# Run Prisma generate
RUN npx prisma generate

# Expose the port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]
