---
description: "TypeScript specific rules and best practices for Tattoo Server project"
globs:
  - "**/*.ts"
  - "**/*.tsx"
alwaysApply: true
---

# TypeScript Rules

## Type Safety

- Avoid using `any` type - use proper TypeScript types
- Use strict type checking
- Define interfaces for complex objects
- Use type guards when necessary
- Prefer type assertions over type casting

## Code Organization

- Use proper imports and exports
- Follow ES6+ module syntax
- Use barrel exports (index.ts files) for clean imports
- Group related functionality together

## Error Handling

- Use proper error types
- Implement custom error classes when needed
- Use try-catch blocks appropriately
- Log errors with proper context

## Performance

- Use async/await instead of promises chains
- Implement proper error boundaries
- Use lazy loading when appropriate
- Optimize database queries

## NestJS Specific

- Use decorators properly
- Follow dependency injection patterns
- Use guards, interceptors, and pipes appropriately
- Implement proper validation with class-validator
