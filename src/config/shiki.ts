export const shikiConfig = {
  themes: {
    light: "github-light",
    dark: "dracula",
  },
  langs: ["javascript", "typescript", "tsx", "jsx"],
};

// Helper to get all supported languages including aliases
export const supportedLanguages = [
  ...shikiConfig.langs,
  // Add any language aliases
  { id: "js", alias: "javascript" },
  { id: "ts", alias: "typescript" },
];
