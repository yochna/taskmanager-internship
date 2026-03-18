import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, LogIn, Layout } from 'lucide-react';
import { loginUser } from '../services/api';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await loginUser(form);
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <Layout size={36} color="#6366f1" />
        </div>
        <h1 style={styles.title}>TaskManager</h1>
        <h2 style={styles.subtitle}>Sign In</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputWrap}>
            <Mail size={16} color="#9ca3af" style={styles.inputIcon} />
            <input style={styles.input} type="email" placeholder="Email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={styles.inputWrap}>
            <Lock size={16} color="#9ca3af" style={styles.inputIcon} />
            <input style={styles.input} type="password" placeholder="Password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            <LogIn size={16} style={{ marginRight: '8px' }} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.link}>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  card: { background: '#fff', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  logoWrap: { display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' },
  title: { textAlign: 'center', color: '#6366f1', marginBottom: '0.25rem' },
  subtitle: { textAlign: 'center', color: '#374151', marginBottom: '1.5rem' },
  error: { background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  inputWrap: { position: 'relative', marginBottom: '1rem' },
  inputIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' },
  input: { width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '0.85rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  link: { textAlign: 'center', marginTop: '1rem', color: '#6b7280' }
};
