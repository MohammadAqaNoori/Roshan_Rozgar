/**
 * Login page — unified entry point with real account verification.
 * v2.1 — Karigar / Afghanistan
 *
 * Flow:
 *   1. User enters phone number → we check if the account exists
 *   2a. Account found   → pick role (Customer / Worker) → navigate
 *   2b. Account NOT found → show "Account not found" with clear message + signup options
 */
import { useState } from 'react';
import { Icon } from '../lib/icons';
import { useApp } from '../context/AppContext';
import { Brand, LangToggle } from '../components/Shared';
import { Avatar } from '../lib/avatar';
import { normalisePhone } from '../api/client';

// Seeded phones that "exist" in demo mode
const KNOWN_PHONES = [
  '+93700100100',  // Mariam Noori (customer)
  '+93700111001',  // Ahmad Shah (worker)
  '+93700111002',  // Abdul Karim (worker)
  '+93700111003',  // Nasir Ahmad (worker)
  '+93700111004',  // Habibullah (worker)
  '+93700111005',  // Wahidullah (worker)
];

export default function Login({ onNavigate }) {
  const { t, fa, setRole, startCustomerSignup, startWorkerSignup, showToast, liveMode, apiLoginUser } = useApp();

  const [phone, setPhone] = useState('');
  // 'phone'     → initial step: enter phone
  // 'checking'  → loading while API verifies
  // 'found'     → account exists, pick role
  // 'not-found' → account doesn't exist, offer signup
  const [step, setStep] = useState('phone');
  const [phoneError, setPhoneError] = useState('');
  const [checkedPhone, setCheckedPhone] = useState(''); // the phone that was verified

  const handleContinue = async () => {
    const digits = phone.replace(/\D/g, '');
    // Afghan numbers: 0 + 9 digits = 10 total, or 9 digits without leading 0
    const subscriber = digits.startsWith('0') ? digits.slice(1) : digits;
    if (!digits || subscriber.length < 9) {
      setPhoneError(t('Phone number too short. Use format: 07XX XXX XXX (10 digits)', 'شماره کوتاه است. فرمت: ۰۷XX XXX XXX (۱۰ رقم)'));
      return;
    }
    if (subscriber.length > 9) {
      setPhoneError(t('Phone number too long. Afghan numbers are 10 digits (e.g. 0700 123456)', 'شماره طولانی است. ۱۰ رقم مثل ۰۷۰۰ ۱۲۳۴۵۶'));
      return;
    }
    setPhoneError('');

    // Single shared normalisation — same logic for both signup and login
    const normalised = normalisePhone(phone);
    setCheckedPhone(normalised);

    if (liveMode) {
      // ── Live mode: try real API login ─────────────────────────────────────
      setStep('checking');
      try {
        await apiLoginUser(normalised);
        // 200 OK → account found, user is now logged in
        setStep('found');
      } catch (err) {
        // 404 → account not found
        // 403 → account deactivated
        const status = err?.response?.status;
        if (status === 404 || status === 403) {
          setStep('not-found');
        } else {
          // Network or server error — show inline error and stay on phone step
          setStep('phone');
          setPhoneError(
            t('Could not reach the server. Check your connection.', 'به سرور دسترسی نداشت. اتصال را بررسی کنید.')
          );
        }
      }
      return;
    }

    // ── Demo mode: check known phones ────────────────────────────────────────
    const exists = KNOWN_PHONES.some(p => p === normalised);
    setStep(exists ? 'found' : 'not-found');
  };

  const loginAs = (selectedRole) => {
    setRole(selectedRole);
    showToast(t('Welcome back!', 'خوش آمدید!'), true);
    onNavigate(selectedRole === 'worker' ? 'wdash-returning' : 'discover');
  };

  const signupCustomer = () => { startCustomerSignup(); onNavigate('customerReg'); };
  const signupWorker = () => { startWorkerSignup(); onNavigate('onboard', { fresh: true }); };

  const goBack = () => {
    setStep('phone');
    setPhoneError('');
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

          {/* ── Step 1: Enter phone number ─────────────────────────────── */}
          {step === 'phone' && (
            <div className="ob">
              <div className="ob-card">
                <div className="ob-q">
                  <span className="big-ico"><Icon name="phone" /></span>
                  <div className="grow">
                    {fa() && <p className="ur-line">وارد کاریگر شوید</p>}
                    <h2>{t('Log in to your account', 'وارد اکاؤنت خود شوید')}</h2>
                    <p className="en-line" style={{ marginTop: 4 }}>
                      {t('Enter your phone number. We\'ll check if you have an account.', 'شماره تلفن خود را وارد کنید. بررسی می‌کنیم که آیا اکاؤنت دارید.')}
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
                      maxLength={10}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setPhoneError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                      autoFocus
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </div>

                  {/* Live preview of stored number */}
                  {phone.length >= 7 && (
                    <p className="xs muted" style={{ marginTop: 6 }}>
                      <Icon name="checkCircle" style={{ color: 'var(--success)' }} />{' '}
                      {t('Will be stored as:', 'ذخیره می‌شود به عنوان:')} <b className="num">{normalisePhone(phone)}</b>
                    </p>
                  )}

                  {/* Inline error */}
                  {phoneError && (
                    <div className="fallback" style={{ marginTop: 10, padding: '10px 14px' }}>
                      <Icon name="alert" /> {phoneError}
                    </div>
                  )}

                  {/* Format hint */}
                  <p className="xs muted" style={{ marginTop: 8 }}>
                    <Icon name="info" />{' '}
                    {t('Afghan format: 0700 123456 (10 digits starting with 0)', 'فرمت افغانستان: ۰۷۰۰ ۱۲۳۴۵۶ (۱۰ رقم با شروع ۰)')}
                  </p>

                  {/* Demo hint when backend not running */}
                  {!liveMode && (
                    <p className="xs muted" style={{ marginTop: 4 }}>
                      <Icon name="star" />{' '}
                      {t('Demo: use 0700100100 (customer) or 0700111001 (worker)', 'نمونه: ۰۷۰۰۱۰۰۱۰۰ (مشتری) یا ۰۷۰۰۱۱۱۰۰۱ (کاریگر)')}
                    </p>
                  )}
                </div>

                <div className="ob-foot">
                  <button
                    className="btn btn-primary btn-lg"
                    disabled={phone.replace(/\D/g, '').length < 9}
                    onClick={handleContinue}
                  >
                    {t('Continue', 'ادامه')}
                    <Icon name="arrowR" className="flip" />
                  </button>
                </div>

                <p className="muted small" style={{ textAlign: 'center', marginTop: 20 }}>
                  {t("Don't have an account?", 'هنوز اکاؤنت ندارید؟')}{' '}
                  <button className="btn btn-ghost btn-sm" onClick={() => setStep('not-found')}>
                    {t('Sign up', 'ثبت‌نام')}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ── Checking (loading spinner) ─────────────────────────────── */}
          {step === 'checking' && (
            <div className="ob">
              <div className="ob-card" style={{ textAlign: 'center', padding: 48 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                  <div className="skel" style={{ width: 56, height: 56, borderRadius: '50%' }} />
                </div>
                <h2>{t('Checking your account…', 'در حال بررسی اکاؤنت شما…')}</h2>
                <p className="muted small" style={{ marginTop: 8 }}>+93{phone}</p>
              </div>
            </div>
          )}

          {/* ── Step 2a: Account found — pick role ────────────────────── */}
          {step === 'found' && (
            <div className="ob">
              <div className="ob-card">
                <div className="ob-q">
                  <span className="big-ico" style={{ background: 'var(--success-50)', color: 'var(--success)' }}>
                    <Icon name="checkCircle" />
                  </span>
                  <div className="grow">
                    <h2>{t('Account found!', 'اکاؤنت پیدا شد!')}</h2>
                    <p className="en-line" style={{ marginTop: 4 }}>
                      {t('Welcome back. How do you want to continue?', 'خوش آمدید. چگونه می‌خواهید ادامه دهید؟')}
                    </p>
                    <p className="xs muted num" style={{ marginTop: 4 }}>{checkedPhone}</p>
                  </div>
                </div>

                <div className="stack" style={{ gap: 12, marginTop: 20 }}>
                  <button className="choice wide" style={{ minHeight: 76, padding: '16px 20px' }} onClick={() => loginAs('customer')}>
                    <span className="tile" style={{ width: 48, height: 48 }}>
                      <Icon name="home" />
                    </span>
                    <span>
                      <b style={{ display: 'block', fontSize: 16 }}>{t('I need a service', 'به کاریگر نیاز دارم')}</b>
                      <span className="small muted">{t('Find workers and book services', 'کاریگر پیدا کنید و رزرو کنید')}</span>
                    </span>
                    <Icon name="arrowR" className="flip" style={{ marginInlineStart: 'auto', color: 'var(--emerald)' }} />
                  </button>

                  <button className="choice wide" style={{ minHeight: 76, padding: '16px 20px' }} onClick={() => loginAs('worker')}>
                    <span className="tile" style={{ width: 48, height: 48, background: 'var(--amber-50)', color: 'var(--amber-ink)' }}>
                      <Icon name="briefcase" />
                    </span>
                    <span>
                      <b style={{ display: 'block', fontSize: 16 }}>{t('I want to find work', 'کار می‌خواهم')}</b>
                      <span className="small muted">{t('Manage jobs and availability', 'مدیریت کارها و دسترس‌پذیری')}</span>
                    </span>
                    <Icon name="arrowR" className="flip" style={{ marginInlineStart: 'auto', color: 'var(--emerald)' }} />
                  </button>
                </div>

                <p className="muted small" style={{ textAlign: 'center', marginTop: 16 }}>
                  <button className="btn btn-ghost btn-sm" onClick={goBack}>
                    <Icon name="arrowL" className="flip" />
                    {t('Use a different number', 'شماره دیگر')}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ── Step 2b: Account NOT found ────────────────────────────── */}
          {step === 'not-found' && (
            <div className="ob">
              <div className="ob-card">

                {/* Clear "not found" message */}
                <div className="ob-q" style={{ marginBottom: 20 }}>
                  <span className="big-ico" style={{ background: 'var(--amber-50)', color: 'var(--amber-ink)', flexShrink: 0 }}>
                    <Icon name="user" />
                  </span>
                  <div className="grow">
                    <h2>{t('No account found', 'اکاؤنتی پیدا نشد')}</h2>
                    {checkedPhone ? (
                      <p className="en-line" style={{ marginTop: 4 }}>
                        {t('No account is registered with', 'هیچ اکاؤنتی با این شماره ثبت نشده:')} <b className="num">{checkedPhone}</b>
                      </p>
                    ) : (
                      <p className="en-line" style={{ marginTop: 4 }}>
                        {t('Create a free account to get started.', 'برای شروع یک اکاؤنت رایگان بسازید.')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider + prompt */}
                <div className="disclaimer" style={{ marginBottom: 16 }}>
                  <Icon name="info" />
                  <span>{t('Choose how you\'d like to sign up:', 'روش ثبت‌نام را انتخاب کنید:')}</span>
                </div>

                <div className="stack" style={{ gap: 12 }}>
                  {/* Customer signup */}
                  <button className="role cust" style={{ padding: 20 }} onClick={signupCustomer}>
                    <span className="art" style={{ height: 90 }}>
                      <span className="row" style={{ gap: -10, justifyContent: 'center' }}>
                        <Avatar id="mariam" size={68} radius={22} />
                        <span style={{ width: 44, height: 44, borderRadius: 14, background: '#fff', display: 'grid', placeItems: 'center', color: 'var(--emerald)', boxShadow: 'var(--sh-2)', marginInlineStart: -10, marginTop: 24 }}>
                          <Icon name="home" />
                        </span>
                      </span>
                    </span>
                    <span>
                      <h2 style={{ fontSize: 18 }}>{t('Sign up as Customer', 'ثبت‌نام به عنوان مشتری')}</h2>
                      <span className="muted small">{t('Find plumbers, electricians and more nearby', 'لوله‌کش، برق‌کار و بیشتر نزدیک پیدا کنید')}</span>
                    </span>
                    <span className="go">
                      {t('Get started', 'شروع کنید')}
                      <Icon name="arrowR" className="flip" />
                    </span>
                  </button>

                  {/* Worker signup */}
                  <button className="role work" style={{ padding: 20 }} onClick={signupWorker}>
                    <span className="art" style={{ height: 90 }}>
                      <span className="row" style={{ justifyContent: 'center' }}>
                        <Avatar id="ahmad" size={68} radius={22} />
                        <span style={{ display: 'flex', flexDirection: 'column', gap: 6, marginInlineStart: 10 }}>
                          {['droplet', 'zap', 'hammer'].map((i) => (
                            <span key={i} style={{ width: 30, height: 30, borderRadius: 10, background: 'var(--amber)', display: 'grid', placeItems: 'center', color: 'var(--forest-900)' }}>
                              <Icon name={i} />
                            </span>
                          ))}
                        </span>
                      </span>
                    </span>
                    <span>
                      <h2 style={{ fontSize: 18 }}>{t('Sign up as Worker', 'ثبت‌نام به عنوان کاریگر')}</h2>
                      <span className="muted small">{t('Create a profile by speaking. Get job requests.', 'با صحبت پروفایل بسازید. درخواست کار دریافت کنید.')}</span>
                    </span>
                    <span className="go">
                      <Icon name="mic" />
                      {t('Start with voice', 'با صدا شروع کنید')}
                      <Icon name="arrowR" className="flip" />
                    </span>
                  </button>
                </div>

                {/* Back link */}
                <p className="muted small" style={{ textAlign: 'center', marginTop: 16 }}>
                  {checkedPhone && (
                    <>
                      {t('Already have an account?', 'قبلاً اکاؤنت داشتید؟')}{' '}
                    </>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={goBack}>
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
