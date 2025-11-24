/**
 * ATOM Framework Test Runner
 * Provides testing utilities for ATOM applications
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Find and run test files
 */
function findTestFiles(appDir) {
    const testFiles = [];
    
    function walkDir(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                walkDir(filePath);
            } else if (file.match(/\.(test|spec)\.(atom|js|ts)$/)) {
                testFiles.push(filePath);
            }
        });
    }
    
    if (fs.existsSync(appDir)) {
        walkDir(appDir);
    }
    
    return testFiles;
}

/**
 * Run tests using a test framework
 */
function runTests(testFramework = 'auto') {
    const testFiles = findTestFiles(path.join(process.cwd(), 'app'));
    
    if (testFiles.length === 0) {
        console.log('⚠️  No test files found');
        return { success: true, message: 'No tests to run' };
    }
    
    // Auto-detect test framework
    if (testFramework === 'auto') {
        const packageJson = JSON.parse(
            fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
        );
        
        if (packageJson.dependencies?.vitest || packageJson.devDependencies?.vitest) {
            testFramework = 'vitest';
        } else if (packageJson.dependencies?.jest || packageJson.devDependencies?.jest) {
            testFramework = 'jest';
        } else {
            console.log('⚠️  No test framework detected. Install vitest or jest.');
            return { success: false, message: 'No test framework found' };
        }
    }
    
    try {
        if (testFramework === 'vitest') {
            const vitestPath = require.resolve('vitest');
            execSync(`node "${vitestPath}" run`, { 
                stdio: 'inherit',
                cwd: process.cwd() 
            });
        } else if (testFramework === 'jest') {
            const jestPath = require.resolve('jest/bin/jest');
            execSync(`node "${jestPath}"`, { 
                stdio: 'inherit',
                cwd: process.cwd() 
            });
        }
        return { success: true, message: 'Tests passed' };
    } catch (e) {
        return { success: false, message: 'Tests failed', error: e.message };
    }
}

/**
 * Create test template
 */
function createTestTemplate(testName, type = 'component') {
    if (type === 'component') {
        return `// Test for ${testName}
// Install a test framework: npm install -D vitest

import { describe, it, expect } from 'vitest';

describe('${testName}', () => {
  it('should render correctly', () => {
    // Add your test here
    expect(true).toBe(true);
  });
});
`;
    } else if (type === 'server-action') {
        return `// Test for Server Action: ${testName}
import { describe, it, expect } from 'vitest';

describe('${testName}', () => {
  it('should handle valid input', async () => {
    // Test your Server Action here
    // const result = await Actions.secure_${testName}({ ... });
    // expect(result).toBeDefined();
  });
  
  it('should reject invalid input', async () => {
    // Test error handling
  });
});
`;
    }
}

module.exports = {
    findTestFiles,
    runTests,
    createTestTemplate
};
