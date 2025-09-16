import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { inject } from '@vercel/analytics'
import App from './App.tsx'
import './index.css'

// Initialize Vercel Analytics
inject()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
