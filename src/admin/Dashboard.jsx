import React from 'react';
import { Calendar, FolderGit2, Users, FileText, Image as ImageIcon, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const stats = [
    { title: 'Total Events', count: 12, icon: <Calendar size={20} color="var(--color-primary)" />, link: '/admin/events' },
    { title: 'Active Projects', count: 24, icon: <FolderGit2 size={20} color="var(--color-accent-indigo)" />, link: '/admin/projects' },
    { title: 'Club Members', count: 156, icon: <Users size={20} color="var(--color-accent-emerald)" />, link: '/admin/team' },
    { title: 'Join Applications', count: 43, icon: <FileText size={20} color="var(--color-accent-amber)" />, link: '/admin/applications' },
  ];

  const recentApplications = [
    { name: 'Aarav Patel', email: 'aarav.p@college.edu', domain: 'AI/ML', role: 'Technical', date: 'Sept 04, 2026', status: 'New' },
    { name: 'Devika Sharma', email: 'devika.s@college.edu', domain: 'Drone Technology', role: 'Technical', date: 'Sept 03, 2026', status: 'Under Review' },
    { name: 'Rohan Gupta', email: 'rohan.g@college.edu', domain: 'VLSI', role: 'Technical', date: 'Sept 02, 2026', status: 'Accepted' },
    { name: 'Ananya Roy', email: 'ananya.r@college.edu', domain: 'None', role: 'Design', date: 'Sept 01, 2026', status: 'Accepted' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">System Overview</h1>
          <p className="dashboard-subtitle">Monitor and update public club website data, roster, and applicant submissions.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats-grid">
        {stats.map((s, i) => (
          <Link key={i} to={s.link} className="aesthetic-card stat-metric-card">
            <div className="stat-card-header">
              <span className="stat-card-title">{s.title}</span>
              <div className="stat-card-icon">{s.icon}</div>
            </div>
            <div className="stat-card-value">{s.count}</div>
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
            <p>Recent submissions from prospective club members.</p>
          </div>
          <Link to="/join" className="btn btn-secondary topbar-btn" target="_blank">
            Preview Public Form
          </Link>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Email</th>
                <th>Interested Domain</th>
                <th>Target Role</th>
                <th>Submitted Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app, idx) => (
                <tr key={idx}>
                  <td className="applicant-name">{app.name}</td>
                  <td>{app.email}</td>
                  <td>
                    <span className="tag-pill">{app.domain}</span>
                  </td>
                  <td>{app.role}</td>
                  <td>{app.date}</td>
                  <td>
                    <span className={`status-badge-table status-${app.status.toLowerCase().replace(' ', '-')}`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}