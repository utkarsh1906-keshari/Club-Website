import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FolderGit2, 
  Users, 
  Layers, 
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
  Crown,
  LogOut
} from 'lucide-react';
import AdminLogin from '../admin/AdminLogin';
import './AdminLayout.css';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check for active authorized session in sessionStorage only
  const [adminSession, setAdminSession] = useState(() => {
    try {
      // Clear any legacy persistent localStorage session
      localStorage.removeItem('drc_admin_session');
      
      const saved = sessionStorage.getItem('drc_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.authenticatedAt) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Session retrieval error:', e);
    }
    return null;
  });

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('drc_admin_session');
      localStorage.removeItem('drc_admin_session');
    } catch (e) {
      console.error('Logout error:', e);
    }
    setAdminSession(null);
  };

  const handleExitToSite = () => {
    handleLogout();
    navigate('/');
  };

  // Whenever the admin portal layout is exited/unmounted, clear the session so password is required next time
  useEffect(() => {
    return () => {
      try {
        sessionStorage.removeItem('drc_admin_session');
        localStorage.removeItem('drc_admin_session');
      } catch (e) {
        console.error('Session clear on exit error:', e);
      }
    };
  }, []);

  // If user is not an authenticated Faculty Advisor or Club Head, lock the portal and show login
  if (!adminSession) {
    return <AdminLogin onLoginSuccess={(session) => setAdminSession(session)} />;
  }

  const allNavItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} />, roles: ['super_admin', 'faculty', 'club_head', 'domain_lead', 'event_manager', 'social_media'] },
    { name: 'Events', path: '/admin/events', icon: <Calendar size={18} />, roles: ['super_admin', 'faculty', 'club_head', 'event_manager'] },
    { name: 'Projects', path: '/admin/projects', icon: <FolderGit2 size={18} />, roles: ['super_admin', 'faculty', 'club_head', 'domain_lead'] },
    { name: 'Team Members', path: '/admin/team', icon: <Users size={18} />, roles: ['super_admin', 'faculty', 'club_head', 'domain_lead'] },
    { name: 'Domains', path: '/admin/domains', icon: <Layers size={18} />, roles: ['super_admin', 'faculty', 'club_head', 'domain_lead'] },
    { name: 'Applications', path: '/admin/applications', icon: <Users size={18} />, roles: ['super_admin', 'faculty', 'club_head', 'domain_lead'] },
    { name: 'Announcements', path: '/admin/announcements', icon: <ShieldCheck size={18} />, roles: ['super_admin', 'faculty', 'club_head', 'social_media'] },
    { name: 'Admin Users', path: '/admin/users', icon: <Crown size={18} />, roles: ['super_admin', 'faculty', 'club_head'] },
    { name: 'Settings & SQL', path: '/admin/settings', icon: <ShieldCheck size={18} />, roles: ['super_admin', 'faculty', 'club_head'] },
  ];

  const currentRole = adminSession?.role || 'faculty';
  const navItems = allNavItems.filter(item => 
    item.roles.includes(currentRole) || item.roles.includes('super_admin') && (currentRole === 'faculty' || currentRole === 'club_head')
  );

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-wrapper">
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
              <h2>Drone & Robotics</h2>
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
              {adminSession.role === 'faculty' ? <GraduationCap size={16} /> : <Crown size={16} />}
            </div>
            <div className="auth-user-info">
              <span className="auth-user-name">{adminSession.name}</span>
              <span className="auth-user-role">{adminSession.roleTitle} &bull; Active</span>
            </div>
          </div>
          <button 
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
                {adminSession.role === 'faculty' ? 'Faculty Advisor' : 'Club Head'}
              </span>
              <span className="profile-name-text">{adminSession.name}</span>
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
              title="Exit Admin Portal"
            >
              <LogOut size={15} />
              <span>Exit</span>
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