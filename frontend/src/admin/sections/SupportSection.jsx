import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { Icon } from '../../lib/icons';

// Demo support tickets (in production stored in DB / separate tickets table)
const DEMO_TICKETS = [
  { id: 'T-001', from: 'Mariam Noori', phone: '+93700100100', role: 'customer', subject: 'Worker did not show up', body: 'I booked Ahmad Shah for 4 PM yesterday, he never came and did not respond in chat. Please help.', status: 'open',   date: '2026-11-24 09:12' },
  { id: 'T-002', from: 'Abdul Karim',  phone: '+93700111002', role: 'worker',   subject: 'Cannot update my availability', body: 'When I tap "Available" in the app nothing happens. The toggle goes back to Offline after 2 seconds.', status: 'open',   date: '2026-11-24 10:45' },
  { id: 'T-003', from: 'Ahmad Shah',   phone: '+93700111001', role: 'worker',   subject: 'Job price was not shown correctly', body: 'The customer said ؋500 but the app showed ؋300. There is a mismatch.', status: 'resolved', date: '2026-11-23 14:20' },
  { id: 'T-004', from: 'Unknown User', phone: '+93775000000', role: 'customer', subject: 'App not loading on my phone', body: 'The app shows a white screen after login on my Samsung phone.', status: 'open',   date: '2026-11-24 11:30' },
];

const STATUS_STYLE = {
  open:     { bg: 'rgba(251,191,36,.15)', border: 'rgba(251,191,36,.3)',  text: '#fbbf24' },
  resolved: { bg: 'rgba(74,222,128,.15)', border: 'rgba(74,222,128,.3)',  text: '#4ade80' },
  closed:   { bg: 'rgba(148,163,184,.1)', border: 'rgba(148,163,184,.2)', text: '#94a3b8' },
};

export default function SupportSection() {
  const { showToast } = useAdmin();
  const [tickets, setTickets] = useState(DEMO_TICKETS);
  const [selected, setSelected]   = useState(null);
  const [reply, setReply]         = useState('');
  const [filter, setFilter]       = useState('all');

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  const resolve = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'resolved', adminReply: reply || 'Issue resolved.' } : t));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: 'resolved', adminReply: reply || 'Issue resolved.' }));
    setReply('');
    showToast('Ticket resolved ✓', true);
  };

  const close = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'closed' } : t));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: 'closed' }));
    showToast('Ticket closed', false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>
      {/* Ticket list */}
      <div>
        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['all', 'open', 'resolved', 'closed'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: filter === s ? '#006400' : 'rgba(255,255,255,.06)',
              border: filter === s ? '1px solid #4ade80' : '1px solid rgba(255,255,255,.1)',
              color: filter === s ? '#fff' : '#8BAFA0', textTransform: 'capitalize',
            }}>
              {s === 'all' ? `All (${tickets.length})` : `${s} (${tickets.filter(t => t.status === s).length})`}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(t => {
            const sc = STATUS_STYLE[t.status] || STATUS_STYLE.open;
            const isSelected = selected?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelected(t)}
                style={{
                  background: isSelected ? 'rgba(0,100,0,.2)' : 'rgba(255,255,255,.04)',
                  border: `1px solid ${isSelected ? 'rgba(74,222,128,.4)' : 'rgba(255,255,255,.08)'}`,
                  borderRadius: 14, padding: '16px 18px', cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#8BAFA0', fontWeight: 700 }}>{t.id}</span>
                    {' '}
                    <span style={{
                      padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                      background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text,
                    }}>{t.status}</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#8BAFA0' }}>{t.date}</span>
                </div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>{t.subject}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                    background: t.role === 'worker' ? 'rgba(251,191,36,.15)' : 'rgba(96,165,250,.15)',
                    color: t.role === 'worker' ? '#fbbf24' : '#60a5fa',
                  }}>{t.role}</span>
                  <span style={{ color: '#8BAFA0', fontSize: 12 }}>{t.from}</span>
                </div>
              </div>
            );
          })}

          {!filtered.length && (
            <div style={{ textAlign: 'center', color: '#8BAFA0', padding: 60 }}>
              No {filter !== 'all' ? filter : ''} tickets.
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{
          background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 16, padding: 22, alignSelf: 'flex-start', position: 'sticky', top: 0,
        }}>
          {/* Close panel */}
          <button onClick={() => setSelected(null)} style={{
            float: 'right', background: 'none', border: 'none', color: '#8BAFA0', cursor: 'pointer', fontSize: 18,
          }}>✕</button>

          <div style={{ fontSize: 11, color: '#8BAFA0', fontWeight: 700, marginBottom: 6 }}>{selected.id}</div>
          <h3 style={{ color: '#fff', fontSize: 17, marginBottom: 12 }}>{selected.subject}</h3>

          {/* From info */}
          <div style={{
            background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '12px 14px', marginBottom: 16,
          }}>
            <div style={{ fontSize: 13, color: '#8BAFA0', marginBottom: 4 }}>From</div>
            <div style={{ fontWeight: 700, color: '#fff' }}>{selected.from}</div>
            <div style={{ color: '#8BAFA0', fontSize: 12 }}>{selected.phone} · {selected.role}</div>
            <div style={{ color: '#8BAFA0', fontSize: 12, marginTop: 4 }}>{selected.date}</div>
          </div>

          {/* Message */}
          <div style={{
            background: 'rgba(255,255,255,.03)', borderRadius: 10, padding: '12px 14px',
            marginBottom: 16, fontSize: 14, color: '#E3F2EC', lineHeight: 1.6,
          }}>
            {selected.body}
          </div>

          {/* Previous admin reply */}
          {selected.adminReply && (
            <div style={{
              background: 'rgba(0,100,0,.15)', border: '1px solid rgba(74,222,128,.2)',
              borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#6EE89A',
            }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Admin Reply:</div>
              {selected.adminReply}
            </div>
          )}

          {/* Reply area */}
          {selected.status === 'open' && (
            <>
              <label style={{ fontSize: 12, color: '#8BAFA0', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                Your Reply
              </label>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type your response to the user…"
                rows={4}
                style={{
                  width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.06)',
                  border: '1px solid rgba(255,255,255,.12)', borderRadius: 10,
                  padding: '10px 12px', color: '#fff', fontSize: 13, resize: 'none',
                  fontFamily: 'inherit', marginBottom: 12,
                }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => resolve(selected.id)} style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  background: '#006400', border: '1px solid #4ade80', color: '#fff',
                }}>
                  ✓ Resolve
                </button>
                <button onClick={() => close(selected.id)} style={{
                  padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#f87171',
                }}>
                  Close
                </button>
              </div>
            </>
          )}

          {selected.status !== 'open' && (
            <div style={{
              padding: '10px 14px', borderRadius: 10, textAlign: 'center', fontSize: 13, fontWeight: 700,
              background: 'rgba(74,222,128,.1)', border: '1px solid rgba(74,222,128,.2)', color: '#4ade80',
            }}>
              Ticket {selected.status}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
