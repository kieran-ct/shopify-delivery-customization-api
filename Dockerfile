# Dockerfile

# 1) Start from a Node.js image that includes build tools
FROM node:18-bullseye-slim

# 2) Create app directory
WORKDIR /app

# 3) Copy package manifests and install ALL deps
COPY package*.json ./
RUN npm install

# 4) Copy the rest of your source
COPY . .

# 5) Run your strip-script and build the Remix app
RUN node scripts/strip-import-assertions.js && npm run build

# 6) Tell EB the port to bind (server.js reads process.env.PORT)
ENV PORT=8080
EXPOSE 8080

# 7) Start your server
CMD ["npm", "start"]
