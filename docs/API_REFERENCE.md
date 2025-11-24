# ATOM Framework API Reference

## Directives

### @Title
Sets the page title (appears in `<title>` tag).

```atom
@Title "My Page Title"
```

### @Description
Sets the meta description.

```atom
@Description "This is my page description"
```

### @Meta
Adds custom meta tags.

```atom
@Meta { name: "keywords", content: "atom, framework" };
```

### @Static
Marks a page as static (pre-rendered at build time).

```atom
@Static
```

### @Revalidate
Enables ISR (Incremental Static Regeneration) with revalidation time in seconds.

```atom
@Revalidate 60  // Revalidates every 60 seconds
```

### @Stream
Enables streaming SSR for faster Time-to-First-Byte.

```atom
@Stream
```

### @Edge Runtime
Marks middleware as edge-compatible.

```atom
@Edge Runtime
```

### @Resource
Imports a server-side resource (database, API client, etc.).

```atom
@Resource DB from './db';
```

## Components

### Built-in Components

- `div(content, props)`
- `h1(content, props)`, `h2`, `h3`, etc.
- `p(content, props)`
- `button(content, props)`
- `input(content, props)`
- `a(text, props)`
- `Image(props)` - Enhanced image with optimization
- `Video(props)`
- `Audio(props)`

### Image Component

Enhanced image with automatic optimization:

```atom
Image({
  src: "/photo.jpg",
  width: 800,
  sizes: "(max-width: 768px) 100vw, 50vw",
  quality: 90,
  format: "auto"  // or "webp", "avif", "jpeg", "png"
})
```

## Server Actions

Functions starting with `secure_` run on the server.

**Option 1: Inline (within page)**
```atom
@Flow Actions {
  secure_processData: async function(data) {
    // Server-side code
    return { result: data.processed };
  }
};
```

**Option 2: Shared Actions File (Recommended)**
Create `app/_actions.atom` or `app/_actions.js`:

**Using .atom file:**
```atom
@Flow Actions {
  secure_processData: async function(data) {
    return { result: data.processed };
  }
}
```

**Using .js file:**
```javascript
export async function secure_processData(data) {
  return { result: data.processed };
}
```

Import in `.atom` files (both work):
```atom
import { secure_processData } from './_actions.atom';
// or
import { secure_processData } from './_actions.js';
```

**Note:** The framework automatically processes `.atom` imports and extracts `@Flow Actions` blocks.

Call from client:
```atom
const result = await Actions.secure_processData({ input: "test" });
```

## Hooks

### useState

Client-side state management:

```atom
const [value, setValue] = useState(initialValue);
```

### navigate

Programmatic navigation:

```atom
navigate("/about");
```

## API Routes

Create API endpoints with `+server.atom`:

**`app/api/users/+server.atom`:**
```atom
@Flow Actions {
  GET: async function() {
    return { users: [...] };
  },
  POST: async function(data) {
    // Create user
    return { success: true };
  }
};
```

Access at `/api/users`

## Middleware

**`app/_middleware.atom`:**
```atom
@Flow Actions {
  handler: async function(req, res, next) {
    // Run on every request
    console.log(req.path);
    next();
  }
};
```

## Layout

**`app/_layout.atom`:**
```atom
@View {
  const { content } = props;
  return div([
    nav([...]),
    div([content], { className: "main" }),
    footer([...])
  ]);
}
```

## Environment Variables

Create `.env` file:

```bash
PORT=3000
DATABASE_URL=postgresql://...
IMAGE_CDN=cloudflare
CLOUDFLARE_ACCOUNT_ID=...
```

Access in server actions:

```atom
secure_getConfig: async function() {
  return { apiKey: process.env.API_KEY };
}
```

