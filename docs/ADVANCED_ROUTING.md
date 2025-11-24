# Advanced Routing Features

## Nested Layouts

ATOM now supports nested layouts! Create `_layout.atom` files in any directory to create layout hierarchies.

### Example Structure

```
app/
├── _layout.atom          # Root layout
├── dashboard/
│   ├── _layout.atom      # Dashboard layout (nested)
│   ├── home.atom
│   └── settings.atom
└── blog/
    ├── _layout.atom      # Blog layout (nested)
    └── [id].atom
```

### How It Works

- Layouts are applied from outermost to innermost
- Each route automatically uses all layouts in its directory hierarchy
- **Layouts receive `props.content` which contains the page content** (NOT `props.children`)

### Example Layout

```atom
@View {
  // IMPORTANT: Use props.content, not props.children
  const { content } = props || {};
  
  return div([
    Header(),
    main(
      content ? content : div("Loading..."),
      { className: "min-h-screen" }
    ),
    Footer()
  ]);
}
```

**Key Points:**
- ✅ Always use `props.content` (NOT `props.children`)
- ✅ Always destructure: `const { content } = props || {};`
- ✅ Handle undefined content gracefully

## Route Groups

Organize routes without affecting URLs using parentheses.

### Example Structure

```
app/
├── (marketing)/
│   ├── about.atom        # URL: /about (not /marketing/about)
│   └── contact.atom      # URL: /contact
└── (dashboard)/
    ├── admin/
    │   └── users.atom    # URL: /admin/users
    └── settings.atom      # URL: /settings
```

Route groups are ignored in the URL structure but help organize your code.

## Advanced Dynamic Routes

### Catch-All Routes `[...slug]`

Matches all segments after the route.

**File:** `app/docs/[...slug].atom`

**URLs:**
- `/docs` → `slug = []`
- `/docs/getting-started` → `slug = ['getting-started']`
- `/docs/getting-started/installation` → `slug = ['getting-started', 'installation']`

**Usage:**
```atom
@View {
  const { slug } = props.params;
  return div(`Docs: ${slug.join('/')}`);
}
```

### Optional Catch-All Routes `[[...slug]]`

Matches zero or more segments.

**File:** `app/shop/[[...category]].atom`

**URLs:**
- `/shop` → `category = []` (matches)
- `/shop/electronics` → `category = ['electronics']`
- `/shop/electronics/phones` → `category = ['electronics', 'phones']`

### Standard Dynamic Routes `[id]`

**File:** `app/users/[id].atom`

**URL:** `/users/123` → `props.params.id = '123'`

## Code Splitting

ATOM automatically code-splits routes in production builds:

- Each route is loaded on-demand
- Reduces initial bundle size
- Faster page loads
- Routes are lazy-loaded when navigated to

**Note:** In development, all routes are bundled for faster hot reload.

## Examples

### Nested Layout Example

```atom
// app/_layout.atom
@View {
  return div([
    Header(),
    props.content,
    Footer()
  ]);
}

// app/dashboard/_layout.atom
@View {
  return div([
    Sidebar(),
    props.content  // Wrapped by root layout
  ]);
}

// app/dashboard/home.atom
@View {
  return h1("Dashboard Home");
}
// Result: Root Layout > Dashboard Layout > Page Content
```

### Catch-All Example

```atom
// app/docs/[...slug].atom
@View {
  const { slug } = props.params;
  
  if (!slug || slug.length === 0) {
    return div("Documentation Home");
  }
  
  return div([
    h1(`Docs: ${slug.join(' / ')}`),
    p(`Viewing: /docs/${slug.join('/')}`)
  ]);
}
```

### Route Group Example

```
app/
├── (marketing)/
│   ├── _layout.atom      # Marketing layout
│   ├── about.atom
│   └── contact.atom
└── (app)/
    ├── _layout.atom      # App layout
    ├── dashboard.atom
    └── settings.atom
```

Both groups can have their own layouts, but URLs remain clean:
- `/about` (not `/marketing/about`)
- `/dashboard` (not `/app/dashboard`)

