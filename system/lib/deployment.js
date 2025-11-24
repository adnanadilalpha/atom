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
        outputDirectory: "dist",
        routes: [
            { src: "/_atom/ws", dest: "/api/atom-server.js" },
            { src: "/(.*)", dest: "/api/atom-server.js" }
        ],
        env: {
            NODE_ENV: "production"
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
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

require('../dist/server.js');
require('../dist/ssr.js');

module.exports = require('../system/runner');
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
 * Setup deployment for a specific platform
 */
function setupDeployment(platform, projectPath = process.cwd()) {
    console.log(`🚀 Setting up ${platform} deployment...`);
    
    switch (platform) {
        case 'vercel':
            generateVercelConfig(projectPath);
            generateVercelEntry(projectPath);
            generateDeploymentScripts(projectPath);
            console.log('✅ Vercel configuration created (vercel.json & vercel-server.js)');
            console.log('💡 Deploy with: npm run deploy:vercel (requires `vercel` CLI)');
            break;
            
        case 'cloudflare':
            generateCloudflareConfig(projectPath);
            generateDeploymentScripts(projectPath);
            console.log('✅ Cloudflare Workers configuration created');
            console.log('💡 Install wrangler: npm install -D wrangler');
            console.log('💡 Deploy with: npm run deploy:cloudflare');
            break;
            
        case 'docker':
            generateDockerfile(projectPath);
            generateDockerIgnore(projectPath);
            generateDeploymentScripts(projectPath);
            console.log('✅ Docker configuration created');
            console.log('💡 Build with: docker build -t atom-app .');
            console.log('💡 Run with: docker run -p 3000:3000 atom-app');
            break;
            
        default:
            console.log(`❌ Unknown platform: ${platform}`);
            console.log('Available platforms: vercel, cloudflare, docker');
    }
}

module.exports = {
    generateVercelConfig,
    generateVercelEntry,
    generateCloudflareConfig,
    generateDockerfile,
    setupDeployment
};
