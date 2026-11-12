import { useState } from 'react';
import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp } from '../context/AppContext';
import { Brand, SpeakBtn } from '../components/Shared';
import { AreaPicker } from '../components/AreaPicker';
import { OB_STEPS, CATS, SKILLS } from '../lib/data';
import { ExperienceGauge } from '../lib/ExperienceGauge';
import { tr, toPersiDigits } from '../lib/i18n';
import { formatAreaLabel, migrateOldArea } from '../lib/kabulDistricts';

export default function Onboard({ onNavigate }) {
  const {
    ob, obNext, obBack, obJump, obLang, obSet,
    obNameRedo, obTyped, obProf, obSkill, obArea,
    obExp, obDay, obHours, obFinish, speak,
  } = useApp();

  const [typedName, setTypedName] = useState('');
  const [locating, setLocating]   = useState(false);
  const [locError, setLocError]   = useState('');

  // ── Language helpers ────────────────────────────────────────────────────────
  const L  = ob.lang || 'en';           // current onboarding language
  const isFa = L === 'fa';
  // s(key, vars?) — translate using ob.lang
  const s  = (key, vars) => tr(L, key, vars);
  // num(n) — Persian digits in Dari, plain digits in English
  const num = (n) => isFa ? toPersiDigits(n) : String(n);

  // ── Area helpers ─────────────────────────────────────────────────────────────
  // Migrate legacy string areas saved before this feature
  const areaObj = typeof ob.area === 'string'
    ? (migrateOldArea(ob.area) ?? { city: null, districtId: null, neighborhoodId: null })
    : (ob.area || null);

  // Human-readable label for the selected area
  const areaLabel = areaObj ? formatAreaLabel(areaObj, L) : '';

  // ── GPS area finder ─────────────────────────────────────────────────────────
  // Returns new area object shape { city, districtId, neighborhoodId }
  const findNearestArea = (lat, lng) => {
    // Coordinates mapped to new neighborhood slugs
    const AREA_COORDS = [
      { slug: 'shahr-e-naw',     city: 'kabul', districtId: 4,  lat: 34.5260, lng: 69.1781 },
      { slug: 'karte-seh',       city: 'kabul', districtId: 6,  lat: 34.5100, lng: 69.1700 },
      { slug: 'macroyan',        city: 'kabul', districtId: 9,  lat: 34.5200, lng: 69.2050 },
      { slug: 'wazir-akbar-khan',city: 'kabul', districtId: 10, lat: 34.5280, lng: 69.1950 },
      { slug: 'khair-khana',     city: 'kabul', districtId: 11, lat: 34.5450, lng: 69.1650 },
      { slug: 'pul-e-charkhi',   city: 'kabul', districtId: 19, lat: 34.5500, lng: 69.2300 },
      { slug: 'herat-city',      city: 'herat',    districtId: null, lat: 34.3482, lng: 62.2041 },
      { slug: 'mazar-city',      city: 'mazar',    districtId: null, lat: 36.7069, lng: 67.1100 },
      { slug: 'kandahar-city',   city: 'kandahar', districtId: null, lat: 31.6289, lng: 65.7372 },
    ];
    let best = AREA_COORDS[0], minDist = Infinity;
    for (const a of AREA_COORDS) {
      const d = Math.sqrt((lat - a.lat) ** 2 + (lng - a.lng) ** 2);
      if (d < minDist) { minDist = d; best = a; }
    }
    return { city: best.city, districtId: best.districtId, neighborhoodId: best.slug };
  };

  const handleLocate = () => {
    setLocError('');
    if (!navigator.geolocation) {
      setLocError(s('location-unsupported'));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        obArea(findNearestArea(pos.coords.latitude, pos.coords.longitude));
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocError(s('location-denied'));
        } else {
          obArea('Shahr-e-Naw');
        }
      },
      { timeout: 8000, maximumAge: 60000 },
    );
  };

  // ── Progress ─────────────────────────────────────────────────────────────────
  const totalSteps = OB_STEPS.length;
  const pct = Math.round(
    (ob.step + (ob.step === totalSteps - 1 ? 1 : 0)) / totalSteps * 100,
  );
  const st = OB_STEPS[ob.step];

  // ── Validity per step ─────────────────────────────────────────────────────────
  const isValid = () => {
    switch (ob.step) {
      case 0: return !!ob.lang;
      case 1: return ob.nameState === 'confirmed' && ob.name.trim().length > 1;
      case 2: return !!ob.profession;
      case 3: return ob.skills.length > 0;
      case 4: return !!(areaObj && (areaObj.neighborhoodId || areaObj.otherArea));
      case 5: return !!ob.exp;
      case 6: return true;
      case 7: return ob.days.length > 0;
      default: return true;
    }
  };

  // ── Question wrapper ──────────────────────────────────────────────────────────
  // Shows ONLY the text for the current language — no dual-language display.
  const Question = ({ titleKey, hintKey, hintStr, children }) => {
    const title = titleKey ? s(titleKey) : (isFa ? st.fa : st.en);
    const hint  = hintKey  ? s(hintKey)  : hintStr;
    return (
      <>
        <div className="ob-q">
          <span className="big-ico" aria-hidden="true"><Icon name={st.icon} /></span>
          <div className="grow">
            <h2>{title}</h2>
            {hint && <p className="en-line" style={{ marginTop: 4 }}>{hint}</p>}
          </div>
          <SpeakBtn id={`ob${ob.step}`} en={title} fa={title} />
        </div>
        {children}
      </>
    );
  };

  // ── Steps ────────────────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (ob.step) {

      // ── Step 0: Language ──────────────────────────────────────────────────
      case 0:
        return (
          <>
            <Question hintStr={s('choose-lang-hint')}>
              <div className="choice-grid">
                <button
                  className="choice"
                  aria-pressed={ob.lang === 'fa'}
                  onClick={() => obLang('fa')}
                >
                  <span className="tile" style={{ fontFamily: 'var(--f-ur)', fontSize: 22, lineHeight: 1 }}>د</span>
                  <span style={{ fontSize: 22, fontFamily: 'var(--f-ur)' }}>دری</span>
                  <b className="xs muted" style={{ fontWeight: 600 }}>Dari</b>
                </button>
                <button
                  className="choice"
                  aria-pressed={ob.lang === 'en'}
                  onClick={() => obLang('en')}
                >
                  <span className="tile" style={{ fontWeight: 800, fontSize: 20 }}>Aa</span>
                  <b>English</b>
                  <span style={{ fontFamily: 'var(--f-ur)', fontSize: 15 }}>انگلیسی</span>
                </button>
              </div>
            </Question>
            <div className="disclaimer" style={{ marginTop: 16 }}>
              <Icon name="speaker" aria-hidden="true" />
              <span>{s('speaker-hint')}</span>
            </div>
          </>
        );

      // ── Step 1: Name ──────────────────────────────────────────────────────
      case 1: {
        const isConfirmed = ob.nameState === 'confirmed';
        return (
          <Question hintKey="type-name-below">
            <div style={{ marginTop: 20 }}>
              <label className="lbl" htmlFor="obname">
                {s('your-full-name')}
              </label>
              <input
                id="obname"
                className="bigfield"
                value={typedName || ob.name}
                dir={isFa ? 'rtl' : 'ltr'}
                onChange={(e) => {
                  setTypedName(e.target.value);
                  if (isConfirmed) obNameRedo();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (typedName || ob.name).trim().length > 1) {
                    obTyped((typedName || ob.name).trim());
                  }
                }}
                placeholder={s('eg-name')}
                autoComplete="name"
                autoFocus
              />

              {isConfirmed && (
                <div className="heard" style={{ marginTop: 14, background: 'var(--success-50)' }}>
                  <div className="row" style={{ gap: 10, color: '#17714A' }}>
                    <Icon name="checkCircle" aria-hidden="true" />
                    <b>{s('name-saved')}: {ob.name}</b>
                  </div>
                </div>
              )}

              {!isConfirmed && (typedName || ob.name).trim().length > 1 && (
                <button
                  className="btn btn-primary btn-block"
                  style={{ marginTop: 12 }}
                  onClick={() => obTyped((typedName || ob.name).trim())}
                >
                  <Icon name="check" aria-hidden="true" />
                  {s('use-this-name')}
                </button>
              )}

              <p className="small muted" style={{ marginTop: 10 }}>
                <Icon name="users" aria-hidden="true" />
                {' '}{s('first-name-note')}
              </p>
            </div>
          </Question>
        );
      }

      // ── Step 2: Trade ─────────────────────────────────────────────────────
      case 2:
        return (
          <Question hintKey="tap-main-trade">
            <div className="choice-grid three">
              {CATS.map((c) => (
                <button
                  key={c.id}
                  className="choice"
                  aria-pressed={ob.profession === c.id}
                  onClick={() => obProf(c.id)}
                >
                  <span className="tile" aria-hidden="true"><Icon name={c.icon} /></span>
                  <b className="small">{isFa ? c.fa : c.en}</b>
                </button>
              ))}
            </div>
          </Question>
        );

      // ── Step 3: Skills ────────────────────────────────────────────────────
      case 3: {
        const list = SKILLS[ob.profession || 'plumber'];
        return (
          <Question hintKey="tap-all-apply">
            <div className="choice-grid">
              {list.map(([en, fa, i]) => (
                <button
                  key={en}
                  className="choice wide"
                  aria-pressed={ob.skills.includes(en)}
                  onClick={() => obSkill(en)}
                >
                  <span className="tile" style={{ width: 44, height: 44 }} aria-hidden="true">
                    <Icon name={i} />
                  </span>
                  <b className="small">{isFa ? fa : en}</b>
                </button>
              ))}
            </div>
            <div className="voice-big" style={{ marginTop: 14 }}>
              <button className="mic-sm" aria-label={s('something-else')}>
                <Icon name="mic" aria-hidden="true" />
              </button>
              <div>
                <b>{s('something-else')}</b>
                <div className="small muted">{s('say-and-add')}</div>
              </div>
            </div>
          </Question>
        );
      }

      // ── Step 4: Area ──────────────────────────────────────────────────────
      case 4:
        return (
          <Question hintKey="choose-area-hint">
            {/* GPS button */}
            <button
              className="btn btn-outline btn-block"
              style={{ marginTop: 20, minHeight: 60 }}
              onClick={handleLocate}
              disabled={locating}
            >
              {locating
                ? <><Icon name="refresh" aria-hidden="true" />{s('getting-location')}</>
                : <><Icon name="nav"     aria-hidden="true" />{s('use-location')}</>
              }
            </button>

            {locError && (
              <div className="fallback" style={{ marginTop: 8, padding: '10px 14px' }}>
                <Icon name="alert" aria-hidden="true" /> {locError}
              </div>
            )}

            {/* Selected confirmation badge */}
            {areaLabel && (
              <div className="heard" style={{ marginTop: 10, background: 'var(--success-50)' }}>
                <div className="row" style={{ gap: 8, color: '#17714A' }}>
                  <Icon name="checkCircle" aria-hidden="true" />
                  <b>{s('area-selected')}: {areaLabel}</b>
                </div>
              </div>
            )}

            {/* Two-step district → neighborhood picker */}
            <AreaPicker
              lang={L}
              value={areaObj}
              onChange={(newArea) => obArea(newArea)}
            />
          </Question>
        );

      // ── Step 5: Experience ────────────────────────────────────────────────
      case 5: {
        const EXP_CARDS = [
          { v: '1-2',  numKey: 'exp-1-2',  labelKey: 'exp-1-2-label',  level: 1 },
          { v: '3-5',  numKey: 'exp-3-5',  labelKey: 'exp-3-5-label',  level: 2 },
          { v: '6-10', numKey: 'exp-6-10', labelKey: 'exp-6-10-label', level: 3 },
          { v: '10+',  numKey: 'exp-10plus',labelKey:'exp-10plus-label',level: 4 },
        ];
        return (
          <Question hintKey="tap-one">
            <div className="yrs">
              {EXP_CARDS.map(({ v, numKey, labelKey, level }) => (
                <button
                  key={v}
                  className="yr"
                  aria-pressed={ob.exp === v}
                  aria-label={s(labelKey)}
                  onClick={() => obExp(v)}
                >
                  {/* Gauge — never flipped in RTL */}
                  <span
                    className="yr-icon"
                    style={{ color: 'var(--forest)', direction: 'ltr' }}
                  >
                    <ExperienceGauge level={level} />
                  </span>
                  <b className="num">{s(numKey)}</b>
                  <span className="xs muted">{s('years')}</span>
                </button>
              ))}
            </div>
          </Question>
        );
      }

      // ── Step 6: Photo ─────────────────────────────────────────────────────
      case 6:
        return (
          <Question hintKey="photo-hint">
            <div className="photo-drop">
              <div className="photo-circle">
                {ob.photo
                  ? <img src={ob.photo} alt={s('add-photo')} />
                  : <span style={{ color: 'var(--emerald)' }}><Icon name="user" aria-hidden="true" /></span>
                }
              </div>
              <div className="row wrapit" style={{ justifyContent: 'center' }}>
                <label className="btn btn-primary" htmlFor="obphoto">
                  <Icon name="camera" aria-hidden="true" />
                  {s('take-upload-photo')}
                </label>
                <input
                  id="obphoto"
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="sr"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      const reader = new FileReader();
                      reader.onload = (ev) => obSet({ photo: ev.target.result });
                      reader.readAsDataURL(f);
                    }
                  }}
                />
                <button className="btn btn-outline" onClick={() => obSet({ photo: '' })}>
                  <Icon name="image" aria-hidden="true" />
                  {s('use-sample-photo')}
                </button>
              </div>
              <p className="small muted" style={{ fontSize: 15 }}>{s('photo-tip')}</p>
            </div>
          </Question>
        );

      // ── Step 7: Schedule ──────────────────────────────────────────────────
      case 7: {
        const DAYS = [
          { key: 'Sat', tKey: 'sat' },
          { key: 'Sun', tKey: 'sun' },
          { key: 'Mon', tKey: 'mon' },
          { key: 'Tue', tKey: 'tue' },
          { key: 'Wed', tKey: 'wed' },
          { key: 'Thu', tKey: 'thu' },
          { key: 'Fri', tKey: 'fri' },
        ];
        const HOURS = [
          { val: '9 AM – 1 PM',  tKey: 'morning',   icon: 'sun'      },
          { val: '1 PM – 6 PM',  tKey: 'afternoon',  icon: 'sun'      },
          { val: '6 PM – 10 PM', tKey: 'evening',    icon: 'clock'    },
          { val: '9 AM – 7 PM',  tKey: 'full-day',   icon: 'calendar' },
        ];
        return (
          <Question hintKey="tap-days">
            <div className="daygrid">
              {DAYS.map(({ key, tKey }) => (
                <button
                  key={key}
                  className="day"
                  aria-pressed={ob.days.includes(key)}
                  onClick={() => obDay(key)}
                >
                  {s(tKey)}
                </button>
              ))}
            </div>

            <h3 style={{ marginTop: 22, fontSize: 16, color: 'var(--ink)' }}>
              {s('usual-hours')}
            </h3>

            <div className="choice-grid" style={{ marginTop: 10 }}>
              {HOURS.map(({ val, tKey, icon }) => (
                <button
                  key={val}
                  className="choice wide"
                  aria-pressed={ob.hours === val}
                  onClick={() => obHours(val)}
                >
                  <span className="tile" style={{ width: 44, height: 44 }} aria-hidden="true">
                    <Icon name={icon} />
                  </span>
                  <b className="small">{s(tKey)}</b>
                </button>
              ))}
            </div>
          </Question>
        );
      }

      // ── Step 8: Preview ───────────────────────────────────────────────────
      case 8: {
        const c = CATS.find((x) => x.id === (ob.profession || 'plumber'));
        const EDIT_ROWS = [
          { step: 1, labelKey: 'edit-name',   val: ob.name },
          { step: 2, labelKey: 'edit-work',   val: isFa ? c.fa : c.en },
          { step: 3, labelKey: 'edit-skills', val: `${num(ob.skills.length)} ${s('selected')}` },
          { step: 4, labelKey: 'edit-area',   val: areaLabel || '—' },
          { step: 5, labelKey: 'edit-exp',    val: `${ob.exp} ${s('yrs')}` },
          { step: 7, labelKey: 'edit-days',   val: `${num(ob.days.length)} ${s('days')}` },
        ];
        return (
          <Question hintKey="preview-hint">
            <div className="wcard" style={{ marginTop: 18, border: '2px solid var(--emerald)' }}>
              <div className="top">
                {ob.photo
                  ? <span className="ava" style={{ width: 72, height: 72 }}>
                      <img src={ob.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </span>
                  : <Avatar id="ahmad" size={72} />
                }
                <div className="grow">
                  <h3>{ob.name}</h3>
                  <div className="meta">
                    <span>
                      <Icon name={c.icon} aria-hidden="true" />
                      {isFa ? c.fa : c.en}
                    </span>
                  </div>
                  <div className="meta">
                    <span><Icon name="star" aria-hidden="true" />{ob.exp} {s('years')}</span>
                    <span><Icon name="pin"  aria-hidden="true" />{areaLabel}</span>
                  </div>
                </div>
                <span className="pill pill-av">
                  <span className="dot dot-av" />
                  {s('available-now')}
                </span>
              </div>
              <div className="skills">
                {ob.skills.map((sk) => <span key={sk} className="skill">{sk}</span>)}
              </div>
              <div className="meta">
                <span><Icon name="calendar" aria-hidden="true" />{ob.days.join(', ')}</span>
                <span><Icon name="clock"    aria-hidden="true" />{ob.hours}</span>
              </div>
            </div>

            <div className="stack" style={{ gap: 8, marginTop: 14 }}>
              {EDIT_ROWS.map(({ step, labelKey, val }) => (
                <div key={step} className="row between card" style={{ padding: '10px 14px', borderRadius: 14 }}>
                  <span>
                    <b className="small">{s(labelKey)}:</b>{' '}
                    <span className="small">{val}</span>
                  </span>
                  <button
                    className="icon-btn"
                    style={{ width: 40, height: 40 }}
                    onClick={() => obJump(step)}
                    aria-label={`${s('back')} — ${s(labelKey)}`}
                  >
                    <Icon name="edit" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </Question>
        );
      }

      // ── Step 9: Success ───────────────────────────────────────────────────
      case 9:
        return (
          <div className="success-burst">
            <div className="burst"><Icon name="check" aria-hidden="true" /></div>
            <h2 style={{ fontSize: 28 }}>{s('profile-is-live')}</h2>
            <p className="muted" style={{ maxWidth: '30em' }}>
              {s('profile-live-desc', { area: ob.area || 'Shahr-e-Naw' })}
            </p>
            <SpeakBtn
              id="obdone"
              en={s('congratulations')}
              fa={s('congratulations')}
            />
            <div className="stack" style={{ width: '100%', maxWidth: 380, marginTop: 8 }}>
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={() => { obFinish(); onNavigate('wdash'); }}
              >
                <Icon name="home" aria-hidden="true" />
                {s('go-home')}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <header className="lnav">
        <div className="wrap">
          <Brand onClick={() => onNavigate('home')} />
          <span
            className="pill pill-info"
            style={{ marginInlineStart: 'auto' }}
          >
            <Icon name="mic" aria-hidden="true" />
            {s('voice-signup')}
          </span>
        </div>
      </header>

      <main className="wrap" style={{ paddingBlock: '20px 48px' }}>
        <div className="ob">
          {ob.step < totalSteps - 1 && (
            <>
              {/* Progress bar + counter */}
              <div className="ob-top">
                <button
                  className="icon-btn"
                  onClick={obBack}
                  aria-label={s('back')}
                >
                  {/* In RTL the arrow should point right (flip class mirrors it) */}
                  <Icon name="arrowL" className="flip" aria-hidden="true" />
                </button>
                <div
                  className="progress"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  /* Progress bar fills from right in RTL via CSS */
                >
                  <i style={{ width: `${pct}%` }} />
                </div>
                {/* Persian digits for step counter in Dari */}
                <b className="small num" style={{ whiteSpace: 'nowrap' }}>
                  {num(ob.step + 1)} / {num(totalSteps)}
                </b>
              </div>

              {/* Step indicator dots */}
              <div className="ob-steps" aria-hidden="true">
                {OB_STEPS.map((step, i) => (
                  <span
                    key={i}
                    className={i < ob.step ? 'done' : i === ob.step ? 'now' : ''}
                  >
                    <Icon name={i < ob.step ? 'check' : step.icon} />
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="ob-card">
            {renderStep()}

            {/* Next / Skip / Create-profile buttons */}
            {ob.step < totalSteps - 1 && (
              <div className="ob-foot">
                {ob.step === 6 && !ob.photo && (
                  <button className="btn btn-outline" onClick={obNext}>
                    {s('skip')}
                  </button>
                )}
                <button
                  className="btn btn-primary btn-lg"
                  disabled={!isValid()}
                  onClick={obNext}
                >
                  {ob.step === 8 ? s('create-profile') : s('next')}
                  {/* Arrow points LEFT in RTL — the flip class handles mirroring */}
                  <Icon name="arrowR" className="flip" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
