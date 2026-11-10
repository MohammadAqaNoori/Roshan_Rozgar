import { useState } from 'react';
import { Icon } from '../lib/icons';
import { useApp } from '../context/AppContext';
import { StatusPill } from '../components/Shared';
import { Stars } from '../components/Shared';
import { Avatar } from '../lib/avatar';
import { CATS, catBy, classify } from '../lib/data';

export default function Request({ onNavigate }) {
  const { t, req, reqListen, reqSet, reqAnalyse, reqAnswer, sel, W, wname, catName, reqSend } = useApp();
  const w = W(sel);

  // hasInput: any description given (typed text, voice transcript, or prior AI suggestion)
  const hasInput = !!(req.transcript || (req.text && req.text.trim()) || req.aiCat);

  // Auto-classify on-the-fly from typed text so user doesn't have to click "Suggest the trade"
  const autocat = (req.text && req.text.trim()) ? classify(req.text.trim()) : null;
  const aiCat = req.aiCat || autocat || null;
  const cat = req.cat || aiCat;

  return (
    <main className="appmain">
      <div className="wrap stack" style={{ gap: 18 }}>
        <div className="row" style={{ gap: 10 }}>
          <button className="icon-btn" onClick={() => onNavigate('discover')} aria-label="Back"><Icon name="arrowL" className="flip" /></button>
          <div>
            <h1 style={{ fontSize: 'clamp(22px,3vw,30px)' }}>{t('Describe the job', 'کام بتائیں')}</h1>
            <p className="small muted">{t('Voice, a few words or a photo is enough.', 'آواز، چند الفاظ یا تصویر کافی ہے۔')}</p>
          </div>
        </div>

        <div className="req-layout">
          {/* Left column */}
          <div className="stack" style={{ gap: 16 }}>
            {/* Step 1: What's the problem */}
            <section className="card stack" style={{ gap: 14 }}>
              <h3>1 · {t('What\u2019s the problem?', 'مسئلہ کیا ہے؟')}</h3>

              {/* Voice input */}
              {req.voiceState === 'listening' ? (
                <div className="voice-big" style={{ background: 'var(--error-50)' }}>
                  <button className="mic-sm listening"><Icon name="mic" /></button>
                  <div className="grow">
                    <b>{t('Listening… speak naturally', 'سن رہے ہیں… آرام سے بولیں')}</b>
                    <div className="wave live" style={{ marginTop: 6 }}>
                      {Array.from({ length: 24 }, (_, i) => <i key={i} style={{ height: `${6 + ((i * 5) % 16)}px`, animationDelay: `${i * 0.05}s`, background: 'var(--error)' }} />)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="voice-big">
                  <button className="mic-sm" style={{ width: 64, height: 64 }} onClick={reqListen} aria-label="Describe by voice"><Icon name="mic" /></button>
                  <div className="grow">
                    <b>{t('Tap and describe the problem', 'دبائیں اور مسئلہ بتائیں')}</b>
                    <div className="small muted">{t('Urdu, Roman Urdu or English. e.g. "AC thanda nahi kar raha"', 'اردو، رومن اردو یا انگریزی')}</div>
                  </div>
                </div>
              )}

              {/* Transcript */}
              {req.transcript && (
                <div className="transcript">
                  <div className="row between wrapit" style={{ gap: 6, marginBottom: 6 }}>
                    <span className="pill pill-ai"><Icon name="sparkles" />{t('Speech-to-text', 'آواز سے متن')}</span>
                    <span className="pill pill-sample">{t('Simulated voice', 'نقلی آواز')}</span>
                  </div>
                  &ldquo;{req.transcript}&rdquo;
                  <div className="xs muted" style={{ marginTop: 6 }}>{t('Kept as a voice note for the worker to listen to.', 'یہ وائس نوٹ کاریگر بھی سن سکتا ہے۔')}</div>
                </div>
              )}

              {/* Text input */}
              <div>
                <label className="lbl" htmlFor="reqtext">{t('Or type a few words', 'یا چند الفاظ لکھیں')}</label>
                <textarea
                  id="reqtext"
                  className="textarea"
                  placeholder={t('e.g. bathroom ka nalka band nahi ho raha', 'مثلاً: باتھ روم کا نلکا بند نہیں ہو رہا')}
                  value={req.text}
                  onChange={(e) => reqSet({ text: e.target.value })}
                />
                <div className="row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => { const text = req.text || req.transcript; const c = classify(text); reqSet({ aiCat: c, cat: c || req.cat }); }}>
                    <Icon name="sparkles" />{t('Suggest the trade', 'پیشہ تجویز کریں')}
                  </button>
                </div>
              </div>

              {/* Photo upload */}
              <div>
                <span className="lbl">{t('Photo (optional)', 'تصویر (اختیاری)')}</span>
                {req.photo ? (
                  <div className="upl">
                    <div className="thumb">📷</div>
                    <div className="grow small">
                      <b>{t('Photo attached', 'تصویر شامل')}</b>
                      <p className="xs muted">{t('The worker will see it in chat.', 'کاریگر چیٹ میں دیکھے گا۔')}</p>
                    </div>
                    <button className="icon-btn" onClick={() => reqSet({ photo: '' })} aria-label="Remove photo"><Icon name="x" /></button>
                  </div>
                ) : (
                  <div className="upl">
                    <button className="btn btn-outline" onClick={() => reqSet({ photo: 'sample' })}><Icon name="camera" />{t('Add a photo', 'تصویر لگائیں')}</button>
                    <button className="btn btn-ghost" onClick={() => reqSet({ photo: 'sample', imgState: 'done' })}><Icon name="image" />{t('Use sample photo', 'نمونہ تصویر')}</button>
                  </div>
                )}
              </div>
            </section>

            {/* Step 2: Service, place, time */}
            <section className="card stack" style={{ gap: 14 }}>
              <h3>2 · {t('Service, place and time', 'سروس، جگہ اور وقت')}</h3>

              {/* Service chips */}
              <div>
                <span className="lbl">{t('Service', 'سروس')} {aiCat && <span className="pill pill-ai" style={{ marginInlineStart: 6 }}><Icon name="sparkles" />{t('suggested', 'تجویز')}</span>}</span>
                <div className="row wrapit" style={{ gap: 6 }}>
                  {CATS.map((x) => (
                    <button
                      key={x.id}
                      className="chip"
                      aria-pressed={cat === x.id}
                      onClick={() => reqSet({ cat: x.id })}
                    >
                      <Icon name={x.icon} />{t(x.en, x.ur)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="lbl" htmlFor="reqaddr">{t('Address', 'پتا')}</label>
                <div className="row"><span style={{ color: 'var(--emerald)' }}><Icon name="pin" /></span><input id="reqaddr" className="inp" value={req.address} onChange={(e) => reqSet({ address: e.target.value })} /></div>
                <p className="xs muted" style={{ marginTop: 6 }}><Icon name="lock" /> {t('Only your area (Shahr-e-Naw) is shown until you confirm a booking.', 'تا زمانی که رزرو را تأیید نکنید، فقط منطقه شما (شهر نو) نشان داده می‌شود.')}</p>
              </div>

              {/* Time selection */}
              <div>
                <span className="lbl">{t('When?', 'کب؟')}</span>
                <div className="timegrid">
                  {[['As soon as possible', 'جتنی جلدی ہو', 'zap'], ['Today, 5–7 PM', 'آج شام 5 تا 7', 'clock'], ['Tomorrow, 10 AM–1 PM', 'کل صبح', 'sun'], ['Pick a time', 'وقت چنیں', 'calendar']].map(([en, fa, i]) => (
                    <button
                      key={en}
                      className="choice wide"
                      style={{ minHeight: 64, padding: 10 }}
                      aria-pressed={req.time === en}
                      onClick={() => reqSet({ time: en })}
                    >
                      <Icon name={i} />
                      <span className="small"><b style={{ display: 'block', fontSize: 14 }}>{t(en, ur)}</b></span>
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
                  <span className="ai-head"><Icon name="sparkles" />{t('What we understood', 'ہم نے کیا سمجھا')}</span>
                  <span className="pill pill-ai">{t('AI suggestion · please check', 'اے آئی تجویز · چیک کریں')}</span>
                </div>
                <div>
                  <div className="ai-field">
                    <span>{t('Service', 'سروس')}</span>
                    <b><Icon name={catBy(cat).icon} /> {t(catBy(cat).en, catBy(cat).ur)}</b>
                  </div>
                  {cat === 'plumber' ? (
                    <>
                      <div className="ai-field"><span>{t('Problem', 'مسئلہ')}</span><b>{t('Leak under kitchen sink', 'کچن سنک کے نیچے لیکیج')}</b></div>
                      <div className="ai-field"><span>{t('When', 'کب')}</span><b>{t('Today, by evening', 'آج شام تک')}</b></div>
                      <div className="ai-field"><span>{t('Also mentioned', 'مزید')}</span><b>{t('Pipe looks old', 'پائپ پرانا لگتا ہے')}</b></div>
                    </>
                  ) : (
                    <div className="ai-field"><span>{t('Problem', 'مسئلہ')}</span><b>{(req.text || req.transcript).slice(0, 60)}</b></div>
                  )}
                </div>
                <p className="xs muted">{t('Prototype: trade is matched with on-device keywords. Production design sends text to a language model.', 'پروٹوٹائپ: الفاظ سے میچ۔')}</p>
              </div>
            ) : hasInput && !cat ? (
              <div className="fallback"><Icon name="alert" /> <b>{t('We couldn\u2019t tell which trade this is.', 'ہم پیشہ نہیں سمجھ سکے۔')}</b><p className="small" style={{ marginTop: 6 }}>{t('Pick a service below, or add a photo.', 'نیچے سروس چنیں یا تصویر لگائیں۔')}</p></div>
            ) : (
              <div className="card-flat stack" style={{ gap: 10 }}>
                <span className="ai-head"><Icon name="sparkles" />{t('How this helps', 'یہ کیسے مدد کرتا ہے')}</span>
                <p className="small muted">{t('Speak or type the problem the way you\u2019d tell a neighbour. We suggest the trade, pull out the key details and ask one or two questions the worker would ask anyway. You can change anything before sending.', 'جیسے پڑوسی کو بتاتے ہیں ویسے بتائیں۔ ہم پیشہ تجویز کریں گے اور اہم باتیں نکالیں گے۔')}</p>
              </div>
            )}

            {/* Send to worker */}
            {w && (
              <div className="card stack" style={{ gap: 12 }}>
                <b>{t('Sending to', 'بھیج رہے ہیں')}</b>
                <div className="row">
                  <Avatar id={w.id} size={48} radius={14} />
                  <div className="grow">
                    <b>{wname(w)}</b>
                    <div className="small muted">{catName(w.cat)} · {w.km} km · <Stars n={w.rating} /></div>
                  </div>
                  <StatusPill w={w} />
                </div>
                {w.status !== 'available' && (
                  <div className="fallback"><Icon name="alert" /> <b>{wname(w)} {t('is not available right now.', 'ابھی دستیاب نہیں۔')}</b></div>
                )}
                <button
                  className="btn btn-primary btn-lg btn-block"
                  disabled={!hasInput || w.status !== 'available'}
                  onClick={() => { reqSend(); onNavigate('chat'); }}
                >
                  <Icon name="send" className="flip" />{t('Send request to', 'درخواست بھیجیں')} {wname(w).split(' ').slice(-1)[0]}
                </button>
                {!hasInput && <p className="xs muted" style={{ textAlign: 'center' }}>{t('Describe the problem to continue.', 'آگے بڑھنے کے لیے مسئلہ بتائیں۔')}</p>}
                {cat && w.cat !== cat && (
                  <div className="disclaimer" style={{ background: 'var(--amber-50)' }}>
                    <Icon name="info" /><span>{wname(w)} {t('is a', 'ایک')} {catName(w.cat)}. <button className="btn btn-ghost btn-sm">{t('See', 'دیکھیں')} {catName(cat)}</button></span>
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
