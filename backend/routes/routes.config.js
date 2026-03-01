/**
 * API route definitions (CodeIgniter-style).
 * Single place to see every endpoint: method + path → handler description.
 * Actual handlers are in auth.js and health.js; this file documents and centralizes route paths.
 */

export const API_ROUTES = {
  // Auth (see routes/auth.js)
  auth: {
    register: { method: 'POST', path: '/register', description: 'Create new user account' },
    login: { method: 'POST', path: '/login', description: 'Sign in, returns JWT + user' },
    me: { method: 'GET', path: '/me', description: 'Current user from JWT (session restore)' },
  },
  // Health (see routes/health.js)
  health: {
    check: { method: 'GET', path: '/health', description: 'Server health check' },
  },
};

/** Full path for API base (mount prefix). Backend mounts these under /api. */
export const API_BASE = '/api';
