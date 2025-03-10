FROM node:alpine3.18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first to optimize caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all remaining application files
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]
