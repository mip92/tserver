# 🚀 Quick Start - Production

## Быстрый запуск production окружения

### 1. Создайте .env файл

```bash
cat > .env << EOF
POSTGRES_USER=tattoo
POSTGRES_PASSWORD=tattoo_prod_pass_secure
POSTGRES_DB=tattoo_db
DATABASE_URL=postgresql://tattoo:tattoo_prod_pass_secure@database:5432/tattoo_db
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
EOF
```

### 2. Запустите production

```bash
# Автоматический запуск с проверками
./start-production.sh

# Или вручную
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Проверьте статус

```bash
# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Логи
docker-compose -f docker-compose.prod.yml logs -f
```

### 4. Тест API

```bash
# Health check
curl http://localhost:3000/health

# GraphQL
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name } } }"}'
```

## Структура production окружения

```
docker-compose.prod.yml
├── database (PostgreSQL) - порт 5432
└── backend (NestJS) - порт 3000
```

## Команды управления

```bash
# Запуск
docker-compose -f docker-compose.prod.yml up -d

# Остановка
docker-compose -f docker-compose.prod.yml down

# Перезапуск
docker-compose -f docker-compose.prod.yml restart

# Логи
docker-compose -f docker-compose.prod.yml logs -f [service]
```

## Проблемы?

1. **База данных не запускается** → Проверьте .env файл
2. **Backend не подключается** → Проверьте DATABASE_URL
3. **Миграции не применяются** → Запустите вручную: `docker exec -it tattoo-backend-prod npx prisma migrate deploy`
