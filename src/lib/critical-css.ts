// Critical CSS extraction utility
export const criticalCSS = `
  /* Critical above-the-fold styles */
  * {
    box-sizing: border-box;
  }
  
  html {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -moz-tab-size: 4;
    tab-size: 4;
  }
  
  body {
    margin: 0;
    padding: 0;
    background-color: #ffffff;
    color: #000000;
    font-size: 16px;
    line-height: 1.6;
  }
  
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  /* Critical layout styles */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  /* Critical button styles */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    border: none;
    text-decoration: none;
  }
  
  .btn-primary {
    background-color: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
  }
  
  .btn-primary:hover {
    background-color: #2563eb;
  }
  
  /* Critical loading states */
  .loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Critical responsive styles */
  @media (max-width: 768px) {
    .container {
      padding: 0 0.5rem;
    }
    
    .btn {
      font-size: 0.8rem;
      padding: 0.4rem 0.8rem;
    }
  }
`;

// Inject critical CSS into the document head
export function injectCriticalCSS() {
  if (typeof document === 'undefined') return;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  style.setAttribute('data-critical', 'true');
  
  // Insert at the beginning of head for highest priority
  const head = document.head;
  head.insertBefore(style, head.firstChild);
}

// Remove critical CSS after main stylesheet loads
export function removeCriticalCSS() {
  if (typeof document === 'undefined') return;
  
  const criticalStyle = document.querySelector('style[data-critical="true"]');
  if (criticalStyle) {
    criticalStyle.remove();
  }
}
