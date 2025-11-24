# ATOM Framework Developer Guide

This guide is for developers working on the ATOM Framework itself or contributing to the framework.

## Local Development Setup

### Using Local Framework Version

Since ATOM Framework isn't published to npm yet, use npm link:

```bash
# 1. Link framework globally
cd /path/to/atom
npm link

# 2. Link in your project
cd /path/to/your-project
npm link atom-framework

# 3. Verify
npm list atom-framework
```

### Updating Framework

When framework updates:
```bash
# In your project, just rebuild
atom build
# Changes are immediately available!
```

## Building the Binary

To create the obfuscated binary for security:

```bash
npm run compile-engine
```

This creates `atom-engine` binary with obfuscated code.

## Project Structure

```
atom-framework/
├── system/           # Core framework (source)
│   ├── cli.js        # CLI commands
│   ├── compiler.js   # Compiler for .atom files
│   ├── runner.js      # Express server for SSR
│   └── lib/          # Core libraries
│       ├── templates.js      # Client/SSR runtime templates
│       ├── parser.js         # File parser
│       ├── static-generator.js # SSG support
│       └── ...
├── system_locked/    # Obfuscated version
├── app/              # Example app
├── docs/             # Documentation
├── examples/         # Code examples
├── templates/        # Starter templates
└── build_engine.js   # Binary builder
```

## Key Framework Concepts

### How Layouts Work

**IMPORTANT: ATOM uses `props.content`, NOT `props.children`**

The framework passes page content to layouts via the `content` prop:

1. **Compiler generates layout wrapper** (`system/compiler.js`):
   ```javascript
   // Layout receives content prop
   Layout({ ...props, content: PageContent(props) })
   ```

2. **Layout component receives content**:
   ```atom
   @View {
     const { content } = props || {};
     return div([Header(), main(content), Footer()]);
   }
   ```

3. **Nested layouts work from outermost to innermost**:
   - Each layout receives the result of the inner layout/page as `props.content`
   - Example: `dashboard/home.atom` → `dashboard/_layout.atom` → `_layout.atom`

### How Components Work

- Components in `app/_components/` are auto-imported
- Compiler automatically includes component definitions in route files
- Components can receive content as first argument or via props

### How Server Actions Work

1. **Compiler extracts** `@Flow Actions` blocks
2. **Generates client wrapper** that calls `/_atom/rpc/:funcName`
3. **Server handler** (`system/runner.js`) executes the function
4. **Returns result** as JSON to client

### How Routing Works

1. **Compiler generates routes** from file structure
2. **Client-side** (`system/lib/templates.js`): `matchRoute()` function matches paths
3. **Server-side**: Same `matchRoute()` function for SSR
4. **Dynamic routes**: Regex-based matching with parameter extraction

## Testing

```bash
# Run test suite
atom dev
# Visit: http://localhost:3000/test_suite
```

## Development Workflow

### Making Changes

1. **Edit source files** in `system/`
2. **Test locally**: `atom dev` in example app
3. **Rebuild**: `atom build` to see changes
4. **Check generated code**: Look in `dist/` folder

### Debugging

- **Client-side**: Check `dist/client.js` and browser console
- **Server-side**: Check `dist/server.js` and server logs
- **SSR**: Check `dist/ssr.js` and SSR logs
- **Routes**: Check `dist/routes/` for generated route files

### Common Development Tasks

#### Adding a New Hook

1. Add hook function to `system/lib/templates.js`
2. Add cursor tracking if needed
3. Reset cursor in `renderApp()` and `navigate()`
4. Update SSR stubs in `system/lib/templates.js` (SSR section)
5. Update compiler to include hook in generated code

#### Adding a New Directive

1. Add extraction logic in `system/compiler.js`
2. Process directive in route generation
3. Update documentation

#### Fixing Layout Issues

- Check `system/compiler.js` layout wrapper generation
- Verify `props.content` is being passed correctly
- Check both client and SSR code generation
- Test with nested layouts

## Code Organization

### `system/compiler.js`
- Parses `.atom` files
- Extracts directives, views, actions
- Generates client and SSR code
- Handles layouts, routes, components

### `system/lib/templates.js`
- Client-side runtime (hooks, rendering, routing)
- SSR runtime (server-side rendering)
- DOM helpers and utilities

### `system/runner.js`
- Express server setup
- SSR handler
- RPC handler for server actions
- Static file serving
- Middleware support

## Best Practices for Framework Development

1. **Always test both client and SSR**
2. **Check generated code** in `dist/` folder
3. **Update documentation** when adding features
4. **Maintain backward compatibility**
5. **Add error handling** for edge cases
6. **Validate inputs** in framework code
7. **Clear error messages** for developers

## Publishing

See [NPM Publishing](./NPM_PUBLISH.md) for details.

## Contributing

When contributing:
1. Test your changes thoroughly
2. Update relevant documentation
3. Check for breaking changes
4. Follow existing code style
5. Add comments for complex logic

