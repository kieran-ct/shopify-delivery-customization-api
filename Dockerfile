# Dockerfile

# 1) Base image with build tools
FROM node:18-bullseye-slim

# 2) Set working directory
WORKDIR /app

# 3) Copy manifests
COPY package*.json ./
COPY package-lock.json ./

# 4) Install all dependencies, ignoring peer-dep errors
RUN npm ci

# 5) Copy source
COPY . .

# 6) Build the Remix app
RUN node scripts/strip-import-assertions.js && npm run build

# 7) Listen on the EB port
ENV PORT=8080
EXPOSE 8080

# 8) Start the server
CMD ["npm", "start"]
