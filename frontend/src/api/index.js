/**
 * API barrel export — import everything from one place.
 *
 * Usage:
 *   import { register, login, findNearby, createJob } from '../api';
 *   import { mapWorker, mapJob, mapMessage } from '../api';
 */
export { api, checkBackend, getToken, setToken, clearToken, isLoggedIn } from './client';
export * as authApi from './auth';
export * as workersApi from './workers';
export * as jobsApi from './jobs';
export * as messagesApi from './messages';
export * as reviewsApi from './reviews';
export { mapWorker, mapJob, mapMessage, mapReview } from './mappers';

// Re-export individual functions for convenience
export { register, login, getMe, updateName, logout } from './auth';
export { findNearby, getWorker, getMyProfile, createProfile, updateProfile, updateStatus, voiceOnboard, getWorkerReviews } from './workers';
export { createJob, createJobFromVoice, listJobs, getJob, updateJob } from './jobs';
export { getMessages, sendText, sendVoice, sendOffer, acceptOffer } from './messages';
export { createReview, createVoiceReview, getWorkerReviews as getReviews } from './reviews';
