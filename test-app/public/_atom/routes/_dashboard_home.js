
// Route: /dashboard/home

// SSR Hooks (no-op stubs for server-side rendering)
function useState(initialValue) { return [initialValue, () => {}]; }
function useEffect(callback, deps) { /* SSR: no-op */ }
function useMemo(factory, deps) { return factory(); }
function useCallback(callback, deps) { return callback; }
function useRef(initialValue) { return { current: initialValue }; }
function usePath() { return typeof window !== 'undefined' ? window.location.pathname : '/'; }
function navigate() {}

// SSR Component Definitions

const Card = (props) => { const safeProps = props || {};
  return div([
    h3(safeProps.title, { className: "text-xl font-bold mb-2" }),
    p(safeProps.children, { className: "text-gray-600" })
  ], { className: "bg-white p-6 rounded-xl shadow border border-gray-100" }); };

const CodeBlock = (props) => { const { code, language = 'javascript', title = '', showLineNumbers = false, className = '' } = props;

  if (!code || typeof code !== 'string') {
    return div('No code provided', { className: 'text-gray-500 italic' });
  }

  // Build the container structure
  const children = [];

  // Add title if provided
  if (title) {
    children.push(
      div([
        span(title, { className: 'text-sm font-medium text-gray-700' }),
        span(language.toUpperCase(), {
          className: 'text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded ml-2'
        })
      ], {
        className: 'flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200'
      })
    );
  } else {
    // Just show language badge in top-right if no title
    children.push(
      div([
        span(language.toUpperCase(), {
          className: 'text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded'
        })
      ], {
        className: 'absolute top-2 right-2'
      })
    );
  }

  // Add the code block with proper styling
  const codeBlockClass = 'relative bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto' +
    (showLineNumbers ? ' line-numbers' : '') +
    (className ? ' ' + className : '');

  children.push(
    pre(code, {
      className: codeBlockClass
    })
  );

  return div(children, {
    className: 'code-block-container border border-gray-200 rounded-lg overflow-hidden shadow-sm'
  }); };

const ErrorDisplay = (props) => { const { error, className = "" } = props || {};
  if (!error) return null;
  
  // Safely access error properties
  const errorMessage = typeof error === 'string' ? error : (error && error.message ? error.message : "Unknown error occurred");
  const errorHint = error && typeof error === 'object' && error.hint ? error.hint : null;
  
  return div([
    div([
      div("⚠️", { className: "text-2xl mr-3" }),
      div([
        h4("Something went wrong", { className: "font-bold text-red-800" }),
        p(errorMessage, { className: "text-red-600 text-sm mt-1" }),
        errorHint ? p("💡 " + errorHint, { className: "text-amber-700 text-xs mt-2 bg-amber-50 p-2 rounded border border-amber-100" }) : null
      ])
    ], { className: "flex items-start" })
  ], { className: `bg-red-50 border border-red-200 rounded-lg p-4 ${className}` }); };

const Footer = (props) => { return footer([
    div([
      div([
        h3("ATOM Showcase", { className: "text-xl font-bold text-white mb-4" }),
        p("Demonstrating the power of the ATOM Framework V53.", { className: "text-gray-400" })
      ], { className: "col-span-1 md:col-span-2" }),
      
      div([
        h4("Links", { className: "font-bold text-white mb-4" }),
        div([
          a("Home", { href: "/", className: "block text-gray-400 hover:text-white mb-2" }),
          a("Products", { href: "/products", className: "block text-gray-400 hover:text-white mb-2" }),
          a("Blog", { href: "/blog", className: "block text-gray-400 hover:text-white mb-2" }),
          a("About", { href: "/about", className: "block text-gray-400 hover:text-white mb-2" })
        ])
      ]),
      
      div([
        h4("Connect", { className: "font-bold text-white mb-4" }),
        div([
          a("GitHub", { href: "https://github.com", className: "block text-gray-400 hover:text-white mb-2" }),
          a("Twitter", { href: "https://twitter.com", className: "block text-gray-400 hover:text-white mb-2" }),
          a("Discord", { href: "https://discord.com", className: "block text-gray-400 hover:text-white mb-2" })
        ])
      ])
    ], { className: "grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto" }),
    
    div("© 2024 ATOM Framework. Open Source.", { className: "text-center text-gray-500 mt-12 pt-8 border-t border-gray-800" })
  ], { className: "bg-gray-900 py-12 px-6 mt-auto" }); };

