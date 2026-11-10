import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp, rs } from '../context/AppContext';
import { Stars, StatusPill, SpeakBtn } from '../components/Shared';
import { CUSTOMER, catBy, stIdx } from '../lib/data';

export default function WorkerDash({ onNavigate }) {
  const { t, ob, workers, job, W, wname, catName, setAvail, simIncoming, simCustomerConfirm, workerStep, customerConfirmDone, openModal, speak } = useApp();

  const me = W('imran');  // seeded worker — used only for stats/reviews demo data
  const active = job && stIdx(job.status) >= stIdx('confirmed') && stIdx(job.status) < stIdx('closed');
  const incoming = job && ['requested', 'negotiating'].includes(job.status);
  const waitConfirm = job && job.status === 'agreed';
  const on = me.status === 'available';

  // Actual logged-in worker's name and trade from onboarding state
  const displayName = ob.name && ob.name.trim() ? ob.name.trim() : me.name;
  const displayTrade = ob.profession ? ob.profession : me.cat;
  const displayArea = ob.area ? ob.area : me.area;
  const tradeObj = catBy(displayTrade);

  // Availability card
  const availCard = (
    <section className={`avail-card ${active ? 'locked' : on ? 'on' : 'off'}`}>
      <div className="row between">
        <div>
          <p className="ur" style={{ fontSize: 18, opacity: 0.9 }}>
            {active ? t('آپ ابھی کام پر ہیں', 'آپ ابھی کام پر ہیں') : on ? t('آپ ابھی دستیاب ہیں', 'آپ ابھی دستیاب ہیں') : t('آپ ابھی مصروف ہیں', 'آپ ابھی مصروف ہیں')}
          </p>
          <h2>{active ? t('You are on a job', 'آپ کام پر ہیں') : on ? t('You are available', 'آپ دستیاب ہیں') : t('You are busy', 'آپ مصروف ہیں')}</h2>
          <p className="small" style={{ opacity: 0.9, marginTop: 4 }}>
            {active ? t('Customers can\u2019t book you until this job is finished.', 'یہ کام ختم ہونے تک گاہک بک نہیں کر سکتے۔')
              : on ? t('Customers nearby can see you and send jobs.', 'قریبی گاہک آپ کو دیکھ سکتے ہیں۔')
              : t('You are hidden from new requests.', 'آپ نئی درخواستوں سے چھپے ہیں۔')}
          </p>
        </div>
        <SpeakBtn id="avail" en={active ? 'You are on a job' : on ? 'You are available' : 'You are busy'} ur={active ? 'آپ کام پر ہیں' : on ? 'آپ دستیاب ہیں' : 'آپ مصروف ہیں'} />
      </div>
      <div className="bigtoggle" role="group" aria-label="Availability">
        <button aria-pressed={on && !active} onClick={() => setAvail('available')} disabled={active}>
          <Icon name="checkCircle" /><span>{t('Available', 'دستیاب')}</span>
        </button>
        <button aria-pressed={!on || active} onClick={() => setAvail('busy')} disabled={active}>
          <Icon name="clock" /><span>{t('Busy', 'مصروف')}</span>
        </button>
      </div>
      {active && <p className="small" style={{ marginTop: 10, opacity: 0.9 }}><Icon name="lock" /> {t('Set automatically by your confirmed booking', 'کنفرم بکنگ کی وجہ سے خود بخود')}</p>}
    </section>
  );

  // Job card
  let jobCard;
  if (incoming) {
    jobCard = (
      <section className="jobreq">
        <div className="row between">
          <span className="newtag">{t('New job', 'نیا کام')}</span>
          <span className="small muted"><Icon name="clock" /> {t('2 min ago', '2 منٹ پہلے')}</span>
        </div>
        <div className="row">
          <Avatar id="ayesha" size={52} radius={16} />
          <div className="grow">
            <b style={{ fontSize: 18 }}>{t(CUSTOMER.name, CUSTOMER.nameUr)}</b>
            <div className="small muted">{CUSTOMER.area} · <span className="num">1.2 km</span></div>
          </div>
        </div>
        <div className="row" style={{ gap: 12 }}>
          <div className="thumb" style={{ width: 76, height: 76 }}>
            <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
              <rect width="120" height="120" fill="#DCE8E2" />
              <rect x="10" y="22" width="100" height="16" rx="3" fill="#B9C9C1" />
              <rect x="38" y="38" width="10" height="34" fill="#9AA8A1" />
              <path d="M48 70h22a6 6 0 0 1 6 6v20" stroke="#7D8C85" strokeWidth="8" fill="none" />
              <circle cx="76" cy="80" r="7" fill="#087F5B" />
              <rect x="0" y="96" width="120" height="24" fill="#C4D2CB" />
            </svg>
          </div>
          <div className="grow">
            <b>{job.title}</b>
            <p className="ur" style={{ fontSize: 16 }}>{t('کچن سنک کے نیچے سے پانی ٹپک رہا ہے', 'کچن سنک کے نیچے سے پانی ٹپک رہا ہے')}</p>
            <div className="meta"><span><Icon name="clock" />{job.time}</span></div>
          </div>
        </div>
        <div className="voice-big" style={{ padding: '10px 12px' }}>
          <button className="mic-sm" style={{ background: 'var(--amber)', color: 'var(--forest-900)' }}><Icon name="play" /></button>
          <div className="grow"><b className="small">{t('Listen to the customer', 'گاہک کی بات سنیں')}</b></div>
          <span className="xs num">0:14</span>
        </div>
        <div className="bigact">
          <button className="btn btn-primary" onClick={() => onNavigate('chat')}><Icon name="msg" />{t('Reply', 'جواب دیں')}<small>جواب / قیمت بتائیں</small></button>
          <button className="btn btn-danger" onClick={() => openModal('decline')}><Icon name="x" />{t('Decline', 'انکار')}<small>نہیں کر سکتا</small></button>
        </div>
      </section>
    );
  } else if (waitConfirm) {
    jobCard = (
      <section className="card stack" style={{ gap: 12, border: '2px solid var(--emerald)' }}>
        <div className="row"><Icon name="hand" /><b>{t('Price agreed', 'قیمت طے')}: <span className="num">{rs(job.price)}</span></b></div>
        <p className="muted small">{t(`Waiting for ${CUSTOMER.name.split(' ')[0]} to confirm the booking.`, 'گاہک کی تصدیق کا انتظار۔')}</p>
        <button className="btn btn-outline btn-block" onClick={simCustomerConfirm}><Icon name="refresh" />{t('Demo: simulate customer confirming', 'ڈیمو: گاہک کی تصدیق')}</button>
      </section>
    );
  } else if (active) {
    const nextMap = {
      confirmed: ['onway', 'nav', t('I\u2019m on my way', 'میں نکل رہا ہوں')],
      onway: ['working', 'wrench', t('Start work', 'کام شروع کریں')],
      working: ['done', 'flag', t('Mark job complete', 'کام مکمل')],
    };
    const next = nextMap[job.status];
    jobCard = (
      <section className="card stack" style={{ gap: 14, border: '2px solid var(--emerald)' }}>
        <div className="row between">
          <span className="pill pill-info">{t('Current job', 'موجودہ کام')}</span>
          <span className="small muted num">#{job.id}</span>
        </div>
        <div className="row">
          <Avatar id="ayesha" size={52} radius={16} />
          <div className="grow">
            <b style={{ fontSize: 18 }}>{job.title}</b>
            <div className="small muted">{CUSTOMER.name} · {job.time}</div>
          </div>
          <b className="num" style={{ fontSize: 20, color: 'var(--forest)' }}>{rs(job.price)}</b>
        </div>
        <div className="locbar"><Icon name="pin" /><span className="small grow">{CUSTOMER.address}</span></div>
        {next ? (
          <button className="btn btn-primary btn-lg btn-block" style={{ minHeight: 72, fontSize: 20 }} onClick={workerStep}>
            <Icon name={next[1]} />{next[2]}
          </button>
        ) : (
          <>
            <div className="disclaimer"><Icon name="clock" /><span>{t(`Waiting for ${CUSTOMER.name.split(' ')[0]} to confirm the work is done.`, 'گاہک کی تصدیق کا انتظار۔')}</span></div>
            <button className="btn btn-outline btn-block" onClick={() => { customerConfirmDone(); }}><Icon name="refresh" />{t('Demo: simulate customer confirming & rating', 'ڈیمو: گاہک کی تصدیق اور ریٹنگ')}</button>
          </>
        )}
        <div className="row">
          <button className="btn btn-outline grow" onClick={() => openModal('call')}><Icon name="phone" />{t('Call', 'کال')}</button>
          <button className="btn btn-outline grow" onClick={() => onNavigate('chat')}><Icon name="msg" />{t('Chat', 'چیٹ')}</button>
        </div>
      </section>
    );
  } else {
    jobCard = (
      <section className="card empty">
        <span className="tile"><Icon name="bell" /></span>
        <b>{t('No new requests right now', 'ابھی کوئی نئی درخواست نہیں')}</b>
        <span className="muted small">{on ? t('Keep your status on Available. We\u2019ll ring when a job comes in.', 'دستیاب رکھیں، کام آنے پر اطلاع ملے گی۔') : t('Switch to Available to start getting jobs.', 'کام کے لیے دستیاب کریں۔')}</span>
        <button className="btn btn-outline btn-sm" onClick={simIncoming}><Icon name="refresh" />{t('Demo: receive a job request', 'ڈیمو: درخواست وصول کریں')}</button>
      </section>
    );
  }

  const earned = 9400 + (job && stIdx(job.status) >= stIdx('closed') ? job.price : 0);

  return (
    <main className="appmain">
      <div className="wrap stack" style={{ gap: 18 }}>
        {/* Greeting */}
        <div className="row between wrapit">
          <div className="row">
            {ob.photo ? (
              <span className="ava" style={{ width: 56, height: 56 }}><img src={ob.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></span>
            ) : (
              <Avatar id="imran" size={56} radius={18} />
            )}
            <div>
              <p className="muted">{t('Assalam-o-Alaikum', 'السلام علیکم')}</p>
              <h1 style={{ fontSize: 'clamp(24px,3vw,32px)' }}>{displayName}</h1>
            </div>
          </div>
          <span className="pill pill-info">
            <Icon name={tradeObj.icon} />
            {t(tradeObj.en, tradeObj.ur)}{displayArea ? ` · ${displayArea}` : ''}
          </span>
        </div>

        <div className="wd-grid">
          {/* Left */}
          <div className="stack" style={{ gap: 18 }}>
            {availCard}
            {jobCard}
          </div>

          {/* Right */}
          <div className="stack" style={{ gap: 18 }}>
            {/* Stats */}
            <div className="statrow">
              <div className="stat"><Icon name="star" /><b className="num">{me.rating.toFixed(1)}</b><span>{t('rating', 'ریٹنگ')} · {me.count}</span></div>
              <div className="stat"><Icon name="checkCircle" /><b className="num">{me.jobs}</b><span>{t('jobs done', 'مکمل کام')}</span></div>
              <div className="stat"><Icon name="wallet" /><b className="num" style={{ fontSize: 20 }}>{rs(earned)}</b><span>{t('this week', 'اس ہفتے')}</span></div>
            </div>
            <p className="xs muted" style={{ marginTop: -8 }}><Icon name="info" /> {t('Earnings are a record of agreed prices. Roshan Rozgar does not handle payments.', 'کمائی صرف طے شدہ قیمتوں کا ریکارڈ ہے۔')}</p>

            {/* Upcoming bookings */}
            <section className="card">
              <div className="sect-title"><h2 style={{ fontSize: 18 }}>{t('Upcoming bookings', 'آنے والی بکنگ')}</h2></div>
              {active || waitConfirm ? (
                <div className="listrow">
                  <span className="datebox" style={{ background: 'var(--emerald)', color: '#fff' }}><b className="num">10</b><span>Nov</span></span>
                  <div className="grow"><b>{job.title}</b><div className="small muted">{job.time} · G-11/2</div></div>
                  <span className={`pill ${active ? 'pill-info' : 'pill-busy'}`}>{active ? t('Today', 'آج') : t('Pending', 'زیرِ غور')}</span>
                </div>
              ) : null}
              {[['12', 'Nov', '10:00 AM', 'Geyser fitting', 'Sana R. · F-11/1'], ['14', 'Nov', '3:00 PM', 'Bathroom mixer', 'Faisal M. · G-10/2']].map(([d, m, ti, title, who], i) => (
                <div key={i} className="listrow">
                  <span className="datebox"><b className="num">{d}</b><span>{m}</span></span>
                  <div className="grow"><b>{title}</b><div className="small muted">{ti} · {who}</div></div>
                  <Icon name="chevR" className="flip" />
                </div>
              ))}
            </section>

            {/* Latest reviews */}
            <section className="card">
              <div className="sect-title"><h2 style={{ fontSize: 18 }}>{t('Latest reviews', 'تازہ ریویو')}</h2><button className="btn btn-ghost btn-sm" onClick={() => onNavigate('wprofile')}>{t('All', 'سب')}</button></div>
              {me.reviews.slice(0, 2).map((r, i) => (
                <div key={i} className="review">
                  <div className="row between"><b>{r.by}</b><Stars n={r.stars} /></div>
                  {r.text && <p className="small">{r.text}</p>}
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
