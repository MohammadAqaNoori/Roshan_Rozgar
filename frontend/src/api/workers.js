/**
 * Workers API — discovery, profile, onboarding, availability.
 */
import { api } from './client';

/**
 * Find workers near a location.
 * @param {number} lat
 * @param {number} lng
 * @param {object} opts — { trade, radius_km, available_only }
 * @returns {Promise<array>} workers sorted by distance
 */
export async function findNearby(lat, lng, opts = {}) {
  const res = await api.get('/workers/nearby', {
    params: { lat, lng, ...opts },
  });
  return res.data;
}

/**
 * Get a worker's public profile by ID.
 * @param {number} id
 */
export async function getWorker(id) {
  const res = await api.get(`/workers/${id}`);
  return res.data;
}

/**
 * Get the current user's worker profile (requires worker role).
 */
export async function getMyProfile() {
  const res = await api.get('/workers/me');
  return res.data;
}

/**
 * Create a worker profile after onboarding.
 * @param {object} data — { name, trade, experience_years, bio, area_name, lat, lng }
 */
export async function createProfile(data) {
  const res = await api.post('/workers/', data);
  return res.data;
}

/**
 * Update worker profile fields.
 * @param {object} data — any of { name, trade, experience_years, bio, area_name, lat, lng, skills, days, hours }
 */
export async function updateProfile(data) {
  const res = await api.patch('/workers/me', data);
  return res.data;
}

/**
 * Toggle availability.
 * @param {string} status — "available" | "busy" | "offline"
 */
export async function updateStatus(status) {
  const res = await api.patch('/workers/me/status', { status });
  return res.data;
}

/**
 * Voice onboarding — upload audio, Gemini extracts profile.
 * @param {Blob} audioBlob
 * @param {string} mimeType
 * @returns {Promise<{extracted: object, ai_used: boolean}>}
 */
export async function voiceOnboard(audioBlob, mimeType = 'audio/webm') {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice.webm');
  const res = await api.post('/workers/me/voice-onboard', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

/**
 * Get reviews for a worker.
 * @param {number} workerId
 */
export async function getWorkerReviews(workerId) {
  const res = await api.get(`/reviews/worker/${workerId}`);
  return res.data;
}
