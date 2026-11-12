/**
 * Global app state — Karigar v2.0 (Afghanistan)
 * Language: English (en) + Dari (fa)
 */
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { seedWorkers, CUSTOMER, DEFAULT_JOB, classify, catBy, stIdx } from '../lib/data';

const KEY = 'karigar-v1';

const freshState = () => ({
  lang: 'en',
  role: 'customer',
  workers: seedWorkers(),
  ob: {
    step: 0,
    lang: 'fa',
    name: '',
    nameState: 'idle',
    profession: '',
    skills: [],
    area: '',
    exp: '',
    photo: '',
    days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    hours: '8 AM – 7 PM',
    done: false,
  },
  f: { q: '', cat: 'plumber', dist: 5, availOnly: false, minRating: 0, view: 'list' },
  sel: 'ahmad',
  req: {
    voiceState: 'idle',
    transcript: '',
    text: '',
    cat: '',
    aiCat: '',
    answers: {},
    photo: '',
    imgState: 'idle',
    time: 'Today, 4–6 PM',
    address: CUSTOMER.address,
  },
  job: null,
  msgs: [],
  rv: { stars: 0, q: 0, p: 0, t: 0, tags: [], text: '', voice: false, photo: false },
  lastReviewId: null,
  notifs: 0,
  _fopen: false,
  _modal: null,
  _counter: null,
  _playing: null,
  _rec: false,
  _typing: false,
  _confirming: false,
  _loading: false,
});

