import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  FolderGit2, 
  Users, 
  FileText, 
  Image as ImageIcon, 
  Trophy,
  ArrowUpRight, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Bell,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { statsService, applicationsService } from '../lib/dataService';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    eventsCount: 0,
    projectsCount: 0,
    membersCount: 0,
    applicationsCount: 0,
    galleryCount: 0,
    achievementsCount: 0,
    newApplicationsCount: 0
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, appsData] = await Promise.all([
        statsService.getDashboardStats(),
        applicationsService.getAll()
      ]);
      setStats(statsData);
      setApplications(appsData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await applicationsService.updateStatus(appId, newStatus);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      const updatedStats = await statsService.getDashboardStats();
      setStats(updatedStats);
    } catch (err) {
      console.error('Failed to update application status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const statCards = [
    { title: 'Achievements', count: stats.achievementsCount, icon: <Trophy size={20} color="#d97706" />, link: '/admin/achievements' },
    { title: 'Total Events', count: stats.eventsCount, icon: <Calendar size={20} color="var(--color-primary)" />, link: '/admin/events' },
    { title: 'Active Projects', count: stats.projectsCount, icon: <FolderGit2 size={20} color="var(--color-accent-indigo)" />, link: '/admin/projects' },
    { title: 'Club Members', count: stats.membersCount, icon: <Users size={20} color="var(--color-accent-emerald)" />, link: '/admin/team' },
    { title: 'Join Applications', count: stats.applicationsCount, icon: <FileText size={20} color="var(--color-accent-amber)" />, link: '/admin/applications', badge: stats.newApplicationsCount > 0 ? `${stats.newApplicationsCount} New` : null },
  ];

  const recentApplications = applications.slice(0, 6);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="dashboard-title">System Overview</h1>
          <p className="dashboard-subtitle">Monitor and update public club website data, roster, and applicant submissions.</p>
        </div>
        <button 
          onClick={loadData} 
          className="btn btn-secondary" 
          style={{ gap: '0.4rem', fontSize: '0.85rem' }}
          title="Reload statistics"
          type="button"
        >
          <RefreshCw size={14} className={loading ? 'spinning' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats-grid">
        {statCards.map((s, i) => (
          <Link key={i} to={s.link} className="aesthetic-card stat-metric-card">
            <div className="stat-card-header">
              <span className="stat-card-title">{s.title}</span>
              <div className="stat-card-icon">{s.icon}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <div className="stat-card-value">{loading ? '...' : s.count}</div>
              {s.badge && (
                <span className="tag-pill" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', fontWeight: 600 }}>
                  {s.badge}
                </span>
              )}
            </div>
            <div className="stat-card-footer">
              <span>Manage &rarr;</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Applications Table */}
      <div className="aesthetic-card dashboard-table-card">
        <div className="table-card-header">
          <div>
            <h3>Recent Join Us Applications</h3>
            <p>Submissions from students seeking to join Drone &amp; Robotics Club verticals.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/admin/applications" className="btn btn-primary topbar-btn">
              View All Applications &rarr;
            </Link>
            <Link to="/join" className="btn btn-secondary topbar-btn" target="_blank" rel="noopener noreferrer">
              Preview Form <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Email &amp; Roll No</th>
                <th>Interested Domain</th>
                <th>Target Role</th>
                <th>Status</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                    No applicant submissions logged yet.
                  </td>
                </tr>
              ) : (
                recentApplications.map((app) => (
                  <tr key={app.id}>
                    <td className="applicant-name">
                      <strong>{app.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {app.branch} ({app.year})
                      </div>
                    </td>
                    <td>
                      <div>{app.email}</div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {app.student_id || app.studentId}
                      </span>
                    </td>
                    <td>
                      <span className="tag-pill">{app.domain}</span>
                    </td>
                    <td>{app.role}</td>
                    <td>
                      <span className={`status-badge-table status-${app.status?.toLowerCase().replace(' ', '-')}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={app.status}
                        disabled={updatingId === app.id}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-bg-surface)',
                          fontSize: '0.82rem',
                          color: 'var(--color-text-primary)',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}