---
description: "Code style and language rules for Tattoo Server project"
globs:
  - "**/*.ts"
  - "**/*.js"
  - "**/*.tsx"
  - "**/*.jsx"
alwaysApply: true
---

# Code Style Rules

## Language and Comments

- **ALWAYS use English for all comments and documentation**
- **MINIMIZE comments usage** - prefer self-documenting code
- Only add comments when the code logic is not obvious
- Use JSDoc for complex functions and public APIs

## Code Quality

- Write clean, self-explanatory code
- Use meaningful variable and function names
- Follow TypeScript best practices
- Use proper error handling with try-catch blocks
- Implement proper logging instead of console.log in production

## Authentication & Security

- Use token revocation (`isRevoked: true`) instead of deletion for security audit
- Implement proper token rotation with atomic operations
- Use transactions for multi-step database operations
- Follow JWT best practices and OWASP security guidelines

## Database Operations

- Always use transactions for multi-step operations
- Implement proper input validation
- Use parameterized queries to prevent SQL injection
- Follow Prisma best practices
- Use proper indexing for performance

## File Structure

- Keep modules organized and focused
- Use proper separation of concerns
- Follow NestJS conventions
- Use DTOs for data validation
- Place business logic in services
- Use resolvers for GraphQL endpoints
