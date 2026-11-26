/**
 * AdminLogin — second-factor PIN screen shown after the main login
 * detects the admin phone number. The user types their username/password.
 */
import { useState } from 'react';
import { Icon } from '../lib/icons';
import { ADMIN_USERNAME } from './AdminContext';

export default function AdminLogin({ onSuccess, onBack }) {
  const [pin, setPin]     = useState('');
  const [err, setErr]     = useState('');
  const [show, setShow]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === ADMIN_USERNAME) {
      onSuccess();
    } else {
      setErr('Incorrect admin password.');
      setPin('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0a1a0f', padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: 36,
        maxWidth: 420, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,.35)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: '#006400',
            display: 'grid', placeItems: 'center', color: '#fff', fontSize: 22, fontWeight: 800,
          }}>K</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#004300' }}>Karigar Admin</div>
            <div style={{ fontSize: 12, color: '#5E6A66' }}>Management Portal</div>
          </div>
        </div>

        <h2 style={{ fontSize: 22, color: '#004300', marginBottom: 6 }}>Admin Authentication</h2>
        <p style={{ color: '#5E6A66', fontSize: 14, marginBottom: 24 }}>
          Phone number verified. Enter your admin password to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#202B29', marginBottom: 6 }}>
            Admin Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={show ? 'text' : 'password'}
              value={pin}
              onChange={(e) => { setPin(e.target.value); setErr(''); }}
              placeholder="Enter admin password"
              autoFocus
              style={{
                width: '100%', boxSizing: 'border-box',
                border: err ? '2px solid #D94848' : '2px solid #E1E6E3',
                borderRadius: 12, padding: '14px 44px 14px 16px',
                fontSize: 16, fontWeight: 600, background: '#FAFAF7',
              }}
            />
            <button
              type="button"
              onClick={() => setShow(v => !v)}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#5E6A66', fontSize: 18,
              }}
            >
              {show ? '🙈' : '👁'}
            </button>
          </div>

          {err && (
            <div style={{
              marginTop: 10, padding: '10px 14px', background: '#FCEDED',
              borderRadius: 10, color: '#B23434', fontSize: 13, display: 'flex', gap: 8,
            }}>
              <Icon name="alert" /> {err}
            </div>
          )}

          <button
            type="submit"
            disabled={!pin}
            style={{
              width: '100%', marginTop: 20, padding: '15px 0',
              background: '#006400', color: '#fff', border: 'none', borderRadius: 14,
              fontSize: 16, fontWeight: 700, cursor: pin ? 'pointer' : 'not-allowed',
              opacity: pin ? 1 : 0.6,
            }}
          >
            Enter Admin Portal
          </button>

          <button
            type="button"
            onClick={onBack}
            style={{
              width: '100%', marginTop: 10, padding: '12px 0',
              background: 'transparent', color: '#5E6A66', border: 'none',
              fontSize: 14, cursor: 'pointer',
            }}
          >
            ← Back to login
          </button>
        </form>
      </div>
    </div>
  );
}
