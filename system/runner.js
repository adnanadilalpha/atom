require('dotenv').config(); 

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// --- ROBUST LIBRARY LOADING ---
let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.warn("⚠️ Image Optimization Disabled:", e.message);
}

const DIST_DIR = path.join(process.cwd(), 'dist');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const ROUTES_DIR = path.join(DIST_DIR, 'routes');
const CLIENT_ROUTES_DIR = path.join(DIST_DIR, '_atom', 'routes');
const USE_STATIC_BUNDLE = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const SERVER_INSTANCE_ID = Date.now().toString();
const IS_DEV = process.env.NODE_ENV !== 'production';

let ServerFunctions = {};
let APIRoutes = [];
let SSREngine = null;

// --- LOAD COMPILED BACKEND ---
try {
    if (fs.existsSync(path.join(DIST_DIR, 'server.js'))) {
        const serverModule = require(path.join(DIST_DIR, 'server.js'));
        ServerFunctions = serverModule;
        if (serverModule.APIRoutes) APIRoutes = serverModule.APIRoutes;
    }
} catch (e) { console.log("⚠️ Error loading server functions:", e.message); }

try { 
    if (fs.existsSync(path.join(DIST_DIR, 'ssr.js'))) {
        SSREngine = require(path.join(DIST_DIR, 'ssr.js'));
    }
} catch (e) { console.log("⚠️ Error loading SSR Engine:", e.message); }

const app = express();
app.use(bodyParser.json({ strict: false }));

// --- 1. STATIC ASSETS ---
if (fs.existsSync(PUBLIC_DIR)) {
    app.use(express.static(PUBLIC_DIR));
}

// Serve generated route chunks so client-side router can fetch them
if (fs.existsSync(CLIENT_ROUTES_DIR)) {
    app.use('/_atom/routes', express.static(CLIENT_ROUTES_DIR, {
        setHeaders: (res) => {
            res.setHeader('Cache-Control', IS_DEV ? 'no-cache' : 'public, max-age=31536000, immutable');
        }
    }));
}

// Serve bundle info for DevTools
app.get('/bundle-info.json', (req, res) => {
    const bundleInfoPath = path.join(DIST_DIR, 'bundle-info.json');
    if (fs.existsSync(bundleInfoPath)) {
        res.json(JSON.parse(fs.readFileSync(bundleInfoPath, 'utf-8')));
    } else {
        res.json({ size: null, timestamp: null });
    }
});

// --- 2. USER MIDDLEWARE (NEW) ---
// If the user defined _middleware.atom, it ends up in ServerFunctions.Middleware
if (ServerFunctions.Middleware && ServerFunctions.Middleware.handler) {
    const isEdge = ServerFunctions.Middleware._edge;
    console.log(`🛡️  User Middleware Active${isEdge ? ' (Edge-Compatible)' : ''}`);
    
    app.use(async (req, res, next) => {
        try {
            // Edge-compatible middleware receives simplified request/response
            if (isEdge) {
                // Create edge-compatible request/response objects
                const edgeReq = {
                    url: req.protocol + '://' + req.get('host') + req.originalUrl,
                    method: req.method,
                    headers: req.headers,
                    path: req.path,
                    query: req.query,
                    json: async () => req.body || {},
                    text: async () => JSON.stringify(req.body || {})
                };
                
                const edgeRes = {
                    status: 200,
                    headers: new Map(),
                    json: (data) => { res.json(data); return edgeRes; },
                    text: (data) => { res.send(data); return edgeRes; },
                    html: (data) => { res.send(data); return edgeRes; },
                    redirect: (url, status = 302) => { res.redirect(status, url); return edgeRes; },
                    setHeader: (name, value) => { res.setHeader(name, value); return edgeRes; }
                };
                
                await ServerFunctions.Middleware.handler(edgeReq, edgeRes);
                
                // If response wasn't sent, continue
                if (!res.headersSent) next();
            } else {
                // Standard Express middleware
            await ServerFunctions.Middleware.handler(req, res, next);
            }
        } catch (e) {
            console.error("Middleware Error:", e);
            next(e);
        }
    });
}

// --- 3. ENHANCED IMAGE OPTIMIZATION WITH CDN SUPPORT ---
const crypto = require('crypto');
const imageCache = new Map(); // In-memory cache for optimized images

// CDN Configuration
const IMAGE_CDN = process.env.IMAGE_CDN || 'local'; // 'local', 'cloudflare', 'imagekit'
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const IMAGEKIT_URL = process.env.IMAGEKIT_URL;

