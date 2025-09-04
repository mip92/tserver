# 🚀 Production Setup Guide

## Проблема

В development окружении база данных работает, а в production - нет.

## Решение

### 1. Создайте файл `.env` на production сервере

```bash
# На production сервере создайте файл .env в корне проекта:
cat > .env << EOF
# Production Database Configuration (внутренняя база данных)
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_secure_db_password
POSTGRES_DB=your_db_name
DATABASE_URL=postgresql://your_db_user:your_secure_db_password@database:5432/your_db_name

# Server Configuration
NODE_ENV=production
PORT=3000

# JWT Configuration (ОБЯЗАТЕЛЬНО измените в production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# Дополнительные настройки
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
EOF
```

### 2. Запустите production окружение

```bash
# Остановите все контейнеры
docker-compose -f docker-compose.prod.yml down

# Удалите старые volumes (если нужно)
docker volume rm tserver_postgres_data_prod

# Запустите production окружение
docker-compose -f docker-compose.prod.yml up -d

# Проверьте статус
docker-compose -f docker-compose.prod.yml ps
```

### 3. Проверьте логи

```bash
# Проверьте логи базы данных
docker-compose -f docker-compose.prod.yml logs database

# Проверьте логи backend
docker-compose -f docker-compose.prod.yml logs backend
```

### 4. Подключитесь к базе данных

```bash
# Подключитесь к базе данных
docker exec -it tattoo-database-prod psql -U tattoo -d tattoo_db

# Проверьте таблицы
\dt

# Выйдите
\q
```

### 5. Если база данных пустая, примените миграции вручную

```bash
# Войдите в контейнер backend
docker exec -it tattoo-backend-prod sh

# Примените миграции
npx prisma migrate deploy

# Запустите сиды
npx prisma db seed

# Выйдите
exit
```

## Проверка работоспособности

### Тест API

```bash
# Проверьте health endpoint
curl http://localhost:3000/health

# Проверьте GraphQL endpoint
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name } } }"}'
```

### Тест базы данных

```bash
# Проверьте подключение к базе
docker exec -it tattoo-database-prod psql -U tattoo -d tattoo_db -c "SELECT version();"
```

## Возможные проблемы и решения

### 1. База данных не запускается

```bash
# Проверьте переменные окружения
docker-compose -f docker-compose.prod.yml config

# Проверьте логи
docker-compose -f docker-compose.prod.yml logs database
```

### 2. Backend не может подключиться к базе

```bash
# Проверьте сеть
docker network ls
docker network inspect tserver_tattoo-network

# Проверьте переменную DATABASE_URL
docker exec -it tattoo-backend-prod env | grep DATABASE_URL
```

### 3. Миграции не применяются

```bash
# Проверьте статус миграций
docker exec -it tattoo-backend-prod npx prisma migrate status

# Примените миграции вручную
docker exec -it tattoo-backend-prod npx prisma migrate deploy
```

## Команды для быстрого перезапуска

```bash
# Полный перезапуск
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Перезапуск только backend
docker-compose -f docker-compose.prod.yml restart backend

# Перезапуск только базы данных
docker-compose -f docker-compose.prod.yml restart database
```

## Важные замечания

⚠️ **База данных в production НЕ является внешней!** Она запускается как отдельный контейнер в том же Docker Compose файле.

✅ **Преимущества такого подхода:**

- Простота развертывания
- Изолированность окружения
- Легкость backup и восстановления
- Консистентность между dev и prod

🔒 **Безопасность:**

- Измените пароли в production
- Используйте сильные JWT секреты
- Ограничьте доступ к портам базы данных
