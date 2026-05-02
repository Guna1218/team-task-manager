import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchProjects = () => api.get('/projects').then((r) => setProjects(r.data));
  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await api.post('/projects', form); setForm({ name: '', description: '' }); setShowForm(false); fetchProjects(); }
    finally { setLoading(false); }
  };

  const inp = { width: '100%', padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 12, fontFamily: 'IBM Plex Mono', outline: 'none', letterSpacing: '0.03em' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '36px 44px', overflowY: 'auto' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 20, marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>— Workspace</p>
            <h1 style={{ fontFamily: 'Times New Roman', fontSize: 38, color: 'var(--text-primary)', fontWeight: 400, margin: 0 }}>Projects</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>{projects.length} TOTAL</span>
            {user?.role === 'ADMIN' && (
              <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 18px', background: showForm ? 'transparent' : 'var(--accent)', border: `1px solid ${showForm ? 'var(--border)' : 'var(--accent)'}`, color: showForm ? 'var(--text-secondary)' : '#fff', fontSize: 10, fontWeight: 600, fontFamily: 'IBM Plex Mono', cursor: 'pointer', letterSpacing: '0.08em' }}>
                {showForm ? 'CANCEL' : 'NEW PROJECT +'}
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '24px', marginBottom: 24 }}>
            <p style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>New Project</p>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Project Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Website Redesign" style={inp}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...inp, resize: 'none' }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }} />
              </div>
              <button type="submit" disabled={loading} style={{ padding: '9px 22px', background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 10, fontWeight: 600, fontFamily: 'IBM Plex Mono', cursor: 'pointer', letterSpacing: '0.08em' }}>
                {loading ? 'CREATING...' : 'CREATE PROJECT →'}
              </button>
            </form>
          </div>
        )}
        {projects.length === 0 && !showForm && (
          <div style={{ padding: '80px 0', textAlign: 'center', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <p style={{ fontFamily: 'Times New Roman', fontSize: 24, color: 'var(--text-primary)', fontWeight: 400, margin: '0 0 8px' }}>No projects yet</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>Create your first project to get started</p>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {projects.map((p) => (
            <div key={p.id} onClick={() => navigate(`/projects/${p.id}`)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '22px 24px', cursor: 'pointer', transition: 'border-color 0.1s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <h3 style={{ fontFamily: 'Times New Roman', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', margin: 0 }}>{p.name}</h3>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono', letterSpacing: '0.06em', background: 'var(--bg)', padding: '3px 8px', flexShrink: 0, marginLeft: 8 }}>{p.tasks?.length || 0} TASKS</span>
              </div>
              {p.description && <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16, fontFamily: 'IBM Plex Mono' }}>{p.description}</p>}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {p.members?.slice(0, 4).map((m) => (
                    <div key={m.id} title={m.user.name} style={{ width: 24, height: 24, background: 'var(--accent-light)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: 'var(--accent)', fontFamily: 'IBM Plex Mono' }}>{m.user.name[0].toUpperCase()}</div>
                  ))}
                </div>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono', letterSpacing: '0.06em' }}>{p.members?.length} MEMBERS</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}