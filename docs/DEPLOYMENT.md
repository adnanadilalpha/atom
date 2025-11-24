# Deployment Guide

## Production Build

```bash
atom build
atom start
```

## Deployment Workflow Overview

ATOM ships with a deployment helper. Run it once per project per platform and commit the generated files:

```bash
# Generate configs/scripts for Vercel (default)
atom deploy vercel

# Other supported targets
atom deploy cloudflare
atom deploy docker
```

What this does:

- Writes platform config (`vercel.json`, `wrangler.toml`, `Dockerfile`, etc.)
- Adds the correct entry file, e.g. `api/atom-server.js` for Vercel
- Injects npm scripts like `deploy:vercel` so CI/hosting can call `npm run build` automatically

### Deploy via Git provider (no CLI auth required)

1. Run `atom deploy <platform>` locally.
2. Review/commit the generated files.
3. Push to GitHub/GitLab and connect the repo to your hosting provider.
4. The host reads those committed files and runs `npm install && npm run build` using its own credentials.

### Deploy via CLI (optional)

If you prefer to push directly from your machine, use the platform CLI after `atom deploy <platform>`.

## Deployment Options

### Vercel

1. Generate config:
```bash
atom deploy vercel
```

2. Deploy via CLI (optional if you already use Git):
```bash
npm run deploy:vercel   # runs atom build + vercel --prod
```

3. Git-based deploy:
   - Commit `vercel.json`, `api/atom-server.js`, and updated `package.json`.
   - Push to your repo; Vercel picks up the config automatically.

### Railway

1. Connect your GitHub repo to Railway
2. Railway auto-detects Node.js
3. Set build command: `atom build`
4. Set start command: `atom start`

### Render

1. Create new Web Service
2. Build Command: `atom build`
3. Start Command: `atom start`
4. Environment: Node

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t atom-app .
docker run -p 3000:3000 atom-app
```

### Self-Hosting

1. Build on server:
```bash
atom build
```

2. Run with PM2:
```bash
npm install -g pm2
pm2 start atom start --name atom-app
```

## Environment Variables

Set in your hosting platform:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=...
IMAGE_CDN=cloudflare
CLOUDFLARE_ACCOUNT_ID=...
```

## Static Export

For static sites:

```bash
atom build
# Generates static files in out/ directory
```

Deploy `out/` directory to:
- Netlify
- GitHub Pages
- Cloudflare Pages
- Any static host

## Edge Deployment

For Cloudflare Workers:

1. Use edge-compatible middleware
2. Generate worker file:
```javascript
const { generateCloudflareWorker } = require('atom-framework/lib/edge-deploy');
// Generate worker code
```

3. Deploy to Cloudflare Workers

