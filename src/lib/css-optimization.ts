// CSS optimization utilities

// Critical CSS classes that should always be included
export const criticalClasses = [
  // Layout
  'container', 'flex', 'grid', 'block', 'inline-block', 'hidden', 'visible',
  'w-full', 'h-full', 'min-h-screen', 'max-w-screen', 'mx-auto', 'px-4', 'py-2',
  
  // Typography
  'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
  'font-normal', 'font-medium', 'font-semibold', 'font-bold',
  'text-left', 'text-center', 'text-right',
  'text-gray-900', 'text-gray-600', 'text-gray-500', 'text-white',
  
  // Colors
  'bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-blue-500', 'bg-blue-600',
  'border-gray-200', 'border-gray-300', 'border-blue-500',
  
  // Spacing
  'p-2', 'p-4', 'p-6', 'px-2', 'px-4', 'px-6', 'py-2', 'py-4', 'py-6',
  'm-2', 'm-4', 'm-6', 'mx-2', 'mx-4', 'mx-6', 'my-2', 'my-4', 'my-6',
  'mt-2', 'mt-4', 'mb-2', 'mb-4', 'ml-2', 'ml-4', 'mr-2', 'mr-4',
  
  // Responsive
  'sm:', 'md:', 'lg:', 'xl:', '2xl:',
  
  // Interactive
  'hover:', 'focus:', 'active:', 'disabled:',
  'cursor-pointer', 'cursor-not-allowed',
  
  // Transitions
  'transition', 'duration-200', 'duration-300', 'ease-in-out',
  
  // Shadows
  'shadow-sm', 'shadow-md', 'shadow-lg',
  
  // Border radius
  'rounded', 'rounded-md', 'rounded-lg', 'rounded-full',
  
  // Position
  'relative', 'absolute', 'fixed', 'sticky',
  'top-0', 'bottom-0', 'left-0', 'right-0',
  'z-10', 'z-20', 'z-30', 'z-40', 'z-50',
];

// Purge CSS configuration for Tailwind
export const purgeConfig = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
  ],
  safelist: [
    // Keep all critical classes
    ...criticalClasses,
    
    // Dynamic classes that might be generated
    /^bg-/, /^text-/, /^border-/, /^hover:/, /^focus:/, /^active:/,
    
    // Animation classes
    /^animate-/, /^transition-/, /^duration-/, /^ease-/,
    
    // Responsive classes
    /^sm:/, /^md:/, /^lg:/, /^xl:/, /^2xl:/,
    
    // State classes
    /^group-/, /^peer-/, /^data-/, /^aria-/,
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [
    // Add any custom plugins
  ],
};

// CSS optimization function
export function optimizeCSS(css: string): string {
  // Remove comments
  let optimized = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove unnecessary whitespace
  optimized = optimized.replace(/\s+/g, ' ');
  
  // Remove empty rules
  optimized = optimized.replace(/[^{}]+{\s*}/g, '');
  
  // Remove duplicate properties (keep last)
  optimized = optimized.replace(/([^{}]+){([^}]+)}/g, (match, selector, properties) => {
    const propMap = new Map();
    const props = properties.split(';').filter(Boolean);
    
    props.forEach(prop => {
      const [key, value] = prop.split(':').map(s => s.trim());
      if (key && value) {
        propMap.set(key, value);
      }
    });
    
    const uniqueProps = Array.from(propMap.entries())
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
    
    return `${selector}{${uniqueProps}}`;
  });
  
  return optimized.trim();
}

// Generate critical CSS for above-the-fold content
export function generateCriticalCSS(): string {
  return `
    /* Critical above-the-fold styles */
    *{box-sizing:border-box}
    html{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.5;-webkit-text-size-adjust:100%}
    body{margin:0;padding:0;background-color:#ffffff;color:#000000;font-size:16px;line-height:1.6}
    #root{min-height:100vh;display:flex;flex-direction:column}
    .container{width:100%;max-width:1200px;margin:0 auto;padding:0 1rem}
    .btn{display:inline-flex;align-items:center;justify-content:center;border-radius:0.375rem;font-size:0.875rem;font-weight:500;transition:all 0.2s ease-in-out;cursor:pointer;border:none;text-decoration:none}
    .btn-primary{background-color:#3b82f6;color:white;padding:0.5rem 1rem}
    .btn-primary:hover{background-color:#2563eb}
    .loading{display:inline-block;width:20px;height:20px;border:3px solid #f3f3f3;border-top:3px solid #3498db;border-radius:50%;animation:spin 1s linear infinite}
    @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
    @media (max-width:768px){.container{padding:0 0.5rem}.btn{font-size:0.8rem;padding:0.4rem 0.8rem}}
  `;
}
