/**
 * Customer Registration — simple 2-step flow.
 * Step 0: Enter phone number (primary identifier, as per competition scope)
 * Step 1: Enter name
 * Step 2: Done — go to discover
 *
 * No password needed for the prototype (phone is the identifier, OTP is simulated).
 */
import { useState } from 'react';
import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp } from '../context/AppContext';
import { Brand, LangToggle, SpeakBtn } from '../components/Shared';

export default function CustomerReg({ onNavigate }) {
  const { t, ur, setRole, showToast } = useApp();

  const [step, setStep] = useState(0);  // 0=phone, 1=name, 2=done
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const validatePhone = () => {
    const digits = phone.replace(/\D/g, '');
    if (!digits) return t('Please enter your phone number.', 'براہ کرم فون نمبر درج کریں۔');
    if (digits.length < 10) return t('Phone number seems too short.', 'فون نمبر مختصر لگتا ہے۔');
    return '';
  };

  const handlePhoneNext = () => {
    const err = validatePhone();
    if (err) { setPhoneError(err); return; }
    setPhoneError('');
    // Simulate OTP sent
    setOtpSent(true);
    // Auto-fill OTP after 1.5s to simulate delivery
    setTimeout(() => setOtp('1234'), 1500);
  };

  const handleOtpVerify = () => {
    if (!otp) { setOtpError(t('Enter the OTP.', 'OTP درج کریں۔')); return; }
    // For the prototype any 4-digit code works
    if (otp.length < 4) { setOtpError(t('OTP is 4 digits.', 'OTP 4 ہندسے ہیں۔')); return; }
    setOtpError('');
    setStep(1);
  };

  const handleNameNext = () => {
    if (!name.trim()) return;
    setRole('customer');
    showToast(t('Welcome to Roshan Rozgar!', 'روشن روزگار میں خوش آمدید!'), true);
    onNavigate('discover');
  };

  const pct = step === 0 ? 33 : step === 1 ? 66 : 100;

  return (
    <>
      <header className="lnav">
        <div className="wrap">
          <Brand onClick={() => onNavigate('role')} />
          <div style={{ marginInlineStart: 'auto' }}>
            <LangToggle />
          </div>
        </div>
      </header>

      <main className="wrap" style={{ paddingBlock: '32px 64px' }}>
        <div className="ob">

          {/* Progress */}
          <div className="ob-top">
            <button className="icon-btn" onClick={() => step === 0 ? onNavigate('role') : setStep(s => s - 1)} aria-label="Back">
              <Icon name="arrowL" className="flip" />
            </button>
            <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
              <i style={{ width: `${pct}%` }} />
            </div>
            <b className="small num" style={{ whiteSpace: 'nowrap' }}>{step + 1} / 2</b>
          </div>

          {/* Step icons */}
          <div className="ob-steps" aria-hidden="true">
            {['phone', 'user'].map((icon, i) => (
              <span key={i} className={i < step ? 'done' : i === step ? 'now' : ''}>
                <Icon name={i < step ? 'check' : icon} />
              </span>
            ))}
          </div>

          {/* Card */}
          <div className="ob-card">

            {/* ── Step 0: Phone ── */}
            {step === 0 && (
              <>
                <div className="ob-q">
                  <span className="big-ico"><Icon name="phone" /></span>
                  <div className="grow">
                    <p className="ur-line">{t('اپنا فون نمبر درج کریں', 'اپنا فون نمبر درج کریں')}</p>
                    <h2>{t('What is your phone number?', 'آپ کا فون نمبر کیا ہے؟')}</h2>
                    <p className="en-line" style={{ marginTop: 4 }}>
                      {t('We\'ll send a one-time code to verify. No spam.', 'تصدیق کے لیے ایک بار کا کوڈ بھیجیں گے۔')}
                    </p>
                  </div>
                  <SpeakBtn id="reg-phone" en="Enter your phone number" ur="اپنا فون نمبر درج کریں" />
                </div>

                {!otpSent ? (
                  /* Phone input */
                  <div style={{ marginTop: 20 }}>
                    <label className="lbl" htmlFor="phone">
                      {t('Phone number', 'فون نمبر')}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                        color: 'var(--muted)', fontWeight: 700, fontSize: 16, zIndex: 1,
                      }}>+92</span>
                      <input
                        id="phone"
                        type="tel"
                        className="bigfield"
                        style={{ paddingInlineStart: 56 }}
                        placeholder="300 1234567"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setPhoneError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handlePhoneNext()}
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
                      <Icon name="lock" /> {t('Your number is used to identify you. It is not shown to workers until a booking is confirmed.', 'آپ کا نمبر شناخت کے لیے ہے۔ بکنگ کے بعد ہی کاریگر کو دکھایا جائے گا۔')}
                    </p>
                  </div>
                ) : (
                  /* OTP input */
                  <div style={{ marginTop: 20 }}>
                    <div className="heard" style={{ marginBottom: 16 }}>
                      <div className="row" style={{ gap: 8 }}>
                        <span className="pill pill-av"><Icon name="checkCircle" />{t('Code sent', 'کوڈ بھیجا گیا')}</span>
                        <span className="pill pill-sample">{t('Simulated — code is 1234', 'نقلی — کوڈ 1234 ہے')}</span>
                      </div>
                      <p className="small muted">
                        {t('Enter the 4-digit code sent to', 'یہ کوڈ درج کریں')} +92{phone.replace(/\D/g, '')}
                      </p>
                    </div>
                    <label className="lbl" htmlFor="otp">{t('Verification code', 'تصدیقی کوڈ')}</label>
                    <input
                      id="otp"
                      type="tel"
                      className="bigfield"
                      style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: 28 }}
                      placeholder="1234"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleOtpVerify()}
                      autoFocus
                      inputMode="numeric"
                    />
                    {otpError && (
                      <div className="fallback" style={{ marginTop: 10, padding: '10px 14px' }}>
                        <Icon name="alert" /> {otpError}
                      </div>
                    )}
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ marginTop: 10 }}
                      onClick={() => { setOtpSent(false); setOtp(''); }}
                    >
                      <Icon name="refresh" /> {t('Change number', 'نمبر بدلیں')}
                    </button>
                  </div>
                )}

                <div className="ob-foot">
                  {!otpSent ? (
                    <button
                      className="btn btn-primary btn-lg"
                      disabled={!phone.trim()}
                      onClick={handlePhoneNext}
                    >
                      <Icon name="send" className="flip" />
                      {t('Send code', 'کوڈ بھیجیں')}
                      {!ur() && <span className="ur" style={{ fontSize: 15, opacity: 0.85 }}>آگے</span>}
                      <Icon name="arrowR" className="flip" />
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-lg"
                      disabled={otp.length < 4}
                      onClick={handleOtpVerify}
                    >
                      <Icon name="check" />
                      {t('Verify', 'تصدیق کریں')}
                      <Icon name="arrowR" className="flip" />
                    </button>
                  )}
                </div>
              </>
            )}

            {/* ── Step 1: Name ── */}
            {step === 1 && (
              <>
                <div className="ob-q">
                  <span className="big-ico"><Icon name="user" /></span>
                  <div className="grow">
                    <p className="ur-line">{t('آپ کا نام کیا ہے؟', 'آپ کا نام کیا ہے؟')}</p>
                    <h2>{t('What is your name?', 'آپ کا نام کیا ہے؟')}</h2>
                    <p className="en-line" style={{ marginTop: 4 }}>
                      {t('Only your first name and sector are shown to workers.', 'صرف پہلا نام اور سیکٹر کاریگر کو دکھایا جائے گا۔')}
                    </p>
                  </div>
                  <SpeakBtn id="reg-name" en="What is your name?" ur="آپ کا نام کیا ہے؟" />
                </div>

                <div style={{ marginTop: 20 }}>
                  <label className="lbl" htmlFor="custname">{t('Your name', 'آپ کا نام')}</label>
                  <input
                    id="custname"
                    type="text"
                    className="bigfield"
                    placeholder={t('e.g. Ayesha, Kamran, Sara', 'مثلاً: عائشہ، کامران، سارہ')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameNext()}
                    autoFocus
                    autoComplete="name"
                  />

                  {/* Preview of how name appears */}
                  {name.trim() && (
                    <div className="heard" style={{ marginTop: 14 }}>
                      <div className="row" style={{ gap: 12 }}>
                        <Avatar id="ayesha" size={52} radius={16} />
                        <div>
                          <b style={{ display: 'block', fontSize: 18 }}>
                            {name.trim()}
                          </b>
                          <span className="small muted">
                            {t('Customer · G-11/2, Islamabad', 'گاہک · جی الیون، اسلام آباد')}
                          </span>
                        </div>
                      </div>
                      <p className="xs muted">
                        {t('This is how workers will see you on job requests.', 'کاریگر کام کی درخواست پر آپ کو ایسے دیکھیں گے۔')}
                      </p>
                    </div>
                  )}

                  <p className="xs muted" style={{ marginTop: 8 }}>
                    <Icon name="lock" /> {t('Your phone number and address are never shown publicly.', 'آپ کا فون نمبر اور پتا کبھی عام نہیں کیا جاتا۔')}
                  </p>
                </div>

                <div className="ob-foot">
                  <button
                    className="btn btn-primary btn-lg"
                    disabled={!name.trim()}
                    onClick={handleNameNext}
                  >
                    <Icon name="checkCircle" />
                    {t('Continue to Roshan Rozgar', 'روشن روزگار شروع کریں')}
                    {!ur() && <span className="ur" style={{ fontSize: 15, opacity: 0.85 }}>شروع کریں</span>}
                    <Icon name="arrowR" className="flip" />
                  </button>
                </div>
              </>
            )}

          </div>

          {/* Already have account? */}
          <p className="muted small" style={{ textAlign: 'center', marginTop: 20 }}>
            {t('Already registered?', 'پہلے سے رجسٹرڈ؟')}{' '}
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('discover')}>
              {t('Go to discover', 'براؤز کریں')}
            </button>
          </p>

        </div>
      </main>
    </>
  );
}
