// --- 1. ATOM VIDEO ENGINE (Hybrid) ---
const mediaPlayerCode = `
class AtomVideo extends HTMLElement {
    constructor() { 
        super(); 
        this.attachShadow({ mode: 'open' }); 
        this.state = { playing: false, progress: 0, duration: 0, muted: false };
        this._handlers = [];
        this._timeoutId = null;
    }
    connectedCallback() {
        const src = this.getAttribute('src'); const poster = this.getAttribute('poster');
        const autoplay = this.hasAttribute('autoplay') ? 'autoplay' : '';
        const loop = this.hasAttribute('loop') ? 'loop' : '';
        const muted = this.hasAttribute('muted') ? 'muted' : '';
        const playsinline = this.hasAttribute('playsinline') ? 'playsinline' : '';
        this.shadowRoot.innerHTML = \`<style>:host{display:block;position:relative;width:100%;height:100%;background:#000;overflow:hidden}video{width:100%;height:100%;object-fit:cover;display:block}.ui-layer{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:20}::slotted(*){pointer-events:auto}</style><video src="\${src}" \${poster?'poster="'+poster+'"':''} \${autoplay} \${loop} \${muted} \${playsinline}></video><div class="ui-layer"><slot></slot></div>\`;
        this.video = this.shadowRoot.querySelector('video');
        if(this.hasAttribute('muted')) this.video.muted = true;
        
        // Store handlers for cleanup
        const timeUpdateHandler = () => this.updateState();
        const metadataHandler = () => this.updateState();
        const playHandler = () => { this.state.playing = true; this.emit(); };
        const pauseHandler = () => { this.state.playing = false; this.emit(); };
        const clickHandler = () => this.togglePlay();
        const actionHandler = (e) => { e.stopPropagation(); const { action, value } = e.detail; if(action === 'toggle') this.togglePlay(); else if(action === 'seek') this.video.currentTime = (value / 100) * this.video.duration; else if(action === 'mute') { this.video.muted = !this.video.muted; this.state.muted = this.video.muted; this.emit(); } };
        
        this.video.addEventListener('timeupdate', timeUpdateHandler);
        this.video.addEventListener('loadedmetadata', metadataHandler);
        this.video.addEventListener('play', playHandler);
        this.video.addEventListener('pause', pauseHandler);
        this.video.addEventListener('click', clickHandler);
        this.addEventListener('atom-action', actionHandler);
        
        this._handlers = [
            { el: this.video, event: 'timeupdate', handler: timeUpdateHandler },
            { el: this.video, event: 'loadedmetadata', handler: metadataHandler },
            { el: this.video, event: 'play', handler: playHandler },
            { el: this.video, event: 'pause', handler: pauseHandler },
            { el: this.video, event: 'click', handler: clickHandler },
            { el: this, event: 'atom-action', handler: actionHandler }
        ];
        
        this._timeoutId = setTimeout(() => { if(!this.video.paused) { this.state.playing = true; this.emit(); } this.state.muted = this.video.muted; }, 100);
    }
    disconnectedCallback() {
        // Cleanup all event listeners
        this._handlers.forEach(({ el, event, handler }) => {
            el.removeEventListener(event, handler);
        });
        this._handlers = [];
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
    }
    togglePlay() { if (this.video.paused) this.video.play(); else this.video.pause(); }
    updateState() { this.state.progress = (this.video.currentTime / this.video.duration) * 100 || 0; this.state.duration = this.video.duration; this.emit(); }
    emit() { const event = new CustomEvent('atom-state', { detail: { ...this.state } }); this.querySelectorAll('*').forEach(el => el.dispatchEvent(event)); }
}
if (!customElements.get('atom-video')) customElements.define('atom-video', AtomVideo);
class AtomPlayButton extends HTMLElement { connectedCallback() { this.style.display = 'inline-flex'; this.style.cursor = 'pointer'; this.onclick = (e) => { e.stopPropagation(); this.dispatchEvent(new CustomEvent('atom-action', { bubbles: true, detail: { action: 'toggle' } })); }; this.render(false); this.addEventListener('atom-state', (e) => this.render(e.detail.playing)); } render(playing) { this.innerHTML = playing ? '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' : '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'; } }
if (!customElements.get('atom-play')) customElements.define('atom-play', AtomPlayButton);
class AtomProgress extends HTMLElement { connectedCallback() { this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%'; this.style.cursor = 'pointer'; this.innerHTML = '<div style="width:100%;height:100%;background:rgba(255,255,255,0.3);border-radius:10px;overflow:hidden;"><div id="fill" style="background:currentColor;width:0%;height:100%;"></div></div>'; this.fill = this.querySelector('#fill'); this.onclick = (e) => { e.stopPropagation(); const rect = this.getBoundingClientRect(); const pos = ((e.clientX - rect.left) / rect.width) * 100; this.dispatchEvent(new CustomEvent('atom-action', { bubbles: true, detail: { action: 'seek', value: pos } })); }; this.addEventListener('atom-state', (e) => { this.fill.style.width = e.detail.progress + '%'; }); } }
if (!customElements.get('atom-progress')) customElements.define('atom-progress', AtomProgress);
class AtomCursor extends HTMLElement { 
    constructor() {
        super();
        this._mousemoveHandler = null;
        this._stateHandler = null;
        this._timeoutId = null;
    }
    connectedCallback() { 
        this.style.position = 'absolute'; 
        this.style.zIndex = '50'; 
        this.style.pointerEvents = 'none'; 
        this.style.transform = 'translate(-50%, -50%)'; 
        this.innerHTML = '<div style="background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);padding:12px;border-radius:50%;color:white;"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>'; 
        this._timeoutId = setTimeout(() => { 
            const container = this.closest('atom-video'); 
            if(!container) return; 
            this._mousemoveHandler = (e) => { 
                const rect = container.getBoundingClientRect(); 
                const x = e.clientX - rect.left; 
                const y = e.clientY - rect.top; 
                this.style.left = x + 'px'; 
                this.style.top = y + 'px'; 
            };
            this._stateHandler = (e) => { 
                this.querySelector('svg').innerHTML = e.detail.playing ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' : '<path d="M8 5v14l11-7z"/>'; 
            };
            container.addEventListener('mousemove', this._mousemoveHandler); 
            this.addEventListener('atom-state', this._stateHandler); 
        }, 100); 
    }
    disconnectedCallback() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
        const container = this.closest('atom-video');
        if (container && this._mousemoveHandler) {
            container.removeEventListener('mousemove', this._mousemoveHandler);
        }
        if (this._stateHandler) {
            this.removeEventListener('atom-state', this._stateHandler);
        }
    }
}
if (!customElements.get('atom-cursor')) customElements.define('atom-cursor', AtomCursor);
`;

