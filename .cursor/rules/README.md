---
description: "Overview of Cursor rules for Tattoo Server project"
globs:
  - "**/*.md"
alwaysApply: true
---

# Cursor Rules for Tattoo Server Project

This directory contains rules that Cursor AI will follow when working on this project.

## Rule Files

- `project-context.md` - Project overview and context information
- `code-style.md` - General code style and language rules
- `typescript.md` - TypeScript specific rules and best practices
- `authentication.md` - Authentication and security specific rules
- `commit-standards.md` - Git workflow and commit message standards

## Key Rules Summary

### Language

- **ALWAYS use English for all comments and documentation**
- Minimize comments usage - prefer self-documenting code

### Security

- Use token revocation (`isRevoked: true`) instead of deletion
- Use transactions for atomic operations
- Follow OWASP security guidelines

### Code Quality

- Avoid `any` type - use proper TypeScript types
- Use meaningful variable and function names
- Follow NestJS conventions
- Implement proper error handling

### Database

- Always use transactions for multi-step operations
- Use parameterized queries
- Follow Prisma best practices

## How to Use

These rules are automatically applied by Cursor when working on this project. They help ensure:

- Consistent code style across the team
- Security best practices
- Proper error handling
- Clean, maintainable code

## Updating Rules

When updating rules:

1. Modify the appropriate rule file
2. Test the changes with Cursor
3. Update this README if needed
4. Commit changes to version control
