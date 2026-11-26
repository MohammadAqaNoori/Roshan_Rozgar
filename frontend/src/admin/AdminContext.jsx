/**
 * AdminContext — state and API calls for the admin portal.
 * Loaded only when the admin is logged in. Completely separate from AppContext.
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../api/client';

// Fixed admin credentials (server-side would validate properly in production)
export const ADMIN_PHONE    = '+93766827561';
export const ADMIN_USERNAME = 'Noori@2026';

const AdminCtx = createContext(null);

export function AdminProvider({ children, onLogout }) {
  const [section, setSection] = useState('dashboard'); // dashboard|users|workers|jobs|analytics|support
  const [users,   setUsers]   = useState([]);
  const [workers, setWorkers] = useState([]);
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState(null);

  const showToast = useCallback((msg, ok = false) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Load data from backend ──────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all workers (includes user info) as a proxy for all registered users
      const r = await api.get('/workers/nearby', {
        params: { lat: 34.526, lng: 69.178, radius_km: 10000, available_only: false },
      });
      setWorkers(r.data || []);
    } catch {}
    // Try to get users by logging known phone patterns (graceful if no admin API)
    setLoading(false);
  }, []);

  const updateWorkerStatus = useCallback(async (workerId, status) => {
    try {
      // In production this would be PUT /admin/workers/:id/status
      // For now we show the action but can't modify via API without admin role
      showToast(`Worker status update: ${status} (requires admin API endpoint)`, false);
    } catch (e) {
      showToast('Failed to update status', false);
    }
  }, [showToast]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const value = {
    section, setSection,
    users, workers, jobs,
    loading, toast, showToast,
    loadUsers,
    updateWorkerStatus,
    onLogout,
  };

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminCtx);
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
  return ctx;
}
