/**
 * Reviews API — post-job trust building.
 */
import { api } from './client';

/**
 * Submit a text review.
 * @param {number} jobId
 * @param {object} data — { rating, text_review, quality_rating, professionalism_rating, timeliness_rating, tags }
 * @returns {Promise<ReviewOut>}
 */
export async function createReview(jobId, data) {
  const res = await api.post(`/reviews/job/${jobId}`, data);
  return res.data;
}

/**
 * Submit a voice review — Gemini transcribes.
 * @param {number} jobId
 * @param {number} rating
 * @param {Blob} audioBlob
 * @param {string} mimeType
 * @returns {Promise<ReviewOut>}
 */
export async function createVoiceReview(jobId, rating, audioBlob, mimeType = 'audio/webm') {
  const formData = new FormData();
  formData.append('rating', rating);
  formData.append('audio', audioBlob, 'review.webm');
  const res = await api.post(`/reviews/job/${jobId}/voice`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

/**
 * Get all reviews for a worker.
 * @param {number} workerId
 * @returns {Promise<array>}
 */
export async function getWorkerReviews(workerId) {
  const res = await api.get(`/reviews/worker/${workerId}`);
  return res.data;
}
