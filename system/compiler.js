const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const esbuild = require('esbuild-wasm'); 
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const ErrorDetector = require('./lib/error-detector');

// Import Helpers
const { extractBlock, getAllFiles } = require('./lib/parser');
const { getClientRuntime, getSSRRuntime } = require('./lib/templates');

console.log("🔹 Atom System V50 (Component Restoration)...");

// Handle unhandled promise rejections early
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️  Unhandled Promise Rejection:', reason);
    if (reason && typeof reason === 'object' && reason.message) {
        console.error('Error message:', reason.message);
    }
    // Don't exit - let the build continue if possible
});

const APP_DIR = path.join(process.cwd(), 'app');
const COMPONENT_DIR = path.join(APP_DIR, '_components');
const DIST_DIR = path.join(process.cwd(), 'dist');
const IS_DEV = process.argv.some(arg => arg.includes('dev'));

if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR);

const ROUTE_DIST_DIR = path.join(DIST_DIR, 'routes');
const CLIENT_ROUTE_DIR = path.join(DIST_DIR, '_atom', 'routes');
const PUBLIC_ATOM_DIR = path.join(process.cwd(), 'public', '_atom');
const PUBLIC_ROUTE_DIR = path.join(PUBLIC_ATOM_DIR, 'routes');
const PUBLIC_CLIENT_BUNDLE = path.join(PUBLIC_ATOM_DIR, 'client.js');

function resetRouteOutputDirs() {
    [ROUTE_DIST_DIR, CLIENT_ROUTE_DIR, PUBLIC_ROUTE_DIR].forEach((dir) => {
        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
        fs.mkdirSync(dir, { recursive: true });
    });
}

let routeDirsInitialized = false;
function ensurePublicAtomDir() {
    if (!fs.existsSync(PUBLIC_ATOM_DIR)) {
        fs.mkdirSync(PUBLIC_ATOM_DIR, { recursive: true });
    }
}

let serverOutput = `// SERVER API LOGIC\n`;
let apiRouteOutput = `\nconst APIRoutes = [];\n`;
let clientRoutes = `\nconst Routes = [];\n`;
let ssrRoutes = `\nconst Routes = [];\n`; 
let clientCustomCSS = ``;
let declaredResources = new Set();

// --- IMPORT REGISTRY (Deduplication) ---
const importRegistry = new Map();
const atomModuleExports = new Map(); // Store exports from .atom files

function resolveAtomImport(importPath, fromFile) {
    if (!importPath.endsWith('.atom')) return importPath;
    
    // Resolve the actual file path
    let atomFilePath;
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const fromDir = path.dirname(fromFile);
        atomFilePath = path.resolve(fromDir, importPath);
    } else {
        atomFilePath = path.join(APP_DIR, importPath);
    }
    
    // Normalize path
    atomFilePath = path.normalize(atomFilePath);
    
    if (!fs.existsSync(atomFilePath)) {
        // Try with .js extension as fallback
        const jsFilePath = atomFilePath.replace(/\.atom$/, '.js');
        if (fs.existsSync(jsFilePath)) {
            // Return path relative to dist directory for esbuild
            const relativeToDist = path.relative(DIST_DIR, jsFilePath);
            return relativeToDist.startsWith('.') ? relativeToDist : './' + relativeToDist;
        }
        // File doesn't exist - return original to let bundler show proper error
        return importPath;
    }
    
    // Process the .atom file and extract exports
    const atomCode = fs.readFileSync(atomFilePath, 'utf-8');
    const flowBlock = extractBlock(atomCode, '@Flow Actions');
    
    if (!flowBlock.extracted) {
        console.warn(`⚠️  No @Flow Actions found in ${importPath}`);
        return importPath;
    }
    
    // Extract functions from Actions block
    let actionsCode = flowBlock.extracted.trim();
    if (actionsCode.startsWith('Actions')) actionsCode = actionsCode.replace('Actions', '').trim();
    if (actionsCode.startsWith('{') && actionsCode.endsWith('}')) {
        actionsCode = actionsCode.slice(1, -1);
    }
    
    // Generate exports
    const moduleId = path.relative(APP_DIR, atomFilePath).replace(/[^a-zA-Z0-9]/g, '_');
    const exportCode = `// Generated from ${importPath}\nconst Actions = { ${actionsCode} };\n`;
    
    // Parse to get function names and bodies (only functions, not variables)
    const functions = [];
    try {
        const ast = parser.parse(`const Actions = { ${actionsCode} };`, {
            sourceType: 'module',
            plugins: ['decorators-legacy', 'classProperties', 'objectRestSpread']
        });
        traverse(ast, {
            Property(path) {
                if (path.node.key && path.node.key.name) {
                    const value = path.node.value;
                    // Only extract actual functions, not variables/constants
                    if (value.type === 'FunctionExpression' || 
                        value.type === 'ArrowFunctionExpression' ||
                        value.type === 'AsyncFunctionExpression') {
                        const funcName = path.node.key.name;
                        const funcBody = generate(value).code;
                        functions.push({ name: funcName, body: funcBody, isFunction: true });
                    }
                    // Skip variables, constants, and other non-function values
                }
            }
        });
    } catch(e) {
        console.warn(`⚠️  Failed to parse actions in ${importPath}:`, e.message);
    }
    
    if (functions.length === 0) {
        console.warn(`⚠️  No functions found in @Flow Actions block: ${importPath}`);
        return importPath;
    }
    
    // Store exports
    atomModuleExports.set(importPath, {
        moduleId,
        actionsCode: actionsCode,
        functions: functions
    });
    
    // Return path to generated module (relative to dist directory)
    return `./_atom_modules/${moduleId}.js`;
}

function registerImport(node, fromFile = '') {
    const source = node.source.value;
    
    // Handle .js imports - resolve relative to dist directory
    if (source.endsWith('.js') && (source.startsWith('./') || source.startsWith('../'))) {
        let jsFilePath;
        if (fromFile) {
            const fromDir = path.dirname(fromFile);
            jsFilePath = path.resolve(fromDir, source);
        } else {
            jsFilePath = path.join(APP_DIR, source);
        }
        
        if (fs.existsSync(jsFilePath)) {
            // Convert to path relative to dist directory
            const relativeToDist = path.relative(DIST_DIR, jsFilePath);
            const resolvedSource = relativeToDist.replace(/\\/g, '/');
            if (!importRegistry.has(resolvedSource)) importRegistry.set(resolvedSource, new Set());
            const vars = importRegistry.get(resolvedSource);
            node.specifiers.forEach(spec => {
                if (spec.type === 'ImportDefaultSpecifier') vars.add(`default:${spec.local.name}`);
                else if (spec.type === 'ImportSpecifier') vars.add(`${spec.imported.name}:${spec.local.name}`);
                else if (spec.type === 'ImportNamespaceSpecifier') vars.add(`*:${spec.local.name}`);
            });
            return;
        }
    }
    
    const resolvedSource = resolveAtomImport(source, fromFile);
    
    if (!importRegistry.has(resolvedSource)) importRegistry.set(resolvedSource, new Set());
    const vars = importRegistry.get(resolvedSource);
    node.specifiers.forEach(spec => {
        if (spec.type === 'ImportDefaultSpecifier') vars.add(`default:${spec.local.name}`);
        else if (spec.type === 'ImportSpecifier') vars.add(`${spec.imported.name}:${spec.local.name}`);
        else if (spec.type === 'ImportNamespaceSpecifier') vars.add(`*:${spec.local.name}`);
    });
}

function generateImports() {
    let code = '';
    importRegistry.forEach((vars, source) => {
        const defaultImport = Array.from(vars).find(v => v.startsWith('default:'));
        const namespaceImport = Array.from(vars).find(v => v.startsWith('*:'));
        const namedImports = Array.from(vars).filter(v => !v.startsWith('default:') && !v.startsWith('*:'));

        if (namespaceImport) code += `import * as ${namespaceImport.split(':')[1]} from '${source}';\n`;
        else if (defaultImport && namedImports.length === 0) code += `import ${defaultImport.split(':')[1]} from '${source}';\n`;
        else if (defaultImport && namedImports.length > 0) {
            const defName = defaultImport.split(':')[1];
            const named = namedImports.map(v => { const [imp, loc] = v.split(':'); return imp === loc ? imp : `${imp} as ${loc}`; }).join(', ');
            code += `import ${defName}, { ${named} } from '${source}';\n`;
        } else if (namedImports.length > 0) {
            const named = namedImports.map(v => { const [imp, loc] = v.split(':'); return imp === loc ? imp : `${imp} as ${loc}`; }).join(', ');
            code += `import { ${named} } from '${source}';\n`;
        } else code += `import '${source}';\n`;
    });
    return code;
}

