import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { Icon } from '../../lib/icons';

const STATUS_COLORS = {
  available: { bg: 'rgba(74,222,128,.15)', border: 'rgba(74,222,128,.3)',  text: '#4ade80'  },
  busy:      { bg: 'rgba(251,191,36,.15)', border: 'rgba(251,191,36,.3)',  text: '#fbbf24'  },
  offline:   { bg: 'rgba(148,163,184,.1)', border: 'rgba(148,163,184,.2)', text: '#94a3b8'  },
};

export default function WorkersSection() {
  const { workers, showToast } = useAdmin();
  const [q, setQ]   = useState('');
  const [local, setLocal] = useState(null); // local override list

  const list = (local || workers).filter(w => {
    if (!q) return true;
    const name = (w.user_name || '').toLowerCase();
    const area = (w.area_name || '').toLowerCase();
    const trade = (w.trade || '').toLowerCase();
    return name.includes(q.toLowerCase()) || area.includes(q) || trade.includes(q);
  });

  const setStatus = (id, newStatus) => {
    const base = local || workers;
    setLocal(base.map(w => w.id === id ? { ...w, status: newStatus } : w));
    showToast(`Worker status set to ${newStatus}`, true);
  };

  const verify = (id) => {
    const base = local || workers;
    setLocal(base.map(w => w.id === id ? { ...w, _verified: true } : w));
    showToast('Worker marked as verified ✓', true);
  };

  return (
    <div>
      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 10, padding: '8px 14px', marginBottom: 20, maxWidth: 380,
      }}>
        <Icon name="search" style={{ width: 16, height: 16, color: '#8BAFA0' }} />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search by name, trade, area…"
          style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14, width: '100%' }}
        />
      </div>

      <p style={{ color: '#8BAFA0', fontSize: 13, marginBottom: 14 }}>
        {list.length} worker{list.length !== 1 ? 's' : ''}
      </p>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {list.map(w => {
          const sc = STATUS_COLORS[w.status] || STATUS_COLORS.offline;
          return (
            <div key={w.id} style={{
              background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 16, padding: 18,
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>
                    {w.user_name || `Worker #${w.id}`}
                    {w._verified && (
                      <span style={{ marginLeft: 6, background: '#006400', color: '#4ade80', borderRadius: 99, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#8BAFA0', fontSize: 13, marginTop: 2 }}>
                    {w.trade?.replace('_', ' ')} · {w.area_name}
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                  background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text,
                }}>
                  {w.status}
                </span>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                {[
                  ['⭐', w.rating_avg?.toFixed(1), 'Rating'],
                  ['✅', w.total_jobs, 'Jobs'],
                  ['💬', w.total_reviews, 'Reviews'],
                ].map(([ico, val, lbl]) => (
                  <div key={lbl} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{ico} {val ?? 0}</div>
                    <div style={{ fontSize: 11, color: '#8BAFA0' }}>{lbl}</div>
                  </div>
                ))}
              </div>

              {/* Phone */}
              {w.user_phone && (
                <div style={{ color: '#8BAFA0', fontSize: 12, marginBottom: 12 }}>
                  📱 {w.user_phone}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {!w._verified && (
                  <button onClick={() => verify(w.id)} style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    background: 'rgba(74,222,128,.15)', border: '1px solid rgba(74,222,128,.3)', color: '#4ade80',
                  }}>
                    ✓ Verify
                  </button>
                )}
                {w.status !== 'available' && (
                  <button onClick={() => setStatus(w.id, 'available')} style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    background: 'rgba(74,222,128,.1)', border: '1px solid rgba(74,222,128,.2)', color: '#4ade80',
                  }}>
                    Set Available
                  </button>
                )}
                {w.status !== 'offline' && (
                  <button onClick={() => setStatus(w.id, 'offline')} style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#f87171',
                  }}>
                    Set Offline
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!list.length && (
        <div style={{ textAlign: 'center', color: '#8BAFA0', padding: 60 }}>
          No workers found. Check backend connection.
        </div>
      )}
    </div>
  );
}
