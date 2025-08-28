#!/bin/bash

echo "🚀 DigitalOcean Deployment Script"
echo "================================"

# Проверяем аргументы
if [ $# -eq 0 ]; then
    echo "Usage: $0 <server_ip> [ssh_user]"
    echo "Example: $0 123.456.789.012 root"
    exit 1
fi

SERVER_IP=$1
SSH_USER=${2:-root}

echo "📍 Server IP: $SERVER_IP"
echo "👤 SSH User: $SSH_USER"
echo ""

# Проверяем подключение к серверу
echo "🔍 Testing connection to server..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes $SSH_USER@$SERVER_IP exit 2>/dev/null; then
    echo "❌ Cannot connect to server. Please check:"
    echo "   - Server IP is correct"
    echo "   - SSH key is added to server"
    echo "   - Firewall allows SSH (port 22)"
    exit 1
fi
echo "✅ Server connection successful!"

# Создаем директорию на сервере
echo "📁 Creating application directory on server..."
ssh $SSH_USER@$SERVER_IP "mkdir -p /opt/tattoo-app"

# Копируем файлы на сервер
echo "📤 Copying deployment files to server..."
scp docker-compose.prod.yml $SSH_USER@$SERVER_IP:/opt/tattoo-app/
scp -r nginx/ $SSH_USER@$SERVER_IP:/opt/tattoo-app/
scp setup-digitalocean.sh $SSH_USER@$SERVER_IP:/opt/tattoo-app/
scp clone-repos.sh $SSH_USER@$SERVER_IP:/opt/tattoo-app/

# Устанавливаем Docker и зависимости
echo "🐳 Setting up Docker and dependencies on server..."
ssh $SSH_USER@$SERVER_IP "cd /opt/tattoo-app && chmod +x setup-digitalocean.sh && ./setup-digitalocean.sh"

# Клонируем репозитории
echo "📥 Setting up repositories on server..."
ssh $SSH_USER@$SERVER_IP "cd /opt/tattoo-app && chmod +x clone-repos.sh && ./clone-repos.sh"

# Запускаем приложение
echo "🚀 Starting application..."
ssh $SSH_USER@$SERVER_IP "cd /opt/tattoo-app && docker-compose -f docker-compose.prod.yml up -d"

# Проверяем статус
echo "🔍 Checking application status..."
ssh $SSH_USER@$SERVER_IP "cd /opt/tattoo-app && docker-compose -f docker-compose.prod.yml ps"

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update your domain DNS to point to: $SERVER_IP"
echo "2. SSH to server and run: cd /opt/tattoo-app && ./setup-ssl.sh"
echo "3. Your app will be available at: http://$SERVER_IP"
echo ""
echo "🔧 Useful commands:"
echo "  SSH to server: ssh $SSH_USER@$SERVER_IP"
echo "  View logs: cd /opt/tattoo-app && docker-compose -f docker-compose.prod.yml logs -f"
echo "  Restart: cd /opt/tattoo-app && docker-compose -f docker-compose.prod.yml restart"
echo "  Stop: cd /opt/tattoo-app && docker-compose -f docker-compose.prod.yml down"
