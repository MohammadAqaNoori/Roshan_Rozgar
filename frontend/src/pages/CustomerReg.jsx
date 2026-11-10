/**
 * Customer Registration — simple 2-step flow.
 * v2.0 — Afghanistan localization (Karigar)
 */
import { useState } from 'react';
import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp } from '../context/AppContext';
import { Brand, LangToggle, SpeakBtn } from '../components/Shared';

export default function CustomerReg({ onNavigate }) {
  const { t, fa, setRole, showToast } = useApp();

  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const validatePhone = () => {
    const digits = phone.replace(/\D/g, '');
    if (!digits) return t('Please enter your phone number.', 'لطفاً شماره تلفن خود را وارد کنید.');
    if (digits.length < 9) return t('Phone number seems too short.', 'شماره تلفن کوتاه به نظر می‌رسد.');
    return '';
  };

  const handlePhoneNext = () => {
    const err = validatePhone();
    if (err) { setPhoneError(err); return; }
    setPhoneError('');
    setOtpSent(true);
    setTimeout(() => setOtp('1234'), 1500);
  };

  const handleOtpVerify = () => {
    if (!otp) { setOtpError(t('Enter the OTP.', 'OTP را وارد کنید.')); return; }
    if (otp.length < 4) { setOtpError(t('OTP is 4 digits.', 'OTP ۴ رقم است.')); return; }
    setOtpError('');
    setStep(1);
  };

  const handleNameNext = () => {
    if (!name.trim()) return;
    setRole('customer');
    showToast(t('Welcome to Karigar!', 'به کاریگر خوش آمدید!'), true);
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
          <div className="ob-top">
            <button className="icon-btn" onClick={() => step === 0 ? onNavigate('role') : setStep(s => s - 1)} aria-label="Back">
              <Icon name="arrowL" className="flip" />
            </button>
            <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
              <i style={{ width: `${pct}%` }} />
            </div>
            <b className="small num" style={{ whiteSpace: 'nowrap' }}>{step + 1} / 2</b>
          </div>

          <div className="ob-steps" aria-hidden="true">
            {['phone', 'user'].map((icon, i) => (
              <span key={i} className={i < step ? 'done' : i === step ? 'now' : ''}>
                <Icon name={i < step ? 'check' : icon} />
              </span>
            ))}
          </div>

          <div className="ob-card">

            {/* Step 0: Phone */}
            {step === 0 && (
              <>
                <div className="ob-q">
                  <span className="big-ico"><Icon name="phone" /></span>
                  <div className="grow">
                    <p className="ur-line">{t('شماره تلفن خود را وارد کنید', 'شماره تلفن خود را وارد کنید')}</p>
                    <h2>{t('What is your phone number?', 'شماره تلفن شما چیست؟')}</h2>
                    <p className="en-line" style={{ marginTop: 4 }}>
                      {t("We'll send a one-time code to verify. No spam.", 'کد یکبار مصرف برای تأیید می‌فرستیم. اسپم نیست.')}
                    </p>
                  </div>
                  <SpeakBtn id="reg-phone" en="Enter your phone number" fa="شماره تلفن خود را وارد کنید" />
                </div>

                {!otpSent ? (
                  <div style={{ marginTop: 20 }}>
                    <label className="lbl" htmlFor="phone">{t('Phone number', 'شماره تلفن')}</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                        color: 'var(--muted)', fontWeight: 700, fontSize: 16, zIndex: 1,
                      }}>+93</span>
                      <input
                        id="phone"
                        type="tel"
                        className="bigfield"
                        style={{ paddingInlineStart: 56 }}
                        placeholder="700 123456"
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
                      <Icon name="lock" /> {t('Your number is used to identify you. It is not shown to workers until a booking is confirmed.', 'شماره شما برای شناسایی استفاده می‌شود. فقط پس از تأیید رزرو به کاریگر نشان داده می‌شود.')}
                    </p>
                  </div>
                ) : (
                  <div style={{ marginTop: 20 }}>
                    <div className="heard" style={{ marginBottom: 16 }}>
                      <div className="row" style={{ gap: 8 }}>
                        <span className="pill pill-av"><Icon name="checkCircle" />{t('Code sent', 'کد ارسال شد')}</span>
                        <span className="pill pill-sample">{t('Simulated — code is 1234', 'شبیه‌سازی شده — کد ۱۲۳۴ است')}</span>
                      </div>
                      <p className="small muted">
                        {t('Enter the 4-digit code sent to', 'کد ۴ رقمی ارسال شده به')} +93{phone.replace(/\D/g, '')}
                      </p>
                    </div>
                    <label className="lbl" htmlFor="otp">{t('Verification code', 'کد تأیید')}</label>
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
                    <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => { setOtpSent(false); setOtp(''); }}>
                      <Icon name="refresh" /> {t('Change number', 'تغییر شماره')}
                    </button>
                  </div>
                )}

                <div className="ob-foot">
                  {!otpSent ? (
                    <button className="btn btn-primary btn-lg" disabled={!phone.trim()} onClick={handlePhoneNext}>
                      <Icon name="send" className="flip" />
                      {t('Send code', 'کد را بفرستید')}
                      <Icon name="arrowR" className="flip" />
                    </button>
                  ) : (
                    <button className="btn btn-primary btn-lg" disabled={otp.length < 4} onClick={handleOtpVerify}>
                      <Icon name="check" />
                      {t('Verify', 'تأیید')}
                      <Icon name="arrowR" className="flip" />
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Step 1: Name */}
            {step === 1 && (
              <>
                <div className="ob-q">
                  <span className="big-ico"><Icon name="user" /></span>
                  <div className="grow">
                    <p className="ur-line">{t('نام شما چیست؟', 'نام شما چیست؟')}</p>
                    <h2>{t('What is your name?', 'نام شما چیست؟')}</h2>
                    <p className="en-line" style={{ marginTop: 4 }}>
                      {t('Only your first name and area are shown to workers.', 'فقط نام اول و منطقه شما به کاریگران نشان داده می‌شود.')}
                    </p>
                  </div>
                  <SpeakBtn id="reg-name" en="What is your name?" fa="نام شما چیست؟" />
                </div>

                <div style={{ marginTop: 20 }}>
                  <label className="lbl" htmlFor="custname">{t('Your name', 'نام شما')}</label>
                  <input
                    id="custname"
                    type="text"
                    className="bigfield"
                    placeholder={t('e.g. Mariam, Ahmad, Fatima', 'مثلاً: مریم، احمد، فاطمه')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameNext()}
                    autoFocus
                    autoComplete="name"
                  />

                  {name.trim() && (
                    <div className="heard" style={{ marginTop: 14 }}>
                      <div className="row" style={{ gap: 12 }}>
                        <Avatar id="mariam" size={52} radius={16} />
                        <div>
                          <b style={{ display: 'block', fontSize: 18 }}>{name.trim()}</b>
                          <span className="small muted">
                            {t('Customer · Shahr-e-Naw, Kabul', 'مشتری · شهر نو، کابل')}
                          </span>
                        </div>
                      </div>
                      <p className="xs muted">
                        {t('This is how workers will see you on job requests.', 'کاریگران شما را در درخواست‌های کار این‌گونه می‌بینند.')}
                      </p>
                    </div>
                  )}

                  <p className="xs muted" style={{ marginTop: 8 }}>
                    <Icon name="lock" /> {t('Your phone number and address are never shown publicly.', 'شماره تلفن و آدرس شما هرگز علنی نمی‌شود.')}
                  </p>
                </div>

                <div className="ob-foot">
                  <button className="btn btn-primary btn-lg" disabled={!name.trim()} onClick={handleNameNext}>
                    <Icon name="checkCircle" />
                    {t('Continue to Karigar', 'ورود به کاریگر')}
                    <Icon name="arrowR" className="flip" />
                  </button>
                </div>
              </>
            )}

          </div>

          <p className="muted small" style={{ textAlign: 'center', marginTop: 20 }}>
            {t('Already registered?', 'از قبل ثبت‌نام کرده‌اید؟')}{' '}
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('discover')}>
              {t('Go to discover', 'مشاهده')}
            </button>
          </p>

        </div>
      </main>
    </>
  );
}
