import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inp = { width: '100%', padding: '10px 12px', background: '#0F2318', border: '1px solid #1C2E24', color: '#C8BFB0', fontSize: 12, fontFamily: 'IBM Plex Mono', outline: 'none', letterSpacing: '0.03em' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--sidebar)' }}>
      <div style={{ width: 380, borderRight: '1px solid #1C2E24', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 60 }}>
            <img src="/src/assets/favicon.ico" alt="logo" style={{ width: 26, height: 26, objectFit: 'contain' }} />
            <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 600, fontSize: 12, color: '#E8DFD0', letterSpacing: '0.06em' }}>Team Task Manager</span>
          </div>
          <h1 style={{ fontFamily: 'Times New Roman', fontSize: 48, color: '#E8DFD0', fontWeight: 400, lineHeight: 1.1, marginBottom: 14 }}>
            Welcome<br /><em style={{ color: 'var(--copper)', fontStyle: 'italic' }}>back.</em>
          </h1>
          <p style={{ fontSize: 12, color: '#4A6B58', lineHeight: 1.8, marginBottom: 0 }}>Sign in to your workspace and continue where you left off.</p>
        </div>
        <div style={{ borderTop: '1px solid #1C2E24', paddingTop: 24 }}>
          {['Projects', 'Tasks', 'Teams', 'Analytics'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.08em' }}>0{i + 1}</span>
              <span style={{ fontSize: 11, color: '#2A4A38', letterSpacing: '0.04em' }}>{s.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <p style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 28 }}>— Account Sign In</p>
          {error && <div style={{ border: '1px solid #3D1810', background: '#1A0A06', color: '#E8856B', padding: '10px 12px', fontSize: 11, marginBottom: 20, letterSpacing: '0.03em' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 10, color: '#4A6B58', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required style={inp}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#1C2E24'; }} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 10, color: '#4A6B58', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required style={inp}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#1C2E24'; }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', background: loading ? '#6B3318' : 'var(--accent)', border: 'none', color: '#fff', fontSize: 11, fontWeight: 600, fontFamily: 'IBM Plex Mono', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.08em' }}>
              {loading ? 'SIGNING IN...' : 'SIGN IN →'}
            </button>
          </form>
          <p style={{ fontSize: 11, color: '#2A4A38', marginTop: 20, letterSpacing: '0.03em' }}>
            No account?{' '}
            <Link to="/signup" style={{ color: 'var(--copper)', textDecoration: 'none', fontWeight: 600 }}>Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}