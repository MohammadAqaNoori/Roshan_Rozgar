/**
 * Jobs API — create, track, update status.
 */
import { api } from './client';

/**
 * Create a job request.
 * @param {object} data — { title, description, trade_required, area_name, lat, lng, worker_id, scheduled_time }
 * @returns {Promise<JobOut>}
 */
export async function createJob(data) {
  const res = await api.post('/jobs/', data);
  return res.data;
}

/**
 * Voice job creation — upload audio, Gemini extracts job details.
 * @param {Blob} audioBlob
 * @param {string} mimeType
 * @returns {Promise<{extracted: object, ai_used: boolean}>}
 */
export async function createJobFromVoice(audioBlob, mimeType = 'audio/webm') {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice.webm');
  const res = await api.post('/jobs/voice', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

/**
 * List jobs for the current user (customer or worker).
 * @returns {Promise<array>}
 */
export async function listJobs() {
  const res = await api.get('/jobs/');
  return res.data;
}

/**
 * Get a single job by ID.
 * @param {number} id
 * @returns {Promise<JobOut>}
 */
export async function getJob(id) {
  const res = await api.get(`/jobs/${id}`);
  return res.data;
}

/**
 * Update a job — assign worker, set price, change status.
 * @param {number} id
 * @param {object} data — { worker_id, agreed_price, status }
 * @returns {Promise<JobOut>}
 */
export async function updateJob(id, data) {
  const res = await api.patch(`/jobs/${id}`, data);
  return res.data;
}
