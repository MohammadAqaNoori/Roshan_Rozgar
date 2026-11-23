import { useState } from 'react';
import { Icon } from '../lib/icons';
import { useApp } from '../context/AppContext';
import { StatusPill } from '../components/Shared';
import { Stars } from '../components/Shared';
import { Avatar } from '../lib/avatar';
import { CATS, catBy, classify } from '../lib/data';

export default function Request({ onNavigate }) {
  const { t, req, reqListen, reqSet, reqAnalyse, reqAnswer, sel, W, wname, catName, reqSend, liveMode, apiCreateJob } = useApp();
  const w = W(sel);

  const hasInput = !!(req.transcript || (req.text && req.text.trim()) || req.aiCat);

  const autocat = (req.text && req.text.trim()) ? classify(req.text.trim()) : null;
  const aiCat = req.aiCat || autocat || null;
  const cat = req.cat || aiCat;

  return (
    <main className="appmain">
      <div className="wrap stack" style={{ gap: 18 }}>
        <div className="row" style={{ gap: 10 }}>
          <button className="icon-btn" onClick={() => onNavigate('discover')} aria-label="Back"><Icon name="arrowL" className="flip" /></button>
          <div>
            <h1 style={{ fontSize: 'clamp(22px,3vw,30px)' }}>{t('Describe the job', 'کار را توضیح دهید')}</h1>
            <p className="small muted">{t('Voice, a few words or a photo is enough.', 'صدا، چند کلمه یا عکس کافی است.')}</p>
          </div>
        </div>

        <div className="req-layout">
          {/* Left column */}
          <div className="stack" style={{ gap: 16 }}>
            {/* Step 1 */}
            <section className="card stack" style={{ gap: 14 }}>
              <h3>1 · {t('What\u2019s the problem?', 'مشکل چیست؟')}</h3>

              {req.voiceState === 'listening' ? (
                <div className="voice-big" style={{ background: 'var(--error-50)' }}>
                  <button className="mic-sm listening"><Icon name="mic" /></button>
                  <div className="grow">
                    <b>{t('Listening… speak naturally', 'گوش می‌دهیم… طبیعی صحبت کنید')}</b>
                    <div className="wave live" style={{ marginTop: 6 }}>
                      {Array.from({ length: 24 }, (_, i) => <i key={i} style={{ height: `${6 + ((i * 5) % 16)}px`, animationDelay: `${i * 0.05}s`, background: 'var(--error)' }} />)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="voice-big">
                  <button className="mic-sm" style={{ width: 64, height: 64 }} onClick={reqListen} aria-label="Describe by voice"><Icon name="mic" /></button>
                  <div className="grow">
                    <b>{t('Tap and describe the problem', 'بزنید و مشکل را توضیح دهید')}</b>
                    <div className="small muted">{t('Dari or English. e.g. "AC sard nemi konad"', 'به دری یا انگلیسی. مثلاً: "کولر سرد نمی‌کند"')}</div>
                  </div>
                </div>
              )}

              {req.transcript && (
                <div className="transcript">
                  <div className="row between wrapit" style={{ gap: 6, marginBottom: 6 }}>
                    <span className="pill pill-ai"><Icon name="sparkles" />{t('Speech-to-text', 'صدا به متن')}</span>
                    <span className="pill pill-sample">{t('Simulated voice', 'صدای نمونه')}</span>
                  </div>
                  &ldquo;{req.transcript}&rdquo;
                  <div className="xs muted" style={{ marginTop: 6 }}>{t('Kept as a voice note for the worker to listen to.', 'به عنوان پیام صوتی برای کاریگر نگه داشته می‌شود.')}</div>
                </div>
              )}

              <div>
                <label className="lbl" htmlFor="reqtext">{t('Or type a few words', 'یا چند کلمه بنویسید')}</label>
                <textarea
                  id="reqtext"
                  className="textarea"
                  placeholder={t('e.g. bathroom tap won\'t stop dripping', 'مثلاً: شیر حمام قطره قطره می‌چکد')}
                  value={req.text}
                  onChange={(e) => reqSet({ text: e.target.value })}
                />
                <div className="row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => { const text = req.text || req.transcript; const c = classify(text); reqSet({ aiCat: c, cat: c || req.cat }); }}>
                    <Icon name="sparkles" />{t('Suggest the trade', 'پیشنهاد حرفه')}
                  </button>
                </div>
              </div>

              <div>
                <span className="lbl">{t('Photo (optional)', 'عکس (اختیاری)')}</span>
                {req.photo ? (
                  <div className="upl">
                    <div className="thumb">📷</div>
                    <div className="grow small">
                      <b>{t('Photo attached', 'عکس پیوست شد')}</b>
                      <p className="xs muted">{t('The worker will see it in chat.', 'کاریگر آن را در چت می‌بیند.')}</p>
                    </div>
                    <button className="icon-btn" onClick={() => reqSet({ photo: '' })} aria-label="Remove photo"><Icon name="x" /></button>
                  </div>
                ) : (
                  <div className="upl">
                    <button className="btn btn-outline" onClick={() => reqSet({ photo: 'sample' })}><Icon name="camera" />{t('Add a photo', 'اضافه کردن عکس')}</button>
                    <button className="btn btn-ghost" onClick={() => reqSet({ photo: 'sample', imgState: 'done' })}><Icon name="image" />{t('Use sample photo', 'استفاده از عکس نمونه')}</button>
                  </div>
                )}
              </div>
            </section>

            {/* Step 2 */}
            <section className="card stack" style={{ gap: 14 }}>
              <h3>2 · {t('Service, place and time', 'خدمت، مکان و زمان')}</h3>

              <div>
                <span className="lbl">{t('Service', 'خدمت')} {aiCat && <span className="pill pill-ai" style={{ marginInlineStart: 6 }}><Icon name="sparkles" />{t('suggested', 'پیشنهادی')}</span>}</span>
                <div className="row wrapit" style={{ gap: 6 }}>
                  {CATS.map((x) => (
                    <button
                      key={x.id}
                      className="chip"
                      aria-pressed={cat === x.id}
                      onClick={() => reqSet({ cat: x.id })}
                    >
                      <Icon name={x.icon} />{t(x.en, x.fa)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="lbl" htmlFor="reqaddr">{t('Address', 'آدرس')}</label>
                <div className="row"><span style={{ color: 'var(--emerald)' }}><Icon name="pin" /></span><input id="reqaddr" className="inp" value={req.address} onChange={(e) => reqSet({ address: e.target.value })} /></div>
                <p className="xs muted" style={{ marginTop: 6 }}><Icon name="lock" /> {t('Only your area (Shahr-e-Naw) is shown until you confirm a booking.', 'تا زمانی که رزرو را تأیید نکنید، فقط منطقه شما (شهر نو) نشان داده می‌شود.')}</p>
              </div>

              <div>
                <span className="lbl">{t('When?', 'کِی؟')}</span>
                <div className="timegrid">
                  {[
                    ['As soon as possible', 'هر چه زودتر',          'zap'],
                    ['Today, 5–7 PM',       'امروز، ۵ تا ۷ بعد از ظهر', 'clock'],
                    ['Tomorrow, 10 AM–1 PM','فردا، ۱۰ صبح تا ۱',   'sun'],
                    ['Pick a time',         'زمان انتخاب کنید',     'calendar'],
                  ].map(([en, fa, icon]) => (
                    <button
                      key={en}
                      className="choice wide"
                      style={{ minHeight: 64, padding: 10 }}
                      aria-pressed={req.time === en}
                      onClick={() => reqSet({ time: en })}
                    >
                      <Icon name={icon} />
                      <span className="small"><b style={{ display: 'block', fontSize: 14 }}>{t(en, fa)}</b></span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right column: AI + send */}
          <div className="stack" style={{ gap: 16 }}>
            {hasInput && cat ? (
              <div className="ai-panel stack" style={{ gap: 12 }}>
                <div className="row between">
                  <span className="ai-head"><Icon name="sparkles" />{t('What we understood', 'آنچه فهمیدیم')}</span>
                  <span className="pill pill-ai">{t('AI suggestion · please check', 'پیشنهاد هوش مصنوعی · لطفاً بررسی کنید')}</span>
                </div>
                <div>
                  <div className="ai-field">
                    <span>{t('Service', 'خدمت')}</span>
                    <b><Icon name={catBy(cat).icon} /> {t(catBy(cat).en, catBy(cat).fa)}</b>
                  </div>
                  {cat === 'plumber' ? (
                    <>
                      <div className="ai-field"><span>{t('Problem', 'مشکل')}</span><b>{t('Leak under kitchen sink', 'نشت زیر سینک آشپزخانه')}</b></div>
                      <div className="ai-field"><span>{t('When', 'کِی')}</span><b>{t('Today, by evening', 'امروز تا شب')}</b></div>
                      <div className="ai-field"><span>{t('Also mentioned', 'همچنین ذکر شد')}</span><b>{t('Pipe looks old', 'لوله قدیمی به نظر می‌رسد')}</b></div>
                    </>
                  ) : (
                    <div className="ai-field"><span>{t('Problem', 'مشکل')}</span><b>{(req.text || req.transcript).slice(0, 60)}</b></div>
                  )}
                </div>
                <p className="xs muted">{t('Prototype: trade is matched with on-device keywords. Production design sends text to a language model.', 'نمونه اولیه: با کلمات کلیدی تطابق داده می‌شود. نسخه اصلی متن را به مدل زبانی ارسال می‌کند.')}</p>
              </div>
            ) : hasInput && !cat ? (
              <div className="fallback">
                <Icon name="alert" /> <b>{t('We couldn\u2019t tell which trade this is.', 'نتوانستیم حرفه را تشخیص دهیم.')}</b>
                <p className="small" style={{ marginTop: 6 }}>{t('Pick a service below, or add a photo.', 'خدمت را از زیر انتخاب کنید یا عکس اضافه کنید.')}</p>
              </div>
            ) : (
              <div className="card-flat stack" style={{ gap: 10 }}>
                <span className="ai-head"><Icon name="sparkles" />{t('How this helps', 'این چطور کمک می‌کند')}</span>
                <p className="small muted">{t('Speak or type the problem the way you\u2019d tell a neighbour. We suggest the trade, pull out the key details and ask one or two questions the worker would ask anyway. You can change anything before sending.', 'مشکل را مثل وقتی که به همسایه می‌گویید توضیح دهید. ما حرفه را پیشنهاد می‌دهیم و جزئیات مهم را استخراج می‌کنیم.')}</p>
              </div>
            )}

            {w && (
              <div className="card stack" style={{ gap: 12 }}>
                <b>{t('Sending to', 'ارسال به')}</b>
                <div className="row">
                  <Avatar id={w.id} size={48} radius={14} />
                  <div className="grow">
                    <b>{wname(w)}</b>
                    <div className="small muted">{catName(w.cat)} · {w.km} km · <Stars n={w.rating} /></div>
                  </div>
                  <StatusPill w={w} />
                </div>
                {w.status !== 'available' && (
                  <div className="fallback"><Icon name="alert" /> <b>{wname(w)} {t('is not available right now.', 'اکنون در دسترس نیست.')}</b></div>
                )}
                <button
                  className="btn btn-primary btn-lg btn-block"
                  disabled={!hasInput || w.status !== 'available'}
                  onClick={async () => {
                    if (liveMode && apiCreateJob) {
                      const jobData = {
                        title: req.transcript || req.text || 'Job request',
                        description: req.transcript || req.text || '',
                        trade_required: cat || w?.cat || 'plumber',
                        area_name: req.address || 'Kabul',
                        lat: 34.5260,
                        lng: 69.1781,
                        worker_id: w ? parseInt(w.id) : undefined,
                      };
                      await apiCreateJob(jobData);
                    } else {
                      reqSend();
                    }
                    onNavigate('chat');
                  }}
                >
                  <Icon name="send" className="flip" />{t('Send request to', 'ارسال درخواست به')} {wname(w).split(' ').slice(-1)[0]}
                </button>
                {!hasInput && <p className="xs muted" style={{ textAlign: 'center' }}>{t('Describe the problem to continue.', 'برای ادامه مشکل را توضیح دهید.')}</p>}
                {cat && w.cat !== cat && (
                  <div className="disclaimer" style={{ background: 'var(--amber-50)' }}>
                    <Icon name="info" /><span>{wname(w)} {t('is a', 'یک')} {catName(w.cat)} {t('is', 'است')}. <button className="btn btn-ghost btn-sm">{t('See', 'مشاهده')} {catName(cat)}</button></span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
