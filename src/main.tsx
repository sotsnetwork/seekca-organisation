import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { inject } from '@vercel/analytics'
import App from './App.tsx'
import './index.css'

// Initialize Vercel Analytics
inject()

// Register Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