const FormInput = (props) => { const { label: labelText, type = "text", value, placeholder, error, required, onChange, className = "" } = props || {};
  const safeValue = typeof value === 'string' ? value : (value === null || value === undefined ? '' : String(value));

  const handleInput = (e) => {
    const nextValue = e && e.target ? e.target.value : '';
    if (typeof onChange === 'function') {
      onChange(typeof nextValue === 'string' ? nextValue : '');
    }
  };
  
  return div([
    labelText ? label(labelText, { className: "block text-sm font-medium text-gray-700 mb-1" }) : null,
    type === "textarea" 
      ? textarea(null, {
          className: `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'} ${className}`,
          placeholder: placeholder,
          value: safeValue,
          required: required,
          oninput: handleInput
        })
      : input(null, {
          type: type,
          value: safeValue,
          className: `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'} ${className}`,
          placeholder: placeholder,
          required: required,
          oninput: handleInput
        }),
    error ? p(error, { className: "mt-1 text-sm text-red-600" }) : null
  ], { className: "w-full" }); };

const Header = (props) => { const { activePath } = props || {};
  
  const linkClass = (path) => `text-sm font-medium transition-colors ${
    activePath === path 
      ? "text-blue-600 font-bold" 
      : "text-gray-600 hover:text-blue-600"
  }`;

  return nav([
    div([
      a("ATOM Showcase", { href: "/", className: "text-xl font-black tracking-tight text-gray-900" }),
      
      div([
        a("Home", { href: "/", className: linkClass("/") }),
        a("Products", { href: "/products", className: linkClass("/products") }),
        a("Blog", { href: "/blog", className: linkClass("/blog") }),
        a("Dashboard", { href: "/dashboard/home", className: linkClass("/dashboard/home") }),
        a("Docs", { href: "/docs", className: linkClass("/docs") }),
        a("Contact", { href: "/contact", className: "px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-bold" })
      ], { className: "hidden md:flex items-center gap-8" }),
      
      // Mobile menu button placeholder
      div("☰", { className: "md:hidden text-2xl cursor-pointer" })
    ], { className: "flex justify-between items-center max-w-7xl mx-auto" })
  ], { className: "bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50" }); };

const ImageGallery = (props) => { const { images = [] } = props || {}; // Array of { src, alt }
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  return div([
    // Main Image
    div([
      Image({
        src: images[selectedIndex].src,
        alt: images[selectedIndex].alt,
        width: 800,
        height: 600,
        className: "w-full h-[400px] object-cover rounded-xl shadow-lg transition-opacity duration-300"
      })
    ], { className: "mb-4" }),
    
    // Thumbnails
    div(images.map((img, idx) => 
      div([
        Image({
          src: img.src,
          alt: img.alt,
          width: 100,
          height: 100,
          className: "w-full h-full object-cover"
        })
      ], {
        className: `w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition ${
          selectedIndex === idx ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
        }`,
        onclick: () => setSelectedIndex(idx)
      })
    ), { className: "flex gap-4 overflow-x-auto pb-2" })
  ], { className: "w-full" }); };

const LoadingSpinner = (props) => { return div([
    div([], { className: "w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" }),
    p("Loading...", { className: "mt-4 text-gray-500 font-medium animate-pulse" })
  ], { className: "flex flex-col items-center justify-center p-12" }); };

