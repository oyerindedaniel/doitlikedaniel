/**
 * Comprehensive formatter for TypeScript code
 * Handles correct indentation for various code structures
 */

/**
 * Format TypeScript code with proper indentation
 * Supports classes, methods, object literals, and nested structures
 */
export function formatTsCode(code: string): string {
  // Handle backslash escape sequences that might be causing issues in MDX
  code = code.replace(/\\([_])/g, "$1");

  // Return early for empty content
  if (!code || code.trim() === "") return code;

  // Split the code into lines
  const lines = code.split("\n");
  const formattedLines: string[] = [];
  const INDENT_SIZE = 2;

  // Initialize base indentation tracking
  let baseIndent = 0;

  // Map to track class methods by their starting line number
  const methodsByLine: Map<number, { indentLevel: number; name: string }> =
    new Map();

  // First pass - detect class structure and methods
  let inClass = false;
  let classIndent = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmedLine = lines[i].trim();

    // Detect class declarations
    if (trimmedLine.startsWith("class ")) {
      inClass = true;
      classIndent = 0; // Class starts at whatever the current indent level is
    }

    // Detect end of class
    if (inClass && trimmedLine === "}" && !trimmedLine.startsWith("};")) {
      inClass = false;
    }

    // Detect class methods
    if (
      inClass &&
      /^(get|set|constructor|[a-zA-Z0-9_]+)\s*\(.*\)(\s*:\s*\w+)?\s*\{/.test(
        trimmedLine
      ) &&
      !trimmedLine.includes("=>") &&
      !trimmedLine.includes("function")
    ) {
      // This is a class method
      const name = trimmedLine.split(/[\s(]/)[0];
      methodsByLine.set(i, {
        indentLevel: classIndent + 1, // Method body should be indented once from class level
        name,
      });
    }
  }

  // Main formatting pass
  const blockStack: Array<{
    type: string;
    indent: number;
    lineStart: number;
    char: string;
    isMethod?: boolean;
    isObjectInReturn?: boolean;
  }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip empty lines but preserve them in output
    if (trimmedLine === "") {
      formattedLines.push("");
      continue;
    }

    // Analyze special line characteristics
    const isMethodLine = methodsByLine.has(i);
    const isReturnStatement = trimmedLine.startsWith("return ");
    const isObjectProperty = /^[a-zA-Z0-9_]+\s*:/.test(trimmedLine);
    const isClassStart = trimmedLine.startsWith("class ");
    const isClosingBrace = /^[}\])]/.test(trimmedLine);

    // Adjust indentation for closing braces before calculating indent
    if (isClosingBrace && blockStack.length > 0) {
      // Get matching opening brace
      const closingChar = trimmedLine[0];
      const lastBlock = blockStack[blockStack.length - 1];

      if (
        (closingChar === "}" && lastBlock.char === "{") ||
        (closingChar === "]" && lastBlock.char === "[") ||
        (closingChar === ")" && lastBlock.char === "(")
      ) {
        // Pop the block from stack
        blockStack.pop();

        // Handle special case for object in return statement
        if (lastBlock.isObjectInReturn && trimmedLine === "};") {
          // Keep the indentation at method level for closing brace+semicolon
          baseIndent = lastBlock.indent;
        } else {
          // Return to the indentation of the opening brace
          baseIndent = lastBlock.indent;
        }
      }
    }

    // Calculate indentation
    let indentSpaces = baseIndent * INDENT_SIZE;

    // Special adjustments for specific contexts
    if (isMethodLine) {
      // Class methods should be at class indent + 1
      const methodInfo = methodsByLine.get(i)!;
      baseIndent = methodInfo.indentLevel;
      indentSpaces = baseIndent * INDENT_SIZE;
    }
    // Handle properties in object literals with special indentation
    else if (
      isObjectProperty &&
      blockStack.length > 0 &&
      blockStack[blockStack.length - 1].type === "object"
    ) {
      // Object properties get indented 1 from object start
      indentSpaces =
        (blockStack[blockStack.length - 1].indent + 1) * INDENT_SIZE;
    }

    // Format the line with correct indentation
    formattedLines.push(" ".repeat(indentSpaces) + trimmedLine);

    // Analyze braces for stack management (after handling closing braces)
    // We detect opening braces and update the stack and indent level
    const tempLine = trimmedLine;
    let inString = false;
    let stringChar = "";

    for (let j = 0; j < tempLine.length; j++) {
      const char = tempLine[j];

      // Skip brace detection inside strings
      if (
        (char === '"' || char === "'" || char === "`") &&
        (j === 0 || tempLine[j - 1] !== "\\")
      ) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
        continue;
      }

      if (inString) continue;

      // Detect opening braces
      if (char === "{" || char === "[" || char === "(") {
        let blockType = "unknown";
        let isObjectInReturn = false;

        // Determine block type
        if (char === "{") {
          if (isClassStart) {
            blockType = "class";
          } else if (isMethodLine) {
            blockType = "method";
          } else if (isReturnStatement) {
            blockType = "object";
            isObjectInReturn = true;
          } else if (
            tempLine.includes("return") &&
            tempLine.indexOf("return") < j
          ) {
            blockType = "object";
            isObjectInReturn = true;
          } else if (isObjectProperty && j > tempLine.indexOf(":")) {
            blockType = "object";
          } else if (/[=:]\s*\{/.test(tempLine.substring(0, j))) {
            blockType = "object";
          } else {
            blockType = "block";
          }
        } else if (char === "[") {
          blockType = "array";
        } else if (char === "(") {
          blockType = "params";
        }

        // Push block to stack
        blockStack.push({
          type: blockType,
          indent: baseIndent,
          lineStart: i,
          char,
          isMethod: isMethodLine,
          isObjectInReturn,
        });

        // Increase indent for next line
        baseIndent++;
      }

      // Detect closing braces within the same line
      if (
        (char === "}" || char === "]" || char === ")") &&
        j < tempLine.length - 1
      ) {
        if (blockStack.length > 0) {
          const lastBlock = blockStack[blockStack.length - 1];
          if (
            (char === "}" && lastBlock.char === "{") ||
            (char === "]" && lastBlock.char === "[") ||
            (char === ")" && lastBlock.char === "(")
          ) {
            blockStack.pop();
            baseIndent = Math.max(0, baseIndent - 1);
          }
        }
      }
    }

    // Special case: handle multi-line chain expression continuation
    if (
      !isClosingBrace &&
      (trimmedLine.endsWith(".") ||
        trimmedLine.endsWith("?.") ||
        trimmedLine.endsWith("=>") ||
        trimmedLine.endsWith("&&") ||
        trimmedLine.endsWith("||")) &&
      i < lines.length - 1
    ) {
      // Next line is continuation of this expression
      const nextLine = lines[i + 1].trim();
      if (!/^[})]./.test(nextLine) && !nextLine.startsWith("//")) {
        // Increase indent for continuation
        baseIndent++;
        // Add a temporary chain block to stack
        blockStack.push({
          type: "chain",
          indent: baseIndent - 1,
          lineStart: i,
          char: "chain",
        });
      }
    }

    // Clean up chain expression tracking if the chain has ended
    if (
      blockStack.length > 0 &&
      blockStack[blockStack.length - 1].type === "chain" &&
      !(
        trimmedLine.endsWith(".") ||
        trimmedLine.endsWith("?.") ||
        trimmedLine.endsWith("=>") ||
        trimmedLine.endsWith("&&") ||
        trimmedLine.endsWith("||")
      )
    ) {
      blockStack.pop();
      baseIndent = Math.max(0, baseIndent - 1);
    }
  }

  return formattedLines.join("\n");
}
