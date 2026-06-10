# Vercel Web Analytics Setup

This document describes the Vercel Web Analytics configuration for the Pencil Box project.

## What Was Installed

- **Package**: `@vercel/analytics` v2.0.1
- **Installation Date**: June 10, 2026
- **Framework**: Vanilla JavaScript (Static Site)

## Implementation Details

### Files Added/Modified

1. **package.json** - Added `@vercel/analytics` as a dependency
2. **package-lock.json** - Locked dependency versions
3. **scripts/analytics/vercel-analytics.js** - Core analytics library (copied from node_modules)
4. **scripts/analytics/init.js** - Analytics initialization script
5. **index.html** - Updated to use the new analytics module
6. **pages/demo/first.html** - Added analytics tracking

### How It Works

The implementation uses ES6 modules to load and initialize Vercel Web Analytics:

1. The main HTML files include: `<script type="module" src="scripts/analytics/init.js"></script>`
2. `init.js` imports the `inject()` function from the analytics library
3. Analytics is initialized with `mode: 'auto'` which automatically detects production/development environments
4. In production (when deployed), page views are tracked automatically
5. In development, events are logged to the console for debugging

### Configuration

The analytics is configured with:
- **Mode**: `auto` - Automatically detects environment (production/development)
- **Debug**: `false` - Set to `true` to enable debug logging in development

### Enabling Analytics on Vercel

To fully activate analytics:

1. Deploy the project to Vercel
2. Go to your project in the Vercel Dashboard
3. Navigate to the Analytics tab
4. Click "Enable" to activate Web Analytics
5. On the next deployment, analytics data will start flowing

### Verification

After deployment, verify analytics is working by:
1. Opening your deployed site in a browser
2. Opening browser DevTools > Network tab
3. Look for requests to Vercel analytics endpoints
4. Check your Vercel Dashboard > Analytics to see incoming data

### Local Development

When running locally (e.g., with Live Server):
- Analytics runs in development mode
- Events are logged to the browser console instead of being sent to Vercel
- This allows you to verify tracking without affecting production data

## References

- [Vercel Web Analytics Documentation](https://vercel.com/docs/analytics/quickstart)
- [@vercel/analytics npm package](https://www.npmjs.com/package/@vercel/analytics)