// CDN URL generator
function getCDNImageUrl(url, width, height, quality, format) {
    if (IMAGE_CDN === 'cloudflare' && CLOUDFLARE_ACCOUNT_ID) {
        const params = new URLSearchParams();
        if (width) params.set('width', width);
        if (height) params.set('height', height);
        if (quality) params.set('quality', quality);
        if (format && format !== 'auto') params.set('format', format);
        return `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_ID}/${url}?${params.toString()}`;
    }
    
    if (IMAGE_CDN === 'imagekit' && IMAGEKIT_URL) {
        const params = new URLSearchParams();
        if (width) params.set('w', width);
        if (height) params.set('h', height);
        if (quality) params.set('q', quality);
        if (format && format !== 'auto') params.set('f', format);
        return `${IMAGEKIT_URL}/${url}?${params.toString()}`;
    }
    
    return null; // Use local optimization
}

app.get('/_atom/image', async (req, res) => {
    const { url, w, h, q, fmt } = req.query;
    if (!url) return res.status(400).send("Missing url");
    
    // Check if CDN should be used
    if (IMAGE_CDN !== 'local' && IMAGE_CDN !== 'none') {
        const cdnUrl = getCDNImageUrl(url, w, h, q, fmt);
        if (cdnUrl) {
            if (IS_DEV) console.log(`🌐 CDN Redirect: ${url} → ${cdnUrl}`);
            return res.redirect(cdnUrl);
        }
    }
    
    try {
        const imagePath = path.join(PUBLIC_DIR, url);
        if (!fs.existsSync(imagePath)) return res.status(404).send("Not found");
        if (!sharp) {
            // Fallback: serve original if sharp unavailable
            return res.sendFile(imagePath);
        }

        // Generate cache key
        const cacheKey = `${url}_${w || 'auto'}_${h || 'auto'}_${q || '85'}_${fmt || 'auto'}`;
        const hash = crypto.createHash('md5').update(cacheKey).digest('hex');
        
        // Check cache
        if (imageCache.has(hash)) {
            const cached = imageCache.get(hash);
            res.set('Content-Type', cached.contentType);
            res.set('Cache-Control', 'public, max-age=31536000, immutable');
            res.set('ETag', hash);
            if (IS_DEV) console.log(`🖼️  Image Cache Hit: ${url} (${w || 'auto'}x${h || 'auto'}, ${cached.contentType})`);
            return res.send(cached.buffer);
        }

        const width = w ? parseInt(w) : null;
        const height = h ? parseInt(h) : null;
        const quality = q ? parseInt(q) : 85;
        let targetFormat = fmt || 'auto';
        
        // Auto-detect best format based on Accept header
        if (targetFormat === 'auto') {
            const accept = req.headers.accept || '';
            // Check AVIF support first, but fallback to WebP if not available
            if (accept.includes('image/avif') && sharp.format.avif) {
                targetFormat = 'avif';
            } else if (accept.includes('image/webp')) {
                targetFormat = 'webp';
            } else {
                // Detect from file extension
                const ext = path.extname(url).toLowerCase();
                targetFormat = ext === '.png' ? 'png' : 'jpeg';
            }
        }
        
        // Fallback AVIF to WebP if not supported
        if (targetFormat === 'avif' && !sharp.format.avif) {
            targetFormat = 'webp';
        }
        
        // Build Sharp pipeline
        let pipeline = sharp(imagePath);
        
        // Resize if needed
        if (width || height) {
            pipeline = pipeline.resize(width, height, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }
        
        // Set format and quality
        const formatMap = {
            'jpeg': { format: 'jpeg', mime: 'image/jpeg' },
            'jpg': { format: 'jpeg', mime: 'image/jpeg' },
            'png': { format: 'png', mime: 'image/png' },
            'webp': { format: 'webp', mime: 'image/webp' },
            'avif': { format: 'avif', mime: 'image/avif' }
        };
        
        const formatInfo = formatMap[targetFormat.toLowerCase()] || formatMap['jpeg'];
        
        // Apply format and quality
        if (formatInfo.format === 'jpeg') {
            pipeline = pipeline.jpeg({ quality, mozjpeg: true });
        } else if (formatInfo.format === 'png') {
            pipeline = pipeline.png({ quality, compressionLevel: 9 });
        } else if (formatInfo.format === 'webp') {
            pipeline = pipeline.webp({ quality });
        } else if (formatInfo.format === 'avif') {
            pipeline = pipeline.avif({ quality });
        }
        
        const buffer = await pipeline.toBuffer();

        // Cache the result (limit cache size to 100 items)
        if (imageCache.size > 100) {
            const firstKey = imageCache.keys().next().value;
            imageCache.delete(firstKey);
        }
        imageCache.set(hash, { buffer, contentType: formatInfo.mime });

        res.set('Content-Type', formatInfo.mime);
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        res.set('ETag', hash);
        if (IS_DEV) console.log(`🖼️  Image Optimized: ${url} → ${width || 'auto'}x${height || 'auto'} ${formatInfo.mime} (${Math.round(buffer.length/1024)}KB)`);
        res.send(buffer);
    } catch (e) {
        // Fallback to original file
        if (IS_DEV) console.log(`⚠️  Image Optimization Failed: ${url}, serving original:`, e.message);
        try {
            res.sendFile(path.join(PUBLIC_DIR, url));
        } catch (err) {
            res.status(500).send("Image processing error");
        }
    }
});

// --- 4. SYSTEM ROUTES ---
app.get('/_atom/ping', (req, res) => res.send(SERVER_INSTANCE_ID));
app.get('/_atom/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.write(`data: connected\n\n`);
    const interval = setInterval(() => res.write(`: keepalive\n\n`), 10000);
    req.on('close', () => clearInterval(interval));
});
app.get('/bundle.js', (req, res) => res.sendFile(path.join(DIST_DIR, 'client.js')));

