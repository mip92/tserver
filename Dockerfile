# Простой Dockerfile для NestJS
FROM node:22-alpine

# Устанавливаем зависимости
RUN apk add --update --no-cache openssl

WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая devDependencies)
RUN npm ci --production=false --no-audit --no-fund --prefer-offline --no-optional

# Копируем исходный код
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

EXPOSE 3000

# Команда запуска будет переопределена в docker-compose
CMD ["npm", "run", "start:dev"]

