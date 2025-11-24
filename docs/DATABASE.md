# Database Integration

ATOM Framework provides flexible database integration through the `@Resource` directive and Server Actions. This guide covers how to connect to and work with databases in your ATOM applications.

## Overview

ATOM Framework supports any Node.js-compatible database library. You can use:
- **PostgreSQL** (via `pg` or `postgres`)
- **MySQL** (via `mysql2`)
- **MongoDB** (via `mongodb` or `mongoose`)
- **SQLite** (via `better-sqlite3`)
- **Prisma** (ORM)
- **Drizzle** (ORM)
- **Any other Node.js database library**

## Setting Up a Database

### 1. Install Database Driver

Choose your database and install the appropriate driver:

```bash
# PostgreSQL
npm install pg

# MySQL
npm install mysql2

# MongoDB
npm install mongodb

# SQLite
npm install better-sqlite3

# Prisma (ORM)
npm install @prisma/client
npm install -D prisma
```

### 2. Create Database Connection

Create `app/db.js`:

#### PostgreSQL Example

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool: pool
};
```

#### MySQL Example

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  query: async (text, params) => {
    const [rows] = await pool.execute(text, params);
    return { rows };
  },
  pool: pool
};
```

#### MongoDB Example

```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db(process.env.DB_NAME);
  }
  return db;
}

module.exports = {
  connect,
  getDb: () => db || connect(),
  client
};
```

#### Prisma Example

```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
```

### 3. Environment Variables

Create `.env`:

```bash
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=mydb

# MongoDB
MONGODB_URI=mongodb://localhost:27017
DB_NAME=mydb
```

## Using Database in Server Actions

### Basic Query

```atom
@Resource DB from './db';

@Flow Actions {
  secure_getUsers: async function() {
    const result = await DB.query('SELECT * FROM users LIMIT 10');
    return result.rows;
  }
};
```

### Parameterized Queries (Prevent SQL Injection)

```atom
@Resource DB from './db';

@Flow Actions {
  secure_getUser: async function(userId) {
    // ✅ Safe - uses parameterized query
    const result = await DB.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0];
  },
  
  secure_createUser: async function(data) {
    // ✅ Safe - parameterized query
    const result = await DB.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [data.name, data.email]
    );
    return result.rows[0];
  }
};
```

### Transactions

```atom
@Resource DB from './db';

@Flow Actions {
  secure_transferFunds: async function({ fromId, toId, amount }) {
    const client = await DB.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Deduct from sender
      await client.query(
        'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
        [amount, fromId]
      );
      
      // Add to receiver
      await client.query(
        'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
        [amount, toId]
      );
      
      await client.query('COMMIT');
      return { success: true };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};
```

## Using Prisma ORM

### Setup Prisma

```bash
npx prisma init
```

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}
```

Generate Prisma Client:

```bash
npx prisma generate
npx prisma migrate dev
```

### Use Prisma in Server Actions

```atom
@Resource DB from './db';

@Flow Actions {
  secure_getUsers: async function() {
    return await DB.user.findMany({
      include: { posts: true }
    });
  },
  
  secure_createUser: async function(data) {
    return await DB.user.create({
      data: {
        email: data.email,
        name: data.name
      }
    });
  },
  
  secure_getUserWithPosts: async function(userId) {
    return await DB.user.findUnique({
      where: { id: userId },
      include: { posts: true }
    });
  }
};
```

## Using MongoDB

```atom
@Resource DB from './db';

@Flow Actions {
  secure_getUsers: async function() {
    const db = await DB.getDb();
    return await db.collection('users').find({}).toArray();
  },
  
  secure_createUser: async function(data) {
    const db = await DB.getDb();
    const result = await db.collection('users').insertOne(data);
    return await db.collection('users').findOne({ _id: result.insertedId });
  },
  
  secure_updateUser: async function(userId, data) {
    const db = await DB.getDb();
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: data }
    );
    return await db.collection('users').findOne({ _id: new ObjectId(userId) });
  }
};
```

## Connection Pooling

For production, always use connection pooling:

### PostgreSQL Pooling

```javascript
// app/db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### MySQL Pooling

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  // ... other config
});
```

## Error Handling

Always handle database errors properly:

```atom
@Resource DB from './db';

@Flow Actions {
  secure_getUser: async function(userId) {
    try {
      const result = await DB.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      
      return result.rows[0];
    } catch (error) {
      // Log error for debugging
      console.error('Database error:', error);
      
      // Return user-friendly error
      throw new Error('Failed to fetch user');
    }
  }
};
```

## Best Practices

### 1. Always Use Parameterized Queries

```atom
// ✅ Good - Prevents SQL injection
await DB.query('SELECT * FROM users WHERE id = $1', [userId]);

// ❌ Bad - Vulnerable to SQL injection
await DB.query(`SELECT * FROM users WHERE id = ${userId}`);
```

### 2. Handle Connection Errors

```javascript
// app/db.js
pool.on('error', (err) => {
  console.error('Database pool error:', err);
  // Implement retry logic or alerting
});
```

### 3. Use Transactions for Related Operations

```atom
// ✅ Good - Use transactions for related operations
secure_transferFunds: async function({ fromId, toId, amount }) {
  const client = await DB.getClient();
  try {
    await client.query('BEGIN');
    // ... multiple operations
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

### 4. Close Connections Properly

```javascript
// In production, ensure connections are closed
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
```

### 5. Use Connection Pooling

Always use connection pooling in production to manage database connections efficiently.

## Migration Tools

### Prisma Migrations

```bash
# Create migration
npx prisma migrate dev --name add_users_table

# Apply migrations
npx prisma migrate deploy
```

### Raw SQL Migrations

Create `migrations/` folder and use a migration tool like `node-pg-migrate`:

```bash
npm install node-pg-migrate
```

## Examples

See [Database Example](../examples/database-example.atom) for a complete working example.

## Next Steps

- [Authentication Guide](./AUTHENTICATION.md) - User authentication with databases
- [Server Actions](./API_REFERENCE.md#server-actions) - Complete Server Actions reference
- [Production Guide](./PRODUCTION.md) - Production database configuration
