#!/bin/bash

echo "🔐 SSL Certificate Setup"
echo "======================="

# Проверяем, что мы на сервере
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Please run this script from /opt/tattoo-app directory"
    exit 1
fi

# Проверяем, что Nginx запущен
if ! docker ps | grep -q "tattoo-nginx-prod"; then
    echo "❌ Nginx container is not running. Please start the application first:"
    echo "   docker-compose -f docker-compose.prod.yml up -d"
    exit 1
fi

echo "📝 Enter your domain name (e.g., example.com):"
read DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ Domain name is required"
    exit 1
fi

echo "🔍 Setting up SSL for domain: $DOMAIN"

# Создаем директории для SSL
mkdir -p nginx/ssl
mkdir -p nginx/logs

# Останавливаем Nginx для настройки SSL
echo "⏹️  Stopping Nginx to configure SSL..."
docker-compose -f docker-compose.prod.yml stop nginx

# Создаем временный Nginx конфиг для Let's Encrypt
cat > nginx/nginx-temp.conf << EOF
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name $DOMAIN;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://\$host\$request_uri;
        }
    }
}
EOF

# Запускаем временный Nginx
echo "🚀 Starting temporary Nginx for SSL setup..."
docker run -d --name nginx-temp \
    -p 80:80 \
    -v $(pwd)/nginx/nginx-temp.conf:/etc/nginx/nginx.conf:ro \
    -v $(pwd)/certbot/www:/var/www/certbot \
    nginx:alpine

# Устанавливаем Certbot
echo "📦 Installing Certbot..."
apt update
apt install -y certbot python3-certbot-nginx

# Получаем SSL сертификат
echo "🔐 Obtaining SSL certificate..."
certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email admin@$DOMAIN \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# Останавливаем временный Nginx
echo "⏹️  Stopping temporary Nginx..."
docker stop nginx-temp
docker rm nginx-temp

# Копируем сертификаты
echo "📋 Copying SSL certificates..."
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/key.pem

# Обновляем основной Nginx конфиг с доменом
sed -i "s/server_name _;/server_name $DOMAIN;/g" nginx/nginx.conf

# Запускаем основной Nginx
echo "🚀 Starting main Nginx with SSL..."
docker-compose -f docker-compose.prod.yml up -d nginx

# Создаем скрипт для обновления сертификатов
cat > renew-ssl.sh << 'EOF'
#!/bin/bash
echo "🔄 Renewing SSL certificates..."
certbot renew --quiet
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/key.pem
docker-compose -f docker-compose.prod.yml restart nginx
echo "✅ SSL certificates renewed!"
EOF

chmod +x renew-ssl.sh

# Добавляем cron job для автоматического обновления
echo "⏰ Setting up automatic SSL renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * cd /opt/tattoo-app && ./renew-ssl.sh") | crontab -

echo ""
echo "🎉 SSL setup completed!"
echo ""
echo "✅ Your app is now available at: https://$DOMAIN"
echo "🔐 SSL certificates will auto-renew every 90 days"
echo ""
echo "📋 Useful commands:"
echo "  View SSL status: certbot certificates"
echo "  Manual renewal: ./renew-ssl.sh"
echo "  View Nginx logs: docker-compose -f docker-compose.prod.yml logs nginx"
