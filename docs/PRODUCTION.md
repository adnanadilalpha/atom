# Production Guide

## Environment Variables

Create `.env.production`:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
IMAGE_CDN=cloudflare
CLOUDFLARE_ACCOUNT_ID=...
```

## Performance Optimization

### 1. Enable Static Generation

Use `@Static` for pages that don't change:

```atom
@Static
@View { ... }
```

### 2. Use ISR for Dynamic Content

```atom
@Revalidate 3600  // Revalidate every hour
@View { ... }
```

### 3. Enable Streaming SSR

```atom
@Stream
@View { ... }
```

### 4. Configure Image CDN

```bash
IMAGE_CDN=cloudflare
CLOUDFLARE_ACCOUNT_ID=your_id
```

## Monitoring

### Error Logging

Errors are automatically logged. For production, integrate with:
- Sentry
- LogRocket
- Datadog

### Performance Monitoring

Add performance tracking:

```atom
@Flow Actions {
  secure_trackPerformance: async function(metrics) {
    // Send to analytics
    console.log('Performance:', metrics);
  }
};
```

## Security

### 1. Environment Variables

Never commit `.env` files. Use your hosting platform's environment variable settings.

### 2. HTTPS

Always use HTTPS in production. Most hosting platforms provide this automatically.

### 3. CORS

Configure CORS in middleware if needed:

```atom
@Flow Actions {
  handler: async function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
    next();
  }
};
```

## Scaling

### Horizontal Scaling

ATOM apps are stateless and can be scaled horizontally:
- Use a load balancer
- Share session storage (Redis) if using sessions
- Use a shared database

### Caching

- Static pages are cached automatically
- ISR pages cache with revalidation
- Image optimization results are cached

## Database Connection Pooling

For production databases:

```javascript
// app/db.js
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
module.exports = pool;
```

