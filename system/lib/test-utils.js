/**
 * ATOM Framework - Testing Utilities
 * 
 * Provides testing helpers for ATOM applications
 */

/**
 * Creates a mock request object for testing Server Actions
 */
function createMockRequest(data = {}, options = {}) {
  return {
    body: data,
    query: options.query || {},
    params: options.params || {},
    headers: options.headers || {},
    method: options.method || 'POST',
    path: options.path || '/',
    ...options
  };
}

/**
 * Creates a mock response object for testing
 */
function createMockResponse() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    json: function(data) {
      this.body = data;
      return this;
    },
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    setHeader: function(name, value) {
      this.headers[name] = value;
    }
  };
  return res;
}

/**
 * Creates a mock context for testing components
 */
function createMockContext(props = {}) {
  return {
    props: props,
    params: props.params || {},
    query: props.query || {},
    path: props.path || '/'
  };
}

/**
 * Renders a component with mock context
 */
async function renderComponent(component, props = {}) {
  const context = createMockContext(props);
  const result = component(context);
  
  // Handle async components
  if (result && typeof result.then === 'function') {
    return await result;
  }
  
  return result;
}

/**
 * Waits for async operations to complete
 */
function waitFor(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mocks Server Actions for testing
 */
function mockServerAction(actionName, mockImplementation) {
  const originalAction = global.Actions?.[actionName];
  
  if (global.Actions) {
    global.Actions[actionName] = mockImplementation;
  }
  
  return {
    restore: () => {
      if (global.Actions && originalAction) {
        global.Actions[actionName] = originalAction;
      }
    }
  };
}

/**
 * Creates a test database mock
 */
function createMockDB() {
  const data = {};
  
  return {
    query: async (sql, params) => {
      // Simple mock - returns empty result
      return { rows: [] };
    },
    insert: (table, record) => {
      if (!data[table]) data[table] = [];
      const id = data[table].length + 1;
      const recordWithId = { id, ...record };
      data[table].push(recordWithId);
      return recordWithId;
    },
    find: (table, condition) => {
      if (!data[table]) return [];
      return data[table].filter(condition);
    },
    clear: () => {
      Object.keys(data).forEach(key => delete data[key]);
    },
    getData: () => data
  };
}

/**
 * Asserts that a value is a valid DOM Node
 */
function assertDOMNode(value, message = 'Expected DOM Node') {
  if (!value || !(value instanceof Node)) {
    throw new Error(message);
  }
  return true;
}

/**
 * Asserts that a component returns valid DOM
 */
function assertValidComponent(component, props = {}) {
  const result = renderComponent(component, props);
  assertDOMNode(result, 'Component must return a valid DOM Node');
  return result;
}

module.exports = {
  createMockRequest,
  createMockResponse,
  createMockContext,
  renderComponent,
  waitFor,
  mockServerAction,
  createMockDB,
  assertDOMNode,
  assertValidComponent
};
