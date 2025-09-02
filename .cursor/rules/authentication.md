---
description: "Authentication and security rules for Tattoo Server project"
globs:
  - "src/modules/auth/**/*.ts"
  - "src/modules/**/guards/**/*.ts"
  - "src/modules/**/decorators/**/*.ts"
  - "src/modules/**/strategies/**/*.ts"
alwaysApply: true
---

# Authentication Rules

## Token Management

- **ALWAYS use token revocation (`isRevoked: true`) instead of deletion**
- Implement proper token rotation with atomic operations
- Use transactions for token operations to prevent race conditions
- Follow JWT best practices for security

## Security Best Practices

- Use proper input validation
- Implement rate limiting for authentication endpoints
- Use secure password hashing (bcrypt with proper salt rounds)
- Implement proper session management
- Follow OWASP security guidelines

## Database Security

- Use parameterized queries to prevent SQL injection
- Implement proper access controls
- Use database transactions for multi-step operations
- Implement proper audit logging

## Error Handling

- Don't expose sensitive information in error messages
- Use generic error messages for authentication failures
- Implement proper logging for security events
- Handle edge cases gracefully

## Code Examples

```typescript
// ✅ Good: Use transaction for atomic operations
const result = await this.prisma.$transaction(async (tx) => {
  await tx.refreshToken.update({
    where: { id: refreshToken.id },
    data: { isRevoked: true },
  });
  return await this.createRefreshToken(userId, tx);
});

// ❌ Bad: Separate operations without transaction
await this.prisma.refreshToken.delete({ where: { id: refreshToken.id } });
const newToken = await this.createRefreshToken(userId);
```
