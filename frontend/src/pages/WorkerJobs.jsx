import { useEffect, useState } from 'react';
import { Icon } from '../lib/icons';
import { useApp, afn } from '../context/AppContext';
import { stIdx } from '../lib/data';
import { listJobs } from '../api/jobs';

export default function WorkerJobs({ onNavigate }) {
  const { t, job, W, user, workers, liveMode } = useApp();
  const me = W('ahmad');

  // In live mode, load real job list from API
  const [liveJobs, setLiveJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!liveMode) return;
    setLoading(true);
    listJobs()
      .then((jobs) => { setLiveJobs(jobs || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [liveMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Current active job row
  const rows = [];
  if (job && job.status !== 'declined') {
    rows.push(
      <button
        key="active"
        className="listrow"
        style={{ width: '100%', background: 'none', borderInline: 0, borderBottom: 0, textAlign: 'start' }}
        onClick={() => onNavigate('chat')}
      >
        <span className="datebox" style={{ background: 'var(--amber)', color: 'var(--forest-900)' }}>
          <b className="num">{new Date().getDate()}</b>
          <span>{new Date().toLocaleString('en', { month: 'short' })}</span>
        </span>
        <div className="grow">
          <b>{job.title}</b>
          <div className="small muted">{job.time}</div>
        </div>
        <span className={`pill ${stIdx(job.status) >= stIdx('closed') ? 'pill-off' : stIdx(job.status) >= stIdx('confirmed') ? 'pill-info' : 'pill-busy'}`}>
          {job.status}
        </span>
      </button>
    );
  }

  // Completed jobs — use live API data if available, otherwise show demo data
  const completedJobs = liveMode && liveJobs.length
    ? liveJobs
        .filter((j) => j.status === 'completed')
        .map((j) => ({
          d: new Date(j.created_at).getDate(),
          m: new Date(j.created_at).toLocaleString('en', { month: 'short' }),
          title: j.title || t('Job', 'کار'),
          name: t('Customer', 'مشتری'),
          price: j.agreed_price || 0,
        }))
    : [
        { d: '05', m: t('Nov', 'نوامبر'), title: t('Tap & mixer',          'شیر و میکسر'),          name: t('Khalid F.', 'خالد ف.'),  price: 1200 },
        { d: '01', m: t('Nov', 'نوامبر'), title: t('Water tank float valve','شناور تانک آب'),       name: t('Ahmad N.',  'احمد ن.'),  price: 900  },
        { d: '29', m: t('Oct', 'اکتوبر'), title: t('Geyser pipe',           'لوله گیزر'),            name: t('Mariam R.', 'مریم ر.'),  price: 1800 },
      ];

  const totalJobs = liveMode && liveJobs.length ? liveJobs.length : (me?.jobs || 0);

  return (
    <main className="appmain">
      <div className="wrap narrow stack" style={{ gap: 18 }}>
        <h1 style={{ fontSize: 28 }}>{t('My jobs', 'کارهای من')}</h1>

        {/* Active / incoming job */}
        <section className="card">
          {rows.length ? rows : (
            <div className="empty">
              <span className="tile"><Icon name="briefcase" /></span>
              <b>{t('No active job right now', 'هیچ کار فعالی در حال حاضر نیست')}</b>
              <span className="muted small">{t('New requests will appear here.', 'درخواست‌های جدید اینجا نمایش داده می‌شوند.')}</span>
            </div>
          )}
        </section>

        {/* Completed jobs */}
        <section className="card">
          <h3>{t('Completed', 'تکمیل شده')}</h3>
          {loading ? (
            <div className="stack" style={{ gap: 8, marginTop: 10 }}>
              {[1, 2, 3].map((i) => <div key={i} className="skel" style={{ height: 52, borderRadius: 12 }} />)}
            </div>
          ) : completedJobs.length === 0 ? (
            <p className="muted small" style={{ marginTop: 10 }}>{t('No completed jobs yet.', 'هنوز هیچ کاری تکمیل نشده.')}</p>
          ) : (
            completedJobs.map(({ d, m, title, name, price }, i) => (
              <div key={i} className="listrow">
                <span className="datebox"><b className="num">{d}</b><span>{m}</span></span>
                <div className="grow">
                  <b>{title}</b>
                  <div className="small muted">{name} · <span className="num">{afn(price)}</span></div>
                </div>
                <Icon name="checkCircle" style={{ color: 'var(--success)' }} />
              </div>
            ))
          )}
        </section>

        <p className="small muted">
          {totalJobs} {t('jobs completed in total', 'کار در مجموع تکمیل شده')}
        </p>
      </div>
    </main>
  );
}
