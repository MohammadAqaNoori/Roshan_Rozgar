/**
 * Auth API — register, login, profile.
 */
import { api, setToken, clearToken, getToken } from './client';

/**
 * Register a new user.
 * @param {string} phone    — e.g. "+93700123456"
 * @param {string} name     — display name
 * @param {string} role     — "customer" | "worker"
 * @returns {Promise<{access_token, user}>}
 */
export async function register(phone, name, role) {
  const res = await api.post('/auth/register', { phone, name, role });
  setToken(res.data.access_token);
  return res.data;
}

/**
 * Login with phone number (OTP simulated — any existing phone works).
 * @param {string} phone
 * @returns {Promise<{access_token, user}>}
 */
export async function login(phone) {
  const res = await api.post('/auth/login', { phone });
  setToken(res.data.access_token);
  return res.data;
}

/**
 * Get current user from token.
 * @returns {Promise<object|null>} user object or null if not authenticated
 */
export async function getMe() {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch {
    return null;
  }
}

/**
 * Update display name.
 */
export async function updateName(name) {
  const res = await api.patch('/auth/me/name', null, { params: { name } });
  return res.data;
}

/**
 * Logout — clear token locally.
 */
export function logout() {
  clearToken();
}

export function isLoggedIn() {
  return !!getToken();
}
