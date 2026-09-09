import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  ExternalLink, 
  X, 
  AlertTriangle,
  Power,
  Settings,
  PlusCircle,
  CheckCircle2,
  Calendar,
  Users,
  ShieldCheck,
  RefreshCw,
  Clock
} from 'lucide-react';
import { applicationsService, recruitmentService } from '../lib/dataService';

export default function ApplicationsAdmin() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [cycleFilter, setCycleFilter] = useState('all');

  // Recruitment Cycle State
  const [cycleConfig, setCycleConfig] = useState(null);
  const [cycleLoading, setCycleLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showRecreateModal, setShowRecreateModal] = useState(false);

  // Forms for modals
  const [configForm, setConfigForm] = useState({
    title: '',
    subtitle: '',
    target_years: '',
    deadline: '',
    closed_message: '',
    instructions: ''
  });

  const [recreateForm, setRecreateForm] = useState({
    title: 'Recruitment Drive 2026–2027',
    subtitle: 'Join the premier drone and robotics engineering club at ABES EC.',
    target_years: '1st & 2nd Year B.Tech Students',
    deadline: '2026-11-15',
    closed_message: 'Recruitment for Drones & Robotics Club is currently closed. Follow our announcements for updates on upcoming induction drives.',
    instructions: 'Please fill out your authentic academic and interest details. You may only apply once per recruitment cycle with your primary college email.'
  });

  // Selected detail modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsData, cycleData] = await Promise.all([
        applicationsService.getAll(),
        recruitmentService.getCycleConfig()
      ]);
      setApplications(appsData);
      setCycleConfig(cycleData);
      if (cycleData) {
        setConfigForm({
          title: cycleData.title || '',
          subtitle: cycleData.subtitle || '',
          target_years: cycleData.target_years || '',
          deadline: cycleData.deadline || '',
          closed_message: cycleData.closed_message || '',
          instructions: cycleData.instructions || ''
        });
      }
    } catch (err) {
      console.error('Failed to load applications / cycle data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Toggle cycle active status
  const handleToggleCycleStatus = async () => {
    if (!cycleConfig) return;
    setCycleLoading(true);
    try {
      const updated = await recruitmentService.updateCycleConfig({
        is_active: !cycleConfig.is_active
      });
      setCycleConfig(updated);
    } catch (err) {
      console.error('Failed to toggle recruitment status:', err);
    } finally {
      setCycleLoading(false);
    }
  };

  // Save Cycle Config
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setCycleLoading(true);
    try {
      const updated = await recruitmentService.updateCycleConfig(configForm);
      setCycleConfig(updated);
      setShowConfigModal(false);
    } catch (err) {
      console.error('Failed to update cycle config:', err);
    } finally {
      setCycleLoading(false);
    }
  };

  // Recreate / Launch New Cycle
  const handleRecreateCycle = async (e) => {
    e.preventDefault();
    setCycleLoading(true);
    try {
      const newCycle = await recruitmentService.recreateCycle(recreateForm);
      setCycleConfig(newCycle);
      setShowRecreateModal(false);
      // Reload applications
      const apps = await applicationsService.getAll();
      setApplications(apps);
    } catch (err) {
      console.error('Failed to recreate cycle:', err);
    } finally {
      setCycleLoading(false);
    }
  };

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
      const apps = await applicationsService.getAll();
      setApplications(apps);
    } catch (err) {
      console.error('Failed to delete application:', err);
    }
  };

  // Extract unique cycle IDs from applications
  const uniqueCycles = Array.from(new Set(applications.map(a => a.cycle_id || 'cycle-2026-2027')));

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesDomain = domainFilter === 'all' || app.domain === domainFilter;
    const appCycle = app.cycle_id || 'cycle-2026-2027';
    const matchesCycle = cycleFilter === 'all' || appCycle === cycleFilter;

    const q = search.toLowerCase();
    const matchesSearch = 
      app.name?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q) ||
      (app.student_id || app.studentId)?.toLowerCase().includes(q) ||
      app.branch?.toLowerCase().includes(q);

    return matchesStatus && matchesDomain && matchesCycle && matchesSearch;
  });

  const activeCycleAppsCount = applications.filter(
    a => (a.cycle_id || 'cycle-2026-2027') === cycleConfig?.id
  ).length;

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Recruitment &amp; Join Us Control</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Control live recruitment cycle availability, configure or recreate the candidate form, and triage submissions with email duplicate protection.
        </p>
      </div>

      {/* RECRUITMENT CYCLE CONTROL BANNER */}
      {cycleConfig && (
        <div 
          className="aesthetic-card" 
          style={{ 
            marginBottom: '2rem', 
            padding: '1.5rem 1.75rem',
            borderLeft: `4px solid ${cycleConfig.is_active ? 'var(--color-accent-emerald, #059669)' : '#dc2626'}`,
            background: 'var(--color-bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            {/* Left: Status & Details */}
            <div style={{ flex: '1', minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span 
                  className={`status-pill ${cycleConfig.is_active ? 'status-active' : 'status-closed'}`}
                  style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}
                >
                  <span className={`status-dot ${!cycleConfig.is_active ? 'status-dot-inactive' : ''}`}></span>
                  {cycleConfig.is_active ? 'RECRUITMENT ACTIVE (Open)' : 'RECRUITMENT INACTIVE (Closed)'}
                </span>

                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={14} color="var(--color-primary)" /> Duplicate email protection active
                </span>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--color-text-primary)' }}>
                {cycleConfig.title}
              </h2>

              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.825rem', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
                <span><strong>Target:</strong> {cycleConfig.target_years || 'All Batches'}</span>
                <span><strong>Deadline:</strong> {cycleConfig.deadline ? new Date(cycleConfig.deadline).toLocaleDateString() : 'Open'}</span>
                <span><strong>Active Cycle Submissions:</strong> <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{activeCycleAppsCount}</span></span>
              </div>
            </div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Toggle Active / Inactive */}
              <button
                type="button"
                disabled={cycleLoading}
                onClick={handleToggleCycleStatus}
                className="btn"
                style={{
                  fontSize: '0.85rem',
                  padding: '0.55rem 1.15rem',
                  background: cycleConfig.is_active ? '#fee2e2' : '#dcfce7',
                  color: cycleConfig.is_active ? '#991b1b' : '#166534',
                  border: `1px solid ${cycleConfig.is_active ? '#fca5a5' : '#86efac'}`
                }}
              >
                <Power size={15} />
                {cycleConfig.is_active ? 'Pause / Close Recruitment' : 'Activate / Open Recruitment'}
              </button>

              {/* Configure Form */}
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}
              >
                <Settings size={15} />
                Configure Form
              </button>

              {/* Recreate / Start New Cycle */}
              <button
                type="button"
                onClick={() => setShowRecreateModal(true)}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}
              >
                <PlusCircle size={15} />
                + Recreate / New Cycle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search candidate name, email, roll no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 1rem 0.6rem 2.4rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              fontSize: '0.875rem',
              color: 'var(--color-text-primary)'
            }}
          />
        </div>

        {/* Status filters */}
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          {['all', 'New', 'Under Review', 'Accepted', 'Rejected'].map(s => (
            <button
              key={s}
              type="button"
              className={`btn btn-secondary ${statusFilter === s ? 'btn-primary' : ''}`}
              onClick={() => setStatusFilter(s)}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
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
          <option value="None / Pure Management">Management Only</option>
        </select>

        {/* Cycle filter dropdown if multiple cycles exist */}
        {uniqueCycles.length > 1 && (
          <select
            value={cycleFilter}
            onChange={(e) => setCycleFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              fontSize: '0.85rem',
              color: 'var(--color-text-primary)'
            }}
          >
            <option value="all">All Cycles</option>
            {uniqueCycles.map(c => (
              <option key={c} value={c}>
                {c === cycleConfig?.id ? `Current (${c})` : `Archived (${c})`}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Applications Table */}
      <div className="aesthetic-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Academic Info</th>
                <th>Domain &amp; Role</th>
                <th>Cycle</th>
                <th>Status</th>
                <th>Application Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading applications...</td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                    No applicant records found for this filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => {
                  const appCycle = app.cycle_id || 'cycle-2026-2027';
                  const isCurrentCycle = appCycle === cycleConfig?.id;

                  return (
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
                        <span 
                          style={{ 
                            fontSize: '0.72rem', 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '4px',
                            background: isCurrentCycle ? 'rgba(2, 132, 199, 0.08)' : 'var(--color-bg-elevated)',
                            color: isCurrentCycle ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            fontWeight: 600
                          }}
                        >
                          {isCurrentCycle ? 'Current' : 'Archived'}
                        </span>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIGURE FORM MODAL */}
      {showConfigModal && (
        <div className="lightbox-backdrop" onClick={() => setShowConfigModal(false)}>
          <div 
            className="aesthetic-card" 
            style={{ maxWidth: '600px', width: '90%', maxHeight: '88vh', overflowY: 'auto', padding: '2rem' }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Configure Recruitment Form</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Customize live application titles, target batches, and candidate guidelines.
                </p>
              </div>
              <button onClick={() => setShowConfigModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveConfig}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Cycle Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={configForm.title}
                    onChange={e => setConfigForm(prev => ({ ...prev, title: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Form Subtitle
                  </label>
                  <input
                    type="text"
                    value={configForm.subtitle}
                    onChange={e => setConfigForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Target Academic Years
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1st & 2nd Year"
                      value={configForm.target_years}
                      onChange={e => setConfigForm(prev => ({ ...prev, target_years: e.target.value }))}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      value={configForm.deadline}
                      onChange={e => setConfigForm(prev => ({ ...prev, deadline: e.target.value }))}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Candidate Form Instructions
                  </label>
                  <textarea
                    rows="3"
                    value={configForm.instructions}
                    onChange={e => setConfigForm(prev => ({ ...prev, instructions: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)', fontFamily: 'inherit' }}
                  ></textarea>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Closed Message (shown when recruitment is inactive)
                  </label>
                  <textarea
                    rows="3"
                    value={configForm.closed_message}
                    onChange={e => setConfigForm(prev => ({ ...prev, closed_message: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)', fontFamily: 'inherit' }}
                  ></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowConfigModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={cycleLoading} className="btn btn-primary">
                  {cycleLoading ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECREATE / START NEW CYCLE MODAL */}
      {showRecreateModal && (
        <div className="lightbox-backdrop" onClick={() => setShowRecreateModal(false)}>
          <div 
            className="aesthetic-card" 
            style={{ maxWidth: '620px', width: '90%', maxHeight: '88vh', overflowY: 'auto', padding: '2rem' }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Recreate / Launch New Recruitment Cycle</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Start a fresh recruitment drive. Previous applicants remain preserved and students can apply to this new drive.
                </p>
              </div>
              <button onClick={() => setShowRecreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '0.85rem', background: 'rgba(2, 132, 199, 0.08)', borderRadius: '8px', border: '1px solid rgba(2, 132, 199, 0.2)', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--color-primary)' }}>
              <strong>Note:</strong> Recreating a recruitment cycle creates a new cycle identifier (e.g. for a new semester or recruitment drive). Students who applied previously can submit an application for this new cycle!
            </div>

            <form onSubmit={handleRecreateCycle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    New Cycle Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spring 2027 Recruitment Drive"
                    value={recreateForm.title}
                    onChange={e => setRecreateForm(prev => ({ ...prev, title: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Target Batches
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1st & 2nd Year"
                      value={recreateForm.target_years}
                      onChange={e => setRecreateForm(prev => ({ ...prev, target_years: e.target.value }))}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      New Application Deadline
                    </label>
                    <input
                      type="date"
                      value={recreateForm.deadline}
                      onChange={e => setRecreateForm(prev => ({ ...prev, deadline: e.target.value }))}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Candidate Guidelines / Notice
                  </label>
                  <textarea
                    rows="3"
                    value={recreateForm.instructions}
                    onChange={e => setRecreateForm(prev => ({ ...prev, instructions: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)', fontFamily: 'inherit' }}
                  ></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowRecreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={cycleLoading} className="btn btn-primary">
                  {cycleLoading ? 'Launching...' : 'Launch New Recruitment Cycle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <div>
                <strong>Cycle:</strong> {selectedApp.cycle_id || 'cycle-2026-2027'}
              </div>
              <div>
                <strong>Submitted:</strong> {selectedApp.created_at ? new Date(selectedApp.created_at).toLocaleString() : 'N/A'}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Statement of Interest:
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
