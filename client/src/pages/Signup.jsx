import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      if (data.message && !data.token) { setPending(true); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inp = { width: '100%', padding: '10px 12px', background: '#0F2318', border: '1px solid #1C2E24', color: '#C8BFB0', fontSize: 12, fontFamily: 'IBM Plex Mono', outline: 'none', letterSpacing: '0.03em' };
  const lbl = { display: 'block', fontSize: 10, color: '#4A6B58', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 };

  if (pending) return (
    <div style={{ minHeight: '100vh', background: 'var(--sidebar)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 400, textAlign: 'center', padding: 40 }}>
        <div style={{ width: 48, height: 48, border: '1px solid #1C2E24', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 20, color: 'var(--copper)' }}>◎</div>
        <h2 style={{ fontFamily: 'Times New Roman', fontSize: 32, color: '#E8DFD0', fontWeight: 400, marginBottom: 14 }}>Request Submitted</h2>
        <p style={{ fontSize: 12, color: '#4A6B58', lineHeight: 1.8, marginBottom: 32 }}>Your account is pending admin approval. You will be able to sign in once an admin reviews and approves your request.</p>
        <Link to="/login" style={{ display: 'inline-block', padding: '10px 28px', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.08em' }}>BACK TO SIGN IN →</Link>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--sidebar)' }}>
      <div style={{ width: 380, borderRight: '1px solid #1C2E24', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 60 }}>
            <img src="/src/assets/favicon.ico" alt="logo" style={{ width: 26, height: 26, objectFit: 'contain' }} />
            <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 600, fontSize: 12, color: '#E8DFD0', letterSpacing: '0.06em' }}>Team Task Manager</span>
          </div>
          <h1 style={{ fontFamily: 'Times New Roman', fontSize: 48, color: '#E8DFD0', fontWeight: 400, lineHeight: 1.1, marginBottom: 14 }}>
            Join the<br /><em style={{ color: 'var(--copper)', fontStyle: 'italic' }}>team.</em>
          </h1>
          <p style={{ fontSize: 12, color: '#4A6B58', lineHeight: 1.8 }}>Create your account and start collaborating.</p>
        </div>
        <div style={{ background: '#0A1A14', border: '1px solid #1C2E24', padding: '20px' }}>
          <p style={{ fontSize: 11, color: '#4A6B58', lineHeight: 1.7, margin: 0 }}>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <p style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 28 }}>— Create Account</p>
          {error && <div style={{ border: '1px solid #3D1810', background: '#1A0A06', color: '#E8856B', padding: '10px 12px', fontSize: 11, marginBottom: 20 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            {[
              { key: 'name', label: 'Full Name', type: 'text' },
              { key: 'email', label: 'Email Address', type: 'email' },
              { key: 'password', label: 'Password', type: 'password' },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={lbl}>{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required style={inp}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#1C2E24'; }} />
              </div>
            ))}
            <div style={{ marginBottom: 28 }}>
              <label style={lbl}>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', background: loading ? '#6B3318' : 'var(--accent)', border: 'none', color: '#fff', fontSize: 11, fontWeight: 600, fontFamily: 'IBM Plex Mono', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.08em' }}>
              {loading ? 'CREATING...' : 'CREATE ACCOUNT →'}
            </button>
          </form>
          <p style={{ fontSize: 11, color: '#2A4A38', marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--copper)', textDecoration: 'none', fontWeight: 600 }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}