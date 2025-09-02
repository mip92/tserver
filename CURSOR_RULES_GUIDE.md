# Cursor Rules Guide

## How Cursor Rules Work

Cursor AI automatically reads rules from the `.cursor/rules/` directory when working on your project. These rules help ensure consistent code style and best practices.

## Current Rules Structure

```
.cursor/rules/
├── README.md           # Overview of all rules
├── project-context.md  # Project overview and context
├── code-style.md       # General code style and language rules
├── typescript.md       # TypeScript specific rules
├── authentication.md   # Authentication and security rules
└── commit-standards.md # Git workflow and commit standards
```

## YAML Front Matter Format

Each rule file now uses YAML front matter for better Cursor integration:

```yaml
---
description: "Brief description of the rule"
globs:
  - "**/*.ts" # File patterns this rule applies to
  - "src/modules/**/*" # Specific directories
alwaysApply: true # Whether to always apply this rule
---
```

## Key Rules Applied

### 1. Language Rules

- **ALWAYS use English for all comments and documentation**
- Minimize comments usage - prefer self-documenting code
- Use JSDoc for complex functions

### 2. Security Rules

- Use token revocation (`isRevoked: true`) instead of deletion
- Use transactions for atomic operations
- Follow OWASP security guidelines

### 3. TypeScript Rules

- Avoid `any` type - use proper TypeScript types
- Use meaningful variable and function names
- Follow NestJS conventions

## How to Verify Rules Are Working

1. **Check for Russian comments:**

   ```bash
   npm run check-comments
   ```

2. **Run linting:**

   ```bash
   npm run lint
   ```

3. **Run pre-commit checks:**
   ```bash
   npm run pre-commit
   ```

## Adding New Rules

1. Create a new `.md` file in `.cursor/rules/`
2. Define clear, specific rules
3. Update `README.md` to reference the new rules
4. Test the rules with Cursor

## Example Rule Format

````markdown
# Rule Category

## Specific Rule

- **BOLD** for critical rules
- Use clear, actionable language
- Provide examples when helpful

## Code Examples

```typescript
// ✅ Good example
const result = await this.prisma.$transaction(async (tx) => {
  // Transaction logic
});

// ❌ Bad example
await this.prisma.refreshToken.delete({ where: { id } });
```
````

```

## Troubleshooting

If Cursor doesn't seem to follow the rules:

1. Check that rules are in `.cursor/rules/` directory
2. Ensure rules are written in clear, actionable language
3. Restart Cursor to reload rules
4. Check Cursor settings for any conflicting configurations

## Best Practices

- Keep rules specific and actionable
- Use examples to clarify expectations
- Update rules as project evolves
- Test rules regularly with Cursor
- Document rule changes in commit messages
```
