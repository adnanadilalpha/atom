/**
 * ATOM Framework - Error Detection System
 * 
 * Detects common errors and provides helpful messages
 */

const fs = require('fs');
const path = require('path');

class ErrorDetector {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.importedModules = new Set();
    this.usedClasses = new Set();
  }

  /**
   * Check for missing imports/libraries
   */
  checkMissingImports(code, filePath) {
    // Check for @Resource imports
    const resourceRegex = /@Resource\s+\w+\s+from\s+['"]([^'"]+)['"]/g;
    const resourceMatches = [...code.matchAll(resourceRegex)];
    
    resourceMatches.forEach(match => {
      const importPath = match[1];
      
      // Check if it's a relative path that exists
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const fileDir = path.dirname(filePath);
        const resolvedPath = path.resolve(fileDir, importPath);
        
        // Try with .js extension
        const jsPath = resolvedPath.endsWith('.js') ? resolvedPath : resolvedPath + '.js';
        // Try with .atom extension
        const atomPath = resolvedPath.endsWith('.atom') ? resolvedPath : resolvedPath + '.atom';
        
        if (!fs.existsSync(jsPath) && !fs.existsSync(atomPath) && !fs.existsSync(resolvedPath)) {
          this.errors.push({
            type: 'missing-resource',
            file: filePath,
            message: `Missing resource file: "${importPath}"`,
            suggestion: `Check that the file exists at: ${resolvedPath}`,
            line: this.getLineNumber(code, match.index)
          });
        }
      }
    });
    
    // Check for regular imports/requires (only in @Flow Actions blocks)
    const flowBlock = code.match(/@Flow\s+Actions\s+{([^}]+)}/s);
    if (flowBlock) {
      const flowCode = flowBlock[1];
      const importRegex = /(?:import|require)\(?['"]([^'"]+)['"]\)?/g;
      const matches = [...flowCode.matchAll(importRegex)];
      
      matches.forEach(match => {
        const importPath = match[1];
        
        // Skip relative imports (handled by bundler)
        if (importPath.startsWith('./') || importPath.startsWith('../')) {
          return;
        }
        
        // Check if it's an npm package
        if (!importPath.startsWith('@') && !importPath.includes('/')) {
          // Simple package name
          const packagePath = path.join(process.cwd(), 'node_modules', importPath);
          if (!fs.existsSync(packagePath)) {
            this.errors.push({
              type: 'missing-library',
              file: filePath,
              message: `Missing library: "${importPath}"`,
              suggestion: `Run: npm install ${importPath}`,
              line: this.getLineNumber(code, match.index)
            });
          }
        } else if (importPath.startsWith('@')) {
          // Scoped package
          const parts = importPath.split('/');
          const packageName = parts.slice(0, 2).join('/');
          const packagePath = path.join(process.cwd(), 'node_modules', packageName);
          if (!fs.existsSync(packagePath)) {
            this.errors.push({
              type: 'missing-library',
              file: filePath,
              message: `Missing scoped library: "${packageName}"`,
              suggestion: `Run: npm install ${packageName}`,
              line: this.getLineNumber(code, match.index)
            });
          }
        }
      });
    }
  }

  /**
   * Check for invalid Tailwind classes
   * Only check for obvious errors, don't validate against Tailwind config
   */
  checkTailwindClasses(code, filePath) {
    // Common Tailwind class patterns
    const classNameRegex = /className\s*[:=]\s*['"`]([^'"`]+)['"`]/g;
    const matches = [...code.matchAll(classNameRegex)];
    
    matches.forEach(match => {
      const classString = match[1];
      const classes = classString.split(/\s+/).filter(c => c.trim() && c.length > 0);
      
      classes.forEach(className => {
        // Skip template literals and variables
        if (className.includes('${') || className.includes('`')) {
          return;
        }
        
        // Only check for obvious syntax errors, not class validity
        // Check for incomplete classes (ends with dash but not a valid modifier)
        if (className.endsWith('-') && className.length > 1 && !['sm-', 'md-', 'lg-', 'xl-', '2xl-'].includes(className)) {
          this.warnings.push({
            type: 'incomplete-class',
            file: filePath,
            message: `Incomplete class: "${className}"`,
            suggestion: 'Class appears to be cut off. Did you mean to add a modifier?',
            line: this.getLineNumber(code, match.index)
          });
        }
        
        // Only check for very obvious typos (British spelling)
        const commonTypos = {
          'flex-colum': 'flex-col',
          'justify-centre': 'justify-center',
          'items-centre': 'items-center',
          'text-centre': 'text-center'
        };
        
        if (commonTypos[className]) {
          this.warnings.push({
            type: 'possible-typo',
            file: filePath,
            message: `Possible typo: "${className}"`,
            suggestion: `Did you mean "${commonTypos[className]}"?`,
            line: this.getLineNumber(code, match.index)
          });
        }
      });
    });
  }

  /**
   * Check for incomplete CSS
   * Only check actual CSS blocks, not JavaScript code
   */
  checkIncompleteCSS(code, filePath) {
    // Only check inside @Style blocks or <style> tags
    const styleBlockRegex = /@Style\s*{([^}]+)}/g;
    const htmlStyleRegex = /<style[^>]*>([^<]+)<\/style>/gi;
    
    // Check @Style blocks
    let styleMatch;
    while ((styleMatch = styleBlockRegex.exec(code)) !== null) {
      const cssContent = styleMatch[1];
      this.checkCSSContent(cssContent, filePath, this.getLineNumber(code, styleMatch.index));
    }
    
    // Check <style> tags
    let htmlStyleMatch;
    while ((htmlStyleMatch = htmlStyleRegex.exec(code)) !== null) {
      const cssContent = htmlStyleMatch[1];
      this.checkCSSContent(cssContent, filePath, this.getLineNumber(code, htmlStyleMatch.index));
    }
    
    // Check for unclosed style blocks
    const styleOpenRegex = /<style[^>]*>/gi;
    const styleCloseRegex = /<\/style>/gi;
    const styleMatches = [...code.matchAll(styleOpenRegex)];
    const closeMatches = [...code.matchAll(styleCloseRegex)];
    
    if (styleMatches.length !== closeMatches.length) {
      this.errors.push({
        type: 'unclosed-style',
        file: filePath,
        message: 'Unclosed <style> tag detected',
        suggestion: 'Ensure all <style> tags are properly closed',
        line: styleMatches.length > 0 ? this.getLineNumber(code, styleMatches[0].index) : null
      });
    }
  }
  
  /**
   * Check CSS content for errors (only called on actual CSS)
   */
  checkCSSContent(cssContent, filePath, baseLine) {
    // Check for incomplete CSS rules (only in actual CSS)
    const cssRuleRegex = /([a-zA-Z-]+)\s*:\s*([^;{]+)(?![;{])/g;
    const cssMatches = [...cssContent.matchAll(cssRuleRegex)];
    
    cssMatches.forEach(match => {
      const property = match[1].trim();
      const value = match[2].trim();
      
      // Only warn if it's clearly incomplete CSS (not a valid CSS value)
      if (value && !value.endsWith(';') && !value.endsWith('}') && !value.includes('{')) {
        // Check if it looks like incomplete CSS (not a valid CSS value pattern)
        const validCSSValuePattern = /^([a-zA-Z0-9%#().,\s-]+|calc\(|var\(|url\(|rgba?\(|hsla?\(|#[0-9a-fA-F]{3,6})$/;
        if (!validCSSValuePattern.test(value) && value.length > 0 && value.length < 50) {
          this.warnings.push({
            type: 'incomplete-css',
            file: filePath,
            message: `Possible incomplete CSS: "${property}: ${value}"`,
            suggestion: 'Ensure CSS properties end with semicolon',
            line: baseLine + this.getLineNumber(cssContent, match.index)
          });
        }
      }
    });
  }

  /**
   * Check for common syntax errors
   */
  checkSyntaxErrors(code, filePath) {
    // Check for unclosed strings
    const singleQuoteRegex = /'[^']*$/gm;
    const doubleQuoteRegex = /"[^"]*$/gm;
    
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      const singleQuotes = (line.match(/'/g) || []).length;
      const doubleQuotes = (line.match(/"/g) || []).length;
      
      // Simple check: odd number of quotes might indicate unclosed string
      // But skip if it's in a comment or template literal
      if (!line.trim().startsWith('//') && !line.includes('`')) {
        if (singleQuotes % 2 !== 0 && !line.includes("'")) {
          this.warnings.push({
            type: 'possible-unclosed-string',
            file: filePath,
            message: 'Possible unclosed string (single quotes)',
            suggestion: 'Check for missing closing quote',
            line: index + 1
          });
        }
      }
    });
  }

  /**
   * Check for missing @View blocks
   */
  checkMissingView(code, filePath, fileName) {
    if (!fileName.includes('+server.atom') && !fileName.includes('_middleware.atom')) {
      if (!code.includes('@View')) {
        this.errors.push({
          type: 'missing-view',
          file: filePath,
          message: 'Missing @View block',
          suggestion: 'Add @View { ... } to define page content',
          line: null
        });
      }
    }
  }

  /**
   * Get line number from index
   */
  getLineNumber(code, index) {
    return code.substring(0, index).split('\n').length;
  }

  /**
   * Analyze a file
   */
  analyzeFile(filePath) {
    try {
      const code = fs.readFileSync(filePath, 'utf-8');
      const fileName = path.basename(filePath);
      
      this.checkMissingImports(code, filePath);
      this.checkTailwindClasses(code, filePath);
      this.checkIncompleteCSS(code, filePath);
      this.checkSyntaxErrors(code, filePath);
      this.checkMissingView(code, filePath, fileName);
    } catch (error) {
      this.errors.push({
        type: 'file-read-error',
        file: filePath,
        message: `Cannot read file: ${error.message}`,
        suggestion: 'Check file permissions',
        line: null
      });
    }
  }

  /**
   * Get all errors and warnings
   */
  getReport() {
    return {
      errors: this.errors,
      warnings: this.warnings,
      errorCount: this.errors.length,
      warningCount: this.warnings.length
    };
  }

  /**
   * Clear all errors and warnings
   */
  clear() {
    this.errors = [];
    this.warnings = [];
  }
}

module.exports = ErrorDetector;
