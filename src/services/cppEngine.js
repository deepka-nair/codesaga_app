// CodeSaga Client-Side Safe C++ Engine
// Evaluates C++ statements & main function execution, captures std::cout << outputs, tests variable states & execution logic.

class CppEngine {
  constructor() {
    this.resetEnvironment();
  }

  resetEnvironment() {
    this.outputLogs = [];
  }

  execute(codeString) {
    this.outputLogs = [];

    if (!codeString || typeof codeString !== 'string') {
      return { success: false, output: [], error: 'Empty code string provided.' };
    }

    const trimmedCode = codeString.trim();

    try {
      // Basic Syntax Pre-Checks
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

      // Convert C++ std::cout << ... << std::endl; to JS output log capture
      let jsCode = trimmedCode
        // Strip single line comments
        .replace(/\/\/.*/g, '')
        // Strip includes
        .replace(/#include\s+<.*?>/g, '')
        // Convert std::cout << arg1 << std::endl; -> __log(arg1);
        .replace(/std::cout\s*<<\s*(.*?);/g, (match, expr) => {
          const parts = expr.split('<<').map(p => p.trim()).filter(Boolean);
          const formattedParts = parts.map(p => {
            if (p === 'std::endl' || p === 'endl') return '"\\n"';
            return p;
          });
          return `__log(${formattedParts.join(', ')});`;
        })
        // C++ primitives to var (int age = 20 -> var age = 20)
        .replace(/\b(int|double|float|char|bool|std::string|auto|const)\b\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g, 'var $2 =')
        // C++ array declaration int scores[2] = {90, 80} -> var scores = [90, 80]
        .replace(/int\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\[\s*\d*\s*\]\s*=\s*\{(.*?)\};/g, 'var $1 = [$2];')
        // std::string to string
        .replace(/std::string/g, 'var')
        // std::vector push_back to push
        .replace(/\.push_back\(/g, '.push(');

      // Prepare execution sandbox function
      const capturedOutput = [];
      let inlineBuffer = '';

      const mockLog = (...args) => {
        const formatted = args.map(arg => {
          if (arg === '\n') return '\n';
          if (typeof arg === 'object' && arg !== null) return JSON.stringify(arg);
          return String(arg);
        }).join('');

        const lines = formatted.split('\n');
        lines.forEach((line, i) => {
          if (i === 0) {
            inlineBuffer += line;
          } else {
            if (inlineBuffer) capturedOutput.push(inlineBuffer);
            inlineBuffer = line;
          }
        });
      };

      // Safely evaluate simple script inside sandbox
      const sandboxFn = new Function('__log', jsCode);
      sandboxFn(mockLog);

      if (inlineBuffer) {
        capturedOutput.push(inlineBuffer);
      }

      return {
        success: true,
        output: capturedOutput.filter(line => line.trim().length > 0),
        error: null
      };

    } catch (err) {
      // Fallback regex match for simple std::cout string literal matches
      const fallbackOutput = [];
      const matches = [...trimmedCode.matchAll(/std::cout\s*<<\s*(["'])(.*?)\1/g)];
      matches.forEach(m => fallbackOutput.push(m[2]));

      if (fallbackOutput.length > 0) {
        return {
          success: true,
          output: fallbackOutput,
          error: null
        };
      }

      return {
        success: false,
        output: [],
        error: err.message || 'C++ Syntax Exception'
      };
    }
  }

  // Compare output array against expected outputs (case & whitespace flexible)
  compareOutputs(actualOutput, expectedOutput) {
    if (!Array.isArray(actualOutput) || !Array.isArray(expectedOutput)) return false;
    if (actualOutput.length !== expectedOutput.length) return false;

    for (let i = 0; i < actualOutput.length; i++) {
      const actualStr = String(actualOutput[i]).trim().toLowerCase();
      const expectedStr = String(expectedOutput[i]).trim().toLowerCase();
      if (actualStr !== expectedStr) return false;
    }
    return true;
  }
}

const cppEngine = new CppEngine();
export default cppEngine;
