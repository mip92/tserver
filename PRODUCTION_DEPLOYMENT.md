# Production Database Migration & Seeding Guide

## ⚠️ Security Warning

**NEVER commit real credentials to version control!** This document contains placeholder values only. Replace all `your_*` and `username:password` values with actual production credentials in your local `.env` file.

## 🎯 Overview

This document describes how to connect to production database and run migrations/seeds from local development machine using Docker.

## 🤖 AI Assistant Requirements

**For AI assistant to run migrations automatically, the following data is required:**

### 1. **SSH Connection Details**

- **Server IP address** (e.g., `your.server.ip.address`)
- **SSH username** (e.g., `root`)
- **SSH key path** (e.g., `/Users/username/.ssh/id_ed11111111`)

### 2. **Database Credentials**

- **Database username** (e.g., `your_db_user`)
- **Database password** (e.g., `your_db_password`)
- **Database name** (e.g., `your_db_name`)

### 3. **Environment Configuration**

- **PRODUCTION_DATABASE_URL** in `.env` file
- **SSH tunnel must be active** on port 5432
- **Use `localhost:5432`** for local commands (not in Docker)
- **Use `host.docker.internal:5432`** for Docker containers

**AI Assistant should request from user:**

1. **Server IP and SSH credentials** for tunnel setup
2. **Database credentials** for connection string
3. **Confirmation** that SSH tunnel is active

**Without these data, AI Assistant cannot:**

- Start SSH tunnel
- Connect to production database
- Run migrations automatically

## 📝 AI Assistant Checklist

**Before running migrations, AI Assistant must:**

1. **Request SSH connection details:**

   ```
   "Please provide:
   - Server IP address
   - SSH username
   - SSH key path"
   ```

2. **Request database credentials:**

   ```
   "Please provide:
   - Database username
   - Database password
   - Database name"
   ```

3. **Verify environment setup:**

   ```
   "Please confirm:
   - PRODUCTION_DATABASE_URL is set in .env file
   - SSH tunnel is active on port 5432"
   ```

4. **Test connection before proceeding:**
   ```bash
   lsof -i :5432  # Check SSH tunnel
   docker-compose --profile migration up migration  # Run migrations
   ```

## 🚨 Common Problems & Solutions

### Problem 1: Database Connection Issues

**Error:** `Can't reach database server at localhost:5432`
**Cause:** Docker container cannot access host's localhost directly
**Solution:** Use `host.docker.internal:5432` instead of `localhost:5432`

### Problem 2: SSH Tunnel Not Active

**Error:** `Can't reach database server at host.docker.internal:5432`
**Cause:** SSH tunnel is not running or has been disconnected
**Solution:** Always start SSH tunnel before running migrations

### Problem 3: Environment Variables Not Loaded

**Error:** `PRODUCTION_DATABASE_URL resolved to an empty string`
**Cause:** Variable not set in `.env` file or not loaded properly
**Solution:** Add `PRODUCTION_DATABASE_URL` to `.env` file

### Problem 4: Network Configuration Issues

**Error:** Docker container cannot reach host services
**Cause:** Wrong network configuration in docker-compose.yml
**Solution:** Use `host.docker.internal` with proper network setup

### Problem 5: Migration Already Applied

**Error:** `The migration is already recorded as applied`
**Cause:** Baseline migration was already applied to production database
**Solution:** This is normal - proceed with new migrations using `migrate deploy`

## 🔧 Setup Process

### 1. Environment Variables Setup

Add production database URL to your `.env` file:

```bash
# Add to .env file
# For local commands (not in Docker):
PRODUCTION_DATABASE_URL="postgresql://your_db_user:your_db_password@localhost:5432/your_db_name"

# For Docker containers:
# PRODUCTION_DATABASE_URL="postgresql://your_db_user:your_db_password@host.docker.internal:5432/your_db_name"
```

### 2. Docker Compose Migration Service

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

- ✅ **Roles:** Updated successfully
- ✅ **Users:** Updated successfully
- ✅ **Brands:** Updated successfully
- ✅ **Box Types:** Updated successfully
- ✅ **Products:** Updated successfully
- ✅ **Boxes:** Updated successfully
- ✅ **Inventory Items:** Updated successfully
- ✅ **Files:** Processed successfully

### 6. S3 File Uploads

All product files were successfully uploaded to S3 storage:

