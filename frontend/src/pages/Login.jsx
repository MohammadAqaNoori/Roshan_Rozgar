/**
 * Login page — unified entry point.
 * v2.0 — Afghanistan localization (Karigar)
 */
import { useState } from 'react';
import { Icon } from '../lib/icons';
import { useApp } from '../context/AppContext';
import { Brand, LangToggle } from '../components/Shared';
import { Avatar } from '../lib/avatar';

// Seeded phones that "exist" in the prototype
const KNOWN_PHONES = [
  '+93700100100',  // Mariam Noori (customer)
  '+93700111001',  // Ahmad Shah (worker)
  '+93700111002',  // Abdul Karim (worker)
  '+93700111003',  // Nasir Ahmad (worker)
  '+93700111004',  // Habibullah (worker)
  '+93700111005',  // Wahidullah (worker)
];

function normalise(raw) {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('93')) return '+' + digits;
  if (digits.startsWith('0')) return '+93' + digits.slice(1);
  return '+93' + digits;
}

export default function Login({ onNavigate }) {
  const { t, fa, setRole, startCustomerSignup, startWorkerSignup, showToast } = useApp();

  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('phone');
  const [phoneError, setPhoneError] = useState('');

  const handleContinue = () => {
    const digits = phone.replace(/\D/g, '');
    if (!digits || digits.length < 9) {
      setPhoneError(t('Please enter a valid phone number.', 'لطفاً شماره تلفن معتبر وارد کنید.'));
      return;
    }
    setPhoneError('');

    const normalised = normalise(phone);
    const exists = KNOWN_PHONES.some(p => p === normalised);

    if (exists) {
      setStep('role');
    } else {
      setStep('not-found');
    }
  };

  const loginAs = (selectedRole) => {
    setRole(selectedRole);
    showToast(t('Welcome back!', 'خوش آمدید!'), true);
    if (selectedRole === 'worker') {
      onNavigate('wdash-returning');
    } else {
      onNavigate('discover');
    }
  };

  const signupCustomer = () => { startCustomerSignup(); onNavigate('customerReg'); };
  const signupWorker = () => { startWorkerSignup(); onNavigate('onboard', { fresh: true }); };

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
        <div style={{ maxWidth: 480, margin: '0 auto' }}>

          {/* Step 1: Phone number */}
          {step === 'phone' && (
            <div className="ob">
              <div className="ob-card">
                <div className="ob-q">
                  <span className="big-ico"><Icon name="phone" /></span>
                  <div className="grow">
                    <p className="ur-line">{t('وارد کاریگر شوید', 'وارد کاریگر شوید')}</p>
                    <h2>{t('Log in to your account', 'وارد اکاؤنت خود شوید')}</h2>
                    <p className="en-line" style={{ marginTop: 4 }}>
                      {t('Enter your phone number to continue.', 'برای ادامه شماره تلفن خود را وارد کنید.')}
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <label className="lbl" htmlFor="login-phone">{t('Phone number', 'شماره تلفن')}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                      color: 'var(--muted)', fontWeight: 700, fontSize: 16, zIndex: 1,
                    }}>+93</span>
                    <input
                      id="login-phone"
                      type="tel"
                      className="bigfield"
                      style={{ paddingInlineStart: 56 }}
                      placeholder="700 123456"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setPhoneError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                      autoFocus
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </div>
                  {phoneError && (
                    <div className="fallback" style={{ marginTop: 10, padding: '10px 14px' }}>
                      <Icon name="alert" /> {phoneError}
                    </div>
                  )}
                  <p className="xs muted" style={{ marginTop: 8 }}>
                    <Icon name="info" />{' '}
                    {t('Demo: use 0700100100 (customer) or 0700111001 (worker)', 'نمونه: ۰۷۰۰۱۰۰۱۰۰ (مشتری) یا ۰۷۰۰۱۱۱۰۰۱ (کاریگر)')}
                  </p>
                </div>

                <div className="ob-foot">
                  <button className="btn btn-primary btn-lg" disabled={!phone.trim()} onClick={handleContinue}>
                    {t('Continue', 'ادامه')}
                    <Icon name="arrowR" className="flip" />
                  </button>
                </div>

                <p className="muted small" style={{ textAlign: 'center', marginTop: 20 }}>
                  {t("Don't have an account yet?", 'هنوز اکاؤنت ندارید؟')}{' '}
                  <button className="btn btn-ghost btn-sm" onClick={() => setStep('not-found')}>
                    {t('Create one', 'ساختن')}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Step 2a: Known user — pick role */}
          {step === 'role' && (
            <div className="ob">
              <div className="ob-card">
                <div className="ob-q">
                  <span className="big-ico" style={{ background: 'var(--success-50)', color: 'var(--success)' }}>
                    <Icon name="checkCircle" />
                  </span>
                  <div className="grow">
                    <h2>{t('Account found!', 'اکاؤنت پیدا شد!')}</h2>
                    <p className="en-line" style={{ marginTop: 4 }}>
                      {t('How do you want to log in?', 'چگونه می‌خواهید وارد شوید؟')}
                    </p>
                  </div>
                </div>

                <div className="stack" style={{ gap: 12, marginTop: 20 }}>
                  <button className="choice wide" style={{ minHeight: 76, padding: '16px 20px' }} onClick={() => loginAs('customer')}>
                    <span className="tile" style={{ width: 48, height: 48 }}><Icon name="home" /></span>
                    <span>
                      <b style={{ display: 'block', fontSize: 16 }}>{t('As a Customer', 'به عنوان مشتری')}</b>
                      <span className="small muted">{t('Find workers and book services', 'کاریگر پیدا کنید و رزرو کنید')}</span>
                    </span>
                    <Icon name="arrowR" className="flip" style={{ marginInlineStart: 'auto', color: 'var(--emerald)' }} />
                  </button>

                  <button className="choice wide" style={{ minHeight: 76, padding: '16px 20px' }} onClick={() => loginAs('worker')}>
                    <span className="tile" style={{ width: 48, height: 48, background: 'var(--amber-50)', color: 'var(--amber-ink)' }}><Icon name="briefcase" /></span>
                    <span>
                      <b style={{ display: 'block', fontSize: 16 }}>{t('As a Worker', 'به عنوان کاریگر')}</b>
                      <span className="small muted">{t('Manage jobs and availability', 'مدیریت کارها و دسترس‌پذیری')}</span>
                    </span>
                    <Icon name="arrowR" className="flip" style={{ marginInlineStart: 'auto', color: 'var(--emerald)' }} />
                  </button>
                </div>

                <p className="muted small" style={{ textAlign: 'center', marginTop: 16 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setStep('phone')}>
                    <Icon name="arrowL" className="flip" />
                    {t('Use a different number', 'شماره دیگر')}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Step 2b: Not found — offer signup */}
          {step === 'not-found' && (
            <div className="ob">
              <div className="ob-card">
                <div className="ob-q">
                  <span className="big-ico" style={{ background: 'var(--amber-50)', color: 'var(--amber-ink)' }}>
                    <Icon name="user" />
                  </span>
                  <div className="grow">
                    <h2>{t('No account found', 'اکاؤنتی پیدا نشد')}</h2>
                    <p className="en-line" style={{ marginTop: 4 }}>
                      {t('Create a free account to get started.', 'برای شروع یک اکاؤنت رایگان بسازید.')}
                    </p>
                  </div>
                </div>

                <div className="stack" style={{ gap: 12, marginTop: 20 }}>
                  <button className="role cust" style={{ padding: 20 }} onClick={signupCustomer}>
                    <span className="art" style={{ height: 100 }}>
                      <span className="row" style={{ gap: -10, justifyContent: 'center' }}>
                        <Avatar id="mariam" size={72} radius={22} />
                        <span style={{ width: 48, height: 48, borderRadius: 14, background: '#fff', display: 'grid', placeItems: 'center', color: 'var(--emerald)', boxShadow: 'var(--sh-2)', marginInlineStart: -10, marginTop: 28 }}>
                          <Icon name="home" />
                        </span>
                      </span>
                    </span>
                    <span>
                      <h2 style={{ fontSize: 20 }}>{t('I need a service', 'به کاریگر نیاز دارم')}</h2>
                      <span className="muted small">{t('Find plumbers, electricians and more nearby', 'لوله‌کش، برق‌کار و بیشتر نزدیک پیدا کنید')}</span>
                    </span>
                    <span className="go">
                      {t('Sign up as Customer', 'ثبت‌نام به عنوان مشتری')}
                      <Icon name="arrowR" className="flip" />
                    </span>
                  </button>

                  <button className="role work" style={{ padding: 20 }} onClick={signupWorker}>
                    <span className="art" style={{ height: 100 }}>
                      <span className="row" style={{ justifyContent: 'center' }}>
                        <Avatar id="ahmad" size={72} radius={22} />
                        <span style={{ display: 'flex', flexDirection: 'column', gap: 6, marginInlineStart: 10 }}>
                          {['droplet', 'zap', 'hammer'].map((i) => (
                            <span key={i} style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--amber)', display: 'grid', placeItems: 'center', color: 'var(--forest-900)' }}>
                              <Icon name={i} />
                            </span>
                          ))}
                        </span>
                      </span>
                    </span>
                    <span>
                      <h2 style={{ fontSize: 20 }}>{t('I want to find work', 'کار می‌خواهم')}</h2>
                      <span className="muted small">{t('Create a profile by speaking. Get job requests.', 'با صحبت پروفایل بسازید. درخواست کار دریافت کنید.')}</span>
                    </span>
                    <span className="go">
                      <Icon name="mic" />
                      {t('Sign up as Worker', 'ثبت‌نام به عنوان کاریگر')}
                      <Icon name="arrowR" className="flip" />
                    </span>
                  </button>
                </div>

                <p className="muted small" style={{ textAlign: 'center', marginTop: 16 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setStep('phone')}>
                    <Icon name="arrowL" className="flip" />
                    {t('Try a different number', 'شماره دیگر امتحان کنید')}
                  </button>
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