// --- 2. DOM HELPERS (The Logic Fixes) ---
const sharedHelpers = `
function el(tag, content, props = {}) {
    const element = document.createElement(tag);
    
    // Handle Content (Robust Mix of Strings and Nodes)
    // Check for Node first (before null check) since Node is an object
    if (content instanceof Node) {
        element.appendChild(content);
    } else if (content === null || content === undefined || content === false) {
        // Do nothing - don't render null/undefined/false
        // This prevents "null", "undefined" from appearing in the DOM
    } else if (Array.isArray(content)) {
        content.forEach(child => { 
            // Skip null, undefined, false values in arrays
            if (child === null || child === undefined || child === false) {
                return; // Skip this child
            }
            if (child instanceof Node) {
                element.appendChild(child);
            } else if (typeof child === 'string' || typeof child === 'number') {
                element.appendChild(document.createTextNode(String(child)));
            }
            // All other types are skipped
        });
    } else if (typeof content === 'string' || typeof content === 'number') {
        // Create Text Node for strings to allow proper Diffing
        element.appendChild(document.createTextNode(content));
    } else {
        // For any other type, convert to string only if it's not null/undefined
        element.appendChild(document.createTextNode(String(content)));
    }

    // Handle Props
    Object.keys(props).forEach(key => {
        // Skip numeric keys (array indices) - these are not valid attribute names
        if (!isNaN(parseInt(key)) && isFinite(key)) return;
        
        const val = props[key];
        
        if (key.startsWith('on')) {
            element[key.toLowerCase()] = val;
        } else if (key === 'style') {
            if (val && typeof val === 'object' && !Array.isArray(val)) {
                Object.assign(element.style, val);
            }
        } else if (key === 'className') {
            element.className = val;
        } else if (key === 'innerHTML') {
            element.innerHTML = val;
        }
        // BOOLEAN PROPERTIES (Muted, Checked, Disabled, Autoplay)
        else if (['muted', 'autoplay', 'loop', 'checked', 'disabled', 'readonly', 'controls', 'playsinline'].includes(key)) {
            if (val) {
                element.setAttribute(key, '');
                element[key] = true;
            } else {
                element.removeAttribute(key);
                element[key] = false;
            }
        }
        // INPUT VALUE (Force Property Update)
        else if (key === 'value') {
            element.value = val; // Critical for Input Typing
            element.setAttribute('value', val);
        }
        // STANDARD ATTRIBUTES (skip objects/arrays)
        else if (val !== null && val !== undefined && typeof val !== 'object') {
            element.setAttribute(key, String(val));
        }
    });
    return element;
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
const dl = (c, p) => el('dl', c, p);
const dt = (c, p) => el('dt', c, p);
const dd = (c, p) => el('dd', c, p);
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
const b = (c, p) => el('b', c, p);
const i = (c, p) => el('i', c, p);
const small = (c, p) => el('small', c, p);
const code = (c, p) => el('code', c, p);
const pre = (c, p) => el('pre', c, p);
const blockquote = (c, p) => el('blockquote', c, p);
const hr = (p) => el('hr', null, p);
const br = () => el('br', null);

const img = (props) => el('img', null, props);
const html = (c, p) => el('html', c, p);
const body = (c, p) => el('body', c, p);
const head = (c, p) => el('head', c, p);
const title = (c, p) => el('title', c, p);
const link = (p) => el('link', null, p);
const script = (c, p) => el('script', c, p);
const meta = (p) => el('meta', null, p);

// Enhanced Image component with srcset, modern format support, and CDN integration
const Image = (props) => {
    const { src, width, height, sizes, quality, format, ...restProps } = props;
    
    // If it's an external URL, use as-is
    if (src && (src.startsWith('http://') || src.startsWith('https://'))) {
        return img({ loading: "lazy", decoding: "async", ...props });
    }
    
    // Helper to get optimized URL (supports CDN)
    const getOptimizedUrl = (w, h, q, f) => {
        // Check if CDN is configured via environment
        const cdn = typeof process !== 'undefined' && process.env && process.env.IMAGE_CDN;
        if (cdn && cdn !== 'local') {
            // CDN URLs are generated server-side, client gets pre-optimized URLs
            return \`/_atom/image?url=\${encodeURIComponent(src)}&w=\${w || ''}&h=\${h || ''}&q=\${q || 85}&fmt=\${f || 'auto'}\`;
        }
        return \`/_atom/image?url=\${encodeURIComponent(src)}&w=\${w || ''}&h=\${h || ''}&q=\${q || 85}&fmt=\${f || 'auto'}\`;
    };
    
    // Generate srcset for responsive images
    if (width && sizes) {
        const baseUrl = src || props.src;
        const widths = [640, 768, 1024, 1280, 1920].filter(w => w <= width * 2);
        const srcset = widths.map(w => {
            const url = getOptimizedUrl(w, null, quality, format);
            return \`\${url} \${w}w\`;
        }).join(', ');
        
        return img({
            src: getOptimizedUrl(width, height, quality, format),
            srcset,
            sizes: sizes || \`(max-width: \${width}px) 100vw, \${width}px\`,
            width,
            height,
            loading: "lazy",
            decoding: "async",
            ...restProps
        });
    }
    
    // Single optimized image
    if (src && (width || height)) {
        const optimizedSrc = getOptimizedUrl(width, height, quality, format);
        return img({ 
            src: optimizedSrc,
            width,
            height,
            loading: "lazy", 
            decoding: "async", 
            ...restProps 
        });
    }
    
    // Fallback to original
    return img({ loading: "lazy", decoding: "async", ...props });
};

const Video = (arg1, arg2) => {
    const isCustom = Array.isArray(arg1);
    const children = isCustom ? arg1 : [];
    const props = isCustom ? arg2 : arg1;
    if (isCustom) return el('atom-video', children, props);
    return el('video', null, props);
};

const Audio = (props) => el('audio', null, props);
const source = (props) => el('source', null, props);

const a = (text, props) => {
    const safeProps = props || {};
    safeProps.onclick = (e) => {
        if (safeProps.href && (safeProps.href.startsWith('http') || safeProps.href.includes(':'))) return;
        e.preventDefault();
        navigate(safeProps.href);
    };
    return el('a', text, safeProps);
};
`;

