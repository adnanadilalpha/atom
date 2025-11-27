const Prism = require('prismjs');

// Load additional language components as needed
const loadLanguages = require('prismjs/components/');

// Common languages to support
const supportedLanguages = {
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  python: 'python',
  py: 'python',
  java: 'java',
  cpp: 'cpp',
  'c++': 'cpp',
  c: 'c',
  css: 'css',
  html: 'html',
  xml: 'xml',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  bash: 'bash',
  shell: 'bash',
  sh: 'bash',
  sql: 'sql',
  php: 'php',
  ruby: 'ruby',
  rb: 'ruby',
  go: 'go',
  rust: 'rust',
  rs: 'rust',
  swift: 'swift',
  kotlin: 'kotlin',
  kt: 'kotlin',
  dart: 'dart',
  scala: 'scala',
  perl: 'perl',
  lua: 'lua',
  r: 'r',
  matlab: 'matlab',
  atom: 'javascript' // Treat .atom files as JavaScript for highlighting
};

function highlightCode(code, language = 'javascript') {
  try {
    // Normalize language name
    const normalizedLang = supportedLanguages[language.toLowerCase()] || 'javascript';

    // Load the language if it's not already loaded
    if (!Prism.languages[normalizedLang]) {
      try {
        loadLanguages([normalizedLang]);
      } catch (error) {
        console.warn(`Failed to load Prism language: ${normalizedLang}, falling back to plaintext`);
        return escapeHtml(code);
      }
    }

    // Highlight the code
    const highlighted = Prism.highlight(code, Prism.languages[normalizedLang], normalizedLang);

    return highlighted;
  } catch (error) {
    console.warn(`Syntax highlighting failed for language ${language}:`, error.message);
    // Fallback to escaped HTML
    return escapeHtml(code);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Build-time syntax highlighting function
function highlightCodeBlock(code, language = 'javascript', showLineNumbers = false) {
  const highlightedCode = highlightCode(code, language);

  let html = `<pre class="code-block language-${language.toLowerCase()}`;

  if (showLineNumbers) {
    html += ' line-numbers';
  }

  html += `"><code class="language-${language.toLowerCase()}">${highlightedCode}</code></pre>`;

  return html;
}

// Runtime-safe version that returns highlighted HTML string
function createHighlightedElement(code, language = 'javascript', className = '') {
  const highlightedCode = highlightCode(code, language);
  const lang = language.toLowerCase();

  return {
    tagName: 'pre',
    attributes: {
      className: `code-block language-${lang} ${className}`.trim()
    },
    children: [{
      tagName: 'code',
      attributes: {
        className: `language-${lang}`,
        dangerouslySetInnerHTML: { __html: highlightedCode }
      }
    }]
  };
}

module.exports = {
  highlightCode,
  highlightCodeBlock,
  createHighlightedElement,
  supportedLanguages
};
