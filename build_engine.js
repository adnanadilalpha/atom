const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');
const { execSync } = require('child_process');
const esbuild = require('esbuild-wasm'); 

console.log("🔒 STARTING SECURITY PROTOCOL (V36 - Embedded Tailwind)...");

const SYSTEM_DIR = path.join(__dirname, 'system');
const LOCKED_DIR = path.join(__dirname, 'system_locked');

if (fs.existsSync(LOCKED_DIR)) {
    fs.rmSync(LOCKED_DIR, { recursive: true, force: true });
}
fs.mkdirSync(LOCKED_DIR);

// --- CONFIG 1: HIGH SECURITY ---
const highSecurityOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.8,
    target: 'node',
    splitStrings: false, 
    stringArray: true,
    stringArrayThreshold: 0.8,
    reservedStrings: [ 'fs', 'path', 'child_process', 'esbuild-wasm' ]
};

// --- CONFIG 2: SAFE MODE ---
const safeSecurityOptions = {
    compact: false, 
    controlFlowFlattening: false, 
    renameProperties: false,      
    splitStrings: false,          
    stringArray: false,           
    target: 'node',
    disableConsoleOutput: false,
};

const entryPoints = ['cli.js', 'compiler.js', 'runner.js'];

(async () => {
    for (const file of entryPoints) {
        console.log(`   -> 📦 Bundling: ${file}`);
        
        const bundleResult = await esbuild.build({
            entryPoints: [path.join(SYSTEM_DIR, file)],
            bundle: true,
            platform: 'node',
            format: 'cjs',
            write: false, 
            // FIX: REMOVED CSS TOOLS FROM EXTERNAL LIST
            // They will now be bundled INSIDE the binary.
            external: [
                'esbuild-wasm', 'marked', 'express', 'body-parser', 'cors', 'dotenv',
                'fs', 'path', 'child_process', '@babel/*'
            ]
        });

        const bundledCode = bundleResult.outputFiles[0].text;

        let options = highSecurityOptions;
        if (file === 'runner.js') {
             console.log(`      🛡️  Safe Mode: ${file}`);
             options = safeSecurityOptions;
        } else {
             console.log(`      🛡️  Encrypting: ${file}`);
        }

        const obfuscationResult = JavaScriptObfuscator.obfuscate(bundledCode, options);
        fs.writeFileSync(path.join(LOCKED_DIR, file), obfuscationResult.getObfuscatedCode());
    }

    console.log("📦 Packaging Binary...");
    try {
        execSync('pkg system_locked/cli.js --config package.json --targets node18-macos-arm64 --output atom-engine --public', { stdio: 'inherit' });
        console.log("✅ SECURE BINARY CREATED: atom-engine");
    } catch (e) {
        console.error("❌ Packaging Failed");
    }
})();