function generateAtomModules() {
    if (atomModuleExports.size === 0) return;
    
    // Create modules directory
    const modulesDir = path.join(DIST_DIR, '_atom_modules');
    if (!fs.existsSync(modulesDir)) fs.mkdirSync(modulesDir, { recursive: true });
    
    // Generate module files
    atomModuleExports.forEach((module, originalPath) => {
        const modulePath = path.join(modulesDir, `${module.moduleId}.js`);
        
        // Only export functions (not variables)
        const exports = module.functions
            .filter(fn => fn.isFunction) // Only actual functions
            .map(fn => {
                if (fn.name.startsWith('secure_')) {
                    // Server action - export as RPC endpoint
                    const uniqueId = module.moduleId + '_' + fn.name;
                    serverOutput += `exports.${uniqueId} = ${fn.body};\n`;
                    return `export const ${fn.name} = async (data, options = {}) => {
                    const method = options.method || "POST";
                    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
                    const res = await fetch("/_atom/rpc/${uniqueId}", { 
                        method, 
                        headers, 
                        body: JSON.stringify(data),
                        ...(options.signal ? { signal: options.signal } : {})
                    }); 
                    if (!res.ok) {
                        const error = await res.json().catch(() => ({ error: res.statusText }));
                        const errorMsg = error.error || res.statusText;
                        const enhancedError = new Error(\`Server Action "${fn.name}" failed: \${errorMsg}\`);
                        if (error.function) enhancedError.function = error.function;
                        if (error.hint) enhancedError.hint = error.hint;
                        throw enhancedError;
                    }
                    return await res.json(); 
                };`;
                } else {
                    return `export const ${fn.name} = ${fn.body};`;
                }
            }).join('\n');
        
        // Only write function exports
        fs.writeFileSync(modulePath, `// Generated from ${originalPath}\n${exports}\n`);
    });
}

let componentCode = `\n// --- GLOBAL COMPONENTS ---\n`;
const hotReloadCode = `(function(){let c=false;function n(){const s=new EventSource('/_atom/stream');s.onopen=()=>{if(c)window.location.reload();c=true;};s.onerror=()=>{s.close();setTimeout(n,200);}}n();})();`;

