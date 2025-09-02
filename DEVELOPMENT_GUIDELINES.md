# Development Guidelines

## Code Style and Language Rules

### Comments and Documentation

- **ALWAYS use English for all comments and documentation**
- **MINIMIZE comments usage** - prefer self-documenting code
- Only add comments when the code logic is not obvious
- Use JSDoc for complex functions and public APIs

### Code Quality Standards

- Write clean, self-explanatory code
- Use meaningful variable and function names
- Follow TypeScript best practices
- Use proper error handling with try-catch blocks
- Implement proper logging instead of console.log in production

### Authentication & Security

- Use token revocation (`isRevoked: true`) instead of deletion for security audit
- Implement proper token rotation with atomic operations
- Use transactions for multi-step database operations
- Follow JWT best practices and OWASP security guidelines

## Available Scripts

### Code Quality Checks

```bash
# Check for Russian comments in source files
npm run check-comments

# Run ESLint with auto-fix
npm run lint

# Run all pre-commit checks
npm run pre-commit
```

### Development

```bash
# Start development server
npm run start:dev

# Build the project
npm run build

# Run database seeds
npm run seed
```

## Pre-commit Workflow

Before committing code, run:

```bash
npm run pre-commit
```

This will:

1. Check for Russian comments in source files
2. Run ESLint with auto-fix
3. Ensure code quality standards are met

## File Structure

- Keep modules organized and focused
- Use proper separation of concerns
- Follow NestJS conventions
- Use DTOs for data validation
- Place business logic in services
- Use resolvers for GraphQL endpoints

## Database Best Practices

- Always use transactions for multi-step operations
- Implement proper input validation
- Use parameterized queries to prevent SQL injection
- Follow Prisma best practices
- Use proper indexing for performance

## Security Guidelines

- Never commit sensitive data (passwords, API keys)
- Use environment variables for configuration
- Implement proper authentication and authorization
- Use HTTPS in production
- Follow OWASP security guidelines

## Testing

- Write unit tests for business logic
- Write integration tests for API endpoints
- Use proper mocking for external dependencies
- Maintain good test coverage

## Git Workflow

- Write clear, descriptive commit messages in English
- Use conventional commits format
- Keep commits atomic and focused
- Use proper branching strategy
- Review code before merging
