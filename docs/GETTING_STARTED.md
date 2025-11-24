# Getting Started with ATOM Framework

## Installation

### Create a New Project (Recommended)

The easiest way to get started is using `npx` (no installation required):

```bash
npx atom-framework create my-app
```

This will:
1. **Ask interactive questions** (like Next.js):
   - Choose a template (Basic, Full-Stack, or Empty)
   - Enable TypeScript? (Yes/No)
   - Enable Tailwind CSS? (Yes/No, defaults to Yes)
   - Enable ESLint? (Yes/No)
2. **Create the project structure**
3. **Automatically install dependencies** (no need to run `npm install` manually!)

After creation, you're ready to start:

```bash
cd my-app
atom dev
```

### Global Installation (Optional)

If you prefer to install globally:

```bash
npm install -g atom-framework
atom create my-app
```

### Skip Interactive Prompts

To use defaults without prompts:

```bash
npx atom-framework create my-app --skipPrompts
```

This creates a project with:
- Basic template
- TypeScript: No
- Tailwind CSS: Yes
- ESLint: No

## Your First ATOM App

When you create a new project, you'll get a starter template with `app/home.atom` already created. You can edit it or create new pages.

### 1. Create a Page

Create `app/home.atom` (or edit the existing one):

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

## Updating ATOM Framework

### Update in Existing Projects

If you have an existing ATOM project and want to update to the latest version:

**Option 1: Update package.json and reinstall**
```bash
# Edit package.json and change the version:
# "atom-framework": "^1.5.0"

# Then reinstall:
npm install
```

**Option 2: Use npm update**
```bash
npm update atom-framework
```

**Option 3: Install specific version**
```bash
npm install atom-framework@latest
```

### Update Global CLI (if installed globally)

If you installed ATOM globally:
```bash
npm install -g atom-framework@latest
```

### Check Current Version

To see what version you're using:
```bash
atom --version
# or
npm list atom-framework
```

### 2. Start Development Server

```bash
cd my-app
atom dev
```

Visit `http://localhost:3000` - you should see your page!

**Note:** If dependencies weren't installed automatically, run `npm install` first.

## Core Concepts

### Pages and Routes

Files in `app/` become routes:
- `app/home.atom` → `/` or `/home`
- `app/about.atom` → `/about`
- `app/users/[id].atom` → `/users/:id` (dynamic route)

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

**IMPORTANT: Layouts use `props.content`, NOT `props.children`**

Create `app/_layout.atom`:

```atom
@View {
  // Layout receives page content via props.content
  const { content } = props || {};
  
  return div([
    Header(),
    main(content ? content : div("Loading..."), { className: "min-h-screen" }),
    Footer()
  ]);
}
```

**Key Points:**
- ✅ Use `props.content` for layouts (NOT `props.children`)
- ✅ Always destructure: `const { content } = props || {};`
- ✅ Handle undefined content gracefully

### Server Actions

Functions starting with `secure_` run on the server.

**Inline (in page):**
```atom
@Flow Actions {
  secure_getUser: async function(userId) {
    return { id: userId, name: "John" };
  }
};
```

**Shared (recommended):** Create `app/_actions.atom` or `app/_actions.js`:

**Using .atom file:**
```atom
@Flow Actions {
  secure_getUser: async function(userId) {
    return { id: userId, name: "John" };
  }
}
```

**Using .js file:**
```javascript
export async function secure_getUser(userId) {
  return { id: userId, name: "John" };
}
```

Import in `.atom` files (both work):
```atom
import { secure_getUser } from './_actions.atom';
// or
import { secure_getUser } from './_actions.js';

@View {
  const [user, setUser] = useState(null);
  
  if (!user) {
    Actions.secure_getUser(1).then(setUser);
    return div("Loading...");
  }
  
  return div(user.name);
}
```

**Note:** Use `.js` files for shared actions, not `.atom` files.

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

## Why Build with ATOM?

### 1. Stability First 🛡️

ATOM Framework prioritizes stability and reliability:
- **Error Boundaries**: Components are wrapped in error boundaries to prevent crashes
- **Validation**: Comprehensive validation for hooks, props, and DOM operations
- **Memory Management**: Proper cleanup of effects, refs, and event listeners
- **Graceful Degradation**: Handles edge cases and invalid data gracefully

### 2. Developer Productivity ⚡

- **Less Boilerplate**: No API routes, no complex routing setup
- **Auto-Imports**: Components automatically available
- **Hot Reload**: Instant feedback on changes
- **Type Safety**: Full TypeScript support

### 3. Performance 🚀

- **SSR by Default**: Every page is server-rendered
- **Code Splitting**: Automatic route-based splitting
- **Optimized Builds**: Minified, tree-shaken, optimized
- **Image Optimization**: Automatic optimization with modern formats

### 4. Modern Features 🎯

- **Server Actions**: Call server code directly (no API boilerplate)
- **Edge Runtime**: Deploy to edge networks globally
- **ISR/SSG**: Incremental Static Regeneration and Static Site Generation
- **Streaming SSR**: Progressive HTML streaming

### 5. Production Ready ✅

- **Error Handling**: Comprehensive error boundaries and validation
- **Memory Safe**: Proper cleanup prevents memory leaks
- **Type Safe**: Full TypeScript support
- **Battle-Tested**: Built with stability as a core principle

## Next Steps

- [API Reference](./API_REFERENCE.md)
- [Examples](../examples/)
- [Deployment Guide](./DEPLOYMENT.md)
- [Production Guide](./PRODUCTION.md)

