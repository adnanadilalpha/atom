# ⚛️ ATOM Framework

**The Godfather of Full-Stack Development** - A revolutionary, compiler-driven, full-stack framework designed for maximum performance, security, and developer simplicity.

[![npm version](https://img.shields.io/npm/v/atom-framework.svg)](https://www.npmjs.com/package/atom-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- **Zero-Overhead Development** - Clean, portable codebase with minimal dependencies
- **Security by Obfuscation** - Core engine compiled into native binary
- **Performance by SSR** - Every page is Server-Side Rendered for SEO and speed
- **Isomorphic Splitting** - Write once, runs everywhere (Server + Client)
- **Instant Hot Reload** - Blink-of-an-eye reloading via SSE
- **Enhanced Image Optimization** - Automatic srcset, WebP/AVIF support, CDN integration
- **Streaming SSR** - Progressive HTML streaming for faster TTFB
- **ISR/SSG Support** - Incremental Static Regeneration and Static Site Generation
- **Edge Runtime Compatible** - Deploy to Cloudflare Workers, Vercel Edge
- **Server Actions** - Zero API boilerplate, call server code directly from client
- **Built-in Tailwind CSS** - Zero-config CSS with PostCSS
- **TypeScript Support** - Type checking and auto-generated type definitions
- **Testing Utilities** - Built-in test runner with Vitest/Jest support
- **Deployment Helpers** - One-command deployment for Vercel, Cloudflare, Docker
- **Build Analysis** - Automatic bundle size analysis and optimization suggestions

## 📦 Installation

```bash
# Create a new project (interactive setup, auto-installs dependencies)
npx atom-framework create my-app

# Or install globally
npm install -g atom-framework
atom create my-app
```

## 🎯 Quick Start

```bash
# Create a new project (interactive prompts for template, TypeScript, Tailwind, etc.)
npx atom-framework create my-app
# Dependencies are automatically installed!

# Start development server
cd my-app
atom dev

# Build for production
atom build

# Start production server
atom start

# Run tests
atom test

# Type check
atom typecheck

# Setup deployment
atom deploy vercel
```

## 🔄 Updating ATOM Framework

```bash
# Update to latest version in your project
npm install atom-framework@latest

# Or if installed globally
npm install -g atom-framework@latest
```

📖 **[Full Update Guide](./docs/UPDATE_GUIDE.md)** - Detailed update instructions

## 📖 Documentation

- **[Documentation Index](./docs/INDEX.md)** - Complete documentation index (START HERE!)
- **[Complete Guide](./docs/COMPLETE_GUIDE.md)** - Everything you need to know about ATOM
- [Getting Started](./docs/GETTING_STARTED.md) - Quick start guide
- **[Layouts Guide](./docs/LAYOUTS.md)** - How layouts work (IMPORTANT: uses `props.content`, not `props.children`)
- [API Reference](./docs/API_REFERENCE.md) - Complete API docs
- **[Database Guide](./docs/DATABASE.md)** - Database integration (PostgreSQL, MySQL, MongoDB, Prisma)
- **[Authentication Guide](./docs/AUTHENTICATION.md)** - JWT, sessions, OAuth authentication
- **[Data Fetching](./docs/DATA_FETCHING.md)** - Server Actions, API Routes, client-side fetching
- **[Forms Guide](./docs/FORMS.md)** - Form handling, validation, file uploads
- **[Environment Variables](./docs/ENVIRONMENT_VARIABLES.md)** - Configuration and secrets
- **[Testing Guide](./docs/TESTING.md)** - Component, server action, and E2E testing
- **[Security Guide](./docs/SECURITY.md)** - Security best practices and checklist
- **[TypeScript Guide](./docs/TYPESCRIPT.md)** - TypeScript setup and usage
- **[Third-Party Libraries](./docs/THIRD_PARTY_LIBRARIES.md)** - Using GSAP, Framer Motion, and other npm packages
- [Stability Guide](./docs/STABILITY.md) - Stability features and best practices
- [Deployment](./docs/DEPLOYMENT.md) - Deploy to production
- [Production Guide](./docs/PRODUCTION.md) - Production optimization
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues
- **[Production Readiness](./docs/PRODUCTION_READINESS.md)** - Is ATOM ready for production?
- **[Validation Guide](./docs/VALIDATION.md)** - Input validation and sanitization
- **[DevTools Guide](./docs/DEVTOOLS.md)** - Enhanced HUD with performance, SEO, and error monitoring
- [Examples](./examples/) - Code examples

## 🏗️ Project Structure

```
my-app/
├── app/
│   ├── _components/     # Auto-imported components
│   ├── _layout.atom     # Global layout
│   ├── _middleware.atom # Request middleware
│   ├── home.atom        # Routes
│   └── api/             # API endpoints
├── public/              # Static assets
├── dist/                # Build output
└── package.json
```

## 💡 Example

```atom
@Title "My Page"
@Description "A simple ATOM page"

@Flow Actions {
  secure_getData: async function() {
    return { message: "Hello from server!" };
  }
};

@View {
  const [data, setData] = useState(null);
  
  if (!data) {
    Actions.secure_getData().then(setData);
    return div("Loading...");
  }
  
  return div([
    h1(data.message),
    button("Refresh", { 
      onclick: () => Actions.secure_getData().then(setData) 
    })
  ]);
}
```

## 🌟 Why ATOM?

### For Developers

**🚀 Production-Ready & Stable**
- **Robust Error Handling**: Comprehensive error boundaries prevent app crashes
- **Memory Safe**: Proper cleanup of effects, refs, and event listeners
- **Type Safe**: Full TypeScript support with auto-generated types
- **Battle-Tested**: Built with stability and reliability as core principles

**⚡ Developer Experience**
- **Simpler than Next.js** - No complex routing, no API routes boilerplate
- **Faster than Remix** - Native binary engine, instant hot reload
- **Better DX** - Single file format, auto-imports, instant feedback
- **Zero Config** - Works out of the box with sensible defaults

**🔒 Security & Performance**
- **More secure** - Obfuscated core, server actions are private
- **SSR by Default** - Every page is server-rendered for SEO and speed
- **Optimized Builds** - Automatic code splitting and bundle optimization
- **Edge Ready** - Deploy to Cloudflare Workers, Vercel Edge, and more

**🛠️ Modern Features**
- **Server Actions** - Call server code directly from client (zero API boilerplate)
- **Auto-Imports** - Components automatically available without imports
- **Hot Reload** - Instant feedback with SSE-based hot module replacement
- **Image Optimization** - Automatic srcset, WebP/AVIF support, CDN integration

### Build with Confidence

ATOM Framework is designed for developers who want:
- ✅ **Stability** - Comprehensive error handling and validation
- ✅ **Simplicity** - Less boilerplate, more productivity
- ✅ **Performance** - Optimized builds and SSR out of the box
- ✅ **Security** - Server actions are private by default
- ✅ **Flexibility** - Works with your existing tools and workflows

## 📚 Learn More

- [Full Documentation](./docs/)
- [Examples](./examples/)
- [Community](https://github.com/atom-framework/atom)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md).

## 📄 License

MIT © [ATOM Framework](https://github.com/atom-framework)

---

**Built with ⚛️ ATOM Framework**

