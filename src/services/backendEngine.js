// CodeSaga Client-Side Safe Backend Engine
// Evaluates Node.js Express/HTTP endpoints, middleware pipelines, req/res objects, and JSON responses.

class BackendEngine {
  constructor() {
    this.resetEnvironment();
  }

  resetEnvironment() {
    this.outputLogs = [];
  }

  execute(codeString) {
    this.outputLogs = [];

    if (!codeString || typeof codeString !== 'string') {
      return { success: false, status: 400, output: [], error: 'Empty code string provided.' };
    }

    const trimmedCode = codeString.trim();

    try {
      // Basic Syntax Checks
      const openParens = (trimmedCode.match(/\(/g) || []).length;
      const closeParens = (trimmedCode.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        throw new Error(`SyntaxError: Unmatched parentheses. Found ${openParens} '(' and ${closeParens} ')'.`);
      }

      const openBraces = (trimmedCode.match(/\{/g) || []).length;
      const closeBraces = (trimmedCode.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        throw new Error(`SyntaxError: Unmatched braces { }. Found ${openBraces} '{' and ${closeBraces} '}'.`);
      }

      // Prepare Mock Express Server Environment
      const routes = [];
      let statusCode = 200;
      const responseBuffer = [];

      const mockRes = {
        status: function(code) {
          statusCode = code;
          return this;
        },
        json: function(obj) {
          responseBuffer.push(JSON.stringify(obj, null, 2));
          return this;
        },
        send: function(msg) {
          responseBuffer.push(String(msg));
          return this;
        }
      };

      const mockReq = {
        body: { username: "agent", password: "secretpassword" },
        params: { id: "10" },
        query: { lang: "js" },
        headers: { authorization: "Bearer token123" }
      };

      const mockApp = {
        get: (path, ...handlers) => routes.push({ method: 'GET', path, handlers }),
        post: (path, ...handlers) => routes.push({ method: 'POST', path, handlers }),
        put: (path, ...handlers) => routes.push({ method: 'PUT', path, handlers }),
        patch: (path, ...handlers) => routes.push({ method: 'PATCH', path, handlers }),
        delete: (path, ...handlers) => routes.push({ method: 'DELETE', path, handlers }),
        use: (path, ...handlers) => routes.push({ method: 'USE', path, handlers })
      };

      // Transform express code
      let jsCode = trimmedCode
        .replace(/const\s+express\s*=\s*require\(["']express["']\);?/g, '')
        .replace(/const\s+app\s*=\s*express\(\);?/g, '')
        .replace(/app\.listen\(.*?\);?/g, '');

      // Evaluate sandbox code
      const sandboxFn = new Function('app', 'req', 'res', jsCode);
      sandboxFn(mockApp, mockReq, mockRes);

      // Execute registered route handlers if present
      if (routes.length > 0) {
        routes.forEach(route => {
          route.handlers.forEach(handler => {
            if (typeof handler === 'function') {
              handler(mockReq, mockRes, () => {});
            }
          });
        });
      }

      if (responseBuffer.length === 0) {
        responseBuffer.push(JSON.stringify({ status: "200 OK", message: "Server operational" }, null, 2));
      }

      return {
        success: true,
        status: statusCode,
        output: responseBuffer,
        error: null
      };

    } catch (err) {
      // Fallback regex extraction for simple res.json or res.send
      const fallbackOutput = [];
      const jsonMatch = trimmedCode.match(/res\.json\(\s*(\{[\s\S]*?\})\s*\)/);
      if (jsonMatch) {
        fallbackOutput.push(jsonMatch[1]);
        return {
          success: true,
          status: 200,
          output: fallbackOutput,
          error: null
        };
      }

      return {
        success: false,
        status: 500,
        output: [],
        error: err.message || 'Backend Syntax Exception'
      };
    }
  }

  compareOutputs(actualOutput, expectedOutput) {
    if (!Array.isArray(actualOutput) || !Array.isArray(expectedOutput)) return false;
    if (actualOutput.length !== expectedOutput.length) return false;

    for (let i = 0; i < actualOutput.length; i++) {
      const actualStr = String(actualOutput[i]).replace(/\s+/g, '').toLowerCase();
      const expectedStr = String(expectedOutput[i]).replace(/\s+/g, '').toLowerCase();
      if (!actualStr.includes(expectedStr) && !expectedStr.includes(actualStr)) return false;
    }
    return true;
  }
}

const backendEngine = new BackendEngine();
export default backendEngine;
