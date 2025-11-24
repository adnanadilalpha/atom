/**
 * ATOM Framework - SEO Analyzer
 * 
 * Analyzes SEO issues and provides recommendations
 */

class SEOAnalyzer {
  constructor() {
    this.issues = [];
    this.warnings = [];
  }

  /**
   * Analyze current page for SEO issues
   */
  analyze() {
    this.issues = [];
    this.warnings = [];

    if (typeof document === 'undefined') {
      return { issues: [], warnings: [] };
    }

    // Check for title
    const title = document.querySelector('title');
    if (!title || !title.textContent || title.textContent.trim().length === 0) {
      this.issues.push({
        type: 'missing-title',
        severity: 'error',
        message: 'Missing or empty <title> tag',
        suggestion: 'Add @Title directive to your page'
      });
    } else if (title.textContent.trim().length < 30) {
      this.warnings.push({
        type: 'short-title',
        severity: 'warning',
        message: 'Title is too short (< 30 characters)',
        suggestion: 'Aim for 50-60 characters for better SEO'
      });
    } else if (title.textContent.trim().length > 60) {
      this.warnings.push({
        type: 'long-title',
        severity: 'warning',
        message: 'Title is too long (> 60 characters)',
        suggestion: 'Keep titles under 60 characters for optimal display'
      });
    }

    // Check for meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc || !metaDesc.content || metaDesc.content.trim().length === 0) {
      this.issues.push({
        type: 'missing-description',
        severity: 'error',
        message: 'Missing or empty meta description',
        suggestion: 'Add @Description directive to your page'
      });
    } else if (metaDesc.content.trim().length < 120) {
      this.warnings.push({
        type: 'short-description',
        severity: 'warning',
        message: 'Meta description is too short (< 120 characters)',
        suggestion: 'Aim for 150-160 characters for better SEO'
      });
    } else if (metaDesc.content.trim().length > 160) {
      this.warnings.push({
        type: 'long-description',
        severity: 'warning',
        message: 'Meta description is too long (> 160 characters)',
        suggestion: 'Keep descriptions under 160 characters'
      });
    }

    // Check for h1 tag
    const h1 = document.querySelector('h1');
    if (!h1) {
      this.issues.push({
        type: 'missing-h1',
        severity: 'error',
        message: 'Missing <h1> tag',
        suggestion: 'Add an h1 tag to your page for better SEO'
      });
    } else {
      const h1Count = document.querySelectorAll('h1').length;
      if (h1Count > 1) {
        this.warnings.push({
          type: 'multiple-h1',
          severity: 'warning',
          message: `Multiple <h1> tags found (${h1Count})`,
          suggestion: 'Use only one h1 tag per page for better SEO'
        });
      }
    }

    // Check for images without alt text
    const images = document.querySelectorAll('img');
    let imagesWithoutAlt = 0;
    images.forEach(img => {
      if (!img.alt || img.alt.trim().length === 0) {
        imagesWithoutAlt++;
      }
    });
    if (imagesWithoutAlt > 0) {
      this.warnings.push({
        type: 'images-without-alt',
        severity: 'warning',
        message: `${imagesWithoutAlt} image(s) without alt text`,
        suggestion: 'Add alt attributes to all images for accessibility and SEO'
      });
    }

    // Check for lang attribute
    const html = document.documentElement;
    if (!html.lang) {
      this.warnings.push({
        type: 'missing-lang',
        severity: 'warning',
        message: 'Missing lang attribute on <html> tag',
        suggestion: 'Add lang="en" (or appropriate language) to <html> tag'
      });
    }

    // Check for viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      this.issues.push({
        type: 'missing-viewport',
        severity: 'error',
        message: 'Missing viewport meta tag',
        suggestion: 'Add viewport meta tag for mobile responsiveness'
      });
    }

    // Check for Open Graph tags (optional but recommended)
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      this.warnings.push({
        type: 'missing-og',
        severity: 'info',
        message: 'Missing Open Graph tags',
        suggestion: 'Add Open Graph meta tags for better social media sharing'
      });
    }

    return {
      issues: this.issues,
      warnings: this.warnings,
      score: this.calculateScore()
    };
  }

  /**
   * Calculate SEO score
   */
  calculateScore() {
    let score = 100;
    
    // Deduct points for errors
    score -= this.issues.length * 15;
    
    // Deduct points for warnings
    score -= this.warnings.filter(w => w.severity === 'warning').length * 5;
    
    return Math.max(0, Math.min(100, score));
  }
}

module.exports = SEOAnalyzer;
