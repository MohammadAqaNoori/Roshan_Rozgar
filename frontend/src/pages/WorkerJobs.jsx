import { Icon } from '../lib/icons';
import { useApp, afn } from '../context/AppContext';
import { stIdx } from '../lib/data';

export default function WorkerJobs({ onNavigate }) {
  const { t, job, W } = useApp();
  const me = W('ahmad');

  const rows = [];
  if (job && job.status !== 'declined') {
    rows.push(
      <button key="active" className="listrow" style={{ width: '100%', background: 'none', borderInline: 0, borderBottom: 0, textAlign: 'start' }} onClick={() => onNavigate('chat')}>
        <span className="datebox" style={{ background: 'var(--amber)', color: 'var(--forest-900)' }}><b className="num">10</b><span>{t('Nov', 'نوامبر')}</span></span>
        <div className="grow"><b>{job.title}</b><div className="small muted">{t('Mariam N.', 'مریم ن.')} · {job.time}</div></div>
        <span className={`pill ${stIdx(job.status) >= stIdx('closed') ? 'pill-off' : stIdx(job.status) >= stIdx('confirmed') ? 'pill-info' : 'pill-busy'}`}>{job.status}</span>
      </button>
    );
  }

  return (
    <main className="appmain">
      <div className="wrap narrow stack" style={{ gap: 18 }}>
        <h1 style={{ fontSize: 28 }}>{t('My jobs', 'کارهای من')}</h1>
        <section className="card">
          {rows.length ? rows : (
            <div className="empty"><span className="tile"><Icon name="briefcase" /></span><b>{t('No jobs yet', 'هنوز هیچ کاری نیست')}</b></div>
          )}
        </section>
        <section className="card">
          <h3>{t('Completed', 'تکمیل شده')}</h3>
          {[
            ['05', t('Nov', 'نوامبر'), t('Tap & mixer', 'شیر و میکسر'),          t('Khalid F.', 'خالد ف.'),  1200],
            ['01', t('Nov', 'نوامبر'), t('Water tank float valve', 'شناور تانک آب'), t('Kamran T.', 'کامران ت.'), 900],
            ['29', t('Oct', 'اکتوبر'), t('Geyser pipe', 'لوله گیزر'),              t('Sana R.', 'ثنا ر.'),    1800],
          ].map(([d, m, title, n, p], i) => (
            <div key={i} className="listrow">
              <span className="datebox"><b className="num">{d}</b><span>{m}</span></span>
              <div className="grow"><b>{title}</b><div className="small muted">{n} · <span className="num">{afn(p)}</span></div></div>
              <Icon name="checkCircle" style={{ color: 'var(--success)' }} />
            </div>
          ))}
        </section>
        <p className="small muted">{me.jobs} {t('jobs completed in total', 'کار در مجموع تکمیل شده')}</p>
      </div>
    </main>
  );
}
