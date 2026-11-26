import { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import { Icon } from '../../lib/icons';
import { api } from '../../api/client';

const JOB_STATUS_COLORS = {
  requested:   '#60a5fa',
  negotiated:  '#a78bfa',
  confirmed:   '#34d399',
  in_progress: '#fbbf24',
  completed:   '#4ade80',
  cancelled:   '#f87171',
};

export default function JobsSection() {
  const { showToast } = useAdmin();
  const [jobs, setJobs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Try to fetch jobs from API; fall back to demo data
    api.get('/jobs/').then(r => {
      setJobs(r.data || []);
    }).catch(() => {
      // Demo fallback
      setJobs([
        { id: 1, title: 'Leaking pipe under kitchen sink', status: 'completed', trade_required: 'plumber',    area_name: 'Shahr-e-Naw, Kabul', agreed_price: 300, created_at: '2026-11-14T08:00:00' },
        { id: 2, title: 'House wiring fault',              status: 'completed', trade_required: 'electrician',area_name: 'Macroyan, Kabul',    agreed_price: 300, created_at: '2026-11-14T10:00:00' },
        { id: 3, title: 'AC service not cooling',          status: 'completed', trade_required: 'ac_technician',area_name:'Macroyan, Kabul',   agreed_price: 300, created_at: '2026-11-14T12:00:00' },
        { id: 4, title: 'Door hinge broken',               status: 'completed', trade_required: 'carpenter',  area_name: 'Khair Khana, Kabul', agreed_price: 300, created_at: '2026-11-14T14:00:00' },
        { id: 5, title: 'Bathroom floor tiling',           status: 'completed', trade_required: 'mason',      area_name: 'Herat City, Herat',  agreed_price: 300, created_at: '2026-11-14T16:00:00' },
      ]);
    }).finally(() => setLoading(false));
  }, []);

  const statuses = ['all', 'requested', 'negotiated', 'confirmed', 'in_progress', 'completed', 'cancelled'];
  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

  const cancelJob = (id) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'cancelled' } : j));
    showToast('Job cancelled', true);
  };

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            background: filter === s ? '#006400' : 'rgba(255,255,255,.06)',
            border: filter === s ? '1px solid #4ade80' : '1px solid rgba(255,255,255,.1)',
            color: filter === s ? '#fff' : '#8BAFA0',
            textTransform: 'capitalize',
          }}>
            {s === 'all' ? `All (${jobs.length})` : `${s.replace('_', ' ')} (${jobs.filter(j => j.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#8BAFA0', padding: 60 }}>Loading jobs…</div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)' }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '50px 1fr 130px 120px 100px 110px',
            padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,.08)',
            color: '#8BAFA0', fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase',
          }}>
            <span>ID</span><span>Title / Area</span><span>Trade</span><span>Status</span><span>Price</span><span>Action</span>
          </div>

          {filtered.map((j, i) => {
            const sc = JOB_STATUS_COLORS[j.status] || '#8BAFA0';
            return (
              <div key={j.id} style={{
                display: 'grid', gridTemplateColumns: '50px 1fr 130px 120px 100px 110px',
                padding: '14px 20px', alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.02)',
              }}>
                <span style={{ color: '#8BAFA0', fontSize: 13 }}>#{j.id}</span>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{j.title}</div>
                  <div style={{ color: '#8BAFA0', fontSize: 11, marginTop: 2 }}>{j.area_name}</div>
                </div>
                <span style={{ color: '#8BAFA0', fontSize: 12, textTransform: 'capitalize' }}>
                  {j.trade_required?.replace('_', ' ')}
                </span>
                <span style={{
                  display: 'inline-flex', padding: '4px 10px', borderRadius: 99,
                  fontSize: 11, fontWeight: 700, background: `${sc}18`, color: sc,
                  textTransform: 'capitalize',
                }}>
                  {j.status?.replace('_', ' ')}
                </span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>
                  {j.agreed_price ? `؋ ${j.agreed_price}` : '—'}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {j.status !== 'cancelled' && j.status !== 'completed' && (
                    <button onClick={() => cancelJob(j.id)} style={{
                      padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#f87171',
                    }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {!filtered.length && (
            <div style={{ padding: 40, textAlign: 'center', color: '#8BAFA0' }}>No jobs found.</div>
          )}
        </div>
      )}
    </div>
  );
}