// --- 5. API ROUTES ---
app.use(async (req, res, next) => {
    const match = APIRoutes.find(r => r.path === req.path);
    if (match && match.handler) {
        const handler = match.handler[req.method];
        if (handler) {
            try { return res.json(await handler(req.body || req.query)); }
            catch (e) { return res.status(500).json({ error: e.message }); }
        }
    }
    next();
});

// --- 6. RPC BRIDGE WITH VALIDATION & SANITIZATION ---
app.post('/_atom/rpc/:funcName', async (req, res) => {
    const func = req.params.funcName;
    let inputData = req.body.data || req.body;
    
    // Automatic sanitization
    try {
        const sanitize = require('./lib/sanitize');
        inputData = sanitize.sanitizeObject(inputData, {
            maxLength: 10000,
            removeHTML: true
        });
    } catch (err) {
        // Sanitization not available - continue without it
    }
    
    if (ServerFunctions[func]) {
        try { 
            const result = await ServerFunctions[func](inputData);
            
            // Sanitize output (basic XSS prevention)
            let sanitizedResult = result;
            try {
                const sanitize = require('./lib/sanitize');
                sanitizedResult = sanitize.sanitizeObject(result, {
                    maxLength: 100000,
                    removeHTML: false // Allow HTML in responses if needed
                });
            } catch (err) {
                // Sanitization not available - use original result
            }
            
            if (IS_DEV) console.log(`✅ Server Action: ${func} → Success`);
            res.json(sanitizedResult);
        } 
        catch (e) { 
            const errorMessage = e.message || 'Unknown error occurred';
            const errorDetails = {
                error: errorMessage,
                function: func,
                timestamp: new Date().toISOString(),
                ...(IS_DEV && { 
                    stack: e.stack,
                    hint: `Check the implementation of secure_${func.replace(/.*_/, '')} in your Server Actions`
                })
            };
            if (IS_DEV) {
                console.log(`❌ Server Action Error: ${func}`);
                console.log(`   Message: ${errorMessage}`);
                if (e.stack) console.log(`   Stack: ${e.stack.split('\n').slice(0, 3).join('\n   ')}`);
            }
            res.status(500).json(errorDetails); 
        }
    } else { 
        const availableFunctions = Object.keys(ServerFunctions).filter(k => k.includes('_')).slice(0, 5);
        const errorDetails = {
            error: `Server Action "${func}" not found`,
            function: func,
            hint: `Ensure the function name starts with "secure_" and is defined in a @Flow Actions block`,
            ...(IS_DEV && availableFunctions.length > 0 && { 
                available: `Available functions (showing first 5): ${availableFunctions.join(', ')}`
            })
        };
        if (IS_DEV) {
            console.log(`⚠️  Server Action Not Found: ${func}`);
            if (availableFunctions.length > 0) {
                console.log(`   Available functions: ${availableFunctions.join(', ')}...`);
            }
        }
        res.status(404).json(errorDetails); 
    }
});

// --- 7. SSR HANDLER WITH CACHE CONTROL ---
const staticCache = new Map(); // Cache for static pages
const revalidateCache = new Map(); // Cache with timestamps for revalidation
const MAX_CACHE_SIZE = 100; // Limit cache size to prevent memory issues

