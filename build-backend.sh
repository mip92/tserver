#!/bin/bash

# Загружаем переменные окружения
if [ -f "docker-hub.env" ]; then
    source docker-hub.env
else
    echo "⚠️  Файл docker-hub.env не найден. Используем значения по умолчанию."
    # Конфигурация по умолчанию
    REGISTRY="docker.io"
    USERNAME="mip92"
    IMAGE_NAME="tattoo-server"
    TAG="latest"
fi

echo "🚀 Собираю backend Docker образ и пушу в registry..."

# Проверяем, что мы в правильной директории
if [ ! -f "Dockerfile" ]; then
    echo "❌ Ошибка: Dockerfile не найден. Запустите скрипт из корня tserver."
    exit 1
fi

# Собираем backend образ для multi-arch
echo "🔨 Собираю backend Docker образ для multi-arch..."
docker buildx create --use --name multiarch-builder 2>/dev/null || docker buildx use multiarch-builder 2>/dev/null || true
docker buildx build --platform linux/amd64,linux/arm64 -t ${USERNAME}/${IMAGE_NAME}:${TAG} --push .

if [ $? -ne 0 ]; then
    echo "❌ Ошибка сборки образа!"
    exit 1
fi

echo "✅ Backend образ успешно собран и запушен в Docker Hub!"
echo "🐳 Теперь на сервере выполните:"
echo "   docker pull ${USERNAME}/${IMAGE_NAME}:${TAG}"
echo "   docker-compose -f docker-compose.prod.yml up -d"

# Отдельная команда для быстрого пуша в Docker Hub
echo ""
echo "🚀 Для быстрого пуша в Docker Hub используйте:"
echo "   docker push ${USERNAME}/${IMAGE_NAME}:${TAG}"
echo ""
echo "📦 Или соберите и запушьте одной командой:"
echo "   docker buildx build --platform linux/amd64,linux/arm64 -t ${USERNAME}/${IMAGE_NAME}:${TAG} --push ."
