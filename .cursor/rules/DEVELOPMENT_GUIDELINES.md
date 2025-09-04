# Development Guidelines

## 🔒 Security Rules for AI Assistant

### Environment Files (.env) - STRICTLY FORBIDDEN

**NEVER** perform any of the following actions with `.env` files:

- ❌ **READ** `.env` files
- ❌ **COPY** content from `.env` files
- ❌ **REPLACE** content in `.env` files
- ❌ **MODIFY** `.env` files
- ❌ **PEEK** into `.env` files
- ❌ **SUBSTITUTE** `.env` files
- ❌ **FIDDLE** with `.env` files
- ❌ **TOUCH** `.env` files in any way

### What You CAN Do

- ✅ **READ** `env.example` files
- ✅ **MODIFY** `env.example` files (with placeholder values)
- ✅ **SUGGEST** what should be in `.env` files
- ✅ **DOCUMENT** required environment variables
- ✅ **VALIDATE** configuration in code

### Why This Rule Exists

- `.env` files contain **sensitive credentials**
- `.env` files are **not tracked in git**
- `.env` files are **environment-specific**
- Reading `.env` files violates **security best practices**

### When You Encounter .env Issues

Instead of reading `.env` files:

1. **Check `env.example`** for expected format
2. **Suggest configuration validation** in code
3. **Provide troubleshooting steps** for users
4. **Document required variables** in README
5. **Add error handling** for missing/invalid config

### Example: S3 Configuration Issue

❌ **WRONG**: "Let me check your .env file to see S3 credentials"

✅ **CORRECT**: "Please verify your S3 configuration in .env file matches the format in env.example. Add validation in S3ConfigService to check for placeholder values."

---

## 📝 Code Quality Rules

### Comments and Documentation

- **ALWAYS use English** for all comments and documentation
- **MINIMIZE comments usage** - prefer self-documenting code
- Only add comments when the code logic is not obvious

### Security

- **NEVER expose sensitive data** in logs or error messages
- **Validate configuration** before using it
- **Handle errors gracefully** without revealing internals

### Error Handling

- **Provide helpful error messages** for configuration issues
- **Suggest solutions** in error messages
- **Log configuration status** without exposing secrets

---

## 🚀 Best Practices

### Configuration Management

1. Use `env.example` as template
2. Validate required variables on startup
3. Provide clear error messages for missing config
4. Never log sensitive values

### Security

1. Never read production credentials
2. Use placeholder values in examples
3. Validate configuration format
4. Handle SSL/TLS errors gracefully

### Documentation

1. Document all required environment variables
2. Provide setup instructions
3. Include troubleshooting guides
4. Keep examples up to date

---

**Remember**: Security first! Never compromise sensitive data by reading `.env` files.
