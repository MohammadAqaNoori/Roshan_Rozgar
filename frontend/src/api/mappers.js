/**
 * Mappers — convert backend API response shapes to the frontend's expected format.
 * This lets the existing pages work without modification while data comes from the real API.
 */

import { CATS } from '../lib/data';

/**
 * Map a backend WorkerNearbyOut / WorkerWithUserOut → frontend worker object.
 * Frontend pages expect: { id, name, nameFa, cat, exp, area, city, km, rating, count, jobs, price, status, skills[], days[], hours, lat, lng, reviews[], langs, phone, since }
 * Backend returns: { id, user_id, trade, experience_years, area_name, lat, lng, status, is_available, rating_avg, total_jobs, total_reviews, skills, days, hours, distance_km, user_name, user_phone }
 */
export function mapWorker(w) {
  if (!w) return null;
  const skills = w.skills ? w.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const days = w.days ? w.days.split(',').map(d => d.trim()).filter(Boolean) : [];

  // Extract city from area_name (format: "Shahr-e-Naw, Kabul")
  const areaParts = (w.area_name || '').split(',').map(s => s.trim());
  const area = areaParts[0] || '';
  const city = areaParts[1] || '';

  // Map backend trade to frontend cat (they're the same string in most cases)
  const trade = w.trade || '';
  const catObj = CATS.find(c => c.id === trade || c.id === trade.replace('_technician', '')) || CATS[0];

  return {
    id: String(w.id),
    name: w.user_name || w.name || 'Unknown',
    nameFa: w.user_name || w.name || 'نامعلوم',
    cat: catObj.id,
    exp: w.experience_years || 0,
    area: area,
    city: city,
    km: w.distance_km != null ? w.distance_km : 0,
    rating: w.rating_avg || 0,
    count: w.total_reviews || 0,
    jobs: w.total_jobs || 0,
    price: 300, // default visit price — backend doesn't store this yet
    status: w.status || 'offline',
    freeAt: '',
    skills: skills,
    langs: '',
    phone: w.user_phone || '',
    since: String(new Date(w.created_at || Date.now()).getFullYear()),
    days: days,
    hours: w.hours || '',
    lat: w.lat,
    lng: w.lng,
    reviews: [], // loaded separately via getWorkerReviews
  };
}

/**
 * Map a backend JobOut → frontend job object.
 * Frontend expects: { id, workerId, cat, title, details, time, address, price, status, log }
 * Backend returns: { id, customer_id, worker_id, title, description, trade_required, area_name, agreed_price, currency, status, scheduled_time, created_at }
 */
export function mapJob(j) {
  if (!j) return null;
  return {
    id: `KR-${String(j.id).padStart(4, '0')}`,
    _apiId: j.id,  // keep the real ID for API calls
    workerId: j.worker_id ? String(j.worker_id) : null,
    cat: j.trade_required || '',
    title: j.title || 'Job request',
    description: j.description || '',
    details: j.description ? [j.description] : [],
    time: j.scheduled_time ? new Date(j.scheduled_time).toLocaleString() : 'Flexible',
    address: j.area_name || '',
    price: j.agreed_price,
    status: j.status || 'requested',
    reviewed: false,
    log: {},
    lat: j.lat,
    lng: j.lng,
  };
}

/**
 * Map a backend MessageOut → frontend message object.
 * Frontend expects: { id, from, type, text, time, dur, amount, note, state, tr }
 * Backend returns: { id, job_id, sender_id, type, content, audio_url, transcript, offer_amount, offer_note, offer_state, created_at }
 *
 * @param {object} m - backend message
 * @param {number} currentUserId - current user's ID to determine 'from' (me vs them)
 */
export function mapMessage(m, currentUserId) {
  if (!m) return null;

  const from = m.sender_id === currentUserId ? 'me' : 'them';
  const time = new Date(m.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  if (m.type === 'text') {
    return { id: `m${m.id}`, from, type: 'text', text: m.content || '', time };
  }

  if (m.type === 'voice') {
    return {
      id: `m${m.id}`,
      from,
      type: 'voice',
      text: m.transcript || '',
      dur: '0:06',
      time,
      audio_url: m.audio_url,
    };
  }

  if (m.type === 'offer') {
    return {
      id: `m${m.id}`,
      from,
      type: 'offer',
      amount: m.offer_amount,
      note: m.offer_note || '',
      state: m.offer_state || 'open',
      time,
    };
  }

  return { id: `m${m.id}`, from: 'sys', type: 'text', text: m.content || '', time };
}

/**
 * Map a backend ReviewOut → frontend review object.
 * Frontend expects: { by, area, stars, q, p, t, text, date, tags[] }
 * Backend returns: { id, job_id, customer_id, worker_id, rating, text_review, quality_rating, professionalism_rating, timeliness_rating, tags, created_at }
 *
 * @param {object} r - backend review
 * @param {string} customerName - name of the customer who left the review
 */
export function mapReview(r, customerName = 'Customer') {
  if (!r) return null;
  const tags = r.tags ? r.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  return {
    id: `rv${r.id}`,
    by: customerName,
    area: '',
    stars: r.rating,
    q: r.quality_rating || 0,
    p: r.professionalism_rating || 0,
    t: r.timeliness_rating || 0,
    text: r.text_review || r.voice_transcript || '',
    date: new Date(r.created_at).toLocaleDateString(),
    tags: tags,
  };
}
