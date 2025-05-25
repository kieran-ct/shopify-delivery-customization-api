# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Strip import assertions & build
RUN node scripts/strip-import-assertions.js && npm run build

EXPOSE 3000
CMD ["npm", "start"]
