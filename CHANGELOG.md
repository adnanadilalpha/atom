# Changelog

## [1.5.1] - 2024-12-XX - Build Fixes & Developer Experience Release

### Fixed
- **esbuild bundling errors** - Fixed "Unexpected export" errors during build by marking route files as external
- **HUD z-index fix** - Added inline styles to HUD container to ensure it always appears above all content
- **VS Code integration** - Added `.vscode/settings.json` to all templates for proper syntax highlighting of `.atom` files

### Changed
- Route files are now excluded from bundling (loaded dynamically at runtime as intended)
- Improved build output with cleaner error messages

## [1.5.0] - 2024-12-XX - Brand Colors, Port Detection & HUD Fix Release

### Added
- **Automatic port detection** - Framework automatically finds next available port if default (3000) is in use (like Next.js)
- **Brand color integration** - ATOM brand color (#19A88D) applied across all templates and examples

### Changed
- Updated all templates (basic, fullstack, empty) to use ATOM brand colors
- Enhanced template responsiveness across all breakpoints
- Improved fullstack template with proper folder structure and package.json

### Fixed
- **HUD z-index fix** - DevTools HUD now appears above all website content (z-index: 999999)
- Fixed HUD pointer-events handling for proper interaction
- Improved port conflict handling with informative console messages

## [1.4.0] - 2024-12-XX - Interactive Project Creation Release

### Added
- **Interactive project creation** (like Next.js `create-next-app`)
  - Template selection (Basic, Full-Stack, Empty)
  - TypeScript option
  - Tailwind CSS option (defaults to Yes)
  - ESLint option
- **Automatic dependency installation** - `npm install` runs automatically after project creation
- **`--skipPrompts` flag** - Skip interactive prompts and use defaults
- **New documentation**: [Create Command Guide](./docs/CREATE_COMMAND.md)

### Changed
- Updated `atom create` command to use interactive prompts by default
- Project creation now automatically installs dependencies
- Improved template copying logic with better error handling

### Fixed
- Fixed `isNumber` validation to accept both numbers and numeric strings (fixes delete record test)
- Improved error handling in test suite for all test functions
- Fixed records rendering in test suite with proper array handling

## [1.3.0] - 2024-12-XX - Enhanced DevTools & Error Detection Release

### New Features 🎉

#### Enhanced DevTools HUD
- **Multi-Tab Interface** - Status, Performance, SEO, and Errors tabs
- **Real-Time Performance Monitoring** - FCP, LCP, CLS, Page Load metrics
- **Performance Scoring** - A-D grades with actionable insights
- **SEO Analysis** - Automatic SEO issue detection and scoring
- **Bundle Size Tracking** - Real-time bundle size monitoring
- **Status Information** - Routes, components, server actions count
- **Visual Status Indicator** - Color-coded dot (green/yellow/red)
- **Performance Insights** - Explains why speed is slow/fast
- **SEO Recommendations** - Actionable suggestions for better SEO

#### Error Detection System
- **Missing Library Detection** - Detects when npm packages are missing
- **Tailwind Class Validation** - Detects invalid/incomplete classes
- **CSS Validation** - Detects incomplete CSS rules
- **Syntax Error Detection** - Detects unclosed strings and common mistakes
- **Missing @View Detection** - Warns when pages lack @View blocks
- **Missing Resource Detection** - Detects missing @Resource files
- **Helpful Error Messages** - Clear messages with suggestions and line numbers
- **Build-Time Validation** - Errors shown during compilation

### Improvements ✨

#### Compiler
- **Enhanced Error Messages** - Better context, file paths, line numbers
- **Error Detection Integration** - Automatic error checking during build
- **Tailwind Class Validation** - Detects typos and incomplete classes
- **Import Validation** - Checks for missing libraries and resources

#### Developer Experience
- **Real-Time Monitoring** - DevTools updates every 5 seconds
- **Actionable Insights** - Specific suggestions for each issue
- **Performance Explanations** - "Why is speed slow?" section
- **SEO Score** - Visual SEO health indicator

## [1.2.0] - 2024-12-XX - Production Readiness Release

### New Features 🎉

#### Input Validation Framework
- **Built-in Validation Utilities** - Complete validation library in `system/lib/validation.js`
- **Type Validators** - `required`, `isString`, `isNumber`, `isArray`, `isObject`
- **String Validators** - `minLength`, `maxLength`, `matches` (regex)
- **Format Validators** - `isEmail`, `isURL`
- **Number Validators** - `min`, `max`
- **Array Validators** - `arrayMinLength`, `arrayMaxLength`
- **Choice Validators** - `oneOf`
- **Schema Validation** - `validate()` and `validateObject()` for complex schemas
- **Clear Error Messages** - Helpful validation error messages

#### Input Sanitization
- **Built-in Sanitization Utilities** - Complete sanitization library in `system/lib/sanitize.js`
- **Automatic Sanitization** - All Server Action inputs are automatically sanitized
- **HTML Sanitization** - `sanitizeHTML()` with configurable allowed tags
- **String Sanitization** - `sanitizeString()` with length limits and HTML removal
- **Object Sanitization** - `sanitizeObject()` for recursive sanitization
- **XSS Prevention** - Automatic removal of dangerous patterns
- **SQL Injection Prevention** - Basic SQL pattern sanitization (use parameterized queries!)
- **URL Sanitization** - `sanitizeURL()` to prevent javascript: and data: protocols
- **Email Sanitization** - `sanitizeEmail()` for safe email handling

#### WebSocket Support
- **Built-in WebSocket Server** - Real-time communication support
- **Room-based Messaging** - Join/leave rooms for targeted messaging
- **Client Management** - Automatic client tracking and cleanup
- **Broadcast Support** - Broadcast to all clients or specific rooms
- **Connection Handling** - Automatic reconnection and error handling
- **Stats API** - Get WebSocket server statistics

#### Testing Utilities
- **Testing Helpers** - Complete testing utilities in `system/lib/test-utils.js`
- **Mock Request/Response** - `createMockRequest()`, `createMockResponse()`
- **Component Testing** - `renderComponent()` for testing components
- **Server Action Mocking** - `mockServerAction()` for mocking actions
- **Database Mocking** - `createMockDB()` for testing database operations
- **Assertions** - `assertDOMNode()`, `assertValidComponent()`

### Improvements ✨

#### Server Actions
- **Enhanced Error Responses** - Better error messages with context
- **Automatic Input Sanitization** - All inputs sanitized by default
- **Validation Context** - Validation utilities available in Server Actions
- **Stack Traces in Development** - Better debugging experience

#### Documentation
- **Validation Guide** - Complete validation and sanitization documentation
- **Updated Production Readiness** - Reflects new built-in features
- **Examples Updated** - All examples use new validation utilities

### Breaking Changes
None - All new features are additive

### Migration Guide
No migration needed - new features are opt-in via imports

## [1.1.0] - 2024-12-XX - Stability & Robustness Release

### Stability Improvements 🛡️

#### Error Handling & Validation
- **Component Error Boundaries**: All components now wrapped in error boundaries to prevent app crashes
- **Hook Validation**: Added validation for `useState`, `useEffect`, and `useRef` to ensure they're called correctly
- **DOM Node Validation**: Enhanced validation to ensure all DOM operations receive valid Node objects
- **Graceful Degradation**: Framework now handles invalid component returns, undefined values, and edge cases gracefully

#### React Hooks Implementation
- **Fixed `useState`**: Corrected state initialization and cursor management to prevent `undefined` values
- **Fixed `useEffect`**: Improved dependency tracking and cleanup to prevent infinite loops
- **Implemented `useRef`**: Proper ref persistence across renders with cleanup on navigation
- **Implemented `useMemo`**: Full memoization support with dependency tracking to prevent unnecessary recalculations

#### Memory & Performance
- **Request Deduplication**: Added `useRef`-based request deduplication to prevent duplicate API calls
- **Effect Cleanup**: Proper cleanup of all effects, timeouts, and event listeners on navigation
- **Cache Management**: Added size limits to server-side caches to prevent memory leaks
- **Ref Cleanup**: Refs are properly cleared on navigation to prevent memory leaks

#### DOM Diffing Engine
- **Robust Node Validation**: Enhanced `diff` function to handle `undefined`, `null`, and invalid nodes
- **Child Node Safety**: Improved child node diffing to skip invalid nodes gracefully
- **Error Recovery**: Added fallback mechanisms for DOM operation failures
- **Async Component Handling**: Proper handling of lazy-loaded components and promises

#### Server-Side Rendering
- **Async SSR Support**: Fixed SSR to properly await async component rendering
- **Layout Application**: Corrected Layout component passing to route components
- **Module Format**: Fixed CommonJS/ESM mixing warnings in SSR bundle
- **Error Handling**: Enhanced SSR error boundaries and error display

#### Build System
- **Component Validation**: Added syntax validation for components during build
- **Error Messages**: Improved error messages with proper context and stack traces
- **Promise Handling**: Fixed unhandled promise rejections in build process
- **Template Literals**: Fixed syntax errors in generated code

### Bug Fixes 🐛
- Fixed `products.map is not a function` error with defensive array checks
- Fixed infinite loop in blog post page with proper `useEffect` dependencies
- Fixed `replaceChild` errors with async component handling
- Fixed placeholder showing "[object Object]" in form inputs
- Fixed "label is not a function" error with proper prop naming
- Fixed SSR returning empty HTML with proper async/await
- Fixed `useRef` not persisting values across renders
- Fixed `useState` returning `undefined` on first render
- Fixed `diff: newEl must be a valid DOM Node` errors

### Developer Experience ✨
- **Better Error Messages**: More descriptive errors with file paths and line numbers
- **Console Warnings**: Helpful warnings for common mistakes
- **Error Display**: User-friendly error messages in the UI instead of blank screens
- **Build Warnings**: Clean builds with no module system warnings

## [1.0.0] - 2024-01-XX

### Added
- Initial release of ATOM Framework
- Isomorphic splitting (Server + Client)
- SSR with streaming support
- Enhanced image optimization (srcset, WebP, AVIF)
- Server Actions (secure_ functions)
- ISR/SSG support (@Static, @Revalidate)
- Edge runtime compatibility
- Image CDN integration (Cloudflare, ImageKit)
- Build-time static generation
- Hot reload via SSE
- DevTools HUD
- Auto-imported components
- Tailwind CSS integration
- Middleware support
- API routes (+server.atom)

### Features
- Zero API boilerplate
- Security by obfuscation
- Performance by SSR
- Instant developer experience