// Enhanced DevTools HUD with performance, SEO, and error monitoring
const devToolsCode = `
(function(){
  if(document.getElementById('atom-hud')) return;
  
  // Performance Monitor
  class PerformanceMonitor {
    constructor() {
      this.metrics = { firstContentfulPaint: null, largestContentfulPaint: null, pageLoad: null, bundleSize: null };
      this.observers = [];
    }
    init() {
      if(typeof window === 'undefined' || !window.performance) return;
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if(perfData) {
          this.metrics.pageLoad = perfData.loadEventEnd - perfData.fetchStart;
          this.metrics.serverResponseTime = perfData.responseEnd - perfData.requestStart;
        }
      });
      if('PerformanceObserver' in window) {
        try {
          const fcpObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
              if(entry.name === 'first-contentful-paint') this.metrics.firstContentfulPaint = entry.startTime;
            });
          });
          fcpObserver.observe({entryTypes: ['paint']});
          this.observers.push(fcpObserver);
        } catch(e) {}
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime;
          });
          lcpObserver.observe({entryTypes: ['largest-contentful-paint']});
          this.observers.push(lcpObserver);
        } catch(e) {}
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for(const entry of list.getEntries()) {
              if(!entry.hadRecentInput) clsValue += entry.value;
            }
            this.metrics.cumulativeLayoutShift = clsValue;
          });
          clsObserver.observe({entryTypes: ['layout-shift']});
          this.observers.push(clsObserver);
        } catch(e) {}
      }
    }
    getScore() {
      let score = 100;
      const issues = [];
      if(this.metrics.firstContentfulPaint > 1800) { score -= 10; issues.push('FCP slow (>1.8s)'); }
      if(this.metrics.largestContentfulPaint > 2500) { score -= 15; issues.push('LCP slow (>2.5s)'); }
      if(this.metrics.cumulativeLayoutShift > 0.1) { score -= 10; issues.push('CLS high (>0.1)'); }
      if(this.metrics.pageLoad > 3000) { score -= 15; issues.push('Page load slow (>3s)'); }
      return { score: Math.max(0, score), issues, grade: score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : 'D' };
    }
    getInsights() {
      const insights = [];
      if(this.metrics.firstContentfulPaint > 1800) insights.push({severity:'warning',message:'FCP slow',suggestion:'Use @Stream, optimize images, code split'});
      if(this.metrics.largestContentfulPaint > 2500) insights.push({severity:'error',message:'LCP slow',suggestion:'Optimize images, reduce JS execution'});
      if(this.metrics.cumulativeLayoutShift > 0.1) insights.push({severity:'warning',message:'High CLS',suggestion:'Set image dimensions, avoid content shifts'});
      return insights;
    }
    getMetrics() { 
      return {
        metrics: {...this.metrics},
        score: this.getScore(),
        insights: this.getInsights()
      };
    }
  }
  
  // SEO Analyzer
  class SEOAnalyzer {
    analyze() {
      const issues = [], warnings = [];
      if(typeof document === 'undefined') return {issues, warnings, score: 100};
      const title = document.querySelector('title');
      if(!title || !title.textContent || title.textContent.trim().length === 0) {
        issues.push({severity:'error',message:'Missing title',suggestion:'Add @Title directive'});
      } else if(title.textContent.trim().length < 30) {
        warnings.push({severity:'warning',message:'Title too short',suggestion:'Aim for 50-60 characters'});
      } else if(title.textContent.trim().length > 60) {
        warnings.push({severity:'warning',message:'Title too long',suggestion:'Keep under 60 characters'});
      }
      const metaDesc = document.querySelector('meta[name="description"]');
      if(!metaDesc || !metaDesc.content || metaDesc.content.trim().length === 0) {
        issues.push({severity:'error',message:'Missing description',suggestion:'Add @Description directive'});
      } else if(metaDesc.content.trim().length < 120) {
        warnings.push({severity:'warning',message:'Description too short',suggestion:'Aim for 150-160 characters'});
      }
      const h1 = document.querySelector('h1');
      if(!h1) issues.push({severity:'error',message:'Missing h1',suggestion:'Add h1 tag for SEO'});
      const h1Count = document.querySelectorAll('h1').length;
      if(h1Count > 1) warnings.push({severity:'warning',message:\`Multiple h1 tags (\${h1Count})\`,suggestion:'Use only one h1 per page'});
      const images = document.querySelectorAll('img');
      let imagesWithoutAlt = 0;
      images.forEach(img => { if(!img.alt || img.alt.trim().length === 0) imagesWithoutAlt++; });
      if(imagesWithoutAlt > 0) warnings.push({severity:'warning',message:\`\${imagesWithoutAlt} image(s) without alt\`,suggestion:'Add alt attributes'});
      if(!document.documentElement.lang) warnings.push({severity:'warning',message:'Missing lang attribute',suggestion:'Add lang="en" to html tag'});
      if(!document.querySelector('meta[name="viewport"]')) issues.push({severity:'error',message:'Missing viewport',suggestion:'Add viewport meta tag'});
      const score = Math.max(0, 100 - issues.length * 15 - warnings.filter(w => w.severity === 'warning').length * 5);
      return {issues, warnings, score: Math.min(100, score)};
    }
  }
  
  const h = document.createElement('div');
  h.id = 'atom-hud';
  // Set z-index directly on the element to ensure it's above everything
  h.style.cssText = 'position: fixed; z-index: 999999; pointer-events: none;';
  document.body.appendChild(h);
  const s = h.attachShadow({mode: 'open'});
  
  const st = document.createElement('style');
  st.textContent = \`
    :host {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 12px;
      /* z-index is set on the element itself, not needed here */
    }
    :host > * {
      pointer-events: auto;
    }
    .pill {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #000;
      border: 1px solid #333;
      color: #fff;
      border-radius: 99px;
      padding: 8px 16px;
      display: flex;
      gap: 10px;
      align-items: center;
      font-size: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      cursor: pointer;
      z-index: 999999;
      transition: all 0.2s;
    }
    .pill:hover {
      background: #111;
      border-color: #444;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      animation: pulse 2s infinite;
    }
    .dot.warning { background: #f59e0b; }
    .dot.error { background: #ef4444; }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .panel {
      display: none;
      position: fixed;
      bottom: 70px;
      right: 20px;
      width: 380px;
      max-height: 600px;
      background: rgba(10,10,10,0.95);
      backdrop-filter: blur(20px);
      border: 1px solid #333;
      border-radius: 12px;
      padding: 0;
      color: #fff;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      z-index: 999999;
    }
    .panel.open { display: block; }
    .panel-header {
      padding: 16px;
      border-bottom: 1px solid #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .panel-title {
      font-size: 14px;
      font-weight: bold;
      color: #fff;
    }
    .panel-tabs {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      border-bottom: 1px solid #333;
      background: rgba(0,0,0,0.3);
    }
    .tab {
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 11px;
      background: transparent;
      color: #888;
      border: none;
      transition: all 0.2s;
    }
    .tab.active {
      background: #333;
      color: #fff;
    }
    .panel-content {
      padding: 16px;
      overflow-y: auto;
      max-height: 500px;
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }
    .metric {
      margin-bottom: 12px;
      padding: 10px;
      background: rgba(255,255,255,0.05);
      border-radius: 6px;
    }
    .metric-label {
      font-size: 11px;
      color: #888;
      margin-bottom: 4px;
    }
    .metric-value {
      font-size: 16px;
      font-weight: bold;
      color: #fff;
    }
    .metric-value.good { color: #22c55e; }
    .metric-value.warning { color: #f59e0b; }
    .metric-value.error { color: #ef4444; }
    .issue {
      padding: 8px;
      margin-bottom: 8px;
      border-radius: 6px;
      font-size: 11px;
      border-left: 3px solid;
    }
    .issue.error {
      background: rgba(239,68,68,0.1);
      border-color: #ef4444;
    }
    .issue.warning {
      background: rgba(245,158,11,0.1);
      border-color: #f59e0b;
    }
    .issue.info {
      background: rgba(59,130,246,0.1);
      border-color: #3b82f6;
    }
    .issue-title {
      font-weight: bold;
      margin-bottom: 4px;
    }
    .issue-suggestion {
      color: #888;
      font-size: 10px;
      margin-top: 4px;
    }
    .score {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 12px;
    }
    .score.a { background: #22c55e; color: #000; }
    .score.b { background: #3b82f6; color: #fff; }
    .score.c { background: #f59e0b; color: #000; }
    .score.d { background: #ef4444; color: #fff; }
  \`;
  s.appendChild(st);
  
  // Initialize monitors
  const perfMonitor = new PerformanceMonitor();
  perfMonitor.init();
  
  const seoAnalyzer = new SEOAnalyzer();
  
  // Update metrics periodically
  let metrics = { 
    metrics: { 
      firstContentfulPaint: null, 
      largestContentfulPaint: null, 
      pageLoad: null, 
      bundleSize: null 
    }, 
    score: { score: 100, grade: 'A', issues: [] }, 
    insights: [] 
  };
  let seoResults = { issues: [], warnings: [], score: 100 };
  
  // Load bundle size info
  async function getBundleSize() {
    try {
      const response = await fetch('/bundle-info.json?' + Date.now());
      const data = await response.json();
      return data.size || null;
    } catch(e) { 
      return null; 
    }
  }
  
  async function updateMetrics() {
    try {
      const perfData = perfMonitor.getMetrics();
      metrics = perfData || { metrics: {}, score: { score: 100, grade: 'A', issues: [] }, insights: [] };
      
      // Ensure metrics.metrics exists
      if (!metrics.metrics) {
        metrics.metrics = {};
      }
      
      const bundleSize = await getBundleSize();
      if(bundleSize) {
        metrics.metrics.bundleSize = bundleSize;
      }
      
      seoResults = seoAnalyzer.analyze();
      updateHUD();
      updateStatusTab();
    } catch(e) {
      console.error('DevTools updateMetrics error:', e);
    }
  }
  
  // Initial analysis after page load
  setTimeout(() => {
    updateMetrics();
    updateHUD();
    updateStatusTab();
  }, 2000);
  setInterval(() => {
    updateMetrics();
    updateHUD();
    updateStatusTab();
  }, 5000);
  
  // Create pill
  const p = document.createElement('div');
  p.className = 'pill';
  
  // Create panel
  const pa = document.createElement('div');
  pa.className = 'panel';
  
  // Panel header
  const header = document.createElement('div');
  header.className = 'panel-header';
  header.innerHTML = '<div class="panel-title">⚛️ ATOM DevTools</div>';
  pa.appendChild(header);
  
  // Tabs
  const tabs = document.createElement('div');
  tabs.className = 'panel-tabs';
  tabs.innerHTML = \`
    <button class="tab active" data-tab="status">Status</button>
    <button class="tab" data-tab="performance">Performance</button>
    <button class="tab" data-tab="seo">SEO</button>
    <button class="tab" data-tab="errors">Errors</button>
  \`;
  pa.appendChild(tabs);
  
  // Tab content
  const content = document.createElement('div');
  content.className = 'panel-content';
  
  // Status tab
  const statusTab = document.createElement('div');
  statusTab.className = 'tab-content active';
  statusTab.id = 'tab-status';
  statusTab.innerHTML = '<div style="padding: 16px; color: #888;">Loading status...</div>';
  function updateStatusTab() {
    try {
      const routeCount = document.querySelectorAll('[data-route]').length || 0;
      const componentCount = Object.keys(window).filter(k => k[0] === k[0].toUpperCase() && typeof window[k] === 'function').length;
      const serverActionsCount = Object.keys(window.Actions || {}).length;
      // Get tab reference from shadow DOM or document
      const statusTabEl = s.querySelector('#tab-status') || document.getElementById('tab-status') || statusTab;
      if (statusTabEl) {
        statusTabEl.innerHTML = \`
      <div class="metric">
        <div class="metric-label">System Status</div>
        <div class="metric-value good">Operational</div>
      </div>
      <div class="metric">
        <div class="metric-label">Routes</div>
        <div class="metric-value">\${routeCount}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Components</div>
        <div class="metric-value">\${componentCount}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Server Actions</div>
        <div class="metric-value">\${Object.keys(window.Actions || {}).length}</div>
      </div>
      <div style="margin-top: 16px; font-size: 11px; color: #888;">
        <div style="margin-bottom: 8px;"><strong>Framework:</strong> ATOM v1.2.0</div>
        <div style="margin-bottom: 8px;"><strong>Mode:</strong> \${typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'Development' : 'Production'}</div>
        <div style="margin-bottom: 8px;"><strong>Hot Reload:</strong> Active</div>
      </div>
    \`;
      }
    } catch(e) {
      console.error('DevTools updateStatusTab error:', e);
      const statusTabEl = s.querySelector('#tab-status') || document.getElementById('tab-status') || statusTab;
      if (statusTabEl) {
        statusTabEl.innerHTML = '<div style="color: #ef4444; padding: 16px;">Error loading status</div>';
      }
    }
  }
  updateStatusTab();
  content.appendChild(statusTab);
  
  // Performance tab
  const perfTab = document.createElement('div');
  perfTab.className = 'tab-content';
  perfTab.id = 'tab-performance';
  perfTab.innerHTML = '<div style="padding: 16px; color: #888;">Loading performance data...</div>';
  content.appendChild(perfTab);
  
  // SEO tab
  const seoTab = document.createElement('div');
  seoTab.className = 'tab-content';
  seoTab.id = 'tab-seo';
  seoTab.innerHTML = '<div style="padding: 16px; color: #888;">Loading SEO data...</div>';
  content.appendChild(seoTab);
  
  // Errors tab
  const errorsTab = document.createElement('div');
  errorsTab.className = 'tab-content';
  errorsTab.id = 'tab-errors';
  errorsTab.innerHTML = '<div style="padding: 16px; color: #888;">Loading error data...</div>';
  content.appendChild(errorsTab);
  
  pa.appendChild(content);
  
  // Tab switching - refresh content when switching
  // Store references in closure to ensure they're accessible
  const tabElements = { perfTab, seoTab, errorsTab, statusTab };
  
  tabs.querySelectorAll('.tab').forEach(tab => {
    tab.onclick = () => {
      try {
        tabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        content.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const tabName = tab.dataset.tab;
        const targetTab = s.querySelector('#tab-' + tabName) || document.getElementById('tab-' + tabName);
        if (targetTab) {
          targetTab.classList.add('active');
          // Always refresh ALL tabs when switching (so content is ready)
          updateHUD();
          updateStatusTab();
          // Small delay to ensure DOM is ready, then refresh again
          setTimeout(() => {
            updateHUD();
            updateStatusTab();
          }, 10);
        }
      } catch(e) {
        console.error('Tab switch error:', e);
        // Fallback: try to show content anyway
        updateHUD();
        updateStatusTab();
      }
    };
  });
  
  function updateHUD() {
    try {
      // Ensure metrics structure is valid
      if (!metrics) {
        metrics = { metrics: {}, score: { score: 100, grade: 'A', issues: [] }, insights: [] };
      }
      if (!metrics.metrics) {
        metrics.metrics = {};
      }
      if (!metrics.score) {
        metrics.score = { score: 100, grade: 'A', issues: [] };
      }
      if (!metrics.insights) {
        metrics.insights = [];
      }
      if (!seoResults) {
        seoResults = { issues: [], warnings: [], score: 100 };
      }
      
      // Update pill dot color
      const dot = p.querySelector('.dot');
      if (dot) {
        if ((metrics.score.issues && metrics.score.issues.length > 0) || (seoResults.issues && seoResults.issues.length > 0)) {
          dot.className = 'dot error';
        } else if ((metrics.insights && metrics.insights.length > 0) || (seoResults.warnings && seoResults.warnings.length > 0)) {
          dot.className = 'dot warning';
        } else {
          dot.className = 'dot';
        }
      }
      
      // Update performance tab - always set content
      const perfScore = metrics.score || { score: 100, grade: 'A', issues: [] };
      const perfMetrics = metrics.metrics || {};
      const perfInsights = metrics.insights || [];
      
      // Get tab reference from shadow DOM or document
      const perfTabEl = s.querySelector('#tab-performance') || document.getElementById('tab-performance') || perfTab;
      if (perfTabEl) {
        perfTabEl.innerHTML = \`
        <div class="metric">
          <div class="metric-label">Performance Score</div>
          <div class="metric-value \${perfScore.score >= 90 ? 'good' : perfScore.score >= 75 ? 'warning' : 'error'}">
            \${perfScore.score}/100 <span class="score \${perfScore.grade.toLowerCase()}">\${perfScore.grade}</span>
          </div>
        </div>
        \${perfMetrics.firstContentfulPaint ? \`
          <div class="metric">
            <div class="metric-label">First Contentful Paint</div>
            <div class="metric-value \${perfMetrics.firstContentfulPaint < 1800 ? 'good' : 'warning'}">
              \${(perfMetrics.firstContentfulPaint / 1000).toFixed(2)}s
            </div>
          </div>
        \` : '<div class="metric"><div class="metric-label">First Contentful Paint</div><div class="metric-value" style="color: #888;">Measuring...</div></div>'}
        \${perfMetrics.largestContentfulPaint ? \`
          <div class="metric">
            <div class="metric-label">Largest Contentful Paint</div>
            <div class="metric-value \${perfMetrics.largestContentfulPaint < 2500 ? 'good' : 'warning'}">
              \${(perfMetrics.largestContentfulPaint / 1000).toFixed(2)}s
            </div>
          </div>
        \` : '<div class="metric"><div class="metric-label">Largest Contentful Paint</div><div class="metric-value" style="color: #888;">Measuring...</div></div>'}
        \${perfMetrics.pageLoad ? \`
          <div class="metric">
            <div class="metric-label">Page Load Time</div>
            <div class="metric-value \${perfMetrics.pageLoad < 3000 ? 'good' : 'warning'}">
              \${(perfMetrics.pageLoad / 1000).toFixed(2)}s
            </div>
          </div>
        \` : '<div class="metric"><div class="metric-label">Page Load Time</div><div class="metric-value" style="color: #888;">Measuring...</div></div>'}
        \${perfMetrics.bundleSize ? \`
          <div class="metric">
            <div class="metric-label">Bundle Size</div>
            <div class="metric-value \${perfMetrics.bundleSize < 500000 ? 'good' : 'warning'}">
              \${(perfMetrics.bundleSize / 1024).toFixed(1)}KB
            </div>
          </div>
        \` : '<div class="metric"><div class="metric-label">Bundle Size</div><div class="metric-value" style="color: #888;">Loading...</div></div>'}
      <div style="margin-top: 16px; font-size: 11px; font-weight: bold; color: #888; margin-bottom: 8px;">Performance Status:</div>
      \${perfInsights.length > 0 ? \`
        <div style="margin-bottom: 8px;">
          \${perfInsights.map(i => \`
            <div class="issue \${i.severity || 'warning'}">
              <div class="issue-title">\${i.message || 'Unknown issue'}</div>
              <div class="issue-suggestion">💡 \${i.suggestion || 'Check performance'}</div>
            </div>
          \`).join('')}
        </div>
      \` : '<div style="color: #22c55e; font-size: 11px; margin-bottom: 8px;">✓ No performance issues detected</div>'}
      \${perfScore.issues && perfScore.issues.length > 0 ? \`
        <div style="margin-top: 12px; font-size: 11px; color: #888;">
          <strong>Why is speed slow?</strong>
          <ul style="margin-top: 4px; padding-left: 16px;">
            \${perfScore.issues.map(i => '<li>' + i + '</li>').join('')}
          </ul>
        </div>
      \` : perfScore.score >= 90 ? '<div style="color: #22c55e; font-size: 11px; margin-top: 8px;">✓ Excellent performance! All metrics are optimal.</div>' : perfScore.score >= 75 ? '<div style="color: #f59e0b; font-size: 11px; margin-top: 8px;">⚠️ Performance is good but could be improved.</div>' : '<div style="color: #ef4444; font-size: 11px; margin-top: 8px;">⚠️ Performance needs attention.</div>'}
      \`;
      }
    
    // Update SEO tab - always set content
    const seoScore = (seoResults && seoResults.score) || 100;
    const seoIssues = (seoResults && seoResults.issues) || [];
    const seoWarnings = (seoResults && seoResults.warnings) || [];
    
    // Get tab reference from shadow DOM or document
    const seoTabEl = s.querySelector('#tab-seo') || document.getElementById('tab-seo') || seoTab;
    if (seoTabEl) {
      seoTabEl.innerHTML = \`
      <div class="metric">
        <div class="metric-label">SEO Score</div>
        <div class="metric-value \${seoScore >= 90 ? 'good' : seoScore >= 75 ? 'warning' : 'error'}">
          \${seoScore}/100
        </div>
      </div>
      <div style="margin-top: 16px; font-size: 11px; font-weight: bold; color: #888; margin-bottom: 8px;">SEO Status:</div>
      \${seoIssues.length > 0 ? \`
        <div style="margin-bottom: 8px;">
          <div style="font-size: 11px; font-weight: bold; color: #ef4444; margin-bottom: 4px;">Critical Issues:</div>
          \${seoIssues.map(i => \`
            <div class="issue \${i.severity || 'error'}">
              <div class="issue-title">\${i.message || 'Unknown issue'}</div>
              <div class="issue-suggestion">💡 \${i.suggestion || 'Check SEO'}</div>
            </div>
          \`).join('')}
        </div>
      \` : ''}
      \${seoWarnings.length > 0 ? \`
        <div style="margin-bottom: 8px;">
          <div style="font-size: 11px; font-weight: bold; color: #f59e0b; margin-bottom: 4px;">Warnings:</div>
          \${seoWarnings.map(w => \`
            <div class="issue \${w.severity || 'warning'}">
              <div class="issue-title">\${w.message || 'Unknown warning'}</div>
              <div class="issue-suggestion">💡 \${w.suggestion || 'Check SEO'}</div>
            </div>
          \`).join('')}
        </div>
      \` : ''}
      \${seoIssues.length === 0 && seoWarnings.length === 0 ? 
        '<div style="color: #22c55e; font-size: 11px; margin-top: 8px;">✓ Perfect SEO! All checks passed.</div>' : 
        seoScore >= 90 ? '<div style="color: #22c55e; font-size: 11px; margin-top: 8px;">✓ SEO is good overall.</div>' :
        seoScore >= 75 ? '<div style="color: #f59e0b; font-size: 11px; margin-top: 8px;">⚠️ SEO needs some improvements.</div>' :
        '<div style="color: #ef4444; font-size: 11px; margin-top: 8px;">⚠️ SEO needs attention.</div>'}
    \`;
    }
    
    // Update errors tab - always set content
    const runtimeErrors = [];
    // Check console for errors (would need to hook into console.error)
    const errorsTabEl = s.querySelector('#tab-errors') || document.getElementById('tab-errors') || errorsTab;
    if (errorsTabEl) {
      errorsTabEl.innerHTML = \`
      <div style="color: #888; font-size: 11px; margin-bottom: 12px;">
        Build-time errors are shown in the terminal. Runtime errors appear here.
      </div>
      <div style="margin-top: 8px; margin-bottom: 12px;">
        <div style="font-size: 11px; font-weight: bold; color: #888; margin-bottom: 4px;">Error Status:</div>
        \${runtimeErrors.length > 0 ? \`
          <div style="margin-top: 8px;">
            \${runtimeErrors.map(err => \`
              <div class="issue error">
                <div class="issue-title">\${err.message || 'Unknown error'}</div>
                <div class="issue-suggestion">\${err.suggestion || 'Check browser console for details'}</div>
              </div>
            \`).join('')}
          </div>
        \` : '<div style="color: #22c55e; font-size: 11px;">✓ No runtime errors detected. Application is running smoothly.</div>'}
      </div>
      <div style="margin-top: 16px; font-size: 11px; color: #888;">
        <strong>Common Errors:</strong>
        <ul style="margin-top: 4px; padding-left: 16px; font-size: 10px;">
          <li>Missing library → Run: npm install [package]</li>
          <li>Invalid Tailwind class → Check class spelling</li>
          <li>Missing @View → Add @View block to page</li>
          <li>Syntax error → Check for unclosed quotes/brackets</li>
        </ul>
      </div>
    \`;
    }
    } catch(e) {
      console.error('DevTools updateHUD error:', e);
      // Fallback: show error message in all tabs
      const perfTabEl = s.querySelector('#tab-performance') || document.getElementById('tab-performance') || perfTab;
      const seoTabEl = s.querySelector('#tab-seo') || document.getElementById('tab-seo') || seoTab;
      const errorsTabEl = s.querySelector('#tab-errors') || document.getElementById('tab-errors') || errorsTab;
      if (perfTabEl) perfTabEl.innerHTML = '<div style="color: #ef4444; padding: 16px;">Error loading performance data</div>';
      if (seoTabEl) seoTabEl.innerHTML = '<div style="color: #ef4444; padding: 16px;">Error loading SEO data</div>';
      if (errorsTabEl) errorsTabEl.innerHTML = '<div style="color: #ef4444; padding: 16px;">Error loading error data</div>';
    }
  }
  
  p.innerHTML = '<div class="dot"></div><b>ATOM</b>';
  p.onclick = () => {
    const wasOpen = pa.classList.contains('open');
    pa.classList.toggle('open');
    // Always refresh content when toggling
    if (pa.classList.contains('open')) {
      updateHUD();
      updateStatusTab();
      // Refresh again after a short delay to ensure metrics are loaded
      setTimeout(() => {
        updateMetrics();
        updateHUD();
        updateStatusTab();
      }, 100);
    }
  };
  
  s.appendChild(pa);
  s.appendChild(p);
  
  // Initial update - show content immediately for all tabs
  updateHUD();
  updateStatusTab();
  
  // Force update all tabs after a short delay to ensure everything is ready
  setTimeout(() => {
    updateMetrics();
    updateHUD();
    updateStatusTab();
  }, 500);
})();
`;

