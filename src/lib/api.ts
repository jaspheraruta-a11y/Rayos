// Use relative URL in dev so Vite proxy forwards /api to the backend; override with VITE_API_URL if needed
const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '' : 'http://localhost:3001');

export function getToken(): string | null {
  return localStorage.getItem('token');
}

async function apiFetch(url: string, options?: RequestInit) {
  try {
    return await fetch(`${API_URL}${url}`, options);
  } catch (err) {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new Error('Cannot reach the backend. Start it with: cd backend && npm run dev');
    }
    throw err;
  }
}

function getErrorMessage(res: Response, data: { error?: string }, fallback: string): string {
  if (data?.error && typeof data.error === 'string') return data.error;
  if (res.status === 502 || res.status === 503) {
    return 'API backend is not running. Start it with: cd backend && npm run dev';
  }
  return fallback;
}

export async function register(email: string, password: string, username?: string) {
  const res = await apiFetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(getErrorMessage(res, data, 'Registration failed'));
  }
  return data;
}

export async function login(email: string, password: string) {
  const res = await apiFetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(getErrorMessage(res, data, 'Login failed'));
  }
  return data;
}

export async function getMe(): Promise<{ user: ApiUser } | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await apiFetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export interface ApiUser {
  id: string;
  email: string;
  username?: string;
  created_at?: string;
  last_sign_in_at?: string;
}
