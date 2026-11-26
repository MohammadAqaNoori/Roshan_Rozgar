/**
 * AdminDash — the main admin portal shell with sidebar navigation.
 * Sections: Dashboard, Users, Workers, Jobs, Analytics, Support
 */
import { useState } from 'react';
import { AdminProvider, useAdmin } from './AdminContext';
import { Icon } from '../lib/icons';
import DashboardSection  from './sections/DashboardSection';
import UsersSection      from './sections/UsersSection';
import WorkersSection    from './sections/WorkersSection';
import JobsSection       from './sections/JobsSection';
import AnalyticsSection  from './sections/AnalyticsSection';
import SupportSection    from './sections/SupportSection';

const NAV = [
  { id: 'dashboard',  icon: 'home',      label: 'Dashboard'  },
  { id: 'users',      icon: 'users',     label: 'Users'      },
  { id: 'workers',    icon: 'briefcase', icon2: 'wrench', label: 'Workers' },
  { id: 'jobs',       icon: 'calendar',  label: 'Jobs'       },
  { id: 'analytics',  icon: 'sliders',   label: 'Analytics'  },
  { id: 'support',    icon: 'msg',       label: 'Support'    },
];

function AdminShell({ onLogout }) {
  const { section, setSection, toast } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderSection = () => {
    switch (section) {
      case 'dashboard':  return <DashboardSection />;
      case 'users':      return <UsersSection />;
      case 'workers':    return <WorkersSection />;
      case 'jobs':       return <JobsSection />;
      case 'analytics':  return <AnalyticsSection />;
      case 'support':    return <SupportSection />;
      default:           return <DashboardSection />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d1f10', color: '#E3F2EC' }}>

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside style={{
        width: sidebarOpen ? 220 : 64, flexShrink: 0, transition: 'width .2s',
        background: '#0a1a0f', borderRight: '1px solid rgba(255,255,255,.08)',
        display: 'flex', flexDirection: 'column', padding: '16px 0',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0 16px 20px', borderBottom: '1px solid rgba(255,255,255,.08)',
          marginBottom: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: '#006400',
            display: 'grid', placeItems: 'center', flexShrink: 0,
            color: '#fff', fontWeight: 800, fontSize: 16,
          }}>K</div>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', whiteSpace: 'nowrap' }}>Karigar</div>
              <div style={{ fontSize: 11, color: '#5E9A70', whiteSpace: 'nowrap' }}>Admin Portal</div>
            </div>
          )}
        </div>

        {/* Nav items */}
        {NAV.map(({ id, icon, label }) => {
          const active = section === id;
          return (
            <button
              key={id}
              onClick={() => setSection(id)}
              title={label}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 16px', margin: '1px 8px', borderRadius: 10,
                background: active ? 'rgba(0,100,0,.4)' : 'transparent',
                border: active ? '1px solid rgba(0,200,0,.2)' : '1px solid transparent',
                color: active ? '#6EE89A' : '#8BAFA0',
                cursor: 'pointer', textAlign: 'start', transition: 'all .15s',
                fontSize: 14, fontWeight: active ? 700 : 500,
              }}
            >
              <Icon name={icon} style={{ width: 18, height: 18, flexShrink: 0 }} />
              {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
            </button>
          );
        })}

        {/* Bottom: toggle + logout */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,.08)', padding: '12px 8px 0' }}>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            title="Toggle sidebar"
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px',
              width: '100%', background: 'transparent', border: 'none', borderRadius: 10,
              color: '#8BAFA0', cursor: 'pointer', fontSize: 13,
            }}
          >
            <Icon name={sidebarOpen ? 'chevL' : 'chevR'} style={{ width: 18, height: 18 }} />
            {sidebarOpen && 'Collapse'}
          </button>
          <button
            onClick={onLogout}
            title="Logout"
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px',
              width: '100%', background: 'transparent', border: 'none', borderRadius: 10,
              color: '#D94848', cursor: 'pointer', fontSize: 13,
            }}
          >
            <Icon name="logout" style={{ width: 18, height: 18 }} />
            {sidebarOpen && 'Log out'}
          </button>
        </div>
      </aside>

      {/* ── Main area ─────────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header style={{
          padding: '14px 24px', background: '#0a1a0f',
          borderBottom: '1px solid rgba(255,255,255,.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>
            {NAV.find(n => n.id === section)?.label}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              background: '#006400', color: '#6EE89A', borderRadius: 99,
              padding: '4px 12px', fontSize: 12, fontWeight: 700,
            }}>
              ● LIVE
            </span>
            <span style={{ color: '#8BAFA0', fontSize: 13 }}>Karigar Admin · Noori</span>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: 24, maxWidth: 1200 }}>
          {renderSection()}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: toast.ok ? '#1A3D22' : '#3D1A1A',
          border: `1px solid ${toast.ok ? '#4ade80' : '#f87171'}`,
          color: '#fff', borderRadius: 12, padding: '12px 20px',
          fontSize: 14, boxShadow: '0 8px 32px rgba(0,0,0,.4)',
          display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <Icon name={toast.ok ? 'checkCircle' : 'alert'} style={{ width: 18, height: 18 }} />
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default function AdminDash({ onLogout }) {
  return (
    <AdminProvider onLogout={onLogout}>
      <AdminShell onLogout={onLogout} />
    </AdminProvider>
  );
}
