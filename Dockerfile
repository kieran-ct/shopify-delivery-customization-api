# Dockerfile

# Use Debian‐slim so npm install works without extra build-tool setup
FROM node:18-bullseye-slim

# Create app directory
WORKDIR /app

# Install only production dependencies; build tooling already present in this image
COPY package*.json ./
RUN npm install --production

# Copy the rest of your source
COPY . .

# Strip import assertions and build your Remix app
RUN node scripts/strip-import-assertions.js && npm run build

# Tell Elastic Beanstalk which port to bind; server.js uses process.env.PORT
ENV PORT=8080
EXPOSE 8080

# Start your server
CMD ["npm", "start"]
