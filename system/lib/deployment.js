/**
 * Deployment Helpers for ATOM Framework
 * Provides deployment configurations for various platforms
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate Vercel deployment configuration
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function generateVercelConfig(projectPath) {
    const vercelJson = {
        version: 2,
        installCommand: "npm install",
        buildCommand: "npm run build",
        // Don't set outputDirectory - let Vercel serve from public/ automatically
        // Static files in public/ are served before routing rules
        routes: [
            // Ensure filesystem routes (static assets) are checked first
            {
                "handle": "filesystem"
            },
            // WebSocket endpoint - must come before catch-all
            {
                src: "/_atom/ws",
                dest: "/api/atom-server.js"
            },
            // Image optimization endpoint - must come before catch-all
            {
                src: "/_atom/image",
                dest: "/api/atom-server.js"
            },
            // Revalidation endpoint - must come before catch-all
            {
                src: "/_atom/revalidate",
                dest: "/api/atom-server.js"
            },
            // All other routes go to serverless function
            // Static files (JS, CSS, images) in public/ are served automatically by Vercel
            // before these routing rules are applied
            {
                src: "/(.*)",
                dest: "/api/atom-server.js"
            }
        ],
        env: {
            NODE_ENV: "production"
        },
        functions: {
            "api/atom-server.js": {
                maxDuration: 10,
                includeFiles: "public/**/*"
            }
        }
    };

    const vercelPath = path.join(projectPath, 'vercel.json');
    fs.writeFileSync(vercelPath, JSON.stringify(vercelJson, null, 2));
    return vercelPath;
}

function generateVercelEntry(projectPath) {
    const apiDir = path.join(projectPath, 'api');
    ensureDir(apiDir);
    const entryPath = path.join(apiDir, 'atom-server.js');
    const entry = `process.env.ATOM_SERVERLESS = 'true';
process.env.VERCEL = '1';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

require('../dist/server.js');
require('../dist/ssr.js');

let runner;
try {
    runner = require('../system/runner');
} catch (localErr) {
    try {
        runner = require('atom-framework/system/runner');
    } catch (pkgErr) {
        console.error('[ATOM] Unable to resolve system runner from "../system/runner" or "atom-framework/system/runner".');
        throw pkgErr;
    }
}

module.exports = runner;
`;
    fs.writeFileSync(entryPath, entry);
    return entryPath;
}

/**
 * Generate Cloudflare Workers deployment configuration
 */
function generateCloudflareConfig(projectPath) {
    const wranglerToml = `name = "atom-app"
compatibility_date = "2024-01-01"

[build]
command = "atom build"

[[routes]]
pattern = "*"
zone_name = "your-domain.com"
`;
    
    const wranglerPath = path.join(projectPath, 'wrangler.toml');
    fs.writeFileSync(wranglerPath, wranglerToml);
    return wranglerPath;
}

/**
 * Generate Dockerfile for containerized deployment
 */
function generateDockerfile(projectPath) {
    const dockerfile = `FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
`;
    
    const dockerPath = path.join(projectPath, 'Dockerfile');
    fs.writeFileSync(dockerPath, dockerfile);
    return dockerPath;
}

/**
 * Generate .dockerignore
 */
function generateDockerIgnore(projectPath) {
    const dockerignore = `node_modules
dist
out
.git
.env
.env.local
*.log
.DS_Store
`;
    
    const dockerIgnorePath = path.join(projectPath, '.dockerignore');
    fs.writeFileSync(dockerIgnorePath, dockerignore);
    return dockerIgnorePath;
}

/**
 * Generate deployment scripts
 */
function generateDeploymentScripts(projectPath) {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) return;

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.scripts = packageJson.scripts || {};

    // Ensure base build/start scripts exist so hosting platforms can call them
    packageJson.scripts.build = packageJson.scripts.build || "atom build";
    packageJson.scripts.start = packageJson.scripts.start || "atom start";

    packageJson.scripts['deploy'] = packageJson.scripts['deploy'] || "npm run build && npm run start";
    packageJson.scripts['deploy:vercel'] = "npm run build && vercel --prod";
    packageJson.scripts['deploy:cloudflare'] = "npm run build && wrangler publish";
    packageJson.scripts['deploy:docker'] = "docker build -t atom-app . && docker run -p 3000:3000 atom-app";

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

/**
 * Ensure .gitignore doesn't block deployment files
 */
