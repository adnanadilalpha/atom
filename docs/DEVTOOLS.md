# ATOM DevTools HUD

ATOM Framework includes a comprehensive DevTools HUD (Heads-Up Display) that provides real-time insights into your application's performance, SEO, and errors.

## Overview

The DevTools HUD appears in the bottom-right corner of your application during development. Click the **ATOM** pill to open the panel.

## Features

### 1. Status Tab

Shows system information:
- **System Status** - Operational status
- **Routes** - Number of routes in your app
- **Components** - Number of components
- **Server Actions** - Number of server actions
- **Framework Version** - ATOM version
- **Mode** - Development or Production
- **Hot Reload** - Status

### 2. Performance Tab

Real-time performance metrics:

#### Metrics Displayed:
- **Performance Score** - Overall score (0-100) with grade (A-D)
- **First Contentful Paint (FCP)** - Time to first content
- **Largest Contentful Paint (LCP)** - Time to largest content
- **Page Load Time** - Total page load time
- **Bundle Size** - JavaScript bundle size

#### Performance Insights:
- **Why is speed slow?** - Lists specific issues affecting performance
- **Suggestions** - Actionable recommendations to improve performance

#### Performance Grades:
- **A (90-100)** - Excellent performance
- **B (75-89)** - Good performance
- **C (60-74)** - Needs improvement
- **D (0-59)** - Poor performance

### 3. SEO Tab

SEO analysis and recommendations:

#### Checks Performed:
- **Title Tag** - Presence and length (30-60 chars optimal)
- **Meta Description** - Presence and length (120-160 chars optimal)
- **H1 Tag** - Presence (should have exactly one)
- **Image Alt Text** - All images should have alt attributes
- **Lang Attribute** - HTML lang attribute
- **Viewport Meta** - Mobile responsiveness
- **Open Graph Tags** - Social media sharing (optional)

#### SEO Score:
- Calculated based on issues and warnings
- Deducts points for missing critical elements
- Provides actionable suggestions

### 4. Errors Tab

Error information and common issues:

- **Build-time Errors** - Check terminal for details
- **Runtime Errors** - Displayed here when detected
- **Common Errors Guide** - Quick reference for:
  - Missing libraries
  - Invalid Tailwind classes
  - Missing @View blocks
  - Syntax errors

## Error Detection System

The framework automatically detects common errors during build:

### Missing Libraries

```bash
⚠️  missing-library: Missing library: "gsap"
   💡 Run: npm install gsap
   → Line 10
```

### Invalid Tailwind Classes

```bash
⚠️  invalid-tailwind-class: Possible invalid Tailwind class: "flex--column"
   💡 Tailwind uses single hyphens, not double hyphens
   → Line 25
```

### Incomplete Classes

```bash
⚠️  incomplete-class: Incomplete class: "text-"
   💡 Class appears to be cut off. Did you mean to add a modifier?
   → Line 30
```

### Missing @View Block

```bash
⚠️  missing-view: Missing @View block
   💡 Add @View { ... } to define page content
```

### Missing Resource Files

```bash
⚠️  missing-resource: Missing resource file: "./db"
   💡 Check that the file exists at: /path/to/db.js
   → Line 5
```

## Performance Insights

The HUD explains why performance might be slow:

### Common Issues:

1. **FCP Slow (>1.8s)**
   - **Suggestion**: Use `@Stream` directive, optimize images, enable code splitting

2. **LCP Slow (>2.5s)**
   - **Suggestion**: Optimize images, reduce JavaScript execution time, preload critical resources

3. **High CLS (>0.1)**
   - **Suggestion**: Set explicit dimensions for images, avoid inserting content above existing content

4. **Large Bundle (>500KB)**
   - **Suggestion**: Enable code splitting, remove unused dependencies, use dynamic imports

5. **Page Load Slow (>3s)**
   - **Suggestion**: Optimize server response time, reduce bundle size, use CDN

## SEO Insights

The HUD identifies SEO issues:

### Critical Issues (Errors):
- Missing title tag
- Missing meta description
- Missing h1 tag
- Missing viewport meta tag

### Warnings:
- Title too short/long
- Description too short/long
- Multiple h1 tags
- Images without alt text
- Missing lang attribute

## Usage

### Accessing DevTools

1. **Development Mode**: DevTools automatically appear
2. **Click the ATOM pill** in bottom-right corner
3. **Navigate tabs** to see different information
4. **HUD updates automatically** every 5 seconds

### Understanding the Status Indicator

The dot color indicates overall health:
- **Green** - All good, no issues
- **Yellow** - Warnings detected
- **Red** - Errors detected

## Best Practices

### Performance

1. **Monitor Performance Tab** regularly
2. **Address issues** when score drops below 90
3. **Use @Stream** for faster FCP
4. **Optimize images** to improve LCP
5. **Code split** to reduce bundle size

### SEO

1. **Check SEO Tab** before deploying
2. **Fix all errors** (red issues)
3. **Address warnings** for better SEO
4. **Add alt text** to all images
5. **Set proper title/description** lengths

### Errors

1. **Fix build errors** immediately
2. **Check terminal** for detailed error messages
3. **Follow suggestions** provided by the framework
4. **Install missing libraries** as suggested

## Troubleshooting

### DevTools Not Appearing

- Ensure you're in development mode (`atom dev`)
- Check browser console for errors
- Verify `IS_DEV` flag is set

### Performance Metrics Not Showing

- Wait 2 seconds after page load
- Check browser console for PerformanceObserver errors
- Some metrics require page interaction

### SEO Analysis Not Working

- Ensure page has fully loaded
- Check that DOM is accessible
- Verify meta tags are in `<head>`

## Next Steps

- [Performance Guide](./PRODUCTION.md#performance-optimization) - Optimize your app
- [SEO Best Practices](./PRODUCTION.md#seo) - Improve SEO
- [Error Handling](./STABILITY.md) - Handle errors properly
