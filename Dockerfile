# Multi-stage build для NestJS backend
FROM node:22-alpine AS builder

# Устанавливаем зависимости для сборки
RUN apk add --update --no-cache openssl

WORKDIR /app

# Копируем файлы зависимостей ПЕРВЫМИ для лучшего кеширования
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем ВСЕ зависимости (включая devDependencies для сборки)
RUN npm ci --production=false --no-audit --no-fund --prefer-offline --no-optional

# Копируем исходный код ПОСЛЕ установки зависимостей
COPY . .

# Генерируем Prisma клиент и собираем приложение
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:22-alpine AS production

# Устанавливаем только необходимые пакеты
RUN apk add --update --no-cache openssl

WORKDIR /app

# Копируем package.json для production зависимостей
COPY package*.json ./

# Устанавливаем ТОЛЬКО production зависимости
RUN npm ci --only=production --no-audit --no-fund --prefer-offline --no-optional

# Копируем собранное приложение из builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Ограничиваем память для Node.js
ENV NODE_OPTIONS="--max-old-space-size=256"

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
