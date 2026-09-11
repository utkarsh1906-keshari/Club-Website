import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  X, 
  AlertTriangle,
  Award,
  RefreshCw,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { achievementsService } from '../lib/dataService';

export default function AchievementsAdmin() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Create / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    year: '2026',
    title: '',
    category: 'Competition Win',
    badge: '1st Prize',
    description: ''
  });

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Success alert
  const [successToast, setSuccessToast] = useState('');

  const categories = [
    'Competition Win',
    'Award',
    'Milestone',
    'Research Grant',
    'Hackathon Victory',
    'Institutional Honor'
  ];

  const loadAchievements = async () => {
    setLoading(true);
    try {
      const data = await achievementsService.getAll();
      setAchievements(data);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const triggerToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      year: new Date().getFullYear().toString(),
      title: '',
      category: 'Competition Win',
      badge: '1st Prize',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      year: item.year || new Date().getFullYear().toString(),
      title: item.title || '',
      category: item.category || 'Competition Win',
      badge: item.badge || '',
      description: item.description || item.desc || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter an achievement title.');
      return;
    }

    try {
      if (editingItem) {
        await achievementsService.update(editingItem.id, formData);
        triggerToast('Achievement updated successfully!');
      } else {
        await achievementsService.create(formData);
        triggerToast('New achievement added successfully!');
      }
      setIsModalOpen(false);
      loadAchievements();
    } catch (err) {
      console.error('Error saving achievement:', err);
      alert('Failed to save achievement: ' + err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await achievementsService.delete(deleteTarget.id);
      setDeleteTarget(null);
      triggerToast('Achievement removed successfully.');
      loadAchievements();
    } catch (err) {
      console.error('Error deleting achievement:', err);
      alert('Failed to delete achievement: ' + err.message);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Restore official default club achievements? This will refresh any missing milestones.')) {
      return;
    }
    setLoading(true);
    try {
      await achievementsService.resetDefaults();
      triggerToast('Restored official default achievements.');
      loadAchievements();
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = achievements.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const q = search.toLowerCase();
    const titleMatch = (item.title || '').toLowerCase().includes(q);
    const descMatch = (item.description || item.desc || '').toLowerCase().includes(q);
    const yearMatch = (item.year || '').toString().includes(q);
    const badgeMatch = (item.badge || '').toLowerCase().includes(q);
    return matchesCat && (titleMatch || descMatch || yearMatch || badgeMatch);
  });

  return (
    <div className="admin-page-container">
      {/* Toast Notification */}
      {successToast && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          zIndex: 9999,
          background: '#10b981',
          color: '#ffffff',
          padding: '0.85rem 1.4rem',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Trophy size={28} color="var(--color-primary)" />
            Achievements &amp; Milestones
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', margin: '0.35rem 0 0 0' }}>
            Add, update, or remove collegiate UAV victories, research grants, and club honors displayed on the public site.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', gap: '0.4rem' }}
            title="Restore official sample milestones"
          >
            <RefreshCw size={14} /> Restore Defaults
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem', gap: '0.4rem' }}
          >
            <Plus size={16} /> Add Achievement
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        background: 'var(--color-bg-surface)',
        padding: '0.85rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid var(--color-border)'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search by title, year, or grant..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.85rem 0.5rem 2.35rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-base)',
              fontSize: '0.85rem'
            }}
          />
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginRight: '0.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Filter size={12} /> Category:
          </span>
          <button
            type="button"
            className={`btn btn-secondary ${selectedCategory === 'all' ? 'btn-primary' : ''}`}
            onClick={() => setSelectedCategory('all')}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          >
            All ({achievements.length})
          </button>
          {categories.map(cat => {
            const count = achievements.filter(a => a.category === cat).length;
            if (count === 0 && selectedCategory !== cat) return null;
            return (
              <button
                key={cat}
                type="button"
                className={`btn btn-secondary ${selectedCategory === cat ? 'btn-primary' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievements Cards List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading achievements...</p>
        </div>
      ) : filteredAchievements.length === 0 ? (
        <div className="aesthetic-card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Trophy size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>No achievements match your search</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', margin: '0 0 1.25rem 0' }}>
            Try resetting your search filter or click below to add a new achievement.
          </p>
          <button onClick={handleOpenCreate} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            <Plus size={15} /> Add First Achievement
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAchievements.map(item => (
            <div 
              key={item.id} 
              className="aesthetic-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.6rem',
                gap: '1.25rem',
                flexWrap: 'wrap',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                border: '1px solid var(--color-border)'
              }}
            >
              {/* Left Column: Trophy Icon & Year */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', flex: '1 1 500px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  background: 'rgba(2, 132, 199, 0.1)',
                  border: '1px solid rgba(2, 132, 199, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Trophy size={24} color="var(--color-primary)" />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      background: 'var(--color-bg-base)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {item.year}
                    </span>

                    <span className="tag-pill" style={{ fontSize: '0.75rem', padding: '0.15rem 0.55rem' }}>
                      {item.category}
                    </span>

                    {item.badge && (
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        background: 'rgba(245, 158, 11, 0.12)',
                        color: '#d97706',
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: 'var(--color-text-primary)' }}>
                    {item.title}
                  </h3>

                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {item.description || item.desc}
                  </p>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem', gap: '0.35rem' }}
                >
                  <Edit size={14} /> Change / Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem', color: '#dc2626', borderColor: '#fca5a5' }}
                  title="Remove this achievement"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="lightbox-backdrop" onClick={() => setIsModalOpen(false)}>
          <div 
            className="aesthetic-card" 
            style={{ maxWidth: '560px', width: '92%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Trophy size={22} color="var(--color-primary)" />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
                  {editingItem ? 'Change / Edit Achievement' : 'Add New Achievement'}
                </h2>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              {/* Year & Category Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', marginBottom: '1.15rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Year *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026"
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem', background: 'var(--color-bg-base)' }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Other">Other Category</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div style={{ marginBottom: '1.15rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Achievement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1st Place – National Collegiate UAV Grand Challenge"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
                />
              </div>

              {/* Badge / Honor Tag */}
              <div style={{ marginBottom: '1.15rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Honor Badge / Rank Label <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1st Prize, Gold Medal, Grant Funded, Special Mention"
                  value={formData.badge}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Description &amp; Highlights *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Summarize the competition win, challenge scope, team members involved, or technologies recognized..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.88rem', lineHeight: 1.5 }}
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.4rem' }}
                >
                  {editingItem ? 'Save Changes' : 'Publish Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="lightbox-backdrop" onClick={() => setDeleteTarget(null)}>
          <div 
            className="aesthetic-card" 
            style={{ maxWidth: '440px', width: '90%', padding: '1.75rem', textAlign: 'center' }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem auto'
            }}>
              <AlertTriangle size={26} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Remove Achievement?</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to remove <strong>&ldquo;{deleteTarget.title}&rdquo;</strong>? This milestone will no longer appear on the public Achievements page.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn"
                style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '0.5rem 1.25rem' }}
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
