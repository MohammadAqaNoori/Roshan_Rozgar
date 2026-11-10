import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp } from '../context/AppContext';
import { Brand, LangToggle } from '../components/Shared';

export default function Role({ onNavigate }) {
  const { t, ur, setRole, startCustomerSignup, startWorkerSignup } = useApp();

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
                {t('Create your account', 'اکاؤنٹ بنائیں')}
              </h1>
              <p className="muted">
                {t('Choose how you want to use Roshan Rozgar.', 'بتائیں آپ روشن روزگار کیسے استعمال کرنا چاہتے ہیں۔')}
              </p>
            </div>
          </div>

          <div className="role-grid">
            {/* Customer card */}
            <button className="role cust" onClick={goCustomer}>
              <span className="art">
                <span className="row" style={{ gap: -10 }}>
                  <Avatar id="ayesha" size={96} radius={30} />
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
                <h2>{t('I need a service', 'مجھے کاریگر چاہیے')}</h2>
                <span className="ur-sub">
                  {ur() ? 'I need a service' : 'مجھے کاریگر چاہیے'}
                </span>
              </span>
              <span className="muted">
                {t(
                  'Find a plumber, electrician or AC technician nearby who is free now.',
                  'قریب کا فارغ پلمبر، الیکٹریشن یا اے سی مکینک ڈھونڈیں۔'
                )}
              </span>
              <span className="go">
                {t('Continue as customer', 'بطور گاہک آگے')}
                <Icon name="arrowR" className="flip" />
              </span>
            </button>

            {/* Worker card */}
            <button className="role work" onClick={goWorker}>
              <span className="art">
                <span className="row">
                  <Avatar id="imran" size={96} radius={30} />
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
                <h2>{t('I want to find work', 'مجھے کام چاہیے')}</h2>
                <span className="ur-sub">
                  {ur() ? 'I want to find work' : 'مجھے کام چاہیے'}
                </span>
              </span>
              <span className="muted">
                {t(
                  'Make your profile by speaking. Get job requests from homes near you.',
                  'بول کر پروفائل بنائیں۔ قریبی گھروں سے کام پائیں۔'
                )}
              </span>
              <span className="go">
                <Icon name="mic" />
                {t('Start with voice', 'آواز سے شروع کریں')}
                <Icon name="arrowR" className="flip" />
              </span>
            </button>
          </div>

          {/* Already have an account — link to login */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p className="muted small">
              {t('Already have an account?', 'پہلے سے رجسٹرڈ ہیں؟')}{' '}
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('login')}>
                {t('Log in', 'لاگ ان')}
              </button>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
