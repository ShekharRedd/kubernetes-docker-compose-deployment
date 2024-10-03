# Use Node.js for building and serving React app
FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Expose frontend port (e.g., 3000 for development)
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]