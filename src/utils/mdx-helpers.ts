import logger from "./logger";

/**
 * Fixes common indentation issues with TypeScript class methods in MDX code blocks
 * Specifically targets the problematic patterns we've seen in the TodoItem example
 */
export function fixMdxCodeBlockIndentation(code: string): string {
  if (!code || typeof code !== "string") return code;

  logger.debug("Fixing MDX code block indentation");

  // Case 1: Fix method body indentation for methods like get completed()
  code = code.replace(
    /(\s*)(get|set)?\s*([a-zA-Z0-9_]+)\(\)(\s*:\s*[a-zA-Z<>|]+)?\s*\{(\s*)(return|this|const|let|var)(.+?)(\s*)\}/gs,
    (
      match,
      beforeSpace,
      accessor,
      name,
      returnType,
      innerSpace,
      keyword,
      rest,
      endSpace
    ) => {
      // Don't modify if already properly indented
      if (innerSpace && innerSpace.includes("\n    ")) return match;

      // Fix the indentation
      return `${beforeSpace}${accessor ? accessor + " " : ""}${name}()${
        returnType || ""
      } {
    ${keyword}${rest}
  }`;
    }
  );

  // Case 2: Fix toJSON-style methods with complex return objects
  code = code.replace(
    /(\s*)(toJSON|toString|render)(\(\))\s*\{(\s*)return\s*\{([\s\S]*?)\}(\s*);(\s*)\}/gs,
    (
      match,
      beforeSpace,
      name,
      params,
      innerSpace,
      objContent,
      semiSpace,
      endSpace
    ) => {
      // Don't modify if already properly indented
      if (
        innerSpace &&
        innerSpace.includes("\n    ") &&
        objContent.includes("\n      ")
      ) {
        return match;
      }

      // Split object content by properties
      const props = objContent.split(",").map((prop) => prop.trim());

      // Build a properly indented object
      const indentedProps = props
        .filter((p) => p)
        .map((prop) => `      ${prop}`)
        .join(",\n");

      // Reassemble with proper indentation
      return `${beforeSpace}${name}${params} {
    return {
${indentedProps}
    };
  }`;
    }
  );

  // Log if changes were made
  if (code !== code) {
    logger.format("Fixed indentation issues in MDX code block");
  }

  return code;
}