const ProductCard = (props) => { const { title, description, image, price, onAddToCart } = props || {};
  
  return div([
    image ? Image({ 
      src: image, 
      alt: title, 
      width: 400, 
      height: 300, 
      className: "w-full h-48 object-cover" 
    }) : null,
    
    div([
      h3(title, { className: "text-xl font-bold mb-2" }),
      p(description, { className: "text-gray-600 mb-4 line-clamp-2" }),
      div([
        span(price, { className: "text-2xl font-bold text-blue-600" }),
        button("Add to Cart", { 
          className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition",
          onclick: onAddToCart
        })
      ], { className: "flex justify-between items-center" })
    ], { className: "p-4" })
  ], { className: "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100" }); };

const StatusCard = (props) => { // A reusable component that accepts props
    const safeProps = props || {};
    return div([
      div(safeProps.label, { className: "text-xs font-bold text-gray-400 uppercase tracking-widest mb-1" }),
      div(safeProps.value, { className: "text-2xl font-black text-gray-800" }),
      safeProps.sub ? div(safeProps.sub, { className: "text-xs text-gray-500 mt-1" }) : null
    ], { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100" }); };


// SSR HTML Helper Functions
function el(tag, content, props = {}) {
    let attrs = "";
    Object.keys(props).forEach(key => {
        if (key.startsWith('on')) return;
        if (key === 'className') attrs += ` class="${props[key]}"`;
        else if (key === 'style') {
            const styleStr = Object.entries(props[key]).map(([k,v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';');
            attrs += ` style="${styleStr}"`;
        } else if (['autoplay', 'loop', 'muted', 'controls', 'playsinline', 'checked', 'disabled'].includes(key)) {
            if(props[key]) attrs += ` ${key}`;
        } else if (key === 'value') {
            // CRITICAL: Handle all edge cases for value - undefined, null, false, and string "undefined"
            let safeVal;
            if (props[key] === undefined || props[key] === null || props[key] === false) {
                safeVal = '';
            } else if (typeof props[key] === 'string' && props[key] === 'undefined') {
                // Handle case where undefined was stringified
                safeVal = '';
            } else {
                safeVal = String(props[key]);
            }
            if (safeVal !== '') attrs += ` value="${safeVal.replace(/"/g, '&quot;')}"`;
        } else if (props[key] !== null && props[key] !== undefined && typeof props[key] !== 'object') {
            attrs += ` ${key}="${String(props[key]).replace(/"/g, '&quot;')}"`;
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
    if (['input', 'img', 'br', 'hr', 'atom-video', 'atom-play', 'atom-progress', 'atom-cursor', 'source'].includes(tag)) return `<${tag}${attrs} />`;
    return `<${tag}${attrs}>${innerHTML}</${tag}>`;
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
        return `/_atom/image?url=${encodeURIComponent(src)}&w=${w || ''}&h=${h || ''}&q=${q || 85}&fmt=${f || 'auto'}`;
    };
    if (width && sizes) {
        const baseUrl = src || props.src;
        const widths = [640, 768, 1024, 1280, 1920].filter(w => w <= width * 2);
        const srcset = widths.map(w => {
            const url = `/_atom/image?url=${encodeURIComponent(baseUrl)}&w=${w}&q=${quality || 85}&fmt=${format || 'auto'}`;
            return `${url} ${w}w`;
        }).join(', ');
        return el('img', null, {
            src: `/_atom/image?url=${encodeURIComponent(baseUrl)}&w=${width}&q=${quality || 85}&fmt=${format || 'auto'}`,
            srcset,
            sizes: sizes || `(max-width: ${width}px) 100vw, ${width}px`,
            width,
            height,
            loading: "lazy",
            decoding: "async",
            ...restProps
        });
    }
    if (src && (width || height)) {
        const optimizedSrc = `/_atom/image?url=${encodeURIComponent(src)}&w=${width || ''}&h=${height || ''}&q=${quality || 85}&fmt=${format || 'auto'}`;
        return el('img', null, { src: optimizedSrc, width, height, loading: "lazy", decoding: "async", ...restProps });
    }
    return el('img', null, { loading: "lazy", decoding: "async", ...props });
};

const Actions = {};
Actions.secure_getStats = async (data, options = {}) => { 
                        const method = options.method || "POST";
                        const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
                        const res = await fetch("/_atom/rpc/_dashboard_home_secure_getStats", { 
                            method, 
                            headers, 
                            body: JSON.stringify(data),
                            ...(options.signal ? { signal: options.signal } : {})
                        }); 
                    if (!res.ok) {
                        const error = await res.json().catch(() => ({ error: res.statusText }));
                        const errorMsg = error.error || res.statusText;
                        const enhancedError = new Error(`Server Action "secure_getStats" failed: ${errorMsg}`);
                        if (error.function) enhancedError.function = error.function;
                        if (error.hint) enhancedError.hint = error.hint;
                        throw enhancedError;
                    }
                        const result = await res.json();
                        return result; 
                    };

const PageContent = (props) => { 
    // Ensure props is always an object
    props = props || {};
    const [stats, setStats] = useState(null);
  
    useEffect(() => {
      Actions.secure_getStats().then(setStats);
  }, []); // Empty deps array means run only once

  return div([
    !stats ? LoadingSpinner() : div([
      div([
        StatusCard({ label: "Total Users", value: stats.users.toLocaleString(), sub: "+12% from last month" }),
        StatusCard({ label: "Revenue", value: "$" + stats.revenue.toLocaleString(), sub: "+8.2% from last month" }),
        StatusCard({ label: "Active Now", value: stats.active, sub: "Current online users" }),
        StatusCard({ label: "Growth", value: stats.growth + "%", sub: "Year over year" })
      ], { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" }),
      
      div([
        div([
          h3("Recent Activity", { className: "font-bold text-lg mb-4" }),
          div([
            div("New user signed up", { className: "py-3 border-b text-sm text-gray-600" }),
            div("Project 'Alpha' deployed", { className: "py-3 border-b text-sm text-gray-600" }),
            div("Payment received from Client X", { className: "py-3 border-b text-sm text-gray-600" }),
            div("Server backup completed", { className: "py-3 text-sm text-gray-600" })
          ])
        ], { className: "bg-gray-50 p-6 rounded-xl border border-gray-100" }),
        
        div([
          h3("System Status", { className: "font-bold text-lg mb-4" }),
          div([
            div([
              div("CPU Usage", { className: "text-sm text-gray-500 mb-1" }),
              div([
                div([], { className: "h-2 bg-blue-500 rounded w-3/4" })
              ], { className: "h-2 bg-gray-200 rounded w-full" })
            ], { className: "mb-4" }),
            
            div([
              div("Memory", { className: "text-sm text-gray-500 mb-1" }),
              div([
                div([], { className: "h-2 bg-green-500 rounded w-1/2" })
              ], { className: "h-2 bg-gray-200 rounded w-full" })
            ], { className: "mb-4" }),
            
            div([
              div("Disk Space", { className: "text-sm text-gray-500 mb-1" }),
              div([
                div([], { className: "h-2 bg-purple-500 rounded w-1/4" })
              ], { className: "h-2 bg-gray-200 rounded w-full" })
            ])
          ])
        ], { className: "bg-gray-50 p-6 rounded-xl border border-gray-100" })
      ], { className: "grid grid-cols-1 lg:grid-cols-2 gap-8" })
    ])
  ]); 
};
export default (props) => {
    // Ensure props is always an object
    props = props || {};
    // Layout functions are passed via props for SSR
    const Layout = props.Layout;
    const Layout_dashboard = props.Layout_dashboard;
    
    const pageContent = PageContent(props);
    let result = pageContent;
    if (Layout && typeof Layout === 'function') { result = Layout({ ...props, content: result }); }
    if (Layout_dashboard && typeof Layout_dashboard === 'function') { result = Layout_dashboard({ ...props, content: result }); }
    return result;
    
};
