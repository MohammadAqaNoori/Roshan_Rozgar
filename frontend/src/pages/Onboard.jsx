import { useState } from 'react';
import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp } from '../context/AppContext';
import { Brand, SpeakBtn } from '../components/Shared';
import { OB_STEPS, CATS, SKILLS, AREAS } from '../lib/data';

export default function Onboard({ onNavigate }) {
  const { t, ur, ob, obNext, obBack, obJump, obLang, obSet, obNameListen, obNameYes, obNameNo, obNameRedo, obTyped, obProf, obSkill, obArea, obExp, obDay, obHours, obFinish, speak } = useApp();
  const [typedName, setTypedName] = useState('');
  const n = OB_STEPS.length;
  const pct = Math.round((ob.step + (ob.step === n - 1 ? 1 : 0)) / n * 100);
  const st = OB_STEPS[ob.step];

  const isValid = () => {
    switch (ob.step) {
      case 0: return !!ob.lang;
      case 1: return ob.nameState === 'confirmed' && ob.name.trim().length > 1;
      case 2: return !!ob.profession;
      case 3: return ob.skills.length > 0;
      case 4: return !!ob.area;
      case 5: return !!ob.exp;
      case 6: return true;
      case 7: return ob.days.length > 0;
      default: return true;
    }
  };

  const Question = ({ sub, children }) => (
    <>
      <div className="ob-q">
        <span className="big-ico"><Icon name={st.icon} /></span>
        <div className="grow">
          <p className="ur-line">{st.ur}</p>
          <h2>{st.en}</h2>
          {sub && <p className="en-line" style={{ marginTop: 4 }}>{sub}</p>}
        </div>
        <SpeakBtn id={`ob${ob.step}`} en={`${st.en}. ${sub || ''}`} ur={`${st.ur}. ${sub || ''}`} />
      </div>
      {children}
    </>
  );

  const renderStep = () => {
    switch (ob.step) {
      // Step 0: Language
      case 0:
        return (
          <>
            <Question sub="Tap one. You can change it any time.">
              <div className="choice-grid">
                <button className="choice" aria-pressed={ob.lang === 'ur'} onClick={() => obLang('ur')}>
                  <span className="tile" style={{ fontFamily: 'var(--f-ur)', fontSize: 22, lineHeight: 1 }}>اُ</span>
                  <span className="u" style={{ fontSize: 22 }}>اردو</span>
                  <b className="xs muted" style={{ fontWeight: 600 }}>Urdu</b>
                </button>
                <button className="choice" aria-pressed={ob.lang === 'en'} onClick={() => obLang('en')}>
                  <span className="tile" style={{ fontWeight: 800, fontSize: 20 }}>Aa</span>
                  <b>English</b>
                  <span className="u">انگریزی</span>
                </button>
              </div>
            </Question>
            <div className="disclaimer" style={{ marginTop: 16 }}><Icon name="speaker" /><span>{t('Tap the yellow speaker on any step to hear it read aloud.', 'کسی بھی قدم پر پیلے اسپیکر کو دبائیں اور سنیں۔')}</span></div>
          </>
        );

      // Step 1: Name — text input
      case 1: {
        const isConfirmed = ob.nameState === 'confirmed';
        return (
          <Question sub={t('Type your name below.', 'نیچے اپنا نام لکھیں۔')}>
            <div style={{ marginTop: 20 }}>
              <label className="lbl" htmlFor="obname">
                {t('Your full name', 'آپ کا پورا نام')}
              </label>
              <input
                id="obname"
                className="bigfield"
                value={typedName || ob.name}
                onChange={(e) => {
                  setTypedName(e.target.value);
                  // Reset confirmed state if user edits
                  if (isConfirmed) obNameRedo();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (typedName || ob.name).trim().length > 1) {
                    obTyped((typedName || ob.name).trim());
                  }
                }}
                placeholder={t('e.g. Muhammad Imran', 'مثلاً: محمد عمران')}
                autoComplete="name"
                autoFocus
              />

              {/* Confirmation tick once name is set */}
              {isConfirmed && (
                <div className="heard" style={{ marginTop: 14, background: 'var(--success-50)' }}>
                  <div className="row" style={{ gap: 10, color: '#17714A' }}>
                    <Icon name="checkCircle" />
                    <b>{t('Name saved', 'نام محفوظ')}: {ob.name}</b>
                  </div>
                </div>
              )}

              {/* Confirm button — shown when something is typed but not yet confirmed */}
              {!isConfirmed && (typedName || ob.name).trim().length > 1 && (
                <button
                  className="btn btn-primary btn-block"
                  style={{ marginTop: 12 }}
                  onClick={() => obTyped((typedName || ob.name).trim())}
                >
                  <Icon name="check" />
                  {t('Use this name', 'یہ نام رکھیں')}
                  <span className="ur" style={{ fontSize: 15, opacity: 0.85 }}>ٹھیک ہے</span>
                </button>
              )}

              <p className="small muted" style={{ marginTop: 10 }}>
                <Icon name="users" />
                {' '}{t('Only your first name is shown to customers.', 'گاہک کو صرف پہلا نام دکھایا جاتا ہے۔')}
              </p>
            </div>
          </Question>
        );
      }

      // Step 2: Trade
      case 2:
        return (
          <Question sub="Tap your main trade.">
            <div className="choice-grid three">
              {CATS.map((c) => (
                <button key={c.id} className="choice" aria-pressed={ob.profession === c.id} onClick={() => obProf(c.id)}>
                  <span className="tile"><Icon name={c.icon} /></span>
                  <span className="u">{c.ur}</span>
                  <b className="small">{c.en}</b>
                </button>
              ))}
            </div>
          </Question>
        );

      // Step 3: Skills
      case 3: {
        const list = SKILLS[ob.profession || 'plumber'];
        return (
          <Question sub="Tap all that apply.">
            <div className="choice-grid">
              {list.map(([en, u, i]) => (
                <button key={en} className="choice wide" aria-pressed={ob.skills.includes(en)} onClick={() => obSkill(en)}>
                  <span className="tile" style={{ width: 44, height: 44 }}><Icon name={i} /></span>
                  <span><span className="u" style={{ display: 'block' }}>{u}</span><b className="small">{en}</b></span>
                </button>
              ))}
            </div>
            <div className="voice-big" style={{ marginTop: 14 }}>
              <button className="mic-sm" aria-label="Say another skill"><Icon name="mic" /></button>
              <div><b>{t('Something else?', 'کچھ اور؟')}</b><div className="small muted">{t('Say it and we\u2019ll add it', 'بول دیں، ہم شامل کر دیں گے')}</div></div>
            </div>
          </Question>
        );
      }

      // Step 4: Area
      case 4:
        return (
          <Question sub="Choose the area where you take jobs.">
            <button className="btn btn-outline btn-block" style={{ marginTop: 20, minHeight: 60 }}><Icon name="nav" />{t('Use my current location', 'میری موجودہ جگہ')}</button>
            <p className="xs muted" style={{ textAlign: 'center', marginTop: 6 }}>{t('Prototype: location is simulated as G-11, Islamabad', 'نقلی جگہ: جی الیون')}</p>
            <div className="choice-grid three" style={{ marginTop: 14 }}>
              {AREAS.map((a) => (
                <button key={a.id} className="choice" style={{ minHeight: 92 }} aria-pressed={ob.area === a.id} onClick={() => obArea(a.id)}>
                  <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--forest)' }}>{a.id}</span>
                  <span className="xs muted">{a.city}</span>
                </button>
              ))}
            </div>
          </Question>
        );

      // Step 5: Experience
      case 5:
        return (
          <Question sub="Tap one.">
            <div className="yrs">
              {[['1-2', '1–2', 1, '۱ سے ۲ سال'], ['3-5', '3–5', 2, '۳ سے ۵ سال'], ['6-10', '6–10', 3, '۶ سے ۱۰ سال'], ['10+', '10+', 4, '۱۰ سال سے زیادہ']].map(([v, l, b, u]) => (
                <button key={v} className="yr" aria-pressed={ob.exp === v} onClick={() => obExp(v)}>
                  <span className="bars">{[10, 16, 21, 26].map((h, i) => <i key={i} className={i < b ? 'on' : ''} style={{ height: `${h}px` }} />)}</span>
                  <b className="num">{l}</b>
                  <span className="ur small">{u}</span>
                  <span className="xs muted">{t('years', 'سال')}</span>
                </button>
              ))}
            </div>
          </Question>
        );

      // Step 6: Photo
      case 6:
        return (
          <Question sub="Customers trust a clear face photo. You can skip this.">
            <div className="photo-drop">
              <div className="photo-circle">
                {ob.photo ? <img src={ob.photo} alt="Your photo" /> : <span style={{ color: 'var(--emerald)' }}><Icon name="user" /></span>}
              </div>
              <div className="row wrapit" style={{ justifyContent: 'center' }}>
                <label className="btn btn-primary" htmlFor="obphoto"><Icon name="camera" />{t('Take or upload photo', 'تصویر لیں')}</label>
                <input id="obphoto" type="file" accept="image/*" capture="user" className="sr" onChange={(e) => { const f = e.target.files[0]; if (f) { const reader = new FileReader(); reader.onload = (ev) => obSet({ photo: ev.target.result }); reader.readAsDataURL(f); } }} />
                <button className="btn btn-outline" onClick={() => obSet({ photo: '' })}><Icon name="image" />{t('Use sample photo', 'نمونہ تصویر')}</button>
              </div>
              <p className="small muted ur" style={{ fontSize: 15 }}>چہرہ صاف ہو، روشنی اچھی ہو</p>
            </div>
          </Question>
        );

      // Step 7: Schedule
      case 7:
        return (
          <Question sub="Tap the days you usually work.">
            <div className="daygrid">
              {[['Mon', 'پیر'], ['Tue', 'منگل'], ['Wed', 'بدھ'], ['Thu', 'جمعرات'], ['Fri', 'جمعہ'], ['Sat', 'ہفتہ'], ['Sun', 'اتوار']].map(([d, u]) => (
                <button key={d} className="day" aria-pressed={ob.days.includes(d)} onClick={() => obDay(d)}>{d}<span className="u">{u}</span></button>
              ))}
            </div>
            <h3 style={{ marginTop: 22, fontSize: 16, color: 'var(--ink)' }}>{t('Usual hours', 'عام اوقات')}</h3>
            <div className="choice-grid" style={{ marginTop: 10 }}>
              {[['9 AM – 1 PM', 'صبح', 'sun'], ['1 PM – 6 PM', 'دوپہر', 'sun'], ['6 PM – 10 PM', 'شام', 'clock'], ['9 AM – 7 PM', 'پورا دن', 'calendar']].map(([h, u, i]) => (
                <button key={h} className="choice wide" aria-pressed={ob.hours === h} onClick={() => obHours(h)}>
                  <span className="tile" style={{ width: 44, height: 44 }}><Icon name={i} /></span>
                  <span><span className="u" style={{ display: 'block' }}>{u}</span><b className="small num">{h}</b></span>
                </button>
              ))}
            </div>
          </Question>
        );

      // Step 8: Preview
      case 8: {
        const c = CATS.find((x) => x.id === (ob.profession || 'plumber'));
        return (
          <Question sub="This is what customers will see. Tap a pencil to change something.">
            <div className="wcard" style={{ marginTop: 18, border: '2px solid var(--emerald)' }}>
              <div className="top">
                {ob.photo ? <span className="ava" style={{ width: 72, height: 72 }}><img src={ob.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></span> : <Avatar id="imran" size={72} />}
                <div className="grow">
                  <h3>{ob.name}</h3>
                  <div className="meta"><span><Icon name={c.icon} />{c.en} · <span className="ur">{c.ur}</span></span></div>
                  <div className="meta"><span><Icon name="star" />{ob.exp} {t('years', 'سال')}</span><span><Icon name="pin" />{ob.area}</span></div>
                </div>
                <span className="pill pill-av"><span className="dot dot-av" />{t('Available now', 'ابھی دستیاب')}</span>
              </div>
              <div className="skills">{ob.skills.map((s) => <span key={s} className="skill">{s}</span>)}</div>
              <div className="meta"><span><Icon name="calendar" />{ob.days.join(', ')}</span><span><Icon name="clock" />{ob.hours}</span></div>
            </div>
            <div className="stack" style={{ gap: 8, marginTop: 14 }}>
              {[[1, 'Name', 'نام', ob.name], [2, 'Work', 'کام', c.en], [3, 'Skills', 'ہنر', `${ob.skills.length} selected`], [4, 'Area', 'علاقہ', ob.area], [5, 'Experience', 'تجربہ', `${ob.exp} yrs`], [7, 'Days', 'دن', `${ob.days.length} days`]].map(([s, en, u, v]) => (
                <div key={s} className="row between card" style={{ padding: '10px 14px', borderRadius: 14 }}>
                  <span><span className="ur small muted">{u}</span> <b className="small">{en}:</b> <span className="small">{v}</span></span>
                  <button className="icon-btn" style={{ width: 40, height: 40 }} onClick={() => obJump(s)} aria-label={`Edit ${en}`}><Icon name="edit" /></button>
                </div>
              ))}
            </div>
          </Question>
        );
      }

      // Step 9: Success
      case 9:
        return (
          <div className="success-burst">
            <div className="burst"><Icon name="check" /></div>
            <p className="ur" style={{ fontSize: 26, color: 'var(--forest)' }}>مبارک ہو! آپ کی پروفائل تیار ہے</p>
            <h2 style={{ fontSize: 28 }}>{t('Your profile is live', 'آپ کی پروفائل لائیو ہے')}</h2>
            <p className="muted" style={{ maxWidth: '30em' }}>{t(`Customers near ${ob.area || 'G-11'} can now find you. Keep your status on "Available" to get job requests.`, `قریبی گاہک اب آپ کو ڈھونڈ سکتے ہیں۔`)}</p>
            <SpeakBtn id="obdone" en="Congratulations, your profile is ready." ur="مبارک ہو! آپ کی پروفائل تیار ہے۔" />
            <div className="stack" style={{ width: '100%', maxWidth: 380, marginTop: 8 }}>
              <button className="btn btn-primary btn-lg btn-block" onClick={() => { obFinish(); onNavigate('wdash'); }}><Icon name="home" />{t('Go to my home screen', 'میری ہوم اسکرین')}</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <header className="lnav">
        <div className="wrap">
          <Brand onClick={() => onNavigate('home')} />
          <span className="pill pill-info" style={{ marginInlineStart: 'auto' }}><Icon name="mic" />{t('Voice sign-up', 'آواز سے رجسٹریشن')}</span>
        </div>
      </header>
      <main className="wrap" style={{ paddingBlock: '20px 48px' }}>
        <div className="ob">
          {ob.step < n - 1 && (
            <>
              <div className="ob-top">
                <button className="icon-btn" onClick={obBack} aria-label="Back"><Icon name="arrowL" className="flip" /></button>
                <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
                  <i style={{ width: `${pct}%` }} />
                </div>
                <b className="small num" style={{ whiteSpace: 'nowrap' }}>{ob.step + 1} / {n}</b>
              </div>
              <div className="ob-steps" aria-hidden="true">
                {OB_STEPS.map((s, i) => (
                  <span key={i} className={i < ob.step ? 'done' : i === ob.step ? 'now' : ''}>
                    <Icon name={i < ob.step ? 'check' : s.icon} />
                  </span>
                ))}
              </div>
            </>
          )}
          <div className="ob-card">
            {renderStep()}
            {ob.step < n - 1 && (
              <div className="ob-foot">
                {ob.step === 6 && !ob.photo && <button className="btn btn-outline" onClick={obNext}>{t('Skip', 'چھوڑیں')}</button>}
                <button className="btn btn-primary btn-lg" disabled={!isValid()} onClick={obNext}>
                  {ob.step === 8 ? t('Create my profile', 'پروفائل بنائیں') : t('Next', 'آگے')}
                  {!ur() && ob.step !== 8 && <span className="ur" style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.2 }}>آگے</span>}
                  <Icon name="arrowR" className="flip" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