```
📤 Uploading files to S3...
✅ S3 upload successful
📝 Database records created/updated
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

- Connection to production PostgreSQL through SSH tunnel
- Uses production credentials from environment variables
- Database connection string stored in `PRODUCTION_DATABASE_URL`

## 📋 Step-by-Step Migration & Seeding Process

### Prerequisites

1. **SSH access to production server**
2. **SSH key** for authentication
3. **Production database credentials**
4. **Local `.env` file** with `PRODUCTION_DATABASE_URL`

### Step 1: Start SSH Tunnel

```bash
# Start SSH tunnel to production database
ssh -L 5432:localhost:5432 -i /path/to/ssh/key user@production-server

# Keep this terminal open - tunnel must stay active!
```

### Step 2: Verify SSH Tunnel

```bash
# In another terminal, check if tunnel is active
lsof -i :5432

# Should show:
# ssh  PID  user  5u  IPv6  TCP localhost:postgresql (LISTEN)
# ssh  PID  user  6u  IPv4  TCP localhost:postgresql (LISTEN)
```

### Step 3: Configure Environment

```bash
# Add to .env file:
# For local commands:
PRODUCTION_DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/your_db_name

# For Docker containers:
# PRODUCTION_DATABASE_URL=postgresql://your_db_user:your_db_password@host.docker.internal:5432/your_db_name
```

### Step 4: Run Migrations

```bash
# Apply new migrations to production database
docker-compose --profile migration up migration
```

### Step 5: Run Seeds

```bash
# Run all seed commands (roles, users, brands, products, etc.)
docker-compose --profile migration up migration
```

### Step 6: Verify Results

```bash
# Check migration status
docker exec tattoo-migration npx prisma migrate status

# Check database connection
docker exec tattoo-migration npx prisma db pull
```

## 🚀 Quick Commands

```bash
# Complete migration and seeding process
ssh -L 5432:localhost:5432 -i /path/to/ssh/key user@production-server &
docker-compose --profile migration up migration
```

## ✅ Final Result

- **Database Schema:** Updated with new tables and relationships
- **Data:** All production data preserved and updated
- **Files:** Product images uploaded to S3 storage
- **API:** Ready to serve product images with signed URLs
- **Security:** Files are not publicly accessible, require signed URLs

## 🔒 Security Notes

- **NEVER commit real credentials to version control**
- Production database credentials stored in environment variables only
- S3 credentials use local environment variables
- Files in S3 are not publicly accessible
- All file access requires signed URLs with expiration
- Use `.env.example` for documentation, `.env` for actual credentials

## ⚠️ Important Notes

### Critical Requirements

1. **SSH tunnel MUST be active** during entire migration process
2. **Never close SSH tunnel terminal** until migration is complete
3. **Always verify tunnel** with `lsof -i :5432` before running migrations
4. **Use `host.docker.internal`** not `localhost` in Docker containers
5. **Test connection** before running migrations

### Common Mistakes

- ❌ Running migrations without SSH tunnel
- ❌ Using `localhost` instead of `host.docker.internal`
- ❌ Not setting `PRODUCTION_DATABASE_URL` in `.env`
- ❌ Closing SSH tunnel during migration
- ❌ Using wrong port (5433 instead of 5432)

### Success Indicators

- ✅ SSH tunnel shows active connections on port 5432
- ✅ Migration container connects to database successfully
- ✅ Migrations apply without errors
- ✅ Seeds run and update data
- ✅ All operations complete in single transaction

## 🛠️ Troubleshooting

### Connection Issues

```bash
# Test database connection
docker exec tattoo-migration npx prisma db pull

# Check environment variables
docker exec tattoo-migration env | grep DATABASE_URL

# Verify SSH tunnel is active
lsof -i :5432

# Test direct connection to production database
psql -h localhost -p 5432 -U username -d database_name
```

### SSH Tunnel Issues

```bash
# Check if SSH tunnel is running
ps aux | grep ssh

# Restart SSH tunnel if needed
pkill -f "ssh -L 5432"
ssh -L 5432:localhost:5432 -i /path/to/ssh/key user@production-server
```

### Docker Issues

```bash
# Clean up Docker containers
docker-compose down
docker system prune -f

# Rebuild migration container
docker-compose build migration
```

### Migration Issues

```bash
# Check migration status
docker exec tattoo-migration npx prisma migrate status

# Check what migrations are pending
docker exec tattoo-migration npx prisma migrate diff

# Reset if needed (DANGEROUS!)
docker exec tattoo-migration npx prisma migrate reset
```

### Environment Issues

```bash
# Check if .env file is loaded
docker exec tattoo-migration cat /app/.env

# Verify PRODUCTION_DATABASE_URL format
echo $PRODUCTION_DATABASE_URL
```
