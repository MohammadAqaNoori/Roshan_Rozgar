/**
 * Global modal — counter offer, call, cancel, decline.
 * Single instance rendered in App.jsx so there's never a duplicate.
 */
import { useState } from 'react';
import { Icon } from '../lib/icons';
import { useApp, afn } from '../context/AppContext';
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
            {isCustomer ? t('Offer a price', 'پیشنهاد قیمت') : t('Send your price', 'قیمت خود را بفرستید')}
          </h2>
          <p className="muted small" style={{ marginTop: 4 }}>
            {t('Use + and – or tap a suggestion.', 'از + و – استفاده کنید یا یک پیشنهاد را انتخاب کنید.')}
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
            <span className="amt num">{afn(counter)}</span>
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
            {[800, 1000, 1200, 1500, 1800, 2500].map((a) => (
              <button key={a} className={`chip${counter === a ? ' pressed' : ''}`} onClick={() => setCounter(a)}>
                {afn(a)}
              </button>
            ))}
          </div>

          <label className="lbl" htmlFor="offernote" style={{ marginTop: 16 }}>
            {t('Note (optional)', 'یادداشت (اختیاری)')}
          </label>
          <input
            id="offernote"
            className="inp"
            placeholder={t('e.g. includes connector check', 'مثلاً: بررسی اتصال شامل می‌شود')}
            value={offerNote}
            onChange={(e) => setOfferNote(e.target.value)}
          />

          <div className="row" style={{ marginTop: 18 }}>
            <button className="btn btn-outline grow" onClick={closeModal}>
              {t('Cancel', 'لغو')}
            </button>
            <button
              className="btn btn-primary grow"
              onClick={() => {
                sendOffer(counter, offerNote);
                setOfferNote('');
                showToast(t('Price offer sent', 'پیشنهاد قیمت ارسال شد'), true);
              }}
            >
              <Icon name="send" className="flip" />{t('Send offer', 'ارسال پیشنهاد')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Call ──────────────────────────────────────────────────────────────────
  if (_modal === 'call') {
    const phone = isCustomer ? w?.phone : CUSTOMER.phone;
    const name  = isCustomer ? (w ? wname(w) : '—') : t(CUSTOMER.name, CUSTOMER.nameFa);
    return (
      <div className="scrim" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="modal" role="dialog" aria-modal="true">
          <h2 style={{ fontSize: 22 }}>{t('Call', 'تماس با')} {name}</h2>
          <p className="muted small" style={{ marginTop: 6 }}>
            {t(
              'Numbers are shared once a request is accepted. Sample number:',
              'شماره‌ها پس از قبول درخواست به اشتراک گذاشته می‌شوند. شماره نمونه:'
            )}
          </p>
          <div className="locbar" style={{ marginTop: 14, justifyContent: 'space-between' }}>
            <b className="num" style={{ fontSize: 22, userSelect: 'all' }}>{phone}</b>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                try { navigator.clipboard.writeText(phone); showToast(t('Copied', 'کپی شد'), true); } catch (e) {}
              }}
            >
              {t('Copy', 'کپی')}
            </button>
          </div>
          <p className="xs muted" style={{ marginTop: 10 }}>
            {t('In the real app this opens your phone dialler.', 'در برنامه اصلی صفحه شماره‌گیر تلفن باز می‌شود.')}
          </p>
          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={closeModal}>
            {t('Done', 'تمام')}
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
          <h2 style={{ fontSize: 22 }}>{t('Cancel this booking?', 'این رزرو را لغو کنید؟')}</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            {t(
              'The worker will be told right away and marked Available again. Free before they set out.',
              'کاریگر فوراً مطلع می‌شود و دوباره در دسترس می‌شود. قبل از حرکت رایگان است.'
            )}
          </p>
          <div className="row" style={{ marginTop: 18 }}>
            <button className="btn btn-outline grow" onClick={closeModal}>
              {t('Keep booking', 'نگه داشتن رزرو')}
            </button>
            <button
              className="btn btn-danger grow"
              onClick={() => {
                closeModal();
                showToast(t('Booking cancelled', 'رزرو لغو شد'));
                onNavigate('discover');
              }}
            >
              {t('Yes, cancel', 'بله، لغو کن')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Decline job (worker) ──────────────────────────────────────────────────
  if (_modal === 'decline') {
    const reasons = [
      t('Too far', 'خیلی دور است'),
      t('Not my kind of work', 'کار من نیست'),
      t('Busy at that time', 'آن وقت مشغولم'),
    ];
    return (
      <div className="scrim" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="modal" role="dialog" aria-modal="true">
          <h2 style={{ fontSize: 22 }}>{t('Decline this job?', 'این کار را رد کنید؟')}</h2>
          <p className="ur" style={{ fontSize: 18, marginTop: 4 }}>{t('Are you sure you don\'t want this job?', 'آیا مطمئن هستید که این کار را نمی‌خواهید؟')}</p>
          <p className="muted small">{t('Pick a reason so the customer knows.', 'یک دلیل انتخاب کنید تا مشتری بداند.')}</p>
          <div className="stack" style={{ gap: 8, marginTop: 12 }}>
            {reasons.map((reason, i) => (
              <button
                key={i}
                className="choice wide"
                style={{ minHeight: 60 }}
                onClick={() => {
                  closeModal();
                  showToast(t('Job declined', 'کار رد شد'));
                  onNavigate('wdash');
                }}
              >
                <b className="small">{reason}</b>
              </button>
            ))}
          </div>
          <button className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={closeModal}>
            {t('Go back', 'بازگشت')}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
