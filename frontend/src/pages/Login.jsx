/**
 * Login page — existing users enter their phone number and pick their role.
 * OTP is simulated (any registered phone works).
 */
import { useState } from 'react';
import { Icon } from '../lib/icons';
import { useApp } from '../context/AppContext';
import { Brand, LangToggle } from '../components/Shared';

export default function Login({ onNavigate }) {
  const { t, ur, setRole, showToast } = useApp();

  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('phone');   // 'phone' | 'role'
  const [error, setError] = useState('');
  const [role, setLocalRole] = useState('');   // 'customer' | 'worker'

  const handlePhone = () => {
    const digits = phone.replace(/\D/g, '');
    if (!digits || digits.length < 10) {
      setError(t('Please enter a valid phone number.', 'براہ کرم درست فون نمبر درج کریں۔'));
      return;
    }
    setError('');
    setStep('role');
  };

  const handleLogin = (selectedRole) => {
    setLocalRole(selectedRole);
    setRole(selectedRole);
    showToast(t('Welcome back!', 'خوش آمدید!'), true);
    if (selectedRole === 'worker') {
      onNavigate('wdash-returning');
    } else {
      onNavigate('discover');
    }
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

          {/* ── Step 1: Phone ── */}
          {step === 'phone' && (
            <div className="ob">
              <div className="ob-card">
                <div className="ob-q">
                  <span className="big-ico"><Icon name="phone" /></span>
                  <div className="grow">
                    <p className="ur-line">{t('لاگ ان کریں', 'لاگ ان کریں')}</p>
                    <h2>{t('Log in to Roshan Rozgar', 'روشن روزگار میں لاگ ان کریں')}</h2>
                    <p className="en-line" style={{ marginTop: 4 }}>
                      {t('Enter your registered phone number.', 'اپنا رجسٹرڈ فون نمبر درج کریں۔')}
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <label className="lbl" htmlFor="login-phone">
                    {t('Phone number', 'فون نمبر')}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 14, top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--muted)', fontWeight: 700, fontSize: 16, zIndex: 1,
                    }}>+92</span>
                    <input
                      id="login-phone"
                      type="tel"
                      className="bigfield"
                      style={{ paddingInlineStart: 56 }}
                      placeholder="300 1234567"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handlePhone()}
                      autoFocus
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </div>
                  {error && (
                    <div className="fallback" style={{ marginTop: 10, padding: '10px 14px' }}>
                      <Icon name="alert" /> {error}
                    </div>
                  )}
                </div>

                <div className="ob-foot">
                  <button
                    className="btn btn-primary btn-lg"
                    disabled={!phone.trim()}
                    onClick={handlePhone}
                  >
                    <Icon name="arrowR" className="flip" />
                    {t('Continue', 'آگے')}
                  </button>
                </div>

                {/* Switch to sign up */}
                <p className="muted small" style={{ textAlign: 'center', marginTop: 20 }}>
                  {t("Don't have an account?", 'اکاؤنٹ نہیں ہے؟')}{' '}
                  <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('role')}>
                    {t('Sign up', 'رجسٹر کریں')}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ── Step 2: Choose role ── */}
          {step === 'role' && (
            <div className="ob">
              <div className="ob-card">
                <div className="ob-q">
                  <span className="big-ico" style={{ background: 'var(--success-50)', color: 'var(--success)' }}>
                    <Icon name="checkCircle" />
                  </span>
                  <div className="grow">
                    <h2>{t('Who are you logging in as?', 'آپ کس کے طور پر لاگ ان کر رہے ہیں؟')}</h2>
                    <p className="en-line" style={{ marginTop: 4 }}>
                      {t('Pick your account type to continue.', 'آگے بڑھنے کے لیے اپنا اکاؤنٹ نوع چنیں۔')}
                    </p>
                  </div>
                </div>

                <div className="stack" style={{ gap: 12, marginTop: 20 }}>
                  {/* Customer login */}
                  <button
                    className="choice wide"
                    style={{ minHeight: 72, padding: '16px 20px' }}
                    onClick={() => handleLogin('customer')}
                  >
                    <span className="tile" style={{ width: 48, height: 48 }}>
                      <Icon name="home" />
                    </span>
                    <span>
                      <b style={{ display: 'block', fontSize: 16 }}>
                        {t('Customer', 'گاہک')}
                      </b>
                      <span className="small muted">
                        {t('Find workers and book services', 'کاریگر ڈھونڈیں اور بکنگ کریں')}
                      </span>
                    </span>
                    <Icon name="arrowR" className="flip" style={{ marginInlineStart: 'auto', color: 'var(--emerald)' }} />
                  </button>

                  {/* Worker login */}
                  <button
                    className="choice wide"
                    style={{ minHeight: 72, padding: '16px 20px' }}
                    onClick={() => handleLogin('worker')}
                  >
                    <span className="tile" style={{ width: 48, height: 48, background: 'var(--amber-50)', color: 'var(--amber-ink)' }}>
                      <Icon name="briefcase" />
                    </span>
                    <span>
                      <b style={{ display: 'block', fontSize: 16 }}>
                        {t('Worker', 'کاریگر')}
                      </b>
                      <span className="small muted">
                        {t('Manage your jobs and availability', 'اپنے کام اور دستیابی دیکھیں')}
                      </span>
                    </span>
                    <Icon name="arrowR" className="flip" style={{ marginInlineStart: 'auto', color: 'var(--emerald)' }} />
                  </button>
                </div>

                {/* Back */}
                <p className="muted small" style={{ textAlign: 'center', marginTop: 16 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setStep('phone')}>
                    <Icon name="arrowL" className="flip" />
                    {t('Change number', 'نمبر بدلیں')}
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
