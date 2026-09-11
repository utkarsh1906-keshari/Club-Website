import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  ExternalLink, 
  X, 
  AlertTriangle,
  Power,
  SlidersHorizontal,
  Plus,
  Check,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';
import { applicationsService, recruitmentService, DEFAULT_FORM_QUESTIONS } from '../lib/dataService';

export default function ApplicationsAdmin() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');

  // Recruitment Status & Questions
  const [cycleConfig, setCycleConfig] = useState(null);
  const [cycleLoading, setCycleLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);

  // New question form state
  const [newQuestion, setNewQuestion] = useState({
    label: '',
    type: 'text',
    required: false,
    optionsStr: ''
  });

  // Selected detail modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsData, cycleData, questionsData] = await Promise.all([
        applicationsService.getAll(),
        recruitmentService.getCycleConfig(),
        recruitmentService.getQuestions()
      ]);
      setApplications(appsData);
      setCycleConfig(cycleData);
      setQuestions(questionsData || DEFAULT_FORM_QUESTIONS);
    } catch (err) {
      console.error('Failed to load applications / questions data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Single-click toggle: Open / Close joining application
  const handleToggleCycleStatus = async () => {
    if (!cycleConfig) return;
    setCycleLoading(true);
    try {
      const willBeActive = !cycleConfig.is_active;
      const updates = {
        is_active: willBeActive,
        updated_at: new Date().toISOString()
      };

      // Option 1: When reopening portal from closed to open, start a fresh round
      // so all students can apply afresh without old browser lockouts
      if (willBeActive) {
        const timestamp = Date.now();
        updates.id = `cycle-${timestamp}`;
        updates.opened_at = new Date().toISOString();
        const currentRound = cycleConfig.round_number || 1;
        updates.round_number = currentRound + 1;
        updates.title = `Recruitment Drive (Round ${updates.round_number})`;
      }

      const updated = await recruitmentService.updateCycleConfig(updates);
      setCycleConfig(updated);
      const apps = await applicationsService.getAll();
      setApplications(apps);
    } catch (err) {
      console.error('Failed to toggle recruitment status:', err);
    } finally {
      setCycleLoading(false);
    }
  };

  // Dedicated button to start a new recruitment round/drive explicitly
  const handleStartNewRound = async () => {
    if (!window.confirm('Start a new recruitment round? All previous application records will remain safely saved in your database, and students will be able to apply afresh.')) {
      return;
    }
    setCycleLoading(true);
    try {
      const timestamp = Date.now();
      const nextRound = (cycleConfig?.round_number || 1) + 1;
      const updated = await recruitmentService.updateCycleConfig({
        id: `cycle-${timestamp}`,
        is_active: true,
        round_number: nextRound,
        title: `Recruitment Drive (Round ${nextRound})`,
        opened_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setCycleConfig(updated);
      const apps = await applicationsService.getAll();
      setApplications(apps);
    } catch (err) {
      console.error('Failed to start new round:', err);
    } finally {
      setCycleLoading(false);
    }
  };

  // Add a new question to the application form
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.label.trim()) return;

    try {
      const options = newQuestion.type === 'select'
        ? newQuestion.optionsStr.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const updated = await recruitmentService.addQuestion({
        label: newQuestion.label.trim(),
        type: newQuestion.type,
        required: newQuestion.required,
        options
      });
      setQuestions(updated);
      setNewQuestion({
        label: '',
        type: 'text',
        required: false,
        optionsStr: ''
      });
    } catch (err) {
      console.error('Failed to add question:', err);
    }
  };

  // Remove a question from the application form
  const handleRemoveQuestion = async (questionId) => {
    try {
      const updated = await recruitmentService.removeQuestion(questionId);
      setQuestions(updated);
    } catch (err) {
      console.error('Failed to remove question:', err);
    }
  };

  // Toggle active/inactive for any question
  const handleToggleQuestion = async (questionId) => {
    try {
      const updated = await recruitmentService.toggleQuestion(questionId);
      setQuestions(updated);
    } catch (err) {
      console.error('Failed to toggle question:', err);
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

  const activeQuestionsCount = questions.filter(q => q.active !== false).length;

  return (
    <div className="admin-page-container">
      {/* Top Header */}
      <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Join Us Applications</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Open or close the joining portal and customize application form questions.
        </p>
      </div>

      {/* ULTRA-CLEAN CONTROL BAR: Open/Close & Form Questions Only */}
      {cycleConfig && (
        <div 
          className="aesthetic-card" 
          style={{ 
            marginBottom: '1.75rem', 
            padding: '1.15rem 1.6rem',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg, 14px)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Left: Status & Round */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
                Joining Applications
              </h2>
              <span 
                className={`status-pill ${cycleConfig.is_active ? 'status-active' : 'status-closed'}`}
                style={{ fontSize: '0.78rem', padding: '0.25rem 0.75rem' }}
              >
                <span className={`status-dot ${!cycleConfig.is_active ? 'status-dot-inactive' : ''}`}></span>
                {cycleConfig.is_active ? `Open • Round ${cycleConfig.round_number || 1}` : 'Closed'}
              </span>
            </div>

            {/* Right: Toggle Open/Close, New Round & Question Manager */}
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Open / Close Button */}
              <button
                type="button"
                disabled={cycleLoading}
                onClick={handleToggleCycleStatus}
                className="btn btn-secondary"
                style={{
                  fontSize: '0.85rem',
                  padding: '0.5rem 1.1rem',
                  fontWeight: 600,
                  color: cycleConfig.is_active ? '#dc2626' : '#166534',
                  border: `1px solid ${cycleConfig.is_active ? '#fca5a5' : '#86efac'}`,
                  background: cycleConfig.is_active ? '#fee2e2' : '#dcfce7'
                }}
              >
                <Power size={14} />
                {cycleConfig.is_active ? 'Close Applications' : 'Open Applications (New Round)'}
              </button>

              {/* Start New Round Button */}
              <button
                type="button"
                disabled={cycleLoading}
                onClick={handleStartNewRound}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 0.95rem', gap: '0.35rem' }}
                title="Start a new recruitment round while keeping previous submissions saved"
              >
                <RotateCcw size={13} />
                New Round
              </button>

              {/* Manage Form Questions */}
              <button
                type="button"
                onClick={() => setShowQuestionsModal(true)}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1.15rem', gap: '0.45rem' }}
              >
                <SlidersHorizontal size={14} />
                Form Questions ({activeQuestionsCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
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
                <th>Status</th>
                <th>Date</th>
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
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                    No applicant records found.
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <strong>{app.name}</strong>
                        {app.is_updated && (
                          <span style={{
                            fontSize: '0.68rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: '#2563eb',
                            fontWeight: 600
                          }}>
                            Updated
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {app.email}
                      </div>
                    </td>
                    <td>
                      <div>{app.branch} ({app.year})</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Admission No: {app.student_id || app.studentId || 'N/A'}
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

      {/* MANAGE FORM QUESTIONS MODAL */}
      {showQuestionsModal && (
        <div className="lightbox-backdrop" onClick={() => setShowQuestionsModal(false)}>
          <div 
            className="aesthetic-card" 
            style={{ maxWidth: '640px', width: '92%', maxHeight: '88vh', overflowY: 'auto', padding: '2rem' }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>Manage Form Questions</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                  Add custom questions or remove extra questions from the student joining application.
                </p>
              </div>
              <button onClick={() => setShowQuestionsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Active Questions List */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                Current Application Questions ({questions.length})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {questions.map((q, idx) => (
                  <div 
                    key={q.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: q.active === false ? 'var(--color-bg-base)' : 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      opacity: q.active === false ? 0.6 : 1
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', width: '20px' }}>
                        {idx + 1}.
                      </span>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {q.label}
                          {q.required && <span style={{ color: '#dc2626', marginLeft: '3px' }}>*</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                          <span style={{ textTransform: 'capitalize' }}>Type: {q.type}</span>
                          <span>&bull;</span>
                          <span>{q.required ? 'Required' : 'Optional'}</span>
                          {q.options && q.options.length > 0 && (
                            <>
                              <span>&bull;</span>
                              <span>{q.options.length} options</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Question Actions */}
                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                      {/* Toggle visibility */}
                      <button
                        type="button"
                        onClick={() => handleToggleQuestion(q.id)}
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }}
                        title={q.active === false ? 'Enable question' : 'Disable question'}
                      >
                        {q.active === false ? <EyeOff size={13} color="#94a3b8" /> : <Eye size={13} color="var(--color-primary)" />}
                      </button>

                      {/* Remove question */}
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.55rem', color: '#dc2626' }}
                        title="Remove question from form"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ADD NEW QUESTION SECTION */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.75rem' }}>
                + Add a Question to Application
              </div>

              <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Question Label / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WhatsApp Phone Number, Prior Drone Experience, Resume Link"
                    value={newQuestion.label}
                    onChange={e => setNewQuestion(prev => ({ ...prev, label: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                      Field Type
                    </label>
                    <select
                      value={newQuestion.type}
                      onChange={e => setNewQuestion(prev => ({ ...prev, type: e.target.value }))}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}
                    >
                      <option value="text">Short Text</option>
                      <option value="textarea">Paragraph / Long Text</option>
                      <option value="select">Dropdown Choice</option>
                      <option value="url">Website / Portfolio URL</option>
                      <option value="tel">Phone / Contact Number</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}>
                      <input
                        type="checkbox"
                        checked={newQuestion.required}
                        onChange={e => setNewQuestion(prev => ({ ...prev, required: e.target.checked }))}
                        style={{ width: '16px', height: '16px' }}
                      />
                      Required Question
                    </label>
                  </div>
                </div>

                {newQuestion.type === 'select' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                      Dropdown Options (comma separated) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Beginner, Intermediate, Advanced"
                      value={newQuestion.optionsStr}
                      onChange={e => setNewQuestion(prev => ({ ...prev, optionsStr: e.target.value }))}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                    <Plus size={15} /> Add to Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CANDIDATE DETAILS MODAL */}
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
                <strong>Admission Number:</strong> {selectedApp.student_id || selectedApp.studentId || 'N/A'}
              </div>
              <div>
                <strong>Branch:</strong> {selectedApp.branch || 'N/A'}
              </div>
              <div>
                <strong>Year:</strong> {selectedApp.year || 'N/A'}
              </div>
              <div>
                <strong>Submitted:</strong> {selectedApp.created_at ? new Date(selectedApp.created_at).toLocaleString() : 'N/A'}
              </div>
            </div>

            {selectedApp.reason && (
              <div style={{ marginBottom: '1.25rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Why do you want to join?
                </strong>
                <div style={{ padding: '1rem', background: 'var(--color-bg-elevated)', borderRadius: '8px', fontSize: '0.925rem', lineHeight: 1.55 }}>
                  {selectedApp.reason}
                </div>
              </div>
            )}

            {selectedApp.portfolio_url && (
              <div style={{ marginBottom: '1.25rem' }}>
                <strong>Portfolio / Link:</strong>{' '}
                <a href={selectedApp.portfolio_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                  {selectedApp.portfolio_url} <ExternalLink size={13} style={{ display: 'inline' }} />
                </a>
              </div>
            )}

            {/* Custom answers if candidate answered extra questions */}
            {selectedApp.custom_answers && Object.keys(selectedApp.custom_answers).length > 0 && (
              <div style={{ marginBottom: '1.25rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  Additional Question Answers:
                </strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.entries(selectedApp.custom_answers).map(([key, val]) => (
                    <div key={key} style={{ padding: '0.6rem 0.85rem', background: 'var(--color-bg-base)', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{key}: </span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{val || 'N/A'}</span>
                    </div>
                  ))}
                </div>
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
