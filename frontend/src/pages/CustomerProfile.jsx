/**
 * CustomerProfile — shows the logged-in customer's own account info.
 * This is the page a customer sees when they click "My Profile" in the header.
 * It is NOT a worker profile — it shows name, phone, booking history, and account settings.
 */
import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp, afn } from '../context/AppContext';
import { Stars } from '../components/Shared';

export default function CustomerProfile({ onNavigate }) {
  const { t, fa, user, ob, role, logout, job, workers, liveMode } = useApp();

  // Get real user data — API user first, then fallback to registration data
  const displayName = user?.name || ob?.customerName || t('Customer', 'مشتری');
  const displayPhone = user?.phone || '';
  const initials = displayName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const memberSince = user?.created_at
    ? new Date(user.created_at).getFullYear()
    : new Date().getFullYear();

  return (
    <main className="appmain">
      <div className="wrap narrow stack" style={{ gap: 20 }}>

        {/* ── Hero card ─────────────────────────────────────────────── */}
        <section className="prof-hero" style={{ alignItems: 'center', gap: 20 }}>
          {/* Avatar bubble with initials */}
          <span
            className="acct-avatar"
            style={{
              width: 88, height: 88, borderRadius: 28,
              fontSize: 32, fontWeight: 800,
              background: 'rgba(255,255,255,.18)',
              color: '#fff',
              display: 'grid', placeItems: 'center',
              border: '3px solid rgba(255,255,255,.5)',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {initials}
          </span>
          <div className="grow">
            <h1 style={{ color: '#fff' }}>{displayName}</h1>
            {displayPhone && (
              <p className="small num" style={{ color: 'rgba(255,255,255,.8)', marginTop: 4 }}>
                {displayPhone}
              </p>
            )}
            <p className="small" style={{ color: 'rgba(255,255,255,.7)', marginTop: 4 }}>
              <Icon name="checkCircle" />{' '}
              {t('Customer account', 'حساب مشتری')} · {t('Since', 'از')} {memberSince}
            </p>
          </div>
        </section>

        {/* ── Account details ───────────────────────────────────────── */}
        <section className="card">
          <h3>{t('Account details', 'جزئیات حساب')}</h3>
          <ul className="know" style={{ marginTop: 10 }}>
            <li>
              <span className="ok"><Icon name="user" /></span>
              <span>
                <b>{t('Name:', 'نام:')}</b> {displayName}
              </span>
            </li>
            {displayPhone && (
              <li>
                <span className="ok"><Icon name="phone" /></span>
                <span>
                  <b>{t('Phone:', 'تلفن:')}</b>{' '}
                  <span className="num">{displayPhone}</span>
                </span>
              </li>
            )}
            <li>
              <span className="ok"><Icon name="checkCircle" /></span>
              <span>
                {t('Phone number confirmed by OTP', 'شماره تلفن با OTP تأیید شده')}{' '}
                <span className="pill pill-sample">{t('simulated', 'نمونه')}</span>
              </span>
            </li>
            <li>
              <span className="ok"><Icon name="checkCircle" /></span>
              <span>{t('Active on Karigar since', 'فعال در کاریگر از')} {memberSince}</span>
            </li>
            {liveMode && (
              <li>
                <span className="ok"><Icon name="checkCircle" /></span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                  {t('Connected to live server', 'متصل به سرور واقعی')}
                </span>
              </li>
            )}
          </ul>
        </section>

        {/* ── Quick actions ─────────────────────────────────────────── */}
        <section className="card stack" style={{ gap: 10 }}>
          <h3>{t('Quick actions', 'دسترسی سریع')}</h3>
          <button
            className="choice wide"
            style={{ minHeight: 60 }}
            onClick={() => onNavigate('discover')}
          >
            <span className="tile" style={{ width: 44, height: 44 }}><Icon name="search" /></span>
            <span>
              <b style={{ display: 'block' }}>{t('Find a worker', 'پیدا کردن کاریگر')}</b>
              <span className="small muted">{t('Browse workers near you', 'کاریگران نزدیک را ببینید')}</span>
            </span>
            <Icon name="arrowR" className="flip" style={{ marginInlineStart: 'auto', color: 'var(--emerald)' }} />
          </button>

          <button
            className="choice wide"
            style={{ minHeight: 60 }}
            onClick={() => onNavigate('track')}
          >
            <span className="tile" style={{ width: 44, height: 44 }}><Icon name="calendar" /></span>
            <span>
              <b style={{ display: 'block' }}>{t('My bookings', 'رزروهای من')}</b>
              <span className="small muted">{t('Track your current and past bookings', 'رزروهای جاری و قبلی')}</span>
            </span>
            <Icon name="arrowR" className="flip" style={{ marginInlineStart: 'auto', color: 'var(--emerald)' }} />
          </button>

          <button
            className="choice wide"
            style={{ minHeight: 60 }}
            onClick={() => onNavigate('chat')}
          >
            <span className="tile" style={{ width: 44, height: 44 }}><Icon name="msg" /></span>
            <span>
              <b style={{ display: 'block' }}>{t('Messages', 'پیام‌ها')}</b>
              <span className="small muted">{t('Chat with your worker', 'با کاریگر خود چت کنید')}</span>
            </span>
            <Icon name="arrowR" className="flip" style={{ marginInlineStart: 'auto', color: 'var(--emerald)' }} />
          </button>
        </section>

        {/* ── Account settings ──────────────────────────────────────── */}
        <section className="card stack" style={{ gap: 14 }}>
          <h3>{t('Account settings', 'تنظیمات حساب')}</h3>

          <div className="row between">
            <div>
              <b style={{ display: 'block' }}>{t('Language', 'زبان')}</b>
              <span className="small muted">{fa() ? 'دری فعال است' : 'English is active'}</span>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onNavigate('home')}
            >
              <Icon name="globe" />
              {fa() ? 'English' : 'دری'}
            </button>
          </div>

          <div className="divider" />

          <div>
            <b style={{ display: 'block', color: 'var(--error)' }}>{t('Sign out', 'خروج از حساب')}</b>
            <p className="small muted" style={{ marginTop: 4 }}>
              {t('You will need to log in again to access your account.', 'برای دسترسی به حساب باید دوباره وارد شوید.')}
            </p>
            <button
              className="btn btn-danger btn-sm"
              style={{ marginTop: 12 }}
              onClick={() => logout(onNavigate)}
            >
              <Icon name="logout" />
              {t('Log out', 'خروج')}
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}
