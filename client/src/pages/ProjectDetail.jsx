import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'DONE'];
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];

const statusStyle = {
  TODO: { color: '#9C6B00', bg: '#FBF4E3', label: 'TO DO' },
  IN_PROGRESS: { color: '#1B3A6B', bg: '#EAF0FB', label: 'IN PROGRESS' },
  DONE: { color: '#2D6A4F', bg: '#EAF4EE', label: 'DONE' },
};

const priorityBar = { LOW: '#2D6A4F', MEDIUM: '#9C6B00', HIGH: '#8B2500' };
const priorityColor = { LOW: '#2D6A4F', MEDIUM: '#9C6B00', HIGH: '#8B2500' };

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
  const [memberEmail, setMemberEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProject = () => api.get(`/projects/${id}`).then((r) => setProject(r.data));
  useEffect(() => { fetchProject(); }, [id]);

  const isAdmin = project?.members?.find((m) => m.userId === user?.id)?.role === 'ADMIN';

  const handleCreateTask = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await api.post(`/projects/${id}/tasks`, { ...taskForm, assigneeId: taskForm.assigneeId || undefined });
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
      setShowTaskForm(false); fetchProject();
    } catch (err) { setError(err.response?.data?.message || 'Failed to create task'); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (taskId, status) => { await api.put(`/projects/${id}/tasks/${taskId}`, { status }); fetchProject(); };
  const handleDeleteTask = async (taskId) => { await api.delete(`/projects/${id}/tasks/${taskId}`); fetchProject(); };
  const handleAddMember = async (e) => {
    e.preventDefault(); setError('');
    try { await api.post(`/projects/${id}/members`, { email: memberEmail, role: 'MEMBER' }); setMemberEmail(''); setShowMemberForm(false); fetchProject(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to add member'); }
  };
  const handleRemoveMember = async (userId) => { await api.delete(`/projects/${id}/members/${userId}`); fetchProject(); };

  if (!project) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono', fontSize: 12, letterSpacing: '0.06em' }}>LOADING...</p>
    </div>
  );

  const inp = { width: '100%', padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 12, fontFamily: 'IBM Plex Mono', outline: 'none' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '36px 44px', overflowY: 'auto' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 20, marginBottom: 28 }}>
          <button onClick={() => navigate('/projects')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 10, cursor: 'pointer', fontFamily: 'IBM Plex Mono', letterSpacing: '0.06em', padding: 0, marginBottom: 10 }}>← PROJECTS</button>
          <h1 style={{ fontFamily: 'Times New Roman', fontSize: 38, color: 'var(--text-primary)', fontWeight: 400, margin: '0 0 4px' }}>{project.name}</h1>
          {project.description && <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono', margin: 0 }}>{project.description}</p>}
        </div>
        {error && <div style={{ border: '1px solid #3D1810', background: '#F7EAE6', color: '#8B2500', padding: '10px 14px', fontSize: 11, marginBottom: 20, fontFamily: 'IBM Plex Mono' }}>{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 2px' }}>Task List</p>
                <h2 style={{ fontFamily: 'Times New Roman', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', margin: 0 }}>Tasks <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, color: 'var(--text-muted)' }}>({project.tasks?.length || 0})</span></h2>
              </div>
              {isAdmin && (
                <button onClick={() => setShowTaskForm(!showTaskForm)} style={{ padding: '8px 16px', background: showTaskForm ? 'transparent' : 'var(--accent)', border: `1px solid ${showTaskForm ? 'var(--border)' : 'var(--accent)'}`, color: showTaskForm ? 'var(--text-secondary)' : '#fff', fontSize: 10, fontWeight: 600, fontFamily: 'IBM Plex Mono', cursor: 'pointer', letterSpacing: '0.08em' }}>
                  {showTaskForm ? 'CANCEL' : 'ADD TASK +'}
                </button>
              )}
            </div>
            {showTaskForm && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '20px', marginBottom: 16 }}>
                <form onSubmit={handleCreateTask}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>Title</label>
                    <input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required placeholder="Task title" style={inp}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }} />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>Description</label>
                    <textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} rows={2} style={{ ...inp, resize: 'none' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[
                      { label: 'PRIORITY', el: <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>{PRIORITY_OPTIONS.map((p) => <option key={p}>{p}</option>)}</select> },
                      { label: 'ASSIGNEE', el: <select value={taskForm.assigneeId} onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })} style={{ ...inp, cursor: 'pointer' }}><option value="">Unassigned</option>{project.members?.map((m) => <option key={m.user.id} value={m.user.id}>{m.user.name}</option>)}</select> },
                      { label: 'DUE DATE', el: <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} style={inp} /> },
                    ].map((f) => (
                      <div key={f.label}>
                        <label style={{ display: 'block', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{f.label}</label>
                        {f.el}
                      </div>
                    ))}
                  </div>
                  <button type="submit" disabled={loading} style={{ padding: '8px 20px', background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 10, fontWeight: 600, fontFamily: 'IBM Plex Mono', cursor: 'pointer', letterSpacing: '0.08em' }}>
                    {loading ? 'CREATING...' : 'CREATE TASK →'}
                  </button>
                </form>
              </div>
            )}
            {project.tasks?.length === 0 && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '48px 24px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'IBM Plex Mono' }}>No tasks yet.</p>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {project.tasks?.map((task) => {
                const s = statusStyle[task.status] || statusStyle.TODO;
                return (
                  <div key={task.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 2, alignSelf: 'stretch', background: priorityBar[task.priority] || '#ccc', flexShrink: 0 }}></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px' }}>{task.title}</p>
                      {task.description && <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 8px', fontFamily: 'IBM Plex Mono', lineHeight: 1.6 }}>{task.description}</p>}
                      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 9, fontWeight: 600, color: priorityColor[task.priority], fontFamily: 'IBM Plex Mono', letterSpacing: '0.08em' }}>{task.priority}</span>
                        {task.assignee && <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>→ {task.assignee.name}</span>}
                        {task.dueDate && <span style={{ fontSize: 10, color: new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? '#8B2500' : 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>DUE {new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      {isAdmin ? (
                        <span style={{ fontSize: 9, fontWeight: 600, padding: '4px 10px', background: s.bg, color: s.color, fontFamily: 'IBM Plex Mono', letterSpacing: '0.08em', border: `1px solid ${s.color}30` }}>{s.label}</span>
                      ) : (
                        <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)} style={{ padding: '5px 8px', border: `1px solid ${s.color}50`, background: s.bg, color: s.color, fontSize: 9, fontFamily: 'IBM Plex Mono', fontWeight: 600, cursor: 'pointer', outline: 'none', letterSpacing: '0.06em' }}>
                          {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{statusStyle[opt].label}</option>)}
                        </select>
                      )}
                      {isAdmin && (
                        <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, padding: '2px 4px', fontFamily: 'IBM Plex Mono', transition: 'color 0.1s' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#8B2500'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>×</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 2px' }}>Team</p>
                <h2 style={{ fontFamily: 'Times New Roman', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', margin: 0 }}>Members</h2>
              </div>
              {isAdmin && (
                <button onClick={() => setShowMemberForm(!showMemberForm)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Mono', letterSpacing: '0.06em' }}>
                  {showMemberForm ? 'CANCEL' : 'ADD +'}
                </button>
              )}
            </div>
            {showMemberForm && (
              <form onSubmit={handleAddMember} style={{ marginBottom: 12 }}>
                <input value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required placeholder="email@address.com" style={{ ...inp, marginBottom: 8 }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }} />
                <button type="submit" style={{ width: '100%', padding: '8px', background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 10, fontWeight: 600, fontFamily: 'IBM Plex Mono', cursor: 'pointer', letterSpacing: '0.08em' }}>ADD MEMBER →</button>
              </form>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {project.members?.map((m) => (
                <div key={m.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, background: 'var(--accent-light)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--accent)', fontFamily: 'IBM Plex Mono', flexShrink: 0 }}>{m.user.name[0].toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1px', fontFamily: 'IBM Plex Sans', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.user.name}</p>
                    <span style={{ fontSize: 9, color: m.role === 'ADMIN' ? 'var(--accent)' : 'var(--text-muted)', fontFamily: 'IBM Plex Mono', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{m.role}</span>
                  </div>
                  {isAdmin && m.userId !== user?.id && (
                    <button onClick={() => handleRemoveMember(m.userId)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, padding: 0, transition: 'color 0.1s', flexShrink: 0 }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#8B2500'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>×</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}