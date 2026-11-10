/**
 * Chat — voice-first communication between customer and worker.
 * Modals (counter offer, call) are handled globally by Modal.jsx via openModal().
 */
import { useState, useRef, useEffect } from 'react';
import { Icon } from '../lib/icons';
import { Avatar } from '../lib/avatar';
import { useApp, rs } from '../context/AppContext';
import { StatusPill, Disclaimer } from '../components/Shared';
import { catBy, CUSTOMER, stIdx } from '../lib/data';

export default function Chat({ onNavigate }) {
  const {
    t, job, msgs, role, W, wname, catName,
    sendMsg, sendVoice, sendOffer, acceptOffer,
    openModal, _playing, _rec, _typing,
    togglePlay, toggleRec, simCustomerConfirm,
  } = useApp();

  const [draft, setDraft] = useState('');
  const msgsRef = useRef(null);

  // Auto-scroll to bottom whenever messages or typing indicator changes
  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [msgs, _typing]);

  // ── Empty state ──────────────────────────────────────────────────────────
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

  const other = isCustomer
    ? { name: wname(w), sub: catName(job.cat), avatarId: job.workerId, pill: <StatusPill w={w} /> }
    : { name: t(CUSTOMER.name, CUSTOMER.nameUr), sub: `${CUSTOMER.area} · ${w.km} km`, avatarId: 'ayesha', pill: null };

  // ── Agreement banner ─────────────────────────────────────────────────────
  let agreeCls = 'none';
  let agreeContent;
  if (job.status === 'declined') {
    agreeContent = <><Icon name="x" />{t('Request declined', 'درخواست رد')}</>;
  } else if (stIdx(job.status) >= stIdx('agreed')) {
    agreeCls = 'done';
    agreeContent = (
      <>
        <Icon name="hand" />
        {t('Agreed:', 'طے:')} <b className="num">{rs(job.price)}</b> · {job.time}
        {job.status === 'agreed' && (
          <span> · {isCustomer
            ? t('confirm the booking', 'بکنگ کنفرم کریں')
            : t('waiting for customer to confirm', 'گاہک کی تصدیق کا انتظار')}
          </span>
        )}
      </>
    );
  } else if (msgs.some((m) => m.type === 'offer' && m.state === 'open')) {
    agreeCls = 'pending';
    agreeContent = <><Icon name="tag" />{t('Price offer pending', 'قیمت کی پیشکش زیرِ غور')}</>;
  } else {
    agreeContent = <><Icon name="tag" />{t('Price not agreed yet', 'قیمت ابھی طے نہیں')}</>;
  }

  const locked = job.status === 'declined';
  const showPriceBtn = stIdx(job.status) < stIdx('agreed');

  // ── Quick replies ─────────────────────────────────────────────────────────
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
      ];

  const handleQuick = (label, value) => {
    if (value === '__price') { openModal('counter'); return; }
    sendMsg(label);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    sendMsg(text);
    setDraft('');
  };

  const handleMic = () => {
    if (!_rec) { toggleRec(); }
    else { toggleRec(); sendVoice(); }
  };

  // ── Render a single message ───────────────────────────────────────────────
  const renderMsg = (m) => {
    if (m.from === 'sys') {
      return (
        <div className="msg sys" key={m.id}>
          <div className="bub" dangerouslySetInnerHTML={{ __html: m.html || m.text }} />
        </div>
      );
    }

    const me = m.from === role;
    let body;

    if (m.type === 'text') {
      body = <div className="bub">{m.text}{m.tr && <div className="vt">{m.tr}</div>}</div>;

    } else if (m.type === 'voice') {
      const playing = _playing === m.id;
      body = (
        <div className="bub">
          <div className="vnote">
            <button className="play" onClick={() => togglePlay(m.id)} aria-label={playing ? 'Pause' : 'Play'}>
              <Icon name={playing ? 'pause' : 'play'} />
            </button>
            <div className={`wave${playing ? ' live' : ''}`} style={{ flex: 1 }}>
              {Array.from({ length: 22 }, (_, i) => (
                <i key={i} style={{ height: `${5 + ((i * 7 + m.id.length * 3) % 15)}px`, animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
            <span className="small num">{m.dur || '0:06'}</span>
          </div>
          {m.text && <div className="vt"><Icon name="sparkles" /> <i>{m.text}</i></div>}
        </div>
      );

    } else if (m.type === 'offer') {
      const canAct = !me && m.state === 'open' && stIdx(job.status) < stIdx('agreed');
      const cls = m.state === 'accepted' ? 'accepted' : m.state === 'superseded' ? 'superseded' : '';
      body = (
        <div className={`offer ${cls}`}>
          <div className="row between">
            <span className="small" style={{ fontWeight: 700 }}>
              <Icon name="tag" /> {m.from === 'worker' ? t('Price offer', 'قیمت کی پیشکش') : t('Counter-offer', 'جوابی پیشکش')}
            </span>
            {m.state === 'accepted'
              ? <span className="pill pill-av"><Icon name="check" />{t('Accepted', 'منظور')}</span>
              : m.state === 'superseded'
              ? <span className="pill pill-off">{t('Replaced', 'بدل گئی')}</span>
              : <span className="pill pill-busy">{t('Waiting', 'انتظار')}</span>}
          </div>
          <div className="amt num">{rs(m.amount)}</div>
          {m.note && <p className="small">{m.note}</p>}
          {canAct && (
            <div className="row" style={{ gap: 8, marginTop: 10 }}>
              <button className="btn btn-primary btn-sm grow" onClick={() => acceptOffer(m.id)}>
                <Icon name="check" />{t('Accept', 'منظور')}
              </button>
              <button className="btn btn-outline btn-sm grow" onClick={() => openModal('counter')}>
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
      <div className={`msg ${me ? 'me' : 'them'}`} key={m.id}>
        {body}
        <time>{m.time}</time>
      </div>
    );
  };

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const sidebar = (
    <aside>
      <div className="card stack" style={{ gap: 12 }}>
        {/* Job title */}
        <div className="row" style={{ gap: 10 }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--mint)', color: 'var(--emerald)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Icon name={c.icon} />
          </span>
          <b>{job.title}</b>
        </div>

        {/* Details */}
        <ul style={{ margin: 0, paddingInlineStart: 18 }} className="small">
          {job.details.map((d, i) => <li key={i}>{d}</li>)}
        </ul>

        {/* Photo thumbnail */}
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

        {/* Key-value details */}
        <dl className="kv" style={{ margin: 0 }}>
          <dt><Icon name="clock" />{t('Time', 'وقت')}</dt>
          <dd>{job.time}</dd>
          <dt><Icon name="pin" />{t('Place', 'جگہ')}</dt>
          <dd>
            {stIdx(job.status) >= stIdx('confirmed') || isCustomer
              ? job.address
              : <>G-11/2 · <span className="muted small">{t('full address after booking', 'پورا پتا بکنگ کے بعد')}</span></>}
          </dd>
          <dt><Icon name="tag" />{t('Price', 'قیمت')}</dt>
          <dd className="num">{job.price ? rs(job.price) : '—'}</dd>
        </dl>

        {/* Action buttons based on status */}
        {job.status === 'agreed' && isCustomer && (
          <button className="btn btn-primary btn-lg btn-block" onClick={() => onNavigate('confirm')}>
            <Icon name="check" />{t('Review & confirm booking', 'بکنگ کنفرم کریں')}
          </button>
        )}
        {job.status === 'agreed' && !isCustomer && (
          <>
            <Disclaimer>{t('Waiting for the customer to confirm the booking.', 'گاہک کی تصدیق کا انتظار۔')}</Disclaimer>
            <button className="btn btn-outline btn-block" onClick={simCustomerConfirm}>
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

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <main className="appmain">
      <div className="wrap">
        <div className="chat-layout">
          <section className="chatbox" aria-label="Conversation">

            {/* Header */}
            <div className="chat-head">
              <button className="icon-btn" onClick={() => onNavigate(isCustomer ? 'discover' : 'wdash')} aria-label="Back">
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
            <div className={`agree ${agreeCls}`}>{agreeContent}</div>

            {/* Messages */}
            <div className="msgs" ref={msgsRef} aria-live="polite">
              {msgs.map(renderMsg)}
              {_typing && (
                <div className="msg them" key="typing">
                  <div className="bub">
                    <span className="wave live">
                      {[6, 10, 6].map((h, i) => (
                        <i key={i} style={{ height: `${h}px`, animationDelay: `${i * 0.15}s`, background: 'var(--muted-2)' }} />
                      ))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick replies */}
            {!locked && (
              <div className="quick" aria-label="Quick replies">
                {quickReplies.map(([label, value], i) => (
                  <button key={i} className="chip" onClick={() => handleQuick(label, value)}>{label}</button>
                ))}
                {showPriceBtn && (
                  <button
                    className="chip"
                    style={{ borderColor: 'var(--amber)', background: 'var(--amber-50)' }}
                    onClick={() => openModal('counter')}
                  >
                    <Icon name="tag" />
                    {isCustomer ? t('Offer a price', 'قیمت بتائیں') : t('Send price', 'قیمت بھیجیں')}
                  </button>
                )}
              </div>
            )}

            {/* Composer */}
            {!locked && (
              <form className="composer" onSubmit={handleSend}>
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
                        <i key={i} style={{ height: `${6 + ((i * 5) % 14)}px`, animationDelay: `${i * 0.05}s`, background: 'var(--error)' }} />
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
    </main>
  );
}
