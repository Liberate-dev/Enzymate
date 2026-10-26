import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './i18n';
import './index.css';

// Registrasi Service Worker untuk notifikasi perangkat mobile (Android & iOS PWA)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('Enzymo Service Worker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('Enzymo Service Worker registration failed:', err);
      });
  });
}

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </React.StrictMode>
  );
}
