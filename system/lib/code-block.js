const { highlightCode, createHighlightedElement } = require('./syntax-highlighter');

// CodeBlock component for ATOM framework
function CodeBlock({ code, language = 'javascript', title = '', showLineNumbers = false, className = '' }) {
  if (!code || typeof code !== 'string') {
    return div('No code provided', { className: 'text-gray-500 italic' });
  }

  // Create the highlighted HTML element
  const highlightedElement = createHighlightedElement(code, language, className);

  // Build the container structure
  const children = [];

  // Add title if provided
  if (title) {
    children.push(
      div([
        span(title, { className: 'text-sm font-medium text-gray-700' }),
        span(language.toUpperCase(), {
          className: 'text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded ml-2'
        })
      ], {
        className: 'flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200'
      })
    );
  } else {
    // Just show language badge in top-right if no title
    children.push(
      div([
        span(language.toUpperCase(), {
          className: 'text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded'
        })
      ], {
        className: 'absolute top-2 right-2'
      })
    );
  }

  // Add the code block with proper styling
  const codeBlockClass = `relative bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto ${showLineNumbers ? 'line-numbers' : ''} ${className}`.trim();

  children.push(
    div(highlightedElement, {
      className: codeBlockClass,
      dangerouslySetInnerHTML: highlightedElement.children[0].attributes.dangerouslySetInnerHTML
    })
  );

  return div(children, {
    className: 'code-block-container border border-gray-200 rounded-lg overflow-hidden shadow-sm'
  });
}

// Utility function to create code blocks from templates
function createCodeBlock(code, language = 'javascript', options = {}) {
  return CodeBlock({
    code,
    language,
    ...options
  });
}

// Export for use in ATOM files
module.exports = {
  CodeBlock,
  createCodeBlock
};
