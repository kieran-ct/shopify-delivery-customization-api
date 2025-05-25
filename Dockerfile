# Dockerfile

# 1) Use a Node.js image that includes build tools
FROM node:18-bullseye-slim

# 2) Set working directory
WORKDIR /app

# 3) Copy package manifests and lockfile
COPY package*.json ./
COPY package-lock.json ./

# 4) Install exact dependencies
RUN npm ci

# 5) Copy the rest of your application code
COPY . .

# 6) Build your Remix app (and strip import assertions)
RUN node scripts/strip-import-assertions.js && npm run build

# 7) Expose the port Elastic Beanstalk forwards to (8080)
ENV PORT=8080
EXPOSE 8080

# 8) Start your Express/Remix server
CMD ["npm", "start"]
