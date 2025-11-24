# Authentication

ATOM Framework provides flexible authentication through Server Actions and middleware. This guide covers various authentication patterns and best practices.

## Overview

ATOM supports multiple authentication strategies:
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Session-based** - Server-side sessions
- **OAuth** - Third-party authentication (Google, GitHub, etc.)
- **API Keys** - For API authentication

## JWT Authentication

JWT is the recommended approach for stateless authentication in ATOM.

### Setup

Install dependencies:

```bash
npm install jsonwebtoken bcryptjs
```

### 1. Create Authentication Server Actions

Create `app/_actions/auth.js`:

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const DB = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

async function secure_login(credentials) {
  const { email, password } = credentials;
  
  // Validate input
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  // Find user
  const result = await DB.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  
  if (result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }
  
  const user = result.rows[0];
  
  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }
  
  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  // Return user (without password)
  const { password_hash, ...userWithoutPassword } = user;
  
  return { token, user: userWithoutPassword };
}

async function secure_register(userData) {
  const { email, password, name } = userData;
  
  // Validate input
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  // Check if user exists
  const existing = await DB.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );
  
  if (existing.rows.length > 0) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const password_hash = await bcrypt.hash(password, 10);
  
  // Create user
  const result = await DB.query(
    'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
    [email, password_hash, name]
  );
  
  const user = result.rows[0];
  
  // Generate token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  return { token, user };
}

async function secure_getCurrentUser(token) {
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await DB.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    return result.rows[0];
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

async function secure_logout(token) {
  // JWT is stateless, so logout is handled client-side
  // For token blacklisting, use Redis or database
  return { success: true };
}

module.exports = {
  secure_login,
  secure_register,
  secure_getCurrentUser,
  secure_logout
};
```

### 2. Use in Pages

```atom
// app/login.atom
import { secure_login } from './_actions/auth';

@Flow Actions {
  secure_login: secure_login
};

@View {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await Actions.secure_login({ email, password });
      
      // Store token
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Redirect
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return form([
    h1("Login", { className: "text-2xl font-bold mb-4" }),
    
    error && div(error, { 
      className: "text-red-500 mb-4 p-2 bg-red-50 rounded" 
    }),
    
    input(null, {
      type: "email",
      value: email,
      placeholder: "Email",
      oninput: (e) => setEmail(e.target.value),
      className: "w-full p-2 border rounded mb-2"
    }),
    
    input(null, {
      type: "password",
      value: password,
      placeholder: "Password",
      oninput: (e) => setPassword(e.target.value),
      className: "w-full p-2 border rounded mb-4"
    }),
    
    button(loading ? "Logging in..." : "Login", {
      onclick: handleLogin,
      disabled: loading,
      className: "w-full py-2 bg-blue-600 text-white rounded font-bold"
    })
  ], { onsubmit: (e) => { e.preventDefault(); handleLogin(); } });
}
```

### 3. Protected Routes

Create a middleware or use a hook:

```atom
// app/dashboard/home.atom
import { secure_getCurrentUser } from './_actions/auth';

@Flow Actions {
  secure_getCurrentUser: secure_getCurrentUser
};

@View {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    Actions.secure_getCurrentUser(token)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) {
    return div("Loading...", { className: "flex justify-center p-20" });
  }
  
  if (!user) {
    return null; // Will redirect
  }
  
  return div([
    h1(`Welcome, ${user.name}!`, { className: "text-3xl font-bold mb-4" }),
    p(`Email: ${user.email}`, { className: "text-gray-600" })
  ]);
}
```

## Session-Based Authentication

For server-side sessions, use cookies:

### 1. Install Session Library

```bash
npm install express-session
```

### 2. Configure Sessions in Middleware

```atom
// app/_middleware.atom
@Resource session from 'express-session';
@Resource DB from './db';

@Flow Middleware {
  handler: async function(req, res, next) {
    // Session middleware setup
    if (!req.session) {
      // Initialize session
    }
    next();
  }
};
```

### 3. Use Sessions in Server Actions

```atom
@Flow Actions {
  secure_login: async function(credentials) {
    // ... verify credentials
    
    // Set session
    req.session.userId = user.id;
    req.session.email = user.email;
    
    return { success: true, user };
  },
  
  secure_getCurrentUser: async function() {
    if (!req.session || !req.session.userId) {
      throw new Error('Not authenticated');
    }
    
    const result = await DB.query(
      'SELECT * FROM users WHERE id = $1',
      [req.session.userId]
    );
    
    return result.rows[0];
  }
};
```

## OAuth Authentication

### Google OAuth Example

```bash
npm install passport passport-google-oauth20
```

```atom
@Resource passport from 'passport';
@Resource GoogleStrategy from 'passport-google-oauth20';

@Flow Actions {
  secure_googleAuth: async function() {
    // OAuth flow
    // Redirect to Google
    // Handle callback
  }
};
```

## API Key Authentication

For API endpoints:

```atom
// app/api/data/+server.atom
@Flow Actions {
  GET: async function(req) {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== process.env.API_KEY) {
      throw new Error('Invalid API key');
    }
    
    return { data: "Protected data" };
  }
};
```

## Middleware Authentication

Protect routes at the middleware level:

```atom
// app/_middleware.atom
@Flow Middleware {
  handler: async function(req, res, next) {
    // Check authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token && req.path.startsWith('/dashboard')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    // Verify token
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
      } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }
    }
    
    next();
  }
};
```

## Password Security

Always hash passwords:

```javascript
const bcrypt = require('bcryptjs');

// Hash password
const password_hash = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, password_hash);
```

## Environment Variables

```bash
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
SESSION_SECRET=your-session-secret
```

## Best Practices

### 1. Always Hash Passwords

```javascript
// ✅ Good
const hash = await bcrypt.hash(password, 10);

// ❌ Bad
// Never store plain text passwords
```

### 2. Use HTTPS in Production

Always use HTTPS to protect tokens and credentials in transit.

### 3. Set Secure Cookie Options

```javascript
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

### 4. Validate Input

```atom
secure_login: async function(credentials) {
  const { email, password } = credentials;
  
  // Validate
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email');
  }
  
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  
  // ... rest of logic
}
```

### 5. Rate Limiting

Implement rate limiting to prevent brute force attacks:

```atom
@Flow Actions {
  secure_login: async function(credentials) {
    // Check rate limit
    const attempts = await checkRateLimit(credentials.email);
    if (attempts > 5) {
      throw new Error('Too many login attempts. Please try again later.');
    }
    
    // ... login logic
  }
};
```

## Examples

See [Authentication Example](../examples/auth-example.atom) for a complete working example.

## Next Steps

- [Database Guide](./DATABASE.md) - Database setup for user storage
- [Middleware](./API_REFERENCE.md#middleware) - Route protection
- [Server Actions](./API_REFERENCE.md#server-actions) - Complete Server Actions reference
