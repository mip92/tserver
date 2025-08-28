#!/bin/bash

echo "🚀 Setting up DigitalOcean server for Tattoo App..."

# Проверяем, что мы на сервере
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

echo "📦 Updating system packages..."
apt update && apt upgrade -y

echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

echo "🐳 Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo "📁 Creating application directory..."
mkdir -p /opt/tattoo-app
cd /opt/tattoo-app

echo "🔐 Setting up SSL certificates directory..."
mkdir -p nginx/ssl
mkdir -p nginx/logs

echo "📝 Creating .env file..."
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

echo "🔒 Setting up firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "📋 Installing additional tools..."
apt install -y nginx certbot python3-certbot-nginx

echo "✅ Basic setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Upload your code to /opt/tattoo-app"
echo "2. Configure your domain in nginx/nginx.conf"
echo "3. Get SSL certificates: certbot --nginx -d your-domain.com"
echo "4. Run: docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "🌐 Your app will be available at:"
echo "   - Frontend: https://your-domain.com"
echo "   - Backend: https://your-domain.com/graphql"
echo "   - Health: https://your-domain.com/health"
