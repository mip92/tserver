# Production Database Migration & Seeding Guide

## ⚠️ Security Warning

**NEVER commit real credentials to version control!** This document contains placeholder values only. Replace all `your_*` and `username:password` values with actual production credentials in your local `.env` file.

## 🎯 Overview

This document describes how to connect to production database and run migrations/seeds from local development machine using Docker.

## 🔧 Setup Process

### 1. Database Connection Discovery

First, we needed to find the correct database credentials for production:

```bash
# Connect to production server
ssh root@164.92.133.111

# Check running containers
docker ps

# Get database URL from production backend container
docker exec tattoo-backend-prod env | grep DATABASE_URL
```

**Result:** `DATABASE_URL=postgresql://username:password@postgres:5432/database_name`

### 2. Environment Variables Setup

First, add production database URL to your `.env` file:

```bash
# Add to .env file
PRODUCTION_DATABASE_URL="postgresql://username:password@164.92.133.111:5432/database_name"
```

**Complete .env example:**

```bash
# Local Development Database
DATABASE_URL="postgresql://tattoo_dev:tattoo_dev@localhost:5433/tattoo_dev"

# Production Database (for migrations)
PRODUCTION_DATABASE_URL="postgresql://username:password@164.92.133.111:5432/database_name"

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Cloudflare R2 Configuration
S3_ACCESS_KEY_ID=your_s3_access_key
S3_SECRET_ACCESS_KEY=your_s3_secret_key
S3_BUCKET_NAME=your_bucket_name
S3_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
S3_PUBLIC_DOMAIN=your-bucket.your-account-id.r2.cloudflarestorage.com
```

### 3. Docker Compose Migration Service

Created a dedicated migration service in `docker-compose.yml`:

```yaml
# Migration service for production database
migration:
  build:
    context: .
    dockerfile: Dockerfile
  container_name: tattoo-migration
  environment:
    NODE_ENV: production
    # Production database connection
    DATABASE_URL: ${PRODUCTION_DATABASE_URL}
    # Use local JWT secret for migration
    JWT_SECRET: ${JWT_SECRET}
    # Cloudflare R2 Configuration
    S3_ACCESS_KEY_ID: ${S3_ACCESS_KEY_ID}
    S3_SECRET_ACCESS_KEY: ${S3_SECRET_ACCESS_KEY}
    S3_BUCKET_NAME: ${S3_BUCKET_NAME}
    S3_ENDPOINT: ${S3_ENDPOINT}
    S3_PUBLIC_DOMAIN: ${S3_PUBLIC_DOMAIN}
  volumes:
    - .:/app
    - /app/dist
  command: npx prisma migrate deploy
  profiles:
    - migration
```

### 4. Migration Process

#### Step 1: Baseline Existing Database

Since production database was not empty, we needed to mark existing migrations as applied:

```bash
# Update command to baseline
command: npx prisma migrate resolve --applied 20250901181734_init

# Run baseline
docker-compose --profile migration up migration
```

**Result:** `Migration 20250901181734_init marked as applied.`

#### Step 2: Apply New Migrations

```bash
# Update command to deploy new migrations
command: npx prisma migrate deploy

# Run migrations
docker-compose --profile migration up migration
```

**Result:**

```
Applying migration `20250903104159_add_files_table`
All migrations have been successfully applied.
```

### 5. Seeding Process

#### Step 1: Update Command for Seeding

```bash
# Update command to run seeds
command: npm run cli all
```

#### Step 2: Run All Seeds

```bash
# Run all seed commands
docker-compose --profile migration up migration
```

**Results:**

- ✅ **Roles:** 2 updated
- ✅ **Users:** 1 updated
- ✅ **Brands:** 5 updated
- ✅ **Box Types:** 10 updated
- ✅ **Products:** 36 updated
- ✅ **Boxes:** 14 updated, 4 deleted
- ✅ **Inventory Items:** 3 updated
- ✅ **Files:** 16 created, 0 updated, 0 skipped

### 6. S3 File Uploads

All 16 product files were successfully uploaded to Cloudflare R2:

```
📤 Uploading new file 3rl-main.svg to S3...
✅ S3 upload successful: products/2/main/7b725fc6-a436-43e3-b4eb-5b0f1ab9dbbe.svg
📝 Database record created: 3rl-main.svg

📤 Uploading new file 5rl-main.svg to S3...
✅ S3 upload successful: products/3/main/ac839b1d-eac6-4cd7-a284-2bb8b02ef63d.svg
📝 Database record created: 5rl-main.svg

... (14 more files)
```

## 🚀 Key Features

### 1. **Isolated Environment**

- Uses Docker profile `migration` to avoid conflicts with local development
- Separate container with production database connection
- Local environment variables for S3 configuration

### 2. **Transaction Safety**

- All seed commands run in single Prisma transaction
- If any command fails, all changes are rolled back
- 60-second timeout for S3 uploads

### 3. **Smart S3 Upload Logic**

- Checks if file exists in database first
- Only uploads to S3 if file is new or modified
- Compares file modification time with database `updatedAt`
- Skips unchanged files to save time and bandwidth

### 4. **Production Database Connection**

- Direct connection to production PostgreSQL: `164.92.133.111:5432`
- Uses production credentials from environment variables
- Database connection string stored in `PRODUCTION_DATABASE_URL`

## 📋 Commands Summary

```bash
# 1. Baseline existing migrations
docker-compose --profile migration up migration
# (with command: npx prisma migrate resolve --applied 20250901181734_init)

# 2. Apply new migrations
docker-compose --profile migration up migration
# (with command: npx prisma migrate deploy)

# 3. Run all seeds
docker-compose --profile migration up migration
# (with command: npm run cli all)
```

## ✅ Final Result

- **Database Schema:** Updated with new `File` table and relationships
- **Data:** All production data preserved and updated
- **Files:** 16 product images uploaded to Cloudflare R2
- **API:** Ready to serve product images with signed URLs
- **Security:** Files are not publicly accessible, require signed URLs

## 🔒 Security Notes

- **NEVER commit real credentials to version control**
- Production database credentials stored in environment variables only
- S3 credentials use local environment variables
- Files in S3 are not publicly accessible
- All file access requires signed URLs with expiration
- Use `.env.example` for documentation, `.env` for actual credentials

## 🛠️ Troubleshooting

### Connection Issues

```bash
# Test database connection
docker exec tattoo-migration npx prisma db pull

# Check environment variables
docker exec tattoo-migration env | grep DATABASE_URL
```

### S3 Issues

```bash
# Test S3 connection
docker exec tattoo-migration npx prisma db seed
```

### Migration Issues

```bash
# Check migration status
docker exec tattoo-migration npx prisma migrate status

# Reset if needed (DANGEROUS!)
docker exec tattoo-migration npx prisma migrate reset
```
