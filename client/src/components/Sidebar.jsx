import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', code: '01' },
    { to: '/projects', label: 'Projects', code: '02' },
    ...(user?.role === 'ADMIN' ? [{ to: '/admin/members', label: 'Approvals', code: '03' }] : []),
  ];

  return (
    <aside style={{ width: 220, minHeight: '100vh', background: 'var(--sidebar)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', flexShrink: 0, borderRight: '1px solid #1C2E24' }}>
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #1C2E24' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <img src="/src/assets/favicon.ico" alt="logo" style={{ width: 26, height: 26, objectFit: 'contain' }} />
          <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 600, fontSize: 12, color: '#E8DFD0', letterSpacing: '0.06em' }}>Team Task Manager</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, background: '#162E1E', border: '1px solid #1C2E24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--copper)' }}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#C8BFB0', margin: 0, letterSpacing: '0.02em' }}>{user?.name}</p>
            <span style={{ fontSize: 9, color: user?.role === 'ADMIN' ? 'var(--copper)' : 'var(--sidebar-text)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{user?.role}</span>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
            textDecoration: 'none', fontSize: 12, fontWeight: isActive ? 600 : 400,
            color: isActive ? '#E8DFD0' : 'var(--sidebar-text)',
            background: isActive ? 'var(--sidebar-active)' : 'transparent',
            borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
            letterSpacing: '0.03em', transition: 'all 0.1s',
          })}>
            <span style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.08em', minWidth: 16 }}>{item.code}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: '1px solid #1C2E24' }}>
        <p style={{ fontSize: 10, color: '#2A4A38', margin: '0 0 8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{user?.email}</p>
        <button onClick={handleLogout} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid #1C2E24', color: '#4A6B58', fontSize: 11, cursor: 'pointer', fontFamily: 'IBM Plex Mono', letterSpacing: '0.06em', textAlign: 'left', transition: 'all 0.1s' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1C2E24'; e.currentTarget.style.color = '#4A6B58'; }}>
          SIGN OUT →
        </button>
      </div>
    </aside>
  );
}