/**
 * ATOM Framework - Input Validation Utilities
 * 
 * Provides built-in validation helpers for Server Actions
 */

/**
 * Validates that a value is not null/undefined
 */
function required(value, fieldName = 'Field') {
  if (value === null || value === undefined || value === '') {
    throw new Error(`${fieldName} is required`);
  }
  return value;
}

/**
 * Validates that a value is a string
 */
function isString(value, fieldName = 'Field') {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  return value;
}

/**
 * Validates that a value is a number (accepts both numbers and numeric strings)
 */
function isNumber(value, fieldName = 'Field') {
  // Handle null/undefined
  if (value === null || value === undefined) {
    throw new Error(`${fieldName} must be a number`);
  }
  
  // If it's already a number, validate it's not NaN
  if (typeof value === 'number') {
    if (isNaN(value)) {
      throw new Error(`${fieldName} must be a valid number`);
    }
    return value;
  }
  
  // If it's a string, try to convert it
  if (typeof value === 'string') {
    const num = Number(value);
    if (isNaN(num) || value.trim() === '') {
      throw new Error(`${fieldName} must be a number`);
    }
    return num;
  }
  
  // Otherwise, it's not a number
  throw new Error(`${fieldName} must be a number`);
}

/**
 * Validates that a value is an array
 */
function isArray(value, fieldName = 'Field') {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  return value;
}

/**
 * Validates that a value is an object
 */
function isObject(value, fieldName = 'Field') {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${fieldName} must be an object`);
  }
  return value;
}

/**
 * Validates string length
 */
function minLength(value, min, fieldName = 'Field') {
  if (typeof value === 'string' && value.length < min) {
    throw new Error(`${fieldName} must be at least ${min} characters`);
  }
  return value;
}

function maxLength(value, max, fieldName = 'Field') {
  if (typeof value === 'string' && value.length > max) {
    throw new Error(`${fieldName} must be no more than ${max} characters`);
  }
  return value;
}

/**
 * Validates email format
 */
function isEmail(value, fieldName = 'Email') {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof value !== 'string' || !emailRegex.test(value)) {
    throw new Error(`${fieldName} must be a valid email address`);
  }
  return value;
}

/**
 * Validates URL format
 */
function isURL(value, fieldName = 'URL') {
  try {
    new URL(value);
    return value;
  } catch {
    throw new Error(`${fieldName} must be a valid URL`);
  }
}

/**
 * Validates number range
 */
function min(value, minVal, fieldName = 'Field') {
  if (typeof value === 'number' && value < minVal) {
    throw new Error(`${fieldName} must be at least ${minVal}`);
  }
  return value;
}

function max(value, maxVal, fieldName = 'Field') {
  if (typeof value === 'number' && value > maxVal) {
    throw new Error(`${fieldName} must be no more than ${maxVal}`);
  }
  return value;
}

/**
 * Validates against a pattern (regex)
 */
function matches(value, pattern, message, fieldName = 'Field') {
  if (typeof value !== 'string' || !pattern.test(value)) {
    throw new Error(message || `${fieldName} format is invalid`);
  }
  return value;
}

/**
 * Validates that value is one of the allowed values
 */
function oneOf(value, allowedValues, fieldName = 'Field') {
  if (!allowedValues.includes(value)) {
    throw new Error(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }
  return value;
}

/**
 * Validates array length
 */
function arrayMinLength(value, min, fieldName = 'Field') {
  if (!Array.isArray(value) || value.length < min) {
    throw new Error(`${fieldName} must contain at least ${min} items`);
  }
  return value;
}

function arrayMaxLength(value, max, fieldName = 'Field') {
  if (!Array.isArray(value) || value.length > max) {
    throw new Error(`${fieldName} must contain no more than ${max} items`);
  }
  return value;
}

/**
 * Validates nested object structure
 */
function validateObject(data, schema, prefix = '') {
  const errors = [];
  const validated = {};
  
  for (const [key, validator] of Object.entries(schema)) {
    const fieldName = prefix ? `${prefix}.${key}` : key;
    const value = data[key];
    
    try {
      if (typeof validator === 'function') {
        validated[key] = validator(value, fieldName);
      } else if (typeof validator === 'object' && validator !== null) {
        // Nested validation
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          validated[key] = validateObject(value, validator, fieldName);
        } else {
          errors.push(`${fieldName} must be an object`);
        }
      }
    } catch (error) {
      errors.push(error.message);
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join('; ')}`);
  }
  
  return validated;
}

/**
 * Validates data against a schema
 */
function validate(data, schema) {
  if (typeof schema === 'function') {
    // Simple validator function
    return schema(data);
  } else if (typeof schema === 'object' && schema !== null) {
    // Schema object
    return validateObject(data, schema);
  }
  throw new Error('Invalid validation schema');
}

module.exports = {
  required,
  isString,
  isNumber,
  isArray,
  isObject,
  minLength,
  maxLength,
  isEmail,
  isURL,
  min,
  max,
  matches,
  oneOf,
  arrayMinLength,
  arrayMaxLength,
  validate,
  validateObject
};
