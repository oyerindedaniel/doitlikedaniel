export const shikiConfig = {
  themes: {
    light: "github-light",
    dark: "catppuccin-macchiato",
  },
  /**
   * List of programming languages supported by Shiki for syntax highlighting.
   * You can add more languages based on the available list:
   * @see https://shiki.matsu.io/languages
   */
  langs: ["javascript", "typescript", "tsx", "jsx", "css", "diff"],
};

export const supportedLanguages = [
  { id: "js", alias: "javascript" },
  { id: "ts", alias: "typescript" },
  { id: "tsx", alias: "typescript" },
  { id: "jsx", alias: "javascript" },
];
