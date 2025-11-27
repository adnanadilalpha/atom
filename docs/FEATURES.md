# ATOM Framework - Features

## 🎉 Recently Added Features

### 1. TypeScript Support ✅
- **Command:** `atom typecheck` or `atom init` (creates tsconfig.json)
- **Features:**
  - Type checking for .atom files
  - Server Action type definitions
  - Auto-generated type definitions
- **Usage:**
  ```bash
  atom init              # Create tsconfig.json
  npm install -D typescript
  atom typecheck         # Run type checking
  ```

### 2. Testing Utilities ✅
- **Command:** `atom test`
- **Features:**
  - Auto-detects test frameworks (Vitest, Jest)
  - Finds test files automatically
  - Test templates for components and Server Actions
- **Usage:**
  ```bash
  npm install -D vitest  # or jest
  atom test              # Run tests
  ```

### 3. Deployment Helpers ✅
- **Command:** `atom deploy [platform]`
- **Supported Platforms:**
  - Vercel (`atom deploy vercel`)
  - Cloudflare Workers (`atom deploy cloudflare`)
  - Docker (`atom deploy docker`)
- **Usage:**
  ```bash
  atom deploy vercel     # Setup Vercel deployment
  npm run deploy:vercel  # Deploy to Vercel
  ```

### 4. Build Optimization Analysis ✅
- **Feature:** Automatic bundle size analysis after build
- **Shows:**
  - Bundle sizes (client, server, SSR)
  - Optimization score
  - Warnings and suggestions
- **Usage:**
  ```bash
  atom build  # Automatically shows bundle analysis
  ```

### 5. Enhanced Error Messages ✅
- Better error context (file, line, column)
- Server Action error details
- Runtime error stack traces
- Helpful hints and suggestions

### 6. Nested Layouts ✅ **NEW**
- **Feature:** Support for layout hierarchies
- Create `_layout.atom` files in any directory
- Layouts are automatically nested
- **Example:**
  ```
  app/
  ├── _layout.atom          # Root layout
  ├── dashboard/
  │   ├── _layout.atom      # Dashboard layout
  │   └── home.atom
  ```
- See [Advanced Routing](./ADVANCED_ROUTING.md) for details

### 7. Route Groups ✅ **NEW**
- **Feature:** Organize routes without affecting URLs
- Use parentheses in folder names: `(group)`
- **Example:**
  ```
  app/
  ├── (marketing)/
  │   ├── about.atom        # URL: /about
  │   └── contact.atom      # URL: /contact
  ```
- See [Advanced Routing](./ADVANCED_ROUTING.md) for details

### 8. Advanced Dynamic Routes ✅ **NEW**
- **Features:**
  - Catch-all routes: `[...slug].atom`
  - Optional catch-all: `[[...slug]].atom`
  - Standard dynamic: `[id].atom`
- **Example:**
  ```atom
  // app/docs/[...slug].atom
  @View {
    const { slug } = props.params;
    return div(`Docs: ${slug.join('/')}`);
  }
  ```
- See [Advanced Routing](./ADVANCED_ROUTING.md) for details

### 9. Code Splitting ✅ **NEW**
- **Feature:** Automatic route-based code splitting
- Each route is lazy-loaded in production
- Reduces initial bundle size
- Faster page loads
- **Note:** In dev mode, all routes bundled for faster HMR

### 10. Stability & Error Handling ✅ **NEW**
- **Feature:** Comprehensive error boundaries and validation
- **Components:** All components wrapped in error boundaries
- **Hooks:** Full validation for `useState`, `useEffect`, `useRef`, `useMemo`
- **DOM:** Enhanced validation for all DOM operations
- **Memory:** Proper cleanup of effects, refs, and caches
- **Errors:** User-friendly error messages instead of crashes
- See [Stability Guide](./STABILITY.md) for details

### 11. Request Deduplication ✅ **NEW**
- **Feature:** Prevents duplicate API calls
- Uses `useRef` to track loading state
- Prevents infinite loops in `useEffect`
- Reduces server load and improves performance

### 12. Memory Management ✅ **NEW**
- **Feature:** Proper cleanup prevents memory leaks
- Effects are cleaned up on navigation
- Refs are cleared on route changes
- Server-side caches have size limits
- Automatic cleanup of old entries

### 13. CodeBlock Component with Syntax Highlighting ✅ **NEW**
- **Feature:** Built-in CodeBlock component for displaying code with syntax highlighting
- **Supported Languages:** JavaScript, TypeScript, Python, HTML, CSS, and more
- **Features:**
  - Language badges and titles
  - Dark theme with monospace fonts
  - Line numbers support
  - Responsive design
- **Usage:**
  ```atom
  CodeBlock({
    code: `const greeting = "Hello World!";`,
    language: "javascript",
    title: "Example Code"
  })
  ```
- **Note:** Syntax highlighting is applied at build time for optimal performance

## 🚀 Coming Soon

- Performance profiling tools
- Advanced code splitting (component-level)
- Route matchers and constraints

## 📚 Documentation

- [Getting Started](./GETTING_STARTED.md)
- [API Reference](./API_REFERENCE.md)
- [Advanced Routing](./ADVANCED_ROUTING.md)
- [Deployment Guide](./DEPLOYMENT.md)
