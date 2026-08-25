// CodeSaga Client-Side Safe Frontend Engine
// Evaluates HTML, CSS, and JS code snippets, tests DOM structures, CSS declarations, and generates live iframe previews.

class FrontendEngine {
  constructor() {
    this.resetEnvironment();
  }

  resetEnvironment() {
    this.outputLogs = [];
  }

  execute(htmlCode = '', cssCode = '', jsCode = '') {
    this.outputLogs = [];

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; padding: 1rem; color: #0f172a; background-color: #f8fafc; }
          ${cssCode || ''}
        </style>
      </head>
      <body>
        ${htmlCode || ''}
        <script>
          try {
            ${jsCode || ''}
          } catch(e) {
            console.error(e.message);
          }
        </script>
      </body>
      </html>
    `;

    try {
      // Basic Syntax Checks
      const combined = (htmlCode + cssCode + jsCode).trim();
      if (!combined) {
        return { success: false, previewSrc: '', error: 'Empty code provided.' };
      }

      // Check unclosed tags basic heuristic
      if (htmlCode) {
        const openH1 = (htmlCode.match(/<h1\b/g) || []).length;
        const closeH1 = (htmlCode.match(/<\/h1>/g) || []).length;
        if (openH1 !== closeH1) {
          throw new Error(`SyntaxError: Unclosed <h1> tag. Found ${openH1} opening and ${closeH1} closing tags.`);
        }
      }

      const previewBlob = new Blob([fullHtml], { type: 'text/html' });
      const previewUrl = URL.createObjectURL(previewBlob);

      return {
        success: true,
        previewSrc: previewUrl,
        fullHtml: fullHtml,
        error: null
      };

    } catch (err) {
      return {
        success: false,
        previewSrc: '',
        fullHtml: '',
        error: err.message || 'Frontend Syntax Exception'
      };
    }
  }

  // Validate presence of specific HTML tags, CSS rules, or JS queries
  validateRequirements(htmlCode = '', cssCode = '', jsCode = '', requirements = {}) {
    const { expectedTag, expectedCss, expectedText, expectedJs } = requirements;

    if (expectedTag) {
      const tagRegex = new RegExp(`<${expectedTag}\\b`, 'i');
      if (!tagRegex.test(htmlCode)) {
        return { valid: false, reason: `Missing required HTML <${expectedTag}> tag.` };
      }
    }

    if (expectedText) {
      const textRegex = new RegExp(expectedText, 'i');
      if (!textRegex.test(htmlCode) && !textRegex.test(jsCode)) {
        return { valid: false, reason: `Missing required text "${expectedText}".` };
      }
    }

    if (expectedCss) {
      const cssRegex = new RegExp(expectedCss, 'i');
      if (!cssRegex.test(cssCode)) {
        return { valid: false, reason: `Missing required CSS declaration "${expectedCss}".` };
      }
    }

    if (expectedJs) {
      const jsRegex = new RegExp(expectedJs, 'i');
      if (!jsRegex.test(jsCode)) {
        return { valid: false, reason: `Missing required JavaScript logic "${expectedJs}".` };
      }
    }

    return { valid: true, reason: null };
  }
}

const frontendEngine = new FrontendEngine();
export default frontendEngine;
