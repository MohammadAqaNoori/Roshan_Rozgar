import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp, rs } from '../context/AppContext';
import { Stars, StatusPill, SpeakBtn } from '../components/Shared';
import { catBy } from '../lib/data';

export default function Profile({ own, onNavigate }) {
  const { t, ur, W, wname, catName, sel, selectWorker } = useApp();
  const w = W(own ? 'imran' : sel) || W('imran');
  const c = catBy(w.cat);

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
                <p><Icon name={c.icon} /> {catName(w.cat)} · {w.exp} {t('years experience', 'سال تجربہ')}</p>
                <p className="small"><Icon name="pin" /> {w.area}, {w.city} · <span className="num">{w.km} km</span> {t('from you', 'دور')}</p>
                <div style={{ marginTop: 10 }}><StatusPill w={w} /></div>
              </div>
            </section>

            {/* Facts */}
            <div className="facts">
              <div className="fact"><b className="num">{w.rating.toFixed(1)}</b><span><Icon name="star" /> {w.count} {t('reviews', 'ریویو')}</span></div>
              <div className="fact"><b className="num">{w.jobs}</b><span>{t('jobs done here', 'یہاں مکمل کام')}</span></div>
              <div className="fact"><b className="num">{w.exp}</b><span>{t('years in trade', 'سال تجربہ')}</span></div>
            </div>

            {/* What we know */}
            <section className="card">
              <h3>{t('What we know about', 'ہم کیا جانتے ہیں')} {wname(w).split(' ')[0]}</h3>
              <ul className="know" style={{ marginTop: 8 }}>
                <li><span className="ok"><Icon name="checkCircle" /></span><span>{t('Phone number confirmed by OTP', 'فون نمبر OTP سے تصدیق شدہ')} <span className="pill pill-sample">{t('simulated', 'نقلی')}</span></span></li>
                <li><span className="ok"><Icon name="checkCircle" /></span><span>{t('Active on Roshan Rozgar since', 'روشن روزگار پر فعال')} {w.since}</span></li>
                <li><span className="ok"><Icon name="checkCircle" /></span><span>{t('Languages:', 'زبانیں:')} {w.langs}</span></li>
                <li><span className="ok"><Icon name="checkCircle" /></span><span>{t('Visit charge from', 'وزٹ چارج سے')} <b className="num">{rs(w.price)}</b></span></li>
                <li><span className="no"><Icon name="info" /></span><span>{t('Identity (CNIC) not verified — out of scope for this prototype.', 'شناخت کی تصدیق نہیں — اس پروٹوٹائپ میں شامل نہیں۔')}</span></li>
              </ul>
            </section>

            {/* Skills */}
            <section className="card">
              <h3>{t('Skills', 'ہنر')}</h3>
              <div className="skills" style={{ marginTop: 10 }}>
                {w.skills.map((s) => <span key={s} className="skill">{s}</span>)}
              </div>
            </section>

            {/* Schedule */}
            <section className="card">
              <h3>{t('Working hours', 'اوقات')}</h3>
              <div className="row" style={{ marginTop: 10 }}>
                <Icon name="calendar" />
                <span>{w.days.join(', ')}</span>
              </div>
              <div className="row">
                <Icon name="clock" />
                <span>{w.hours}</span>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="prof-side">
            <div className="stack" style={{ gap: 16 }}>
              {/* CTA */}
              <div className="card stack" style={{ gap: 12 }}>
                {w.status === 'available' ? (
                  <button className="btn btn-primary btn-lg btn-block" onClick={() => onNavigate('request')}>
                    <Icon name="msg" />{t('Request service', 'سروس کی درخواست')}
                  </button>
                ) : w.status === 'busy' ? (
                  <div>
                    <button className="btn btn-lg btn-block is-disabled" disabled>{t('On a job', 'مصروف')}</button>
                    <p className="small muted" style={{ textAlign: 'center', marginTop: 8 }}>
                      {t('Free ~', 'فارغ ~')}{w.freeAt}
                    </p>
                    <button className="btn btn-outline btn-block btn-sm" style={{ marginTop: 6 }}>
                      <Icon name="bell" />{t('Notify when free', 'دستیاب ہونے پر اطلاع')}
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-lg btn-block is-disabled" disabled>{t('Not working today', 'آج چھٹی')}</button>
                )}
                <div className="row between">
                  <span className="price"><small>{t('Visit from', 'وزٹ سے')}</small><b className="num">{rs(w.price)}</b></span>
                  <span className="muted small">{t('Parts extra', 'پرزے علیحدہ')}</span>
                </div>
              </div>

              {/* Reviews */}
              <section className="card">
                <div className="sect-title">
                  <h2 style={{ fontSize: 18 }}>{t('Reviews', 'ریویو')} <span className="muted small">({w.count})</span></h2>
                </div>
                {w.reviews.length === 0 ? (
                  <p className="muted small">{t('No reviews yet.', 'ابھی کوئی ریویو نہیں۔')}</p>
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
                          {r.tags.map((tag) => <span key={tag} className="skill">{tag}</span>)}
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
