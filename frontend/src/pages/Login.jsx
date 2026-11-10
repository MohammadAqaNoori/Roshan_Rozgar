/**
 * Login page — unified entry point.
 *
 * Flow:
 *   1. Enter phone number
 *   2a. Phone exists → pick role (Customer / Worker) → go to dashboard
 *   2b. Phone NOT found → show "No account found" with two signup options:
 *         - Sign up as Customer → CustomerReg
 *         - Sign up as Worker  → Onboard (10-step)
 */
import { useState } from 'react';
import { Icon } from '../lib/icons';
import { useApp } from '../context/AppContext';
import { Brand, LangToggle } from '../components/Shared';
import { Avatar } from '../lib/avatar';

// Seeded phones that "exist" in the prototype
const KNOWN_PHONES = [
  '+923335550000',  // Ayesha Khan (customer)
  '+923001111001',  // Muhammad Imran (worker)
  '+923001111002',  // Abdul Rehman (worker)
  '+923001111003',  // Shahid Mehmood (worker)
  '+923001111004',  // Bilal Ahmed (worker)
  '+923001111005',  // Naveed Akhtar (worker)
];

function normalise(raw) {
  const digits = raw.replace(/\D/g, '');
  // Add +92 prefix if not already international
  if (digits.startsWith('92')) return '+' + digits;
  if (digits.startsWith('0')) return '+92' + digits.slice(1);
  return '+92' + digits;
}

