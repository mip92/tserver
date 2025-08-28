# 🎨 Frontend Droplet Setup

## 📋 Создание нового Droplet для Frontend:

### **1. Создайте новый Droplet:**
- **Image**: Ubuntu 22.04 LTS
- **Plan**: Basic ($6/месяц) - 1GB RAM, 1 vCPU
- **Region**: Тот же регион, что и backend
- **Authentication**: Ваш SSH ключ

### **2. Структура frontend Droplet:**
```
/opt/tattoo-frontend/
├── frontend/         # Next.js приложение
├── nginx/            # Nginx конфигурация
├── docker-compose.yml
└── .env
```

## 🐳 Docker Compose для Frontend:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: tattoo-frontend-prod
    restart: unless-stopped
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: https://YOUR_BACKEND_IP/graphql
    networks:
      - frontend-network

  nginx:
    image: nginx:alpine
    container_name: tattoo-frontend-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - frontend
    networks:
      - frontend-network

networks:
  frontend-network:
    driver: bridge

volumes:
  nginx_ssl:
  nginx_logs:
```

## 🌐 Nginx конфигурация для Frontend:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    server {
        listen 80;
        server_name your-frontend-domain.com;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-frontend-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## 🔧 Настройка:

### **1. На frontend Droplet:**
```bash
# Клонируйте ваш frontend репозиторий
git clone YOUR_FRONTEND_REPO frontend

# Создайте .env
echo "NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_IP/graphql" > .env

# Запустите
docker-compose up -d
```

### **2. На backend Droplet:**
```bash
# Обновите .env
echo "FRONTEND_URL=https://YOUR_FRONTEND_IP" >> .env

# Перезапустите backend
docker-compose -f docker-compose.prod.yml restart
```

## 🌍 DNS настройка:

### **Backend**: `api.yourdomain.com` → Backend Droplet IP
### **Frontend**: `yourdomain.com` → Frontend Droplet IP

## 💰 Стоимость:
- **Backend Droplet**: $6/месяц
- **Frontend Droplet**: $6/месяц
- **Итого**: $12/месяц

## 🚀 Преимущества:
✅ Изолированные сервисы  
✅ Независимое масштабирование  
✅ Лучшая безопасность  
✅ Отдельные SSL сертификаты  
✅ Проще мониторинг
