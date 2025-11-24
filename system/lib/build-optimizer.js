/**
 * Build Optimizer for ATOM Framework
 * Provides bundle analysis and optimization suggestions
 */

const fs = require('fs');
const path = require('path');

/**
 * Analyze bundle size
 */
function analyzeBundle(distDir) {
    const clientPath = path.join(distDir, 'client.js');
    const serverPath = path.join(distDir, 'server.js');
    const ssrPath = path.join(distDir, 'ssr.js');
    
    const analysis = {
        client: { size: 0, exists: false },
        server: { size: 0, exists: false },
        ssr: { size: 0, exists: false },
        total: 0
    };
    
    [clientPath, serverPath, ssrPath].forEach((filePath, index) => {
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const sizeKB = Math.round(stats.size / 1024);
            const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            
            const key = ['client', 'server', 'ssr'][index];
            analysis[key] = {
                size: stats.size,
                sizeKB,
                sizeMB,
                exists: true,
                path: filePath
            };
            analysis.total += stats.size;
        }
    });
    
    analysis.totalKB = Math.round(analysis.total / 1024);
    analysis.totalMB = (analysis.total / (1024 * 1024)).toFixed(2);
    
    return analysis;
}

/**
 * Generate optimization report
 */
function generateOptimizationReport(analysis) {
    const warnings = [];
    const suggestions = [];
    
    // Check bundle sizes
    if (analysis.client.sizeKB > 500) {
        warnings.push(`Client bundle is large: ${analysis.client.sizeKB}KB`);
        suggestions.push('Consider code splitting or lazy loading');
    }
    
    if (analysis.server.sizeKB > 1000) {
        warnings.push(`Server bundle is large: ${analysis.server.sizeKB}KB`);
        suggestions.push('Review server-side dependencies');
    }
    
    if (analysis.totalKB > 2000) {
        warnings.push(`Total bundle size is large: ${analysis.totalKB}KB`);
        suggestions.push('Consider optimizing images and removing unused dependencies');
    }
    
    return {
        analysis,
        warnings,
        suggestions,
        score: calculateOptimizationScore(analysis)
    };
}

/**
 * Calculate optimization score (0-100)
 */
function calculateOptimizationScore(analysis) {
    let score = 100;
    
    // Deduct points for large bundles
    if (analysis.client.sizeKB > 500) score -= 20;
    if (analysis.client.sizeKB > 1000) score -= 20;
    
    if (analysis.server.sizeKB > 1000) score -= 15;
    if (analysis.server.sizeKB > 2000) score -= 15;
    
    if (analysis.totalKB > 2000) score -= 10;
    if (analysis.totalKB > 5000) score -= 10;
    
    return Math.max(0, score);
}

/**
 * Print optimization report
 */
function printOptimizationReport(report) {
    console.log('\n📊 Bundle Analysis Report\n');
    console.log('Bundle Sizes:');
    if (report.analysis.client.exists) {
        console.log(`  Client: ${report.analysis.client.sizeKB}KB (${report.analysis.client.sizeMB}MB)`);
    }
    if (report.analysis.server.exists) {
        console.log(`  Server: ${report.analysis.server.sizeKB}KB (${report.analysis.server.sizeMB}MB)`);
    }
    if (report.analysis.ssr.exists) {
        console.log(`  SSR: ${report.analysis.ssr.sizeKB}KB (${report.analysis.ssr.sizeMB}MB)`);
    }
    console.log(`  Total: ${report.analysis.totalKB}KB (${report.analysis.totalMB}MB)`);
    console.log(`\nOptimization Score: ${report.score}/100`);
    
    if (report.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        report.warnings.forEach(w => console.log(`  - ${w}`));
    }
    
    if (report.suggestions.length > 0) {
        console.log('\n💡 Suggestions:');
        report.suggestions.forEach(s => console.log(`  - ${s}`));
    }
    
    console.log('');
}

module.exports = {
    analyzeBundle,
    generateOptimizationReport,
    printOptimizationReport
};
