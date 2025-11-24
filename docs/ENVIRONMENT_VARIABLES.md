# Environment Variables

ATOM Framework uses environment variables for configuration. This guide covers how to use and manage environment variables.

## Overview

Environment variables are used for:
- Database connections
- API keys and secrets
- Feature flags
- Deployment configuration
- Third-party service credentials

## Setting Up Environment Variables

### 1. Create `.env` File

Create `.env` in your project root:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# Authentication
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Image CDN
IMAGE_CDN=cloudflare
CLOUDFLARE_ACCOUNT_ID=your-account-id

# API Keys
API_KEY=your-api-key
STRIPE_SECRET_KEY=sk_test_...

# Feature Flags
ENABLE_FEATURE_X=true
```

### 2. Environment-Specific Files

Create separate files for different environments:

- `.env` - Default/development
- `.env.production` - Production
- `.env.local` - Local overrides (gitignored)

### 3. Access in Server Actions

```atom
@Flow Actions {
  secure_getConfig: async function() {
    return {
      apiKey: process.env.API_KEY,
      environment: process.env.NODE_ENV
    };
  }
};
```

### 4. Access in Middleware

```atom
// app/_middleware.atom
@Flow Middleware {
  handler: async function(req, res, next) {
    const apiKey = process.env.API_KEY;
    // Use in middleware
    next();
  }
};
```

## Common Environment Variables

### Database

```bash
# PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/dbname

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=mydb

# MongoDB
MONGODB_URI=mongodb://localhost:27017
DB_NAME=mydb
```

### Authentication

```bash
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRES_IN=7d
SESSION_SECRET=your-session-secret
```

### Image CDN

```bash
IMAGE_CDN=cloudflare
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
```

### API Keys

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
SENDGRID_API_KEY=SG....
```

## Security Best Practices

### 1. Never Commit `.env` Files

Add to `.gitignore`:

```
.env
.env.local
.env*.local
```

### 2. Use Strong Secrets

```bash
# ✅ Good - Long, random secret
JWT_SECRET=$(openssl rand -base64 32)

# ❌ Bad - Weak secret
JWT_SECRET=secret123
```

### 3. Use Different Secrets per Environment

```bash
# Development
JWT_SECRET=dev-secret-key

# Production
JWT_SECRET=production-secret-key-different-from-dev
```

### 4. Rotate Secrets Regularly

Change secrets periodically, especially if compromised.

### 5. Use Secret Management Services

For production:
- **Vercel**: Environment variables in dashboard
- **AWS**: Secrets Manager
- **Google Cloud**: Secret Manager
- **Azure**: Key Vault

## Accessing in Different Contexts

### Server Actions

```atom
@Flow Actions {
  secure_getEnv: async function() {
    // ✅ Available
    return process.env.API_KEY;
  }
};
```

### Client-Side

```atom
@View {
  // ❌ NOT available - process.env is server-only
  // Use Server Action to access
  const [apiKey, setApiKey] = useState(null);
  
  useEffect(() => {
    Actions.secure_getApiKey().then(setApiKey);
  }, []);
}
```

### Build Time

Environment variables are available at build time:

```atom
@Flow Actions {
  secure_getBuildInfo: async function() {
    return {
      buildTime: process.env.BUILD_TIME,
      version: process.env.VERSION
    };
  }
};
```

## Deployment Platforms

### Vercel

Set in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add variables for each environment
3. Redeploy

### Cloudflare Workers

Use `wrangler.toml`:

```toml
[env.production]
vars = { API_KEY = "production-key" }

[env.development]
vars = { API_KEY = "dev-key" }
```

### Docker

Use `docker-compose.yml`:

```yaml
services:
  app:
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    env_file:
      - .env
```

## Type Safety

For TypeScript, create `env.d.ts`:

```typescript
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    JWT_SECRET: string;
    API_KEY?: string;
  }
}
```

## Examples

### Database Connection

```javascript
// app/db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

### Authentication

```atom
@Resource jwt from 'jsonwebtoken';

@Flow Actions {
  secure_login: async function(credentials) {
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET, // From env
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    return { token };
  }
};
```

## Next Steps

- [Database Guide](./DATABASE.md) - Database configuration
- [Authentication Guide](./AUTHENTICATION.md) - Auth secrets
- [Deployment Guide](./DEPLOYMENT.md) - Production environment setup
