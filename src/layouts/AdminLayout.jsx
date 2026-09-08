import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FolderGit2, 
  Users, 
  Layers, 
  Image as ImageIcon, 
  ArrowLeft,
  ShieldAlert,
  FileText
} from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
  const location = useLocation();

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
          <div className="admin-user-pill">
            <span className="status-dot"></span>
            <span>Super Admin (Simulated)</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-title">
            <span>Management Console</span>
          </div>
          <div className="topbar-actions">
            <Link to="/" className="btn btn-secondary topbar-btn">
              View Live Website &rarr;
            </Link>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}