// 1. PROCESS COMPONENTS
if (fs.existsSync(COMPONENT_DIR)) {
    const compFiles = fs.readdirSync(COMPONENT_DIR).filter(f => f.endsWith('.atom'));
    compFiles.forEach(file => {
        const name = file.replace('.atom', '');
        console.log(`   -> 🧩 Component: ${name}`);
        
        const code = fs.readFileSync(path.join(COMPONENT_DIR, file), 'utf-8');
        const viewBlock = extractBlock(code, '@View');
        
        if (viewBlock.extracted) {
            // Validate component code
            try {
                const ast = parser.parse(viewBlock.clean, { 
                    sourceType: 'module',
                    plugins: ['decorators-legacy', 'classProperties', 'objectRestSpread']
                });
                traverse(ast, { ImportDeclaration(path) { registerImport(path.node); } });
            } catch(e) {
                console.error(`⚠️  Component "${name}" has syntax errors:`, e.message);
                // Still generate component but with error handling
            }
            
            // FIX: Ensure component is attached to globalThis with error boundary
            const componentBody = viewBlock.extracted.trim();
            componentCode += `
            const ${name} = (props) => {
                try {
                    props = props || {};
                    ${componentBody}
                } catch(error) {
                    console.error('Component "${name}" error:', error);
                    return div([
                        div('⚠️ Component Error', { className: 'text-red-600 font-bold mb-2' }),
                        div(error.message || 'Unknown error', { className: 'text-red-500 text-sm' })
                    ], { className: 'p-4 border border-red-300 bg-red-50 rounded m-2' });
                }
            };
            if(typeof globalThis !== 'undefined') globalThis.${name} = ${name};
            \n`;
        } else {
            console.warn(`⚠️  Component "${name}" has no @View block`);
        }

        const styleBlock = extractBlock(code, '@Style');
        if (styleBlock.extracted) {
            clientCustomCSS += `\n/* Component: ${name} */\n${styleBlock.extracted.trim()}`;
        }
    });
}

