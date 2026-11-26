import { useAdmin } from '../AdminContext';
import { Icon } from '../../lib/icons';

const stat = (label, value, icon, color) => ({ label, value, icon, color });

export default function DashboardSection() {
  const { workers } = useAdmin();

  const available = workers.filter(w => w.status === 'available').length;
  const busy      = workers.filter(w => w.status === 'busy').length;
  const offline   = workers.filter(w => w.status === 'offline').length;

  const stats = [
    stat('Total Workers',      workers.length,     'briefcase', '#4ade80'),
    stat('Available Now',      available,           'checkCircle','#34d399'),
    stat('On a Job (Busy)',    busy,                'clock',      '#fbbf24'),
    stat('Offline',            offline,             'moon',       '#94a3b8'),
    stat('Total Users',        workers.length + 1,  'users',      '#60a5fa'),
    stat('Jobs (this month)',  5,                   'calendar',   '#a78bfa'),
  ];

  return (
    <div>
      <p style={{ color: '#8BAFA0', marginBottom: 20, fontSize: 14 }}>
        Live overview of the Karigar platform.
      </p>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
            borderRadius: 16, padding: '20px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${color}18`, display: 'grid', placeItems: 'center',
              }}>
                <Icon name={icon} style={{ width: 16, height: 16, color }} />
              </div>
              <span style={{ fontSize: 12, color: '#8BAFA0', fontWeight: 600 }}>{label}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{
        background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 16, padding: 20,
      }}>
        <h3 style={{ color: '#fff', fontSize: 16, marginBottom: 16 }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            ['Add Seed Worker',  'plus',     '#006400'],
            ['Export Users CSV', 'upload',   '#3B82F6'],
            ['View API Docs',    'globe',    '#8B5CF6'],
            ['Restart Server',   'refresh',  '#EF4444'],
          ].map(([label, icon, bg]) => (
            <button key={label} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', background: `${bg}22`,
              border: `1px solid ${bg}44`, borderRadius: 10,
              color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
              <Icon name={icon} style={{ width: 15, height: 15, color: bg }} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
