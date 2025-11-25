// Build-time Static Site Generation (SSG)

const fs = require('fs');
const path = require('path');
const { getAllFiles } = require('./parser');
const HTML_LANG = process.env.ATOM_HTML_LANG || 'en';

async function generateStaticPages() {
    try {
        const DIST_DIR = path.join(process.cwd(), 'dist');
        const OUT_DIR = path.join(process.cwd(), 'out'); // Next.js-style output directory
        const APP_DIR = path.join(process.cwd(), 'app');
        
        if (!fs.existsSync(OUT_DIR)) {
            fs.mkdirSync(OUT_DIR, { recursive: true });
        }
        
        // Load SSR engine with error handling
        let SSREngine;
        try {
            SSREngine = require(path.join(DIST_DIR, 'ssr.js'));
        } catch(e) {
            console.log("   ⚠️  Could not load SSR Engine, skipping static generation:", e.message);
            return;
        }
        
        if (!SSREngine || !SSREngine.renderToString) {
            console.log("   ⚠️  SSR Engine not available, skipping static generation");
            return;
        }
        
        // Find all routes with @Static directive
        const staticRoutes = [];
        const allFiles = getAllFiles(APP_DIR);
        
        allFiles.forEach(filePath => {
            try {
                const code = fs.readFileSync(filePath, 'utf-8');
                if (/@Static/i.test(code)) {
                    const relativePath = '/' + path.relative(APP_DIR, filePath).replace('.atom', '').replace(/\\/g, '/');
                    let routePath = relativePath.replace(/\[([^\]]+)\]/g, ':$1');
                    if (routePath === '/home') routePath = '/';
                    staticRoutes.push(routePath);
                }
            } catch(e) {
                console.warn(`⚠️  Error processing file ${filePath}:`, e.message);
            }
        });
        
        if (staticRoutes.length === 0) {
            console.log("   ℹ️  No static pages found (use @Static directive)");
            return;
        }
        
        console.log(`   → Found ${staticRoutes.length} static page(s) to generate`);
        
        const bundleTag = '<script defer src="/_atom/client.js"></script>';
        
        // Include CSS link tag for static generation
        const cssLinkTag = fs.existsSync(path.join(DIST_DIR, '_atom', 'styles.css'))
            ? '<link rel="stylesheet" href="/_atom/styles.css" data-atom-css>'
            : '';

        // Generate each static page
        for (const route of staticRoutes) {
            try {
                const result = await SSREngine.renderToString(route);
                if (result && result.html) {
                    const metaTags = (result.meta || []).map(m => `<meta name="${m.name}" content="${m.content}">`).join('\n');
                    const fullHTML = `<!DOCTYPE html><html lang="${HTML_LANG}"><head><title>${result.title || "Atom App"}</title>${metaTags}<meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" href="/atom-icon.svg" type="image/svg+xml">${cssLinkTag}</head><body><div id="root">${result.html}</div>${bundleTag}</body></html>`;
                    
                    // Create directory structure
                    let filePath = route === '/' ? '/index.html' : `${route}/index.html`;
                    if (filePath.startsWith('/')) filePath = filePath.slice(1);
                    const fullPath = path.join(OUT_DIR, filePath);
                    const dir = path.dirname(fullPath);
                    
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                    
                    fs.writeFileSync(fullPath, fullHTML);
                    console.log(`   ✅ Generated: ${route} → ${filePath}`);
                }
            } catch (e) {
                console.log(`   ⚠️  Failed to generate ${route}: ${e.message}`);
            }
        }
        
        console.log(`✅ Static generation complete! Output: ${OUT_DIR}`);
    } catch (e) {
        console.log(`⚠️  Static generation error: ${e.message}`);
    }
}


module.exports = { generateStaticPages };

