/**
 * Shared UI components — Karigar v2.0 (Afghanistan)
 * Language: English + Dari (fa)
 */
import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp, afn } from '../context/AppContext';
import { catBy } from '../lib/data';

// Status pill for worker availability
export function StatusPill({ w }) {
  const { t } = useApp();
  if (w.status === 'available')
    return <span className="pill pill-av"><span className="dot dot-av" />{t('Available now', 'الان آماده')}</span>;
  if (w.status === 'busy')
    return <span className="pill pill-busy"><Icon name="clock" />{t('On a job', 'مشغول کار')}{w.freeAt ? ` · ${t('free ~', 'آزاد ~')}${w.freeAt}` : ''}</span>;
  return <span className="pill pill-off"><span className="dot dot-off" />{t('Not working today', 'امروز نیست')}</span>;
}

// Stars with rating
export function Stars({ n, count }) {
  return (
    <span className="stars">
      <Icon name="star" />
      <span className="num">{Number(n).toFixed(1)}</span>
      {count != null && <span className="muted small" style={{ fontWeight: 500 }}>({count})</span>}
    </span>
  );
}

// Speaker button for text-to-speech
export function SpeakBtn({ id, en, fa }) {
  const { speak } = useApp();
  return (
    <button
      className="speak"
      onClick={() => speak(en, fa)}
      aria-label="Listen"
      data-speak-id={id}
    >
      <Icon name="speaker" />
    </button>
  );
}

// Logo — Afghan-inspired green & red
export function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="#006400" />
      {/* Hammer & wrench cross — karigar symbol */}
      <path d="M10 31a14 14 0 0 1 28 0z" fill="#F4B942" />
      <g stroke="#F4B942" strokeWidth="2.4" strokeLinecap="round">
        <path d="M24 9v4M12.5 13.5l2.8 2.8M35.5 13.5l-2.8 2.8M7 22.5h3.6M37.4 22.5H41" />
      </g>
      <path d="M8 31h32" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M15 37h18" stroke="#fff" strokeOpacity=".55" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

// Brand — Karigar
export function Brand({ onClick }) {
  const { t } = useApp();
  return (
    <button className="brand" onClick={onClick}>
      <Logo size={40} />
      <span>
        <b>Karigar</b>
        {/* کاریگر in Dari — same Nastaliq script */}
        <span className="fa" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl' }}>
          {t('کاریگر', 'کاریگر')}
        </span>
      </span>
    </button>
  );
}

// Worker card
export function WorkerCard({ w, onProfile, onRequest, landing }) {
  const { t, wname, catName } = useApp();
  const c = catBy(w.cat);
  const cls = w.status === 'busy' ? 'is-busy' : w.status === 'off' ? 'is-off' : '';
  const cta = w.status === 'available'
    ? <button className="btn btn-primary btn-sm" onClick={() => onRequest?.(w.id)}><Icon name="msg" />{t('Request', 'درخواست')}</button>
    : <button className="btn btn-sm is-disabled" disabled>{w.status === 'busy' ? <><Icon name="clock" />{t('Busy', 'مشغول')}</> : t('Unavailable', 'در دسترس نیست')}</button>;

  return (
    <article className={`wcard ${cls}`}>
      <div className="top">
        <Avatar id={w.id} size={64} />
        <div className="grow">
          <h3>{wname(w)}</h3>
          <div className="meta"><span><Icon name={c.icon} />{catName(w.cat)}</span><span>{w.exp} {t('yrs exp.', 'سال تجربه')}</span></div>
          <div className="meta" style={{ marginTop: 2 }}>
            <Stars n={w.rating} count={w.count} />
            <span><Icon name="pin" /><span className="num">{w.km} km</span> · {w.area}</span>
          </div>
        </div>
      </div>
      <div className="row between wrapit">
        <StatusPill w={w} />
      </div>
      <div className="skills">{w.skills.slice(0, 3).map((s) => <span key={s} className="skill">{s}</span>)}</div>
      <div className="foot">
        <span className="price grow"><small>{t('Visit from', 'ویزیت از')}</small><b className="num">{afn(w.price)}</b></span>
        <button className="btn btn-outline btn-sm" onClick={() => onProfile?.(w.id)}>{t('Profile', 'پروفایل')}</button>
        {cta}
      </div>
    </article>
  );
}

