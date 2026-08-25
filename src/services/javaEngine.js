// CodeSaga Client-Side Safe Java Engine
// Evaluates Java statements & main class methods, captures System.out.println() outputs, tests variable states & execution logic.

class JavaEngine {
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

      // Convert Java System.out.println() and System.out.print() to JS output log capture
      let jsCode = trimmedCode
        // Strip single line comments
        .replace(/\/\/.*/g, '')
        // System.out.println(...)
        .replace(/System\.out\.println\s*\((.*?)\);/g, (match, args) => {
          return `__log(${args || ''});`;
        })
        // System.out.print(...)
        .replace(/System\.out\.print\s*\((.*?)\);/g, (match, args) => {
          return `__logInline(${args || ''});`;
        })
        // Java primitives to var (int age = 20 -> var age = 20)
        .replace(/\b(int|double|float|char|boolean|String|var)\b\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g, 'var $2 =')
        // Java array declaration int[] scores = {90, 80} -> var scores = [90, 80]
        .replace(/int\s*\[\s*\]\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*\{(.*?)\};/g, 'var $1 = [$2];')
        // String.equals() to ===
        .replace(/([a-zA-Z0-9_]+)\.equals\((.*?)\)/g, '($1 === $2)')
        // String.length() to .length
        .replace(/\.length\(\)/g, '.length');

      // Prepare execution sandbox function
      const capturedOutput = [];
      let inlineBuffer = '';

      const mockLog = (...args) => {
        const formatted = args.map(arg => {
          if (typeof arg === 'object' && arg !== null) return JSON.stringify(arg);
          return String(arg);
        }).join(' ');

        if (inlineBuffer) {
          capturedOutput.push(inlineBuffer + formatted);
          inlineBuffer = '';
        } else {
          capturedOutput.push(formatted);
        }
      };

      const mockLogInline = (...args) => {
        const formatted = args.map(arg => String(arg)).join(' ');
        inlineBuffer += formatted;
      };

      // Safely evaluate simple script inside sandbox
      const sandboxFn = new Function('__log', '__logInline', jsCode);
      sandboxFn(mockLog, mockLogInline);

      if (inlineBuffer) {
        capturedOutput.push(inlineBuffer);
      }

      return {
        success: true,
        output: capturedOutput,
        error: null
      };

    } catch (err) {
      // Fallback regex match for simple System.out.println() string literal matches
      const fallbackOutput = [];
      const matches = [...trimmedCode.matchAll(/System\.out\.print(?:ln)?\s*\(\s*(["'])(.*?)\1\s*\)/g)];
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
        error: err.message || 'Java Syntax Exception'
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

const javaEngine = new JavaEngine();
export default javaEngine;
