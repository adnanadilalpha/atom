#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { fork } = require('child_process');

const command = process.argv[2];
const SYSTEM_DIR = __dirname; 
const APP_DIR = path.join(process.cwd(), 'app');

// Handle --version flag FIRST (before any other output)
if (process.argv.includes('--version') || process.argv.includes('-v') || command === '--version' || command === '-v') {
    try {
        const packageJson = require(path.join(SYSTEM_DIR, '../package.json'));
        console.log(packageJson.version);
        process.exit(0);
    } catch (e) {
        console.log('1.5.1'); // Fallback version
        process.exit(0);
    }
}

console.log(`⚛️  ATOM CLI - Command: ${command || 'none'}`);

// --- HELPER: RUN COMPILER ---
function runCompiler(isDev = false) {
    return new Promise((resolve, reject) => {
        // FIX: Pass 'dev' flag to compiler if needed
        const args = isDev ? ['--dev'] : [];
        const p = fork(path.join(SYSTEM_DIR, 'compiler.js'), args);
        p.on('exit', (code) => {
            if (code === 0) resolve();
            else reject();
        });
    });
}

// --- HELPER: RUN SERVER ---
let serverProcess = null;
function startServer() {
    if (serverProcess) {
        // console.log("🔄 Restarting Server..."); 
        // Quiet restart to keep terminal clean
        serverProcess.kill();
    }
    serverProcess = fork(path.join(SYSTEM_DIR, 'runner.js'));
}

async function build() {
    console.log("🔨 Building Project...");
    await runCompiler(false);
    
    // Generate static pages if @Static directive is used
    try {
        console.log("📦 Generating Static Pages...");
        const { generateStaticPages } = require('./lib/static-generator');
        await generateStaticPages();
    } catch (e) {
        console.log("⚠️  Static generation skipped:", e.message);
    }
    
    // Analyze bundle size
    try {
        const { analyzeBundle, generateOptimizationReport, printOptimizationReport } = require('./lib/build-optimizer');
        const distDir = path.join(process.cwd(), 'dist');
        const analysis = analyzeBundle(distDir);
        const report = generateOptimizationReport(analysis);
        printOptimizationReport(report);
    } catch (e) {
        // Bundle analysis is optional
    }
}

async function start() {
    startServer();
}

async function dev() {
    console.log("👀 Starting Dev Mode (Watch + Hot Reload)...");
    
    try {
        await runCompiler(true); // Ensure TRUE is passed
        startServer();
    } catch (e) {
        console.log("❌ Initial Build Failed");
    }

    let debounceTimer;
    if (fs.existsSync(APP_DIR)) {
        fs.watch(APP_DIR, { recursive: true }, (eventType, filename) => {
            if (!filename || !filename.endsWith('.atom')) return;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                console.log(`\n📝 Change in ${filename} -> Rebuilding...`);
                try {
                    await runCompiler(true);
                    startServer(); // Restarting server triggers the frontend Hot Reload
                } catch (e) {
                    console.log("❌ Build failed, waiting...");
                }
            }, 100);
        });
    }
}

