# 🚀 DigitalOcean Deployment Guide

## Prerequisites

- DigitalOcean аккаунт
- Домен (опционально, но рекомендуется)
- SSH ключ для доступа к серверу

## Step 1: Create Droplet

### 1.1 Создайте новый Droplet:

- **Image**: Ubuntu 22.04 LTS
- **Size**: Basic → $4/month (1GB RAM, 1 CPU, 25GB SSD)
- **Region**: Выберите ближайший к вашим пользователям
- **Authentication**: SSH Key (загрузите ваш публичный ключ)

### 1.2 Подключитесь к серверу:

```bash
ssh root@YOUR_SERVER_IP
```

## Step 2: Server Setup

### 2.1 Запустите скрипт настройки:

```bash
# Скачайте скрипт
curl -O https://raw.githubusercontent.com/yourusername/tattoo-server/main/setup-digitalocean.sh

# Сделайте исполняемым и запустите
chmod +x setup-digitalocean.sh
./setup-digitalocean.sh
```

### 2.2 Или настройте вручную:

```bash
# Обновите систему
apt update && apt upgrade -y

# Установите Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установите Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Настройте firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

## Step 3: Upload Code

### 3.1 Создайте директорию приложения:

```bash
mkdir -p /opt/tattoo-app
cd /opt/tattoo-app
```

### 3.2 Загрузите код:

```bash
# Клонируйте репозиторий
git clone https://github.com/yourusername/tattoo-server.git .

# Или загрузите через SCP
scp -r ./tattoo-server/* root@YOUR_SERVER_IP:/opt/tattoo-app/
```

## Step 4: Configure Environment

### 4.1 Создайте .env файл:

```bash
cat > .env << EOF
# Database Configuration
POSTGRES_USER=tattoo_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=tattoo_db
DATABASE_URL=postgresql://tattoo_user:your_secure_password_here@database:5432/tattoo_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://your-domain.com/graphql
EOF
```

### 4.2 Обновите nginx/nginx.conf:

Замените `your-domain.com` на ваш реальный домен.

## Step 5: SSL Certificate (Optional)

### 5.1 Установите Certbot:

```bash
apt install -y certbot python3-certbot-nginx
```

### 5.2 Получите SSL сертификат:

```bash
certbot --nginx -d your-domain.com
```

## Step 6: Deploy

### 6.1 Запустите приложение:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 6.2 Проверьте статус:

```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

## Step 7: Verify

### 7.1 Проверьте endpoints:

- **Frontend**: https://your-domain.com
- **Backend**: https://your-domain.com/graphql
- **Health**: https://your-domain.com/health

### 7.2 Проверьте логи:

```bash
# Backend logs
docker-compose -f docker-compose.prod.yml logs backend

# Frontend logs
docker-compose -f docker-compose.prod.yml logs frontend

# Nginx logs
docker-compose -f docker-compose.prod.yml logs nginx
```

## Maintenance

### Update application:

```bash
cd /opt/tattoo-app
git pull
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Backup database:

```bash
docker-compose -f docker-compose.prod.yml exec database pg_dump -U tattoo_user tattoo_db > backup.sql
```

### Restart services:

```bash
docker-compose -f docker-compose.prod.yml restart
```

## Troubleshooting

### Port already in use:

```bash
# Проверьте, что использует порт
netstat -tulpn | grep :80
netstat -tulpn | grep :443

# Остановите конфликтующий сервис
systemctl stop nginx
```

### Database connection issues:

```bash
# Проверьте статус базы
docker-compose -f docker-compose.prod.yml exec database pg_isready -U tattoo_user

# Проверьте логи
docker-compose -f docker-compose.prod.yml logs database
```

### SSL issues:

```bash
# Обновите сертификат
certbot renew

# Проверьте конфигурацию
nginx -t
```

## Cost Breakdown

- **Droplet**: $4/month (1GB RAM, 1 CPU, 25GB SSD)
- **Domain**: $10-15/year (если покупаете)
- **Total**: ~$4/month + domain

## Security Features

- ✅ Firewall (UFW)
- ✅ SSL/TLS encryption
- ✅ Rate limiting
- ✅ Security headers
- ✅ Docker isolation
- ✅ Non-root containers
