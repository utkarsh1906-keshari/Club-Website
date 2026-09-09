import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  ExternalLink, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import { applicationsService } from '../lib/dataService';

export default function ApplicationsAdmin() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  
  // Selected detail modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationsService.getAll();
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationsService.updateStatus(appId, newStatus);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await applicationsService.delete(deleteTarget.id);
      setDeleteTarget(null);
      if (selectedApp?.id === deleteTarget.id) setSelectedApp(null);
      loadApplications();
    } catch (err) {
      console.error('Failed to delete application:', err);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesDomain = domainFilter === 'all' || app.domain === domainFilter;
    const q = search.toLowerCase();
    const matchesSearch = 
      app.name?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q) ||
      (app.student_id || app.studentId)?.toLowerCase().includes(q) ||
      app.branch?.toLowerCase().includes(q);
    return matchesStatus && matchesDomain && matchesSearch;
  });

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Recruitment &amp; Join Us Applications</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Triage prospective student candidates, update admission status, and inspect statements of purpose.
        </p>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search candidate name, email, roll no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              fontSize: '0.9rem',
              color: 'var(--color-text-primary)'
            }}
          />
        </div>

        {/* Status filters */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {['all', 'New', 'Under Review', 'Accepted', 'Rejected'].map(s => (
            <button
              key={s}
              type="button"
              className={`btn btn-secondary ${statusFilter === s ? 'btn-primary' : ''}`}
              onClick={() => setStatusFilter(s)}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              {s.toUpperCase()} {s === 'all' ? `(${applications.length})` : `(${applications.filter(a => a.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Domain filter dropdown */}
        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-surface)',
            fontSize: '0.85rem',
            color: 'var(--color-text-primary)'
          }}
        >
          <option value="all">All Domains</option>
          <option value="AI/ML">AI/ML</option>
          <option value="VLSI">VLSI</option>
          <option value="Robotics & IoT">Robotics &amp; IoT</option>
          <option value="Drone Technology">Drone Technology</option>
        </select>
      </div>

      {/* Table */}
      <div className="aesthetic-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Academic Info</th>
                <th>Domain &amp; Role</th>
                <th>Status</th>
                <th>Application Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading applications...</td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                    No applicant records match this filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => (
                  <tr key={app.id}>
                    <td>
                      <strong>{app.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {app.email}
                      </div>
                    </td>
                    <td>
                      <div>{app.branch} ({app.year})</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        ID: {app.student_id || app.studentId}
                      </div>
                    </td>
                    <td>
                      <span className="tag-pill" style={{ marginRight: '0.35rem' }}>{app.domain}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{app.role}</span>
                    </td>
                    <td>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        style={{
                          padding: '0.3rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-bg-surface)',
                          fontSize: '0.8rem',
                          color: 'var(--color-text-primary)'
                        }}
                      >
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                        >
                          Details &rarr;
                        </button>
                        <button
                          onClick={() => setDeleteTarget(app)}
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.5rem', color: '#dc2626' }}
                          title="Delete submission"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Details Modal */}
      {selectedApp && (
        <div className="lightbox-backdrop" onClick={() => setSelectedApp(null)}>
          <div className="aesthetic-card" style={{ maxWidth: '620px', width: '90%', maxHeight: '85vh', overflowY: 'auto', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span className="tag-pill" style={{ marginBottom: '0.3rem' }}>{selectedApp.domain} • {selectedApp.role}</span>
                <h2 style={{ fontSize: '1.35rem' }}>{selectedApp.name}</h2>
              </div>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              <div>
                <strong>Email:</strong> {selectedApp.email}
              </div>
              <div>
                <strong>Student ID:</strong> {selectedApp.student_id || selectedApp.studentId}
              </div>
              <div>
                <strong>Branch:</strong> {selectedApp.branch}
              </div>
              <div>
                <strong>Year:</strong> {selectedApp.year}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Why do you want to join?
              </strong>
              <div style={{ padding: '1rem', background: 'var(--color-bg-elevated)', borderRadius: '8px', fontSize: '0.925rem', lineHeight: 1.55 }}>
                {selectedApp.reason || 'No statement provided.'}
              </div>
            </div>

            {selectedApp.portfolio_url && (
              <div style={{ marginBottom: '1.5rem' }}>
                <strong>Portfolio / Work Link:</strong>{' '}
                <a href={selectedApp.portfolio_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                  {selectedApp.portfolio_url} <ExternalLink size={13} style={{ display: 'inline' }} />
                </a>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Status:</span>
                <select
                  value={selectedApp.status}
                  onChange={(e) => handleStatusChange(selectedApp.id, e.target.value)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-surface)'
                  }}
                >
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <button onClick={() => setSelectedApp(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="lightbox-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="aesthetic-card" style={{ maxWidth: '400px', width: '90%', padding: '2rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <AlertTriangle size={40} color="#dc2626" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Application?</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete application by <strong>{deleteTarget.name}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button onClick={() => setDeleteTarget(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="btn btn-primary" style={{ background: '#dc2626', borderColor: '#dc2626', color: '#fff' }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
