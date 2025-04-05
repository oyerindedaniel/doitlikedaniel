import { ReactNode } from "react";

interface ReactElementWithProps {
  props: {
    children?: ReactNode;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Helper function to check if object is a React element with props
function isReactElementWithProps(obj: unknown): obj is ReactElementWithProps {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "props" in obj &&
    typeof (obj as Record<string, unknown>).props === "object"
  );
}

// Helper function to extract code content from highlighted code blocks
function extractRawCode(children: ReactNode): string {
  if (!children) return "";

  if (typeof children === "string") {
    return children;
  }

  if (isReactElementWithProps(children)) {
    if (Array.isArray(children.props.children)) {
      return children.props.children
        .map((child: ReactNode) => extractRawCode(child))
        .join("");
    }

    return extractRawCode(children.props.children);
  }

  return "";
}

// Helper function to extract language from className
function extractLanguage(className?: string): string {
  if (!className) return "code";

  const hljsMatch = className.match(/hljs\s+language-([a-zA-Z0-9_-]+)/);
  if (hljsMatch) return hljsMatch[1];

  const standardMatch = className.match(/language-([a-zA-Z0-9_-]+)/);
  if (standardMatch) return standardMatch[1];

  return "code";
}

/**
 * Format TypeScript code with proper indentation
 * Handles special cases like ternary operators and multi-line expressions
 */
function formatTsCode(code: string): string {
  // Handle backslash escape sequences that might be causing issues in MDX
  code = code.replace(/\\([_])/g, "$1");

  // Return early for empty content
  if (!code || code.trim() === "") return code;

  // Split the code into lines
  const lines = code.split("\n");
  const formattedLines: string[] = [];
  let indentLevel = 0;
  const INDENT_SIZE = 2;

  // Keep track of brackets to handle complex nested structures
  const bracketStack: string[] = [];

  // Track the state of special expressions
  let inTernary = false;
  let ternaryLevel = 0;

  // Additional checks for class methods
  let inClassBody = false;
  let inMethodBody = false;
  let methodIndentLevel = 0;

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip empty lines but preserve them in output
    if (trimmedLine === "") {
      formattedLines.push("");
      continue;
    }

    // Track class body
    if (trimmedLine.startsWith("class ")) {
      inClassBody = true;
    }

    // Detect class method entries
    const isMethodStart =
      inClassBody &&
      /^(get|set|constructor|[a-zA-Z0-9_]+)\s*\(.*\)(\s*:\s*\w+)?\s*\{/.test(
        trimmedLine
      ) &&
      !trimmedLine.includes("=>") &&
      !trimmedLine.includes("function");

    if (isMethodStart) {
      inMethodBody = true;
      methodIndentLevel = indentLevel;
    }

    // Handle object property returns/assignments within methods
    const isMethodBodyLine =
      inMethodBody &&
      (trimmedLine.startsWith("return") || trimmedLine.startsWith("this.")) &&
      indentLevel === methodIndentLevel + 1;

    // Detect object literal starts in method body
    const hasObjectStart =
      isMethodBodyLine &&
      trimmedLine.includes("{") &&
      !trimmedLine.includes("}");

    // Detect ternary operators that span multiple lines
    const hasTernaryStart =
      trimmedLine.includes("?") &&
      !trimmedLine.includes(";") &&
      !trimmedLine.endsWith(")");
    const hasTernaryMiddle =
      trimmedLine.includes(":") &&
      inTernary &&
      !trimmedLine.includes("?") &&
      !trimmedLine.endsWith(";");
    const hasTernaryEnd =
      inTernary && (trimmedLine.endsWith(";") || trimmedLine.endsWith(","));

    // Handle closing brackets that are on their own line
    const startsWithClosingBracket = /^[}\])]/.test(trimmedLine);
    if (startsWithClosingBracket) {
      // Decrease indent level for lines that start with closing brackets
      indentLevel = Math.max(0, indentLevel - 1);

      // Check if we're exiting a method
      if (
        inMethodBody &&
        trimmedLine === "}" &&
        indentLevel === methodIndentLevel
      ) {
        inMethodBody = false;
      }

      // Check if we're exiting a class
      if (inClassBody && trimmedLine === "}" && indentLevel === 0) {
        inClassBody = false;
      }

      // Pop from bracket stack if needed
      if (
        bracketStack.length > 0 &&
        ((trimmedLine.startsWith("}") &&
          bracketStack[bracketStack.length - 1] === "{") ||
          (trimmedLine.startsWith("]") &&
            bracketStack[bracketStack.length - 1] === "[") ||
          (trimmedLine.startsWith(")") &&
            bracketStack[bracketStack.length - 1] === "("))
      ) {
        bracketStack.pop();
      }

      // If we're exiting a block in a ternary, adjust the ternary tracking
      if (inTernary && bracketStack.length <= ternaryLevel) {
        inTernary = false;
      }
    }

    // Special handling for ternary operator start
    if (hasTernaryStart) {
      inTernary = true;
      ternaryLevel = bracketStack.length;
    }

    // Add the line with proper indentation
    let indent = " ".repeat(indentLevel * INDENT_SIZE);

    // Extra indent for object properties in method returns
    if (inMethodBody && hasObjectStart) {
      indent = " ".repeat(indentLevel * INDENT_SIZE);
    } else if (inMethodBody && !isMethodStart && !startsWithClosingBracket) {
      // Extra indent for method body lines
      if (indentLevel <= methodIndentLevel) {
        indent = " ".repeat((methodIndentLevel + 1) * INDENT_SIZE);
      }
    }

    // Detect object property in a return statement
    if (
      inMethodBody &&
      trimmedLine.match(/^[a-zA-Z0-9_]+:/) &&
      indentLevel >= methodIndentLevel + 1
    ) {
      // Extra indent for object properties
      indent = " ".repeat((indentLevel + 1) * INDENT_SIZE);
    }

    // Extra indent for lines in a ternary expression
    if (
      (inTernary && hasTernaryMiddle) ||
      trimmedLine.startsWith("?") ||
      trimmedLine.startsWith(":")
    ) {
      indent += " ".repeat(INDENT_SIZE);
    }

    formattedLines.push(indent + trimmedLine);

    // End of ternary expression
    if (hasTernaryEnd) {
      inTernary = false;
    }

    // Special case: if a line has both opening and closing brackets, don't change indent level
    const hasBalancedBrackets =
      (trimmedLine.includes("{") && trimmedLine.includes("}")) ||
      (trimmedLine.includes("[") && trimmedLine.includes("]")) ||
      (trimmedLine.includes("(") && trimmedLine.includes(")"));

    // Count brackets to track nesting properly
    if (!hasBalancedBrackets) {
      // Look for opening brackets and increase indent for next line
      for (let i = 0; i < trimmedLine.length; i++) {
        const char = trimmedLine[i];
        if (char === "{" || char === "[" || char === "(") {
          bracketStack.push(char);
          indentLevel++;
        } else if (char === "}" || char === "]" || char === ")") {
          // Handle mid-line closing brackets
          if (i < trimmedLine.length - 1) {
            if (bracketStack.length > 0) {
              bracketStack.pop();
              indentLevel = Math.max(0, indentLevel - 1);
            }
          }
        }
      }
    }

    // Special handling for multi-line expressions
    if (
      !hasBalancedBrackets &&
      !trimmedLine.endsWith(";") &&
      !trimmedLine.endsWith(",") &&
      !trimmedLine.endsWith("{") &&
      !trimmedLine.endsWith("[") &&
      !trimmedLine.endsWith("(") &&
      i < lines.length - 1
    ) {
      // Check if the next line is part of the same expression
      const nextLine = lines[i + 1].trim();
      if (
        !nextLine.startsWith("//") &&
        !(
          nextLine.startsWith("}") ||
          nextLine.startsWith("]") ||
          nextLine.startsWith(")")
        )
      ) {
        if (trimmedLine.endsWith("&&") || trimmedLine.endsWith("||")) {
          // These operators continue an expression and should not affect indentation
        } else if (trimmedLine.includes("=>") && !nextLine.startsWith("{")) {
          // Arrow function with implicit return spanning multiple lines
          indentLevel++;
        }
      }
    }
  }

  return formattedLines.join("\n");
}

export { extractRawCode, extractLanguage, formatTsCode };
