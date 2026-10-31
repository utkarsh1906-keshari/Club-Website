import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  X, 
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { announcementsService } from '../lib/dataService';

export default function AnnouncementsAdmin() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    badge: 'Recruitment',
    link_url: '/join',
    is_active: true,
    expires_at: ''
  });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await announcementsService.getAll(false);
      setAnnouncements(data);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleOpenCreate = () => {
    setFormError('');
    setEditingAnn(null);
    setFormData({
      title: '',
      content: '',
      badge: 'Recruitment',
      link_url: '/join',
      is_active: true,
      expires_at: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann) => {
    setFormError('');
    setEditingAnn(ann);
    setFormData({
      title: ann.title || '',
      content: ann.content || '',
      badge: ann.badge || '',
      link_url: ann.link_url || '',
      is_active: ann.is_active !== false,
      expires_at: ann.expires_at ? ann.expires_at.split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      if (editingAnn) {
        if (!editingAnn.id) {
          throw new Error('Missing announcement ID for update');
        }
        const updated = await announcementsService.update(editingAnn.id, formData);
        if (updated) {
          setAnnouncements(prev => prev.map(a => (a.id === editingAnn.id ? updated : a)));
        }
      } else {
        const created = await announcementsService.create(formData);
        if (created) {
          setAnnouncements(prev => [created, ...prev.filter(a => a.id !== created.id)]);
        }
      }
      setIsModalOpen(false);
      loadAnnouncements();
    } catch (err) {
      console.error('Failed to save announcement:', err);
      setFormError(err.message || 'Error saving announcement. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (ann) => {
    if (!ann?.id) return;
    try {
      const updated = await announcementsService.update(ann.id, { is_active: !ann.is_active });
      if (updated) {
        setAnnouncements(prev => prev.map(a => (a.id === ann.id ? updated : a)));
      }
    } catch (err) {
      console.error('Failed to toggle active state:', err);
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    if (!deleteTarget.id) {
      setDeleteError('Missing announcement ID for deletion');
      return;
    }
    setDeleteError('');
    try {
      await announcementsService.delete(deleteTarget.id);
      setAnnouncements(prev => prev.filter(a => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete announcement:', err);
      setDeleteError(err.message || 'Failed to delete announcement');
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Homepage Announcements</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Broadcast recruitment deadlines, workshop registration alerts, and urgent notices to the website banner.
          </p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary" style={{ gap: '0.4rem' }}>
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {/* Table */}
      <div className="aesthetic-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Notice Title &amp; Details</th>
                <th>Badge</th>
                <th>Target Link</th>
                <th>Status</th>
                <th>Expires</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading announcements...</td>
                </tr>
              ) : announcements.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                    No announcements created. Click "+ New Announcement" to publish one.
                  </td>
                </tr>
              ) : (
                announcements.map(ann => (
                  <tr key={ann.id}>
                    <td>
                      <strong>{ann.title}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                        {ann.content}
                      </div>
                    </td>
                    <td>
                      <span className="tag-pill">{ann.badge}</span>
                    </td>
                    <td>
                      {ann.link_url ? (
                        <a href={ann.link_url} style={{ fontSize: '0.82rem', color: 'var(--color-primary)' }}>
                          {ann.link_url}
                        </a>
                      ) : '—'}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(ann)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        {ann.is_active ? (
                          <span className="tag-pill" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span className="tag-pill" style={{ background: '#f1f5f9', color: '#64748b' }}>
                            <XCircle size={12} /> Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {ann.expires_at ? new Date(ann.expires_at).toLocaleDateString() : 'Never'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          onClick={() => handleOpenEdit(ann)}
                          className="btn btn-secondary" 
                          style={{ padding: '0.35rem 0.6rem' }} 
                          title="Edit announcement"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => setDeleteTarget(ann)}
                          className="btn btn-secondary" 
                          style={{ padding: '0.35rem 0.6rem', color: '#dc2626' }} 
                          title="Delete announcement"
                        >
                          <Trash2 size={14} />
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

      {/* Modal */}
      {isModalOpen && (
        <div className="lightbox-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="aesthetic-card" style={{ maxWidth: '560px', width: '90%', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem' }}>{editingAnn ? 'Edit Announcement' : 'New Announcement'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formError && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    lineHeight: 1.4
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ wordBreak: 'break-word' }}>{formError}</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  placeholder="e.g. Recruitment Cycle 2026–2027 is Live!"
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Description / Content *</label>
                <textarea
                  rows="2"
                  required
                  value={formData.content}
                  placeholder="Details visible on hover or banner..."
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Badge Label</label>
                  <input
                    type="text"
                    value={formData.badge}
                    placeholder="Recruitment, Workshop, Alert"
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Destination Link</label>
                  <input
                    type="text"
                    value={formData.link_url}
                    placeholder="/join or /events"
                    onChange={e => setFormData({ ...formData, link_url: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={e => setFormData({ ...formData, expires_at: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div style={{ paddingTop: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <span>Active on Homepage</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingAnn ? 'Save Changes' : 'Create Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="lightbox-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="aesthetic-card" style={{ maxWidth: '400px', width: '90%', padding: '2rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <AlertTriangle size={40} color="#dc2626" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Announcement?</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>?
            </p>
            {deleteError && (
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  textAlign: 'left',
                  wordBreak: 'break-word'
                }}
              >
                {deleteError}
              </div>
            )}
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
