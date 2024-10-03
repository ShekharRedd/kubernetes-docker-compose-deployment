# Use Node.js base image
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose backend port (e.g., 5000)
EXPOSE 5000

# Run the application
CMD ["npm", "start"]