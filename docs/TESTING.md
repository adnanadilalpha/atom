# Testing

ATOM Framework supports testing with Vitest, Jest, and other testing frameworks. This guide covers how to test your ATOM applications.

## Overview

ATOM supports:
- **Component Testing** - Test `.atom` components
- **Server Action Testing** - Test server functions
- **Integration Testing** - Test full page flows
- **E2E Testing** - End-to-end testing

## Setup

### Vitest (Recommended)

```bash
npm install -D vitest @testing-library/dom
```

Create `vitest.config.js`:

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true
  }
});
```

### Jest

```bash
npm install -D jest @testing-library/dom jest-environment-jsdom
```

Create `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
```

## Testing Components

### Basic Component Test

```javascript
// tests/components/Button.test.js
import { describe, it, expect } from 'vitest';

describe('Button Component', () => {
  it('renders button with text', () => {
    // Import compiled component
    const { default: Button } = require('../../dist/routes/_button');
    
    const result = Button({ children: 'Click me' });
    expect(result.textContent).toBe('Click me');
  });
});
```

### Testing with User Interactions

```javascript
import { fireEvent, screen } from '@testing-library/dom';

it('handles click events', () => {
  const { default: Counter } = require('../../dist/routes/_counter');
  const container = document.createElement('div');
  container.innerHTML = Counter();
  document.body.appendChild(container);
  
  const button = screen.getByText('Increment');
  fireEvent.click(button);
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

## Testing Server Actions

### Mock Database

```javascript
// tests/actions/auth.test.js
import { describe, it, expect, vi } from 'vitest';

// Mock database
const mockDB = {
  query: vi.fn()
};

vi.mock('../app/db', () => ({
  default: mockDB
}));

describe('Authentication', () => {
  it('logs in user with valid credentials', async () => {
    mockDB.query.mockResolvedValue({
      rows: [{ id: 1, email: 'test@example.com', password_hash: 'hashed' }]
    });
    
    const { secure_login } = require('../app/_actions/auth');
    const result = await secure_login({
      email: 'test@example.com',
      password: 'password'
    });
    
    expect(result).toHaveProperty('token');
    expect(result.user.email).toBe('test@example.com');
  });
});
```

## Testing Pages

### Page Rendering Test

```javascript
// tests/pages/home.test.js
import { describe, it, expect } from 'vitest';

describe('Home Page', () => {
  it('renders home page content', () => {
    const { default: HomePage } = require('../../dist/routes/_home');
    const result = HomePage({});
    
    expect(result).toBeInstanceOf(Node);
    expect(result.textContent).toContain('Welcome');
  });
});
```

## Integration Testing

### Test Full Flow

```javascript
// tests/integration/user-flow.test.js
import { describe, it, expect } from 'vitest';

describe('User Flow', () => {
  it('completes user registration', async () => {
    // 1. Render registration page
    // 2. Fill form
    // 3. Submit
    // 4. Verify redirect
    // 5. Check user is logged in
  });
});
```

## E2E Testing

### Playwright

```bash
npm install -D @playwright/test
```

```javascript
// tests/e2e/app.spec.js
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

## Running Tests

```bash
# Run all tests
atom test

# Run with watch mode
atom test --watch

# Run specific test file
atom test tests/components/Button.test.js
```

## Best Practices

### 1. Test User Behavior, Not Implementation

```javascript
// ✅ Good - Test what user sees
expect(screen.getByText('Welcome')).toBeInTheDocument();

// ❌ Bad - Test implementation details
expect(component.state.count).toBe(0);
```

### 2. Mock External Dependencies

```javascript
// Mock database
vi.mock('./db', () => ({
  default: { query: vi.fn() }
}));
```

### 3. Test Error Cases

```javascript
it('handles login errors', async () => {
  mockDB.query.mockRejectedValue(new Error('Database error'));
  
  await expect(secure_login(credentials))
    .rejects.toThrow('Database error');
});
```

## Next Steps

- [Stability Guide](./STABILITY.md) - Error handling patterns
- [Server Actions](./API_REFERENCE.md#server-actions) - Testing server functions
