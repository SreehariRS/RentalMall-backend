# Use Node.js base image
FROM node:alpine3.18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json  ./
RUN npm install -g nodemon && npm install --only=production

# Copy remaining application files
COPY . .

# Run Prisma generate (only if using Prisma)
RUN npx prisma generate

# Expose port 5000
EXPOSE 5000

# Start the app
CMD ["npm", "run", "start"]
