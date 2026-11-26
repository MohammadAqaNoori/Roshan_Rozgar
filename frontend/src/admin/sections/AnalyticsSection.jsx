import { useAdmin } from '../AdminContext';

function Bar({ label, value, max, color }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: '#E3F2EC' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{value}</span>
      </div>
      <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width .5s' }} />
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
      borderRadius: 16, padding: '20px 18px',
    }}>
      <div style={{ fontSize: 12, color: '#8BAFA0', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 10 }}>{title}</div>
      <div style={{ fontSize: 36, fontWeight: 800, color: color || '#fff' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#8BAFA0', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default function AnalyticsSection() {
  const { workers } = useAdmin();

  // Trade distribution
  const tradeCount = workers.reduce((acc, w) => {
    const t = w.trade || 'unknown';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const maxTrade = Math.max(...Object.values(tradeCount), 1);

  // City distribution
  const cityCount = workers.reduce((acc, w) => {
    const city = (w.area_name || '').split(',').slice(-1)[0].trim() || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});
  const maxCity = Math.max(...Object.values(cityCount), 1);

  const avgRating = workers.length
    ? (workers.reduce((s, w) => s + (w.rating_avg || 0), 0) / workers.length).toFixed(2)
    : '—';

  const totalJobs = workers.reduce((s, w) => s + (w.total_jobs || 0), 0);

  const TRADE_COLORS = {
    plumber: '#60a5fa', electrician: '#fbbf24', ac_technician: '#34d399',
    carpenter: '#a78bfa', mason: '#f97316', painter: '#ec4899',
    mechanic: '#94a3b8', appliance: '#06b6d4', tailor: '#d946ef',
  };

  return (
    <div>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard title="Total Workers"     value={workers.length}  sub="registered on platform"    color="#4ade80" />
        <StatCard title="Total Jobs Done"   value={totalJobs}        sub="across all workers"        color="#fbbf24" />
        <StatCard title="Avg Worker Rating" value={avgRating}        sub="out of 5.0"                color="#f97316" />
        <StatCard title="Cities Active"     value={Object.keys(cityCount).length} sub="Kabul, Herat, Mazar…" color="#60a5fa" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Workers by trade */}
        <div style={{
          background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 16, padding: 20,
        }}>
          <h3 style={{ color: '#fff', fontSize: 15, marginBottom: 20 }}>Workers by Trade</h3>
          {Object.entries(tradeCount)
            .sort((a, b) => b[1] - a[1])
            .map(([trade, count]) => (
              <Bar
                key={trade}
                label={trade.replace('_', ' ')}
                value={count}
                max={maxTrade}
                color={TRADE_COLORS[trade] || '#8BAFA0'}
              />
            ))}
        </div>

        {/* Workers by city */}
        <div style={{
          background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 16, padding: 20,
        }}>
          <h3 style={{ color: '#fff', fontSize: 15, marginBottom: 20 }}>Workers by City</h3>
          {Object.entries(cityCount)
            .sort((a, b) => b[1] - a[1])
            .map(([city, count], i) => (
              <Bar
                key={city}
                label={city}
                value={count}
                max={maxCity}
                color={['#60a5fa', '#34d399', '#fbbf24', '#f97316'][i % 4]}
              />
            ))}
        </div>
      </div>

      {/* Rating leaderboard */}
      <div style={{
        background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 16, padding: 20, marginTop: 20,
      }}>
        <h3 style={{ color: '#fff', fontSize: 15, marginBottom: 16 }}>Top Rated Workers</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {[...workers]
            .sort((a, b) => (b.rating_avg || 0) - (a.rating_avg || 0))
            .slice(0, 6)
            .map(w => (
              <div key={w.id} style={{
                background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)',
                borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: '#006400',
                  display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: 16, flexShrink: 0,
                }}>
                  {(w.user_name || 'W')[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{w.user_name || `Worker #${w.id}`}</div>
                  <div style={{ color: '#fbbf24', fontSize: 12, fontWeight: 700 }}>
                    ⭐ {w.rating_avg?.toFixed(1)} · {w.total_reviews} reviews
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
