// Production-safe logging utility
const isDevelopment = import.meta.env.DEV;

export const logger = {
  // Only log in development
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  // Always log errors (but sanitize in production)
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    } else {
      // In production, you might want to send to error tracking service
      console.error('Error:', args[0]);
    }
  },
  
  // Only log warnings in development
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  // Debug logging (development only)
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
  
  // Info logging (can be used in production for important events)
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};

// Remove console methods in production build
if (!isDevelopment) {
  // Override console methods to prevent accidental logging
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
  // Keep console.error for critical errors
}