function cleanupCache(cache, maxSize) {
    if (cache.size > maxSize) {
        // Remove oldest entries (first 20% when over limit)
        const entriesToRemove = Math.floor(maxSize * 0.2);
        const keys = Array.from(cache.keys());
        for (let i = 0; i < entriesToRemove; i++) {
            cache.delete(keys[i]);
        }
    }
}

app.get(/(.*)/, async (req, res) => {
    const url = req.params[0] || '/';
    try {
        let initialHTML = "";
        let title = "Atom App";
        let metaTags = ""; 
        let revalidate = null;
        let isStatic = false;

        if (SSREngine && SSREngine.renderToString) {
            // Check static cache first
            if (staticCache.has(url)) {
                const cached = staticCache.get(url);
                res.set('Cache-Control', 'public, max-age=31536000, immutable');
                res.set('X-ATOM-Cache', 'static');
                if (IS_DEV) console.log(`📦 Static Cache Hit: ${url}`);
                return res.send(cached.html);
            }
            
            // Check revalidate cache
            if (revalidateCache.has(url)) {
                const cached = revalidateCache.get(url);
                const age = Date.now() - cached.timestamp;
                const maxAge = cached.revalidate * 1000;
                
                if (age < maxAge) {
                    res.set('Cache-Control', `public, s-maxage=${cached.revalidate}, stale-while-revalidate=${cached.revalidate * 2}`);
                    res.set('X-ATOM-Cache', 'revalidated');
                    if (IS_DEV) console.log(`🔄 ISR Cache Hit: ${url} (age: ${Math.floor(age/1000)}s/${cached.revalidate}s)`);
                    return res.send(cached.html);
                } else {
                    if (IS_DEV) console.log(`⏰ ISR Cache Expired: ${url} (revalidating...)`);
                }
            }
            
            const result = await SSREngine.renderToString(url);
            if (result.title === '404') res.status(404);
            initialHTML = result.html;
            title = result.title;
            revalidate = result.revalidate;
            isStatic = result.isStatic;
            const streamingAllowed = process.env.ATOM_ENABLE_STREAMING === 'true';
            const enableStreaming = streamingAllowed && result.enableStreaming;
            
            if (result.meta) {
                metaTags = result.meta.map(m => `<meta name="${m.name}" content="${m.content}">`).join('\n');
            }
            
            // Streaming SSR for faster TTFB
            if (enableStreaming && SSREngine.renderToStream) {
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.setHeader('Transfer-Encoding', 'chunked');
                
                // Set cache headers before streaming
                if (isStatic) {
                    res.set('Cache-Control', 'public, max-age=31536000, immutable');
                    res.set('X-ATOM-Cache', 'static');
                } else if (revalidate && revalidate > 0) {
                    res.set('Cache-Control', `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate * 2}`);
                    res.set('X-ATOM-Cache', 'revalidated');
                } else {
                    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
                    res.set('X-ATOM-Cache', 'dynamic');
                }
                
                if (IS_DEV) console.log(`🌊 Streaming SSR: ${url}`);
                
                // Stream the response
                (async () => {
                    for await (const chunk of SSREngine.renderToStream(url)) {
                        res.write(chunk);
                    }
                    res.end();
                })();
                return;
            }
            
            // Standard SSR (non-streaming)
            const bundleTag = USE_STATIC_BUNDLE
                ? '<script defer src="/_atom/client.js"></script>'
                : '<script src="/bundle.js"></script>';
            const fullHTML = `<!DOCTYPE html><html><head><title>${title}</title>${metaTags}<meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" href="/atom-icon.svg" type="image/svg+xml"></head><body><div id="root">${initialHTML}</div>${bundleTag}</body></html>`;
            
            // Cache static pages indefinitely
            if (isStatic) {
                cleanupCache(staticCache, MAX_CACHE_SIZE);
                staticCache.set(url, { html: fullHTML });
                res.set('Cache-Control', 'public, max-age=31536000, immutable');
                res.set('X-ATOM-Cache', 'static');
                if (IS_DEV) console.log(`📦 Static Page Cached: ${url}`);
            }
            // Cache with revalidation
            else if (revalidate && revalidate > 0) {
                cleanupCache(revalidateCache, MAX_CACHE_SIZE);
                revalidateCache.set(url, { 
                    html: fullHTML, 
                    timestamp: Date.now(), 
                    revalidate 
                });
                res.set('Cache-Control', `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate * 2}`);
                res.set('X-ATOM-Cache', 'revalidated');
                if (IS_DEV) console.log(`🔄 ISR Page Cached: ${url} (revalidate: ${revalidate}s)`);
            }
            // Dynamic pages - no cache
            else {
                res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.set('X-ATOM-Cache', 'dynamic');
                if (IS_DEV) console.log(`⚡ Dynamic Page: ${url} (no cache)`);
            }
            
            res.send(fullHTML);
        } else {
            const bundleTag = USE_STATIC_BUNDLE
                ? '<script defer src="/_atom/client.js"></script>'
                : '<script src="/bundle.js"></script>';
            res.send(`<!DOCTYPE html><html><head><title>${title}</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><div id="root"></div>${bundleTag}</body></html>`);
        }
    } catch (e) { 
        res.status(500).send(`<h1>Error</h1><pre>${e.stack}</pre>`); 
    }
});