module.exports.getClientRuntime = (imports, layoutCode, routes, devTools, hotReload, layoutHierarchyCode = '') => `
// ATOM CLIENT RUNTIME
${imports}
window.__ATOM_STATE__ = [];
let _state = window.__ATOM_STATE__;
let _cursor = 0;
let _currentPath = window.location.pathname;

${mediaPlayerCode}

// Cleanup registry for effects
let _cleanupFunctions = [];
let _effectTimeouts = [];
let _effectDeps = []; // Store previous dependencies for comparison
let _effectCursor = 0; // Track effect call order (resets on each render)

export function useState(initialValue) {
    // Validation: Ensure we're in a render context
    if (_isRendering === false && _cursor > 0) {
        console.warn('useState called outside render cycle. This may indicate a hook ordering issue.');
    }
    
    const cursor = _cursor;
    
    // Ensure state array exists and initialize if needed
    if (!Array.isArray(_state)) {
        _state = [];
        window.__ATOM_STATE__ = _state;
    }
    
    // Check if this cursor position has been initialized
    if (!(cursor in _state)) {
        _state[cursor] = initialValue;
    }
    
    const setState = (newValue) => {
        try {
            // Validate state update
            if (cursor >= _state.length) {
                console.error('useState: Attempted to update state at invalid cursor position', cursor);
                return;
            }
        _state[cursor] = newValue;
            scheduleRender();
        } catch(e) {
            console.error('useState setState error:', e);
            throw new Error(\`useState setState failed: \${e.message}\`);
        }
    };
    
    // Get the value before incrementing cursor
    const value = _state[cursor];
    _cursor++;
    
    // Return the value (use initialValue as fallback if somehow undefined)
    return [value !== undefined ? value : initialValue, setState];
}

// Helper to compare dependencies
function depsEqual(deps1, deps2) {
    // Both undefined/null means no deps - always run
    if (!deps1 && !deps2) return true;
    // One is undefined, other is not - different
    if (!deps1 || !deps2) return false;
    // Both are arrays - compare length and values
    if (Array.isArray(deps1) && Array.isArray(deps2)) {
        if (deps1.length !== deps2.length) return false;
        for (let i = 0; i < deps1.length; i++) {
            if (deps1[i] !== deps2[i]) return false;
        }
        return true;
    }
    // Not arrays - compare directly
    return deps1 === deps2;
}

export function useEffect(callback, deps) {
    // Validation: Ensure callback is a function
    if (typeof callback !== 'function') {
        console.error('useEffect: First argument must be a function. Received:', typeof callback);
        return;
    }
    
    // Proper useEffect with cleanup support and dependency tracking
    if (typeof window !== 'undefined') {
        const effectId = _effectCursor++;
        const prevDeps = _effectDeps[effectId];
        const prevCleanup = _cleanupFunctions[effectId];
        const prevTimeout = _effectTimeouts[effectId];
        
        // Normalize deps: [] means run once on mount, undefined means run every render
        const normalizedDeps = deps === undefined ? null : (Array.isArray(deps) ? deps : [deps]);
        const normalizedPrevDeps = prevDeps === undefined ? null : (Array.isArray(prevDeps) ? prevDeps : [prevDeps]);
        
        // Check if dependencies changed (or first run)
        const isFirstRun = normalizedPrevDeps === null;
        const depsChanged = isFirstRun || !depsEqual(normalizedPrevDeps, normalizedDeps);
        
        if (depsChanged) {
            // Cleanup previous effect
            if (prevTimeout) {
                clearTimeout(prevTimeout);
            }
            if (prevCleanup && typeof prevCleanup === 'function') {
                try {
                    prevCleanup();
            } catch(e) {
                    console.error('useEffect cleanup error:', e);
                    // Don't throw - cleanup errors shouldn't break the app
                }
            }
            
            // Store new dependencies (preserve empty arrays)
            _effectDeps[effectId] = normalizedDeps !== null ? (Array.isArray(normalizedDeps) ? [...normalizedDeps] : normalizedDeps) : null;
            
            // Schedule new effect with error boundary
            const timeoutId = setTimeout(() => {
                try {
                    const cleanup = callback();
                    // Store cleanup function if returned
                    if (typeof cleanup === 'function') {
                        _cleanupFunctions[effectId] = cleanup;
                    } else {
                        _cleanupFunctions[effectId] = null;
                    }
                } catch(e) {
                    console.error('useEffect callback error:', e);
                    console.error('Effect ID:', effectId, 'Deps:', normalizedDeps);
                    _cleanupFunctions[effectId] = null;
                    // Don't throw - effect errors shouldn't crash the app
            }
        }, 0);
            
            // Store timeout ID for cleanup
            _effectTimeouts[effectId] = timeoutId;
        }
        // If deps haven't changed, do nothing (effect doesn't run again)
    }
}

// Memoization storage for useMemo
let _memoValues = [];
let _memoDeps = [];
let _memoCursor = 0;

export function useMemo(factory, deps) {
    const cursor = _memoCursor++;
    
    // Ensure arrays exist
    if (!Array.isArray(_memoValues)) {
        _memoValues = [];
    }
    if (!Array.isArray(_memoDeps)) {
        _memoDeps = [];
    }
    
    const prevDeps = _memoDeps[cursor];
    const depsChanged = !prevDeps || !depsEqual(prevDeps, deps);
    
    if (depsChanged || _memoValues[cursor] === undefined) {
        _memoValues[cursor] = factory();
        _memoDeps[cursor] = deps ? (Array.isArray(deps) ? [...deps] : deps) : null;
    }
    
    return _memoValues[cursor];
}

export function useCallback(callback, deps) {
    // Simple useCallback - just return callback (no memoization for now)
    return callback;
}

// Refs need to persist across renders, so we track them by cursor position
let _refs = [];
let _refCursor = 0;

export function useRef(initialValue) {
    // Validation: Ensure we're in a render context
    if (_isRendering === false && _refCursor > 0) {
        console.warn('useRef called outside render cycle. This may indicate a hook ordering issue.');
    }
    
    const cursor = _refCursor++;
    
    // Ensure refs array exists
    if (!Array.isArray(_refs)) {
        _refs = [];
    }
    
    if (_refs[cursor] === undefined) {
        _refs[cursor] = { current: initialValue };
    }
    
    return _refs[cursor];
}

export function usePath() {
    return _currentPath;
}

// Render debouncing to prevent excessive renders
let _renderTimeout = null;
let _isRendering = false;

function scheduleRender() {
    if (_isRendering) return;
    if (_renderTimeout) clearTimeout(_renderTimeout);
    _renderTimeout = setTimeout(() => {
        _isRendering = true;
        renderApp();
        _isRendering = false;
    }, 0);
}

function cleanupEffects() {
    // Cleanup all active effects
    _effectTimeouts.forEach((timeoutId) => {
        if (timeoutId) clearTimeout(timeoutId);
    });
    _cleanupFunctions.forEach((cleanup, id) => {
        if (cleanup && typeof cleanup === 'function') {
            try {
                cleanup();
            } catch(e) {
                console.error('Cleanup error:', e);
            }
        }
    });
    _cleanupFunctions = [];
    _effectTimeouts = [];
    _effectDeps = [];
    _effectCursor = 0;
}

export function navigate(path) {
    // Cleanup before navigation
    cleanupEffects();
    if (_renderTimeout) {
        clearTimeout(_renderTimeout);
        _renderTimeout = null;
    }
    
    window.history.pushState({}, "", path);
    _currentPath = path;
    _state = []; 
    window.__ATOM_STATE__ = []; 
    _cursor = 0;
    _refs = []; // Clear refs on navigation
    _refCursor = 0;
    _memoValues = []; // Clear memoized values on navigation
    _memoDeps = [];
    _memoCursor = 0;
    scheduleRender();
}

${sharedHelpers}

${layoutCode}
${layoutHierarchyCode || ''}
${routes}

// Export Routes for external access
export { Routes, matchRoute };

// --- ROBUST DIFF ENGINE V45 ---
function diff(parent, newEl, oldEl) {
    // Validation: Ensure all arguments are valid
    if (!parent || !(parent instanceof Node)) {
        console.error('diff: parent must be a valid DOM Node', parent);
        return;
    }
    if (!newEl || !(newEl instanceof Node)) {
        console.error('diff: newEl must be a valid DOM Node', newEl);
        return;
    }
    
    try {
    // 1. Node Mismatch or Missing: Replace/Append
    if (!oldEl) {
        parent.appendChild(newEl);
        return;
    }
        if (!(oldEl instanceof Node)) {
            console.error('diff: oldEl is not a valid DOM Node', oldEl);
            parent.replaceChild(newEl, oldEl);
            return;
        }
    if (!newEl) {
            try {
        parent.removeChild(oldEl);
            } catch(e) {
                console.warn('diff: Could not remove oldEl', e);
            }
        return;
    }
    
    // 2. Text Nodes: Update Content
    if (newEl.nodeType === 3 && oldEl.nodeType === 3) {
        if (newEl.nodeValue !== oldEl.nodeValue) {
                try {
            oldEl.nodeValue = newEl.nodeValue;
                } catch(e) {
                    console.warn('diff: Could not update text node value', e);
                }
        }
        return;
    }

    // 3. Different Tags: Full Replace
    if (newEl.nodeName !== oldEl.nodeName) {
            try {
        parent.replaceChild(newEl, oldEl);
            } catch(e) {
                console.error('diff: Error replacing node', e);
                // Fallback: clear and append
                try {
                    parent.innerHTML = '';
                    parent.appendChild(newEl);
                } catch(e2) {
                    console.error('diff: Fatal error in fallback', e2);
                }
            }
        return;
    }
    
    // 4. Skip Complex Web Components (Internal State Protection)
    if (newEl.nodeName.includes('-')) return;

    // 5. Sync Attributes & Properties
    // Remove old attributes
        try {
    Array.from(oldEl.attributes).forEach(attr => {
                try {
        if (!newEl.hasAttribute(attr.name)) {
            oldEl.removeAttribute(attr.name);
            if (attr.name in oldEl) oldEl[attr.name] = false; // Reset props
                    }
                } catch(e) {
                    console.warn('diff: Error removing attribute', attr.name, e);
        }
    });
        } catch(e) {
            console.warn('diff: Error processing old attributes', e);
        }
    
    // Set new attributes
        try {
    Array.from(newEl.attributes).forEach(attr => {
                try {
        const name = attr.name;
        const value = attr.value;
        
        if (oldEl.getAttribute(name) !== value) {
            oldEl.setAttribute(name, value);
        }
        
        // SYNC PROPERTIES (CRITICAL FIX FOR INPUTS/VIDEO)
        if (['value', 'checked', 'muted', 'autoplay', 'loop'].includes(name)) {
             oldEl[name] = name === 'value' ? value : true;
                    }
                } catch(e) {
                    console.warn('diff: Error setting attribute', attr.name, e);
        }
    });
        } catch(e) {
            console.warn('diff: Error processing new attributes', e);
        }

    // Sync Input Value explicitly if it differs (Fixes typing issue)
        try {
    if (newEl.tagName === 'INPUT' && newEl.value !== oldEl.value) {
        oldEl.value = newEl.value;
            }
        } catch(e) {
            console.warn('diff: Error syncing input value', e);
    }

    // Sync Events
        try {
    if (newEl.onclick !== oldEl.onclick) oldEl.onclick = newEl.onclick;
    if (newEl.oninput !== oldEl.oninput) oldEl.oninput = newEl.oninput;
        } catch(e) {
            console.warn('diff: Error syncing events', e);
        }

    // 6. Recurse Children (Safe Loop)
        try {
    const newChildren = Array.from(newEl.childNodes);
    const oldChildren = Array.from(oldEl.childNodes);
    const maxLength = Math.max(newChildren.length, oldChildren.length);

    for (let i = 0; i < maxLength; i++) {
                try {
                    const newChild = newChildren[i];
                    const oldChild = oldChildren[i];
                    // Only diff if newChild is a valid Node (skip undefined/null)
                    if (newChild && newChild instanceof Node) {
                        diff(oldEl, newChild, oldChild);
                    } else if (oldChild && oldChild instanceof Node) {
                        // Remove old child if new child is missing/invalid
                        try {
                            oldEl.removeChild(oldChild);
                        } catch(e) {
                            console.warn('diff: Could not remove old child', e);
                        }
                    }
                } catch(childError) {
                    console.warn(\`diff: Error diffing child at index \${i}\`, childError);
                    // Continue with next child
                }
            }
        } catch(e) {
            console.error('diff: Error processing children', e);
            // Fallback: replace entire node if children diff fails
            try {
                parent.replaceChild(newEl, oldEl);
            } catch(e2) {
                console.error('diff: Fatal error in children fallback', e2);
            }
        }
    } catch(e) {
        console.error('diff: Fatal error', e);
        // Last resort: replace the entire node
        try {
            if (oldEl && oldEl.parentNode === parent) {
                parent.replaceChild(newEl, oldEl);
            } else {
                parent.appendChild(newEl);
            }
        } catch(e2) {
            console.error('diff: Cannot recover from error', e2);
        }
    }
}

function matchRoute(path) {
    // Normalize path - remove trailing slashes except root
    const normalizedPath = path === '/' ? '/' : path.replace(/\\/$/, '');
    
    for (let i = 0; i < Routes.length; i++) {
        const route = Routes[i];
        if (route.regex.test(normalizedPath)) {
            const match = normalizedPath.match(route.regex);
            const params = {};
            
            // Safely extract params
            if (route.paramNames && Array.isArray(route.paramNames)) {
                for (let j = 0; j < route.paramNames.length; j++) {
                    const name = route.paramNames[j];
                    // For optional catch-all, the match might be undefined if no path segments
                    // Note: match[0] is the full match, match[1] is first capture group
                    const value = match && match[j + 1] !== undefined ? match[j + 1] : undefined;
                // Handle catch-all routes - split by / to create array
                    if (value !== undefined && value !== null && value !== '') {
                        if (typeof value === 'string' && value.includes('/')) {
                    params[name] = value.split('/').filter(Boolean);
                        } else if (value) {
                            params[name] = [value]; // Single segment as array
                } else {
                            params[name] = [];
                        }
                    } else {
                        // Empty catch-all should be empty array (when /docs matches with no slug)
                        params[name] = [];
                }
                }
            }
            
            return { 
                component: route.component, 
                params: params || {}, 
                title: route.title || 'ATOM App', 
                meta: route.meta || [] 
            };
        }
    }
    for (let i = 0; i < Routes.length; i++) {
        if (Routes[i].title === '404 Not Found') {
            return { component: Routes[i].component, params: {}, title: "404 Not Found", meta: [] };
        }
    }
    return null;
}

// CSS_INJECT

const ERROR_MODAL_STYLE = \`
    .err-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 2147483647; font-family: -apple-system, monospace; }
    .err-card { width: 100%; max-width: 650px; background: #0a0a0a; border: 1px solid #333; border-radius: 16px; box-shadow: 0 50px 100px -20px rgba(0,0,0,0.7); overflow: hidden; }
    .err-header { background: #1f1212; border-bottom: 1px solid #451a1a; padding: 16px 24px; display: flex; align-items: center; gap: 12px; }
    .err-icon { width: 12px; height: 12px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 10px #ef4444; }
    .err-title { color: #fca5a5; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .err-body { padding: 30px; }
    .err-msg { color: #94a3b8; font-size: 13px; line-height: 1.6; word-break: break-word; }
\`;

function showRuntimeError(error) {
    const style = document.createElement('style');
    style.textContent = ERROR_MODAL_STYLE;
    document.head.appendChild(style);
    const overlay = document.createElement('div');
    overlay.className = 'err-backdrop';
    
    // Extract error context
    const errorMessage = error.message || 'Unknown error occurred';
    const errorStack = error.stack ? error.stack.split('\\n').slice(0, 5).join('\\n') : '';
    const currentPath = window.location.pathname;
    
    overlay.innerHTML = \`
        <div class="err-card">
            <div class="err-header"><div class="err-icon"></div><div class="err-title">Runtime Error</div></div>
            <div class="err-body">
                <div class="err-msg"><strong>Error:</strong> \${errorMessage}</div>
                <div style="margin-top:12px; color:#888; font-size:11px;"><strong>Page:</strong> \${currentPath}</div>
                \${errorStack ? \`<div style="margin-top:12px; color:#666; font-size:10px; font-family:monospace; white-space:pre-wrap; max-height:150px; overflow:auto; background:#111; padding:8px; border-radius:4px;">\${errorStack}</div>\` : ''}
                <div style="margin-top:20px; color:#555; font-size:11px;">Check browser console for full stack trace.</div>
            </div>
        </div>
    \`;
    document.body.appendChild(overlay);
}

// Error boundary wrapper for component rendering
function renderWithErrorBoundary(component, props, routePath) {
    try {
        return component(props);
    } catch(error) {
        console.error(\`Component error in route "\${routePath}":\`, error);
        const errorMessage = error && error.message ? error.message : 'Unknown error';
        const errorStack = error && error.stack ? error.stack : '';
        return div([
            div('⚠️ Component Error', { className: 'text-red-600 font-bold text-lg mb-2' }),
            div(errorMessage, { className: 'text-red-500 mb-2' }),
            div(errorStack.split('\\n').slice(0, 5).join('\\n'), { 
                className: 'text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded overflow-auto max-h-32',
                style: { fontSize: '10px' }
            })
        ], { 
            className: 'p-4 border border-red-300 bg-red-50 rounded',
            style: { margin: '20px' }
        });
    }
}

export function renderApp() {
    const root = document.getElementById('root');
    if(!root) {
        console.error('renderApp: Root element not found');
        return;
    }
    
    // Mark as rendering to help with hook validation
    _isRendering = true;
    
    try {
        // Reset cursors for new render cycle
    _cursor = 0;
        _effectCursor = 0;
        _refCursor = 0;
        _memoCursor = 0;
        
    const match = matchRoute(_currentPath);
    let VNode;
        
    if (match) {
            // Safely set document title
            try {
                document.title = match.title || 'Atom App';
            } catch(e) {
                console.warn('Failed to set document title:', e);
            }
            
            // Safely handle meta tags
            if (match.meta && Array.isArray(match.meta)) {
            match.meta.forEach(m => {
                    try {
                        // Safely handle meta objects - skip invalid entries
                        if (m && typeof m === 'object' && m.name && m.content) {
                let tag = document.querySelector(\`meta[name="\${m.name}"]\`);
                            if (!tag) { 
                                tag = document.createElement('meta'); 
                                tag.name = m.name; 
                                document.head.appendChild(tag); 
                            }
                tag.content = m.content;
                        }
                    } catch(e) {
                        console.warn('Failed to set meta tag:', m, e);
        }
                });
            }
            
            try { 
                // Ensure params is always an object and component receives proper props
                const safeParams = match.params || {};
                const componentProps = { params: safeParams };
                
                // Validate component is a function
                if (typeof match.component !== 'function') {
                    throw new Error(\`Route component is not a function. Received: \${typeof match.component}\`);
                }
                
                // Render component with error boundary
                let componentResult = renderWithErrorBoundary(match.component, componentProps, _currentPath);
                
                // Handle async components (lazy loaded routes)
                if (componentResult && typeof componentResult.then === 'function') {
                    // Component is async - show loading state and await
                    VNode = div('Loading...', { className: 'flex justify-center p-20 text-gray-500' });
                    componentResult.then((resolvedNode) => {
                        try {
                            if (resolvedNode instanceof Node) {
                                const currentDom = root.firstChild;
                                if (currentDom) {
                                    root.replaceChild(resolvedNode, currentDom);
                                } else {
                                    root.appendChild(resolvedNode);
                                }
                            } else {
                                console.error('Async component returned non-Node:', typeof resolvedNode, resolvedNode);
                                const errorNode = div('Error: Component must return a DOM Node');
                                const currentDom = root.firstChild;
                                if (currentDom) {
                                    root.replaceChild(errorNode, currentDom);
                                } else {
                                    root.appendChild(errorNode);
                                }
                            }
                        } catch(e) {
                            console.error('Error updating DOM after async component:', e);
                        }
                    }).catch((err) => {
                        console.error('Async component error:', err);
                        const errorNode = div([
                            div('⚠️ Loading Error', { className: 'text-red-600 font-bold mb-2' }),
                            div(err.message || 'Failed to load component', { className: 'text-red-500' })
                        ], { className: 'p-4 border border-red-300 bg-red-50 rounded m-4' });
                        const currentDom = root.firstChild;
                        try {
                            if (currentDom) {
                                root.replaceChild(errorNode, currentDom);
                            } else {
                                root.appendChild(errorNode);
                            }
                        } catch(e) {
                            console.error('Error displaying error node:', e);
                        }
                    });
                } else {
                    VNode = componentResult;
                }
                
                // Ensure VNode is a DOM Node (for sync components)
                if (!VNode || !(VNode instanceof Node)) {
                    console.error('Component returned invalid value:', typeof VNode, VNode);
                    VNode = div('Error: Component must return a DOM Node');
                }
        } catch(e) { 
            // Enhance error with route context
            const enhancedError = new Error(\`Error rendering route "\${_currentPath}": \${e.message}\`);
            enhancedError.stack = e.stack;
            enhancedError.originalError = e;
            console.error('Route Error:', {
                path: _currentPath,
                error: e.message,
                stack: e.stack
            }); 
            showRuntimeError(enhancedError);
                VNode = div([
                    div('⚠️ Rendering Error', { className: 'text-red-600 font-bold text-lg mb-2' }),
                    div(e.message || 'Unknown error', { className: 'text-red-500' })
                ], { 
                    className: 'p-4 border border-red-300 bg-red-50 rounded m-4' 
                });
        }
    } else {
            VNode = div([
                div('404 - Page Not Found', { className: 'text-gray-800 font-bold text-xl mb-2' }),
                div(\`The route "\${_currentPath}" was not found.\`, { className: 'text-gray-600' }),
                a('Go Home', { href: '/', className: 'text-blue-600 hover:underline mt-4 inline-block' })
            ], { 
                className: 'p-8 text-center' 
            });
        }
        
        // Final safety check - ensure VNode is a Node
        if (!VNode || !(VNode instanceof Node)) {
            console.error('VNode is not a valid Node:', typeof VNode, VNode);
            VNode = div('Error: Invalid component return value');
    }
        
        // Safely update DOM
        try {
    const currentDom = root.firstChild;
            if (!currentDom) { 
                root.appendChild(VNode); 
            } else { 
                // Double-check VNode is valid before diffing
                if (VNode && VNode instanceof Node) {
                    diff(root, VNode, currentDom);
                } else {
                    console.error('Cannot diff: VNode is not a valid Node', VNode);
                    // VNode should already be a valid error div at this point, but ensure it is
                    if (!VNode || !(VNode instanceof Node)) {
                        VNode = div('Error: Invalid component return value');
                    }
                    root.replaceChild(VNode, currentDom);
                }
            }
        } catch(e) {
            console.error('Error updating DOM:', e);
            // Last resort: replace entire root content
            try {
                root.innerHTML = '';
                root.appendChild(VNode);
            } catch(e2) {
                console.error('Fatal: Cannot update DOM:', e2);
            }
        }
    } catch(e) {
        console.error('Fatal error in renderApp:', e);
        // Last resort error display
        try {
            root.innerHTML = \`<div style="padding: 20px; color: red; font-family: monospace;">
                <h1>Fatal Error</h1>
                <p>\${e.message || 'Unknown error'}</p>
                <pre style="font-size: 10px; overflow: auto;">\${e.stack || ''}</pre>
            </div>\`;
        } catch(e2) {
            console.error('Cannot even display error:', e2);
        }
    } finally {
        _isRendering = false;
    }
}

if (typeof window !== 'undefined') {
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        cleanupEffects();
        if (_renderTimeout) clearTimeout(_renderTimeout);
    });
    
    window.onpopstate = () => { 
        cleanupEffects();
        _currentPath = window.location.pathname; 
        _cursor = 0;
        scheduleRender(); 
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleRender);
    } else {
        scheduleRender();
    }
}
`;

