/**
 * ATOM Framework - Input Sanitization Utilities
 * 
 * Provides built-in sanitization helpers for preventing XSS and other attacks
 */

/**
 * Sanitizes HTML content to prevent XSS
 * Basic implementation - for production, use a library like sanitize-html
 */
function sanitizeHTML(html, options = {}) {
  if (typeof html !== 'string') {
    return '';
  }
  
  const {
    allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'],
    allowedAttributes = { a: ['href', 'title'] },
    stripTags = false
  } = options;
  
  if (stripTags) {
    // Remove all HTML tags
    return html.replace(/<[^>]*>/g, '');
  }
  
  // Basic sanitization - remove script tags and dangerous attributes
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:text\/html/gi, ''); // Remove data URIs with HTML
  
  // For production, recommend using sanitize-html library
  // This is a basic implementation
  return sanitized;
}

/**
 * Escapes HTML special characters
 */
function escapeHTML(str) {
  if (typeof str !== 'string') {
    return String(str);
  }
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return str.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Sanitizes a string by removing potentially dangerous content
 */
function sanitizeString(str, options = {}) {
  if (typeof str !== 'string') {
    return '';
  }
  
  const {
    maxLength = 10000,
    trim = true,
    removeNewlines = false,
    removeHTML = true
  } = options;
  
  let sanitized = str;
  
  if (removeHTML) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }
  
  if (removeNewlines) {
    sanitized = sanitized.replace(/\n/g, ' ').replace(/\r/g, '');
  }
  
  if (trim) {
    sanitized = sanitized.trim();
  }
  
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Sanitizes an object recursively
 */
function sanitizeObject(obj, options = {}) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj !== 'object') {
    return sanitizeString(String(obj), options);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, options));
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Sanitize key
    const safeKey = sanitizeString(key, { maxLength: 100, removeHTML: true });
    
    // Sanitize value
    if (typeof value === 'string') {
      sanitized[safeKey] = sanitizeString(value, options);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[safeKey] = sanitizeObject(value, options);
    } else {
      sanitized[safeKey] = value;
    }
  }
  
  return sanitized;
}

/**
 * Sanitizes SQL injection patterns (basic - use parameterized queries!)
 */
function sanitizeSQL(str) {
  if (typeof str !== 'string') {
    return '';
  }
  
  // This is a basic check - ALWAYS use parameterized queries!
  // This is just an additional safety layer
  return str
    .replace(/['";]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
}

/**
 * Sanitizes URL to prevent javascript: and data: protocols
 */
function sanitizeURL(url) {
  if (typeof url !== 'string') {
    return '';
  }
  
  try {
    const parsed = new URL(url);
    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    
    if (!allowedProtocols.includes(parsed.protocol)) {
      return '';
    }
    
    return url;
  } catch {
    return '';
  }
}

/**
 * Sanitizes email address
 */
function sanitizeEmail(email) {
  if (typeof email !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters
  return email
    .trim()
    .toLowerCase()
    .replace(/[<>\"']/g, '')
    .substring(0, 254); // Max email length
}

module.exports = {
  sanitizeHTML,
  escapeHTML,
  sanitizeString,
  sanitizeObject,
  sanitizeSQL,
  sanitizeURL,
  sanitizeEmail
};
