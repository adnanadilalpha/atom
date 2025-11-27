# Getting Started with ATOM Framework

ATOM ships as a single CLI (`atom`) that compiles your `.atom` files, watches the filesystem, spins up an SSR server, and even orchestrates deployments. This guide is kept in lockstep with the current codebase (`package.json` v**1.5.8**) so you can trust every command below.

## Requirements

- Node.js **18.0.0 or newer** (`package.json` → `"engines": { "node": ">=18.0.0" }`)
- npm ≥ 9 (comes with the supported Node releases)
- macOS, Linux, or WSL2 (Windows-native builds are not officially tested yet)

Verify your installed version anytime:

```bash
atom --version
# or
npm list atom-framework
```

## Create a New Project

### One-shot (recommended)

```bash
npx atom-framework create my-app
```

What happens (driven by `system/cli.js#createProject`):

1. Interactive prompts pick a template and tooling.
2. The CLI scaffolds `app/`, `public/`, `_components/`, etc.
3. `npm install` runs automatically (with helpful guidance if it fails).

Then launch dev mode:

```bash
cd my-app
atom dev
```

### Global install (optional)

```bash
npm install -g atom-framework
atom create my-app
```

### Skipping prompts

```bash
npx atom-framework create my-app --skipPrompts
```

Defaults (taken from the CLI flags):

| Setting      | Default |
|--------------|---------|
| Template     | `basic` |
| TypeScript   | `false` |
| Tailwind CSS | `true`  |
| ESLint       | `false` |

Templates live in `/templates/{basic,fullstack,empty}` so you can inspect exactly what will be copied.

## Project Layout

After creation you’ll see:

```
my-app/
├── app/
│   ├── home.atom       # Pages → routes
│   ├── _components/    # Auto-registered UI building blocks
│   └── _layout.atom    # Optional root layout
├── public/             # Static assets copied into dist
├── package.json        # Includes "atom dev/build/start"
└── tailwind.config.js  # Added when Tailwind is enabled
```

## Building Your First Page

Every `.atom` file can declare metadata and UI blocks:

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

`app/home.atom` renders `/` (the compiler remaps `/home` → `/`). Any other file in `app/` becomes a route, including dynamic segments like `users/[id].atom` and catch-alls `docs/[...slug].atom`.

## Auto-imported Components

Files in `app/_components/*.atom` are parsed up front (`system/compiler.js` lines 1045‑1094) and attached to `globalThis`. That means you can reference `Button()` or `Header()` anywhere without manual imports:

```atom
// app/_components/Button.atom
@View {
  const { children, ...rest } = props || {};
  return button(children || "Button", {
    className: "px-4 py-2 bg-blue-600 text-white rounded",
    ...rest
  });
}

// app/about.atom
@View {
  return Button("Click me", { onclick: () => alert("Clicked!") });
}
```

Add optional `@Style` blocks inside components or pages—those styles are merged into `public/_atom/styles.css`, copied to `dist/_atom/styles.css`, and injected automatically during dev.

## Layouts Use `props.content`

Layouts wrap the rendered page. The compiler (see `layoutHierarchyCode`) passes each layout a `content` prop, not `children`, so always destructure from `props`:

```atom
@View {
  const { content } = props || {};
  return div([
    Header(),
    main(content || div("Loading..."), { className: "min-h-screen" }),
    Footer()
  ]);
}
```

You can nest layouts by placing `_layout.atom` files inside route folders. The compiler walks directories and applies them from inner to outer automatically.

## Server Actions (`@Flow Actions`)

Server actions are declared inside `@Flow Actions { ... }` blocks. During compilation:

- Functions prefixed with `secure_` stay on the server (`system/compiler.js` lines 1432‑1458).
- Matching client stubs call `/_atom/rpc/<id>` via `fetch`.
- Non-secure functions remain client-side helpers.

Inline example:

```atom
@Flow Actions {
  secure_getUser: async function (userId) {
    return { id: userId, name: "Ada" };
  }
}

@View {
  const [user, setUser] = useState(null);

  if (!user) {
    Actions.secure_getUser(1).then(setUser);
    return div("Loading...");
  }

  return div(user.name);
}
```

Shared actions can live in `app/_actions.atom` (recommended). Importing from `.js` will **not** create RPC endpoints, so stick to `.atom` + `@Flow Actions` whenever you want `secure_` behavior.

## Development Loop

```bash
atom dev
```

Features wired up in `system/cli.js#dev`:

- Compiles with `--dev` to enable source maps and detailed errors.
- Watches `app/**/*.atom` and hot-rebuilds with debouncing.
- Restarts the runner automatically so the browser reloads.
- Injects HUD tooling for performance/SEO/error insights plus HMR.

Visit `http://localhost:3000` by default.

## Build, Start, Deploy

| Command | What happens |
|---------|--------------|
| `atom build` | Compiles routes, bundles via esbuild into `dist/client.js`, `dist/server.js`, `dist/ssr.js`, writes route chunks under `dist/routes/`, copies `public/` assets. |
| `atom start` | Runs the production server (`system/runner.js`) against the compiled output. |
| `atom test` | Executes the lightweight test harness in `system/lib/test-runner.js`. |
| `atom typecheck` | Generates and validates JS config using the framework’s TypeScript-aware analyzer. |
| `atom init` | Creates `jsconfig.json` in existing projects for editor IntelliSense. |
| `atom deploy <vercel|cloudflare|docker>` | Builds first, then hands off to the requested platform helper in `system/lib/deployment.js`. |

### Build Output

```
dist/
├── client.js        # Hydration + router runtime
├── server.js        # Server actions + RPC endpoints
├── ssr.js           # Node-compatible renderer
├── routes/          # Code-split route bundles
└── _atom/styles.css # Copied CSS for serverless platforms
```

`public/_atom/client.js` is also generated for the dev server so you can inspect the output without digging into `dist/`.

## Updating ATOM in Existing Apps

1. Bump the dependency in `package.json`:
   ```json
   {
     "dependencies": {
       "atom-framework": "^1.5.8"
     }
   }
   ```
2. Reinstall: `npm install`
3. (Optional) `npm update atom-framework` or `npm install atom-framework@latest`
4. For global CLIs: `npm install -g atom-framework@latest`

## Troubleshooting Checklist

- `atom dev` fails immediately → ensure Node ≥ 18 and delete any stray `dist/` folder.
- Server actions returning network errors → confirm the function name starts with `secure_`.
- Components not found → check they’re saved under `app/_components/Name.atom` with an `@View`.
- Layout renders undefined → confirm you destructured `const { content } = props || {};`.

## Next Steps

- [API Reference](./API_REFERENCE.md)
- [Examples](../examples/)
- [Deployment Guide](./DEPLOYMENT.md)
- [Production Guide](./PRODUCTION.md)

