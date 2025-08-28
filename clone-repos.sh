#!/bin/bash

echo "📥 Cloning repositories for deployment..."

# Проверяем, что мы в правильной директории
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Клонируем backend (текущий репозиторий)
echo "🔧 Setting up backend..."
if [ ! -d "backend" ]; then
    echo "📁 Creating backend directory..."
    mkdir -p backend
    # Копируем текущие файлы в backend/
    cp -r . backend/
    # Убираем лишние файлы из backend
    rm -rf backend/backend
    rm -rf backend/frontend
    rm -rf backend/.git
    echo "✅ Backend files copied to backend/ directory"
else
    echo "✅ Backend directory already exists"
fi

# Клонируем frontend репозиторий
echo "🎨 Setting up frontend..."
if [ ! -d "frontend" ]; then
    echo "📁 Cloning frontend repository..."
    read -p "Enter your frontend repository URL: " FRONTEND_REPO
    
    if [ -z "$FRONTEND_REPO" ]; then
        echo "❌ Frontend repository URL is required"
        exit 1
    fi
    
    git clone $FRONTEND_REPO frontend
    echo "✅ Frontend repository cloned to frontend/ directory"
else
    echo "✅ Frontend directory already exists"
fi

# Создаем .env файл если его нет
if [ ! -f ".env" ]; then
    echo "🔐 Creating .env file..."
    cat > .env << EOF
# Database Configuration
POSTGRES_USER=tattoo_user
POSTGRES_PASSWORD=$(openssl rand -base64 32)
POSTGRES_DB=tattoo_db
DATABASE_URL=postgresql://tattoo_user:\${POSTGRES_PASSWORD}@database:5432/tattoo_db

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 64)
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://your-domain.com/graphql
EOF
    echo "✅ .env file created"
fi

echo ""
echo "🎉 Repository setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update NEXT_PUBLIC_API_URL in .env with your domain"
echo "2. Make sure frontend/ has a Dockerfile"
echo "3. Run: docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "📁 Directory structure:"
echo "├── backend/          # NestJS API"
echo "├── frontend/         # Next.js app"
echo "├── nginx/            # Nginx config"
echo "├── docker-compose.prod.yml"
echo "└── .env"
