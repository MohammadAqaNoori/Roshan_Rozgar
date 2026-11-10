import { Icon } from '../lib/icons';
import { useApp, rs } from '../context/AppContext';
import { stIdx } from '../lib/data';

export default function WorkerJobs({ onNavigate }) {
  const { t, job, W } = useApp();
  const me = W('imran');

  const rows = [];
  if (job && job.status !== 'declined') {
    rows.push(
      <button key="active" className="listrow" style={{ width: '100%', background: 'none', borderInline: 0, borderBottom: 0, textAlign: 'start' }} onClick={() => onNavigate('chat')}>
        <span className="datebox" style={{ background: 'var(--amber)', color: 'var(--forest-900)' }}><b className="num">10</b><span>Nov</span></span>
        <div className="grow"><b>{job.title}</b><div className="small muted">{t('Ayesha Khan', 'عائشہ خان')} · {job.time}</div></div>
        <span className={`pill ${stIdx(job.status) >= stIdx('closed') ? 'pill-off' : stIdx(job.status) >= stIdx('confirmed') ? 'pill-info' : 'pill-busy'}`}>{job.status}</span>
      </button>
    );
  }

  return (
    <main className="appmain">
      <div className="wrap narrow stack" style={{ gap: 18 }}>
        <h1 style={{ fontSize: 28 }}>{t('My jobs', 'میرے کام')}</h1>
        <section className="card">
          {rows.length ? rows : (
            <div className="empty"><span className="tile"><Icon name="briefcase" /></span><b>{t('No jobs yet', 'ابھی کوئی کام نہیں')}</b></div>
          )}
        </section>
        <section className="card">
          <h3>{t('Completed', 'مکمل')}</h3>
          {[['05', 'Nov', 'Tap & mixer', 'Faisal M.', 1200], ['01', 'Nov', 'Water tank float valve', 'Kamran T.', 900], ['29', 'Oct', 'Geyser pipe', 'Sana R.', 1800]].map(([d, m, title, n, p], i) => (
            <div key={i} className="listrow">
              <span className="datebox"><b className="num">{d}</b><span>{m}</span></span>
              <div className="grow"><b>{title}</b><div className="small muted">{n} · <span className="num">{rs(p)}</span></div></div>
              <Icon name="checkCircle" style={{ color: 'var(--success)' }} />
            </div>
          ))}
        </section>
        <p className="small muted">{me.jobs} {t('jobs completed in total', 'کل مکمل کام')}</p>
      </div>
    </main>
  );
}
