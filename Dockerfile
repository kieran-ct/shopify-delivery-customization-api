# Dockerfile

FROM node:18-bullseye-slim
WORKDIR /app

# Copy package files and lockfile
COPY package*.json ./
COPY package-lock.json ./

# Install exactly what's in the lockfile
RUN npm ci

# Copy the rest of the source
COPY . .

# Build the Remix app
RUN node scripts/strip-import-assertions.js && npm run build

# Bind to the EB port
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
