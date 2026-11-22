/**
 * Messages API — chat text, voice, price offers.
 */
import { api } from './client';

/**
 * Get all messages in a job thread.
 * @param {number} jobId
 * @returns {Promise<array>}
 */
export async function getMessages(jobId) {
  const res = await api.get(`/messages/job/${jobId}`);
  return res.data;
}

/**
 * Send a text message.
 * @param {number} jobId
 * @param {string} content
 * @returns {Promise<MessageOut>}
 */
export async function sendText(jobId, content) {
  const formData = new FormData();
  formData.append('content', content);
  const res = await api.post(`/messages/job/${jobId}/text`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

/**
 * Upload a voice message — Gemini auto-transcribes.
 * @param {number} jobId
 * @param {Blob} audioBlob
 * @param {string} mimeType
 * @returns {Promise<MessageOut>} with transcript field
 */
export async function sendVoice(jobId, audioBlob, mimeType = 'audio/webm') {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice.webm');
  const res = await api.post(`/messages/job/${jobId}/voice`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

/**
 * Send a price offer.
 * @param {number} jobId
 * @param {number} amount
 * @param {string} note
 * @returns {Promise<MessageOut>}
 */
export async function sendOffer(jobId, amount, note = '') {
  const formData = new FormData();
  formData.append('amount', amount);
  formData.append('note', note);
  const res = await api.post(`/messages/job/${jobId}/offer`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

/**
 * Accept a price offer.
 * @param {number} jobId
 * @param {number} msgId
 * @returns {Promise<MessageOut>}
 */
export async function acceptOffer(jobId, msgId) {
  const res = await api.patch(`/messages/job/${jobId}/offer/${msgId}/accept`);
  return res.data;
}
