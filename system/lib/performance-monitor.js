/**
 * ATOM Framework - Performance Monitor
 * 
 * Tracks performance metrics and provides insights
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoad: null,
      firstContentfulPaint: null,
      largestContentfulPaint: null,
      timeToInteractive: null,
      totalBlockingTime: null,
      cumulativeLayoutShift: null,
      serverResponseTime: null,
      bundleSize: null,
      routeCount: 0,
      componentCount: 0
    };
    
    this.observers = [];
    this.startTime = performance.now();
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    if (typeof window === 'undefined' || !window.performance) return;
    
    // Measure page load
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        this.metrics.pageLoad = perfData.loadEventEnd - perfData.fetchStart;
        this.metrics.serverResponseTime = perfData.responseEnd - perfData.requestStart;
      }
    });

    // Measure FCP (First Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.firstContentfulPaint = entry.startTime;
            }
          });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(fcpObserver);
      } catch (e) {
        // PerformanceObserver not supported
      }

      // Measure LCP (Largest Contentful Paint)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        // LCP not supported
      }

      // Measure CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          this.metrics.cumulativeLayoutShift = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        // CLS not supported
      }
    }
  }

  /**
   * Get performance score
   */
  getScore() {
    let score = 100;
    const issues = [];

    // FCP should be < 1.8s
    if (this.metrics.firstContentfulPaint > 1800) {
      score -= 10;
      issues.push('First Contentful Paint is slow (>1.8s)');
    }

    // LCP should be < 2.5s
    if (this.metrics.largestContentfulPaint > 2500) {
      score -= 15;
      issues.push('Largest Contentful Paint is slow (>2.5s)');
    }

    // CLS should be < 0.1
    if (this.metrics.cumulativeLayoutShift > 0.1) {
      score -= 10;
      issues.push('Cumulative Layout Shift is high (>0.1)');
    }

    // Page load should be < 3s
    if (this.metrics.pageLoad > 3000) {
      score -= 15;
      issues.push('Page load time is slow (>3s)');
    }

    // Bundle size check
    if (this.metrics.bundleSize > 500000) { // 500KB
      score -= 10;
      issues.push('Bundle size is large (>500KB)');
    }

    return {
      score: Math.max(0, score),
      issues,
      grade: score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : 'D'
    };
  }

  /**
   * Get performance insights
   */
  getInsights() {
    const insights = [];
    
    if (this.metrics.firstContentfulPaint > 1800) {
      insights.push({
        type: 'slow-fcp',
        severity: 'warning',
        message: 'First Contentful Paint is slow',
        suggestion: 'Consider code splitting, optimize images, or use @Stream directive'
      });
    }

    if (this.metrics.largestContentfulPaint > 2500) {
      insights.push({
        type: 'slow-lcp',
        severity: 'error',
        message: 'Largest Contentful Paint is slow',
        suggestion: 'Optimize images, reduce JavaScript execution time, or preload critical resources'
      });
    }

    if (this.metrics.cumulativeLayoutShift > 0.1) {
      insights.push({
        type: 'high-cls',
        severity: 'warning',
        message: 'High Cumulative Layout Shift',
        suggestion: 'Set explicit dimensions for images and avoid inserting content above existing content'
      });
    }

    if (this.metrics.bundleSize > 500000) {
      insights.push({
        type: 'large-bundle',
        severity: 'warning',
        message: 'Bundle size is large',
        suggestion: 'Enable code splitting, remove unused dependencies, or use dynamic imports'
      });
    }

    return insights;
  }

  /**
   * Cleanup observers
   */
  cleanup() {
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (e) {
        // Ignore
      }
    });
    this.observers = [];
  }

  /**
   * Get all metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      score: this.getScore(),
      insights: this.getInsights()
    };
  }
}

module.exports = PerformanceMonitor;
