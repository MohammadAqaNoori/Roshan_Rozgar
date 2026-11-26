import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { Icon } from '../../lib/icons';

// Demo user data — in production fetched via admin API
const DEMO_USERS = [
  { id: 1,  phone: '+93700100100', name: 'Mariam Noori',  role: 'customer', active: true,  joined: '2026-11-23' },
  { id: 2,  phone: '+93700111001', name: 'Ahmad Shah',    role: 'worker',   active: true,  joined: '2026-11-23' },
  { id: 3,  phone: '+93700111002', name: 'Abdul Karim',   role: 'worker',   active: true,  joined: '2026-11-23' },
  { id: 4,  phone: '+93700111003', name: 'Nasir Ahmad',   role: 'worker',   active: true,  joined: '2026-11-23' },
  { id: 5,  phone: '+93700111004', name: 'Habibullah',    role: 'worker',   active: true,  joined: '2026-11-23' },
  { id: 6,  phone: '+93700111005', name: 'Wahidullah',    role: 'worker',   active: true,  joined: '2026-11-23' },
  { id: 7,  phone: '+93700111006', name: 'Zarif Khan',    role: 'worker',   active: false, joined: '2026-11-23' },
  { id: 8,  phone: '+93700111007', name: 'Omar Farooq',   role: 'worker',   active: true,  joined: '2026-11-23' },
  { id: 9,  phone: '+93700111008', name: 'Yusuf Rahimi',  role: 'worker',   active: true,  joined: '2026-11-23' },
];

export default function UsersSection() {
  const { showToast } = useAdmin();
  const [q, setQ] = useState('');
  const [users, setUsers] = useState(DEMO_USERS);
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter(u => {
    const matchQ = !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.phone.includes(q);
    const matchR = roleFilter === 'all' || u.role === roleFilter;
    return matchQ && matchR;
  });

  const toggleActive = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
    const user = users.find(u => u.id === id);
    showToast(`${user.name} ${user.active ? 'deactivated' : 'activated'}`, !user.active);
  };

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
          borderRadius: 10, padding: '8px 14px', flex: 1, minWidth: 220,
        }}>
          <Icon name="search" style={{ width: 16, height: 16, color: '#8BAFA0' }} />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search by name or phone…"
            style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14, width: '100%' }}
          />
        </div>
        {['all', 'customer', 'worker'].map(r => (
          <button key={r} onClick={() => setRoleFilter(r)} style={{
            padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            background: roleFilter === r ? '#006400' : 'rgba(255,255,255,.06)',
            border: roleFilter === r ? '1px solid #4ade80' : '1px solid rgba(255,255,255,.1)',
            color: roleFilter === r ? '#fff' : '#8BAFA0',
          }}>
            {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1) + 's'}
          </button>
        ))}
      </div>

      {/* Count */}
      <p style={{ color: '#8BAFA0', fontSize: 13, marginBottom: 12 }}>
        {filtered.length} user{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 160px 100px 100px 110px',
          padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,.08)',
          color: '#8BAFA0', fontSize: 12, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase',
        }}>
          <span>Name / Phone</span>
          <span>Role</span>
          <span>Joined</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {filtered.map((u, i) => (
          <div key={u.id} style={{
            display: 'grid', gridTemplateColumns: '1fr 160px 100px 100px 110px',
            padding: '14px 20px', alignItems: 'center',
            borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none',
            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.02)',
          }}>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{u.name}</div>
              <div style={{ color: '#8BAFA0', fontSize: 12, marginTop: 2 }}>{u.phone}</div>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700,
              background: u.role === 'worker' ? 'rgba(251,191,36,.15)' : 'rgba(96,165,250,.15)',
              color: u.role === 'worker' ? '#fbbf24' : '#60a5fa',
            }}>
              <Icon name={u.role === 'worker' ? 'wrench' : 'home'} style={{ width: 11, height: 11 }} />
              {u.role}
            </span>
            <span style={{ color: '#8BAFA0', fontSize: 13 }}>{u.joined}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 12, fontWeight: 700,
              color: u.active ? '#4ade80' : '#f87171',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: u.active ? '#4ade80' : '#f87171' }} />
              {u.active ? 'Active' : 'Inactive'}
            </span>
            <button onClick={() => toggleActive(u.id)} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              background: u.active ? 'rgba(239,68,68,.15)' : 'rgba(74,222,128,.15)',
              border: u.active ? '1px solid rgba(239,68,68,.3)' : '1px solid rgba(74,222,128,.3)',
              color: u.active ? '#f87171' : '#4ade80',
            }}>
              {u.active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}

        {!filtered.length && (
          <div style={{ padding: 40, textAlign: 'center', color: '#8BAFA0' }}>
            No users match your search.
          </div>
        )}
      </div>
    </div>
  );
}
