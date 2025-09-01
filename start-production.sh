#!/bin/bash

echo "🚀 Запуск Production окружения с внутренней базой данных..."

# Проверяем наличие .env файла
if [ ! -f ".env" ]; then
    echo "❌ Файл .env не найден!"
    echo "📝 Создайте файл .env с production настройками"
    echo "💡 Пример содержимого:"
    cat << EOF
# Production Database Configuration (внутренняя база данных)
POSTGRES_USER=tattoo
POSTGRES_PASSWORD=tattoo_prod_pass_secure
POSTGRES_DB=tattoo_db
DATABASE_URL=postgresql://tattoo:tattoo_prod_pass_secure@database:5432/tattoo_db

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
    exit 1
fi

echo "✅ Файл .env найден"

# Останавливаем все контейнеры
echo "🛑 Останавливаю все контейнеры..."
docker-compose -f docker-compose.prod.yml down

# Удаляем старые volumes (опционально)
read -p "🗑️  Удалить старые данные базы данных? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Удаляю старые volumes..."
    docker volume rm tserver_postgres_data_prod 2>/dev/null || true
fi

# Запускаем production окружение
echo "🚀 Запускаю production окружение с базой данных..."
docker-compose -f docker-compose.prod.yml up -d

# Ждем запуска базы данных
echo "⏳ Жду запуска базы данных..."
sleep 15

# Проверяем статус
echo "📊 Статус контейнеров:"
docker-compose -f docker-compose.prod.yml ps

# Проверяем логи базы данных
echo "📋 Логи базы данных:"
docker-compose -f docker-compose.prod.yml logs database --tail=20

# Проверяем подключение к базе
echo "🔍 Проверяю подключение к базе данных..."
if docker exec -it tattoo-database-prod pg_isready -U tattoo -d tattoo_db >/dev/null 2>&1; then
    echo "✅ База данных доступна"
else
    echo "❌ База данных недоступна"
    echo "📋 Подробные логи базы данных:"
    docker-compose -f docker-compose.prod.yml logs database
    exit 1
fi

# Проверяем backend
echo "🔍 Проверяю backend..."
sleep 10
if curl -s http://localhost:3000/health >/dev/null; then
    echo "✅ Backend доступен"
else
    echo "❌ Backend недоступен"
    echo "📋 Логи backend:"
    docker-compose -f docker-compose.prod.yml logs backend --tail=20
fi

echo ""
echo "🎉 Production окружение запущено!"
echo ""
echo "📊 Статус:"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "🔗 Доступные endpoints:"
echo "   - Health: http://localhost:3000/health"
echo "   - GraphQL: http://localhost:3000/graphql"
echo "   - Database: localhost:5432"
echo ""
echo "📋 Полезные команды:"
echo "   - Логи: docker-compose -f docker-compose.prod.yml logs -f"
echo "   - Остановка: docker-compose -f docker-compose.prod.yml down"
echo "   - Перезапуск: docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "🗄️  База данных:"
echo "   - Подключение: docker exec -it tattoo-database-prod psql -U tattoo -d tattoo_db"
echo "   - Проверка: docker exec -it tattoo-database-prod psql -U tattoo -d tattoo_db -c '\dt'"
