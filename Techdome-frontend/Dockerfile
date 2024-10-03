# Use a more complete Node.js base image
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy all project files to the working directory
COPY . .

# Expose frontend port (3000 for development)
EXPOSE 3000

# Start the React app using npm
CMD ["npm", "start"]
