import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// --- RESIZEOBSERVER PATCH ---
// Intercepts the harmless browser layout shift warning before it hits 
// Angular's global error listener and crashes the change-detection loop.
window.addEventListener('error', (event) => {
  if (
    event.message === 'ResizeObserver loop completed with undelivered notifications.' ||
    event.message === 'ResizeObserver loop limit exceeded'
  ) {
    event.stopImmediatePropagation();
  }
});
// ----------------------------

bootstrapApplication(App, appConfig).catch((err) => console.error(err));