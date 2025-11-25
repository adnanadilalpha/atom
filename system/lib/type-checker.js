/**
 * TypeScript Type Checker for ATOM Framework
 * Provides type checking for .atom files and Server Actions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let typescriptAvailable = false;
try {
    require.resolve('typescript');
    typescriptAvailable = true;
} catch (e) {
    // TypeScript not installed
}

/**
 * Check if TypeScript is available
 */
function isTypeScriptAvailable() {
    return typescriptAvailable;
}

/**
 * Generate TypeScript definitions for Server Actions
 */
function generateServerActionTypes(serverActions, outputPath) {
    if (!typescriptAvailable) return;
    
    let typeDefinitions = `// Auto-generated Server Action Types\n\n`;
    typeDefinitions += `export interface ServerActions {\n`;
    
    Object.keys(serverActions).forEach(funcName => {
        if (funcName.startsWith('secure_')) {
            const actionName = funcName.replace('secure_', '');
            typeDefinitions += `  ${actionName}: (data?: any) => Promise<any>;\n`;
        }
    });
    
    typeDefinitions += `}\n\n`;
    typeDefinitions += `declare global {\n`;
    typeDefinitions += `  const Actions: ServerActions;\n`;
    typeDefinitions += `}\n`;
    
    fs.writeFileSync(outputPath, typeDefinitions);
}

/**
 * Type check .atom files (if tsconfig.json exists)
 */
function typeCheckAtomFiles(appDir) {
    if (!typescriptAvailable) {
        return { success: true, message: 'TypeScript not installed. Install with: npm install -D typescript' };
    }
    
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    if (!fs.existsSync(tsconfigPath)) {
        return { success: true, message: 'No tsconfig.json found. Type checking skipped.' };
    }
    
    try {
        const tscPath = require.resolve('typescript/bin/tsc');
        execSync(`node "${tscPath}" --noEmit`, { 
            stdio: 'inherit',
            cwd: process.cwd() 
        });
        return { success: true, message: 'Type checking passed' };
    } catch (e) {
        return { success: false, message: 'Type checking failed', error: e.message };
    }
}

/**
 * Create jsconfig.json for ATOM projects (JavaScript-based framework)
 */
function createJSConfig(projectPath) {
    const jsconfig = {
        compilerOptions: {
            target: "ES2020",
            module: "CommonJS",
            lib: ["ES2020", "DOM", "DOM.Iterable"],
            allowJs: true,
            checkJs: false,
            noEmit: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: "preserve",
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            moduleResolution: "node"
        },
        include: [
            "app/**/*",
            "system/**/*",
            "*.js",
            "*.json"
        ],
        exclude: [
            "node_modules",
            "dist",
            "out",
            ".git",
            "public"
        ]
    };

    const jsconfigPath = path.join(projectPath, 'jsconfig.json');
    fs.writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2));
    return jsconfigPath;
}

/**
 * Create tsconfig.json for ATOM projects (if TypeScript is explicitly requested)
 */
function createTSConfig(projectPath) {
    const tsconfig = {
        compilerOptions: {
            target: "ES2020",
            module: "ESNext",
            lib: ["ES2020", "DOM", "DOM.Iterable"],
            jsx: "preserve",
            moduleResolution: "bundler",
            resolveJsonModule: true,
            allowJs: true,
            checkJs: false,
            noEmit: true,
            strict: false,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            allowSyntheticDefaultImports: true,
            experimentalDecorators: true,
            paths: {
                "@/*": ["./app/*"]
            }
        },
        include: [
            "app/**/*",
            "*.js",
            "*.ts"
        ],
        exclude: [
            "node_modules",
            "dist",
            "out"
        ]
    };
    
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    return tsconfigPath;
}

module.exports = {
    isTypeScriptAvailable,
    generateServerActionTypes,
    typeCheckAtomFiles,
    createTSConfig,
    createJSConfig
};
