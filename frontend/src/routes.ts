/**
 * Central route definitions (CodeIgniter-style).
 * Single source of truth for all frontend paths — easy to see where every link goes.
 */

export const ROUTES = {
  /** Landing / login page — sign in form */
  login: '/login',
  /** Registration page — create account form */
  signup: '/signup',
  /** Authenticated user dashboard — after login */
  dashboard: '/dashboard',
  /** Root redirects to login or dashboard depending on auth */
  home: '/',
} as const;

export type RouteKey = keyof typeof ROUTES;

/** Get path for a named route (for programmatic navigation). */
export function route(name: RouteKey): string {
  return ROUTES[name];
}
