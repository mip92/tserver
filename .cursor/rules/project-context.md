---
description: "Project context and key information for Tattoo Server application"
globs:
  - "**/*.md"
  - "**/*.yml"
  - "**/*.yaml"
  - "docker-compose*.yml"
alwaysApply: true
---

# Tattoo Project Context

## Key Information for Tattoo Server application

This is a NestJS-based GraphQL API server for a tattoo inventory management system.

### Technology Stack

- **Backend**: NestJS with GraphQL
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Language**: TypeScript
- **Containerization**: Docker

### Project Structure

- `src/modules/` - Feature modules (auth, users, products, brands, etc.)
- `src/prisma/` - Database schema and migrations
- `prisma/seeds/` - Database seed data
- `src/config/` - Configuration files

### Key Features

- User authentication and authorization
- Role-based access control (ADMIN, USER)
- Product and brand management
- Inventory tracking with boxes and items
- GraphQL API with REST endpoints

### Security Requirements

- Token revocation instead of deletion for audit trails
- Atomic database operations using transactions
- Input validation and sanitization
- OWASP security guidelines compliance

### Development Standards

- All comments and documentation in English
- TypeScript strict mode
- Proper error handling
- Clean code principles
- Comprehensive testing

### Database Schema

- Users with roles and refresh tokens
- Products with brands and types
- Inventory items with box organization
- Hierarchical box structure for organization

### API Endpoints

- GraphQL playground available
- REST endpoints for authentication
- Health check endpoints
- Admin-only operations properly protected
