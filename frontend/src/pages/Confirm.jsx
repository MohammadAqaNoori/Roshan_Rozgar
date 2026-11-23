import { Icon } from '../lib/icons';
import { useApp, afn } from '../context/AppContext';
import { BookingTicket, Disclaimer } from '../components/Shared';
import { Avatar } from '../lib/avatar';
import { catBy, stIdx } from '../lib/data';

export default function Confirm({ onNavigate }) {
  const { t, job, W, wname, catName, confirmBooking, _confirming } = useApp();

  if (!job || stIdx(job.status) < stIdx('agreed')) {
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

  if (stIdx(job.status) >= stIdx('confirmed')) {
    return (
      <main className="appmain">
        <div className="wrap narrow stack" style={{ gap: 18 }}>
          <div className="card success-burst" style={{ padding: 28 }}>
            <div className="burst"><Icon name="check" /></div>
            <h1 style={{ fontSize: 28 }}>{t('Booking confirmed', 'رزرو تأیید شد')}</h1>
            <p className="muted">{wname(w)} {t('will come', 'خواهد آمد')} {job.time.toLowerCase()} · <b className="num">{afn(job.price)}</b></p>
          </div>
          <section className="card stack" style={{ gap: 12 }}>
            <b>{t('What just changed', 'چه چیزی تغییر کرد')}</b>
            <div className="row"><Icon name="clock" /><span className="grow">{wname(w)} {t('is now Busy in search results', 'اکنون در نتایج جستجو مشغول است')}</span></div>
            <div className="row"><Icon name="calendar" /><span className="grow">{t('Booking added to your dashboards', 'رزرو به داشبورد شما اضافه شد')}</span></div>
            <div className="row"><Icon name="lock" /><span className="grow">{t('Your full address is now shared', 'آدرس کامل شما اکنون به اشتراک گذاشته شده')}</span></div>
          </section>
          <div className="row wrapit">
            <button className="btn btn-outline btn-lg" onClick={() => onNavigate('discover')}><Icon name="search" />{t('Check search results', 'مشاهده نتایج جستجو')}</button>
            <button className="btn btn-primary btn-lg grow" onClick={() => onNavigate('track')}><Icon name="route" />{t('Track this job', 'پیگیری این کار')}</button>
          </div>
        </div>
      </main>
    );
  }

  const conflict = w.status !== 'available';

  return (
    <main className="appmain">
      <div className="wrap narrow stack" style={{ gap: 18 }}>
        <div className="row" style={{ gap: 10 }}>
          <button className="icon-btn" onClick={() => onNavigate('chat')} aria-label="Back"><Icon name="arrowL" className="flip" /></button>
          <h1 style={{ fontSize: 'clamp(22px,3vw,30px)' }}>{t('Confirm your booking', 'تأیید رزرو')}</h1>
        </div>

        <div className="row small" style={{ gap: 6, flexWrap: 'wrap' }}>
          {[['Requested', 'check'], ['Price agreed', 'check'], ['Confirm', 'dot'], ['In progress', ''], ['Completed', '']].map(([s, _], i) => (
            <span key={i} className={`pill ${i < 2 ? 'pill-av' : i === 2 ? 'pill-busy' : 'pill-off'}`}>
              {i < 2 && <Icon name="check" />}{s}
            </span>
          ))}
        </div>

        <BookingTicket j={job} w={w} statusLabel={<span className="pill pill-busy">{t('Awaiting your confirmation', 'در انتظار تأیید شما')}</span>} />

        {conflict ? (
          <div className="fallback stack" style={{ gap: 10 }}>
            <div className="row" style={{ color: '#B23434' }}><Icon name="alert" /><b>{wname(w)} {t('is no longer available', 'دیگر در دسترس نیست')}</b></div>
            <p className="small">{t('He was marked Busy before you confirmed, so this booking can\u2019t go through. Nothing has been booked.', 'قبل از تأیید شما مشغول شد، بنابراین این رزرو انجام نشد.')}</p>
            <button className="btn btn-primary" onClick={() => onNavigate('discover')}>{t('See other available', 'مشاهده سایر کاریگران در دسترس')} {catName(w.cat)}</button>
          </div>
        ) : (
          <>
            <Disclaimer>
              {t('Confirming marks', 'تأیید کردن')} {wname(w)} {t('as Busy so no one else can book him for this slot. You can cancel free of charge before he sets out.', 'را مشغول می‌کند تا کس دیگری برای این وقت رزرو نکند. می‌توانید قبل از حرکت او رایگان لغو کنید.')}
            </Disclaimer>
            <div className="row wrapit">
              <button className="btn btn-outline btn-lg" onClick={() => onNavigate('chat')}><Icon name="msg" />{t('Back to chat', 'بازگشت به چت')}</button>
              <button className="btn btn-primary btn-lg grow" disabled={_confirming} onClick={() => { confirmBooking(); onNavigate('confirm'); }}>
                {_confirming ? t('Confirming…', 'در حال تأیید…') : <><Icon name="check" />{t('Confirm booking', 'تأیید رزرو')}</>}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
