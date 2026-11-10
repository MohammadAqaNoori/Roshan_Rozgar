import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp, afn } from '../context/AppContext';
import { BookingTicket } from '../components/Shared';
import { catBy, stIdx } from '../lib/data';

export default function Track({ onNavigate }) {
  const { t, job, W, wname, customerConfirmDone, simWorkerStep, openModal } = useApp();

  if (!job || stIdx(job.status) < stIdx('confirmed')) {
    return (
      <main className="appmain">
        <div className="wrap narrow stack" style={{ gap: 18 }}>
          <h1 style={{ fontSize: 28 }}>{t('My bookings', 'میری بکنگ')}</h1>
          <div className="card empty">
            <span className="tile"><Icon name="calendar" /></span>
            <h3>{t('No active booking', 'کوئی فعال بکنگ نہیں')}</h3>
            <p className="muted">{t('Find a worker, agree a price in chat, and your booking will show up here.', 'کاریگر ڈھونڈیں، قیمت طے کریں، بکنگ یہاں نظر آئے گی۔')}</p>
            <button className="btn btn-primary" onClick={() => onNavigate('discover')}><Icon name="search" />{t('Find a worker', 'کاریگر ڈھونڈیں')}</button>
          </div>
        </div>
      </main>
    );
  }

  const w = W(job.workerId);

  const statusLabels = {
    confirmed: t('Confirmed', 'کنفرم'),
    onway: t('On the way', 'راستے میں'),
    working: t('In progress', 'جاری'),
    done: t('Awaiting your check', 'آپ کی تصدیق'),
    closed: t('Completed', 'مکمل'),
    reviewed: t('Completed & rated', 'مکمل'),
  };
  const st = statusLabels[job.status] || '';

  // Timeline
  const steps = [
    ['confirmed', 'check', t('Booking confirmed', 'بکنگ کنفرم'), job.log?.confirmed],
    ['onway', 'nav', t('Worker on the way', 'کاریگر راستے میں'), job.log?.onway],
    ['working', 'wrench', t('Work started', 'کام شروع'), job.log?.working],
    ['done', 'flag', t('Worker marked job complete', 'کاریگر نے کام مکمل کیا'), job.log?.done],
    ['closed', 'checkCircle', t('You confirmed completion', 'آپ نے تصدیق کی'), job.log?.closed],
  ];
  const cur = stIdx(job.status);

  // Action area
  let action = null;
  if (job.status === 'done') {
    action = (
      <div className="card stack" style={{ gap: 12, border: '2px solid var(--emerald)' }}>
        <b style={{ fontSize: 18 }}>{wname(w)} {t('says the job is finished.', 'کہتے ہیں کام مکمل ہو گیا۔')}</b>
        <p className="small muted">{t('Check the work, then confirm. If something is wrong, tell him in chat first.', 'کام چیک کریں پھر تصدیق کریں۔')}</p>
        <div className="row wrapit">
          <button className="btn btn-primary btn-lg grow" onClick={() => { customerConfirmDone(); onNavigate('review'); }}><Icon name="check" />{t('Yes, work is done', 'جی، کام ہو گیا')}</button>
          <button className="btn btn-outline btn-lg" onClick={() => onNavigate('chat')}><Icon name="flag" />{t('Report a problem', 'مسئلہ بتائیں')}</button>
        </div>
      </div>
    );
  } else if (job.status === 'closed') {
    action = <button className="btn btn-amber btn-lg btn-block" onClick={() => onNavigate('review')}><Icon name="star" />{t('Rate', 'ریٹ کریں')} {wname(w).split(' ')[0]}</button>;
  } else if (job.status === 'reviewed') {
    action = <div className="disclaimer" style={{ background: 'var(--success-50)' }}><Icon name="checkCircle" /><span>{t('Thanks! Your review is on his profile.', 'شکریہ! آپ کا ریویو پروفائل پر ہے۔')}</span></div>;
  } else {
    action = (
      <>
        <div className="disclaimer"><Icon name="info" /><span>{t('Status updates come from the worker\u2019s app. There is no live GPS tracking.', 'اپ ڈیٹ کاریگر کی ایپ سے آتی ہیں۔ لائیو جی پی ایس نہیں۔')}</span></div>
        <button className="btn btn-outline btn-block" onClick={simWorkerStep}><Icon name="refresh" />{t('Demo: simulate next update from worker', 'ڈیمو: کاریگر کی اگلی اپ ڈیٹ')}</button>
      </>
    );
  }

  // History
  const history = (
    <section className="card">
      <h3>{t('Booking history', 'پرانی بکنگ')}</h3>
      <div style={{ marginTop: 8 }}>
        {[['28', 'Oct', 'Ceiling fan wiring', 'Abdul Rehman', 1200], ['02', 'Sep', 'AC service (1.5 ton)', 'Shahid Mehmood', 2500]].map(([d, m, ti, n, p], i) => (
          <div key={i} className="listrow">
            <span className="datebox"><b className="num">{d}</b><span>{m}</span></span>
            <div className="grow"><b>{ti}</b><div className="small muted">{n} · <span className="num">{afn(p)}</span></div></div>
            <span className="pill pill-off"><Icon name="check" />{t('Completed', 'مکمل')}</span>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <main className="appmain">
      <div className="wrap stack" style={{ gap: 18 }}>
        <div className="row between wrapit">
          <h1 style={{ fontSize: 'clamp(24px,3vw,32px)' }}>{t('Your booking', 'آپ کی بکنگ')}</h1>
          <span className={`pill ${job.status === 'reviewed' || job.status === 'closed' ? 'pill-av' : 'pill-info'}`} style={{ fontSize: 14, padding: '6px 14px' }}>{st}</span>
        </div>

        <div className="track-layout">
          <div className="stack" style={{ gap: 18 }}>
            <BookingTicket j={job} w={w} statusLabel="" />
          </div>
          <div className="stack" style={{ gap: 16 }}>
            <section className="card">
              <h3 style={{ marginBottom: 16 }}>{t('Progress', 'پیش رفت')}</h3>
              <ol className="timeline">
                {steps.map(([s, i, label, time], idx) => {
                  const k = stIdx(s);
                  const cls = k <= cur ? 'done' : k === cur + 1 ? 'now' : '';
                  return (
                    <li key={s} className={cls}>
                      <span className="nd"><Icon name={i} /></span>
                      <div>
                        <b>{label}</b>
                        <small>{time ? t('Reported by the worker', 'کاریگر نے بتایا') : cls === 'now' ? t('Next', 'اگلا') : t('Pending', 'باقی')}</small>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
            {action}
            <div className="row">
              <button className="btn btn-outline grow" onClick={() => openModal('call')}><Icon name="phone" />{t('Call', 'کال')}</button>
              <button className="btn btn-outline grow" onClick={() => onNavigate('chat')}><Icon name="msg" />{t('Chat', 'چیٹ')}</button>
              {stIdx(job.status) < stIdx('onway') && <button className="btn btn-danger" onClick={() => openModal('cancel')}>{t('Cancel', 'منسوخ')}</button>}
            </div>
          </div>
        </div>
        {history}
      </div>
    </main>
  );
}
