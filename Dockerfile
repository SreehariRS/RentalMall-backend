FROM node:alpine3.18
WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json ./

# Install dependencies and install nodemon globally
RUN npm install && npm install -g nodemon

# Copy the rest of the files
COPY . .

# Expose the port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]
