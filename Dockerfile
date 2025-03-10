FROM node:alpine3.18
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package.json package-lock.json ./

# Install dependencies including ts-node and nodemon
RUN npm install && npm install -g nodemon ts-node typescript && npx prisma generate

# Copy the rest of the application files
COPY . .

# Expose the port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]
