# Use a lightweight Node image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if applicable)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port (React/Next.js defaults to 3000 for development)
EXPOSE 3000

# Run the frontend application
CMD ["npm", "run", "dev"]