async function createProject(name, options = {}) {
    const fs = require('fs');
    const path = require('path');
    const { execSync } = require('child_process');
    
    const projectPath = path.join(process.cwd(), name);
    
    if (fs.existsSync(projectPath)) {
        console.log(`❌ Directory ${name} already exists`);
        process.exit(1);
    }
    
    // Check for skip prompts flag
    const skipPromptsFlag = options.skipPrompts || 
                           process.argv.includes('--skipPrompts') || 
                           process.argv.includes('--skip-prompts');
    
    // Interactive prompts if options not provided
    let config = options;
    if (!options.template && !skipPromptsFlag) {
        const prompts = require('prompts');
        const response = await prompts([
            {
                type: 'select',
                name: 'template',
                message: 'What template would you like to use?',
                choices: [
                    { title: 'Basic (Simple starter)', value: 'basic' },
                    { title: 'Full-Stack (With database example)', value: 'fullstack' },
                    { title: 'Empty (Minimal setup)', value: 'empty' }
                ],
                initial: 0
            },
            {
                type: 'confirm',
                name: 'typescript',
                message: 'Would you like to use TypeScript?',
                initial: false
            },
            {
                type: 'confirm',
                name: 'tailwind',
                message: 'Would you like to use Tailwind CSS?',
                initial: true
            },
            {
                type: 'confirm',
                name: 'eslint',
                message: 'Would you like to use ESLint?',
                initial: false
            }
        ], {
            onCancel: () => {
                console.log('\n❌ Project creation cancelled.');
                process.exit(0);
            }
        });
        if (!response || !response.template) {
            console.log('\n❌ Project creation cancelled.');
            process.exit(0);
        }
        config = { ...config, ...response };
    } else if (skipPromptsFlag && !options.template) {
        // Use defaults when skipping prompts
        config = {
            template: 'basic',
            typescript: false,
            tailwind: true,
            eslint: false
        };
    }
    
    const template = config.template || 'basic';
    const useTypeScript = config.typescript || false;
    const useTailwind = config.tailwind !== false; // Default true
    const useESLint = config.eslint || false;
    
    console.log(`\n🚀 Creating ATOM project: ${name}...`);
    console.log(`   Template: ${template}`);
    console.log(`   TypeScript: ${useTypeScript ? 'Yes' : 'No'}`);
    console.log(`   Tailwind CSS: ${useTailwind ? 'Yes' : 'No'}`);
    console.log(`   ESLint: ${useESLint ? 'Yes' : 'No'}\n`);
    
    // Create directory structure
    fs.mkdirSync(projectPath, { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'app'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'app', '_components'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'public'), { recursive: true });
    
    // Copy template files if template exists
    const templatePath = path.join(__dirname, '../templates', template);
    if (fs.existsSync(templatePath)) {
        const copyRecursive = (src, dest) => {
            const exists = fs.existsSync(src);
            if (!exists) return;
            const stats = fs.statSync(src);
            const isDirectory = stats.isDirectory();
            if (isDirectory) {
                if (!fs.existsSync(dest)) {
                    fs.mkdirSync(dest, { recursive: true });
                }
                fs.readdirSync(src).forEach(childItemName => {
                    // Skip node_modules and other unwanted directories
                    if (childItemName === 'node_modules' || childItemName === '.git') {
                        return;
                    }
                    copyRecursive(
                        path.join(src, childItemName),
                        path.join(dest, childItemName)
                    );
                });
            } else {
                // Ensure parent directory exists
                const destDir = path.dirname(dest);
                if (!fs.existsSync(destDir)) {
                    fs.mkdirSync(destDir, { recursive: true });
                }
                fs.copyFileSync(src, dest);
            }
        };
        copyRecursive(templatePath, projectPath);
        
        // Overwrite package.json with our generated one (which has correct dependencies)
        // Don't overwrite, let our generated package.json be used
    } else {
        // Create basic home page if no template
        const homeAtom = `@Title "Welcome to ATOM"
@Description "Your first ATOM application"

@View {
  const [count, setCount] = useState(0);
  
  return div([
    h1("Welcome to ATOM Framework!", {
      className: "text-5xl font-bold text-center mb-8"
    }),
    p("A revolutionary full-stack framework", {
      className: "text-xl text-gray-600 text-center mb-8"
    }),
    div([
      button("-", {
        onclick: () => setCount(count - 1),
        className: "px-4 py-2 bg-gray-200 rounded"
      }),
      span(count, {
        className: "mx-4 text-2xl font-bold"
      }),
      button("+", {
        onclick: () => setCount(count + 1),
        className: "px-4 py-2 bg-blue-600 text-white rounded"
      })
    ], { className: "flex items-center justify-center" })
  ], {
    className: "min-h-screen flex flex-col items-center justify-center p-8"
  });
}`;
        fs.writeFileSync(path.join(projectPath, 'app', 'home.atom'), homeAtom);
    }
    
    // Create package.json with dependencies
    const packageJson = {
        name: name,
        version: "1.0.0",
        private: true,
        scripts: {
            dev: "atom dev",
            build: "atom build",
            start: "atom start"
        },
        dependencies: {
            "atom-framework": "^1.0.0"
        }
    };
    
    if (useTypeScript) {
        packageJson.devDependencies = {
            ...packageJson.devDependencies,
            "typescript": "^5.0.0",
            "@types/node": "^20.0.0"
        };
    }
    
    if (useTailwind) {
        packageJson.devDependencies = {
            ...packageJson.devDependencies,
            "tailwindcss": "^3.4.0",
            "autoprefixer": "^10.4.0",
            "postcss": "^8.4.0"
        };
    }
    
    if (useESLint) {
        packageJson.devDependencies = {
            ...packageJson.devDependencies,
            "eslint": "^8.0.0"
        };
    }
    
    fs.writeFileSync(
        path.join(projectPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );
    
    // Create tailwind.config.js if Tailwind is selected
    if (useTailwind) {
        const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{atom,js}",
    "./dist/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
        fs.writeFileSync(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);
        
        const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
        fs.writeFileSync(path.join(projectPath, 'postcss.config.js'), postcssConfig);
    }
    
    // Create tsconfig.json if TypeScript is selected
    if (useTypeScript) {
        const tsconfig = {
            "compilerOptions": {
                "target": "ES2020",
                "module": "commonjs",
                "lib": ["ES2020"],
                "strict": true,
                "esModuleInterop": true,
                "skipLibCheck": true,
                "forceConsistentCasingInFileNames": true,
                "resolveJsonModule": true,
                "moduleResolution": "node"
            },
            "include": ["app/**/*"],
            "exclude": ["node_modules", "dist"]
        };
        fs.writeFileSync(
            path.join(projectPath, 'tsconfig.json'),
            JSON.stringify(tsconfig, null, 2)
        );
    }
    
    // Create .gitignore
    const gitignore = `node_modules/
dist/
out/
.env
.env.local
.DS_Store
*.log
.vercel
.netlify`;
    fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore);
    
    // Create README
    const readme = `# ${name}

This is an ATOM Framework project.

## Getting Started

\`\`\`bash
npm install
atom dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Learn More

- [ATOM Framework Documentation](https://atomframework.dev/docs)
- [GitHub Repository](https://github.com/atom-framework/atom)
`;
    fs.writeFileSync(path.join(projectPath, 'README.md'), readme);
    
    console.log(`✅ Project created!\n`);
    
    // Automatically run npm install
    console.log(`📦 Installing dependencies...`);
    try {
        execSync('npm install', { 
            stdio: 'inherit', 
            cwd: projectPath,
            env: { ...process.env, npm_config_loglevel: 'error' }
        });
        console.log(`\n✅ Dependencies installed!\n`);
    } catch (error) {
        console.log(`\n⚠️  npm install failed. Please run manually:\n`);
        console.log(`  cd ${name}`);
        console.log(`  npm install\n`);
    }
    
    console.log(`🎉 Your ATOM project is ready!\n`);
    console.log(`Next steps:`);
    console.log(`  cd ${name}`);
    console.log(`  atom dev\n`);
}

