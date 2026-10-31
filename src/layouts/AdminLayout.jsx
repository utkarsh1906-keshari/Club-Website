import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FolderGit2, 
  Users, 
  Layers, 
  ArrowLeft,
  ShieldCheck,
  UserCheck,
  Crown,
  LogOut,
  Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIdleLogout } from '../hooks/useIdleLogout';
import './AdminLayout.css';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminProfile, signOut } = useAuth();
  const { showWarning, remainingSeconds, stayLoggedIn } = useIdleLogout();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleExitToSite = () => {
    navigate('/');
  };

  const allNavItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: <LayoutDashboard size={18} />, 
      roles: ['super_admin', 'domain_lead', 'event_manager', 'social_media'] 
    },
    { 
      name: 'Events & Registrations', 
      path: '/admin/events', 
      icon: <Calendar size={18} />, 
      roles: ['super_admin', 'event_manager'] 
    },
    { 
      name: 'Projects', 
      path: '/admin/projects', 
      icon: <FolderGit2 size={18} />, 
      roles: ['super_admin', 'domain_lead'] 
    },
    { 
      name: 'Team Members', 
      path: '/admin/team', 
      icon: <Users size={18} />, 
      roles: ['super_admin', 'social_media'] 
    },
    { 
      name: 'Domains', 
      path: '/admin/domains', 
      icon: <Layers size={18} />, 
      roles: ['super_admin', 'domain_lead'] 
    },
    { 
      name: 'Applications', 
      path: '/admin/applications', 
      icon: <UserCheck size={18} />, 
      roles: ['super_admin', 'domain_lead'] 
    },
    { 
      name: 'Announcements', 
      path: '/admin/announcements', 
      icon: <Radio size={18} />, 
      roles: ['super_admin', 'social_media'] 
    },
    { 
      name: 'Admin Users', 
      path: '/admin/users', 
      icon: <Crown size={18} />, 
      roles: ['super_admin'] 
    },
    { 
      name: 'Settings & Cycles', 
      path: '/admin/settings', 
      icon: <ShieldCheck size={18} />, 
      roles: ['super_admin'] 
    },
  ];

  const currentRole = adminProfile?.role || 'super_admin';
  const navItems = allNavItems.filter(item => 
    currentRole === 'super_admin' || item.roles.includes(currentRole)
  );

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Administrator';
      case 'domain_lead': return 'Technical Domain Lead';
      case 'event_manager': return 'Events Coordinator';
      case 'social_media': return 'Media & Outreach Lead';
      default: return 'Club Administrator';
    }
  };

  return (
    <div className="admin-wrapper">
      {/* Inactivity Warning Banner */}
      {showWarning && (
        <div style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 99999,
          background: 'rgba(23, 23, 31, 0.98)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #eab308',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(234, 179, 8, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          maxWidth: '440px',
          color: '#f8fafc'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fbbf24', marginBottom: '0.2rem' }}>
              Inactivity Timeout Warning
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Your session will expire in <strong>{remainingSeconds}s</strong> due to inactivity.
            </div>
          </div>
          <button
            type="button"
            onClick={stayLoggedIn}
            className="btn btn-primary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            Stay logged in
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <button 
            type="button" 
            onClick={handleExitToSite} 
            className="back-to-site" 
            title="Exit Admin Portal and return to Public Site"
          >
            <ArrowLeft size={16} />
            <span>Public Site</span>
          </button>
          <div className="admin-brand">
            <div className="admin-logo-box">
              <img 
                src="/club-emblem.png" 
                alt="Drone & Robotics Club ABES" 
                className="admin-brand-logo" 
              />
            </div>
            <div className="admin-brand-text">
              <span className="admin-badge">ADMIN CONSOLE</span>
              <h2>Drone &amp; Robotics</h2>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-authenticated-user">
            <div className="auth-avatar">
              <Crown size={16} />
            </div>
            <div className="auth-user-info">
              <span className="auth-user-name">{adminProfile?.name || 'Administrator'}</span>
              <span className="auth-user-role">{getRoleDisplayName(adminProfile?.role)}</span>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleLogout} 
            className="sidebar-logout-btn" 
            title="Log Out of Admin Control Center"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-title-group">
            <span className="topbar-title">Management Console</span>
            <div className="topbar-verified-tag">
              <ShieldCheck size={13} />
              <span>Verified Session</span>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="topbar-profile-pill">
              <span className="role-pill-badge">
                {getRoleDisplayName(adminProfile?.role)}
              </span>
              <span className="profile-name-text">{adminProfile?.name || adminProfile?.email}</span>
            </div>

            <button 
              type="button" 
              onClick={handleExitToSite} 
              className="btn btn-secondary topbar-btn"
              title="Exit Admin Portal and return to Website"
            >
              View Website &rarr;
            </button>

            <button 
              type="button" 
              onClick={handleLogout} 
              className="btn btn-danger-outline topbar-logout-action"
              title="Sign Out of Admin Portal"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
