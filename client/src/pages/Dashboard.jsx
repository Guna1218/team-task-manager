import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const statusStyle = {
  TODO: { color: '#9C6B00', bg: '#FBF4E3', label: 'To Do' },
  IN_PROGRESS: { color: '#1B3A6B', bg: '#EAF0FB', label: 'In Progress' },
  DONE: { color: '#2D6A4F', bg: '#EAF4EE', label: 'Done' },
};

const PIE_COLORS = ['#FBF4E3', '#EAF0FB', '#EAF4EE', '#F7EAE6'];
const PIE_STROKE = ['#9C6B00', '#1B3A6B', '#2D6A4F', '#8B2500'];

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
  if (value === 0) return null;
  const R = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * R);
  const y = cy + radius * Math.sin(-midAngle * R);
  const lx1 = cx + (outerRadius + 6) * Math.cos(-midAngle * R);
  const ly1 = cy + (outerRadius + 6) * Math.sin(-midAngle * R);
  const lx2 = cx + (outerRadius + 22) * Math.cos(-midAngle * R);
  const ly2 = cy + (outerRadius + 22) * Math.sin(-midAngle * R);
  return (
    <g>
      <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="#D8D2C6" strokeWidth={1} />
      <text x={x} y={y - 7} textAnchor="middle" fill="#6B6559" fontSize={10} fontFamily="IBM Plex Mono" letterSpacing="0.04em">{name}</text>
      <text x={x} y={y + 7} textAnchor="middle" fill="#1A1A14" fontSize={12} fontFamily="IBM Plex Mono" fontWeight={600}>{value}</text>
    </g>
  );
};

