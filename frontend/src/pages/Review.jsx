import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp, afn } from '../context/AppContext';
import { stIdx, CUSTOMER } from '../lib/data';

export default function Review({ onNavigate }) {
  const { t, job, W, wname, rv, rvStar, rvSub, rvTag, rvText, rvVoice, rvPhoto, rvSubmit } = useApp();

  if (!job || stIdx(job.status) < stIdx('closed')) {
    return (
      <main className="appmain">
        <div className="wrap narrow stack" style={{ gap: 18 }}>
          <h1 style={{ fontSize: 28 }}>{t('My bookings', 'میری بکنگ')}</h1>
          <div className="card empty">
            <span className="tile"><Icon name="calendar" /></span>
            <h3>{t('No active booking', 'کوئی فعال بکنگ نہیں')}</h3>
            <button className="btn btn-primary" onClick={() => onNavigate('discover')}><Icon name="search" />{t('Find a worker', 'کاریگر ڈھونڈیں')}</button>
          </div>
        </div>
      </main>
    );
  }

  const w = W(job.workerId);

  // Already reviewed → thank you
  if (job.status === 'reviewed') {
    return (
      <main className="appmain">
        <div className="wrap narrow">
          <div className="card success-burst" style={{ padding: 28 }}>
            <div className="burst" style={{ background: 'var(--amber)', color: 'var(--forest-900)', boxShadow: '0 0 0 12px var(--amber-50)' }}>
              <Icon name="star" />
            </div>
            <h1 style={{ fontSize: 28 }}>{t(`Thank you, ${CUSTOMER.name.split(' ')[0]}`, `شکریہ، ${CUSTOMER.nameFa}`)}</h1>
            <p className="muted">{t('Your review is now on', 'آپ کا ریویو اب')} {wname(w)}{t('\u2019s profile. It will help the next family decide.', 'کی پروفائل پر ہے۔')}</p>
            <div className="row wrapit" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => onNavigate('profile')}><Icon name="eye" />{t('See it on his profile', 'پروفائل پر دیکھیں')}</button>
              <button className="btn btn-outline" onClick={() => onNavigate('discover')}>{t('Done', 'ختم')}</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const subRatings = [
    ['q', t('Work quality', 'کام کا معیار'), 'wrench'],
    ['p', t('Professionalism', 'رویہ'), 'users'],
    ['t', t('Timeliness', 'وقت کی پابندی'), 'clock'],
  ];
  const tags = [t('Fixed it first time', 'پہلی بار میں ٹھیک'), t('Clean work', 'صاف کام'), t('Fair price', 'مناسب قیمت'), t('On time', 'وقت پر'), t('Polite', 'بااخلاق'), t('Explained the problem', 'مسئلہ سمجھایا')];
  const labels = ['', t('Poor', 'خراب'), t('Not great', 'ٹھیک نہیں'), t('OK', 'ٹھیک'), t('Good', 'اچھا'), t('Excellent', 'بہترین')];

  return (
    <main className="appmain">
      <div className="wrap narrow stack" style={{ gap: 18 }}>
        {/* Worker header */}
        <div className="card stack" style={{ gap: 16, textAlign: 'center', alignItems: 'center' }}>
          <Avatar id={w.id} size={80} radius={24} />
          <div>
            <h1 style={{ fontSize: 26 }}>{t('How was', 'کیسا رہا')} {wname(w).split(' ')[0]}{t('\u2019s work?', 'کا کام؟')}</h1>
            <p className="muted small">{job.title} · <span className="num">{afn(job.price || 0)}</span></p>
          </div>
          {/* Overall stars */}
          <div className="bigstars" role="radiogroup" aria-label="Overall rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={rv.stars >= n ? 'on' : ''} role="radio" aria-checked={rv.stars === n} aria-label={`${n} star`} onClick={() => rvStar(n)}>
                <Icon name="star" />
              </button>
            ))}
          </div>
          <b style={{ minHeight: 24 }}>{labels[rv.stars]}</b>
        </div>

        {/* Sub-ratings */}
        <section className="card">
          <h3 style={{ marginBottom: 6 }}>{t('A little more detail', 'تھوڑی مزید تفصیل')} <span className="muted small" style={{ fontWeight: 500 }}>({t('helps the next customer', 'اگلے گاہک کے لیے')})</span></h3>
          {subRatings.map(([k, label, i]) => (
            <div key={k} className="subrate">
              <span className="row" style={{ gap: 8 }}><Icon name={i} /><b className="small">{label}</b></span>
              <div className="pick">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} className={rv[k] === n ? 'on' : ''} onClick={() => rvSub(k, n)} aria-label={`${label} ${n}`}>{n}</button>
                ))}
              </div>
            </div>
          ))}
          {/* Tags */}
          <div className="skills" style={{ marginTop: 14 }}>
            {tags.map((tag) => (
              <button key={tag} className="chip" aria-pressed={rv.tags.includes(tag)} onClick={() => rvTag(tag)}>{tag}</button>
            ))}
          </div>
        </section>

        {/* Comment + voice + photo */}
        <section className="card stack" style={{ gap: 12 }}>
          <h3>{t('Add a comment', 'تبصرہ')} <span className="muted small" style={{ fontWeight: 500 }}>({t('optional', 'اختیاری')})</span></h3>
          <textarea className="textarea" placeholder={t('What went well? Anything the next customer should know?', 'کیا اچھا تھا؟')} value={rv.text} onChange={(e) => rvText(e.target.value)} />
          <div className="row wrapit">
            <button className="btn btn-outline" onClick={rvVoice}>
              <Icon name="mic" />{rv.voice ? t('Voice review added ✓', 'آواز ریویو شامل ✓') : t('Say it instead', 'بول کر بتائیں')}
            </button>
            <button className="btn btn-outline" onClick={rvPhoto}>
              <Icon name="camera" />{rv.photo ? t('Photo added ✓', 'تصویر شامل ✓') : t('Add photo of finished work', 'مکمل کام کی تصویر')}
            </button>
          </div>
        </section>

        <button className="btn btn-primary btn-lg btn-block" disabled={!rv.stars} onClick={() => { rvSubmit(); onNavigate('review'); }}>
          <Icon name="send" className="flip" />{t('Submit review', 'ریویو بھیجیں')}
        </button>
        <p className="xs muted" style={{ textAlign: 'center' }}>
          {t('Your first name, sector and rating are shown publicly. Your phone number and address are not.', 'آپ کا پہلا نام، سیکٹر اور ریٹنگ نظر آئیں گے، فون اور پتا نہیں۔')}
        </p>
      </div>
    </main>
  );
}
