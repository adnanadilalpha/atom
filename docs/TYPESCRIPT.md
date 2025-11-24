# TypeScript Support

ATOM Framework has full TypeScript support. This guide covers how to use TypeScript in your ATOM applications.

## Overview

ATOM supports:
- **Type checking** for `.atom` files
- **Auto-generated types** for Server Actions
- **Type-safe props** and components
- **TypeScript configuration**

## Setup

### 1. Initialize TypeScript

```bash
atom init
```

This creates `tsconfig.json` with recommended settings.

### 2. Install TypeScript

```bash
npm install -D typescript @types/node
```

### 3. Type Check

```bash
atom typecheck
```

## Type Checking .atom Files

The framework can type-check `.atom` files:

```bash
atom typecheck
```

## Type Definitions

### Server Actions

Server Actions are automatically typed:

```atom
@Flow Actions {
  secure_getUser: async function(userId: number): Promise<User> {
    // TypeScript knows userId is number
    // Return type is Promise<User>
    return user;
  }
};
```

### Component Props

Type your component props:

```atom
// app/_components/Button.atom
@View {
  interface ButtonProps {
    children: string;
    onClick?: () => void;
    className?: string;
  }
  
  const { children, onClick, className }: ButtonProps = props || {};
  
  return button(children, {
    onclick: onClick,
    className
  });
}
```

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "jsx": "preserve",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["app/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Type Definitions for Framework

### Environment Variables

Create `env.d.ts`:

```typescript
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    JWT_SECRET: string;
    API_KEY?: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
```

### Database Types

```typescript
// types/db.ts
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at: Date;
}
```

### Server Action Types

```typescript
// types/actions.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
```

## Using Types in .atom Files

### Typed Server Actions

```atom
@Resource DB from './db';
@Resource User from './types/db';

@Flow Actions {
  secure_getUser: async function(userId: number): Promise<User> {
    const result = await DB.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0] as User;
  }
};
```

### Typed Components

```atom
// app/_components/UserCard.atom
@View {
  interface UserCardProps {
    user: {
      id: number;
      name: string;
      email: string;
    };
    onEdit?: (id: number) => void;
  }
  
  const { user, onEdit }: UserCardProps = props || {};
  
  return div([
    h3(user.name),
    p(user.email),
    onEdit && button("Edit", {
      onclick: () => onEdit(user.id)
    })
  ]);
}
```

## Type Safety Best Practices

### 1. Type All Server Actions

```atom
@Flow Actions {
  secure_createUser: async function(
    data: { name: string; email: string }
  ): Promise<User> {
    // TypeScript ensures correct types
    return user;
  }
};
```

### 2. Type Component Props

```atom
@View {
  interface Props {
    title: string;
    items: Array<{ id: number; name: string }>;
  }
  
  const { title, items }: Props = props || {};
  // ...
}
```

### 3. Use Type Assertions Carefully

```atom
// ✅ Good - When you're certain of type
const user = result.rows[0] as User;

// ❌ Bad - Unsafe assertion
const user = result.rows[0] as any;
```

## Next Steps

- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Database Guide](./DATABASE.md) - Database types
- [Authentication Guide](./AUTHENTICATION.md) - Auth types
