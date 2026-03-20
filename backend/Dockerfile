# Use lightweight Node image based on Alpine
FROM node:20-alpine

WORKDIR /app

# Install dependencies (use netcat-openbsd for network checks)
RUN apk update && apk add --no-cache netcat-openbsd bash curl

# Download the `wait-for-it` script
RUN curl -sSL https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh -o /usr/local/bin/wait-for-it && \
    chmod +x /usr/local/bin/wait-for-it

# Install project dependencies (production mode)
COPY package*.json ./
RUN npm install --production

# Copy the source code into the container
COPY . .

# Expose the port that your app will use
EXPOSE 3000

# Run the application, wait for Redis, then start the app
CMD ["wait-for-it", "redis:6379", "--", "npm", "start"]