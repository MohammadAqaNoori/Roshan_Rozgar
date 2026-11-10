/**
 * Landing page for "Roshan Rozgar" — hyper-local marketplace for skilled trade workers.
 */
import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp, rs } from '../context/AppContext';
import { Brand, Stars, StatusPill, WorkerCard, SpeakBtn, Disclaimer } from '../components/Shared';
import { CATS, seedWorkers } from '../lib/data';

export default function Home({ onNavigate }) {
  const { t, ur, setLang } = useApp();
  const workers = seedWorkers();
  const feat = ['imran', 'rehman', 'naveed'].map((id) => workers.find((w) => w.id === id));
  const rehman = workers.find((w) => w.id === 'rehman');

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Waveform bars for hero voice card animation
  const waveBars = [8, 16, 10, 20, 12, 18, 7, 14, 9, 16, 11];

  return (
    <>
      {/* ─────────────── 1. NAV BAR ─────────────── */}
      <header className="lnav">
        <div className="wrap">
          <Brand onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          <nav className="links" aria-label="Site">
            <a onClick={() => scrollTo('services')} style={{ cursor: 'pointer' }}>{t('Services', 'خدمات')}</a>
            <a onClick={() => scrollTo('how')} style={{ cursor: 'pointer' }}>{t('How it works', 'طریقہ کار')}</a>
            <a onClick={() => scrollTo('join')} style={{ cursor: 'pointer' }}>{t('Become a worker', 'کاریگر بنیں')}</a>
            <a onClick={() => scrollTo('about')} style={{ cursor: 'pointer' }}>{t('About', 'ہمارے بارے میں')}</a>
          </nav>
          <div className="row" style={{ gap: 8, marginInlineStart: 'auto' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setLang(ur() ? 'en' : 'ur')}>
              <Icon name="globe" />
              <span className={ur() ? '' : 'ur'} style={{ lineHeight: 1.2 }}>
                {ur() ? 'English' : 'اردو'}
              </span>
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigate('login')}>
              {t('Log in', 'لاگ ان')}
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('role')}>
              {t('Sign up', 'رجسٹر کریں')}
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────── 2. HERO ─────────────── */}
      <section className="hero">
        <div className="wrap hero-grid">
          {/* Left column */}
          <div>
            <span className="eyebrow">{t('Islamabad · Rawalpindi', 'اسلام آباد · راولپنڈی')}</span>
            <h1 style={{ marginTop: 14 }}>
              {ur() ? (
                <>ہر کام کا <em>ہنرمند</em>، اب آپ کے قریب۔</>
              ) : (
                <>Har Kaam Ka <em>Hunarmand</em>, Ab Aapke Qareeb.</>
              )}
            </h1>
            <p className="lede">
              {t(
                'Find a nearby electrician, plumber or AC technician who is free right now. See reviews from real bookings, agree the price by chat or voice note, then book.',
                'قریب ترین الیکٹریشن، پلمبر یا اے سی مکینک ڈھونڈیں جو ابھی فارغ ہو۔ اصل بکنگ کے ریویو دیکھیں، قیمت پہلے طے کریں، پھر بک کریں۔'
              )}
            </p>
            <div className="ctas">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('role')}>
                <Icon name="search" />
                {t('Find a Worker', 'کاریگر ڈھونڈیں')}
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => onNavigate('role')}>
                <Icon name="briefcase" />
                {t('Join as a Worker', 'کاریگر کے طور پر شامل ہوں')}
              </button>
            </div>
            <div className="trustline">
              <span><Icon name="checkCircle" />{t('Reviews only from completed bookings', 'ریویو صرف مکمل بکنگ سے')}</span>
              <span><Icon name="tag" />{t('Price agreed before work starts', 'کام سے پہلے قیمت طے')}</span>
              <span><Icon name="mic" />{t('Works in Urdu & by voice', 'اردو اور آواز میں')}</span>
            </div>
          </div>

          {/* Right column — hero art */}
          <div className="hero-art" aria-label="Product preview">
            {/* Voice note card */}
            <div className="float hero-voice">
              <div className="row" style={{ gap: 10 }}>
                <span className="mic-sm" style={{ width: 36, height: 36 }}>
                  <Icon name="mic" />
                </span>
                <div className="wave live">
                  {waveBars.map((h, i) => (
                    <i key={i} style={{ height: `${h}px`, animationDelay: `${i * 0.08}s` }} />
                  ))}
                </div>
              </div>
              <p style={{ marginTop: 8, color: 'var(--ink)' }}>
                “Kitchen ka nalka tapak raha hai, aaj shaam tak koi aa jaye”
              </p>
              <div className="row" style={{ gap: 6, marginTop: 8 }}>
                <span className="pill pill-ai">
                  <Icon name="sparkles" />
                  {t('Suggested: Plumber', 'تجویز: پلمبر')}
                </span>
              </div>
            </div>

            {/* Worker card preview */}
            <div className="hero-card">
              <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
                <Avatar id="rehman" size={64} />
                <div className="grow">
                  <b style={{ fontSize: 17, color: 'var(--ink)' }}>
                    {ur() ? rehman.nameUr : rehman.name}
                  </b>
                  <div className="muted small">
                    {t('Electrician', 'الیکٹریشن')} · {rehman.exp} {t('yrs', 'سال')}
                  </div>
                  <div className="row" style={{ gap: 8, marginTop: 4 }}>
                    <Stars n={rehman.rating} count={rehman.count} />
                    <span className="muted small">
                      <Icon name="pin" /> <span className="num">{rehman.km}</span> km
                    </span>
                  </div>
                </div>
              </div>
              <div className="row between" style={{ marginTop: 14 }}>
                <StatusPill w={rehman} />
                <span className="price">
                  <small>{t('Visit from', 'وزٹ')}</small>
                  <b className="num">{rs(rehman.price)}</b>
                </span>
              </div>
              <div className="skills" style={{ marginTop: 12 }}>
                {rehman.skills.map((s) => (
                  <span key={s} className="skill">{s}</span>
                ))}
              </div>
              <div className="row" style={{ gap: 8, marginTop: 14 }}>
                <span className="btn btn-outline btn-sm grow">{t('Profile', 'پروفائل')}</span>
                <span className="btn btn-primary btn-sm grow">{t('Request', 'درخواست')}</span>
              </div>
            </div>

            {/* Booking confirmation badge */}
            <div className="float hero-book">
              <span style={{
                width: 38, height: 38, borderRadius: '99px',
                background: 'var(--success-50)', color: 'var(--success)',
                display: 'grid', placeItems: 'center'
              }}>
                <Icon name="check" />
              </span>
              <div>
                <b style={{ display: 'block', color: 'var(--ink)' }}>
                  {t('Booking confirmed', 'بکنگ کنفرم')}
                </b>
                <span className="muted xs num">
                  Rs 1,300 · {t('Today 5–7 PM', 'آج شام 5 تا 7')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── 3. SERVICES ─────────────── */}
      <section className="lsec" id="services" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="wrap">
          <span className="eyebrow">{t('Popular services', 'مقبول خدمات')}</span>
          <h2 style={{ marginTop: 8 }}>{t('What do you need fixed today?', 'آج کیا ٹھیک کروانا ہے؟')}</h2>
          <div className="svc-grid">
            {CATS.map((c) => {
              const n = workers.filter((w) => w.cat === c.id && w.status === 'available').length;
              return (
              <button key={c.id} className="svc" onClick={() => onNavigate('role')}>
                  <span className="tile"><Icon name={c.icon} /></span>
                  <span>
                    <b>{c.en}</b>
                    <span className="ur" style={{ display: 'block' }}>{c.ur}</span>
                  </span>
                  <small>
                    {n ? `${n} ${t('available nearby', 'قریب دستیاب')}` : t('See workers', 'کاریگر دیکھیں')}
                  </small>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── 4. HOW IT WORKS ─────────────── */}
      <section className="lsec" id="how">
        <div className="wrap">
          <span className="eyebrow">{t('How Roshan Rozgar works', 'روشن روزگار کیسے کام کرتا ہے')}</span>
          <h2 style={{ marginTop: 8 }}>{t('Two sides, one booking', 'دو فریق، ایک بکنگ')}</h2>
          <div className="how">
            {/* For households */}
            <div className="how-col c">
              <h3><Icon name="home" />{t('For households', 'گھر والوں کے لیے')}</h3>
              <ol className="steps">
                <li>
                  <div>
                    <b>{t('Say or type the problem', 'مسئلہ بولیں یا لکھیں')}</b>
                    <span>{t('In Urdu, Roman Urdu or English. Add a photo if it helps.', 'اردو، رومن اردو یا انگریزی میں۔ چاہیں تو تصویر لگائیں۔')}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>{t('Pick someone free and nearby', 'قریب اور فارغ کاریگر چنیں')}</b>
                    <span>{t('Only workers who are available now are shown first, with distance and past reviews.', 'پہلے وہ کاریگر دکھائے جاتے ہیں جو ابھی فارغ ہیں۔')}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>{t('Agree the price in chat', 'بات چیت میں قیمت طے کریں')}</b>
                    <span>{t('Voice notes and quick replies. The agreed amount is saved on the booking.', 'وائس نوٹ اور فوری جواب۔ طے شدہ رقم بکنگ میں محفوظ۔')}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>{t('Confirm, then rate the job', 'کنفرم کریں، پھر ریٹنگ دیں')}</b>
                    <span>{t('Your review helps the next family decide.', 'آپ کا ریویو اگلے گھرانے کی مدد کرتا ہے۔')}</span>
                  </div>
                </li>
              </ol>
            </div>
            {/* For workers */}
            <div className="how-col w">
              <h3><Icon name="briefcase" />{t('For skilled workers', 'ہنرمندوں کے لیے')}</h3>
              <ol className="steps">
                <li>
                  <div>
                    <b>{t('Make a profile by speaking', 'بول کر پروفائل بنائیں')}</b>
                    <span>{t('No forms, no CV. Tap pictures and answer out loud.', 'نہ فارم، نہ سی وی۔ تصویریں دبائیں اور بول کر جواب دیں۔')}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>{t('Switch to "Available"', '"دستیاب" کریں')}</b>
                    <span>{t('Customers nearby see you right away.', 'قریبی گاہک آپ کو فوراً دیکھیں گے۔')}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>{t('Finish the job, build your name', 'کام ختم کریں، نام بنائیں')}</b>
                    <span>{t('Reviews from each job stay on your profile.', 'ہر کام کا ریویو آپ کی پروفائل پر رہتا ہے۔')}</span>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── 5. WHY CHOOSE US ─────────────── */}
      <section className="lsec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <span className="eyebrow">{t('Why choose us', 'ہمیں کیوں چنیں')}</span>
          <h2 style={{ marginTop: 8 }}>{t('Built around the questions people actually ask', 'وہ سوال جو لوگ واقعی پوچھتے ہیں')}</h2>
          <div className="why">
            <div className="card">
              <div className="tile"><Icon name="checkCircle" /></div>
              <h3>{t('Reviews only from completed bookings', 'ریویو صرف مکمل بکنگ سے')}</h3>
              <p>{t('Ratings come only from bookings completed on the platform, split into quality, professionalism and timeliness.', 'ریٹنگ صرف پلیٹ فارم پر مکمل ہونے والی بکنگ سے آتی ہے۔')}</p>
            </div>
            <div className="card">
              <div className="tile"><Icon name="tag" /></div>
              <h3>{t('Price agreed before work starts', 'کام سے پہلے قیمت طے')}</h3>
              <p>{t('Workers show a starting visit charge. The final price is offered and accepted in chat before anyone sets out.', 'کاریگر ابتدائی وزٹ چارج دکھاتے ہیں۔ اصل قیمت نکلنے سے پہلے چیٹ میں طے ہوتی ہے۔')}</p>
            </div>
            <div className="card">
              <div className="tile"><Icon name="mic" /></div>
              <h3>{t('Works in Urdu & by voice', 'اردو اور آواز میں')}</h3>
              <p>{t('Send a voice note in Urdu or Roman Urdu. Every step can be listened to, no reading required.', 'اردو یا رومن اردو میں وائس نوٹ بھیجیں۔ ہر قدم سنا جا سکتا ہے۔')}</p>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <Disclaimer>
              {t(
                'What we check: phone number by OTP and job history on the platform. What we don\u2019t: government ID (CNIC) or police records. Profiles say clearly which is which.',
                'ہم فون نمبر (OTP) اور پلیٹ فارم پر کام کی تاریخ چیک کرتے ہیں۔ شناختی کارڈ یا پولیس ریکارڈ کی تصدیق نہیں کرتے۔'
              )}
            </Disclaimer>
          </div>
        </div>
      </section>

      {/* ─────────────── 6. FEATURED WORKERS ─────────────── */}
      <section className="lsec" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="row between wrapit">
            <div>
              <span className="eyebrow">{t('Featured workers', 'نمایاں کاریگر')}</span>
              <h2 style={{ marginTop: 8 }}>{t('Near G-11, Islamabad', 'جی الیون، اسلام آباد کے قریب')}</h2>
            </div>
              <button className="btn btn-outline" onClick={() => onNavigate('role')}>
                {t('See all nearby', 'سب دیکھیں')}
                <Icon name="arrowR" className="flip" />
              </button>
          </div>
          <div className="results-grid" style={{ marginTop: 24 }}>
            {feat.map((w) => (
              <WorkerCard
                key={w.id}
                w={w}
                landing
                onProfile={() => onNavigate('role')}
                onRequest={() => onNavigate('role')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── 7. TESTIMONIALS ─────────────── */}
      <section className="lsec">
        <div className="wrap">
          <span className="eyebrow">{t('What customers say', 'گاہکوں کی رائے')}</span>
          <h2 style={{ marginTop: 8 }}>{t('Small jobs, big relief', 'چھوٹے کام، بڑا سکون')}</h2>
          <div className="testi">
            {[
              ['ayesha', 'Ayesha K.', 'G-11/2, Islamabad', t('The plumber could see the photo of the leak before coming, so he brought the right connector. Done in 30 minutes.', 'پلمبر نے آنے سے پہلے لیک کی تصویر دیکھ لی، سہی کنیکٹر ساتھ لایا۔ 30 منٹ میں کام مکمل۔')],
              ['hamza', 'Hamza S.', 'Satellite Town, Rawalpindi', t('I sent a voice note in Punjabi-Urdu at 9 PM and had an electrician confirmed for the morning.', 'رات 9 بجے پنجابی-اردو میں وائس نوٹ بھیجا اور صبح کو الیکٹریشن کنفرم ہو گیا۔')],
              ['bilal', 'Naeem U.', 'G-9/4, Islamabad', t('Before this I only got work from the adda. Now customers call me from three sectors.', 'اس سے پہلے مجھے صرف اڈے سے کام ملتا تھا۔ اب گاہک تین سیکٹرز سے بلاتے ہیں۔')],
            ].map(([avatarId, name, place, quote]) => (
              <figure key={name} className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span className="pill pill-sample" style={{ alignSelf: 'flex-start' }}>
                  {t('Sample testimonial', 'نمونہ رائے')}
                </span>
                <blockquote className="quote" style={{ margin: 0 }}>“{quote}”</blockquote>
                <figcaption className="row" style={{ marginTop: 'auto' }}>
                  <Avatar id={avatarId} size={44} radius={14} />
                  <span>
                    <b style={{ display: 'block' }}>{name}</b>
                    <span className="muted small">{place}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── 8. JOIN BAND ─────────────── */}
      <section className="lsec" id="join" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="joinband">
            <div>
              <span className="eyebrow" style={{ color: 'var(--forest-900)' }}>
                {t('For electricians, plumbers, mechanics & more', 'ہنرمندوں کے لیے')}
              </span>
              <h2 style={{ marginTop: 10 }}>{t('Your skill. Your name. More work.', 'آپ کا ہنر، آپ کا نام، زیادہ کام۔')}</h2>
              <p className="ur" style={{ fontSize: 24, color: 'var(--forest-900)', marginTop: 6 }}>اپنے ہنر کو روزگار بنائیں</p>
              <p style={{ marginTop: 8, color: 'var(--forest-900)', maxWidth: '36em' }}>
                {t('Register by speaking in Urdu. Takes about 3 minutes. No form, no CV, no fee.', 'اردو میں بول کر رجسٹر کریں۔ تقریباً 3 منٹ۔ نہ فارم، نہ سی وی، نہ فیس۔')}
              </p>
            </div>
            <div className="stack" style={{ gap: 12 }}>
              <button className="btn btn-primary btn-lg btn-block" onClick={() => onNavigate('role')}>
                <Icon name="mic" />
                {t('Join as a Worker', 'کاریگر بنیں')}
              </button>
              <div className="row small" style={{ color: 'var(--forest-900)', justifyContent: 'center' }}>
                <Icon name="speaker" />
                {t('Every step can be listened to', 'ہر قدم سنا جا سکتا ہے')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── 9. FOOTER ─────────────── */}
      <footer className="foot" id="about">
        <div className="wrap">
          <div className="fgrid">
            {/* Brand + description */}
            <div style={{ gridColumn: '1/-1', maxWidth: 420 }} className="stack">
              <Brand onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
              <p style={{ fontSize: 15 }}>
                {t(
                  'Hunar ko rozgar, rozgar ko roshan mustaqbil. Connecting skills to opportunities across Islamabad and Rawalpindi.',
                  'ہنر کو روزگار، روزگار کو روشن مستقبل۔'
                )}
              </p>
              <p className="xs" style={{ opacity: 0.75 }}>
                {t(
                  'Built for the CUI Tech Fest AI Web Forge hackathon. All people, reviews and prices in this prototype are sample data.',
                  'یہ پروٹوٹائپ ہے۔ تمام نام، ریویو اور قیمتیں نمونہ ہیں۔'
                )}
              </p>
            </div>
            {/* Customer links */}
            <div>
              <h4>{t('Customers', 'گاہک')}</h4>
              <a onClick={() => scrollTo('services')} style={{ cursor: 'pointer' }}>{t('Services', 'خدمات')}</a>
              <a onClick={() => scrollTo('how')} style={{ cursor: 'pointer' }}>{t('How it works', 'طریقہ کار')}</a>
              <a onClick={() => onNavigate('role')} style={{ cursor: 'pointer' }}>{t('Find a worker', 'کاریگر ڈھونڈیں')}</a>
            </div>
            {/* Worker links */}
            <div>
              <h4>{t('Workers', 'کاریگر')}</h4>
              <a onClick={() => onNavigate('role')} style={{ cursor: 'pointer' }}>{t('Join as a worker', 'شامل ہوں')}</a>
              <a onClick={() => onNavigate('wdash-returning')} style={{ cursor: 'pointer' }}>{t('Worker dashboard', 'ڈیش بورڈ')}</a>
            </div>
            {/* Contact */}
            <div>
              <h4>{t('Contact', 'رابطہ')}</h4>
              <span style={{ display: 'block', paddingBlock: 4 }}>help@roshanrozgar.pk</span>
              <span style={{ display: 'block', paddingBlock: 4 }} className="num">0800-76742 ({t('sample', 'نمونہ')})</span>
              <span style={{ display: 'block', paddingBlock: 4 }}>{t('COMSATS, Park Road, Islamabad', 'کامسیٹس، پارک روڈ، اسلام آباد')}</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