const statConfig = [
  { key: 'total', label: 'TOTAL', color: '#1A1A14', bg: '#E8E2D8' },
  { key: 'todo', label: 'TO DO', color: '#9C6B00', bg: '#FBF4E3' },
  { key: 'inProgress', label: 'IN PROGRESS', color: '#1B3A6B', bg: '#EAF0FB' },
  { key: 'done', label: 'DONE', color: '#2D6A4F', bg: '#EAF4EE' },
  { key: 'overdue', label: 'OVERDUE', color: '#8B2500', bg: '#F7EAE6' },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/dashboard'), api.get('/projects')])
      .then(([d, p]) => { setData(d.data); setProjects(p.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'Roboto', fontSize: 12, letterSpacing: '0.06em' }}>LOADING...</p>
    </div>
  );

  const taskStatusData = [
    { name: 'To Do', value: data?.todo || 0 },
    { name: 'In Progress', value: data?.inProgress || 0 },
    { name: 'Done', value: data?.done || 0 },
    { name: 'Overdue', value: data?.overdue || 0 },
  ];

  const priorityData = [
    { name: 'Low', value: 0, fill: '#EAF4EE', stroke: '#2D6A4F' },
    { name: 'Medium', value: 0, fill: '#FBF4E3', stroke: '#9C6B00' },
    { name: 'High', value: 0, fill: '#F7EAE6', stroke: '#8B2500' },
  ];
  data?.recentTasks?.forEach((t) => {
    if (t.priority === 'LOW') priorityData[0].value++;
    if (t.priority === 'MEDIUM') priorityData[1].value++;
    if (t.priority === 'HIGH') priorityData[2].value++;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '36px 44px', overflowY: 'auto' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 20, marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>— Workspace Overview</p>
            <h1 style={{ fontFamily: 'Times New Roman', fontSize: 38, color: 'var(--text-primary)', fontWeight: 400, margin: 0 }}>Dashboard</h1>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono', letterSpacing: '0.04em' }}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, marginBottom: 28, border: '1px solid var(--border)' }}>
          {statConfig.map((s, i) => (
            <div key={s.key} style={{ padding: '20px 20px', background: s.bg, borderRight: i < statConfig.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <p style={{ fontSize: 9, fontWeight: 600, color: s.color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'IBM Plex Mono' }}>{s.label}</p>
              <p style={{ fontFamily: 'Times New Roman', fontSize: 44, color: s.color, margin: 0, lineHeight: 1 }}>{data?.[s.key] || 0}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '24px' }}>
            <p style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Chart 01</p>
            <h2 style={{ fontFamily: 'Times New Roman', fontSize: 20, color: 'var(--text-primary)', fontWeight: 400, margin: '0 0 20px' }}>Task Status Distribution</h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={taskStatusData} cx="50%" cy="50%" outerRadius={88} innerRadius={44} dataKey="value" labelLine={false} label={CustomPieLabel}>
                  {taskStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} stroke={PIE_STROKE[i]} strokeWidth={1.5} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 0, fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '24px' }}>
            <p style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7 }}>Chart 02</p>
            <h2 style={{ fontFamily: 'Times New Roman', fontSize: 20, color: 'var(--text-primary)', fontWeight: 400, margin: '0 0 20px' }}>Tasks by Priority</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={priorityData} barSize={44} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#E8E2D8" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: 'var(--text-muted)', letterSpacing: '0.04em' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#F0EAE0' }} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 0, fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
                <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                  {priorityData.map((e, i) => <Cell key={i} fill={e.fill} stroke={e.stroke} strokeWidth={1.5} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Overview</p>
              <h2 style={{ fontFamily: 'Times New Roman', fontSize: 20, color: 'var(--text-primary)', fontWeight: 400, margin: 0 }}>Project Progress</h2>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>{projects.length} PROJECTS</span>
          </div>
          {projects.length === 0 && <div style={{ padding: '40px 24px', textAlign: 'center' }}><p style={{ color: 'var(--text-muted)', fontSize: 12 }}>No projects yet.</p></div>}
          {projects.map((project, i) => {
            const total = project.tasks?.length || 0;
            const done = project.tasks?.filter((t) => t.status === 'DONE').length || 0;
            const inProg = project.tasks?.filter((t) => t.status === 'IN_PROGRESS').length || 0;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div key={project.id} onClick={() => navigate(`/projects/${project.id}`)} style={{ padding: '18px 24px', borderBottom: i < projects.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F7F2EA'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px' }}>{project.name}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono', letterSpacing: '0.03em' }}>
                      {project.members?.length} members · {total} tasks · {inProg} in progress
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 24 }}>
                    <span style={{ fontFamily: 'Times New Roman', fontSize: 28, color: pct === 100 ? '#2D6A4F' : 'var(--text-primary)' }}>{pct}%</span>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono', margin: '2px 0 0' }}>{done}/{total} DONE</p>
                  </div>
                </div>
                <div style={{ height: 3, background: '#E8E2D8', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: pct === 100 ? '#2D6A4F' : pct > 50 ? '#1B3A6B' : 'var(--accent)', transition: 'width 0.4s ease' }}></div>
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
                  {[
                    { label: 'TODO', count: project.tasks?.filter((t) => t.status === 'TODO').length || 0, color: '#9C6B00' },
                    { label: 'IN PROGRESS', count: inProg, color: '#1B3A6B' },
                    { label: 'DONE', count: done, color: '#2D6A4F' },
                  ].map((s) => (
                    <span key={s.label} style={{ fontSize: 10, fontWeight: 600, color: s.color, fontFamily: 'IBM Plex Mono', letterSpacing: '0.06em' }}>{s.count} {s.label}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Activity</p>
            <h2 style={{ fontFamily: 'Times New Roman', fontSize: 20, color: 'var(--text-primary)', fontWeight: 400, margin: 0 }}>Recent Tasks</h2>
          </div>
          {data?.recentTasks?.length === 0 && <div style={{ padding: '40px 24px', textAlign: 'center' }}><p style={{ color: 'var(--text-muted)', fontSize: 12 }}>No tasks yet.</p></div>}
          {data?.recentTasks?.map((task, i) => {
            const s = statusStyle[task.status] || statusStyle.TODO;
            return (
              <div key={task.id} onClick={() => navigate(`/projects/${task.projectId}`)} style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < data.recentTasks.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F7F2EA'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <div>
                  <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>{task.title}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono', margin: 0, letterSpacing: '0.03em' }}>{task.project?.name}{task.assignee ? ` · ${task.assignee.name}` : ''}</p>
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, padding: '4px 10px', background: s.bg, color: s.color, fontFamily: 'IBM Plex Mono', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', border: `1px solid ${s.color}20` }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}