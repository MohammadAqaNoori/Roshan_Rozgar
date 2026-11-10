import { Icon } from '../lib/icons';
import { useApp, rs } from '../context/AppContext';
import { BookingTicket, Disclaimer } from '../components/Shared';
import { Avatar } from '../lib/avatar';
import { catBy, stIdx } from '../lib/data';

export default function Confirm({ onNavigate }) {
  const { t, job, W, wname, catName, confirmBooking, _confirming } = useApp();

  if (!job || stIdx(job.status) < stIdx('agreed')) {
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

  // Already confirmed → show booked success
  if (stIdx(job.status) >= stIdx('confirmed')) {
    return (
      <main className="appmain">
        <div className="wrap narrow stack" style={{ gap: 18 }}>
          <div className="card success-burst" style={{ padding: 28 }}>
            <div className="burst"><Icon name="check" /></div>
            <h1 style={{ fontSize: 28 }}>{t('Booking confirmed', 'بکنگ کنفرم ہو گئی')}</h1>
            <p className="muted">{wname(w)} {t('will come', 'آئیں گے')} {job.time.toLowerCase()} · <b className="num">{rs(job.price)}</b></p>
          </div>
          <section className="card stack" style={{ gap: 12 }}>
            <b>{t('What just changed', 'ابھی کیا بدلا')}</b>
            <div className="row"><Icon name="clock" /><span className="grow">{wname(w)} {t('is now Busy in search results', 'تلاش میں مصروف')}</span></div>
            <div className="row"><Icon name="calendar" /><span className="grow">{t('Booking added to your dashboards', 'بکنگ ڈیش بورڈ میں شامل')}</span></div>
            <div className="row"><Icon name="lock" /><span className="grow">{t('Your full address is now shared', 'آپ کا پورا پتا شیئر ہے')}</span></div>
          </section>
          <div className="row wrapit">
            <button className="btn btn-outline btn-lg" onClick={() => onNavigate('discover')}><Icon name="search" />{t('Check search results', 'تلاش دیکھیں')}</button>
            <button className="btn btn-primary btn-lg grow" onClick={() => onNavigate('track')}><Icon name="route" />{t('Track this job', 'کام ٹریک کریں')}</button>
          </div>
        </div>
      </main>
    );
  }

  // Confirm step
  const conflict = w.status !== 'available';

  return (
    <main className="appmain">
      <div className="wrap narrow stack" style={{ gap: 18 }}>
        <div className="row" style={{ gap: 10 }}>
          <button className="icon-btn" onClick={() => onNavigate('chat')} aria-label="Back"><Icon name="arrowL" className="flip" /></button>
          <h1 style={{ fontSize: 'clamp(22px,3vw,30px)' }}>{t('Confirm your booking', 'بکنگ کنفرم کریں')}</h1>
        </div>

        <div className="row small" style={{ gap: 6, flexWrap: 'wrap' }}>
          {[['Requested', 'check'], ['Price agreed', 'check'], ['Confirm', 'dot'], ['In progress', ''], ['Completed', '']].map(([s, _], i) => (
            <span key={i} className={`pill ${i < 2 ? 'pill-av' : i === 2 ? 'pill-busy' : 'pill-off'}`}>
              {i < 2 && <Icon name="check" />}{s}
            </span>
          ))}
        </div>

        <BookingTicket j={job} w={w} statusLabel={<span className="pill pill-busy">{t('Awaiting your confirmation', 'آپ کی تصدیق کا انتظار')}</span>} />

        {conflict ? (
          <div className="fallback stack" style={{ gap: 10 }}>
            <div className="row" style={{ color: '#B23434' }}><Icon name="alert" /><b>{wname(w)} {t('is no longer available', 'اب دستیاب نہیں')}</b></div>
            <p className="small">{t('He was marked Busy before you confirmed, so this booking can\u2019t go through. Nothing has been booked.', 'آپ کی تصدیق سے پہلے وہ مصروف ہو گئے، اس لیے بکنگ نہیں ہوئی۔')}</p>
            <button className="btn btn-primary" onClick={() => onNavigate('discover')}>{t('See other available', 'دوسرے دستیاب دیکھیں')} {catName(w.cat)}</button>
          </div>
        ) : (
          <>
            <Disclaimer>
              {t('Confirming marks', 'کنفرم کرنے پر')} {wname(w)} {t('as Busy so no one else can book him for this slot. You can cancel free of charge before he sets out.', 'مصروف ہو جائیں گے تاکہ کوئی اور اسی وقت بک نہ کرے۔')}
            </Disclaimer>
            <div className="row wrapit">
              <button className="btn btn-outline btn-lg" onClick={() => onNavigate('chat')}><Icon name="msg" />{t('Back to chat', 'چیٹ پر واپس')}</button>
              <button className="btn btn-primary btn-lg grow" disabled={_confirming} onClick={() => { confirmBooking(); onNavigate('confirm'); }}>
                {_confirming ? t('Confirming…', 'کنفرم ہو رہی ہے…') : <><Icon name="check" />{t('Confirm booking', 'بکنگ کنفرم کریں')}</>}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
