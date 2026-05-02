import { Link } from 'react-router-dom';

const features = [
  { tag: '01', title: 'Project Architecturing', desc: 'Structure work into projects. Assign ownership, set scope, and give every team member clear context on what matters.' },
  { tag: '02', title: 'Role-Based Permissions', desc: 'Admins control the workspace. Members execute. Account approvals.' },
  { tag: '03', title: 'Live Progress Tracking', desc: 'Dashboards with task distribution, priority charts, and overdue alerts.' },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--sidebar)', fontFamily: "'IBM Plex Mono', monospace" }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 60px', borderBottom: '1px solid #1C2E24' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/src/assets/favicon.ico" alt="logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 600, fontSize: 14, color: '#E8DFD0', letterSpacing: '0.04em' }}>TEAM TASK MANAGER</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/login" style={{ padding: '8px 20px', border: '1px solid #1C2E24', color: '#8AAF98', fontSize: 12, fontWeight: 500, textDecoration: 'none', letterSpacing: '0.04em' }}>SIGN IN</Link>
          <Link to="/signup" style={{ padding: '8px 20px', background: 'var(--accent)', border: '1px solid var(--accent)', color: '#fff', fontSize: 12, fontWeight: 500, textDecoration: 'none', letterSpacing: '0.04em' }}>SIGN UP</Link>
        </div>
      </nav>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '90px 60px 60px' }}>
        <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 20, marginBottom: 48 }}>
          <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--copper)', letterSpacing: '0.12em', marginBottom: 16, textTransform: 'uppercase' }}>Team Collaboration · Task Management</p>
          <h1 style={{ fontFamily: 'Times New Roman', fontSize: 68, fontWeight: 400, color: '#E8DFD0', lineHeight: 1.05, marginBottom: 24 }}>
            Create..<br />
            <em style={{ color: 'var(--copper)', fontStyle: 'italic' }}>Assign..</em><br />
            Track..
          </h1>
          <p style={{ fontSize: 13, color: '#6B8A78', lineHeight: 1.8, maxWidth: 480, marginBottom: 36 }}>
            Create projects. Assign tasks. Track progress. Team Task Manager gives teams a structured, role-based environment to deliver and keep track of their work.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/signup" style={{ padding: '12px 28px', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.06em' }}>SIGN UP →</Link>
            <Link to="/login" style={{ padding: '12px 28px', border: '1px solid #1C2E24', color: '#8AAF98', fontSize: 12, textDecoration: 'none', letterSpacing: '0.06em' }}>SIGN IN</Link>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid #1C2E24', marginTop: 80 }}>
          {features.map((f, i) => (
            <div key={f.tag} style={{ padding: '36px 32px', borderRight: i < features.length - 1 ? '1px solid #1C2E24' : 'none' }}>
              <p style={{ fontFamily: 'Roboto', fontSize: 11, color: 'var(--accent)', marginBottom: 16, letterSpacing: '0.08em' }}>{f.tag}</p>
              <h3 style={{ fontFamily: 'Times New Roman', fontSize: 22, color: '#E8DFD0', marginBottom: 12, fontWeight: 400 }}>{f.title}</h3>
              <p style={{ fontSize: 12, color: '#6B8A78', lineHeight: 1.75 }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid #1C2E24', marginTop: 0 }}>
          {[
            { val: 'Admin', sub: 'Full control' },
            { val: 'Member', sub: 'Task execution' },
            { val: '4 States', sub: 'Todo → Progress → Done → OverDue(?)' },
          ].map((s, i) => (
            <div key={s.val} style={{ padding: '28px 32px', borderRight: i < 3 ? '1px solid #1C2E24' : 'none' }}>
              <p style={{ fontFamily: 'Times New Roman', fontSize: 26, color: 'var(--copper)', marginBottom: 6 }}>{s.val}</p>
              <p style={{ fontSize: 11, color: '#4A6B58', letterSpacing: '0.04em' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid #1C2E24', padding: '18px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#2A4A38', letterSpacing: '0.08em' }}>TEAM TASK MANAGER</span>
        
      </div>
    </div>
  );
}