# Multi-stage Dockerfile for building and running the Shopify Remix app with Prisma and ensuring Polaris CSS is copied

# Stage 1: install dependencies, generate Prisma client, build app
FROM node:18-bullseye-slim AS builder
WORKDIR /app

# Copy package manifests and lockfile
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the source
COPY . .

# Build the Remix app (strip import assertions and run Remix build)
RUN node scripts/strip-import-assertions.js && npm run build

# Copy Polaris CSS into public build directory
RUN mkdir -p public/build && \
    cp node_modules/@shopify/polaris/build/esm/styles.css public/build/styles.css

# Stage 2: production image
FROM node:18-bullseye-slim
WORKDIR /app

# Copy only production modules and generated Prisma client
COPY --from=builder /app/node_modules ./node_modules

# Copy built app and public assets (including Polaris CSS)
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# Copy server and package.json for start
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/package.json ./package.json

# Bind to the EB port
ENV PORT=8080
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
