FROM node:18

# Set working directory
WORKDIR /app

# Copy & Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Start the app
CMD ["node", "app.js"]