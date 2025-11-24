# Layouts in ATOM Framework

## Overview

Layouts in ATOM Framework work differently from React/Next.js. **ATOM uses `props.content`, NOT `props.children`**.

## Creating a Layout

Create `app/_layout.atom`:

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

## How Layouts Work

1. **Page renders first**: Your page component (`home.atom`, `about.atom`, etc.) renders its content
2. **Layout wraps it**: The framework automatically passes the rendered page content to the layout as `props.content`
3. **Layout applies**: The layout wraps the content with Header, Footer, navigation, etc.

## Key Differences from React/Next.js

| Framework | Prop Name | Example |
|-----------|-----------|---------|
| React/Next.js | `props.children` | `{children}` |
| **ATOM** | **`props.content`** | **`props.content`** |

## Best Practices

### 1. Always Destructure

```atom
@View {
  // ✅ Good
  const { content } = props || {};
  
  // ❌ Bad
  return div([props.content]);  // May be undefined
}
```

### 2. Handle Undefined Content

```atom
@View {
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

### 3. Use Conditional Rendering

```atom
@View {
  const { content } = props || {};
  
  return div([
    Header(),
    content ? main(content, { className: "min-h-screen" }) : LoadingSpinner(),
    Footer()
  ]);
}
```

## Nested Layouts

Layouts can be nested by creating `_layout.atom` files in subdirectories:

```
app/
├── _layout.atom          # Root layout
├── dashboard/
│   ├── _layout.atom      # Dashboard layout (nested)
│   └── home.atom
```

**How it works:**
- Layouts are applied from outermost to innermost
- Each layout receives the result of the inner layout/page as `props.content`
- Example flow: `dashboard/home.atom` → `dashboard/_layout.atom` → `_layout.atom`

### Example Nested Layout

**`app/_layout.atom` (Root):**
```atom
@View {
  const { content } = props || {};
  
  return div([
    Header(),
    main(content, { className: "min-h-screen" }),
    Footer()
  ]);
}
```

**`app/dashboard/_layout.atom` (Nested):**
```atom
@View {
  const { content } = props || {};
  
  return div([
    div("Dashboard Navigation", { className: "bg-gray-100 p-4" }),
    section(content, { className: "p-6" })
  ]);
}
```

**`app/dashboard/home.atom`:**
```atom
@View {
  return div("Dashboard Home Page");
}
```

**Result:** The page content flows through both layouts:
1. `dashboard/home.atom` renders "Dashboard Home Page"
2. `dashboard/_layout.atom` wraps it with dashboard navigation
3. `_layout.atom` wraps everything with Header and Footer

## Common Mistakes

### ❌ Using `props.children`

```atom
@View {
  // ❌ WRONG - ATOM doesn't use children
  return div([props.children]);
}
```

### ✅ Using `props.content`

```atom
@View {
  // ✅ CORRECT - ATOM uses content
  const { content } = props || {};
  return div([content]);
}
```

### ❌ Not Handling Undefined

```atom
@View {
  // ❌ WRONG - content may be undefined
  return div([props.content]);
}
```

### ✅ Handling Undefined

```atom
@View {
  // ✅ CORRECT - handles undefined
  const { content } = props || {};
  return div([content ? content : div("Loading...")]);
}
```

## Troubleshooting

### Layout Not Rendering Content

**Problem:** Layout renders but page content doesn't show.

**Solution:** Check that you're using `props.content`:

```atom
@View {
  const { content } = props || {};
  // Make sure you're using content, not children
  return div([content]);
}
```

### Content is Undefined

**Problem:** `content` is `undefined` in layout.

**Possible causes:**
1. Page component not returning valid DOM Node
2. Layout not receiving content prop (check framework version)
3. Page component throwing error

**Solution:**
```atom
@View {
  const { content } = props || {};
  console.log('Content:', content); // Debug
  return div([
    content ? content : div("No content available")
  ]);
}
```

## Examples

### Basic Layout

```atom
@View {
  const { content } = props || {};
  
  return div([
    Header(),
    main(content, { className: "container mx-auto px-4 py-8" }),
    Footer()
  ]);
}
```

### Layout with Navigation

```atom
@View {
  const { content } = props || {};
  const currentPath = usePath();
  
  return div([
    Header({ activePath: currentPath }),
    main(content, { className: "min-h-screen pt-16" }),
    Footer()
  ]);
}
```

### Layout with Sidebar

```atom
@View {
  const { content } = props || {};
  
  return div([
    Header(),
    div([
      aside([
        nav([
          a("Home", { href: "/" }),
          a("About", { href: "/about" })
        ])
      ], { className: "w-64 bg-gray-100 p-4" }),
      main(content, { className: "flex-1 p-6" })
    ], { className: "flex min-h-screen" }),
    Footer()
  ]);
}
```

## Summary

- ✅ **Use `props.content`** (NOT `props.children`)
- ✅ **Always destructure**: `const { content } = props || {};`
- ✅ **Handle undefined**: `content ? content : div("Loading...")`
- ✅ **Layouts wrap page content automatically**
- ✅ **Nested layouts work from outermost to innermost**

For more information, see:
- [Complete Guide](./COMPLETE_GUIDE.md)
- [Advanced Routing](./ADVANCED_ROUTING.md)