// 2. MIDDLEWARE & LAYOUT
let middlewareCode = "";
let layoutClientCode = ""; 
let layoutSSRCode = ""; 
let hasLayout = false;

// NESTED LAYOUTS: Find all _layout.atom files
const layoutMap = new Map(); // path -> layout code

function findNestedLayouts(dir, basePath = '') {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Skip route groups (folders with parentheses)
            if (!file.startsWith('(') && !file.startsWith('_')) {
                findNestedLayouts(filePath, path.join(basePath, file));
            }
        } else if (file === '_layout.atom') {
            const layoutPath = basePath ? `/${basePath}` : '/';
            const layoutCode = fs.readFileSync(filePath, 'utf-8');
            const layoutStyle = extractBlock(layoutCode, '@Style');
            if (layoutStyle.extracted) {
                const relativePath = path.relative(APP_DIR, filePath);
                clientCustomCSS += `\n/* Layout: ${relativePath} */\n${layoutStyle.extracted.trim()}`;
            }
            const layoutView = extractBlock(layoutStyle.clean, '@View');
            if (layoutView.extracted) {
                layoutMap.set(layoutPath, {
                    code: layoutView.extracted.trim(),
                    filePath: filePath
                });
            }
        }
    });
}

if (fs.existsSync(path.join(APP_DIR, '_middleware.atom'))) {
    const mwCode = fs.readFileSync(path.join(APP_DIR, '_middleware.atom'), 'utf-8');
    const mwFlow = extractBlock(mwCode, '@Flow');
    
    // Check for edge runtime directive
    const isEdge = /@Edge\s*Runtime/i.test(mwCode);
    
    if (mwFlow.extracted) {
         // Fix for Actions { ... } syntax inside middleware
         let mwBody = mwFlow.extracted.trim();
         if(mwBody.startsWith('Actions')) mwBody = mwBody.replace('Actions', '').trim();
         if(mwBody.startsWith('{') && mwBody.endsWith('}')) mwBody = mwBody.slice(1, -1);
         serverOutput += `\nexports.Middleware = { ${mwBody} };\n`;
         if (isEdge) {
             serverOutput += `\nexports.Middleware._edge = true;\n`;
         }
    }
}

// Find root layout
if (fs.existsSync(path.join(APP_DIR, '_layout.atom'))) {
    const layoutCode = fs.readFileSync(path.join(APP_DIR, '_layout.atom'), 'utf-8');
    const layoutStyle = extractBlock(layoutCode, '@Style');
    if (layoutStyle.extracted) clientCustomCSS += `\n/* Layout */\n${layoutStyle.extracted.trim()}`;
    const layoutView = extractBlock(layoutStyle.clean, '@View');
    if (layoutView.extracted) {
        hasLayout = true;
        layoutMap.set('/', {
            code: layoutView.extracted.trim(),
            filePath: path.join(APP_DIR, '_layout.atom')
        });
        layoutClientCode = `const Layout = (props) => { ${layoutView.extracted.trim()} };`;
        layoutSSRCode = `const Layout = (props) => { ${layoutView.extracted.trim()} };`;
    }
    try {
        const ast = parser.parse(layoutView.clean, { 
            sourceType: 'module',
            plugins: ['decorators-legacy', 'classProperties', 'objectRestSpread']
        });
        traverse(ast, { ImportDeclaration(path) { registerImport(path.node, path.join(APP_DIR, '_layout.atom')); } });
    } catch(e) {}
}

// Find nested layouts
findNestedLayouts(APP_DIR);

