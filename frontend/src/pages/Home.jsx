/**
 * Landing page for "Karigar" — hyper-local marketplace for skilled trade workers.
 */
import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp, afn } from '../context/AppContext';
import { Brand, Stars, StatusPill, WorkerCard, SpeakBtn, Disclaimer } from '../components/Shared';
import { CATS, seedWorkers } from '../lib/data';

export default function Home({ onNavigate }) {
  const { t, fa, setLang } = useApp();
  const workers = seedWorkers();
  const feat = ['ahmad', 'karim', 'habib'].map((id) => workers.find((w) => w.id === id));
  const karim = workers.find((w) => w.id === 'karim');

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
            <a onClick={() => scrollTo('how')} style={{ cursor: 'pointer' }}>{t('How it works', 'روش کار')}</a>
            <a onClick={() => scrollTo('join')} style={{ cursor: 'pointer' }}>{t('Become a worker', 'کاریگر شوید')}</a>
            <a onClick={() => scrollTo('about')} style={{ cursor: 'pointer' }}>{t('About', 'درباره')}</a>
          </nav>
          <div className="row" style={{ gap: 8, marginInlineStart: 'auto' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setLang(fa() ? 'en' : 'fa')}>
              <Icon name="globe" />
              <span className={fa() ? '' : 'ur'} style={{ lineHeight: 1.2 }}>
                {fa() ? 'English' : 'دری'}
              </span>
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigate('login')}>
              {t('Log in', 'ورود')}
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────── 2. HERO ─────────────── */}
      <section className="hero">
        <div className="wrap hero-grid">
          {/* Left column */}
          <div>
            <span className="eyebrow">{t('Kabul · Herat', 'کابل · هرات')}</span>
            <h1 style={{ marginTop: 14 }}>
              {fa() ? (
                <>هر کار، یک <em>کاریگر ماهر</em>، نزدیک شما.</>
              ) : (
                <>Every job, a skilled <em>Karigar</em>, near you.</>
              )}
            </h1>
            <p className="lede">
              {t(
                'Find a nearby electrician, plumber or AC technician who is free right now. See reviews from real bookings, agree the price by chat or voice note, then book.',
                'یک برق‌کار، لوله‌کش یا تکنسین کولر نزدیک خود پیدا کنید که اکنون آزاد است. نظرات واقعی رزرو را ببینید، قیمت را با چت یا پیام صوتی توافق کنید، سپس رزرو کنید.'
              )}
            </p>
            <div className="ctas">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('role')}>
                <Icon name="search" />
                {t('Find a Worker', 'کاریگر پیدا کنید')}
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => onNavigate('role')}>
                <Icon name="briefcase" />
                {t('Join as a Worker', 'کاریگر شوید')}
              </button>
            </div>
            <div className="trustline">
              <span><Icon name="checkCircle" />{t('Reviews only from completed bookings', 'نظرات فقط از رزروهای تکمیل شده')}</span>
              <span><Icon name="tag" />{t('Price agreed before work starts', 'قیمت قبل از شروع کار توافق می‌شود')}</span>
              <span><Icon name="mic" />{t('Works in Dari & by voice', 'به دری و با صدا کار می‌کند')}</span>
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
                "آب آشپزخانه چکه می‌کند، امروز تا غروب کسی بیاید"
              </p>
              <div className="row" style={{ gap: 6, marginTop: 8 }}>
                <span className="pill pill-ai">
                  <Icon name="sparkles" />
                  {t('Suggested: Plumber', 'پیشنهاد: لوله‌کش')}
                </span>
              </div>
            </div>

            {/* Worker card preview */}
            <div className="hero-card">
              <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
                <Avatar id="karim" size={64} />
                <div className="grow">
                  <b style={{ fontSize: 17, color: 'var(--ink)' }}>
                    {fa() ? karim.nameFa : karim.name}
                  </b>
                  <div className="muted small">
                    {t('Electrician', 'برق‌کار')} · {karim.exp} {t('yrs', 'سال')}
                  </div>
                  <div className="row" style={{ gap: 8, marginTop: 4 }}>
                    <Stars n={karim.rating} count={karim.count} />
                    <span className="muted small">
                      <Icon name="pin" /> <span className="num">{karim.km}</span> km
                    </span>
                  </div>
                </div>
              </div>
              <div className="row between" style={{ marginTop: 14 }}>
                <StatusPill w={karim} />
                <span className="price">
                  <small>{t('Visit from', 'ویزیت از')}</small>
                  <b className="num">{afn(karim.price)}</b>
                </span>
              </div>
              <div className="skills" style={{ marginTop: 12 }}>
                {karim.skills.map((s) => (
                  <span key={s} className="skill">{s}</span>
                ))}
              </div>
              <div className="row" style={{ gap: 8, marginTop: 14 }}>
                <span className="btn btn-outline btn-sm grow">{t('Profile', 'پروفایل')}</span>
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
                  {t('Booking confirmed', 'رزرو تأیید شد')}
                </b>
                <span className="muted xs num">
                  ؋ 1,300 · {t('Today 5–7 PM', 'امروز ۵ تا ۷ عصر')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── 3. SERVICES ─────────────── */}
      <section className="lsec" id="services" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="wrap">
          <span className="eyebrow">{t('Popular services', 'خدمات محبوب')}</span>
          <h2 style={{ marginTop: 8 }}>{t('What do you need fixed today?', 'امروز چه چیزی را تعمیر می‌خواهید؟')}</h2>
          <div className="svc-grid">
            {CATS.map((c) => {
              const n = workers.filter((w) => w.cat === c.id && w.status === 'available').length;
              return (
              <button key={c.id} className="svc" onClick={() => onNavigate('role')}>
                  <span className="tile"><Icon name={c.icon} /></span>
                  <span>
                    <b>{c.en}</b>
                    <span className="ur" style={{ display: 'block' }}>{c.fa}</span>
                  </span>
                  <small>
                    {n ? `${n} ${t('available nearby', 'نزدیک موجود')}` : t('See workers', 'کاریگران را ببینید')}
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
          <span className="eyebrow">{t('How Karigar works', 'کاریگر چگونه کار می‌کند')}</span>
          <h2 style={{ marginTop: 8 }}>{t('Two sides, one booking', 'دو طرف، یک رزرو')}</h2>
          <div className="how">
            {/* For households */}
            <div className="how-col c">
              <h3><Icon name="home" />{t('For households', 'برای خانواده‌ها')}</h3>
              <ol className="steps">
                <li>
                  <div>
                    <b>{t('Say or type the problem', 'مشکل را بگویید یا بنویسید')}</b>
                    <span>{t('In Dari, Roman Dari or English. Add a photo if it helps.', 'به دری، دری رومی یا انگلیسی. اگر کمک می‌کند عکس اضافه کنید.')}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>{t('Pick someone free and nearby', 'کاریگر آزاد و نزدیک انتخاب کنید')}</b>
                    <span>{t('Only workers who are available now are shown first, with distance and past reviews.', 'ابتدا کاریگرانی که اکنون آزاد هستند نمایش داده می‌شوند، با فاصله و نظرات گذشته.')}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>{t('Agree the price in chat', 'قیمت را در چت توافق کنید')}</b>
                    <span>{t('Voice notes and quick replies. The agreed amount is saved on the booking.', 'پیام‌های صوتی و پاسخ‌های سریع. مبلغ توافق شده در رزرو ذخیره می‌شود.')}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>{t('Confirm, then rate the job', 'تایید کنید، سپس امتیاز دهید')}</b>
                    <span>{t('Your review helps the next family decide.', 'نظر شما به خانواده بعدی کمک می‌کند تصمیم بگیرد.')}</span>
                  </div>
                </li>
              </ol>
            </div>
            {/* For workers */}
            <div className="how-col w">
              <h3><Icon name="briefcase" />{t('For skilled workers', 'برای کارگران ماهر')}</h3>
              <ol className="steps">
                <li>
                  <div>
                    <b>{t('Make a profile by speaking', 'با صحبت کردن پروفایل بسازید')}</b>
                    <span>{t('No forms, no CV. Tap pictures and answer out loud.', 'بدون فرم، بدون رزومه. عکس بگیرید و با صدای بلند پاسخ دهید.')}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>{t('Switch to "Available"', 'آماده را انتخاب کنید')}</b>
                    <span>{t('Customers nearby see you right away.', 'مشتریان نزدیک بلافاصله شما را می‌بینند.')}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>{t('Finish the job, build your name', 'کار را تمام کنید، نام خود را بسازید')}</b>
                    <span>{t('Reviews from each job stay on your profile.', 'نظرات هر کار در پروفایل شما باقی می‌ماند.')}</span>
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
          <span className="eyebrow">{t('Why choose us', 'چرا ما را انتخاب کنید')}</span>
          <h2 style={{ marginTop: 8 }}>{t('Built around the questions people actually ask', 'بر اساس سوالاتی که مردم واقعا می‌پرسند')}</h2>
          <div className="why">
            <div className="card">
              <div className="tile"><Icon name="checkCircle" /></div>
              <h3>{t('Reviews only from completed bookings', 'نظرات فقط از رزروهای تکمیل شده')}</h3>
              <p>{t('Ratings come only from bookings completed on the platform, split into quality, professionalism and timeliness.', 'امتیازها فقط از رزروهای تکمیل شده در پلتفرم می‌آیند، به کیفیت، حرفه‌ای بودن و به‌هنگامی تقسیم می‌شوند.')}</p>
            </div>
            <div className="card">
              <div className="tile"><Icon name="tag" /></div>
              <h3>{t('Price agreed before work starts', 'قیمت قبل از شروع کار توافق می‌شود')}</h3>
              <p>{t('Workers show a starting visit charge. The final price is offered and accepted in chat before anyone sets out.', 'کاریگران هزینه ویزیت اولیه را نشان می‌دهند. قیمت نهایی قبل از حرکت در چت پیشنهاد و پذیرفته می‌شود.')}</p>
            </div>
            <div className="card">
              <div className="tile"><Icon name="mic" /></div>
              <h3>{t('Works in Dari & by voice', 'به دری و با صدا کار می‌کند')}</h3>
              <p>{t('Send a voice note in Dari or Roman Dari. Every step can be listened to, no reading required.', 'پیام صوتی به دری یا دری رومی بفرستید. هر مرحله را می‌توان شنید، نیازی به خواندن نیست.')}</p>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <Disclaimer>
              {t(
                'What we check: phone number by OTP and job history on the platform. What we don\u2019t: government ID (Tazkira) or police records. Profiles say clearly which is which.',
                'آنچه بررسی می‌کنیم: شماره تلفن با OTP و سابقه کار در پلتفرم. آنچه بررسی نمی‌کنیم: کارت شناسایی (تذکره) یا سوابق پلیس. پروفایل‌ها واضح بیان می‌کنند کدام است.'
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
              <span className="eyebrow">{t('Featured workers', 'کاریگران ویژه')}</span>
              <h2 style={{ marginTop: 8 }}>{t('Near Shahr-e-Naw, Kabul', 'نزدیک شهر نو، کابل')}</h2>
            </div>
              <button className="btn btn-outline" onClick={() => onNavigate('role')}>
                {t('See all nearby', 'همه را ببینید')}
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
          <span className="eyebrow">{t('What customers say', 'نظر مشتریان')}</span>
          <h2 style={{ marginTop: 8 }}>{t('Small jobs, big relief', 'کارهای کوچک، آرامش بزرگ')}</h2>
          <div className="testi">
            {[
              ['mariam', 'Mariam K.', 'Shahr-e-Naw, Kabul', t('The plumber could see the photo of the leak before coming, so he brought the right connector. Done in 30 minutes.', 'لوله‌کش قبل از آمدن عکس نشتی را دید و اتصال مناسب را آورد. در ۳۰ دقیقه انجام شد.')],
              ['farida', 'Farida S.', 'Herat City, Herat', t('I sent a voice note in Dari at 9 PM and had an electrician confirmed for the morning.', 'ساعت ۹ شب پیام صوتی به دری فرستادم و صبح برق‌کار تأیید شد.')],
              ['ahmad', 'Ahmad N.', 'Mazar-i-Sharif', t('Before this I only got work from the bazaar. Now customers call me from three districts.', 'قبل از این فقط از بازار کار می‌گرفتم. اکنون مشتریان از سه منطقه با من تماس می‌گیرند.')],
            ].map(([avatarId, name, place, quote]) => (
              <figure key={name} className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span className="pill pill-sample" style={{ alignSelf: 'flex-start' }}>
                  {t('Sample testimonial', 'نمونه نظر')}
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
                {t('For electricians, plumbers, mechanics & more', 'برای برق‌کاران، لوله‌کشان، مکانیک‌ها و بیشتر')}
              </span>
              <h2 style={{ marginTop: 10 }}>{t('Your skill. Your name. More work.', 'مهارت شما. نام شما. کار بیشتر.')}</h2>
              <p className="ur" style={{ fontSize: 24, color: 'var(--forest-900)', marginTop: 6 }}>مهارت خود را به کار تبدیل کنید</p>
              <p style={{ marginTop: 8, color: 'var(--forest-900)', maxWidth: '36em' }}>
                {t('Register by speaking in Dari. Takes about 3 minutes. No form, no CV, no fee.', 'با صحبت به دری ثبت‌نام کنید. حدود ۳ دقیقه. بدون فرم، بدون رزومه، بدون هزینه.')}
              </p>
            </div>
            <div className="stack" style={{ gap: 12 }}>
              <button className="btn btn-primary btn-lg btn-block" onClick={() => onNavigate('role')}>
                <Icon name="mic" />
                {t('Join as a Worker', 'کاریگر شوید')}
              </button>
              <div className="row small" style={{ color: 'var(--forest-900)', justifyContent: 'center' }}>
                <Icon name="speaker" />
                {t('Every step can be listened to', 'هر مرحله را می‌توان شنید')}
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
                  'Connecting skills to opportunities across Kabul and Herat.',
                  'مهارت‌ها را به فرصت‌ها در سراسر کابل و هرات وصل می‌کنیم.'
                )}
              </p>
              <p className="xs" style={{ opacity: 0.75 }}>
                {t(
                  'Built for the CUI Tech Fest AI Web Forge hackathon. All people, reviews and prices in this prototype are sample data.',
                  'این یک نمونه اولیه است. تمام نام‌ها، نظرات و قیمت‌ها نمونه‌ای هستند.'
                )}
              </p>
            </div>
            {/* Customer links */}
            <div>
              <h4>{t('Customers', 'مشتریان')}</h4>
              <a onClick={() => scrollTo('services')} style={{ cursor: 'pointer' }}>{t('Services', 'خدمات')}</a>
              <a onClick={() => scrollTo('how')} style={{ cursor: 'pointer' }}>{t('How it works', 'روش کار')}</a>
              <a onClick={() => onNavigate('role')} style={{ cursor: 'pointer' }}>{t('Find a worker', 'کاریگر پیدا کنید')}</a>
            </div>
            {/* Worker links */}
            <div>
              <h4>{t('Workers', 'کاریگران')}</h4>
              <a onClick={() => onNavigate('role')} style={{ cursor: 'pointer' }}>{t('Join as a worker', 'کاریگر شوید')}</a>
              <a onClick={() => onNavigate('wdash-returning')} style={{ cursor: 'pointer' }}>{t('Worker dashboard', 'داشبورد کاریگر')}</a>
            </div>
            {/* Contact */}
            <div>
              <h4>{t('Contact', 'تماس')}</h4>
              <span style={{ display: 'block', paddingBlock: 4 }}>help@karigar.af</span>
              <span style={{ display: 'block', paddingBlock: 4 }} className="num">+93 700 123 456 ({t('sample', 'نمونه')})</span>
              <span style={{ display: 'block', paddingBlock: 4 }}>{t('Kabul, Afghanistan', 'کابل، افغانستان')}</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
