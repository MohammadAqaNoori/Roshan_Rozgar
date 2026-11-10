/**
 * Chat — voice-first communication between customer and worker.
 * Messages can be text, voice (auto-transcribed), or price offers.
 * A sidebar shows the job details and booking actions.
 */
import { useState, useRef, useEffect } from 'react';
import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp, rs } from '../context/AppContext';
import { StatusPill, Stars, Disclaimer } from '../components/Shared';
import { catBy, CUSTOMER, stIdx } from '../lib/data';

export default function Chat({ onNavigate }) {
  const {
    t, job, msgs, role, W, wname, catName,
    sendMsg, sendVoice, sendOffer, acceptOffer,
    openModal, closeModal, _modal, _playing, _rec, _typing,
    togglePlay, toggleRec, speak, simCustomerConfirm,
  } = useApp();

  const [draft, setDraft] = useState('');
  const [counter, setCounter] = useState(role === 'customer' ? 1300 : 1500);
  const [offerNote, setOfferNote] = useState('');
  const msgsRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [msgs, _typing]);

  // ---- Empty state: no job ----
  if (!job) {
    return (
      <main className="appmain">
        <div className="wrap">
          <div className="empty" style={{ marginTop: 40 }}>
            <div className="tile"><Icon name="msg" /></div>
            <h2>{t('No conversations yet', 'ابھی کوئی بات چیت نہیں')}</h2>
            <p className="muted small">
              {t('Find a worker and send a request to start chatting.', 'کاریگر ڈھونڈیں اور درخواست بھیجیں۔')}
            </p>
            <button className="btn btn-primary" onClick={() => onNavigate('discover')}>
              <Icon name="search" />{t('Find a worker', 'کاریگر ڈھونڈیں')}
            </button>
          </div>
        </div>
      </main>
    );
  }

  const isCustomer = role === 'customer';
  const w = W(job.workerId);
  const c = catBy(job.cat);

  // Other party info
  const other = isCustomer
    ? { name: wname(w), sub: catName(job.cat), avatarId: job.workerId, pill: <StatusPill w={w} /> }
    : { name: t(CUSTOMER.name, CUSTOMER.nameUr), sub: `${CUSTOMER.area} · ${w.km} km`, avatarId: 'ayesha', pill: null };

  // ---- Agreement banner ----
  let agreeBanner;
  if (job.status === 'declined') {
    agreeBanner = (
      <div className="agree none">
        <Icon name="x" />{t('Request declined', 'درخواست رد')}
      </div>
    );
  } else if (stIdx(job.status) >= stIdx('agreed')) {
    agreeBanner = (
      <div className="agree done">
        <Icon name="hand" />{t('Agreed:', 'طے:')} <b className="num">{rs(job.price)}</b> · {job.time}
        {job.status === 'agreed' && (
          <span>
            {' · '}
            {isCustomer
              ? t('confirm the booking', 'بکنگ کنفرم کریں')
              : t('waiting for Ayesha to confirm', 'عائشہ کی تصدیق کا انتظار')}
          </span>
        )}
      </div>
    );
  } else if (job.offers && job.offers.length > 0) {
    agreeBanner = (
      <div className="agree pending">
        <Icon name="tag" />{t('Price offer pending', 'قیمت کی پیشکش زیرِ غور')}
      </div>
    );
  } else {
    agreeBanner = (
      <div className="agree none">
        <Icon name="tag" />{t('Price not agreed yet', 'قیمت ابھی طے نہیں')}
      </div>
    );
  }

  const locked = job.status === 'declined';

  // ---- Quick replies ----
  const quickReplies = isCustomer
    ? [
        [t('Can you come today?', 'کیا آپ آج آ سکتے ہیں؟'), 'Kya aap aaj aa saktay hain?'],
        [t('What will it cost?', 'کتنے پیسے لگیں گے؟'), 'Kitne paise lagenge?'],
        [t('Please bring the parts', 'پرزے ساتھ لے آئیں'), 'Parts saath le aayein'],
        [t('I accept this offer', 'مجھے یہ قیمت منظور ہے'), 'Mujhe ye qeemat manzoor hai'],
      ]
    : [
        [t('I can come today', 'میں آج آ سکتا ہوں'), 'Main aaj aa sakta hoon'],
        [t('Please share your location', 'اپنی لوکیشن بھیجیں'), 'Apni location bhej dein'],
        [t('What is the problem?', 'مسئلہ کیا ہے؟'), 'Masla kya hai?'],
        [t('My estimated price is…', 'میرا اندازاً ریٹ…'), '__price'],
        [t('I accept this offer', 'مجھے یہ قیمت منظور ہے'), 'Mujhe ye qeemat manzoor hai'],
      ];

  const showPriceBtn = !isCustomer || stIdx(job.status) < stIdx('agreed');

  // ---- Send handlers ----
  const handleQuick = (label, value) => {
    if (value === '__price') {
      setCounter(1500);
      openModal('counter');
      return;
    }
    sendMsg(label);
  };

  const handleSendText = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    sendMsg(text);
    setDraft('');
  };

  const handleMic = () => {
    if (!_rec) {
      toggleRec();
    } else {
      toggleRec();
      sendVoice();
    }
  };

  const handleAcceptOffer = (msgId) => {
    acceptOffer(msgId);
  };

  const handleCounter = (msgId) => {
    setCounter(role === 'customer' ? 1300 : 1500);
    openModal('counter');
  };

  // ---- Render a single message ----
  const renderMessage = (m) => {
    if (m.from === 'sys') {
      return (
        <div className="msg sys" key={m.id}>
          <div className="bub" dangerouslySetInnerHTML={{ __html: m.html || m.text }} />
        </div>
      );
    }

    const me = m.from === role;
    const cls = me ? 'me' : 'them';
    let body;

    if (m.type === 'text') {
      body = (
        <div className="bub">
          {m.text}
          {m.tr && <div className="vt">{m.tr}</div>}
        </div>
      );
    } else if (m.type === 'voice') {
      const playing = _playing === m.id;
      body = (
        <div className="bub">
          <div className="vnote">
            <button
              className="play"
              onClick={() => togglePlay(m.id)}
              aria-label={playing ? 'Pause voice note' : 'Play voice note'}
            >
              <Icon name={playing ? 'pause' : 'play'} />
            </button>
            <div className={`wave${playing ? ' live' : ''}`} style={{ flex: 1 }}>
              {Array.from({ length: 22 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    height: `${5 + ((i * 7 + m.id.length * 3) % 15)}px`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
            <span className="small num">{m.dur || '0:06'}</span>
          </div>
          {m.text && <div className="vt">{m.text}</div>}
        </div>
      );
    } else if (m.type === 'offer') {
      const canAct = !me && m.state === 'open' && stIdx(job.status) < stIdx('agreed');
      const offerCls = m.state === 'accepted' ? 'accepted' : m.state === 'superseded' ? 'superseded' : '';
      body = (
        <div className={`offer ${offerCls}`}>
          <div className="row between">
            <span className="small" style={{ fontWeight: 700 }}>
              <Icon name="tag" />{' '}
              {m.from === 'worker'
                ? t('Price offer', 'قیمت کی پیشکش')
                : t('Counter-offer', 'جوابی پیشکش')}
            </span>
            {m.state === 'accepted' ? (
              <span className="pill pill-av"><Icon name="check" />{t('Accepted', 'منظور')}</span>
            ) : m.state === 'superseded' ? (
              <span className="pill pill-off">{t('Replaced', 'بدل گئی')}</span>
            ) : (
              <span className="pill pill-busy">{t('Waiting', 'انتظار')}</span>
            )}
          </div>
          <div className="amt num">{rs(m.amount)}</div>
          {m.note && <p className="small">{m.note}</p>}
          {canAct && (
            <div className="row" style={{ gap: 8, marginTop: 10 }}>
              <button className="btn btn-primary btn-sm grow" onClick={() => handleAcceptOffer(m.id)}>
                <Icon name="check" />{t('Accept', 'منظور')}
              </button>
              <button className="btn btn-outline btn-sm grow" onClick={handleCounter}>
                {t('Counter', 'جوابی قیمت')}
              </button>
            </div>
          )}
        </div>
      );
    } else {
      body = <div className="bub">{m.text}</div>;
    }

    return (
      <div className={`msg ${cls}`} key={m.id}>
        {body}
        <time>{m.time}</time>
      </div>
    );
  };

  // ---- Typing indicator ----
  const typingIndicator = _typing && (
    <div className="msg them" key="typing">
      <div className="bub">
        <span className="wave live">
          {[6, 10, 6].map((h, i) => (
            <i
              key={i}
              style={{
                height: `${h}px`,
                animationDelay: `${i * 0.15}s`,
                background: 'var(--muted-2)',
              }}
            />
          ))}
        </span>
      </div>
    </div>
  );

  // ---- Counter offer modal ----
  const counterModal = _modal === 'counter' && (
    <div className="scrim" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal">
        <h2 style={{ fontSize: 22 }}>
          {isCustomer ? t('Offer a price', 'قیمت بتائیں') : t('Send your price', 'اپنی قیمت بھیجیں')}
        </h2>
        <p className="muted small" style={{ marginTop: 4 }}>
          {t('Use + and – or tap a suggestion.', '+ اور – دبائیں یا تجویز چنیں۔')}
        </p>
        <div className="counter" style={{ marginTop: 18 }}>
          <button
            className="icon-btn"
            style={{ width: 56, height: 56 }}
            onClick={() => setCounter((v) => Math.max(300, v - 100))}
            aria-label="Minus 100"
          >
            <Icon name="minus" />
          </button>
          <span className="amt num">{rs(counter)}</span>
          <button
            className="icon-btn"
            style={{ width: 56, height: 56 }}
            onClick={() => setCounter((v) => v + 100)}
            aria-label="Plus 100"
          >
            <Icon name="plus" />
          </button>
        </div>
        <div className="row wrapit" style={{ justifyContent: 'center', marginTop: 12, gap: 6 }}>
          {[1000, 1200, 1300, 1500, 1800].map((a) => (
            <button
              key={a}
              className="chip"
              aria-pressed={counter === a}
              onClick={() => setCounter(a)}
            >
              {rs(a)}
            </button>
          ))}
        </div>
        <label className="lbl" htmlFor="offernote" style={{ marginTop: 16 }}>
          {t('Note (optional)', 'نوٹ (اختیاری)')}
        </label>
        <input
          id="offernote"
          className="inp"
          placeholder={t('e.g. includes connector check', 'مثلاً: کنیکٹر چیک شامل')}
          value={offerNote}
          onChange={(e) => setOfferNote(e.target.value)}
        />
        <div className="row" style={{ marginTop: 18 }}>
          <button className="btn btn-outline grow" onClick={closeModal}>
            {t('Cancel', 'منسوخ')}
          </button>
          <button
            className="btn btn-primary grow"
            onClick={() => {
              sendOffer(counter, offerNote);
              setOfferNote('');
            }}
          >
            <Icon name="send" className="flip" />{t('Send offer', 'پیشکش بھیجیں')}
          </button>
        </div>
      </div>
    </div>
  );

  // ---- Call modal ----
  const callModal = _modal === 'call' && (
    <div className="scrim" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal">
        <h2 style={{ fontSize: 22 }}>
          {t('Call', 'کال')} {isCustomer ? wname(w) : t(CUSTOMER.name, CUSTOMER.nameUr)}
        </h2>
        <p className="muted small" style={{ marginTop: 6 }}>
          {t('Numbers are shared once a request is accepted. Sample number:', 'درخواست قبول ہونے پر نمبر شیئر ہوتا ہے۔ نمونہ نمبر:')}
        </p>
        <div className="locbar" style={{ marginTop: 14, justifyContent: 'space-between' }}>
          <b className="num" style={{ fontSize: 22, userSelect: 'all' }}>
            {isCustomer ? w.phone : CUSTOMER.phone}
          </b>
        </div>
        <p className="xs muted" style={{ marginTop: 10 }}>
          {t('In the real app this opens your phone dialler.', 'اصل ایپ میں فون ڈائلر کھلے گا۔')}
        </p>
        <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={closeModal}>
          {t('Done', 'ٹھیک ہے')}
        </button>
      </div>
    </div>
  );

  // ---- Sidebar (job details) ----
  const sidebar = (
    <aside>
      <div className="card stack" style={{ gap: 12 }}>
        <div className="row">
          <span className="tile" style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--mint)', color: 'var(--emerald)', display: 'grid', placeItems: 'center' }}>
            <Icon name={c.icon} />
          </span>
          <b>{job.title}</b>
        </div>
        <ul style={{ margin: 0, paddingInlineStart: 18 }} className="small">
          {job.details.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
        <div className="thumb" style={{ width: '100%', height: 140 }}>
          <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
            <rect width="120" height="120" fill="#DCE8E2" />
            <rect x="10" y="22" width="100" height="16" rx="3" fill="#B9C9C1" />
            <rect x="38" y="38" width="10" height="34" fill="#9AA8A1" />
            <path d="M48 70h22a6 6 0 0 1 6 6v20" stroke="#7D8C85" strokeWidth="8" fill="none" />
            <circle cx="76" cy="80" r="7" fill="#087F5B" />
            <rect x="0" y="96" width="120" height="24" fill="#C4D2CB" />
          </svg>
        </div>
        <dl className="kv" style={{ margin: 0 }}>
          <dt><Icon name="clock" />{t('Time', 'وقت')}</dt>
          <dd>{job.time}</dd>
          <dt><Icon name="pin" />{t('Place', 'جگہ')}</dt>
          <dd>
            {stIdx(job.status) >= stIdx('confirmed') || isCustomer
              ? job.address
              : 'G-11/2 · '}
            {!isCustomer && stIdx(job.status) < stIdx('confirmed') && (
              <span className="muted small">{t('full address after booking', 'پورا پتا بکنگ کے بعد')}</span>
            )}
          </dd>
          <dt><Icon name="tag" />{t('Price', 'قیمت')}</dt>
          <dd className="num">{job.price ? rs(job.price) : '—'}</dd>
        </dl>

        {job.status === 'agreed' && isCustomer && (
          <button className="btn btn-primary btn-lg btn-block" onClick={() => onNavigate('confirm')}>
            <Icon name="check" />{t('Review & confirm booking', 'بکنگ کنفرم کریں')}
          </button>
        )}

        {job.status === 'agreed' && !isCustomer && (
          <>
            <Disclaimer>
              {t('Waiting for the customer to confirm the booking.', 'گاہک کی تصدیق کا انتظار۔')}
            </Disclaimer>
            <button className="btn btn-outline btn-block" onClick={() => simCustomerConfirm()}>
              <Icon name="refresh" />{t('Demo: simulate customer confirming', 'ڈیمو: گاہک کی تصدیق')}
            </button>
          </>
        )}

        {stIdx(job.status) >= stIdx('confirmed') && job.status !== 'reviewed' && (
          <button className="btn btn-outline btn-block" onClick={() => onNavigate(isCustomer ? 'track' : 'wdash')}>
            <Icon name="calendar" />{t('Open booking', 'بکنگ کھولیں')}
          </button>
        )}
      </div>
    </aside>
  );

  // ---- Main render ----
  return (
    <main className="appmain">
      <div className="wrap">
        <div className="chat-layout">
          <section className="chatbox" aria-label="Conversation">
            {/* Header */}
            <div className="chat-head">
              <button
                className="icon-btn"
                onClick={() => onNavigate(isCustomer ? 'discover' : 'wdash')}
                aria-label="Back"
              >
                <Icon name="arrowL" className="flip" />
              </button>
              <Avatar id={other.avatarId} size={44} radius={14} />
              <div className="grow">
                <b style={{ display: 'block' }}>{other.name}</b>
                <span className="small muted">{other.sub}</span>
              </div>
              {other.pill}
              <button className="icon-btn" onClick={() => openModal('call')} aria-label="Call">
                <Icon name="phone" />
              </button>
            </div>

            {/* Agreement banner */}
            {agreeBanner}

            {/* Messages */}
            <div className="msgs" ref={msgsRef} aria-live="polite">
              {msgs.map(renderMessage)}
              {typingIndicator}
            </div>

            {/* Quick replies */}
            {!locked && (
              <div className="quick" aria-label="Quick replies">
                {quickReplies.map(([label, value], i) => (
                  <button
                    key={i}
                    className="chip"
                    onClick={() => handleQuick(label, value)}
                  >
                    {label}
                  </button>
                ))}
                {showPriceBtn && (
                  <button
                    className="chip"
                    style={{ borderColor: 'var(--amber)', background: 'var(--amber-50)' }}
                    onClick={() => { setCounter(role === 'customer' ? 1300 : 1500); openModal('counter'); }}
                  >
                    <Icon name="tag" />
                    {isCustomer ? t('Offer a price', 'قیمت بتائیں') : t('Send price', 'قیمت بھیجیں')}
                  </button>
                )}
              </div>
            )}

            {/* Composer */}
            {!locked && (
              <form className="composer" onSubmit={handleSendText}>
                <button
                  type="button"
                  className={`mic-sm${_rec ? ' listening' : ''}`}
                  onClick={handleMic}
                  aria-label={_rec ? 'Stop and send voice note' : 'Record voice note'}
                >
                  <Icon name={_rec ? 'send' : 'mic'} />
                </button>
                {_rec ? (
                  <div className="grow row" style={{ gap: 10, color: 'var(--error)' }}>
                    <div className="wave live">
                      {Array.from({ length: 16 }, (_, i) => (
                        <i
                          key={i}
                          style={{
                            height: `${6 + ((i * 5) % 14)}px`,
                            animationDelay: `${i * 0.05}s`,
                            background: 'var(--error)',
                          }}
                        />
                      ))}
                    </div>
                    <b className="small">{t('Recording… tap to send', 'ریکارڈنگ… بھیجنے کے لیے دبائیں')}</b>
                  </div>
                ) : (
                  <>
                    <label className="sr" htmlFor="chatin">Message</label>
                    <input
                      id="chatin"
                      className="inp"
                      placeholder={t('Type a message, or hold the mic', 'پیغام لکھیں یا مائیک دبائیں')}
                      autoComplete="off"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                    />
                    <button
                      className="icon-btn"
                      type="submit"
                      aria-label="Send"
                      style={{ background: 'var(--emerald)', color: '#fff', border: 0 }}
                    >
                      <Icon name="send" className="flip" />
                    </button>
                  </>
                )}
              </form>
            )}
          </section>

          {sidebar}
        </div>
      </div>

      {counterModal}
      {callModal}
    </main>
  );
}
