# Development Dockerfile with volume support
FROM node:22-alpine

# Install system dependencies
RUN apk add --update --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci --production=false --no-audit --no-fund --prefer-offline --no-optional

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 4000

# Start command will be overridden in docker-compose
CMD ["npm", "run", "start:dev"]

