import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, CheckCircle, Circle, Clock, Layout, LogOut, Shield, ClipboardList } from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await getTasks();
      setTasks(data.data);
    } catch { setError('Failed to load tasks.'); }
    finally { setLoading(false); }
  };

  const notify = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(''); }
    else { setSuccess(msg); setError(''); }
    setTimeout(() => { setError(''); setSuccess(''); }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateTask(editId, form);
        notify('Task updated!');
        setEditId(null);
      } else {
        await createTask(form);
        notify('Task created!');
      }
      setForm({ title: '', description: '', priority: 'medium' });
      fetchTasks();
    } catch (err) { notify(err.response?.data?.message || 'Operation failed.', true); }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setForm({ title: task.title, description: task.description, priority: task.priority });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      notify('Task deleted!');
      fetchTasks();
    } catch { notify('Delete failed.', true); }
  };

  const handleStatus = async (task) => {
    const next = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
    try {
      await updateTask(task._id, { status: next[task.status] });
      fetchTasks();
    } catch { notify('Update failed.', true); }
  };

  const statusColor = { pending: '#f59e0b', 'in-progress': '#3b82f6', completed: '#10b981' };
  const priorityColor = { low: '#6b7280', medium: '#f59e0b', high: '#ef4444' };

  const StatusIcon = ({ status }) => {
    if (status === 'completed') return <CheckCircle size={14} color="#fff" />;
    if (status === 'in-progress') return <Clock size={14} color="#fff" />;
    return <Circle size={14} color="#fff" />;
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <Layout size={22} color="#fff" style={{ marginRight: '8px' }} />
          <span style={styles.navTitle}>TaskManager</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hi, {user.name} ({user.role})</span>
          {user.role === 'admin' && (
            <Link to="/admin" style={styles.adminLink}>
              <Shield size={14} style={{ marginRight: '4px' }} />
              Admin Panel
            </Link>
          )}
          <button onClick={onLogout} style={styles.logoutBtn}>
            <LogOut size={14} style={{ marginRight: '4px' }} />
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.main}>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {/* Task Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            {editId
              ? <><Edit2 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Edit Task</>
              : <><Plus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />New Task</>
            }
          </h3>
          <form onSubmit={handleSubmit}>
            <input style={styles.input} placeholder="Task title *" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />
            <textarea style={{ ...styles.input, height: '80px', resize: 'vertical' }}
              placeholder="Description (optional)" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
            <select style={styles.input} value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={styles.btn} type="submit">
                {editId
                  ? <><Edit2 size={14} style={{ marginRight: '6px' }} />Update</>
                  : <><Plus size={14} style={{ marginRight: '6px' }} />Add Task</>
                }
              </button>
              {editId && (
                <button style={styles.cancelBtn} type="button"
                  onClick={() => { setEditId(null); setForm({ title: '', description: '', priority: 'medium' }); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Task List */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <ClipboardList size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            My Tasks ({tasks.length})
          </h3>
          {loading ? <p>Loading tasks...</p> : tasks.length === 0
            ? <p style={styles.empty}>No tasks yet. Create one above!</p>
            : tasks.map(task => (
              <div key={task._id} style={styles.taskItem}>
                <div style={styles.taskTop}>
                  <strong style={styles.taskTitle}>{task.title}</strong>
                  <div style={styles.badges}>
                    <span style={{ ...styles.badge, background: priorityColor[task.priority] }}>
                      {task.priority}
                    </span>
                    <span style={{ ...styles.badge, background: statusColor[task.status], cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => handleStatus(task)} title="Click to change status">
                      <StatusIcon status={task.status} />
                      {task.status}
                    </span>
                  </div>
                </div>
                {task.description && <p style={styles.taskDesc}>{task.description}</p>}
                <div style={styles.taskActions}>
                  <button style={styles.editBtn} onClick={() => handleEdit(task)}>
                    <Edit2 size={13} style={{ marginRight: '4px' }} />Edit
                  </button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(task._id)}>
                    <Trash2 size={13} style={{ marginRight: '4px' }} />Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f3f4f6' },
  nav: { background: '#6366f1', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navLeft: { display: 'flex', alignItems: 'center' },
  navTitle: { fontSize: '1.3rem', fontWeight: '700' },
  navRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  welcome: { fontSize: '0.9rem', opacity: 0.9 },
  adminLink: { color: '#fde68a', fontWeight: '600', textDecoration: 'none', background: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center' },
  logoutBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  main: { maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' },
  card: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardTitle: { marginBottom: '1rem', color: '#374151', display: 'flex', alignItems: 'center' },
  input: { width: '100%', padding: '0.75rem', marginBottom: '0.75rem', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' },
  btn: { padding: '0.75rem 1.5rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center' },
  cancelBtn: { padding: '0.75rem 1.5rem', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  error: { background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' },
  success: { background: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' },
  taskItem: { border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' },
  taskTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' },
  taskTitle: { color: '#1f2937', fontSize: '1rem' },
  badges: { display: 'flex', gap: '0.4rem' },
  badge: { color: '#fff', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: '600', textTransform: 'capitalize' },
  taskDesc: { color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0.75rem' },
  taskActions: { display: 'flex', gap: '0.5rem' },
  editBtn: { padding: '0.35rem 0.75rem', background: '#ede9fe', color: '#6366f1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center' },
  deleteBtn: { padding: '0.35rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center' },
  empty: { color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }
};
