import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp, afn } from '../context/AppContext';
import { Stars, StatusPill, SpeakBtn } from '../components/Shared';
import { catBy, CUSTOMER, skillFa, DAY_FA, HOURS_FA } from '../lib/data';

export default function Profile({ own, onNavigate }) {
  const { t, fa, W, wname, catName, sel, selectWorker, role, ob, user, workers, logout, liveMode, loadWorkerProfile } = useApp();
  
  // For own profile:
  //   - worker: show their own worker profile (matched by user.id or ob.name)
  //   - customer: show logged-in customer info
  // For other profiles: show the selected worker (sel)
  const getWorkerForOwnProfile = () => {
    if (role === 'worker') {
      // Try to find by user id first (live mode), then by name (demo)
      if (user?.id) {
        const byUserId = workers.find((w) => w.user_id === user.id || w._userId === user.id);
        if (byUserId) return byUserId;
      }
      if (ob?.name) {
        const byName = workers.find((w) => w.name === ob.name || w.nameFa === ob.name);
        if (byName) return byName;
      }
    }
    return null;
  };

  const w = own ? (getWorkerForOwnProfile() || W('ahmad')) : (W(sel) || W('ahmad'));
  const c = catBy(w.cat);
  const isFa = fa();

  const avg = (k) => {
    const r = w.reviews;
    return r.length ? (r.reduce((s, x) => s + x[k], 0) / r.length).toFixed(1) : '–';
  };

  return (
    <main className="appmain">
      <div className="wrap">
        <div className="prof-layout">
          <div className="stack" style={{ gap: 20 }}>
            {/* Hero */}
            <section className="prof-hero">
              <Avatar id={w.id} size={96} radius={28} />
              <div className="grow">
                <h1>{wname(w)}</h1>
                <p><Icon name={c.icon} /> {catName(w.cat)} · {w.exp} {t('years experience', 'سال تجربه')}</p>
                <p className="small"><Icon name="pin" /> {w.area}, {w.city} · <span className="num">{w.km} km</span> {t('from you', 'از شما')}</p>
                <div style={{ marginTop: 10 }}><StatusPill w={w} /></div>
              </div>
            </section>

            {/* Facts */}
            <div className="facts">
              <div className="fact"><b className="num">{w.rating.toFixed(1)}</b><span><Icon name="star" /> {w.count} {t('reviews', 'نظرها')}</span></div>
              <div className="fact"><b className="num">{w.jobs}</b><span>{t('jobs done here', 'کار انجام شده')}</span></div>
              <div className="fact"><b className="num">{w.exp}</b><span>{t('years in trade', 'سال تجربه')}</span></div>
            </div>

            {/* What we know */}
            <section className="card">
              <h3>{t('What we know about', 'آنچه درباره')} {wname(w).split(' ')[0]} {t('', 'می‌دانیم')}</h3>
              <ul className="know" style={{ marginTop: 8 }}>
                <li><span className="ok"><Icon name="checkCircle" /></span><span>{t('Phone number confirmed by OTP', 'شماره تلفن با OTP تأیید شده')} <span className="pill pill-sample">{t('simulated', 'نمونه')}</span></span></li>
                <li><span className="ok"><Icon name="checkCircle" /></span><span>{t('Active on Karigar since', 'فعال در کاریگر از')} {w.since}</span></li>
                <li><span className="ok"><Icon name="checkCircle" /></span><span>{t('Languages:', 'زبان‌ها:')} {isFa ? w.langs.replace('Dari', 'دری').replace('Pashto', 'پښتو').replace('Uzbeki', 'ازبکی') : w.langs}</span></li>
                <li><span className="ok"><Icon name="checkCircle" /></span><span>{t('Visit charge from', 'هزینه ویزیت از')} <b className="num">{afn(w.price)}</b></span></li>
                <li><span className="no"><Icon name="info" /></span><span>{t('Identity (Tazkira) not verified — out of scope for this prototype.', 'هویت (تذکره) تأیید نشده — در این نمونه اولیه گنجانده نشده.')}</span></li>
              </ul>
            </section>

            {/* Skills */}
            <section className="card">
              <h3>{t('Skills', 'مهارت‌ها')}</h3>
              <div className="skills" style={{ marginTop: 10 }}>
                {w.skills.map((s) => <span key={s} className="skill">{isFa ? skillFa(s) : s}</span>)}
              </div>
            </section>

            {/* Schedule */}
            <section className="card">
              <h3>{t('Working hours', 'ساعات کاری')}</h3>
              <div className="row" style={{ marginTop: 10 }}>
                <Icon name="calendar" />
                <span>{isFa ? w.days.map((d) => DAY_FA[d] || d).join('، ') : w.days.join(', ')}</span>
              </div>
              <div className="row">
                <Icon name="clock" />
                <span>{isFa ? (HOURS_FA[w.hours] || w.hours) : w.hours}</span>
              </div>
            </section>

            {/* Account card — only on own profile */}
            {own && (
              <section className="card">
                <h3>{t('Account', 'حساب کاربری')}</h3>
                <p className="small muted" style={{ marginTop: 6 }}>
                  {t('Signed in as', 'وارد شده به عنوان')}{' '}
                  <strong>
                    {user?.name || (role === 'worker' ? (ob?.name || t('Worker', 'کاریگر')) : t('Customer', 'مشتری'))}
                  </strong>
                </p>
                {user?.phone && (
                  <p className="small muted num" style={{ marginTop: 2 }}>{user.phone}</p>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  style={{ marginTop: 14, alignSelf: 'flex-start' }}
                  onClick={() => logout(onNavigate)}
                >
                  <Icon name="logout" />
                  {t('Log out', 'خروج از حساب')}
                </button>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="prof-side">
            <div className="stack" style={{ gap: 16 }}>
              {/* CTA */}
              <div className="card stack" style={{ gap: 12 }}>
                {w.status === 'available' ? (
                  <button className="btn btn-primary btn-lg btn-block" onClick={() => onNavigate('request')}>
                    <Icon name="msg" />{t('Request service', 'درخواست خدمت')}
                  </button>
                ) : w.status === 'busy' ? (
                  <div>
                    <button className="btn btn-lg btn-block is-disabled" disabled>{t('On a job', 'مشغول کار')}</button>
                    <p className="small muted" style={{ textAlign: 'center', marginTop: 8 }}>
                      {t('Free ~', 'آزاد ~')}{w.freeAt}
                    </p>
                    <button className="btn btn-outline btn-block btn-sm" style={{ marginTop: 6 }}>
                      <Icon name="bell" />{t('Notify when free', 'وقتی آزاد شد خبر بده')}
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-lg btn-block is-disabled" disabled>{t('Not working today', 'امروز کار نمی‌کند')}</button>
                )}
                <div className="row between">
                  <span className="price"><small>{t('Visit from', 'ویزیت از')}</small><b className="num">{afn(w.price)}</b></span>
                  <span className="muted small">{t('Parts extra', 'قطعات جداگانه')}</span>
                </div>
              </div>

              {/* Reviews */}
              <section className="card">
                <div className="sect-title">
                  <h2 style={{ fontSize: 18 }}>{t('Reviews', 'نظرها')} <span className="muted small">({w.count})</span></h2>
                </div>
                {w.reviews.length === 0 ? (
                  <p className="muted small">{t('No reviews yet.', 'هنوز نظری ثبت نشده.')}</p>
                ) : (
                  w.reviews.map((r, i) => (
                    <div key={i} className="review">
                      <div className="row between">
                        <b>{r.by}</b>
                        <Stars n={r.stars} />
                      </div>
                      {r.text && <p className="small" style={{ marginTop: 4 }}>{r.text}</p>}
                      {r.tags && r.tags.length > 0 && (
                        <div className="skills" style={{ marginTop: 4 }}>
                          {r.tags.map((tag) => <span key={tag} className="skill">{isFa ? skillFa(tag) : tag}</span>)}
                        </div>
                      )}
                      <span className="xs muted">{r.area} · {r.date}</span>
                    </div>
                  ))
                )}
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA on mobile */}
      {w.status === 'available' && (
        <div className="sticky-cta">
          <div className="row" style={{ gap: 10 }}>
            <Avatar id={w.id} size={44} radius={14} />
            <div className="grow">
              <b style={{ display: 'block' }}>{wname(w)}</b>
              <span className="small muted">{catName(w.cat)} · <Stars n={w.rating} /></span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('request')}>
            <Icon name="msg" />{t('Request', 'درخواست')}
          </button>
        </div>
      )}
    </main>
  );
}