module.exports.getSSRRuntime = (imports, layoutCode, routes, layoutHierarchyCode = '') => `
    // ATOM SSR RUNTIME
    
    // Define hooks as function declarations (hoisted) so they are available to component code
    // These must be in the module scope and accessible to all component code
    function useState(initialValue) { return [initialValue, () => {}]; }
    function useEffect(callback, deps) { /* SSR: no-op */ }
    function useMemo(factory, deps) { return factory(); }
    function useCallback(callback, deps) { return callback; }
    function useRef(initialValue) { return { current: initialValue }; }
    function usePath() { return typeof window !== 'undefined' ? window.location.pathname : '/'; }
    function navigate() {}

    // Export them for the module (they're available in local scope for component code)
    // Note: SSR uses CommonJS, so we'll export via module.exports at the end
    
    function el(tag, content, props = {}) {
        let attrs = "";
        Object.keys(props).forEach(key => {
            if (key.startsWith('on')) return;
            if (key === 'className') attrs += \` class="\${props[key]}"\`;
            else if (key === 'style') {
                const styleStr = Object.entries(props[key]).map(([k,v]) => \`\${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:\${v}\`).join(';');
                attrs += \` style="\${styleStr}"\`;
            } else if (key === 'innerHTML') {} 
            
            // Handle Boolean Attrs for SSR
            else if (['autoplay', 'loop', 'muted', 'controls', 'playsinline', 'checked', 'disabled'].includes(key)) {
                if(props[key]) attrs += \` \${key}\`;
            }
            else attrs += \` \${key}="\${props[key]}"\`;
        });
        // Handle content - skip null/undefined/false values
        // Note: For SSR, content is typically a string (HTML), not a Node
        let innerHTML = '';
        if (content === null || content === undefined || content === false) {
            innerHTML = ''; // Skip null/undefined/false
        } else if (Array.isArray(content)) {
            // Filter out null/undefined/false values before joining
            innerHTML = content.filter(c => c !== null && c !== undefined && c !== false).map(c => {
                // If it's a Node-like object with outerHTML, use that, otherwise convert to string
                return (typeof c === 'object' && c.outerHTML) ? c.outerHTML : String(c);
            }).join('');
        } else {
            // For SSR, content should be a string (HTML)
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
    const dl = (c, p) => el('dl', c, p);
    const dt = (c, p) => el('dt', c, p);
    const dd = (c, p) => el('dd', c, p);
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
    const b = (c, p) => el('b', c, p);
    const i = (c, p) => el('i', c, p);
    const small = (c, p) => el('small', c, p);
    const code = (c, p) => el('code', c, p);
    const pre = (c, p) => el('pre', c, p);
    const blockquote = (c, p) => el('blockquote', c, p);
    const hr = (p) => el('hr', null, p);
    const br = () => el('br', null);
    
    const img = (props) => el('img', null, props);
    const html = (c, p) => el('html', c, p);
    const body = (c, p) => el('body', c, p);
    const head = (c, p) => el('head', c, p);
    const title = (c, p) => el('title', c, p);
    const link = (p) => el('link', null, p);
    const script = (c, p) => el('script', c, p);
    const meta = (p) => el('meta', null, p);
    
    // SSR Image component (generates optimized URLs)
    const Image = (props) => {
        const { src, width, height, sizes, quality, format, ...restProps } = props;
        
        // If it's an external URL, use as-is
        if (src && (src.startsWith('http://') || src.startsWith('https://'))) {
            return el('img', null, { loading: "lazy", decoding: "async", ...props });
        }
        
        // Helper to get optimized URL (supports CDN)
        const getOptimizedUrl = (w, h, q, f) => {
            // Check if CDN is configured via environment
            const cdn = typeof process !== 'undefined' && process.env && process.env.IMAGE_CDN;
            if (cdn && cdn !== 'local') {
                // CDN URLs are generated server-side, client gets pre-optimized URLs
                return \`/_atom/image?url=\${encodeURIComponent(src)}&w=\${w || ''}&h=\${h || ''}&q=\${q || 85}&fmt=\${f || 'auto'}\`;
            }
            return \`/_atom/image?url=\${encodeURIComponent(src)}&w=\${w || ''}&h=\${h || ''}&q=\${q || 85}&fmt=\${f || 'auto'}\`;
        };
        
        // Generate srcset for responsive images
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
        
        // Single optimized image
        if (src && (width || height)) {
            const optimizedSrc = \`/_atom/image?url=\${encodeURIComponent(src)}&w=\${width || ''}&h=\${height || ''}&q=\${quality || 85}&fmt=\${format || 'auto'}\`;
            return el('img', null, { 
                src: optimizedSrc,
                width,
                height,
                loading: "lazy", 
                decoding: "async", 
                ...restProps 
            });
        }
        
        // Fallback
        return el('img', null, { loading: "lazy", decoding: "async", ...props });
    };
    
    // SSR STUBS
    const Video = (props) => {
        const children = props.children || [];
        const safeProps = { ...props };
        delete safeProps.children;
        return el('video', children, safeProps);
    };
    const Audio = (props) => el('audio', null, props);
    const source = (props) => el('source', null, props);

    const a = (text, props) => el('a', text, props);

    ${imports}

    ${layoutCode}
    ${layoutHierarchyCode}
    ${routes}
    
    // Export everything via CommonJS (SSR uses CommonJS format)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Routes = Routes;
        module.exports.matchRoute = matchRoute;
        module.exports.renderToString = renderToString;
        module.exports.renderToStream = renderToStream;
        module.exports.useState = useState;
        module.exports.useEffect = useEffect;
        module.exports.useMemo = useMemo;
        module.exports.useCallback = useCallback;
        module.exports.useRef = useRef;
        module.exports.usePath = usePath;
        module.exports.navigate = navigate;
    }
    
    function matchRoute(path) {
        // Normalize path - remove trailing slashes except root
        const normalizedPath = path === '/' ? '/' : path.replace(/\\/$/, '');
        
        for (let i = 0; i < Routes.length; i++) {
            const route = Routes[i];
            if (route.regex.test(normalizedPath)) {
                const match = normalizedPath.match(route.regex);
                const params = {};
                
                // Safely extract params
                if (route.paramNames && Array.isArray(route.paramNames)) {
                    for (let j = 0; j < route.paramNames.length; j++) {
                    const name = route.paramNames[j];
                    // For optional catch-all, the match might be undefined if no path segments
                    // Note: match[0] is the full match, match[1] is first capture group
                    const value = match && match[j + 1] !== undefined ? match[j + 1] : undefined;
                    // Handle catch-all routes - split by / to create array
                    if (value !== undefined && value !== null && value !== '') {
                        if (typeof value === 'string' && value.includes('/')) {
                        params[name] = value.split('/').filter(Boolean);
                        } else if (value) {
                            params[name] = [value]; // Single segment as array
                    } else {
                            params[name] = [];
                        }
                    } else {
                        // Empty catch-all should be empty array (when /docs matches with no slug)
                        params[name] = [];
                    }
                    }
                }
                
                return { 
                    component: route.component, 
                    params: params || {}, 
                    title: route.title || 'ATOM App', 
                    meta: route.meta || [] 
                };
            }
        }
        for (let i = 0; i < Routes.length; i++) {
            if (Routes[i].title === '404 Not Found') {
                return { component: Routes[i].component, params: {}, title: "404 Not Found", meta: [] };
            }
        }
        return null;
    }
    
    // SSR Error boundary wrapper
    function renderSSRWithErrorBoundary(component, props, routePath) {
        try {
            if (typeof component !== 'function') {
                throw new Error(\`Component is not a function. Received: \${typeof component}\`);
            }
            return component(props);
        } catch(error) {
            console.error(\`SSR Component error in route "\${routePath}":\`, error);
            const errorMessage = error && error.message ? error.message : 'Unknown error';
            return \`<div style="padding: 20px; border: 2px solid red; background: #fee; border-radius: 4px; margin: 20px;">
                <h2 style="color: #c00; margin: 0 0 10px 0;">⚠️ Server Rendering Error</h2>
                <p style="color: #800; margin: 0;">\${errorMessage}</p>
            </div>\`;
        }
    }
    
    async function renderToString(url) {
        // Validate input
        if (!url || typeof url !== 'string') {
            console.error('renderToString: Invalid URL', url);
            return { 
                html: "<h1>Invalid Request</h1><p>Invalid URL provided</p>", 
                title: "Error",
                meta: [],
                revalidate: null,
                isStatic: false,
                enableStreaming: false
            };
        }
        
        try {
        const match = matchRoute(url);
            if (!match) {
                return { 
                    html: "<h1>404 - Page Not Found</h1><p>The requested page could not be found.</p>", 
                    title: "404 Not Found", 
                    meta: [], 
                    revalidate: null, 
                    isStatic: false, 
                    enableStreaming: false 
                };
            }
            
            try {
                const componentProps = { params: match.params || {} };
                
                // Pass Layout functions to route components that need them
                // Layout functions are defined in the module scope from layoutCode
                // Access them from the current module scope
                try {
                    if (typeof Layout !== 'undefined' && typeof Layout === 'function') {
                        componentProps.Layout = Layout;
                    }
                    // Also check for nested layouts (Layout_dashboard, etc.)
                    const layoutKeys = Object.keys(typeof globalThis !== 'undefined' ? globalThis : {});
                    for (const key of layoutKeys) {
                        if (key.startsWith('Layout_') && typeof (typeof globalThis !== 'undefined' ? globalThis : {})[key] === 'function') {
                            componentProps[key] = (typeof globalThis !== 'undefined' ? globalThis : {})[key];
                        }
                    }
                } catch(layoutError) {
                    console.warn('renderToString: Error accessing Layout functions', layoutError);
                    // Continue without Layout - component should handle it
                }
                
                // Render component with error boundary
                let html = renderSSRWithErrorBoundary(match.component, componentProps, url);
                
            // Handle Promise if component is async
            if (html && typeof html.then === 'function') {
                    try {
                html = await html;
                    } catch(asyncError) {
                        console.error('renderToString: Async component error', asyncError);
                        html = \`<div style="padding: 20px; border: 2px solid red; background: #fee;">
                            <h2>⚠️ Loading Error</h2>
                            <p>\${asyncError.message || 'Failed to load component'}</p>
                        </div>\`;
                    }
                }
                
            // Ensure html is a string
            if (typeof html !== 'string') {
                    // If it's an object with outerHTML (DOM node), use that
                    if (html && typeof html === 'object' && html.outerHTML) {
                        html = html.outerHTML;
                    } else {
                        // Convert to string, handling null/undefined
                        console.warn('renderToString: Component returned non-string, converting', typeof html);
                html = String(html || '');
            }
                }
                
                // Validate HTML is not empty (unless intentionally empty)
                if (!html || html.trim() === '') {
                    console.warn('renderToString: Component returned empty HTML for route', url);
                    html = '<div>No content</div>';
                }
                
            return { 
                html, 
                title: match.title || "Atom App", 
                meta: match.meta || [],
                revalidate: match.revalidate || null,
                isStatic: match.isStatic || false,
                enableStreaming: match.enableStreaming || false
            };
            } catch (componentError) {
                console.error('renderToString: Component rendering error', componentError);
                return { 
                    html: \`<div style="padding: 20px; border: 2px solid red; background: #fee; border-radius: 4px; margin: 20px;">
                        <h2 style="color: #c00; margin: 0 0 10px 0;">⚠️ Server Rendering Error</h2>
                        <p style="color: #800; margin: 0;">\${componentError.message || 'Unknown error occurred'}</p>
                    </div>\`, 
                    title: "Error",
                    meta: [],
                    revalidate: null,
                    isStatic: false,
                    enableStreaming: false
                };
            }
        } catch (e) { 
            console.error('renderToString: Fatal error', e);
            return { 
                html: \`<div style="padding: 20px; border: 2px solid red; background: #fee;">
                    <h2>⚠️ Fatal Server Error</h2>
                    <p>\${e.message || 'An unexpected error occurred'}</p>
                </div>\`, 
                title: "Error",
                meta: [],
                revalidate: null,
                isStatic: false,
                enableStreaming: false
            }; 
        }
    };
    
    // Streaming SSR - Progressive HTML rendering
    async function* renderToStream(url) {
        const match = matchRoute(url);
        if (!match) {
            yield "<h1>404 Error</h1>";
            return;
        }
        
        try {
            // Stream HTML head first
            const metaTags = (match.meta || []).map(m => \`<meta name="\${m.name}" content="\${m.content}">\`).join('\\n');
            yield \`<!DOCTYPE html><html><head><title>\${match.title || "Atom App"}</title>\${metaTags}<meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" href="/favicon.ico"></head><body><div id="root">\`;
            
            // Stream component content
            const componentProps = { params: match.params || {} };
            const html = match.component(componentProps);
            yield html;
            
            // Stream closing tags
            yield '</div><script src="/bundle.js"></script></body></html>';
        } catch (e) {
            yield \`<h1>Server Error</h1><p>\${e.message}</p>\`;
        }
    };
`;