function ensureGitignore(projectPath) {
    const gitignorePath = path.join(projectPath, '.gitignore');
    let gitignoreContent = '';
    
    if (fs.existsSync(gitignorePath)) {
        gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    }
    
    // Files that MUST be committed (deployment configs)
    const mustCommit = [
        'api/',
        'vercel.json',
        'wrangler.toml',
        'Dockerfile',
        '.dockerignore'
    ];
    
    // Remove any ignore patterns for required files
    let updated = false;
    mustCommit.forEach(file => {
        // Check if file/dir is being ignored
        const lines = gitignoreContent.split('\n');
        const newLines = lines.filter(line => {
            const trimmed = line.trim();
            // Skip comments and empty lines
            if (!trimmed || trimmed.startsWith('#')) return true;
            // Remove if it matches our required file
            return !trimmed.includes(file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        });
        
        if (newLines.length !== lines.length) {
            gitignoreContent = newLines.join('\n');
            updated = true;
        }
    });
    
    // Ensure standard ignores are present (but allow public/_atom to be generated)
    const standardIgnores = [
        'node_modules',
        'dist',
        'out',
        '.env.local',
        '.DS_Store',
        '*.log'
    ];
    
    standardIgnores.forEach(ignore => {
        if (!gitignoreContent.includes(ignore)) {
            gitignoreContent += `\n${ignore}`;
            updated = true;
        }
    });
    
    // Note: public/_atom/styles.css is generated during build
    // Vercel will generate it during their build, so it doesn't need to be in git
    // But we ensure the directory structure exists
    
    if (updated || !fs.existsSync(gitignorePath)) {
        fs.writeFileSync(gitignorePath, gitignoreContent.trim() + '\n');
    }
}

/**
 * Verify build output exists
 */
function verifyBuildOutput(projectPath) {
    const distDir = path.join(projectPath, 'dist');
    const publicAtomDir = path.join(projectPath, 'public', '_atom');
    
    const checks = {
        distExists: fs.existsSync(distDir),
        distServerExists: fs.existsSync(path.join(distDir, 'server.js')),
        distSSRExists: fs.existsSync(path.join(distDir, 'ssr.js')),
        distClientExists: fs.existsSync(path.join(distDir, 'client.js')),
        cssExists: fs.existsSync(path.join(publicAtomDir, 'styles.css')) || 
                   fs.existsSync(path.join(distDir, '_atom', 'styles.css'))
    };
    
    const allGood = Object.values(checks).every(v => v === true);
    
    if (!allGood) {
        console.log('⚠️  Build output verification:');
        Object.entries(checks).forEach(([key, value]) => {
            console.log(`   ${value ? '✅' : '❌'} ${key}`);
        });
        console.log('💡 Run `atom build` first to generate required files');
        return false;
    }
    
    return true;
}

/**
 * Setup deployment for a specific platform
 */
function setupDeployment(platform, projectPath = process.cwd()) {
    console.log(`🚀 Setting up ${platform} deployment...\n`);
    
    // Ensure .gitignore is correct
    ensureGitignore(projectPath);
    console.log('✅ .gitignore configured\n');
    
    // Verify build output exists
    if (!verifyBuildOutput(projectPath)) {
        console.log('\n❌ Deployment setup incomplete - build required files first');
        return;
    }
    
    switch (platform) {
        case 'vercel':
            generateVercelConfig(projectPath);
            generateVercelEntry(projectPath);
            generateDeploymentScripts(projectPath);
            console.log('✅ Vercel configuration created:');
            console.log('   - vercel.json');
            console.log('   - api/atom-server.js');
            console.log('   - package.json scripts updated');
            console.log('\n💡 Deploy with: vercel --prod');
            console.log('   Or: npm run deploy:vercel (requires `vercel` CLI installed)');
            break;
            
        case 'cloudflare':
            generateCloudflareConfig(projectPath);
            generateDeploymentScripts(projectPath);
            console.log('✅ Cloudflare Workers configuration created:');
            console.log('   - wrangler.toml');
            console.log('   - package.json scripts updated');
            console.log('\n💡 Install wrangler: npm install -D wrangler');
            console.log('💡 Deploy with: npm run deploy:cloudflare');
            break;
            
        case 'docker':
            generateDockerfile(projectPath);
            generateDockerIgnore(projectPath);
            generateDeploymentScripts(projectPath);
            console.log('✅ Docker configuration created:');
            console.log('   - Dockerfile');
            console.log('   - .dockerignore');
            console.log('   - package.json scripts updated');
            console.log('\n💡 Build with: docker build -t atom-app .');
            console.log('💡 Run with: docker run -p 3000:3000 atom-app');
            break;
            
        default:
            console.log(`❌ Unknown platform: ${platform}`);
            console.log('Available platforms: vercel, cloudflare, docker');
            return;
    }
    
    console.log('\n✅ Deployment setup complete!');
}

module.exports = {
    generateVercelConfig,
    generateVercelEntry,
    generateCloudflareConfig,
    generateDockerfile,
    setupDeployment
};
