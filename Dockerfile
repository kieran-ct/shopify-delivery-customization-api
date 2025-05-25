# Dockerfile

FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Build your Remix app
RUN node scripts/strip-import-assertions.js && npm run build

# Let EB know we listen on 8080
ENV PORT=8080
EXPOSE 8080

# Start the app; server.js reads process.env.PORT
CMD ["npm", "start"]