// Load from localStorage
const loadState = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && p.workers) return { ...freshState(), ...p };
    }
  } catch (e) {}
  return freshState();
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);
  const toastTimer = useRef(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Persist to localStorage
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }, [state]);

  // Sync lang/dir to <html>
  useEffect(() => {
    document.documentElement.lang = state.lang;
    // Dari (fa) is RTL; English (en) is LTR
    document.documentElement.dir = state.lang === 'fa' ? 'rtl' : 'ltr';
  }, [state.lang]);

  // While in worker onboarding, ob.lang is the user's chosen language.
  // Sync it to <html> immediately so the onboarding screen reflects the
  // picked language even before the global state.lang is updated.
  useEffect(() => {
    if (!state.ob || state.ob.done) return;
    const L = state.ob.lang || 'en';
    document.documentElement.lang = L;
    document.documentElement.dir = L === 'fa' ? 'rtl' : 'ltr';
  }, [state.ob?.lang, state.ob?.done]);

  // Helper to update state
  const update = useCallback((updater) => {
    setState((prev) => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  }, []);

  // Language helpers — 'fa' = Dari
  const fa = useCallback(() => state.lang === 'fa', [state.lang]);
  // t(english, dari) — returns the right string for current lang
  const t = useCallback((en, d) => (fa() && d ? d : en), [fa]);

  // Worker helpers
  const W = useCallback((id) => state.workers.find((w) => w.id === id), [state.workers]);
  const wname = useCallback((w) => (fa() ? w.nameFa : w.name), [fa]);
  const catName = useCallback((id) => { const c = catBy(id); return fa() ? c.fa : c.en; }, [fa]);

  // Toast
  const showToast = useCallback((msg, ok = false) => {
    setToastMsg({ msg, ok, id: Date.now() });
    setTimeout(() => setToastMsg(null), 2800);
  }, []);

  // Speech synthesis — supports Dari (fa-AF / fa)
  const speak = useCallback((en, d) => {
    try {
      if (window.speechSynthesis) {
        speechSynthesis.cancel();
        const voices = speechSynthesis.getVoices() || [];
        // Prefer fa-AF, fa-IR, then any Persian/Dari voice
        const faV = voices.find((v) => /^fa/i.test(v.lang));
        const useFa = fa() && faV;
        const ut = new SpeechSynthesisUtterance(useFa ? d : en);
        if (useFa) { ut.voice = faV; ut.lang = faV.lang; } else ut.lang = 'en-US';
        ut.rate = 0.95;
        speechSynthesis.speak(ut);
      }
    } catch (e) {}
  }, [fa]);

  // Actions
  const actions = {
    setLang: (lang) => update({ lang }),
    setRole: (role) => update({ role }),

    // Start a fresh customer signup
    startCustomerSignup: () => update((s) => ({
      ...freshState(),
      lang: s.lang,
      role: 'customer',
    })),

    // Start a fresh worker signup
    startWorkerSignup: () => update((s) => ({
      ...freshState(),
      lang: s.lang,
      role: 'worker',
      ob: { ...freshState().ob, step: 0, done: false },
    })),

    // Onboarding
    obNext: () => update((s) => ({ ...s, ob: { ...s.ob, step: Math.min(s.ob.step + 1, 9) } })),
    obBack: () => update((s) => ({ ...s, ob: { ...s.ob, step: Math.max(s.ob.step - 1, 0) } })),
    obJump: (step) => update((s) => ({ ...s, ob: { ...s.ob, step } })),
    obLang: (lang) => update((s) => ({ ...s, ob: { ...s.ob, lang }, lang })),
    obSet: (data) => update((s) => ({ ...s, ob: { ...s.ob, ...data } })),
    obNameListen: () => {
      update((s) => ({ ...s, ob: { ...s.ob, nameState: 'listening' } }));
      setTimeout(() => {
        update((s) => ({ ...s, ob: { ...s.ob, nameState: 'heard', name: 'Ahmad Shah' } }));
      }, 1800);
    },
    obNameYes: () => update((s) => ({ ...s, ob: { ...s.ob, nameState: 'confirmed' } })),
    obNameNo: () => update((s) => ({ ...s, ob: { ...s.ob, nameState: 'failed' } })),
    obNameRedo: () => update((s) => ({ ...s, ob: { ...s.ob, nameState: 'idle' } })),
    obTyped: (name) => update((s) => ({ ...s, ob: { ...s.ob, name: name, nameState: 'confirmed' } })),
    obProf: (profession) => update((s) => ({ ...s, ob: { ...s.ob, profession } })),
    obSkill: (skill) => update((s) => {
      const skills = s.ob.skills.includes(skill) ? s.ob.skills.filter((x) => x !== skill) : [...s.ob.skills, skill];
      return { ...s, ob: { ...s.ob, skills } };
    }),
    obArea: (area) => update((s) => ({ ...s, ob: { ...s.ob, area } })),
    obExp: (exp) => update((s) => ({ ...s, ob: { ...s.ob, exp } })),
    obDay: (day) => update((s) => {
      const days = s.ob.days.includes(day) ? s.ob.days.filter((x) => x !== day) : [...s.ob.days, day];
      return { ...s, ob: { ...s.ob, days } };
    }),
    obHours: (hours) => update((s) => ({ ...s, ob: { ...s.ob, hours } })),
    obFinish: () => update((s) => ({ ...s, ob: { ...s.ob, done: true } })),

    // Filters
    setFilter: (data) => update((s) => ({ ...s, f: { ...s.f, ...data } })),
    toggleFilters: () => update((s) => ({ ...s, _fopen: !s._fopen })),
    setView: (view) => update((s) => ({ ...s, f: { ...s.f, view } })),

    // Selection
    selectWorker: (id) => update({ sel: id }),

    // Request
    reqListen: () => {
      update((s) => ({ ...s, req: { ...s.req, voiceState: 'listening' } }));
      setTimeout(() => {
        const transcript = 'لوله زیر آشپزخانه نشت می‌کند، آب می‌چکد. لطفاً امروز بیایید.';
        update((s) => ({
          ...s,
          req: {
            ...s.req,
            voiceState: 'idle',
            transcript,
            aiCat: classify(transcript),
            cat: classify(transcript),
          },
        }));
      }, 2000);
    },
    reqSet: (data) => update((s) => ({ ...s, req: { ...s.req, ...data } })),
    reqAnalyse: () => {
      const text = state.req.text || state.req.transcript;
      const cat = classify(text);
      update((s) => ({ ...s, req: { ...s.req, aiCat: cat, cat: cat || s.req.cat } }));
    },
    reqAnswer: (k, v) => update((s) => ({ ...s, req: { ...s.req, answers: { ...s.req.answers, [k]: v } } })),
    reqSend: () => {
      const job = DEFAULT_JOB();
      update((s) => ({
        ...s,
        job,
        msgs: [
          {
            id: 'm1',
            from: 'customer',
            type: 'text',
            text: s.req.transcript || s.req.text || 'Job request',
            time: nowTime(),
          },
          {
            id: 'sys1',
            from: 'sys',
            type: 'text',
            html: 'Job request sent. The worker will reply soon.',
            time: nowTime(),
          },
        ],
      }));
    },

    // Chat
    sendMsg: (text, type = 'text') => {
      update((s) => ({
        ...s,
        msgs: [...s.msgs, { id: 'm' + Date.now(), from: s.role, type, text, time: nowTime() }],
      }));
      // Simulate worker reply
      setTimeout(() => {
        update((s) => ({ ...s, _typing: true }));
        setTimeout(() => {
          update((s) => ({
            ...s,
            _typing: false,
            msgs: [...s.msgs, { id: 'm' + Date.now(), from: s.role === 'customer' ? 'worker' : 'customer', type: 'text', text: 'بسیار خوب، می‌توانم ساعت ۴ بیایم.', time: nowTime() }],
          }));
        }, 1200);
      }, 800);
    },
    sendVoice: (text = 'Voice note transcribed by AI') => {
      update((s) => ({
        ...s,
        msgs: [...s.msgs, { id: 'm' + Date.now(), from: s.role, type: 'voice', text, dur: '0:12', time: nowTime() }],
      }));
    },
    sendOffer: (amount, note) => {
      update((s) => ({
        ...s,
        _modal: null,
        msgs: [...s.msgs, {
          id: 'm' + Date.now(),
          from: s.role,
          type: 'offer',
          amount,
          note: note || '',
          state: 'open',
          time: nowTime(),
        }],
      }));
    },
    acceptOffer: (msgId) => {
      update((s) => {
        const offerMsg = s.msgs.find((m) => m.id === msgId);
        const price = offerMsg?.amount ?? s.job?.price;
        return {
          ...s,
          msgs: s.msgs.map((m) =>
            m.id === msgId
              ? { ...m, state: 'accepted' }
              : m.type === 'offer' && m.state === 'open'
              ? { ...m, state: 'superseded' }
              : m
          ),
          job: s.job ? { ...s.job, status: 'agreed', price } : null,
        };
      });
    },
    quickReply: (text) => {
      actions.sendMsg(text);
    },

    clearChat: () => update((s) => ({ ...s, msgs: [], job: null })),

    // Booking
    confirmBooking: () => {
      update((s) => {
        if (!s.job) return s;
        const workers = s.workers.map((w) => w.id === s.job.workerId ? { ...w, status: 'busy' } : w);
        return { ...s, workers, job: { ...s.job, status: 'confirmed', log: { ...s.job.log, confirmed: true } } };
      });
      showToast('Booking confirmed', true);
    },
    simCustomerConfirm: () => {
      update((s) => {
        if (!s.job) return s;
        return { ...s, job: { ...s.job, status: 'confirmed', log: { ...s.job.log, confirmed: true } } };
      });
    },
    workerStep: () => {
      update((s) => {
        if (!s.job) return s;
        const j = s.job;
        const next = { confirmed: 'onway', onway: 'working', working: 'done' }[j.status];
        if (!next) return s;
        return { ...s, job: { ...j, status: next, log: { ...j.log, [next]: true } } };
      });
    },
    customerConfirmDone: () => {
      update((s) => {
        if (!s.job) return s;
        return { ...s, job: { ...s.job, status: 'closed', log: { ...s.job.log, closed: true } } };
      });
    },
    simWorkerStep: () => actions.workerStep(),
    simIncoming: () => {
      const job = DEFAULT_JOB();
      update((s) => ({ ...s, job, notifs: 1 }));
    },

    // Review
    rvStar: (n) => update((s) => ({ ...s, rv: { ...s.rv, stars: n } })),
    rvSub: (k, n) => update((s) => ({ ...s, rv: { ...s.rv, [k]: n } })),
    rvTag: (tag) => update((s) => {
      const tags = s.rv.tags.includes(tag) ? s.rv.tags.filter((x) => x !== tag) : [...s.rv.tags, tag];
      return { ...s, rv: { ...s.rv, tags } };
    }),
    rvText: (text) => update((s) => ({ ...s, rv: { ...s.rv, text } })),
    rvVoice: () => update((s) => ({ ...s, rv: { ...s.rv, voice: !s.rv.voice } })),
    rvPhoto: () => update((s) => ({ ...s, rv: { ...s.rv, photo: !s.rv.photo } })),
    rvSubmit: () => {
      update((s) => {
        if (!s.job) return s;
        const workers = s.workers.map((w) => {
          if (w.id !== s.job.workerId) return w;
          const newReview = {
            by: CUSTOMER.name.split(' ')[0] + ' ' + CUSTOMER.name.split(' ')[1][0] + '.',
            area: CUSTOMER.area,
            stars: s.rv.stars,
            q: s.rv.q,
            p: s.rv.p,
            t: s.rv.t,
            text: s.rv.text,
            date: 'just now',
            tags: s.rv.tags,
            id: 'rv' + Date.now(),
          };
          return { ...w, reviews: [newReview, ...w.reviews], count: w.count + 1, rating: ((w.rating * w.count) + s.rv.stars) / (w.count + 1) };
        });
        return { ...s, workers, job: { ...s.job, status: 'reviewed' }, lastReviewId: 'rv' + Date.now() };
      });
      showToast('Review added to profile', true);
    },

    // Worker availability
    setAvail: (status) => update((s) => {
      const targetId = s.ob?.name
        ? s.workers.find((w) => w.name === s.ob.name || w.nameFa === s.ob.name)?.id ?? 'ahmad'
        : 'ahmad';
      const workers = s.workers.map((w) => w.id === targetId ? { ...w, status, is_available: status === 'available' } : w);
      return { ...s, workers };
    }),

    // Modal
    openModal: (m) => update({ _modal: m }),
    closeModal: () => update({ _modal: null }),
    setCounter: (v) => update({ _counter: v }),

    // Misc
    togglePlay: (id) => update((s) => ({ ...s, _playing: s._playing === id ? null : id })),
    toggleRec: () => update((s) => ({ ...s, _rec: !s._rec })),
    reset: () => {
      try { localStorage.removeItem(KEY); } catch (e) {}
      setState(freshState());
      showToast('Demo reset to the start', true);
    },

    // Logout — clears stored session and navigates to home/login
    logout: (onNavigate) => {
      try { localStorage.removeItem(KEY); } catch (e) {}
      setState(freshState());
      showToast('Signed out successfully', true);
      if (onNavigate) onNavigate('home');
    },
  };

  const value = {
    ...state,
    fa,
    t,
    W,
    wname,
    catName,
    catBy,
    speak,
    showToast,
    toastMsg,
    ...actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

function nowTime() {
  const d = new Date();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

// Afghan Afghani currency formatter
// e.g. afn(300) → "؋ 300"
export const afn = (n) => '؋ ' + Number(n).toLocaleString('fa-AF');
