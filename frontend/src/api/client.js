/**
 * Axios instance with JWT auth — the single API client for Karigar.
 *
 * Usage:
 *   import { api } from '../api/client';
 *   const workers = await api.get('/workers/nearby', { params: { lat, lng } });
 *
 * The token is stored in localStorage and attached to every request.
 * On 401, the token is cleared and the user is sent to re-auth.
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const TOKEN_KEY = 'karigar_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Normalise an Afghan phone number to E.164 format (+93XXXXXXXXX).
 * Handles: 0700123456, 700123456, +93700123456, 93700123456
 *
 * Afghan numbers are 0 + 9 digits = 10 total (local) = +93 + 9 digits (E.164)
 * Valid: 0700123456 → +93700123456 (11 chars including +)
 */
export function normalisePhone(raw) {
  const digits = String(raw).replace(/\D/g, '');
  // Already has full country code e.g. 93700123456
  if (digits.startsWith('93') && digits.length >= 11) return '+' + digits;
  // Afghan local format with leading zero e.g. 0700123456
  if (digits.startsWith('0')) return '+93' + digits.slice(1);
  // Raw 9 subscriber digits without any prefix e.g. 700123456
  return '+93' + digits;
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      clearToken();
    }
    return Promise.reject(err);
  }
);

/**
 * Check if the backend is reachable.
 * Returns true/false. Used to decide demo mode vs live mode.
 */
export async function checkBackend() {
  try {
    const res = await axios.get(`${BASE_URL.replace('/api/v1', '')}/health`, { timeout: 3000 });
    return res.data && res.data.status === 'healthy';
  } catch {
    return false;
  }
}

export default api;
