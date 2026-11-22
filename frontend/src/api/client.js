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
