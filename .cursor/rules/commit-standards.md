---
description: "Commit message standards and Git workflow rules"
globs:
  - "**/*.md"
  - "**/*.yml"
  - "**/*.yaml"
alwaysApply: true
---

# Commit Standards

## Commit Message Format

Use conventional commits format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```
feat(auth): add token revocation instead of deletion
fix(products): resolve pagination issue in product list
docs: update API documentation
refactor(auth): improve token rotation logic
chore: update dependencies
```

## Git Workflow Rules

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

### Commit Guidelines

- Write clear, descriptive commit messages in English
- Keep commits atomic and focused
- One logical change per commit
- Test changes before committing
- Use present tense ("add feature" not "added feature")

### Pre-commit Checks

- Run `npm run pre-commit` before committing
- Ensure all tests pass
- Check for Russian comments
- Verify code formatting
- Validate TypeScript types

### Pull Request Standards

- Clear, descriptive title
- Detailed description of changes
- Reference related issues
- Include screenshots for UI changes
- Ensure CI/CD passes
- Request appropriate reviewers
