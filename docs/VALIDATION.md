# Input Validation Guide

ATOM Framework includes built-in validation utilities to help you validate and sanitize input data in Server Actions.

## Overview

The framework provides:
- **Validation utilities** - Validate input types, formats, and constraints
- **Sanitization utilities** - Clean and sanitize user input
- **Automatic sanitization** - Basic sanitization applied to all Server Action inputs
- **Error handling** - Clear validation error messages

## Using Validation

### Basic Validation

```atom
@Resource validate from '../system/lib/validation';

@Flow Actions {
  secure_createUser: async function(data) {
    // Validate required fields
    const email = validate.required(data.email, 'Email');
    const name = validate.required(data.name, 'Name');
    
    // Validate types and formats
    validate.isEmail(email, 'Email');
    validate.isString(name, 'Name');
    validate.minLength(name, 2, 'Name');
    
    // Use validated data
    // ...
  }
};
```

### Schema Validation

```atom
@Resource validate from '../system/lib/validation';

@Flow Actions {
  secure_createUser: async function(data) {
    const schema = {
      email: (value) => {
        validate.required(value, 'Email');
        return validate.isEmail(value, 'Email');
      },
      name: (value) => {
        validate.required(value, 'Name');
        validate.isString(value, 'Name');
        return validate.minLength(value, 2, 'Name');
      },
      age: (value) => {
        validate.isNumber(value, 'Age');
        return validate.min(value, 18, 'Age');
      }
    };
    
    const validated = validate.validate(data, schema);
    // Use validated data
  }
};
```

## Available Validators

### Type Validators

```atom
validate.required(value, 'Field Name')
validate.isString(value, 'Field Name')
validate.isNumber(value, 'Field Name')
validate.isArray(value, 'Field Name')
validate.isObject(value, 'Field Name')
```

### String Validators

```atom
validate.minLength(value, 5, 'Field Name')
validate.maxLength(value, 100, 'Field Name')
validate.matches(value, /pattern/, 'Error message', 'Field Name')
```

### Number Validators

```atom
validate.min(value, 0, 'Field Name')
validate.max(value, 100, 'Field Name')
```

### Format Validators

```atom
validate.isEmail(value, 'Email')
validate.isURL(value, 'URL')
```

### Array Validators

```atom
validate.arrayMinLength(value, 1, 'Field Name')
validate.arrayMaxLength(value, 10, 'Field Name')
```

### Choice Validators

```atom
validate.oneOf(value, ['option1', 'option2'], 'Field Name')
```

## Using Sanitization

### Basic Sanitization

```atom
@Resource sanitize from '../system/lib/sanitize';

@Flow Actions {
  secure_saveContent: async function(data) {
    // Sanitize HTML content
    const cleanHTML = sanitize.sanitizeHTML(data.content, {
      allowedTags: ['p', 'br', 'strong', 'em'],
      stripTags: false
    });
    
    // Sanitize string
    const cleanString = sanitize.sanitizeString(data.title, {
      maxLength: 100,
      removeHTML: true
    });
    
    // Sanitize object recursively
    const cleanData = sanitize.sanitizeObject(data);
    
    // Use sanitized data
  }
};
```

## Automatic Sanitization

The framework automatically sanitizes all Server Action inputs:

- HTML tags are stripped by default
- String length is limited
- Dangerous patterns are removed

You can still add additional validation and sanitization as needed.

## Best Practices

### 1. Always Validate Required Fields

```atom
secure_createUser: async function(data) {
  const email = validate.required(data.email, 'Email');
  const password = validate.required(data.password, 'Password');
  // ...
}
```

### 2. Validate Types

```atom
const id = validate.isNumber(data.id, 'ID');
const name = validate.isString(data.name, 'Name');
```

### 3. Validate Formats

```atom
const email = validate.isEmail(data.email, 'Email');
const url = validate.isURL(data.url, 'URL');
```

### 4. Validate Constraints

```atom
const password = validate.minLength(data.password, 8, 'Password');
const age = validate.min(data.age, 18, 'Age');
```

### 5. Sanitize User Content

```atom
const content = sanitize.sanitizeHTML(data.content);
const title = sanitize.sanitizeString(data.title);
```

## Error Handling

Validation errors throw clear error messages:

```atom
try {
  const validated = validate.validate(data, schema);
} catch (error) {
  // error.message contains clear validation error
  throw new Error(`Validation failed: ${error.message}`);
}
```

## Examples

### User Registration

```atom
@Resource validate from '../system/lib/validation';
@Resource sanitize from '../system/lib/sanitize';
@Resource DB from './db';

@Flow Actions {
  secure_register: async function(data) {
    // Validate
    const email = validate.isEmail(
      validate.required(data.email, 'Email'),
      'Email'
    );
    const password = validate.minLength(
      validate.required(data.password, 'Password'),
      8,
      'Password'
    );
    const name = validate.minLength(
      validate.required(data.name, 'Name'),
      2,
      'Name'
    );
    
    // Sanitize
    const cleanEmail = sanitize.sanitizeEmail(email);
    const cleanName = sanitize.sanitizeString(name, { maxLength: 100 });
    
    // Check if user exists
    const existing = await DB.query(
      'SELECT id FROM users WHERE email = $1',
      [cleanEmail]
    );
    
    if (existing.rows.length > 0) {
      throw new Error('User already exists');
    }
    
    // Create user
    // ...
  }
};
```

### Form Submission

```atom
@Resource validate from '../system/lib/validation';
@Resource sanitize from '../system/lib/sanitize';

@Flow Actions {
  secure_submitForm: async function(data) {
    const schema = {
      name: (v) => validate.minLength(
        validate.isString(
          validate.required(v, 'Name'),
          'Name'
        ),
        2,
        'Name'
      ),
      email: (v) => validate.isEmail(
        validate.required(v, 'Email'),
        'Email'
      ),
      message: (v) => validate.maxLength(
        validate.isString(
          validate.required(v, 'Message'),
          'Message'
        ),
        1000,
        'Message'
      )
    };
    
    const validated = validate.validate(data, schema);
    const sanitized = sanitize.sanitizeObject(validated);
    
    // Process form
    return { success: true };
  }
};
```

## Next Steps

- [Security Guide](./SECURITY.md) - Security best practices
- [Server Actions](./API_REFERENCE.md#server-actions) - Complete Server Actions reference
- [Forms Guide](./FORMS.md) - Form handling with validation
