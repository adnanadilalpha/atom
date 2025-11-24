# Security Best Practices

ATOM Framework provides built-in security features, but you should follow these best practices to build secure applications.

## Overview

Security considerations:
- **Input Validation** - Validate all user input
- **SQL Injection Prevention** - Use parameterized queries
- **XSS Prevention** - Sanitize output
- **Authentication** - Secure user authentication
- **Authorization** - Protect routes and resources
- **HTTPS** - Always use HTTPS in production
- **Secrets Management** - Secure environment variables

## Input Validation

### Always Validate Input

```atom
@Flow Actions {
  secure_createUser: async function(data) {
    // ✅ Validate input
    if (!data.email || typeof data.email !== 'string') {
      throw new Error('Email is required');
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('Invalid email format');
    }
    
    if (!data.password || data.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    
    // Process if valid
    return { success: true };
  }
};
```

### Sanitize User Input

```javascript
const sanitize = require('sanitize-html');

@Flow Actions {
  secure_saveContent: async function(data) {
    // Sanitize HTML content
    const sanitized = sanitize(data.content, {
      allowedTags: ['p', 'br', 'strong', 'em'],
      allowedAttributes: {}
    });
    
    // Save sanitized content
    return { success: true };
  }
};
```

## SQL Injection Prevention

### Always Use Parameterized Queries

```atom
// ✅ Good - Parameterized query
secure_getUser: async function(userId) {
  const result = await DB.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0];
}

// ❌ Bad - SQL injection vulnerability
secure_getUser: async function(userId) {
  const result = await DB.query(
    `SELECT * FROM users WHERE id = ${userId}`
  );
  return result.rows[0];
}
```

## XSS Prevention

### Escape Output

```atom
@View {
  const userInput = props.userInput;
  
  // ✅ Good - Framework automatically escapes
  return div(userInput);
  
  // ❌ Bad - Never use innerHTML with user input
  // return div(null, { innerHTML: userInput });
}
```

### Sanitize HTML

```atom
@Resource sanitize from 'sanitize-html';

@Flow Actions {
  secure_savePost: async function(data) {
    const sanitized = sanitize(data.content);
    // Save sanitized content
  }
};
```

## Authentication Security

### Hash Passwords

```javascript
const bcrypt = require('bcryptjs');

// ✅ Good - Hash passwords
const password_hash = await bcrypt.hash(password, 10);

// ❌ Bad - Never store plain text
// const password_hash = password;
```

### Use Strong JWT Secrets

```bash
# ✅ Good - Long, random secret
JWT_SECRET=$(openssl rand -base64 32)

# ❌ Bad - Weak secret
JWT_SECRET=secret123
```

### Set Secure Cookie Options

```javascript
res.cookie('token', token, {
  httpOnly: true,        // Prevent XSS
  secure: true,          // HTTPS only
  sameSite: 'strict',    // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000
});
```

## Authorization

### Protect Routes

```atom
// app/_middleware.atom
@Flow Middleware {
  handler: async function(req, res, next) {
    // Check authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token && req.path.startsWith('/admin')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    // Verify token and check permissions
    // ...
    
    next();
  }
};
```

### Role-Based Access Control

```atom
@Flow Actions {
  secure_deletePost: async function(postId) {
    // Check user role
    if (req.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    
    // Delete post
    await DB.query('DELETE FROM posts WHERE id = $1', [postId]);
    return { success: true };
  }
};
```

## HTTPS

Always use HTTPS in production:

```bash
# Production environment
NODE_ENV=production
# Framework automatically uses HTTPS when available
```

## Secrets Management

### Never Commit Secrets

Add to `.gitignore`:

```
.env
.env.local
.env*.local
*.key
*.pem
```

### Use Environment Variables

```bash
# ✅ Good - Use environment variables
JWT_SECRET=your-secret-key

# ❌ Bad - Hardcode secrets
const JWT_SECRET = 'secret123';
```

### Rotate Secrets

Change secrets regularly, especially:
- After security incidents
- When team members leave
- Periodically (every 90 days)

## Rate Limiting

Prevent brute force attacks:

```atom
@Flow Actions {
  secure_login: async function(credentials) {
    // Check rate limit
    const attempts = await checkRateLimit(credentials.email);
    if (attempts > 5) {
      throw new Error('Too many attempts. Please try again later.');
    }
    
    // ... login logic
  }
};
```

## CORS Configuration

Configure CORS properly:

```atom
// app/_middleware.atom
@Flow Middleware {
  handler: async function(req, res, next) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    next();
  }
};
```

## Content Security Policy

Set CSP headers:

```atom
@Flow Middleware {
  handler: async function(req, res, next) {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    );
    next();
  }
};
```

## Best Practices Summary

1. ✅ **Always validate input** - Never trust user input
2. ✅ **Use parameterized queries** - Prevent SQL injection
3. ✅ **Hash passwords** - Never store plain text
4. ✅ **Use HTTPS** - Encrypt data in transit
5. ✅ **Set secure cookies** - httpOnly, secure, sameSite
6. ✅ **Rotate secrets** - Change secrets regularly
7. ✅ **Implement rate limiting** - Prevent brute force
8. ✅ **Sanitize output** - Prevent XSS
9. ✅ **Check authorization** - Verify permissions
10. ✅ **Keep dependencies updated** - Patch vulnerabilities

## Security Checklist

- [ ] All user input validated
- [ ] Passwords hashed (bcrypt)
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (output escaping)
- [ ] HTTPS enabled in production
- [ ] Secrets in environment variables
- [ ] Rate limiting implemented
- [ ] CORS configured properly
- [ ] Authentication required for protected routes
- [ ] Authorization checks in place
- [ ] Dependencies up to date
- [ ] Error messages don't leak sensitive info

## Next Steps

- [Authentication Guide](./AUTHENTICATION.md) - Secure authentication
- [Database Guide](./DATABASE.md) - Secure database practices
- [Production Guide](./PRODUCTION.md) - Production security
