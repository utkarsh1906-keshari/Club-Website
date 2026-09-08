import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FolderGit2, 
  Users, 
  Layers, 
  Image as ImageIcon, 
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

  // Check for active authorized session
  const [adminSession, setAdminSession] = useState(() => {
    try {
      const saved = localStorage.getItem('drc_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.expiresAt && parsed.expiresAt > Date.now()) {
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
      localStorage.removeItem('drc_admin_session');
    } catch (e) {
      console.error('Logout error:', e);
    }
    setAdminSession(null);
  };

  // If user is not an authenticated Faculty Advisor or Club Head, lock the portal and show login
  if (!adminSession) {
    return <AdminLogin onLoginSuccess={(session) => setAdminSession(session)} />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Events', path: '/admin/events', icon: <Calendar size={18} /> },
    { name: 'Projects', path: '/admin/projects', icon: <FolderGit2 size={18} /> },
    { name: 'Team Members', path: '/admin/team', icon: <Users size={18} /> },
    { name: 'Domains', path: '/admin/domains', icon: <Layers size={18} /> },
    { name: 'Gallery Media', path: '/admin/gallery', icon: <ImageIcon size={18} /> },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="back-to-site">
            <ArrowLeft size={16} />
            <span>Public Site</span>
          </Link>
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

            <Link to="/" className="btn btn-secondary topbar-btn">
              View Website &rarr;
            </Link>

            <button 
              onClick={handleLogout} 
              className="btn btn-danger-outline topbar-logout-action"
              title="Sign Out"
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