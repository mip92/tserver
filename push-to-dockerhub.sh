#!/bin/bash

# Загружаем переменные окружения
if [ -f "docker-hub.env" ]; then
    source docker-hub.env
else
    echo "⚠️  Файл docker-hub.env не найден. Используем значения по умолчанию."
    REGISTRY="docker.io"
    USERNAME="mip92"
    IMAGE_NAME="tattoo-server"
    TAG="latest"
fi

echo "🐳 Pushing Tattoo Backend to Docker Hub..."

# Проверяем, что мы в правильной директории
if [ ! -f "Dockerfile" ]; then
    echo "❌ Ошибка: Dockerfile не найден. Запустите скрипт из корня tserver."
    exit 1
fi

# Проверяем логин в Docker Hub
if ! docker info | grep -q "Username"; then
    echo "⚠️  Вы не залогинены в Docker Hub. Выполните: docker login"
    exit 1
fi

echo "🔨 Building and pushing multi-arch image..."
echo "📦 Image: ${USERNAME}/${IMAGE_NAME}:${TAG}"
echo "🏗️  Platforms: linux/amd64, linux/arm64"

# Создаем или используем существующий multi-arch builder

docker buildx create --use --name multiarch-builder 2>/dev/null || docker buildx use multiarch-builder 2>/dev/null || true

# Собираем и пушим образ
docker buildx build --platform linux/amd64,linux/arm64 -t ${USERNAME}/${IMAGE_NAME}:${TAG} --push .

if [ $? -eq 0 ]; then
    echo "✅ Образ успешно собран и запушен в Docker Hub!"
    echo "🐳 Теперь на сервере выполните:"
    echo "   docker pull ${USERNAME}/${IMAGE_NAME}:${TAG}"
    echo ""
    echo "📊 Проверить образ можно командой:"
    echo "   docker images ${USERNAME}/${IMAGE_NAME}:${TAG}"
else
    echo "❌ Ошибка при сборке и пуше образа!"
    exit 1
fi


