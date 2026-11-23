import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp, afn } from '../context/AppContext';
import { BookingTicket } from '../components/Shared';
import { catBy, stIdx } from '../lib/data';

export default function Track({ onNavigate }) {
  const { t, job, W, wname, customerConfirmDone, simWorkerStep, openModal, liveMode, apiUpdateJobStatus } = useApp();

  const handleConfirmDone = async () => {
    if (liveMode && apiUpdateJobStatus) {
      await apiUpdateJobStatus('completed');
    } else {
      customerConfirmDone();
    }
    onNavigate('review');
  };

  const handleSimWorker = async () => {
    if (liveMode && apiUpdateJobStatus) {
      const next = { confirmed: 'onway', onway: 'working', working: 'done' }[job?.status];
      if (next) await apiUpdateJobStatus(next);
    } else {
      simWorkerStep();
    }
  };

  if (!job || stIdx(job.status) < stIdx('confirmed')) {
    return (
      <main className="appmain">
        <div className="wrap narrow stack" style={{ gap: 18 }}>
          <h1 style={{ fontSize: 28 }}>{t('My bookings', 'رزروهای من')}</h1>
          <div className="card empty">
            <span className="tile"><Icon name="calendar" /></span>
            <h3>{t('No active booking', 'هیچ رزرو فعالی وجود ندارد')}</h3>
            <p className="muted">{t('Find a worker, agree a price in chat, and your booking will show up here.', 'یک کاریگر پیدا کنید، قیمت را در چت توافق کنید، رزرو اینجا نمایش داده می‌شود.')}</p>
            <button className="btn btn-primary" onClick={() => onNavigate('discover')}><Icon name="search" />{t('Find a worker', 'پیدا کردن کاریگر')}</button>
          </div>
        </div>
      </main>
    );
  }

  const w = W(job.workerId);

  const statusLabels = {
    confirmed: t('Confirmed', 'تأیید شد'),
    onway:     t('On the way', 'در راه'),
    working:   t('In progress', 'در حال انجام'),
    done:      t('Awaiting your check', 'در انتظار بررسی شما'),
    closed:    t('Completed', 'تکمیل شد'),
    reviewed:  t('Completed & rated', 'تکمیل و امتیازدهی شد'),
  };
  const st = statusLabels[job.status] || '';

  const steps = [
    ['confirmed', 'check',       t('Booking confirmed',          'رزرو تأیید شد'),           job.log?.confirmed],
    ['onway',     'nav',         t('Worker on the way',          'کاریگر در راه است'),        job.log?.onway],
    ['working',   'wrench',      t('Work started',               'کار شروع شد'),              job.log?.working],
    ['done',      'flag',        t('Worker marked job complete', 'کاریگر کار را تمام کرد'),  job.log?.done],
    ['closed',    'checkCircle', t('You confirmed completion',   'شما تکمیل را تأیید کردید'), job.log?.closed],
  ];
  const cur = stIdx(job.status);

  let action = null;
  if (job.status === 'done') {
    action = (
      <div className="card stack" style={{ gap: 12, border: '2px solid var(--emerald)' }}>
        <b style={{ fontSize: 18 }}>{wname(w)} {t('says the job is finished.', 'می‌گوید کار تمام شده.')}</b>
        <p className="small muted">{t('Check the work, then confirm. If something is wrong, tell him in chat first.', 'کار را بررسی کنید سپس تأیید کنید. اگر مشکلی هست، اول در چت بگویید.')}</p>
        <div className="row wrapit">
          <button className="btn btn-primary btn-lg grow" onClick={handleConfirmDone}>
            <Icon name="check" />{t('Yes, work is done', 'بله، کار تمام شد')}
          </button>
          <button className="btn btn-outline btn-lg" onClick={() => onNavigate('chat')}>
            <Icon name="flag" />{t('Report a problem', 'گزارش مشکل')}
          </button>
        </div>
      </div>
    );
  } else if (job.status === 'closed') {
    action = (
      <button className="btn btn-amber btn-lg btn-block" onClick={() => onNavigate('review')}>
        <Icon name="star" />{t('Rate', 'امتیاز دهید')} {wname(w).split(' ')[0]}
      </button>
    );
  } else if (job.status === 'reviewed') {
    action = (
      <div className="disclaimer" style={{ background: 'var(--success-50)' }}>
        <Icon name="checkCircle" /><span>{t('Thanks! Your review is on his profile.', 'ممنون! نظر شما در پروفایل اوست.')}</span>
      </div>
    );
  } else {
    action = (
      <>
        <div className="disclaimer">
          <Icon name="info" />
          <span>{t('Status updates come from the worker\u2019s app. There is no live GPS tracking.', 'به‌روزرسانی‌ها از برنامه کاریگر می‌آیند. ردیابی زنده GPS وجود ندارد.')}</span>
        </div>
        <button className="btn btn-outline btn-block" onClick={handleSimWorker}>
          <Icon name="refresh" />{t('Demo: simulate next update from worker', 'دمو: شبیه‌سازی به‌روزرسانی بعدی از کاریگر')}
        </button>
      </>
    );
  }

  const history = (
    <section className="card">
      <h3>{t('Booking history', 'تاریخچه رزروها')}</h3>
      <div style={{ marginTop: 8 }}>
        {[
          ['28', t('Oct', 'اکتوبر'), t('Ceiling fan wiring', 'سیم‌کشی پنکه سقفی'), t('Abdul Rahman', 'عبدالرحمان'), 1200],
          ['02', t('Sep', 'سپتامبر'), t('AC service (1.5 ton)', 'سرویس کولر (۱.۵ تن)'), t('Shahid Mehmood', 'شاهد محمود'), 2500],
        ].map(([d, m, ti, n, p], i) => (
          <div key={i} className="listrow">
            <span className="datebox"><b className="num">{d}</b><span>{m}</span></span>
            <div className="grow"><b>{ti}</b><div className="small muted">{n} · <span className="num">{afn(p)}</span></div></div>
            <span className="pill pill-off"><Icon name="check" />{t('Completed', 'تکمیل شد')}</span>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <main className="appmain">
      <div className="wrap stack" style={{ gap: 18 }}>
        <div className="row between wrapit">
          <h1 style={{ fontSize: 'clamp(24px,3vw,32px)' }}>{t('Your booking', 'رزرو شما')}</h1>
          <span className={`pill ${job.status === 'reviewed' || job.status === 'closed' ? 'pill-av' : 'pill-info'}`} style={{ fontSize: 14, padding: '6px 14px' }}>{st}</span>
        </div>

        <div className="track-layout">
          <div className="stack" style={{ gap: 18 }}>
            <BookingTicket j={job} w={w} statusLabel="" />
          </div>
          <div className="stack" style={{ gap: 16 }}>
            <section className="card">
              <h3 style={{ marginBottom: 16 }}>{t('Progress', 'پیشرفت')}</h3>
              <ol className="timeline">
                {steps.map(([s, i, label, time], idx) => {
                  const k = stIdx(s);
                  const cls = k <= cur ? 'done' : k === cur + 1 ? 'now' : '';
                  return (
                    <li key={s} className={cls}>
                      <span className="nd"><Icon name={i} /></span>
                      <div>
                        <b>{label}</b>
                        <small>{time ? t('Reported by the worker', 'گزارش شده توسط کاریگر') : cls === 'now' ? t('Next', 'بعدی') : t('Pending', 'در انتظار')}</small>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
            {action}
            <div className="row">
              <button className="btn btn-outline grow" onClick={() => openModal('call')}><Icon name="phone" />{t('Call', 'تماس')}</button>
              <button className="btn btn-outline grow" onClick={() => onNavigate('chat')}><Icon name="msg" />{t('Chat', 'چت')}</button>
              {stIdx(job.status) < stIdx('onway') && (
                <button className="btn btn-danger" onClick={() => openModal('cancel')}>{t('Cancel', 'لغو')}</button>
              )}
            </div>
          </div>
        </div>
        {history}
      </div>
    </main>
  );
}
