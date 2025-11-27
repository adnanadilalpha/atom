# Production Guide

ATOM’s production behavior is defined in `system/cli.js`, `system/compiler.js`, and the supporting libraries in `system/lib/*`. Use this guide to line up your deployment practices with what the framework actually does.

## Release Checklist

1. **Set environment variables** (`.env.production`, hosting dashboard, or secret manager).
2. **Build:** `atom build`
   - Compiles every `.atom` file
   - Generates `dist/client.js`, `dist/server.js`, `dist/ssr.js`
   - Copies `public/` into `dist/`
   - Runs bundle analysis via `system/lib/build-optimizer.js`
   - Generates static pages using `system/lib/static-generator.js`
3. **Smoke test:** `atom start` against the freshly built `dist/`.
4. **Review DevTools HUD:** even in prod builds you can temporarily enable the HUD to confirm performance + SEO metrics.
5. **Commit deployment artifacts** produced by `atom deploy <platform>` (e.g., `vercel.json`, `api/atom-server.js`).

## Environment Variables

Create `.env.production` (or configure them through your hosting provider):

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
IMAGE_CDN=cloudflare
CLOUDFLARE_ACCOUNT_ID=...
```

The compiler, static generator, and deployment helpers all read directly from `process.env`. Missing values surface immediately during `atom build` or at runtime, so fail fast locally before deploying.

## Performance Optimization

### 1. Static Generation (`@Static`)

```atom
@Static
@View { ... }
```

`system/lib/static-generator.js` scans for `@Static`, renders each route using `dist/ssr.js`, and outputs HTML under `out/`. Serve `out/` via a CDN or edge host for zero-latency pages.

### 2. Incremental Static Regeneration (`@Revalidate`)

```atom
@Revalidate 3600
@View { ... }
```

The runtime stores rendered output and revalidates it in the background based on the provided seconds value. Use this for feeds, docs, or dashboards that change occasionally.

### 3. Streaming SSR (`@Stream`)

```atom
@Stream
@View { ... }
```

This flag tells the renderer to flush HTML as soon as chunks are ready. It’s wired directly into the client + server runtimes emitted by `system/compiler.js`.

### 4. Image Optimization

```bash
IMAGE_CDN=cloudflare
CLOUDFLARE_ACCOUNT_ID=your_id
```

Provide CDN credentials to offload image processing. Without them the framework falls back to the built-in Sharp pipeline (see `system/lib/edge-runtime.js`).

### 5. Bundle Insights

After `atom build`, inspect the console logs from `system/lib/build-optimizer.js` to identify oversized modules, unused dependencies, and code-splitting opportunities. Keep `dist/client.js` under 300 KB whenever possible.

## Monitoring

### Error Logging

Errors are automatically reported in the terminal. For persistent monitoring, forward logs to:
- Sentry
- LogRocket
- Datadog
- Your platform’s built-in log drains

### Performance Monitoring

Capture HUD metrics server-side by exposing an action:

```atom
@Flow Actions {
  secure_trackPerformance: async function(metrics) {
    await fetch(process.env.ANALYTICS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metrics)
    });
  }
}
```

Call `secure_trackPerformance` from the HUD callback (`window.atomHUD.updateMetrics`) to stream bundle size, FCP, LCP, and CLS data into your APM.

## Security

### 1. Environment Variables

Never commit `.env*` files. Add them to `.gitignore` and rely on secret managers (Vercel envs, AWS Secrets Manager, Cloudflare vars, etc.).

### 2. HTTPS

Always terminate TLS at your hosting provider or load balancer. Redirect HTTP → HTTPS inside `_middleware.atom` if necessary.

### 3. CORS

Lock down API routes via middleware:

```atom
// app/_middleware.atom
@Flow Actions {
  handler: async function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  }
}
```

## Scaling

### Horizontal Scaling

ATOM apps are stateless as long as you externalize session/storage data:
- Use a load balancer or edge network (Vercel, Cloudflare, Fly).
- Store sessions, rate limits, or feature flags in Redis/Supabase.
- Keep a single primary database (with replicas for reads if needed).
- If using websockets (`system/lib/websocket.js`), point them to a shared broker.

### Caching

- **Static pages**: deployed from `out/`, cache at the CDN.
- **ISR pages**: cached per instance; use Redis/Memcached for cross-region reuse.
- **Images**: rely on your CDN or persist Sharp’s cache directory between deploys.

## Database Connection Pooling

Always use pooled connections in production:

```javascript
// app/db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};
```

Set `PGSSLMODE=require` (or equivalent) if your host demands SSL.

## Troubleshooting Checklist

- **Build fails** → run `atom build --verbose` (set `DEBUG=atom:*`) to see esbuild + compiler traces.
- **Static generation skipped** → ensure `@Static` is present and SSR compiled successfully.
- **RPC endpoints returning 500** → check `dist/server.js` logs for the corresponding `secure_` function.
- **Missing assets in production** → confirm `public/` files exist before build; the compiler copies them into `dist/` automatically.

## Next Steps

- [Deployment Guide](./DEPLOYMENT.md)
- [Security Guide](./SECURITY.md)
- [DevTools HUD](./DEVTOOLS.md)