// Revalidation endpoint for on-demand ISR
app.post('/_atom/revalidate', (req, res) => {
    const { path } = req.body;
    if (!path) return res.status(400).json({ error: 'Missing path' });
    
    // Clear caches
    const wasStatic = staticCache.has(path);
    const wasRevalidated = revalidateCache.has(path);
    if (wasStatic) staticCache.delete(path);
    if (wasRevalidated) revalidateCache.delete(path);
    
    if (IS_DEV) {
        console.log(`🔄 Cache Revalidated: ${path}${wasStatic ? ' (static)' : wasRevalidated ? ' (ISR)' : ' (not cached)'}`);
    }
    
    res.json({ revalidated: true, path });
});

const PORT = process.env.PORT || 3000;

// Create HTTP server for WebSocket support
const http = require('http');
const server = http.createServer(app);

// Initialize WebSocket server if enabled
let wsServer = null;
if (process.env.ENABLE_WEBSOCKET !== 'false') {
    try {
        const WebSocketServer = require('./lib/websocket');
        wsServer = new WebSocketServer(server, {
            path: '/_atom/ws'
        });
        app.locals.wsServer = wsServer;
        if (IS_DEV) console.log(`   🔌 WebSocket server enabled at /_atom/ws`);
    } catch (error) {
        if (IS_DEV) console.warn(`   ⚠️  WebSocket support not available (install 'ws' package): ${error.message}`);
    }
}

// Function to check if a port is available
function isPortAvailable(port) {
    return new Promise((resolve) => {
        const testServer = http.createServer();
        testServer.listen(port, () => {
            testServer.close(() => {
                resolve(true);
            });
        });
        
        testServer.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false);
            } else {
                resolve(false);
            }
        });
    });
}

// Function to find next available port
function findAvailablePort(startPort, maxAttempts = 10) {
    return new Promise((resolve, reject) => {
        let currentPort = startPort;
        let attempts = 0;
        
        const tryPort = (port) => {
            if (attempts >= maxAttempts) {
                reject(new Error(`Could not find available port after ${maxAttempts} attempts`));
                return;
            }
            
            const testServer = http.createServer();
            testServer.listen(port, () => {
                testServer.close(() => {
                    resolve(port);
                });
            });
            
            testServer.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    attempts++;
                    tryPort(port + 1);
                } else {
                    reject(err);
                }
            });
        };
        
        tryPort(currentPort);
    });
}

// Start server with automatic port detection (like Next.js)
async function startServer() {
    let actualPort = PORT;
    
    // Check if requested port is available
    const portAvailable = await isPortAvailable(PORT);
    
    if (!portAvailable) {
        // Port is in use, find next available port (like Next.js)
        if (IS_DEV) {
            console.log(`⚠️  Port ${PORT} is already in use, trying next available port...`);
        }
        
        try {
            actualPort = await findAvailablePort(PORT + 1);
            if (IS_DEV) {
                console.log(`✅ Using port ${actualPort} instead`);
            }
        } catch (findErr) {
            console.error(`\n❌ Could not find available port starting from ${PORT + 1}`);
            console.error(`   Error: ${findErr.message}\n`);
            process.exit(1);
        }
    }
    
    // Now listen on the determined port
    server.listen(actualPort, () => {
        console.log(`🚀 ATOM Server running at http://localhost:${actualPort}`);
        console.log(`   📦 Routes: ${Object.keys(ServerFunctions).filter(k => k.includes('_')).length} Server Actions`);
        if (wsServer) {
            console.log(`   🔌 WebSocket: ws://localhost:${actualPort}/_atom/ws`);
        }
    });
    
    server.on('error', (err) => {
        if (err.code !== 'EADDRINUSE') {
            console.error(`\n❌ Server error: ${err.message}\n`);
            process.exit(1);
        }
    });
}

if (require.main === module) {
    startServer();
}

module.exports = app;
module.exports.startServer = startServer;
module.exports.server = server;