// Booking ticket component
export function BookingTicket({ j, w, statusLabel }) {
  const { t, wname, catName } = useApp();
  const c = catBy(j.cat);
  return (
    <div className="ticket">
      <div className="band">
        <span style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,.12)', display: 'grid', placeItems: 'center' }}>
          <Icon name={c.icon} />
        </span>
        <div className="grow">
          <span className="small" style={{ opacity: 0.8 }}>{t('Booking', 'رزرو')} #{j.id}</span>
          <h2>{j.title}</h2>
        </div>
        {statusLabel}
      </div>
      <div className="body">
        <div className="parties">
          <div className="party"><Avatar id="mariam" size={48} /><div className="grow"><span className="xs muted">{t('Customer', 'مشتری')}</span><b style={{ display: 'block' }}>Mariam Noori</b><span className="small muted num">0700-100100</span></div></div>
          <div className="party"><Avatar id={w.id} size={48} /><div className="grow"><span className="xs muted">{t('Worker', 'کاریگر')}</span><b style={{ display: 'block' }}>{w.name}</b><span className="small muted">{catName(w.cat)} · <Stars n={w.rating} /></span></div></div>
        </div>
        <dl className="kv" style={{ margin: 0 }}>
          <dt><Icon name="wrench" />{t('Job', 'کار')}</dt><dd>{j.details[0] || j.title}</dd>
          <dt><Icon name="calendar" />{t('Date & time', 'تاریخ و وقت')}</dt><dd>{j.time}</dd>
          <dt><Icon name="pin" />{t('Location', 'آدرس')}</dt><dd>{j.address}</dd>
          <dt><Icon name="tag" />{t('Agreed price', 'قیمت توافقی')}</dt>
          <dd><b className="num" style={{ fontSize: 22, color: 'var(--forest)' }}>{j.price ? afn(j.price) : '—'}</b><span className="xs muted" style={{ display: 'block' }}>{t('Parts extra only if agreed in chat', 'قطعات فقط در صورت توافق در چت اضافه می‌شود')}</span></dd>
        </dl>
      </div>
    </div>
  );
}

// Toast container
export function ToastContainer() {
  const { toastMsg } = useApp();
  if (!toastMsg) return null;
  return (
    <div className="toasts">
      <div className={`toast${toastMsg.ok ? ' ok' : ''}`} role="status">
        <Icon name={toastMsg.ok ? 'checkCircle' : 'bell'} />
        <div>{toastMsg.msg}</div>
      </div>
    </div>
  );
}

// App shell header
export function AppHeader({ activeView, onNavigate }) {
  const { t, role } = useApp();
  const navItems = role === 'worker'
    ? [['wdash', 'home', t('Home', 'خانه')], ['wjob', 'briefcase', t('Jobs', 'کارها')], ['chat', 'msg', t('Chat', 'چت')], ['wprofile', 'user', t('Profile', 'پروفایل')]]
    : [['discover', 'search', t('Find', 'جستجو')], ['track', 'calendar', t('Bookings', 'رزروها')], ['chat', 'msg', t('Chat', 'چت')], ['profile', 'user', t('Profile', 'پروفایل')]];

  const topNav = role === 'worker'
    ? [['wdash', 'home', t('Dashboard', 'داشبورد')], ['wjob', 'briefcase', t('Jobs', 'کارها')], ['wprofile', 'user', t('Profile', 'پروفایل')]]
    : [['discover', 'search', t('Find a worker', 'پیدا کردن کاریگر')], ['track', 'calendar', t('My bookings', 'رزروهای من')], ['profile', 'user', t('Profile', 'پروفایل')]];

  const activeOf = (v) => {
    const map = { results: 'discover', request: 'discover', confirm: 'track', booked: 'track', review: 'track' };
    return map[v] || v;
  };

  return (
    <header className="apphead">
      <div className="wrap">
        <Brand onClick={() => onNavigate('home')} />
        <nav className="topnav" aria-label="Main">
          {topNav.map(([v, i, label]) => (
            <button key={v} onClick={() => onNavigate(v)} aria-current={activeOf(activeView) === v ? 'page' : undefined}>
              <Icon name={i} />{label}
            </button>
          ))}
        </nav>
        <div className="row" style={{ marginInlineStart: 'auto', gap: 8 }}>
          <button className="icon-btn" onClick={() => onNavigate(role === 'worker' ? 'wdash' : 'discover')} aria-label="Home"><Icon name="home" /></button>
        </div>
      </div>
    </header>
  );
}

// Bottom nav (mobile)
export function BottomNav({ activeView, onNavigate }) {
  const { t, role, notifs } = useApp();
  const items = role === 'worker'
    ? [['wdash', 'home', t('Home', 'خانه')], ['wjob', 'briefcase', t('Jobs', 'کارها')], ['chat', 'msg', t('Chat', 'چت')], ['wprofile', 'user', t('Profile', 'پروفایل')]]
    : [['discover', 'search', t('Find', 'جستجو')], ['track', 'calendar', t('Bookings', 'رزروها')], ['chat', 'msg', t('Chat', 'چت')], ['profile', 'user', t('Profile', 'پروفایل')]];

  const activeOf = (v) => {
    const map = { results: 'discover', request: 'discover', confirm: 'track', booked: 'track', review: 'track' };
    return map[v] || v;
  };

  return (
    <nav className="bottomnav">
      {items.map(([v, i, label]) => (
        <button key={v} onClick={() => onNavigate(v)} aria-current={activeOf(activeView) === v ? 'page' : undefined}>
          <Icon name={i} />
          {label}
          {v === 'chat' && notifs > 0 && <span className="badge">{notifs}</span>}
        </button>
      ))}
    </nav>
  );
}

// Language toggle — English / دری
export function LangToggle() {
  const { lang, setLang } = useApp();
  return (
    <div className="seg" style={{ background: 'var(--soft)' }} role="group" aria-label="Language">
      <button style={{ color: 'var(--ink)' }} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
      <button
        style={{ color: 'var(--ink)', fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 1.5, direction: 'rtl' }}
        aria-pressed={lang === 'fa'}
        onClick={() => setLang('fa')}
      >
        دری
      </button>
    </div>
  );
}

// Disclaimer
export function Disclaimer({ children }) {
  return (
    <div className="disclaimer">
      <Icon name="info" />
      <span>{children}</span>
    </div>
  );
}
