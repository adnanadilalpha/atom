# ATOM Framework - Complete Guide

**The comprehensive documentation for everything ATOM Framework**

This guide contains all the information you need to understand, build, and deploy applications with ATOM Framework.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Why ATOM?](#why-atom)
3. [Installation & Quick Start](#installation--quick-start)
4. [Core Concepts](#core-concepts)
5. [Features](#features)
6. [API Reference](#api-reference)
7. [Data Fetching](#data-fetching)
8. [Database Integration](#database-integration)
9. [Authentication](#authentication)
10. [Building Your App](#building-your-app)
11. [Stability & Reliability](#stability--reliability)
12. [Advanced Topics](#advanced-topics)
13. [Deployment](#deployment)
14. [Troubleshooting](#troubleshooting)

---

## Introduction

ATOM Framework is a **compiler-driven, full-stack framework** designed for maximum performance, security, and developer simplicity. It combines the best of modern web development into a single, cohesive framework.

### What is ATOM?

ATOM (Atomic Template-Oriented Markup) is a framework that:
- **Compiles** your `.atom` files into optimized JavaScript
- **Renders** on both server and client (SSR + CSR)
- **Optimizes** automatically (code splitting, tree shaking, image optimization)
- **Secures** your server code (private server actions)

### Key Philosophy

- **Simplicity First**: Less boilerplate, more productivity
- **Stability First**: Comprehensive error handling and validation
- **Performance First**: SSR by default, optimized builds
- **Security First**: Server actions are private by default

---

## Why ATOM?

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

---

## Installation & Quick Start

### Installation

#### Create a New Project (Recommended)

The easiest way to get started is using `npx` (no installation required):

```bash
npx atom-framework create my-app
```

**Interactive Setup** (like Next.js):
- Choose a template: Basic, Full-Stack, or Empty
- Enable TypeScript? (Yes/No)
- Enable Tailwind CSS? (Yes/No, defaults to Yes)
- Enable ESLint? (Yes/No)

**Automatic Installation:**
- Dependencies are automatically installed (no need to run `npm install` manually!)

**Skip Prompts:**
```bash
npx atom-framework create my-app --skipPrompts
```

#### Global Installation (Optional)

```bash
npm install -g atom-framework
atom create my-app
```

### Your First ATOM App

#### 1. Your First Page

When you create a project, `app/home.atom` is already created with a starter template. You can edit it or create new pages.

Create or edit `app/home.atom`:

```atom
@Title "Welcome to ATOM"
@Description "My first ATOM page"

@View {
  return div([
    h1("Hello, ATOM!", { className: "text-4xl font-bold" }),
    p("This is your first ATOM page", { className: "text-gray-600" })
  ]);
}
```

#### 2. Start Development Server

```bash
atom dev
```

Visit `http://localhost:3000` - you should see your page!

### Project Structure

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

---

## Core Concepts

### Pages and Routes

Files in `app/` become routes:
- `app/home.atom` → `/` or `/home`
- `app/about.atom` → `/about`
- `app/users/[id].atom` → `/users/:id` (dynamic route)
- `app/docs/[...slug].atom` → `/docs/*` (catch-all route)

### Components

Components in `app/_components/` are auto-imported:

**`app/_components/Button.atom`:**
```atom
@View {
  const { children, ...restProps } = props || {};
  return button(children || "Button", {
    className: "px-4 py-2 bg-blue-600 text-white rounded",
    ...restProps
  });
}
```

**Use anywhere:**
```atom
@View {
  return Button("Click me", { onclick: () => alert("Clicked!") });
}
```

### Layouts

**⚠️ IMPORTANT: ATOM uses `props.content`, NOT `props.children`**

Layouts in ATOM Framework work differently from React/Next.js. The framework passes page content via the `content` prop.

**Create `app/_layout.atom`:**

```atom
@View {
  // IMPORTANT: Use props.content, not props.children
  const { content } = props || {};
  
  return div([
    Header(),
    main(
      content ? content : div("Loading...", { className: "flex justify-center p-20" }),
      { className: "min-h-screen pt-6" }
    ),
    Footer()
  ], { className: "layout flex flex-col min-h-screen" });
}
```

**Key Points:**
- ✅ Use `props.content` (NOT `props.children`)
- ✅ Always destructure: `const { content } = props || {};`
- ✅ Handle undefined: `content ? content : div("Loading...")`

**How It Works:**
1. Page renders first: Your page component renders its content
2. Layout wraps it: Framework passes rendered content as `props.content`
3. Layout applies: Layout wraps content with Header, Footer, etc.

See [Layouts Guide](./LAYOUTS.md) for complete documentation.

### Server Actions

Functions starting with `secure_` run on the server.

**Inline (in page):**
```atom
@Flow Actions {
  secure_getUser: async function(userId) {
    return { id: userId, name: "John" };
  }
};

@View {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    Actions.secure_getUser(1).then(setUser);
  }, []);
  
  if (!user) return div("Loading...");
  return div(user.name);
}
```

**Shared (recommended):** Create `app/_actions.js`:

```javascript
export async function secure_getUser(userId) {
  return { id: userId, name: "John" };
}
```

### State Management

Use `useState` for client-side state:

```atom
@View {
  const [count, setCount] = useState(0);
  
  return div([
    span(count),
    button("+", { onclick: () => setCount(count + 1) })
  ]);
}
```

### Hooks

ATOM supports React-like hooks:

#### `useState`
```atom
const [value, setValue] = useState(initialValue);
```

#### `useEffect`
```atom
useEffect(() => {
  // Side effect
  return () => {
    // Cleanup
  };
}, [dependencies]);
```

#### `useRef`
```atom
const ref = useRef(initialValue);
// Access: ref.current
```

#### `useMemo`
```atom
const memoized = useMemo(() => {
  return expensiveCalculation();
}, [dependencies]);
```

---

## Features

### 1. Server-Side Rendering (SSR)

Every page is server-rendered by default for SEO and performance:

```atom
@Title "My Page"
@Description "SEO-friendly description"

@View {
  return div("This is server-rendered!");
}
```

### 2. Server Actions

Call server code directly from client (zero API boilerplate):

```atom
@Flow Actions {
  secure_getData: async function() {
    return { message: "Hello from server!" };
  }
};

@View {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    Actions.secure_getData().then(setData);
  }, []);
  
  return div(data?.message);
}
```

### 3. Auto-Imported Components

Components in `app/_components/` are automatically available:

```atom
@View {
  // No import needed!
  return Card({ title: "Hello" }, "Content");
}
```

### 4. Hot Module Replacement (HMR)

Instant feedback on file changes via SSE:

```bash
atom dev  # Starts with HMR enabled
```

### 5. Image Optimization

Automatic optimization with modern formats:

```atom
@View {
  return Image({
    src: "/photo.jpg",
    width: 800,
    height: 600,
    quality: 85
  });
}
```

### 6. Code Splitting

Automatic route-based code splitting:

- Each route is lazy-loaded in production
- Reduces initial bundle size
- Faster page loads

### 7. TypeScript Support

Full TypeScript support:

```bash
atom init              # Create tsconfig.json
npm install -D typescript
atom typecheck         # Run type checking
```

### 8. Testing Utilities

Built-in test runner:

```bash
npm install -D vitest  # or jest
atom test              # Run tests
```

### 9. Deployment Helpers

One-command deployment:

```bash
atom deploy vercel     # Setup Vercel deployment
atom deploy cloudflare # Setup Cloudflare Workers
atom deploy docker     # Setup Docker deployment
```

### 10. Stability & Error Handling

- **Error Boundaries**: All components wrapped in error boundaries
- **Hook Validation**: Comprehensive validation for all hooks
- **DOM Validation**: Enhanced validation for DOM operations
- **Memory Management**: Proper cleanup prevents memory leaks
- **User-Friendly Errors**: Error messages in UI instead of crashes

### 11. Advanced Routing

- **Dynamic Routes**: `[id].atom` → `/users/:id`
- **Catch-All Routes**: `[...slug].atom` → `/docs/*`
- **Optional Catch-All**: `[[...slug]].atom` → `/docs` or `/docs/*`
- **Nested Layouts**: `_layout.atom` files in any directory
- **Route Groups**: `(group)/` for organization without affecting URLs

### 12. Static Site Generation (SSG)

Generate static pages at build time:

```atom
@Static
@Title "Static Page"

@View {
  return div("This page is statically generated!");
}
```

### 13. Incremental Static Regeneration (ISR)

Revalidate static pages:

```atom
@Revalidate 60  # Revalidate every 60 seconds
@Title "ISR Page"

@View {
  return div("This page uses ISR!");
}
```

---

## API Reference

### Directives

#### `@Title`
Sets the page title:

```atom
@Title "My Page Title"
```

#### `@Description`
Sets the page meta description:

```atom
@Description "Page description for SEO"
```

#### `@Static`
Marks page for static generation:

```atom
@Static
```

#### `@Revalidate`
Sets revalidation time for ISR:

```atom
@Revalidate 60  # seconds
```

#### `@Flow Actions`
Defines server actions:

```atom
@Flow Actions {
  secure_myAction: async function() {
    return { data: "value" };
  }
}
```

### HTML Helpers

All standard HTML elements are available:

```atom
div(content, props)
h1(content, props)
p(content, props)
button(content, props)
input(content, props)
// ... and more
```

### Special Components

#### `Image`
Optimized image component:

```atom
Image({
  src: "/photo.jpg",
  width: 800,
  height: 600,
  quality: 85,
  format: "webp"
})
```

### Hooks API

#### `useState(initialValue)`
Returns `[value, setValue]`:

```atom
const [count, setCount] = useState(0);
```

#### `useEffect(callback, deps)`
Runs side effects:

```atom
useEffect(() => {
  // Effect
  return () => {
    // Cleanup
  };
}, [dependencies]);
```

#### `useRef(initialValue)`
Returns mutable ref:

```atom
const ref = useRef(null);
// Access: ref.current
```

#### `useMemo(factory, deps)`
Memoizes computed values:

```atom
const memoized = useMemo(() => compute(), [deps]);
```

#### `usePath()`
Returns current path:

```atom
const path = usePath(); // "/current/path"
```

### Navigation

#### `navigate(path)`
Navigate programmatically:

```atom
button("Go Home", {
  onclick: () => navigate("/")
});
```

---

## Data Fetching

ATOM Framework provides multiple ways to fetch data. See the [Data Fetching Guide](./DATA_FETCHING.md) for complete documentation.

### Server Actions (Recommended)

```atom
@Flow Actions {
  secure_getData: async function() {
    return { message: "Hello from server!" };
  }
};

@View {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    Actions.secure_getData().then(setData);
  }, []);
  
  return div(data?.message);
}
```

### API Routes

```atom
// app/api/data/+server.atom
@Flow Actions {
  GET: async function() {
    return { data: "value" };
  }
};
```

### Client-Side Fetching

```atom
useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(setData);
}, []);
```

See [Data Fetching Guide](./DATA_FETCHING.md) for complete patterns and best practices.

---

## Database Integration

ATOM Framework supports any Node.js-compatible database. See the [Database Guide](./DATABASE.md) for complete documentation.

### Quick Setup

1. **Install database driver:**
```bash
npm install pg  # PostgreSQL
```

2. **Create database connection:**
```javascript
// app/db.js
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
module.exports = pool;
```

3. **Use in Server Actions:**
```atom
@Resource DB from './db';

@Flow Actions {
  secure_getUsers: async function() {
    const result = await DB.query('SELECT * FROM users');
    return result.rows;
  }
};
```

**Supported Databases:**
- PostgreSQL (via `pg`)
- MySQL (via `mysql2`)
- MongoDB (via `mongodb`)
- SQLite (via `better-sqlite3`)
- Prisma ORM
- Drizzle ORM
- Any Node.js database library

See [Database Guide](./DATABASE.md) for complete setup, examples, and best practices.

---

## Authentication

ATOM Framework supports multiple authentication strategies. See the [Authentication Guide](./AUTHENTICATION.md) for complete documentation.

### JWT Authentication (Recommended)

```atom
@Resource DB from './db';
@Resource jwt from 'jsonwebtoken';

@Flow Actions {
  secure_login: async function(credentials) {
    // Verify credentials
    const user = await DB.query(
      'SELECT * FROM users WHERE email = $1',
      [credentials.email]
    );
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return { token, user };
  }
};
```

**Supported Strategies:**
- JWT (JSON Web Tokens)
- Session-based authentication
- OAuth (Google, GitHub, etc.)
- API Key authentication

See [Authentication Guide](./AUTHENTICATION.md) for complete setup, examples, and security best practices.

---

## Building Your App

### Development Build

```bash
atom dev
```

This starts the development server with:
- Hot module replacement (HMR)
- Source maps for debugging
- Detailed error messages
- Fast refresh on file changes

### Production Build

```bash
atom build
```

This creates an optimized production build:
- Minified and optimized code
- Code splitting for routes
- Tree shaking for unused code
- Bundle size analysis
- Static page generation (if using `@Static`)

### Production Server

```bash
atom start
```

Starts the production server with:
- SSR enabled
- Caching for performance
- Error handling
- Logging

### Build Output

After building, you'll find:
```
dist/
├── client.js      # Client-side bundle
├── server.js      # Server-side bundle
├── ssr.js         # SSR runtime
└── routes/        # Route-specific bundles
```

### Build Analysis

After building, you get:
- Bundle sizes (client, server, SSR)
- Optimization score
- Warnings and suggestions
- Performance metrics

---

## Stability & Reliability

### Error Boundaries

All components are automatically wrapped in error boundaries:

```atom
@View {
  // If an error occurs, it's caught and displayed gracefully
  return div([...]);
}
```

### Hook Validation

Comprehensive validation for all hooks:
- `useState`: Validates state initialization and updates
- `useEffect`: Validates callback and dependencies
- `useRef`: Validates ref creation and access
- `useMemo`: Validates factory and dependencies

### Memory Management

Proper cleanup prevents memory leaks:
- Effects are cleaned up on navigation
- Refs are cleared on route changes
- Server-side caches have size limits
- Automatic cleanup of old entries

### Request Deduplication

Prevents duplicate API calls:

```atom
const loadingRef = useRef(false);

useEffect(() => {
  if (loadingRef.current) return;
  loadingRef.current = true;
  loadData().finally(() => {
    loadingRef.current = false;
  });
}, []);
```

### Best Practices

1. **Always Return Valid DOM Nodes**
   ```atom
   // ✅ Good
   return div([...]);
   
   // ❌ Bad
   return undefined;
   ```

2. **Handle Async Data Properly**
   ```atom
   const [data, setData] = useState(null);
   const loadingRef = useRef(false);
   
   useEffect(() => {
     if (loadingRef.current) return;
     loadingRef.current = true;
     loadData().then(setData).finally(() => {
       loadingRef.current = false;
     });
   }, []);
   ```

3. **Clean Up Effects**
   ```atom
   useEffect(() => {
     const timer = setTimeout(() => {}, 1000);
     return () => clearTimeout(timer);
   }, []);
   ```

4. **Validate Props**
   ```atom
   const { id, name } = props || {};
   if (!id) return div("Error: ID required");
   ```

5. **Use Defensive Checks**
   ```atom
   const products = Array.isArray(data) ? data : [];
   return div(products.map(...));
   ```

---

## Advanced Topics

### Layouts

**⚠️ IMPORTANT: ATOM uses `props.content`, NOT `props.children`**

Layouts in ATOM Framework work differently from React/Next.js. The framework passes page content via the `content` prop.

#### Creating a Layout

```atom
@View {
  // IMPORTANT: Use props.content, not props.children
  const { content } = props || {};
  
  return div([
    Header(),
    main(
      content ? content : div("Loading...", { className: "flex justify-center p-20" }),
      { className: "min-h-screen pt-6" }
    ),
    Footer()
  ], { className: "layout flex flex-col min-h-screen" });
}
```

#### How It Works

1. **Page renders first**: Your page component renders its content
2. **Layout wraps it**: Framework passes rendered content as `props.content`
3. **Layout applies**: Layout wraps content with Header, Footer, etc.

**Key Points:**
- ✅ Use `props.content` (NOT `props.children`)
- ✅ Always destructure: `const { content } = props || {};`
- ✅ Handle undefined: `content ? content : div("Loading...")`

See [Layouts Guide](./LAYOUTS.md) for complete documentation.

### Nested Layouts

Create `_layout.atom` files in any directory for nested layouts:

```
app/
├── _layout.atom          # Root layout
├── dashboard/
│   ├── _layout.atom      # Dashboard layout (nested)
│   └── home.atom
```

**How nested layouts work:**
- Layouts are applied from outermost to innermost
- Each layout receives the result of the inner layout/page as `props.content`
- Example: `dashboard/home.atom` → `dashboard/_layout.atom` → `_layout.atom`

### Route Groups

Organize routes without affecting URLs:

```
app/
├── (marketing)/
│   ├── about.atom        # URL: /about (not /marketing/about)
│   └── contact.atom      # URL: /contact
```

### Dynamic Routes

#### Standard Dynamic Route
```atom
// app/users/[id].atom
@View {
  const { id } = props.params;
  return div(`User ID: ${id}`);
}
```

#### Catch-All Route
```atom
// app/docs/[...slug].atom
@View {
  const { slug } = props.params;
  return div(`Docs: ${slug.join('/')}`);
}
```

#### Optional Catch-All
```atom
// app/docs/[[...slug]].atom
@View {
  const { slug } = props.params;
  return div(slug ? `Docs: ${slug.join('/')}` : "Docs Home");
}
```

### Middleware

Create `app/_middleware.atom`:

```atom
@Flow Middleware {
  before: async function(req, res, next) {
    // Your middleware logic
    next();
  }
}
```

### API Routes

Create `app/api/endpoint/+server.atom`:

```atom
@Flow Actions {
  GET: async function() {
    return { message: "Hello from API!" };
  }
}
```

### Edge Runtime

Deploy to edge networks:

```atom
@Edge
@Title "Edge Page"

@View {
  return div("Running on edge!");
}
```

---

## Deployment

### Vercel

```bash
atom deploy vercel
npm run deploy:vercel
```

### Cloudflare Workers

```bash
atom deploy cloudflare
npm run deploy:cloudflare
```

### Docker

```bash
atom deploy docker
docker build -t my-app .
docker run -p 3000:3000 my-app
```

### Environment Variables

Create `.env`:

```env
NODE_ENV=production
PORT=3000
IMAGE_CDN=cloudflare
```

---

## Forms and Validation

ATOM Framework provides powerful form handling. See the [Forms Guide](./FORMS.md) for complete documentation.

### Basic Form

```atom
@Flow Actions {
  secure_submitForm: async function(data) {
    // Validate and process
    return { success: true };
  }
};

@View {
  const [name, setName] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await Actions.secure_submitForm({ name });
  };
  
  return form([
    input(null, {
      value: name,
      oninput: (e) => setName(e.target.value)
    }),
    button("Submit", { type: "submit" })
  ], { onsubmit: handleSubmit });
}
```

See [Forms Guide](./FORMS.md) for validation, file uploads, and best practices.

---

## Environment Variables

ATOM Framework uses environment variables for configuration. See the [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md) for complete documentation.

### Quick Setup

Create `.env`:

```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
API_KEY=your-api-key
```

Access in Server Actions:

```atom
@Flow Actions {
  secure_getConfig: async function() {
    return { apiKey: process.env.API_KEY };
  }
};
```

See [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md) for security, deployment, and best practices.

---

## Testing

ATOM Framework supports testing with Vitest, Jest, and Playwright. See the [Testing Guide](./TESTING.md) for complete documentation.

### Quick Setup

```bash
npm install -D vitest
atom test
```

See [Testing Guide](./TESTING.md) for component testing, server action testing, and E2E testing.

---

## Security

Security is critical for production applications. See the [Security Guide](./SECURITY.md) for best practices.

### Key Security Practices

1. **Validate all input**
2. **Use parameterized queries** (prevent SQL injection)
3. **Hash passwords** (bcrypt)
4. **Use HTTPS** in production
5. **Set secure cookies**
6. **Implement rate limiting**

See [Security Guide](./SECURITY.md) for complete security checklist and practices.

---

## Third-Party Libraries

ATOM Framework works seamlessly with any npm package. See the [Third-Party Libraries Guide](./THIRD_PARTY_LIBRARIES.md) for complete documentation.

### Quick Example

```atom
import { gsap } from 'gsap';

@View {
  const elementRef = useRef(null);
  
  useEffect(() => {
    if (elementRef.current) {
      gsap.from(elementRef.current, {
        opacity: 0,
        y: 50,
        duration: 1
      });
    }
  }, []);
  
  return div("Animated!", { ref: elementRef });
}
```

**Supported Libraries:**
- GSAP, Anime.js (animation)
- Chart.js, D3.js (charts)
- Three.js (3D graphics)
- Lodash, date-fns (utilities)
- Any npm package!

See [Third-Party Libraries Guide](./THIRD_PARTY_LIBRARIES.md) for complete examples and best practices.

---

## TypeScript

ATOM Framework has full TypeScript support. See the [TypeScript Guide](./TYPESCRIPT.md) for complete documentation.

### Quick Setup

```bash
atom init
npm install -D typescript
atom typecheck
```

See [TypeScript Guide](./TYPESCRIPT.md) for type definitions, type safety, and best practices.

---

## Troubleshooting

### Common Issues

#### Component Not Rendering
- Check that component returns a valid DOM Node
- Verify component is in `app/_components/`
- Check browser console for errors

#### Server Action Not Working
- Ensure function name starts with `secure_`
- Check server logs for errors
- Verify function is in `@Flow Actions` block

#### State Not Updating
- Ensure `useState` is called at top level
- Check dependencies in `useEffect`
- Verify state updates are not blocked

#### Layout Not Showing Content
- **IMPORTANT**: Use `props.content`, NOT `props.children`
- Always destructure: `const { content } = props || {};`
- Handle undefined: `content ? content : div("Loading...")`

#### Build Errors
- Check syntax in `.atom` files
- Verify all imports are correct
- Check for TypeScript errors (if using)

### Getting Help

- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review [API Reference](./API_REFERENCE.md)
- See [Layouts Guide](./LAYOUTS.md) for layout-specific issues
- See [Examples](../examples/)
- Check [GitHub Issues](https://github.com/atom-framework/atom)

---

## Examples

### Counter Component

```atom
@View {
  const [count, setCount] = useState(0);
  
  return div([
    h1(`Count: ${count}`),
    button("Increment", {
      onclick: () => setCount(count + 1)
    }),
    button("Decrement", {
      onclick: () => setCount(count - 1)
    })
  ]);
}
```

### Data Fetching

```atom
@Flow Actions {
  secure_getPosts: async function() {
    return [
      { id: 1, title: "Post 1" },
      { id: 2, title: "Post 2" }
    ];
  }
};

@View {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    Actions.secure_getPosts()
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return div("Loading...");
  
  return div(
    posts.map(post => 
      div(post.title, { key: post.id })
    )
  );
}
```

### Form Handling

```atom
@Flow Actions {
  secure_submitForm: async function(data) {
    // Validate and save
    return { success: true };
  }
};

@View {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await Actions.secure_submitForm({ name });
    setSubmitted(result.success);
  };
  
  return form([
    input(null, {
      value: name,
      oninput: (e) => setName(e.target.value),
      placeholder: "Enter name"
    }),
    button("Submit", { onclick: handleSubmit }),
    submitted ? div("Form submitted!") : null
  ]);
}
```

### Layout Example

```atom
// app/_layout.atom
@View {
  // IMPORTANT: Use props.content, not props.children
  const { content } = props || {};
  const currentPath = usePath();
  
  return div([
    Header({ activePath: currentPath }),
    main(
      content ? content : div("Loading...", { className: "flex justify-center p-20" }),
      { className: "min-h-screen pt-6" }
    ),
    Footer()
  ], { className: "layout flex flex-col min-h-screen" });
}
```

---

## Conclusion

ATOM Framework provides everything you need to build modern, performant, and secure web applications. With its focus on stability, simplicity, and developer experience, it's the perfect choice for your next project.

### Next Steps

- **[Documentation Index](./INDEX.md)** - Complete documentation index
- [Getting Started Guide](./GETTING_STARTED.md) - Detailed getting started
- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Layouts Guide](./LAYOUTS.md) - Complete layout documentation (IMPORTANT: uses `props.content`)
- [Database Guide](./DATABASE.md) - Database integration
- [Authentication Guide](./AUTHENTICATION.md) - User authentication
- [Data Fetching Guide](./DATA_FETCHING.md) - Data fetching patterns
- [Forms Guide](./FORMS.md) - Form handling
- [Testing Guide](./TESTING.md) - Testing your app
- [Security Guide](./SECURITY.md) - Security best practices
- [TypeScript Guide](./TYPESCRIPT.md) - TypeScript support
- [Stability Guide](./STABILITY.md) - Stability features and best practices
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Examples](../examples/) - Code examples

---

**Built with ⚛️ ATOM Framework**
