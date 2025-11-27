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

Functions whose names start with `secure_` are executed on the server. The compiler rewrites them into RPC endpoints and generates matching client stubs automatically.

### Option 1: Inline (per page)

```atom
@Flow Actions {
  secure_processData: async function (data) {
    // Server-side code (runs in Node)
    return { result: data.processed };
  }
}

@View {
  const handleSubmit = async () => {
    const result = await Actions.secure_processData({ input: "demo" });
    console.log(result);
  };

  return button("Submit", { onclick: handleSubmit });
}
```

Use `Actions.secure_processData` anywhere in the file to call the RPC endpoint.

### Option 2: Shared `.atom` action modules (recommended)

Place shared logic in an `.atom` file so the compiler can extract the `@Flow Actions` block and build client stubs for you:

```atom
// app/_actions/data.atom
@Flow Actions {
  secure_processData: async function (data) {
    return { result: data.processed };
  },
  secure_getUser: async function (userId) {
    return { id: userId };
  }
}
```

Use them anywhere:

```atom
import { secure_processData } from './_actions/data.atom';

@View {
  return button("Run", {
    onclick: async () => {
      const result = await secure_processData({ input: "demo" });
      console.log(result);
    }
  });
}
```

Because the import comes from another `.atom` file, the build system generates the client-side fetch wrapper automatically—no need to redeclare the action locally.

### Using `.js` helpers

Regular `.js` or `.ts` modules are great for sharing validation or database helpers, but they **do not** become RPC endpoints on their own. If you import a helper from `.js`, wrap it inside an `@Flow Actions` block so the compiler can expose it:

```atom
import { createToken } from './auth-helpers.js';

@Flow Actions {
  secure_issueToken: async function (payload) {
    return createToken(payload);
  }
}
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

