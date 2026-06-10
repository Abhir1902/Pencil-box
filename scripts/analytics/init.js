// Initialize Vercel Web Analytics
import { inject } from './vercel-analytics.js';

// Inject analytics with auto mode detection
inject({
  mode: 'auto', // Automatically detect production/development
  debug: false  // Set to true for debugging in development
});
