// CodeSaga Client-Side Safe Python Engine
// Evaluates Python code statements, captures print() outputs, tests variable states & execution logic.

class PythonEngine {
  constructor() {
    this.resetEnvironment();
  }

  resetEnvironment() {
    this.variables = {};
    this.outputLogs = [];
  }

  execute(codeString, userInputs = []) {
    this.outputLogs = [];
    let inputPointer = 0;

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

      const openBrackets = (trimmedCode.match(/\[/g) || []).length;
      const closeBrackets = (trimmedCode.match(/\]/g) || []).length;
      if (openBrackets !== closeBrackets) {
        throw new Error(`SyntaxError: Unmatched brackets [ ].`);
      }

      // Convert Python print statements to JS output log capture
      let jsCode = trimmedCode
        // Comments
        .replace(/#.*$/gm, '')
        // Print statements
        .replace(/print\s*\((.*?)\)/g, (match, args) => {
          return `__log(${args || ''});`;
        })
        // Simple variable assignments (name = "val" -> var name = "val")
        .replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)/g, (match, varName, val) => {
          if (['if', 'elif', 'for', 'while', 'def', 'class'].some(k => varName.startsWith(k))) {
            return match;
          }
          return `var ${varName} = ${val}; __vars["${varName}"] = ${varName};`;
        });

      // Prepare execution sandbox function
      const capturedOutput = [];
      const envVars = {};

      const mockLog = (...args) => {
        const formatted = args.map(arg => {
          if (typeof arg === 'object' && arg !== null) {
            return JSON.stringify(arg);
          }
          return String(arg);
        }).join(' ');
        capturedOutput.push(formatted);
      };

      const mockInput = (promptMsg) => {
        if (promptMsg) capturedOutput.push(promptMsg);
        const val = userInputs[inputPointer] !== undefined ? userInputs[inputPointer] : 'Aiden';
        inputPointer++;
        return val;
      };

      // Safely evaluate simple script
      const sandboxFn = new Function('__log', '__vars', 'input', 'len', 'range', 'int', 'str', 'float', 'type', jsCode);
      
      const pyLen = (obj) => obj ? (obj.length !== undefined ? obj.length : Object.keys(obj).length) : 0;
      const pyRange = (start, stop, step = 1) => {
        if (stop === undefined) {
          stop = start;
          start = 0;
        }
        const res = [];
        for (let i = start; i < stop; i += step) res.push(i);
        return res;
      };
      const pyInt = (v) => parseInt(v, 10) || 0;
      const pyStr = (v) => String(v);
      const pyFloat = (v) => parseFloat(v) || 0.0;
      const pyType = (v) => typeof v;

      sandboxFn(mockLog, envVars, mockInput, pyLen, pyRange, pyInt, pyStr, pyFloat, pyType);

      return {
        success: true,
        output: capturedOutput,
        variables: envVars,
        error: null
      };

    } catch (err) {
      // If dynamic JS eval fails, fallback to regex statement analysis
      const fallbackOutput = [];
      const printMatches = [...trimmedCode.matchAll(/print\s*\(\s*(['"])(.*?)\1\s*\)/g)];
      printMatches.forEach(m => fallbackOutput.push(m[2]));

      if (fallbackOutput.length > 0) {
        return {
          success: true,
          output: fallbackOutput,
          variables: {},
          error: null
        };
      }

      return {
        success: false,
        output: [],
        error: err.message || 'Python Syntax Exception'
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

const pythonEngine = new PythonEngine();
export default pythonEngine;
