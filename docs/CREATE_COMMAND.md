# ATOM Create Command

The `atom create` command sets up a new ATOM project with interactive prompts and automatic dependency installation.

## Usage

```bash
# Interactive setup (recommended)
npx atom-framework create my-app

# Or if installed globally
atom create my-app

# Skip prompts (use defaults)
atom create my-app --skipPrompts
```

## Interactive Prompts

When you run `atom create`, you'll be asked:

1. **Template Selection:**
   - **Basic** - Simple starter with counter example
   - **Full-Stack** - Database example with server actions
   - **Empty** - Minimal setup

2. **TypeScript:**
   - Enable TypeScript support? (Yes/No)
   - Creates `tsconfig.json` if selected

3. **Tailwind CSS:**
   - Enable Tailwind CSS? (Yes/No, defaults to Yes)
   - Creates `tailwind.config.js` and `postcss.config.js` if selected

4. **ESLint:**
   - Enable ESLint? (Yes/No)
   - Adds ESLint to devDependencies if selected

## What Gets Created

After running `atom create`, you'll have:

```
my-app/
├── app/
│   ├── _components/     # Auto-imported components
│   └── home.atom        # Starter page (from template)
├── public/              # Static assets
├── package.json         # Dependencies and scripts
├── .gitignore          # Git ignore file
├── README.md           # Project README
└── [config files]      # tailwind.config.js, tsconfig.json, etc.
```

## Automatic Installation

Dependencies are **automatically installed** after project creation. You don't need to run `npm install` manually!

If installation fails (e.g., package not published yet), you'll see instructions to run it manually.

## Templates

### Basic Template

Simple starter with a counter example demonstrating:
- State management (`useState`)
- Event handlers
- Tailwind CSS styling

### Full-Stack Template

Complete example with:
- Server Actions (`secure_getPosts`, `secure_createPost`)
- Database integration example
- Form handling
- State management

### Empty Template

Minimal setup with just a welcome page - perfect for starting from scratch.

## Next Steps

After creating your project:

```bash
cd my-app
atom dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## Command Options

- `--skipPrompts` or `--skip-prompts` - Skip interactive prompts and use defaults
  - Template: Basic
  - TypeScript: No
  - Tailwind CSS: Yes
  - ESLint: No

## Troubleshooting

**npm install fails:**
- If `atom-framework` package isn't published yet, you'll need to install it manually
- For local development, you can use `npm link` or install from a local path

**Template files missing:**
- Ensure you have the latest version of `atom-framework`
- Check that templates exist in `node_modules/atom-framework/templates/`
