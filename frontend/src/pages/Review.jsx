import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp, afn } from '../context/AppContext';
import { stIdx } from '../lib/data';

export default function Review({ onNavigate }) {
  const { t, job, W, wname, rv, rvStar, rvSub, rvTag, rvText, rvVoice, rvPhoto, rvSubmit, user, liveMode, apiSubmitReview } = useApp();

  const handleSubmit = async () => {
    if (liveMode && apiSubmitReview) {
      await apiSubmitReview(rv.stars, rv.text, { q: rv.q, p: rv.p, t: rv.t }, rv.tags);
    } else {
      rvSubmit();
    }
    onNavigate('review');
  };

  if (!job || stIdx(job.status) < stIdx('closed')) {
    return (
      <main className="appmain">
        <div className="wrap narrow stack" style={{ gap: 18 }}>
          <h1 style={{ fontSize: 28 }}>{t('My bookings', 'رزروهای من')}</h1>
          <div className="card empty">
            <span className="tile"><Icon name="calendar" /></span>
            <h3>{t('No active booking', 'هیچ رزرو فعالی وجود ندارد')}</h3>
            <button className="btn btn-primary" onClick={() => onNavigate('discover')}><Icon name="search" />{t('Find a worker', 'پیدا کردن کاریگر')}</button>
          </div>
        </div>
      </main>
    );
  }

  const w = W(job.workerId);

  if (job.status === 'reviewed') {
    return (
      <main className="appmain">
        <div className="wrap narrow">
          <div className="card success-burst" style={{ padding: 28 }}>
            <div className="burst" style={{ background: 'var(--amber)', color: 'var(--forest-900)', boxShadow: '0 0 0 12px var(--amber-50)' }}>
              <Icon name="star" />
            </div>
            <h1 style={{ fontSize: 28 }}>
              {t('Thank you,', 'ممنون،')} {(user?.name || t('Customer', 'مشتری')).split(' ')[0]}
            </h1>
            <p className="muted">{t('Your review is now on', 'نظر شما اکنون در پروفایل')} {wname(w)}{t('\u2019s profile. It will help the next family decide.', ' است. به خانواده بعدی کمک می‌کند تصمیم بگیرند.')}</p>
            <div className="row wrapit" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => onNavigate('profile')}><Icon name="eye" />{t('See it on his profile', 'مشاهده در پروفایل')}</button>
              <button className="btn btn-outline" onClick={() => onNavigate('discover')}>{t('Done', 'تمام')}</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const subRatings = [
    ['q', t('Work quality', 'کیفیت کار'), 'wrench'],
    ['p', t('Professionalism', 'حرفه‌ای بودن'), 'users'],
    ['t', t('Timeliness', 'وقت‌شناسی'), 'clock'],
  ];
  const tags = [
    t('Fixed it first time', 'بار اول درست کرد'),
    t('Clean work', 'کار تمیز'),
    t('Fair price', 'قیمت مناسب'),
    t('On time', 'سر وقت'),
    t('Polite', 'مؤدب'),
    t('Explained the problem', 'مشکل را توضیح داد'),
  ];
  const labels = ['', t('Poor', 'ضعیف'), t('Not great', 'خوب نبود'), t('OK', 'قابل قبول'), t('Good', 'خوب'), t('Excellent', 'عالی')];

  return (
    <main className="appmain">
      <div className="wrap narrow stack" style={{ gap: 18 }}>
        <div className="card stack" style={{ gap: 16, textAlign: 'center', alignItems: 'center' }}>
          <Avatar id={w.id} size={80} radius={24} />
          <div>
            <h1 style={{ fontSize: 26 }}>{t('How was', 'کار')} {wname(w).split(' ')[0]}{t('\u2019s work?', ' چطور بود؟')}</h1>
            <p className="muted small">{job.title} · <span className="num">{afn(job.price || 0)}</span></p>
          </div>
          <div className="bigstars" role="radiogroup" aria-label="Overall rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={rv.stars >= n ? 'on' : ''} role="radio" aria-checked={rv.stars === n} aria-label={`${n} star`} onClick={() => rvStar(n)}>
                <Icon name="star" />
              </button>
            ))}
          </div>
          <b style={{ minHeight: 24 }}>{labels[rv.stars]}</b>
        </div>

        <section className="card">
          <h3 style={{ marginBottom: 6 }}>{t('A little more detail', 'کمی بیشتر توضیح دهید')} <span className="muted small" style={{ fontWeight: 500 }}>({t('helps the next customer', 'به مشتری بعدی کمک می‌کند')})</span></h3>
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
          <div className="skills" style={{ marginTop: 14 }}>
            {tags.map((tag) => (
              <button key={tag} className="chip" aria-pressed={rv.tags.includes(tag)} onClick={() => rvTag(tag)}>{tag}</button>
            ))}
          </div>
        </section>

        <section className="card stack" style={{ gap: 12 }}>
          <h3>{t('Add a comment', 'اضافه کردن نظر')} <span className="muted small" style={{ fontWeight: 500 }}>({t('optional', 'اختیاری')})</span></h3>
          <textarea className="textarea" placeholder={t('What went well? Anything the next customer should know?', 'چه چیزی خوب بود؟ چیزی که مشتری بعدی باید بداند؟')} value={rv.text} onChange={(e) => rvText(e.target.value)} />
          <div className="row wrapit">
            <button className="btn btn-outline" onClick={rvVoice}>
              <Icon name="mic" />{rv.voice ? t('Voice review added ✓', 'نظر صوتی اضافه شد ✓') : t('Say it instead', 'به جای آن بگویید')}
            </button>
            <button className="btn btn-outline" onClick={rvPhoto}>
              <Icon name="camera" />{rv.photo ? t('Photo added ✓', 'عکس اضافه شد ✓') : t('Add photo of finished work', 'عکس کار تمام شده')}
            </button>
          </div>
        </section>

        <button className="btn btn-primary btn-lg btn-block" disabled={!rv.stars} onClick={handleSubmit}>
          <Icon name="send" className="flip" />{t('Submit review', 'ارسال نظر')}
        </button>
        <p className="xs muted" style={{ textAlign: 'center' }}>
          {t('Your first name, sector and rating are shown publicly. Your phone number and address are not.', 'نام، ناحیه و امتیاز شما به صورت عمومی نمایش داده می‌شود. شماره تلفن و آدرس شما نه.')}
        </p>
      </div>
    </main>
  );
}