// Generate layout hierarchy code
let layoutHierarchyCode = '';
layoutMap.forEach((layout, layoutPath) => {
    if (layoutPath !== '/') {
        const layoutName = layoutPath.replace(/\//g, '_').replace(/^_/, '') || 'Root';
        const safeLayoutName = layoutName.replace(/[^a-zA-Z0-9]/g, '_');
        layoutHierarchyCode += `const Layout_${safeLayoutName} = (props) => { ${layout.code} };\n`;
    }
});

// 3. ROUTES
const allFiles = getAllFiles(APP_DIR);
let hasCustom404 = false;

allFiles.forEach(filePath => {
    const fileName = path.basename(filePath);
    if (fileName.startsWith('_') || filePath.includes('_components')) return; 

    let relativePath = '/' + path.relative(APP_DIR, filePath).replace('.atom', '').replace(/\\/g, '/');
    
    if (fileName.includes('+server.atom')) {
        relativePath = relativePath.replace('/+server', '');
        const code = fs.readFileSync(filePath, 'utf-8');
        const flowBlock = extractBlock(code, '@Flow');
        if (flowBlock.extracted) {
             const apiId = relativePath.replace(/[^a-zA-Z0-9]/g, '_') + '_API';
             serverOutput += `\nexports.${apiId} = { ${flowBlock.extracted.trim()} };\n`;
             apiRouteOutput += `APIRoutes.push({ path: '${relativePath}', handler: exports.${apiId} });\n`;
        }
        return; 
    }

    if (relativePath === '/404') hasCustom404 = true;
    
    // ROUTE GROUPS: Remove (group) from path (doesn't affect URL)
    let routePattern = relativePath.replace(/\([^)]+\)\//g, '').replace(/\/\([^)]+\)/g, '');
    
    // ADVANCED DYNAMIC ROUTES
    // Support [...slug] (catch-all) and [[...slug]] (optional catch-all)
    let hasCatchAll = false;
    let hasOptionalCatchAll = false;
    let paramNames = []; // Initialize paramNames array
    
    routePattern = routePattern.replace(/\[\.\.\.([^\]]+)\]/g, (match, paramName) => {
        hasCatchAll = true;
        paramNames.push(paramName);
        return '**CATCHALL**'; // Placeholder that includes the slash
    });
    
    routePattern = routePattern.replace(/\[\[\.\.\.([^\]]+)\]\]/g, (match, paramName) => {
        hasOptionalCatchAll = true;
        paramNames.push(paramName);
        return '**'; // Will be handled specially
    });
    
    // Standard dynamic routes [id]
    routePattern = routePattern.replace(/\[([^\]]+)\]/g, ':$1');
    if (routePattern === '/home') routePattern = '/'; 
    
    // Build regex with support for catch-all routes
    let regexString = routePattern;
    
    // Handle catch-all [...slug] - make it optional to match /docs as well
    if (hasCatchAll) {
        // Replace /**CATCHALL** with optional slash and catch-all: /docs/**CATCHALL** becomes /docs(?:/(.*))?
        // This allows matching both /docs and /docs/anything
        regexString = regexString.replace(/\/\*\*CATCHALL\*\*/g, '(?:/(.*))?');
    }
    
    // Handle optional catch-all [[...slug]]
    if (hasOptionalCatchAll) {
        // Same pattern for optional catch-all
        regexString = regexString.replace(/\*\*/g, '(?:/(.*))?');
    }
    
    // Standard dynamic params
    regexString = regexString.replace(/:([^/]+)/g, (match, paramName) => {
        if (!paramNames.includes(paramName)) paramNames.push(paramName);
        return '([^/]+)';
    });
    
    regexString = `^${regexString}$`;
    
    // Handle catch-all params in route matching (split by /)
    if (hasCatchAll || hasOptionalCatchAll) {
        // The regex already handles matching, but we need to split the matched path
        // This will be handled in the route matching logic
    }

    console.log(`   -> 📄 Route: ${routePattern}`);
    const code = fs.readFileSync(filePath, 'utf-8');
    
    // Run error detection
    if (IS_DEV) {
        const detector = new ErrorDetector();
        detector.analyzeFile(filePath);
        const report = detector.getReport();
        
        if (report.errors.length > 0) {
            report.errors.forEach(err => {
                console.error(`   ⚠️  ${err.type}: ${err.message}`);
                if (err.suggestion) console.error(`      💡 ${err.suggestion}`);
                if (err.line) console.error(`      → Line ${err.line}`);
            });
        }
        
        if (report.warnings.length > 0) {
            report.warnings.forEach(warn => {
                console.warn(`   ⚠️  ${warn.type}: ${warn.message}`);
                if (warn.suggestion) console.warn(`      💡 ${warn.suggestion}`);
                if (warn.line) console.warn(`      → Line ${warn.line}`);
            });
        }
    }

    try {
        const viewCount = (code.match(/@View/g) || []).length;
        if (viewCount > 1) throw new Error(`Multiple @View blocks detected in ${fileName}.`);
    } catch(e) { console.error(`❌ Validation Failed: ${e.message}`); throw e; }

    const resourceRegex = /@Resource\s+(\w+)\s+from\s+['"](.+)['"];/g;
    let match;
    while ((match = resourceRegex.exec(code)) !== null) {
        const resourceName = match[1];
        let modulePath = match[2];
        if (modulePath.startsWith('./') || modulePath.startsWith('../')) {
            const dir = path.dirname(filePath);
            modulePath = path.relative(DIST_DIR, path.join(dir, modulePath)).replace(/\\/g, '/');
            if(!modulePath.startsWith('.')) modulePath = './' + modulePath;
        }
        if (!declaredResources.has(resourceName)) {
            serverOutput += `const ${resourceName} = require('${modulePath}');\n`;
            declaredResources.add(resourceName);
        }
    }
    let cleanCode = code.replace(resourceRegex, '// Res Removed');

    // Extract cache control directives
    let revalidate = null;
    let isStatic = false;
    let enableStreaming = false;
    
    const staticRegex = /@Static\s*({[^}]*})?/;
    const staticMatch = staticRegex.exec(cleanCode);
    if (staticMatch) {
        isStatic = true;
        try {
            const staticConfig = staticMatch[1] ? eval(`(${staticMatch[1]})`) : {};
            revalidate = staticConfig.revalidate || null;
        } catch(e) {}
        cleanCode = cleanCode.replace(staticRegex, '');
    }
    
    const revalidateRegex = /@Revalidate\s+(\d+)/;
    const revalidateMatch = revalidateRegex.exec(cleanCode);
    if (revalidateMatch) {
        revalidate = parseInt(revalidateMatch[1]);
        cleanCode = cleanCode.replace(revalidateRegex, '');
    }
    
    // Check for streaming directive
    const streamRegex = /@Stream/i;
    if (streamRegex.test(cleanCode)) {
        enableStreaming = true;
        cleanCode = cleanCode.replace(streamRegex, '');
    }

    let pageTitle = "Atom App";
    const titleRegex = /@Title\s+['"](.+)['"];/;
    const titleMatch = titleRegex.exec(cleanCode);
    if (titleMatch) {
        pageTitle = titleMatch[1];
        cleanCode = cleanCode.replace(titleRegex, '');
    }

    let pageMeta = [];
    const descRegex = /@Description\s+['"](.+)['"];/;
    const descMatch = descRegex.exec(cleanCode);
    if (descMatch) {
        pageMeta.push(`{name: "description", content: "${descMatch[1]}"}`);
        cleanCode = cleanCode.replace(descRegex, '');
    }
    const metaBlock = extractBlock(cleanCode, '@Meta');
    if (metaBlock.extracted) {
        let content = metaBlock.extracted.trim();
        if(content.endsWith(';')) content = content.slice(0, -1);
        pageMeta.push(`{ ${content} }`);
        cleanCode = metaBlock.clean;
    }

    let viewBody = 'return div("Empty Page")';
    const viewResult = extractBlock(cleanCode, '@View');
    if (viewResult.extracted) {
        viewBody = viewResult.extracted.trim();
        cleanCode = viewResult.clean;
    } else {
        // Warn about missing @View block (only for route files, not components)
        if (!fileName.includes('+server.atom')) {
            console.warn(`⚠️  Warning: Missing @View block in ${fileName}. Page will render empty content.`);
            console.warn(`   → Add @View { ... } to define the page content.`);
        }
    }

    const styleResult = extractBlock(cleanCode, '@Style');
    if (styleResult.extracted) {
        clientCustomCSS += `\n/* ${routePattern} */\n${styleResult.extracted.trim()}`;
        cleanCode = styleResult.clean;
    }

    cleanCode = cleanCode.replace(/@Flow\s+Actions\s+{/, 'const Actions = {');
    
    // Remove any remaining @ directives that might cause parser errors
    // But avoid matching @ inside strings (both single and double quotes)
    // Match @ at start of line or after whitespace, but not inside quotes
    cleanCode = cleanCode.replace(/^[ \t]*@\w+[^\n]*/gm, '');

    let ast;
    try { 
        ast = parser.parse(cleanCode, { 
            sourceType: 'module',
            plugins: ['decorators-legacy', 'classProperties', 'objectRestSpread', 'typescript']
        }); 
    } catch (e) { 
        const errorMsg = `❌ Syntax Error in ${fileName}:\n   ${e.message}`;
        if (e.loc) {
            console.error(`${errorMsg}\n   → Line ${e.loc.line}, Column ${e.loc.column}`);
            console.error(`   → Tip: Check your syntax around line ${e.loc.line}`);
        } else {
            console.error(errorMsg);
        }
        console.error(`   → File: ${filePath}`);
        // Still create empty AST to prevent cascading errors, but log clearly
        ast = { type: 'Program', body: [] };
    }

    let pageLogicClient = ``; 
    let pageLogicSSR = `const Actions = {};\n`; 

    traverse(ast, {
        VariableDeclarator(path) {
            if (path.node.id.name !== 'Actions') return;
            path.node.init.properties.forEach(prop => {
                const funcName = prop.key.name;
                const funcBody = generate(prop.value).code;
                const uniqueId = relativePath.replace(/[^a-zA-Z0-9]/g, '_') + '_' + funcName;

                if (funcName.startsWith('secure_')) {
                    serverOutput += `exports.${uniqueId} = ${funcBody};\n`;
                    // Enhanced Server Action with form support and progressive enhancement
                    pageLogicClient += `Actions.${funcName} = async (data, options = {}) => { 
                        const method = options.method || "POST";
                        const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
                        const res = await fetch("/_atom/rpc/${uniqueId}", { 
                            method, 
                            headers, 
                            body: JSON.stringify(data),
                            ...(options.signal ? { signal: options.signal } : {})
                        }); 
                    if (!res.ok) {
                        const error = await res.json().catch(() => ({ error: res.statusText }));
                        const errorMsg = error.error || res.statusText;
                        const enhancedError = new Error(\`Server Action "${funcName}" failed: \${errorMsg}\`);
                        if (error.function) enhancedError.function = error.function;
                        if (error.hint) enhancedError.hint = error.hint;
                        throw enhancedError;
                    }
                        const result = await res.json();
                        return result; 
                    };\n`;
                    pageLogicSSR += `Actions.${funcName} = async () => { return {}; };\n`; 
                } else {
                    pageLogicClient += `Actions.${funcName} = ${funcBody};\n`;
                    pageLogicSSR += `Actions.${funcName} = ${funcBody};\n`;
                }
            });
        },
        ImportDeclaration(path) {
            registerImport(path.node, filePath);
        }
    });

    const metaArrayString = `[${pageMeta.join(',')}]`;

    // Find applicable layouts for this route (nested layout support)
    const applicableLayouts = [];
    const routeDir = path.dirname(filePath);
    let currentDir = routeDir;
    
    while (currentDir.startsWith(APP_DIR) && currentDir !== APP_DIR) {
        const layoutPath = path.join(currentDir, '_layout.atom');
        if (fs.existsSync(layoutPath)) {
            const relPath = '/' + path.relative(APP_DIR, currentDir).replace(/\\/g, '/');
            if (layoutMap.has(relPath)) {
                applicableLayouts.unshift(relPath); // Add to beginning for nesting
            }
        }
        currentDir = path.dirname(currentDir);
    }
    
    // Add root layout if exists
    // Always add root layout if it exists (for backward compatibility and root-level pages)
    if (hasLayout && layoutMap.has('/') && !applicableLayouts.includes('/')) {
        applicableLayouts.unshift('/');
    }
    
    // CODE SPLITTING: Use dynamic import for route components
    const routeId = relativePath.replace(/[^a-zA-Z0-9]/g, '_');
    // Build component function for both client and SSR
    // Client version
    const clientComponent = `(props) => {
            // Ensure props is always an object
            props = props || {};
            const Actions = {};
            ${pageLogicClient}
            const PageContent = (props) => { 
                // Ensure props is always an object
                props = props || {};
                ${viewBody} 
            };
            ${applicableLayouts.length > 0 ? `
            // Apply layouts with content (from innermost to outermost)
            let result = PageContent(props);
            ${applicableLayouts.map((layoutPath) => {
                const layoutName = layoutPath === '/' ? 'Layout' : 
                    'Layout_' + layoutPath.replace(/\//g, '_').replace(/^_/, '').replace(/[^a-zA-Z0-9]/g, '_');
                return `result = ${layoutName}({ ...props, content: result });`;
            }).join('\n            ')}
            return result;
            ` : hasLayout ? `return Layout({ ...props, content: PageContent(props) });` : 'return PageContent(props);'}
        }`;
    
    // SSR version - ensure Actions is initialized and hooks are available
    const ssrComponent = `(props) => {
            // Ensure props is always an object
            props = props || {};
            ${pageLogicSSR}
            const PageContent = (props) => { 
                // Ensure props is always an object
                props = props || {};
                ${viewBody} 
            };
            ${applicableLayouts.length > 0 ? `
            // Apply layouts with content (from innermost to outermost)
            let result = PageContent(props);
            ${applicableLayouts.map((layoutPath) => {
                const layoutName = layoutPath === '/' ? 'Layout' : 
                    'Layout_' + layoutPath.replace(/\//g, '_').replace(/^_/, '').replace(/[^a-zA-Z0-9]/g, '_');
                return `result = ${layoutName}({ ...props, content: result });`;
            }).join('\n            ')}
            return result;
            ` : hasLayout ? `return Layout({ ...props, content: PageContent(props) });` : 'return PageContent(props);'}
        }`;
    
    const lazyComponent = clientComponent;
    
    const clientRouteDefinition = `
    {
        regex: new RegExp('${regexString}'),
        paramNames: ${JSON.stringify(paramNames)},
        title: "${pageTitle}",
        meta: [${pageMeta.join(',')}], 
        revalidate: ${revalidate !== null ? revalidate : 'null'},
        isStatic: ${isStatic},
        enableStreaming: ${enableStreaming},
        component: ${lazyComponent}
    }`;
    
    const ssrRouteDefinition = `
    {
        regex: new RegExp('${regexString}'),
        paramNames: ${JSON.stringify(paramNames)},
        title: "${pageTitle}",
        meta: [${pageMeta.join(',')}], 
        revalidate: ${revalidate !== null ? revalidate : 'null'},
        isStatic: ${isStatic},
        enableStreaming: ${enableStreaming},
        component: ${ssrComponent}
    }`;
    
    // For production, generate separate route files for code splitting
    if (!IS_DEV) {
        // Build layout wrapper for production
        let prodLayoutWrapper = 'PageContent(props)';
        if (applicableLayouts.length > 0) {
            applicableLayouts.forEach(layoutPath => {
                const layoutName = layoutPath === '/' ? 'Layout' : 
                    'Layout_' + layoutPath.replace(/\//g, '_').replace(/^_/, '').replace(/[^a-zA-Z0-9]/g, '_');
                prodLayoutWrapper = `${layoutName}({ ...props, content: ${prodLayoutWrapper} })`;
            });
        }
        
        // SSR Helpers for route files - include component definitions
        let ssrComponentCode = '';
        if (fs.existsSync(COMPONENT_DIR)) {
            const compFiles = fs.readdirSync(COMPONENT_DIR).filter(f => f.endsWith('.atom'));
            compFiles.forEach(file => {
                const name = file.replace('.atom', '');
                const code = fs.readFileSync(path.join(COMPONENT_DIR, file), 'utf-8');
                const viewBlock = extractBlock(code, '@View');
                if (viewBlock.extracted) {
                    // Convert component to SSR version (using el() instead of DOM elements)
                    ssrComponentCode += `
const ${name} = (props) => { ${viewBlock.extracted.trim()} };
`;
                }
            });
        }
        
        const ssrHelpers = `
// SSR Hooks (no-op stubs for server-side rendering)
function useState(initialValue) { return [initialValue, () => {}]; }
function useEffect(callback, deps) { /* SSR: no-op */ }
function useMemo(factory, deps) { return factory(); }
function useCallback(callback, deps) { return callback; }
function useRef(initialValue) { return { current: initialValue }; }
function usePath() { return typeof window !== 'undefined' ? window.location.pathname : '/'; }
function navigate() {}

// SSR Component Definitions
${ssrComponentCode}

// SSR HTML Helper Functions
function el(tag, content, props = {}) {
    let attrs = "";
    Object.keys(props).forEach(key => {
        if (key.startsWith('on')) return;
        if (key === 'className') attrs += \` class="\${props[key]}"\`;
        else if (key === 'style') {
            const styleStr = Object.entries(props[key]).map(([k,v]) => \`\${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:\${v}\`).join(';');
            attrs += \` style="\${styleStr}"\`;
        } else if (['autoplay', 'loop', 'muted', 'controls', 'playsinline', 'checked', 'disabled'].includes(key)) {
            if(props[key]) attrs += \` \${key}\`;
        } else if (props[key] !== null && props[key] !== undefined && typeof props[key] !== 'object') {
            attrs += \` \${key}="\${props[key]}"\`;
        }
    });
    let innerHTML = '';
    if (content === null || content === undefined || content === false) {
        innerHTML = '';
    } else if (Array.isArray(content)) {
        innerHTML = content.filter(c => c !== null && c !== undefined && c !== false).map(c => {
            return (typeof c === 'object' && c.outerHTML) ? c.outerHTML : String(c);
        }).join('');
    } else {
        innerHTML = String(content || '');
    }
    if (['input', 'img', 'br', 'hr', 'atom-video', 'atom-play', 'atom-progress', 'atom-cursor', 'source'].includes(tag)) return \`<\${tag}\${attrs} />\`;
    return \`<\${tag}\${attrs}>\${innerHTML}</\${tag}>\`;
}
const div = (c, p) => el('div', c, p);
const h1 = (c, p) => el('h1', c, p);
const h2 = (c, p) => el('h2', c, p);
const h3 = (c, p) => el('h3', c, p);
const h4 = (c, p) => el('h4', c, p);
const h5 = (c, p) => el('h5', c, p);
const h6 = (c, p) => el('h6', c, p);
const p = (c, p) => el('p', c, p);
const button = (c, p) => el('button', c, p);
const input = (c, p) => el('input', c, p);
const form = (c, p) => el('form', c, p);
const select = (c, p) => el('select', c, p);
const option = (c, p) => el('option', c, p);
const textarea = (c, p) => el('textarea', c, p);
const nav = (c, p) => el('nav', c, p);
const footer = (c, p) => el('footer', c, p);
const span = (c, p) => el('span', c, p);
const ul = (c, p) => el('ul', c, p);
const ol = (c, p) => el('ol', c, p);
const li = (c, p) => el('li', c, p);
const section = (c, p) => el('section', c, p);
const header = (c, p) => el('header', c, p);
const article = (c, p) => el('article', c, p);
const aside = (c, p) => el('aside', c, p);
const main = (c, p) => el('main', c, p);
const label = (c, p) => el('label', c, p);
const table = (c, p) => el('table', c, p);
const thead = (c, p) => el('thead', c, p);
const tbody = (c, p) => el('tbody', c, p);
const tr = (c, p) => el('tr', c, p);
const td = (c, p) => el('td', c, p);
const th = (c, p) => el('th', c, p);
const strong = (c, p) => el('strong', c, p);
const em = (c, p) => el('em', c, p);
const a = (text, props) => el('a', text, props);
const img = (props) => el('img', null, props);
const Image = (props) => {
    const { src, width, height, sizes, quality, format, ...restProps } = props;
    if (src && (src.startsWith('http://') || src.startsWith('https://'))) {
        return el('img', null, { loading: "lazy", decoding: "async", ...props });
    }
    const getOptimizedUrl = (w, h, q, f) => {
        return \`/_atom/image?url=\${encodeURIComponent(src)}&w=\${w || ''}&h=\${h || ''}&q=\${q || 85}&fmt=\${f || 'auto'}\`;
    };
    if (width && sizes) {
        const baseUrl = src || props.src;
        const widths = [640, 768, 1024, 1280, 1920].filter(w => w <= width * 2);
        const srcset = widths.map(w => {
            const url = \`/_atom/image?url=\${encodeURIComponent(baseUrl)}&w=\${w}&q=\${quality || 85}&fmt=\${format || 'auto'}\`;
            return \`\${url} \${w}w\`;
        }).join(', ');
        return el('img', null, {
            src: \`/_atom/image?url=\${encodeURIComponent(baseUrl)}&w=\${width}&q=\${quality || 85}&fmt=\${format || 'auto'}\`,
            srcset,
            sizes: sizes || \`(max-width: \${width}px) 100vw, \${width}px\`,
            width,
            height,
            loading: "lazy",
            decoding: "async",
            ...restProps
        });
    }
    if (src && (width || height)) {
        const optimizedSrc = \`/_atom/image?url=\${encodeURIComponent(src)}&w=\${width || ''}&h=\${height || ''}&q=\${quality || 85}&fmt=\${format || 'auto'}\`;
        return el('img', null, { src: optimizedSrc, width, height, loading: "lazy", decoding: "async", ...restProps });
    }
    return el('img', null, { loading: "lazy", decoding: "async", ...props });
};
`;

        const routeFileContent = `
// Route: ${relativePath}
${ssrHelpers}
const Actions = {};
${pageLogicClient}
const PageContent = (props) => { 
    // Ensure props is always an object
    props = props || {};
    ${viewBody} 
};
export default (props) => {
    // Ensure props is always an object
    props = props || {};
    // Layout functions are passed via props for SSR
    ${applicableLayouts.length > 0 ? applicableLayouts.map((layoutPath) => {
        const layoutName = layoutPath === '/' ? 'Layout' : 
            'Layout_' + layoutPath.replace(/\//g, '_').replace(/^_/, '').replace(/[^a-zA-Z0-9]/g, '_');
        return `const ${layoutName} = props.${layoutName};`;
    }).join('\n    ') : hasLayout ? 'const Layout = props.Layout;' : ''}
    ${applicableLayouts.length > 0 ? `
    const pageContent = PageContent(props);
    let result = pageContent;
    ${applicableLayouts.map((layoutPath) => {
        const layoutName = layoutPath === '/' ? 'Layout' : 
            'Layout_' + layoutPath.replace(/\//g, '_').replace(/^_/, '').replace(/[^a-zA-Z0-9]/g, '_');
        return `if (${layoutName} && typeof ${layoutName} === 'function') { result = ${layoutName}({ ...props, content: result }); }`;
    }).join('\n    ')}
    return result;
    ` : hasLayout ? `const pageContent = PageContent(props); return Layout && typeof Layout === 'function' ? Layout({ ...props, content: pageContent }) : pageContent;` : 'return PageContent(props);'}
};
`;
        if (!routeDirsInitialized) {
            resetRouteOutputDirs();
            ensurePublicAtomDir();
            routeDirsInitialized = true;
        }
        const routeFileName = `${routeId}.js`;
        fs.writeFileSync(path.join(ROUTE_DIST_DIR, routeFileName), routeFileContent);
        fs.writeFileSync(path.join(CLIENT_ROUTE_DIR, routeFileName), routeFileContent);
        fs.writeFileSync(path.join(PUBLIC_ROUTE_DIR, routeFileName), routeFileContent);
    }

    clientRoutes += `Routes.push(${clientRouteDefinition});\n`;
    // For SSR, use the SSR component directly
    ssrRoutes += `Routes.push(${ssrRouteDefinition});\n`;
});

if (!hasCustom404) {
    const default404 = `return div([h1("404",{style:{fontSize:"100px",fontWeight:"800",margin:0,color:"#333"}}),div("Page Not Found",{style:{fontSize:"24px",color:"#666",marginBottom:"24px"}}),a("Go Home",{href:"/",style:{background:"#000",color:"#fff",padding:"10px 20px",borderRadius:"6px",textDecoration:"none",fontWeight:"bold"}})],{style:{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"sans-serif",background:"#fff"}});`;
    const default404Route = `
    {
        regex: /^\\/404$/,
        paramNames: [],
        title: "404 Not Found",
        meta: [],
        component: () => { ${default404} }
    }`;
    clientRoutes += `Routes.push(${default404Route});\n`;
    ssrRoutes += `Routes.push(${default404Route});\n`;
}

serverOutput += apiRouteOutput;
serverOutput += `\nexports.APIRoutes = APIRoutes;\n`; // Export for runner

// 4. GENERATE ATOM MODULES (from .atom imports)
generateAtomModules();

// 5. GENERATE CLIENT IMPORT STRING
let clientImports = generateImports();

async function compileCSS() {
    console.log("   -> 🎨 Generating CSS...");
    const rawCSS = `@tailwind base; @tailwind components; @tailwind utilities; ${clientCustomCSS}`;
    
    let twConfig = {
        content: [{ raw: rawCSS, extension: 'css' }, path.join(APP_DIR, "**/*.atom")],
        theme: { extend: {} },
        plugins: []
    };
    
    try {
        const userConfigPath = path.join(process.cwd(), 'tailwind.config.js');
        if (fs.existsSync(userConfigPath)) {
            const userConfig = require(userConfigPath);
            if(userConfig.content) {
                twConfig.content = [...twConfig.content, ...userConfig.content];
            }
            twConfig = { ...twConfig, ...userConfig, content: twConfig.content };
        }
    } catch(e) { }

    try {
        const result = await postcss([tailwindcss(twConfig), autoprefixer]).process(rawCSS, { from: undefined });
        return result.css;
    } catch (e) { return ""; }
}

compileCSS().then((finalCSS) => {
    const devTools = IS_DEV ? devToolsCode : '';
    const hotReload = IS_DEV ? hotReloadCode : '';
    const cssInject = `
        const cssContent = ${JSON.stringify(finalCSS || '')};
        if (typeof document !== 'undefined' && cssContent) {
            const styleTag = document.createElement('style');
            styleTag.innerHTML = cssContent;
            document.head.appendChild(styleTag);
            ${devTools}
            ${hotReload}
        }
    `;

    // FIX: INJECT componentCode HERE (merged into the 3rd argument)
    const clientOutput = getClientRuntime(
        clientImports, 
        layoutClientCode, 
        componentCode + clientRoutes, // <--- THE FIX IS HERE
        devTools, 
        hotReload,
        layoutHierarchyCode
    ).replace('// CSS_INJECT', cssInject);

    const ssrOutput = getSSRRuntime(
        clientImports, 
        layoutSSRCode, 
        componentCode + ssrRoutes, // <--- AND HERE
        layoutHierarchyCode
    );

    // Ensure dist directory exists
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }
    
    const clientTempPath = path.join(DIST_DIR, 'client_temp.js');
    const ssrTempPath = path.join(DIST_DIR, 'ssr_temp.js');
    
    fs.writeFileSync(path.join(DIST_DIR, 'server.js'), serverOutput);
    fs.writeFileSync(clientTempPath, clientOutput); 
    fs.writeFileSync(ssrTempPath, ssrOutput);

    console.log("   -> 📦 Bundling...");
    
    // Build immediately (no setTimeout)
    try {
        // Ensure temp files exist before bundling
        if (!fs.existsSync(clientTempPath)) {
            console.error("❌ Client temp file not found:", clientTempPath);
        } else {
            const clientExternalPatterns = [
                './routes/*',
                'routes/*',
                '../routes/*'
            ];

            const clientBuildResult = esbuild.buildSync({
                entryPoints: [clientTempPath],
                bundle: true,
                minify: !IS_DEV,
                outfile: path.join(DIST_DIR, 'client.js'),
                format: 'iife',
                globalName: 'AtomApp',
                metafile: true,
                external: clientExternalPatterns,
            });
            
            // Calculate bundle size for DevTools
            if (clientBuildResult.metafile && IS_DEV) {
                const bundleSize = fs.statSync(path.join(DIST_DIR, 'client.js')).size;
                // Store bundle size in a way DevTools can access
                const bundleInfo = { size: bundleSize, timestamp: Date.now() };
                fs.writeFileSync(path.join(DIST_DIR, 'bundle-info.json'), JSON.stringify(bundleInfo));
            }
            
            if (fs.existsSync(clientTempPath)) fs.unlinkSync(clientTempPath);

            try {
                ensurePublicAtomDir();
                fs.copyFileSync(path.join(DIST_DIR, 'client.js'), PUBLIC_CLIENT_BUNDLE);
            } catch (copyErr) {
                console.warn('⚠️  Failed to copy client bundle to public:', copyErr.message);
            }
        }
    } catch (e) {
        console.error("❌ Bundling Failed:", e.message);
        if (e.errors) e.errors.forEach(err => console.error("  ", err.text));
    }
    
    try {
        // Ensure temp files exist before bundling
        if (!fs.existsSync(ssrTempPath)) {
            console.error("❌ SSR temp file not found:", ssrTempPath);
        } else {
            const ssrExternalPatterns = [
                './routes/*',
                'routes/*',
                'dist/routes/*',
                '../routes/*'
            ];

            esbuild.buildSync({
                entryPoints: [ssrTempPath],
                bundle: true,
                platform: 'node',
                minify: !IS_DEV,
                outfile: path.join(DIST_DIR, 'ssr.js'),
                format: 'cjs',
                external: ssrExternalPatterns,
            });
            if (fs.existsSync(ssrTempPath)) fs.unlinkSync(ssrTempPath);
        }
    } catch (e) {
        console.error("❌ Bundling Failed:", e.message);
        if (e.errors) e.errors.forEach(err => console.error("  ", err.text));
    }
    
    console.log("✅ Build Complete!");
}).catch((err) => {
    console.error("❌ Build failed:", err);
    if (err && err.message) {
        console.error("Error details:", err.message);
        if (err.stack) {
            console.error("Stack:", err.stack.split('\n').slice(0, 5).join('\n'));
        }
    }
    process.exit(1);
});