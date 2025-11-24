/**
 * Deployment Helpers for ATOM Framework
 * Provides deployment configurations for various platforms
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate Vercel deployment configuration
 */
function generateVercelConfig(projectPath) {
    const vercelJson = {
        version: 2,
        builds: [
            {
                src: "package.json",
                use: "@vercel/node"
            }
        ],
        routes: [
            {
                src: "/(.*)",
                dest: "/"
            }
        ],
        env: {
            NODE_ENV: "production"
        }
    };
    
    const vercelPath = path.join(projectPath, 'vercel.json');
    fs.writeFileSync(vercelPath, JSON.stringify(vercelJson, null, 2));
    return vercelPath;
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
    packageJson.scripts.deploy = "atom build && vercel --prod";
    packageJson.scripts.deploy:vercel = "atom build && vercel --prod";
    packageJson.scripts.deploy:cloudflare = "atom build && wrangler publish";
    packageJson.scripts.deploy:docker = "docker build -t atom-app . && docker run -p 3000:3000 atom-app";
    
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
            generateDeploymentScripts(projectPath);
            console.log('✅ Vercel configuration created');
            console.log('💡 Deploy with: npm run deploy:vercel');
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
    generateCloudflareConfig,
    generateDockerfile,
    setupDeployment
};
