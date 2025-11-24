# Data Fetching

ATOM Framework provides multiple ways to fetch data: Server Actions, API Routes, and client-side fetching. This guide covers all data fetching patterns.

## Overview

ATOM supports:
- **Server Actions** - Direct server function calls (recommended)
- **API Routes** - RESTful endpoints
- **Client-side Fetching** - Standard `fetch()` API
- **SSR Data Fetching** - Server-side data loading
- **Static Data** - Pre-rendered at build time

## Server Actions (Recommended)

Server Actions are the recommended way to fetch data in ATOM. They provide type safety, zero boilerplate, and automatic error handling.

### Basic Data Fetching

```atom
@Flow Actions {
  secure_getPosts: async function() {
    // Fetch from database
    const result = await DB.query('SELECT * FROM posts ORDER BY created_at DESC');
    return result.rows;
  }
};

@View {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    Actions.secure_getPosts()
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);
  
  if (loading) return div("Loading...");
  
  return div(
    posts.map(post => 
      div([
        h2(post.title),
        p(post.content)
      ])
    )
  );
}
```

### Fetching with Parameters

```atom
@Flow Actions {
  secure_getPost: async function(postId) {
    const result = await DB.query(
      'SELECT * FROM posts WHERE id = $1',
      [postId]
    );
    return result.rows[0];
  }
};

@View {
  const { id } = props.params;
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    if (id) {
      Actions.secure_getPost(id).then(setPost);
    }
  }, [id]);
  
  if (!post) return div("Loading...");
  
  return div([
    h1(post.title),
    div(post.content)
  ]);
}
```

### Request Deduplication

Prevent duplicate requests:

```atom
@View {
  const [data, setData] = useState(null);
  const loadingRef = useRef(false);
  
  useEffect(() => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    Actions.secure_getData()
      .then(setData)
      .finally(() => {
        loadingRef.current = false;
      });
  }, []);
}
```

## API Routes

Create RESTful API endpoints:

### GET Endpoint

```atom
// app/api/posts/+server.atom
@Flow Actions {
  GET: async function() {
    const result = await DB.query('SELECT * FROM posts');
    return { posts: result.rows };
  }
};
```

### POST Endpoint

```atom
// app/api/posts/+server.atom
@Flow Actions {
  POST: async function(data) {
    const result = await DB.query(
      'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *',
      [data.title, data.content]
    );
    return { post: result.rows[0] };
  }
};
```

### Using API Routes

```atom
@View {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data.posts));
  }, []);
  
  return div(posts.map(post => div(post.title)));
}
```

## Client-Side Fetching

Use standard `fetch()` for external APIs:

```atom
@View {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  return data ? div(JSON.stringify(data)) : div("Loading...");
}
```

## SSR Data Fetching

Fetch data on the server during SSR:

```atom
@Flow Actions {
  secure_getInitialData: async function() {
    // This runs on the server during SSR
    const result = await DB.query('SELECT * FROM posts LIMIT 10');
    return result.rows;
  }
};

@View {
  // Data can be passed via props from SSR
  const [posts, setPosts] = useState(props.initialData || []);
  
  // Or fetch on client if not provided
  useEffect(() => {
    if (posts.length === 0) {
      Actions.secure_getInitialData().then(setPosts);
    }
  }, []);
  
  return div(posts.map(post => div(post.title)));
}
```

## Static Data (SSG)

Pre-render data at build time:

```atom
@Static
@Flow Actions {
  secure_getStaticData: async function() {
    // This runs at build time
    const result = await DB.query('SELECT * FROM posts');
    return result.rows;
  }
};

@View {
  // Data is embedded in the static HTML
  const posts = props.staticData || [];
  
  return div(posts.map(post => div(post.title)));
}
```

## Incremental Static Regeneration (ISR)

Revalidate static pages:

```atom
@Revalidate 60  // Revalidate every 60 seconds
@Flow Actions {
  secure_getPosts: async function() {
    const result = await DB.query('SELECT * FROM posts');
    return result.rows;
  }
};

@View {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    Actions.secure_getPosts().then(setPosts);
  }, []);
  
  return div(posts.map(post => div(post.title)));
}
```

## Error Handling

Always handle errors:

```atom
@View {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    Actions.secure_getData()
      .then(setData)
      .catch(err => {
        setError(err.message);
        console.error('Fetch error:', err);
      })
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return div("Loading...");
  if (error) return div(`Error: ${error}`);
  if (!data) return div("No data");
  
  return div(JSON.stringify(data));
}
```

## Loading States

Show loading indicators:

```atom
@View {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    Actions.secure_getData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);
  
  return loading ? 
    LoadingSpinner() : 
    div(JSON.stringify(data));
}
```

## Caching

### Client-Side Caching

```atom
@View {
  const [data, setData] = useState(null);
  const cacheRef = useRef(null);
  
  useEffect(() => {
    if (cacheRef.current) {
      setData(cacheRef.current);
      return;
    }
    
    Actions.secure_getData()
      .then(result => {
        cacheRef.current = result;
        setData(result);
      });
  }, []);
}
```

### Server-Side Caching

```atom
@Flow Actions {
  secure_getCachedData: async function() {
    // Check cache
    const cached = await getFromCache('key');
    if (cached) return cached;
    
    // Fetch fresh data
    const data = await fetchData();
    
    // Cache it
    await setCache('key', data, 3600); // 1 hour
    
    return data;
  }
};
```

## Best Practices

### 1. Use Server Actions for Database Queries

```atom
// ✅ Good - Server Action
Actions.secure_getPosts()

// ❌ Avoid - Direct client-side DB access
// Not possible - DB is server-only
```

### 2. Handle Loading and Error States

```atom
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### 3. Prevent Duplicate Requests

```atom
const loadingRef = useRef(false);

useEffect(() => {
  if (loadingRef.current) return;
  loadingRef.current = true;
  // ... fetch
});
```

### 4. Clean Up on Unmount

```atom
useEffect(() => {
  let cancelled = false;
  
  Actions.secure_getData()
    .then(data => {
      if (!cancelled) setData(data);
    });
  
  return () => {
    cancelled = true;
  };
}, []);
```

## Examples

- [Products Page](../app/products.atom) - Data fetching with search
- [Blog Page](../app/blog.atom) - List and detail fetching
- [Database Example](../examples/database-example.atom) - Database queries

## Next Steps

- [Database Guide](./DATABASE.md) - Database setup and queries
- [Server Actions](./API_REFERENCE.md#server-actions) - Complete Server Actions reference
- [API Routes](./API_REFERENCE.md#api-routes) - RESTful endpoints
