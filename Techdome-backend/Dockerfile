# Use an official Node.js base image from the LTS version
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application source code to the working directory
COPY . .

# Expose the port that the app listens on (e.g., 5000)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]