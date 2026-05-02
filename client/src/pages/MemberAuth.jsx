import { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const statusConfig = {
  PENDING: { color: '#9C6B00', bg: '#FBF4E3', label: 'Pending' },
  APPROVED: { color: '#2D6A4F', bg: '#EAF4EE', label: 'Approved' },
  DENIED: { color: '#8B2500', bg: '#F7EAE6', label: 'Denied' },
};

function UserTable({ users, loading, filter, setFilter, onAction, actionLoading, type }) {
  const filtered = users.filter((u) => u.status === filter);
  const counts = {
    PENDING: users.filter((u) => u.status === 'PENDING').length,
    APPROVED: users.filter((u) => u.status === 'APPROVED').length,
    DENIED: users.filter((u) => u.status === 'DENIED').length,
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { key: 'PENDING', label: 'Awaiting Review', color: '#8A6200', bg: '#FFF8E6' },
          { key: 'APPROVED', label: 'Approved', color: 'var(--success)', bg: 'var(--success-bg)' },
          { key: 'DENIED', label: 'Denied', color: 'var(--danger)', bg: 'var(--danger-bg)' },
        ].map((s) => (
          <div key={s.key} onClick={() => setFilter(s.key)} style={{
            background: filter === s.key ? s.bg : 'var(--surface)',
            border: `1.5px solid ${filter === s.key ? s.color : 'var(--border)'}`,
            borderRadius: 12, padding: '18px 22px', cursor: 'pointer', transition: 'all 0.15s',
          }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: filter === s.key ? s.color : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: 30, fontWeight: 700, fontFamily: 'Sora', color: filter === s.key ? s.color : 'var(--text-primary)' }}>{counts[s.key]}</p>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0, fontFamily: 'Sora', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
            {statusConfig[filter].label} {type}s
            <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>({filtered.length})</span>
          </h3>
        </div>
        {loading && (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>Loading...</p>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: '56px 24px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>No {statusConfig[filter].label.toLowerCase()} {type.toLowerCase()}s</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>
              {filter === 'PENDING' ? 'All requests have been reviewed.' : `No ${type.toLowerCase()}s have been ${filter.toLowerCase()} yet.`}
            </p>
          </div>
        )}
        {!loading && filtered.map((user, i) => {
          const s = statusConfig[user.status];
          return (
            <div key={user.id} style={{
              padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16,
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: type === 'Admin' ? '#EEF4FD' : 'var(--accent-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700,
                color: type === 'Admin' ? 'var(--info)' : 'var(--accent)',
                flexShrink: 0,
              }}>{user.name[0].toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</p>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                    background: type === 'Admin' ? 'var(--info-bg)' : 'var(--accent-light)',
                    color: type === 'Admin' ? 'var(--info)' : 'var(--accent)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>{type}</span>
                </div>
                <p style={{ margin: '0 0 2px', fontSize: 13, color: 'var(--text-secondary)' }}>{user.email}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>
                  Requested {new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: s.bg, color: s.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {user.status !== 'APPROVED' && (
                  <button onClick={() => onAction(user.id, 'APPROVED')} disabled={actionLoading === user.id + 'APPROVED'} style={{
                    padding: '8px 18px', borderRadius: 8, background: 'var(--success-bg)',
                    border: '1.5px solid var(--success)', color: 'var(--success)',
                    fontSize: 12, fontWeight: 700, fontFamily: 'Nunito', cursor: 'pointer',
                    opacity: actionLoading === user.id + 'APPROVED' ? 0.6 : 1,
                  }}>Approve</button>
                )}
                {user.status !== 'DENIED' && (
                  <button onClick={() => onAction(user.id, 'DENIED')} disabled={actionLoading === user.id + 'DENIED'} style={{
                    padding: '8px 18px', borderRadius: 8, background: 'var(--danger-bg)',
                    border: '1.5px solid var(--danger)', color: 'var(--danger)',
                    fontSize: 12, fontWeight: 700, fontFamily: 'Nunito', cursor: 'pointer',
                    opacity: actionLoading === user.id + 'DENIED' ? 0.6 : 1,
                  }}>Deny</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MemberAuth() {
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  const [memberFilter, setMemberFilter] = useState('PENDING');
  const [adminFilter, setAdminFilter] = useState('PENDING');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      api.get('/admin/members'),
      api.get('/admin/admins'),
    ]).then(([m, a]) => {
      setMembers(m.data);
      setAdmins(a.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAction = async (userId, status) => {
    setActionLoading(userId + status);
    try {
      await api.patch(`/admin/users/${userId}/status`, { status });
      fetchAll();
    } finally {
      setActionLoading(null);
    }
  };

  const pendingMembers = members.filter((m) => m.status === 'PENDING').length;
  const pendingAdmins = admins.filter((a) => a.status === 'PENDING').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 20, marginBottom: 28 }}>
        <p style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>— Admin Panel</p>
        <h1 style={{ fontFamily: 'Times New Roman', fontSize: 38, color: 'var(--text-primary)', fontWeight: 400, margin: 0 }}>Account Approvals</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 11, margin: '4px 0 0', fontFamily: 'IBM Plex Mono' }}>Review and manage member and admin account requests</p>
      </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--surface)', padding: 4, borderRadius: 10, width: 'fit-content', border: '1px solid var(--border)' }}>
          {[
            { key: 'members', label: 'Members', pending: pendingMembers },
            { key: 'admins', label: 'Admins', pending: pendingAdmins },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '8px 20px', borderRadius: 8, border: 'none',
              background: activeTab === tab.key ? 'var(--sidebar)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 600, fontFamily: 'Nunito', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
            }}>
              {tab.label}
              {tab.pending > 0 && (
                <span style={{
                  background: activeTab === tab.key ? 'var(--accent)' : '#FFF8E6',
                  color: activeTab === tab.key ? '#fff' : '#8A6200',
                  fontSize: 11, fontWeight: 700, padding: '1px 7px',
                  borderRadius: 20, minWidth: 20, textAlign: 'center',
                }}>{tab.pending}</span>
              )}
            </button>
          ))}
        </div>
        {activeTab === 'members' && (
          <UserTable
            users={members}
            loading={loading}
            filter={memberFilter}
            setFilter={setMemberFilter}
            onAction={handleAction}
            actionLoading={actionLoading}
            type="Member"
          />
        )}
        {activeTab === 'admins' && (
          <UserTable
            users={admins}
            loading={loading}
            filter={adminFilter}
            setFilter={setAdminFilter}
            onAction={handleAction}
            actionLoading={actionLoading}
            type="Admin"
          />
        )}
      </main>
    </div>
  );
}