/**
 * Logger utility that only logs in development mode
 */
const logger = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `%c[DEBUG] ${message}`,
        "background: #222; color: #bada55",
        data || ""
      );
    }
  },
  format: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `%c[FORMAT] ${message}`,
        "background: #553399; color: #ffffff",
        data || ""
      );
    }
  },
};

export default logger;
