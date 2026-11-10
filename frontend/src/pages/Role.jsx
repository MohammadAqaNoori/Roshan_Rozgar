import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp } from '../context/AppContext';
import { Brand, LangToggle } from '../components/Shared';

export default function Role({ onNavigate }) {
  const { t, fa, setRole, startCustomerSignup, startWorkerSignup } = useApp();

  const goCustomer = () => {
    startCustomerSignup();
    onNavigate('customerReg');
  };

  const goWorker = () => {
    startWorkerSignup();
    onNavigate('onboard', { fresh: true });
  };

  return (
    <>
      <header className="lnav">
        <div className="wrap">
          <Brand onClick={() => onNavigate('home')} />
          <div style={{ marginInlineStart: 'auto' }}>
            <LangToggle />
          </div>
        </div>
      </header>

      <main className="wrap" style={{ paddingBlock: '32px 64px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="row between wrapit" style={{ gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(28px,4vw,40px)' }}>
                {t('Create your account', 'اکاؤنت خود را بسازید')}
              </h1>
              <p className="muted">
                {t('Choose how you want to use Karigar.', 'انتخاب کنید چگونه کاریگر را استفاده می‌خواهید.')}
              </p>
            </div>
          </div>

          <div className="role-grid">
            {/* Customer card */}
            <button className="role cust" onClick={goCustomer}>
              <span className="art">
                <span className="row" style={{ gap: -10 }}>
                  <Avatar id="mariam" size={96} radius={30} />
                  <span style={{
                    width: 64, height: 64, borderRadius: 20,
                    background: '#fff', display: 'grid', placeItems: 'center',
                    color: 'var(--emerald)', boxShadow: 'var(--sh-2)',
                    marginInlineStart: -14, marginTop: 40,
                  }}>
                    <Icon name="home" />
                  </span>
                </span>
              </span>
              <span>
                <h2>{t('I need a service', 'به کاریگر نیاز دارم')}</h2>
                <span className="ur-sub">
                  {fa() ? 'I need a service' : 'به کاریگر نیاز دارم'}
                </span>
              </span>
              <span className="muted">
                {t(
                  'Find a plumber, electrician or AC technician nearby who is free now.',
                  'یک لوله‌کش، برق‌کار یا تکنسین کولر نزدیک پیدا کنید که اکنون آزاد است.'
                )}
              </span>
              <span className="go">
                {t('Continue as customer', 'به عنوان مشتری ادامه دهید')}
                <Icon name="arrowR" className="flip" />
              </span>
            </button>

            {/* Worker card */}
            <button className="role work" onClick={goWorker}>
              <span className="art">
                <span className="row">
                  <Avatar id="ahmad" size={96} radius={30} />
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 8, marginInlineStart: 12 }}>
                    {['droplet', 'zap', 'hammer'].map((i) => (
                      <span key={i} style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: 'var(--amber)', display: 'grid',
                        placeItems: 'center', color: 'var(--forest-900)',
                      }}>
                        <Icon name={i} />
                      </span>
                    ))}
                  </span>
                </span>
              </span>
              <span>
                <h2>{t('I want to find work', 'کار می‌خواهم')}</h2>
                <span className="ur-sub">
                  {fa() ? 'I want to find work' : 'کار می‌خواهم'}
                </span>
              </span>
              <span className="muted">
                {t(
                  'Make your profile by speaking. Get job requests from homes near you.',
                  'با صحبت پروفایل بسازید. درخواست کار از خانه‌های نزدیک دریافت کنید.'
                )}
              </span>
              <span className="go">
                <Icon name="mic" />
                {t('Start with voice', 'با صدا شروع کنید')}
                <Icon name="arrowR" className="flip" />
              </span>
            </button>
          </div>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p className="muted small">
              {t('Already have an account?', 'از قبل اکاؤنت دارید؟')}{' '}
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('login')}>
                {t('Log in', 'ورود')}
              </button>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
