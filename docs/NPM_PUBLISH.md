# Publishing to npm

## Prerequisites

1. npm account: https://www.npmjs.com/signup
2. Login: `npm login`

## Publishing Steps

```bash
# 1. Test locally
npm pack
npm install -g ./atom-framework-1.0.0.tgz

# 2. Version bump
npm version patch  # or minor, major

# 3. Publish
npm publish --access public

# 4. Verify
npm view atom-framework
```

## After Publishing

Users can create a new project:

```bash
# Interactive setup (recommended)
npx atom-framework create my-app

# Or install globally first
npm install -g atom-framework
atom create my-app
```

The create command will:
- Ask interactive questions (template, TypeScript, Tailwind, ESLint)
- Create the project structure
- Automatically install dependencies
- Ready to run `atom dev`!