export default function Login({ onNavigate }) {
  const { t, ur, setRole, startCustomerSignup, startWorkerSignup, showToast } = useApp();

  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('phone');   // 'phone' | 'role' | 'not-found'
  const [phoneError, setPhoneError] = useState('');

  const handleContinue = () => {
    const digits = phone.replace(/\D/g, '');
    if (!digits || digits.length < 10) {
      setPhoneError(t('Please enter a valid phone number.', 'براہ کرم درست فون نمبر درج کریں۔'));
      return;
    }
    setPhoneError('');

    const normalised = normalise(phone);
    const exists = KNOWN_PHONES.some(p => p === normalised);

    if (exists) {
      setStep('role');   // known user → pick role
    } else {
      setStep('not-found');  // new user → offer signup
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

  const signupCustomer = () => {
    startCustomerSignup();
    onNavigate('customerReg');
  };

  const signupWorker = () => {
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
        <div style={{ maxWidth: 480, margin: '0 auto' }}>

          {/* ─── Step 1: Phone number ─────────────────────────────── */}
          {step === 'phone' && (
            <div className="ob">
              <div className="ob-card">
                <div className="ob-q">
                  <span className="big-ico"><Icon name="phone" /></span>
                  <div className="grow">
                    <p className="ur-line">{t('روشن روزگار میں لاگ ان کریں', 'روشن روزگار میں لاگ ان کریں')}</p>
                    <h2>{t('Log in to your account', 'اپنے اکاؤنٹ میں لاگ ان کریں')}</h2>
                    <p className="en-line" style={{ marginTop: 4 }}>
                      {t('Enter your phone number to continue.', 'آگے بڑھنے کے لیے فون نمبر درج کریں۔')}
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <label className="lbl" htmlFor="login-phone">{t('Phone number', 'فون نمبر')}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                      color: 'var(--muted)', fontWeight: 700, fontSize: 16, zIndex: 1,
                    }}>+92</span>
                    <input
                      id="login-phone"
                      type="tel"
                      className="bigfield"
                      style={{ paddingInlineStart: 56 }}
                      placeholder="300 1234567"
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
                    {t('Demo: use 03335550000 (customer) or 03001111001 (worker)', 'ڈیمو: 03335550000 (گاہک) یا 03001111001 (کاریگر)')}
                  </p>
                </div>

                <div className="ob-foot">
                  <button
                    className="btn btn-primary btn-lg"
                    disabled={!phone.trim()}
                    onClick={handleContinue}
                  >
                    {t('Continue', 'آگے')}
                    <Icon name="arrowR" className="flip" />
                  </button>
                </div>

                <p className="muted small" style={{ textAlign: 'center', marginTop: 20 }}>
                  {t("Don't have an account yet?", 'ابھی اکاؤنٹ نہیں ہے؟')}{' '}
                  <button className="btn btn-ghost btn-sm" onClick={() => setStep('not-found')}>
                    {t('Create one', 'بنائیں')}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ─── Step 2a: Known user — pick role ──────────────────── */}
          {step === 'role' && (
            <div className="ob">
              <div className="ob-card">
                <div className="ob-q">
                  <span className="big-ico" style={{ background: 'var(--success-50)', color: 'var(--success)' }}>
                    <Icon name="checkCircle" />
                  </span>
                  <div className="grow">
                    <h2>{t('Account found!', 'اکاؤنٹ مل گیا!')}</h2>
                    <p className="en-line" style={{ marginTop: 4 }}>
                      {t('How do you want to log in?', 'آپ کس طرح لاگ ان کرنا چاہتے ہیں؟')}
                    </p>
                  </div>
                </div>

                <div className="stack" style={{ gap: 12, marginTop: 20 }}>
                  <button className="choice wide" style={{ minHeight: 76, padding: '16px 20px' }} onClick={() => loginAs('customer')}>
                    <span className="tile" style={{ width: 48, height: 48 }}>
                      <Icon name="home" />
                    </span>
                    <span>
                      <b style={{ display: 'block', fontSize: 16 }}>{t('As a Customer', 'گاہک کے طور پر')}</b>
                      <span className="small muted">{t('Find workers and book services', 'کاریگر ڈھونڈیں')}</span>
                    </span>
                    <Icon name="arrowR" className="flip" style={{ marginInlineStart: 'auto', color: 'var(--emerald)' }} />
                  </button>

                  <button className="choice wide" style={{ minHeight: 76, padding: '16px 20px' }} onClick={() => loginAs('worker')}>
                    <span className="tile" style={{ width: 48, height: 48, background: 'var(--amber-50)', color: 'var(--amber-ink)' }}>
                      <Icon name="briefcase" />
                    </span>
                    <span>
                      <b style={{ display: 'block', fontSize: 16 }}>{t('As a Worker', 'کاریگر کے طور پر')}</b>
                      <span className="small muted">{t('Manage jobs and availability', 'کام اور دستیابی')}</span>
                    </span>
                    <Icon name="arrowR" className="flip" style={{ marginInlineStart: 'auto', color: 'var(--emerald)' }} />
                  </button>
                </div>

                <p className="muted small" style={{ textAlign: 'center', marginTop: 16 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setStep('phone')}>
                    <Icon name="arrowL" className="flip" />
                    {t('Use a different number', 'مختلف نمبر')}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ─── Step 2b: Not found — offer signup ────────────────── */}
          {step === 'not-found' && (
            <div className="ob">
              <div className="ob-card">
                <div className="ob-q">
                  <span className="big-ico" style={{ background: 'var(--amber-50)', color: 'var(--amber-ink)' }}>
                    <Icon name="user" />
                  </span>
                  <div className="grow">
                    <h2>{t('No account found', 'اکاؤنٹ نہیں ملا')}</h2>
                    <p className="en-line" style={{ marginTop: 4 }}>
                      {t('Create a free account to get started.', 'شروع کرنے کے لیے مفت اکاؤنٹ بنائیں۔')}
                    </p>
                  </div>
                </div>

                <div className="stack" style={{ gap: 12, marginTop: 20 }}>
                  {/* Customer signup */}
                  <button className="role cust" style={{ padding: 20 }} onClick={signupCustomer}>
                    <span className="art" style={{ height: 100 }}>
                      <span className="row" style={{ gap: -10, justifyContent: 'center' }}>
                        <Avatar id="ayesha" size={72} radius={22} />
                        <span style={{ width: 48, height: 48, borderRadius: 14, background: '#fff', display: 'grid', placeItems: 'center', color: 'var(--emerald)', boxShadow: 'var(--sh-2)', marginInlineStart: -10, marginTop: 28 }}>
                          <Icon name="home" />
                        </span>
                      </span>
                    </span>
                    <span>
                      <h2 style={{ fontSize: 20 }}>{t('I need a service', 'مجھے کاریگر چاہیے')}</h2>
                      <span className="muted small">{t('Find plumbers, electricians and more nearby', 'قریبی پلمبر، الیکٹریشن اور مزید ڈھونڈیں')}</span>
                    </span>
                    <span className="go">
                      {t('Sign up as Customer', 'بطور گاہک رجسٹر کریں')}
                      <Icon name="arrowR" className="flip" />
                    </span>
                  </button>

                  {/* Worker signup */}
                  <button className="role work" style={{ padding: 20 }} onClick={signupWorker}>
                    <span className="art" style={{ height: 100 }}>
                      <span className="row" style={{ justifyContent: 'center' }}>
                        <Avatar id="imran" size={72} radius={22} />
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
                      <h2 style={{ fontSize: 20 }}>{t('I want to find work', 'مجھے کام چاہیے')}</h2>
                      <span className="muted small">{t('Create a profile by speaking. Get job requests.', 'بول کر پروفائل بنائیں۔ کام کی درخواستیں پائیں۔')}</span>
                    </span>
                    <span className="go">
                      <Icon name="mic" />
                      {t('Sign up as Worker', 'بطور کاریگر رجسٹر کریں')}
                      <Icon name="arrowR" className="flip" />
                    </span>
                  </button>
                </div>

                <p className="muted small" style={{ textAlign: 'center', marginTop: 16 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setStep('phone')}>
                    <Icon name="arrowL" className="flip" />
                    {t('Try a different number', 'مختلف نمبر آزمائیں')}
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
