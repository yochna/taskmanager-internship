import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../services/api';

export default function AdminPanel({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await getUsers();
      setUsers(data.data);
    } catch { setError('Failed to load users.'); }
    finally { setLoading(false); }
  };

  const notify = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(''); }
    else { setSuccess(msg); setError(''); }
    setTimeout(() => { setError(''); setSuccess(''); }, 3000);
  };

  const handleDelete = async (id) => {
    if (id === user.id) return notify('Cannot delete yourself.', true);
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      notify('User deleted.');
      fetchUsers();
    } catch { notify('Delete failed.', true); }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <span style={styles.navTitle}>🛡️ Admin Panel</span>
        <div style={styles.navRight}>
          <Link to="/dashboard" style={styles.backLink}>← Dashboard</Link>
          <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.main}>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>👥 All Users ({users.length})</h3>
          {loading ? <p>Loading users...</p> : users.length === 0 ? <p>No users found.</p> :
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Joined', 'Action'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={styles.tr}>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: u.role === 'admin' ? '#6366f1' : '#10b981' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(u._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f3f4f6' },
  nav: { background: '#4f46e5', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navTitle: { fontSize: '1.3rem', fontWeight: '700' },
  navRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  backLink: { color: '#c7d2fe', textDecoration: 'none', fontWeight: '600' },
  logoutBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' },
  main: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  card: { background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardTitle: { marginBottom: '1rem', color: '#374151' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem', background: '#f9fafb', borderBottom: '2px solid #e5e7eb', color: '#6b7280', fontSize: '0.85rem', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '0.85rem 0.75rem', color: '#374151', fontSize: '0.9rem' },
  badge: { color: '#fff', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: '600' },
  deleteBtn: { padding: '0.3rem 0.7rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  error: { background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' },
  success: { background: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' },
};