async function test() {
    console.log("🧪 Running Tests...");
    const { runTests } = require('./lib/test-runner');
    const result = runTests();
    if (!result.success) {
        process.exit(1);
    }
}

async function typecheck() {
    console.log("🔍 Type Checking...");
    const { typeCheckAtomFiles } = require('./lib/type-checker');
    const result = typeCheckAtomFiles(APP_DIR);
    if (!result.success) {
        console.log(`❌ ${result.message}`);
        process.exit(1);
    } else {
        console.log(`✅ ${result.message}`);
    }
}

function init() {
    console.log("🚀 Initializing ATOM project...");
    const { createTSConfig } = require('./lib/type-checker');
    const tsconfigPath = createTSConfig(process.cwd());
    console.log(`✅ Created ${tsconfigPath}`);
    console.log("💡 Install TypeScript: npm install -D typescript");
}

function deploy() {
    const platform = process.argv[3] || 'vercel';
    const { setupDeployment } = require('./lib/deployment');
    setupDeployment(platform);
}


switch (command) {
    case 'build': build(); break;
    case 'start': start(); break;
    case 'dev': dev(); break;
    case 'test': test(); break;
    case 'typecheck': typecheck(); break;
    case 'init': init(); break;
    case 'deploy': deploy(); break;
    case 'create': 
        const projectName = process.argv[3];
        if (!projectName) {
            console.log("Usage: atom create <project-name>");
            console.log("   or: npx atom-framework create <project-name>");
            process.exit(1);
        }
        // Check for --skip-prompts flag
        const skipPrompts = process.argv.includes('--skip-prompts') || process.argv.includes('--skipPrompts');
        createProject(projectName, { skipPrompts }).catch(err => {
            console.error('❌ Failed to create project:', err.message);
            process.exit(1);
        });
        break;
    case 'setup': 
        console.log("Setup is run via install script usually."); 
        break;
    default:
        console.log("Usage: atom [dev|build|start|create|test|typecheck|init|deploy]");
        process.exit(1);
}