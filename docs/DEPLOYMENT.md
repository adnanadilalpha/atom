# Deployment Guide

## Production Build

```bash
atom build
atom start
```

## Deployment Options

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure in `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

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

