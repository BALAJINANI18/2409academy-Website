import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, GraduationCap, LogOut, RefreshCw, Search, ShieldCheck, Trash2, Users } from 'lucide-react';
import logo from './assets/logo.png';
import './admin.css';

const API = import.meta.env.VITE_API_BASE_URL || '';
const readToken = () => { try { return localStorage.getItem('2409-academy-token'); } catch { return null; } };
const clearSession = () => { try { localStorage.removeItem('2409-academy-token'); localStorage.removeItem('2409-academy-user'); } catch {} };

async function api(path, options = {}) {
  const token = readToken();
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || (response.status >= 500 ? 'The server is not available right now.' : 'Request failed.'));
    error.status = response.status;
    throw error;
  }
  return data;
}

const formatDate = value => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

function Gate({ title, text, children }) {
  return <div className="admin-gate"><ShieldCheck size={34}/><h1>{title}</h1><p>{text}</p><div className="admin-gate-actions">{children}</div></div>;
}

export default function Admin() {
  const [phase, setPhase] = useState('loading');
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState({ totalUsers: 0, students: 0, admins: 0 });
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [errorText, setErrorText] = useState('');
  const [toast, setToast] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const flash = (kind, text) => { setToast({ kind, text }); setTimeout(() => setToast(null), 3500); };

  const load = useCallback(async () => {
    if (!readToken()) { setPhase('login'); return; }
    try {
      const profile = await api('/api/me');
      setMe(profile);
      try { localStorage.setItem('2409-academy-user', JSON.stringify(profile)); } catch {}
      if (profile.role !== 'ADMIN') { setPhase('denied'); return; }
      const [s, list] = await Promise.all([api('/api/admin/stats'), api('/api/admin/users')]);
      setStats(s); setUsers(list); setPhase('ready');
    } catch (error) {
      if (error.status === 401) { clearSession(); setPhase('login'); }
      else if (error.status === 403) setPhase('denied');
      else { setErrorText(error instanceof TypeError ? 'Could not reach the server. Make sure the backend is running on port 8080.' : error.message); setPhase('error'); }
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(u => (roleFilter === 'ALL' || u.role === roleFilter) && (!q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
  }, [users, query, roleFilter]);

  const changeRole = async (user, role) => {
    setBusyId(user.userId);
    try {
      await api(`/api/admin/users/${user.userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
      await load();
      flash('ok', `${user.fullName} is now ${role === 'ADMIN' ? 'an admin' : 'a student'}.`);
    } catch (error) { flash('err', error.message); } finally { setBusyId(null); }
  };

  const removeUser = async user => {
    if (!window.confirm(`Delete ${user.fullName} (${user.email})? This cannot be undone.`)) return;
    setBusyId(user.userId);
    try {
      await api(`/api/admin/users/${user.userId}`, { method: 'DELETE' });
      await load();
      flash('ok', `${user.fullName} was deleted.`);
    } catch (error) { flash('err', error.message); } finally { setBusyId(null); }
  };

  const logout = () => { clearSession(); window.location.href = '/'; };

  const bar = <header className="admin-bar">
    <a className="admin-brand" href="/"><img src={logo} alt="2409 Academy"/><span><b>2409 <em>ACADEMY</em></b><small>ADMIN PANEL</small></span></a>
    <div className="admin-bar-right">
      {me && <span className="admin-me" title={me.email}>{me.fullName}</span>}
      <a className="admin-link" href="/"><ArrowLeft size={15}/> Back to site</a>
      {me && <button className="admin-link" onClick={logout}><LogOut size={15}/> Log out</button>}
    </div>
  </header>;

  if (phase === 'loading') return <div className="admin-page">{bar}<div className="admin-gate"><p>Loading…</p></div></div>;
  if (phase === 'login') return <div className="admin-page">{bar}<Gate title="Please log in" text="Log in with an admin account from the home page, then come back to this page."><a className="admin-btn" href="/">Go to home page</a></Gate></div>;
  if (phase === 'denied') return <div className="admin-page">{bar}<Gate title="Admins only" text="Your account does not have admin access. Ask the site owner to grant you the ADMIN role."><a className="admin-btn" href="/">Back to site</a></Gate></div>;
  if (phase === 'error') return <div className="admin-page">{bar}<Gate title="Can’t load the admin panel" text={errorText}><button className="admin-btn" onClick={() => { setPhase('loading'); load(); }}>Try again</button></Gate></div>;

  return <div className="admin-page">
    {bar}
    <main className="admin-main">
      <div className="admin-title"><div><div className="admin-eyebrow">DASHBOARD</div><h1>Manage students</h1></div>
        <button className="admin-btn ghost" onClick={() => load()}><RefreshCw size={15}/> Refresh</button></div>

      <section className="admin-stats" aria-label="Summary">
        <div className="admin-stat"><Users size={20}/><span>Total users</span><strong>{stats.totalUsers}</strong></div>
        <div className="admin-stat"><GraduationCap size={20}/><span>Students</span><strong>{stats.students}</strong></div>
        <div className="admin-stat"><ShieldCheck size={20}/><span>Admins</span><strong>{stats.admins}</strong></div>
      </section>

      <section className="admin-panel">
        <div className="admin-tools">
          <label className="admin-search"><Search size={16}/><input type="search" placeholder="Search by name or email" value={query} onChange={e => setQuery(e.target.value)}/></label>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} aria-label="Filter by role">
            <option value="ALL">All roles</option><option value="STUDENT">Students</option><option value="ADMIN">Admins</option>
          </select>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {visible.map(u => {
                const isMe = me && u.email.toLowerCase() === me.email.toLowerCase();
                return <tr key={u.userId}>
                  <td data-label="ID">{u.userId}</td>
                  <td data-label="Name">{u.fullName}{isMe && <span className="admin-you">You</span>}</td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Role"><span className={`admin-badge ${u.role === 'ADMIN' ? 'admin' : ''}`}>{u.role}</span></td>
                  <td data-label="Joined">{formatDate(u.createdAt)}</td>
                  <td data-label="Actions">{isMe ? <span className="admin-muted">—</span> : <div className="admin-actions">
                    <button disabled={busyId === u.userId} onClick={() => changeRole(u, u.role === 'ADMIN' ? 'STUDENT' : 'ADMIN')}>{u.role === 'ADMIN' ? 'Make student' : 'Make admin'}</button>
                    <button className="danger" disabled={busyId === u.userId} onClick={() => removeUser(u)} aria-label={`Delete ${u.fullName}`}><Trash2 size={14}/> Delete</button>
                  </div>}</td>
                </tr>;
              })}
              {visible.length === 0 && <tr><td className="admin-empty" colSpan="6">{users.length === 0 ? 'No users yet.' : 'No users match your search.'}</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="admin-count">Showing {visible.length} of {users.length} users</div>
      </section>
    </main>
    {toast && <div className={`admin-toast ${toast.kind}`} role="status">{toast.text}</div>}
  </div>;
}
