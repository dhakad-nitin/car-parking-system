# Use Node.js 18 Alpine as the base image
# Alpine is a lightweight Linux distribution that helps keep the image size small
FROM node:18-alpine

# Set the working directory inside the container
# All subsequent commands will be run from this directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists) to the working directory
# This is done before copying the rest of the code to leverage Docker's cache
COPY package*.json ./

# Install all dependencies (including dev dependencies)
# This will create the node_modules directory
RUN npm install

# Copy all the source code from the current directory to the working directory
# This includes all files and folders in your project
COPY . .

# Expose port 3000 to the host machine
# This is the port your NestJS application runs on
EXPOSE 3000

# Command to start the application
# This will run your application in development mode with hot-reload
CMD ["npm", "run", "start"]