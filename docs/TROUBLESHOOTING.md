# Troubleshooting Guide

## Local Development Setup

### Using Local Framework Version

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

### Building the Security Binary

```bash
npm run compile-engine
```

## Common Issues

### Build Fails

**Error: "Multiple exports with the same name"**
- Solution: Check for duplicate function names in your `.atom` files

**Error: "Syntax error"**
- Solution: Check your `.atom` file syntax, ensure all blocks are properly closed

### Images Not Loading

**Images return 404**
- Check that images are in the `public/` directory
- Verify the path in your `Image()` component
- Check server logs for image optimization errors

### Server Actions Not Working

**"Function not found" error**
- Ensure function name starts with `secure_`
- Check that the function is in `@Flow Actions` block
- Verify the route path matches

**Import errors (`Could not resolve "./_actions.atom"`)**
- Ensure the `.atom` file has a `@Flow Actions` block
- Check the file path is correct (relative to importing file)
- Both `.atom` and `.js` files can be imported for shared actions

### Hot Reload Not Working

**Changes not reflecting**
- Check browser console for errors
- Verify SSE connection: `/_atom/stream` should be active
- Try hard refresh (Cmd+Shift+R)

### CSS Not Applying

**Tailwind classes not working**
- Ensure classes are used in your code (Tailwind purges unused classes)
- Check `tailwind.config.js` for content paths
- Verify CSS is being generated (check Network tab for styles)

### Middleware Not Running

**Middleware not executing**
- Check that `_middleware.atom` exists in `app/` directory
- Verify the `handler` function is defined
- Check server logs for middleware errors

## Performance Issues

### Slow Page Loads

- Enable streaming SSR with `@Stream`
- Use `@Static` for pages that don't change
- Optimize images with CDN
- Check database query performance

### High Memory Usage

- Reduce image cache size (currently 100 items)
- Use ISR instead of dynamic rendering where possible
- Optimize server action responses

## Getting Help

1. Check the [API Reference](./API_REFERENCE.md)
2. Review [Examples](../examples/)
3. Open an issue on GitHub
4. Check server logs for detailed error messages

