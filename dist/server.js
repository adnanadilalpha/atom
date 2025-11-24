// SERVER API LOGIC

exports.Middleware = { // This runs on EVERY request to the server
    handler: async function(req, res, next) {
      console.log(`[Middleware] Incoming Request: ${req.method} ${req.path}`);
      
      // Simple Auth Check Simulation
      if (req.path.startsWith('/admin')) {
          // In real life, check cookies here
          console.log("🛡️ Checking Admin Access...");
      }
      
      // Continue to page
      next();
    } };

exports._api_health_API = { GET: async function() {
      return { 
          status: "Healthy", 
          server_time: new Date().toISOString(),
          engine: "ATOM V38"
      };
    } };

exports._api_products_API = { GET: async function() {
    return [
      { id: 1, name: "Product A", price: 100 },
      { id: 2, name: "Product B", price: 200 }
    ];
  } };

exports._api_stats_API = { GET: async function() {
    return {
      users: 1000,
      visits: 5000,
      revenue: 25000
    };
  } };
exports._blog__id__secure_getPost = async function (id) {
  // Simulate DB fetch
  await new Promise(r => setTimeout(r, 300));

  // Validation
  if (!id || isNaN(parseInt(id))) {
    throw new Error("Invalid post ID");
  }
  const posts = {
    "1": {
      title: "Introducing ATOM V53",
      content: "This is the full content of the article about ATOM V53. It includes details about the new compiler, nested layouts, and improved performance...",
      date: "Oct 12, 2024",
      author: "Alex Developer"
    },
    "2": {
      title: "Why We Built Our Own Compiler",
      content: "Building a compiler from scratch wasn't easy, but it was necessary. We needed granular control over code splitting and optimization...",
      date: "Oct 08, 2024",
      author: "Mike Engineer"
    },
    "3": {
      title: "Nested Layouts Guide",
      content: "Nested layouts allow you to build complex UIs with ease. Simply place a _layout.atom file in any directory...",
      date: "Sep 28, 2024",
      author: "Sarah Designer"
    },
    "4": {
      title: "Edge Runtime Support",
      content: "Deploying to the edge brings your app closer to users. With ATOM V53, it's as simple as adding a directive...",
      date: "Sep 15, 2024",
      author: "Alex Developer"
    }
  };
  const post = posts[id];
  if (!post) throw new Error(`Post with ID ${id} not found`);
  return {
    id,
    ...post
  };
};
exports._blog_secure_getPosts = async function () {
  // Simulate DB fetch
  await new Promise(r => setTimeout(r, 200));
  return [{
    id: 1,
    title: "Introducing ATOM V53",
    excerpt: "The fastest framework just got faster. Learn about the new compiler optimizations.",
    date: "Oct 12, 2024",
    author: "Alex Developer",
    category: "News"
  }, {
    id: 2,
    title: "Why We Built Our Own Compiler",
    excerpt: "Standard tools weren't cutting it. Here's how we achieved sub-millisecond builds.",
    date: "Oct 08, 2024",
    author: "Mike Engineer",
    category: "Engineering"
  }, {
    id: 3,
    title: "Nested Layouts Guide",
    excerpt: "A deep dive into the new routing system and how to structure complex apps.",
    date: "Sep 28, 2024",
    author: "Sarah Designer",
    category: "Tutorial"
  }, {
    id: 4,
    title: "Edge Runtime Support",
    excerpt: "Deploy your ATOM apps to the edge with zero configuration.",
    date: "Sep 15, 2024",
    author: "Alex Developer",
    category: "Features"
  }];
};
exports._contact_secure_submitContact = async function (data) {
  // Comprehensive Input Validation
  if (!data.name || typeof data.name !== 'string') {
    throw new Error("Name is required and must be a string");
  }
  if (data.name.length < 2) {
    throw new Error("Name must be at least 2 characters long");
  }
  if (data.name.length > 100) {
    throw new Error("Name must be less than 100 characters");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    throw new Error("Invalid email format");
  }
  if (!data.message || data.message.trim().length < 10) {
    throw new Error("Message must be at least 10 characters long");
  }

  // Simulate processing delay
  await new Promise(r => setTimeout(r, 1000));
  return {
    success: true,
    id: Math.random().toString(36).substr(2, 9)
  };
};
exports._dashboard_home_secure_getStats = async function () {
  await new Promise(r => setTimeout(r, 500));
  return {
    users: 12543,
    revenue: 45230,
    growth: 12.5,
    active: 892
  };
};
exports._error_tests_secure_throwError = async function () {
  throw new Error("This is a manually triggered server error.");
};
exports._error_tests_secure_validateInput = async function (data) {
  if (!data || data.length < 5) {
    throw new Error("Input too short (min 5 chars)");
  }
  return {
    success: true
  };
};
const DB = require('../app/db');
exports._products_secure_getProducts = async function (query) {
  // Input Validation
  if (query && typeof query === 'string' && query.length > 50) {
    throw new Error("Search query too long (max 50 chars)");
  }

  // Mock Database Data
  const allProducts = [{
    id: 1,
    title: "Atom Compiler",
    price: "$0.00",
    description: "The core engine that powers everything. Blazing fast builds.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80"
  }, {
    id: 2,
    title: "DevTools Pro",
    price: "$49.00",
    description: "Advanced debugging and performance profiling suite.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80"
  }, {
    id: 3,
    title: "Cloud Deploy",
    price: "$19/mo",
    description: "One-click deployment to edge networks globally.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80"
  }, {
    id: 4,
    title: "UI Kit",
    price: "$29.00",
    description: "Beautiful, accessible components for your next project.",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&q=80"
  }, {
    id: 5,
    title: "Database Connector",
    price: "$39.00",
    description: "Secure, type-safe database access with zero config.",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80"
  }, {
    id: 6,
    title: "Auth Module",
    price: "$0.00",
    description: "Complete authentication system with OAuth support.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"
  }];

  // Simulate network latency
  await new Promise(r => setTimeout(r, 300));

  // Ensure we always return an array
  let result;
  if (query && typeof query === 'string' && query.trim()) {
    const lowerQuery = query.toLowerCase();
    result = allProducts.filter(p => p.title.toLowerCase().includes(lowerQuery) || p.description.toLowerCase().includes(lowerQuery));
  } else {
    result = allProducts;
  }

  // Defensive: Always return an array
  return Array.isArray(result) ? result : [];
};
exports._test_suite_secure_testLogin = async function (credentials) {
  console.log('[TEST] Login attempt:', credentials);

  // Import validation and sanitization
  const validate = require('../system/lib/validation');
  const sanitize = require('../system/lib/sanitize');

  // Validate input
  const email = validate.isEmail(validate.required(credentials?.email, 'Email'), 'Email');
  const password = validate.required(credentials?.password, 'Password');

  // Sanitize
  const cleanEmail = sanitize.sanitizeEmail(email);

  // Mock database check (in real app, use actual DB)
  const mockUsers = [{
    id: 1,
    email: "test@example.com",
    password: "password123",
    name: "Test User"
  }, {
    id: 2,
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User"
  }];
  const user = mockUsers.find(u => u.email === cleanEmail && u.password === password);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Generate mock JWT token
  const token = `mock_jwt_${user.id}_${Date.now()}`;
  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  };
};
exports._test_suite_secure_testRegister = async function (userData) {
  console.log('[TEST] Registration attempt:', userData);

  // Import validation and sanitization
  const validate = require('../system/lib/validation');
  const sanitize = require('../system/lib/sanitize');

  // Comprehensive validation
  const email = validate.isEmail(validate.required(userData?.email, 'Email'), 'Email');
  const password = validate.minLength(validate.required(userData?.password, 'Password'), 8, 'Password');
  const name = validate.minLength(validate.required(userData?.name, 'Name'), 2, 'Name');

  // Sanitize all inputs
  const cleanEmail = sanitize.sanitizeEmail(email);
  const cleanName = sanitize.sanitizeString(name, {
    maxLength: 100
  });

  // Check if user exists (mock)
  const existingUsers = ["test@example.com", "admin@example.com"];
  if (existingUsers.includes(cleanEmail)) {
    throw new Error('User already exists');
  }

  // Create user (mock)
  const newUser = {
    id: Date.now(),
    email: cleanEmail,
    name: cleanName,
    createdAt: new Date().toISOString()
  };
  return {
    success: true,
    user: newUser,
    message: 'User registered successfully'
  };
};
exports._test_suite_secure_testGetCurrentUser = async function (token) {
  if (!token) {
    throw new Error('No token provided');
  }

  // Mock token validation
  const userId = token.split('_')[2];
  if (!userId) {
    throw new Error('Invalid token');
  }
  return {
    id: parseInt(userId),
    email: "test@example.com",
    name: "Test User"
  };
};
exports._test_suite_secure_testCreateRecord = async function (data) {
  console.log('[TEST] Create record:', data);

  // Import validation and sanitization
  const validate = require('../system/lib/validation');
  const sanitize = require('../system/lib/sanitize');

  // Validate
  const title = validate.required(data?.title, 'Title');
  const content = validate.required(data?.content, 'Content');

  // Sanitize
  const cleanTitle = sanitize.sanitizeString(title, {
    maxLength: 200
  });
  const cleanContent = sanitize.sanitizeHTML(content, {
    allowedTags: ['p', 'br', 'strong', 'em'],
    stripTags: false
  });

  // Mock database insert
  const record = {
    id: Date.now(),
    title: cleanTitle,
    content: cleanContent,
    createdAt: new Date().toISOString()
  };
  return {
    success: true,
    record
  };
};
exports._test_suite_secure_testGetRecords = async function (params) {
  console.log('[TEST] Get records:', params);

  // Import validation
  const validate = require('../system/lib/validation');

  // Validate pagination
  const page = params?.page ? validate.isNumber(params.page, 'Page') : 1;
  const limit = params?.limit ? validate.min(validate.isNumber(params.limit, 'Limit'), 1, 'Limit') : 10;

  // Mock database query
  const mockRecords = Array.from({
    length: 25
  }, (_, i) => ({
    id: i + 1,
    title: `Record ${i + 1}`,
    content: `Content for record ${i + 1}`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString()
  }));
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = mockRecords.slice(start, end);
  return {
    records: paginated,
    pagination: {
      page,
      limit,
      total: mockRecords.length,
      totalPages: Math.ceil(mockRecords.length / limit)
    }
  };
};
exports._test_suite_secure_testUpdateRecord = async function (data) {
  console.log('[TEST] Update record:', data);

  // Import validation and sanitization
  const validate = require('../system/lib/validation');
  const sanitize = require('../system/lib/sanitize');

  // Validate
  const id = validate.isNumber(validate.required(data?.id, 'ID'), 'ID');
  const title = data?.title ? validate.required(data.title, 'Title') : null;
  const content = data?.content ? validate.required(data.content, 'Content') : null;
  if (!title && !content) {
    throw new Error('At least one field (title or content) must be provided');
  }

  // Sanitize
  const updates = {};
  if (title) updates.title = sanitize.sanitizeString(title, {
    maxLength: 200
  });
  if (content) updates.content = sanitize.sanitizeHTML(content);

  // Mock database update
  return {
    success: true,
    id,
    updates,
    updatedAt: new Date().toISOString()
  };
};
exports._test_suite_secure_testDeleteRecord = async function (id) {
  console.log('[TEST] Delete record:', id, 'Type:', typeof id);

  // Import validation
  const validate = require('../system/lib/validation');

  // Validate - isNumber now handles both numbers and numeric strings
  const recordId = validate.isNumber(validate.required(id, 'ID'), 'ID');

  // Mock database delete
  return {
    success: true,
    id: recordId,
    deletedAt: new Date().toISOString()
  };
};
exports._test_suite_secure_testValidation = async function (data) {
  console.log('[TEST] Validation test:', data);

  // Import validation
  const validate = require('../system/lib/validation');

  // Test all validation types
  const schema = {
    email: v => validate.isEmail(validate.required(v, 'Email'), 'Email'),
    name: v => validate.minLength(validate.isString(validate.required(v, 'Name'), 'Name'), 2, 'Name'),
    age: v => validate.min(validate.isNumber(v, 'Age'), 18, 'Age'),
    url: v => validate.isURL(v, 'URL'),
    tags: v => validate.arrayMinLength(validate.isArray(v, 'Tags'), 1, 'Tags')
  };
  const validated = validate.validate(data, schema);
  return {
    success: true,
    validated,
    message: 'All validations passed'
  };
};
exports._test_suite_secure_testSanitization = async function (data) {
  console.log('[TEST] Sanitization test:', data);

  // Import sanitization
  const sanitize = require('../system/lib/sanitize');

  // Test sanitization
  const sanitized = {
    html: sanitize.sanitizeHTML(data.html || '', {
      allowedTags: ['p', 'br', 'strong', 'em']
    }),
    string: sanitize.sanitizeString(data.string || '', {
      maxLength: 100,
      removeHTML: true
    }),
    email: sanitize.sanitizeEmail(data.email || ''),
    url: sanitize.sanitizeURL(data.url || ''),
    object: sanitize.sanitizeObject(data.object || {})
  };
  return {
    success: true,
    original: data,
    sanitized,
    message: 'Sanitization completed'
  };
};
exports._test_suite_secure_testErrorHandling = async function (type) {
  console.log('[TEST] Error handling test:', type);
  switch (type) {
    case 'validation':
      throw new Error('Validation error: Invalid input');
    case 'database':
      throw new Error('Database error: Connection failed');
    case 'permission':
      throw new Error('Permission error: Access denied');
    case 'notfound':
      throw new Error('Not found: Resource does not exist');
    default:
      throw new Error('Unknown error type');
  }
};
exports._test_suite_secure_testPerformance = async function (iterations = 100) {
  console.log('[TEST] Performance test:', iterations);
  const start = Date.now();
  const results = [];

  // Simulate database operations
  for (let i = 0; i < iterations; i++) {
    results.push({
      id: i,
      data: `Item ${i}`,
      processed: true
    });
  }
  const duration = Date.now() - start;
  const averageTime = duration / iterations;
  return {
    success: true,
    iterations,
    duration,
    averageTime,
    results: results.slice(0, 10) // Return first 10
  };
};
exports._test_suite_secure_testFileUpload = async function (fileData) {
  console.log('[TEST] File upload test:', fileData);

  // Import sanitization
  const sanitize = require('../system/lib/sanitize');

  // Validate
  if (!fileData || !fileData.name) {
    throw new Error('File data is required');
  }

  // Sanitize filename
  const cleanName = sanitize.sanitizeString(fileData.name, {
    maxLength: 255,
    removeHTML: true
  });

  // Mock file save
  return {
    success: true,
    file: {
      id: Date.now(),
      name: cleanName,
      size: fileData.size || 0,
      type: fileData.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString()
    }
  };
};
exports._test_suite_secure_testWebSocket = async function (message) {
  console.log('[TEST] WebSocket test:', message);

  // In a real implementation, this would broadcast via WebSocket
  // For now, just return success
  return {
    success: true,
    message: 'WebSocket message would be broadcast here',
    timestamp: new Date().toISOString()
  };
};

const APIRoutes = [];
APIRoutes.push({ path: '/api/health', handler: exports._api_health_API });
APIRoutes.push({ path: '/api/products', handler: exports._api_products_API });
APIRoutes.push({ path: '/api/stats', handler: exports._api_stats_API });

exports.APIRoutes = APIRoutes;
