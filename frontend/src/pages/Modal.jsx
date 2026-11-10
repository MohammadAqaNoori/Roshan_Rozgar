/**
 * Global modal — counter offer, call, cancel, decline.
 * Single instance rendered in App.jsx so there's never a duplicate.
 */
import { useState } from 'react';
import { Icon } from '../lib/icons';
import { useApp, rs } from '../context/AppContext';
import { CUSTOMER } from '../lib/data';

export default function Modal({ onNavigate }) {
  const { t, _modal, closeModal, job, W, wname, role, sendOffer, showToast } = useApp();

  const [counter, setCounter] = useState(1300);
  const [offerNote, setOfferNote] = useState('');

  if (!_modal) return null;

  const w = job ? W(job.workerId) : null;
  const isCustomer = role === 'customer';

  // ── Counter offer ─────────────────────────────────────────────────────────
  if (_modal === 'counter') {
    return (
      <div className="scrim" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="modal" role="dialog" aria-modal="true">
          <h2 style={{ fontSize: 22 }}>
            {isCustomer ? t('Offer a price', 'قیمت بتائیں') : t('Send your price', 'اپنی قیمت بھیجیں')}
          </h2>
          <p className="muted small" style={{ marginTop: 4 }}>
            {t('Use + and – or tap a suggestion.', '+ اور – دبائیں یا تجویز چنیں۔')}
          </p>

          {/* Stepper */}
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

          {/* Presets */}
          <div className="row wrapit" style={{ justifyContent: 'center', marginTop: 12, gap: 6 }}>
            {[800, 1000, 1200, 1500, 1800, 2500].map((a) => (
              <button key={a} className={`chip${counter === a ? ' pressed' : ''}`} onClick={() => setCounter(a)}>
                {rs(a)}
              </button>
            ))}
          </div>

          {/* Note */}
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
                sendOffer(counter, offerNote);  // actually sends the offer into chat
                setOfferNote('');
                showToast(t('Price offer sent', 'قیمت کی پیشکش بھیجی گئی'), true);
              }}
            >
              <Icon name="send" className="flip" />{t('Send offer', 'پیشکش بھیجیں')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Call ──────────────────────────────────────────────────────────────────
  if (_modal === 'call') {
    const phone = isCustomer ? w?.phone : CUSTOMER.phone;
    const name  = isCustomer ? (w ? wname(w) : '—') : t(CUSTOMER.name, CUSTOMER.nameUr);
    return (
      <div className="scrim" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="modal" role="dialog" aria-modal="true">
          <h2 style={{ fontSize: 22 }}>{t('Call', 'کال')} {name}</h2>
          <p className="muted small" style={{ marginTop: 6 }}>
            {t(
              'Numbers are shared once a request is accepted. Sample number:',
              'درخواست قبول ہونے پر نمبر شیئر ہوتا ہے۔ نمونہ نمبر:'
            )}
          </p>
          <div className="locbar" style={{ marginTop: 14, justifyContent: 'space-between' }}>
            <b className="num" style={{ fontSize: 22, userSelect: 'all' }}>{phone}</b>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                try { navigator.clipboard.writeText(phone); showToast(t('Copied', 'کاپی ہو گیا'), true); } catch (e) {}
              }}
            >
              {t('Copy', 'کاپی')}
            </button>
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
  }

  // ── Cancel booking ────────────────────────────────────────────────────────
  if (_modal === 'cancel') {
    return (
      <div className="scrim" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="modal" role="dialog" aria-modal="true">
          <h2 style={{ fontSize: 22 }}>{t('Cancel this booking?', 'بکنگ منسوخ کریں؟')}</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            {t(
              'The worker will be told right away and marked Available again. Free before they set out.',
              'کاریگر کو فوراً بتایا جائے گا اور وہ دوبارہ دستیاب ہو جائیں گے۔'
            )}
          </p>
          <div className="row" style={{ marginTop: 18 }}>
            <button className="btn btn-outline grow" onClick={closeModal}>
              {t('Keep booking', 'بکنگ رکھیں')}
            </button>
            <button
              className="btn btn-danger grow"
              onClick={() => {
                closeModal();
                showToast(t('Booking cancelled', 'بکنگ منسوخ'));
                onNavigate('discover');
              }}
            >
              {t('Yes, cancel', 'ہاں، منسوخ')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Decline job (worker) ──────────────────────────────────────────────────
  if (_modal === 'decline') {
    const reasons = [
      [t('Too far', 'بہت دور'), t('بہت دور', 'بہت دور')],
      [t('Not my kind of work', 'میرا کام نہیں'), t('میرا کام نہیں', 'میرا کام نہیں')],
      [t('Busy at that time', 'اس وقت مصروف'), t('اس وقت مصروف', 'اس وقت مصروف')],
    ];
    return (
      <div className="scrim" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="modal" role="dialog" aria-modal="true">
          <h2 style={{ fontSize: 22 }}>{t('Decline this job?', 'یہ کام نہیں کرنا؟')}</h2>
          <p className="ur" style={{ fontSize: 18, marginTop: 4 }}>کیا آپ یہ کام نہیں لینا چاہتے؟</p>
          <p className="muted small">{t('Pick a reason so the customer knows.', 'وجہ چنیں تاکہ گاہک کو پتا چلے۔')}</p>
          <div className="stack" style={{ gap: 8, marginTop: 12 }}>
            {reasons.map(([en, ur], i) => (
              <button
                key={i}
                className="choice wide"
                style={{ minHeight: 60 }}
                onClick={() => {
                  closeModal();
                  showToast(t('Job declined', 'کام رد کیا'));
                  onNavigate('wdash');
                }}
              >
                <span className="u">{ur}</span>
                <b className="small">{en}</b>
              </button>
            ))}
          </div>
          <button className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={closeModal}>
            {t('Go back', 'واپس')}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
