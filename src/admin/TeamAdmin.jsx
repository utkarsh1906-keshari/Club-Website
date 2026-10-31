import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  X, 
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { membersService, domainsService, DEFAULT_TEAM_CATEGORIES } from '../lib/dataService';
import ImageUpload from '../components/ImageUpload';

export default function TeamAdmin() {
  const [members, setMembers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [categories] = useState(DEFAULT_TEAM_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    designation: '',
    category: 'technical',
    department: 'Technical & Hardware',
    domain_id: '',
    image_url: '',
    badge: 'Core Team',
    bio: '',
    github_url: '',
    linkedin_url: '',
    sort_order: 100
  });

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [mList, dList] = await Promise.all([
        membersService.getAll(),
        domainsService.getAll()
      ]);
      const safeMembers = import.meta.env.PROD
        ? mList.filter(m => !String(m.id).startsWith('mem-') && !m.isDemo)
        : mList;
      setMembers(safeMembers);
      setDomains(dList);
    } catch (err) {
      console.error('Failed to load roster:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormError('');
    setFormData({
      name: '',
      role: 'Domain Coordinator',
      designation: 'Technical Coordinator',
      category: 'technical',
      department: 'Technical Verticals',
      domain_id: '',
      image_url: '',
      badge: 'Domain Lead',
      bio: 'Mentoring student projects and leading domain workshops.',
      github_url: 'https://github.com',
      linkedin_url: 'https://linkedin.com',
      sort_order: 100
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m) => {
    if (import.meta.env.PROD && (String(m.id).startsWith('mem-') || m.isDemo)) {
      alert('Local demo items cannot be edited in production.');
      return;
    }
    setEditingMember(m);
    setFormError('');
    setFormData({
      name: m.name || '',
      role: m.role || '',
      designation: m.designation || '',
      category: m.category || 'technical',
      department: m.department || '',
      domain_id: m.domain_id || '',
      image_url: m.image_url || m.image || '',
      badge: m.badge || '',
      bio: m.bio || '',
      github_url: m.github_url || '',
      linkedin_url: m.linkedin_url || '',
      sort_order: m.sort_order ?? 100
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    const payload = {
      name: formData.name,
      role: formData.role,
      designation: formData.designation,
      category: formData.category,
      department: formData.department,
      domain_id: formData.domain_id || null,
      image_url: formData.image_url,
      badge: formData.badge,
      bio: formData.bio,
      github_url: formData.github_url,
      linkedin_url: formData.linkedin_url,
      sort_order: parseInt(formData.sort_order ?? 100, 10) || 100
    };

    try {
      if (editingMember) {
        if (!editingMember.id) throw new Error('Missing member ID for update');
        const updated = await membersService.update(editingMember.id, payload);
        if (updated) {
          setMembers(prev => prev.map(m => m.id === editingMember.id ? updated : m));
        }
      } else {
        const created = await membersService.create(payload);
        if (created) {
          setMembers(prev => [...prev.filter(m => m.id !== created.id), created]);
        }
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save team member:', err);
      setFormError(err.message || 'Error saving member. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    if (!deleteTarget.id) {
      setDeleteError('Missing member ID for deletion');
      return;
    }
    if (import.meta.env.PROD && (String(deleteTarget.id).startsWith('mem-') || deleteTarget.isDemo)) {
      setDeleteError('Local demo items cannot be deleted in production.');
      return;
    }
    setDeleteError('');
    try {
      await membersService.delete(deleteTarget.id);
      setMembers(prev => prev.filter(m => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete member:', err);
      setDeleteError(err.message || 'Failed to delete member');
    }
  };

  const filteredMembers = members.filter(m => {
    if (import.meta.env.PROD && (String(m.id).startsWith('mem-') || m.isDemo)) {
      return false;
    }
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    const q = search.toLowerCase();
    const matchesSearch = 
      m.name?.toLowerCase().includes(q) ||
      m.role?.toLowerCase().includes(q) ||
      m.department?.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Team &amp; Roster Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Manage faculty coordinators, student executive council, technical vertical leads, and creative teams.
          </p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary" style={{ gap: '0.4rem' }}>
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Filter and Search */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search member by name or role..."
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

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className={`btn btn-secondary ${categoryFilter === 'all' ? 'btn-primary' : ''}`}
            onClick={() => setCategoryFilter('all')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
          >
            All Members ({members.length})
          </button>
          {categories.map(cat => {
            const count = members.filter(m => m.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                className={`btn btn-secondary ${categoryFilter === cat.id ? 'btn-primary' : ''}`}
                onClick={() => setCategoryFilter(cat.id)}
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Members Table */}
      <div className="aesthetic-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member Name &amp; Photo</th>
                <th>Designation / Role</th>
                <th>Category</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading roster...</td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                    No members found. Click "+ Add Member" to add one.
                  </td>
                </tr>
              ) : (
                filteredMembers.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={m.image_url || m.image || '/club-emblem.png'} 
                          alt="" 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', background: 'var(--color-bg-elevated)' }} 
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/club-emblem.png';
                          }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <strong>{m.name}</strong>
                            {import.meta.env.DEV && m.isDemo && (
                              <span className="tag-pill" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', fontSize: '0.68rem', padding: '0.1rem 0.35rem' }}>
                                Local demo mode
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {m.badge}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{m.designation || m.role}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {m.role}
                      </div>
                    </td>
                    <td>
                      <span className="tag-pill" style={{
                        background: m.category === 'leadership' ? '#eff6ff' : m.category === 'technical' ? '#f0fdf4' : m.category === 'management' ? '#fefce8' : '#f3e8ff',
                        color: m.category === 'leadership' ? '#1d4ed8' : m.category === 'technical' ? '#15803d' : m.category === 'management' ? '#a16207' : '#7e22ce'
                      }}>
                        {(categories.find(c => c.id === m.category)?.label || m.category || '').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span>{m.department}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          onClick={() => handleOpenEdit(m)}
                          className="btn btn-secondary" 
                          style={{ padding: '0.35rem 0.6rem' }} 
                          title="Edit member"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => setDeleteTarget(m)}
                          className="btn btn-secondary" 
                          style={{ padding: '0.35rem 0.6rem', color: '#dc2626' }} 
                          title="Delete member"
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="lightbox-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="aesthetic-card" style={{ maxWidth: '650px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem' }}>{editingMember ? 'Edit Member Details' : 'Add Team Member'}</h2>
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  placeholder="e.g. Asra Kamal"
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  >
                    <option value="leadership">Club Leadership</option>
                    <option value="technical">Technical Domain Lead</option>
                    <option value="management">Creative &amp; Management Team</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Technical Domain (Optional)</label>
                  <select
                    value={formData.domain_id || ''}
                    onChange={e => setFormData({ ...formData, domain_id: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  >
                    <option value="">None / Club-wide</option>
                    {domains.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Role Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    placeholder="e.g. Research Head or General Secretary"
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    placeholder="e.g. Research Head - AI & Perception"
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Department / Branch</label>
                  <input
                    type="text"
                    value={formData.department}
                    placeholder="e.g. Research & Innovation or Dept. of ECE"
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Badge (Optional)</label>
                  <input
                    type="text"
                    value={formData.badge}
                    placeholder="e.g. Domain Lead or Core Team"
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <ImageUpload
                label="Member Profile Photo"
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                fallbackImage="/club-emblem.png"
                shape="circle"
                presets={[
                  { label: 'Club Emblem', url: '/club-emblem.png' },
                  { label: 'Vishal', url: '/abes/vishal.jpeg' },
                  { label: 'Ayush Tyagi', url: '/abes/ayush-tyagi.jpeg' },
                  { label: 'Shreya Vishwakarma', url: '/abes/shreya-vishwakarma.webp' }
                ]}
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Short Bio</label>
                <textarea
                  rows="2"
                  value={formData.bio}
                  placeholder="Summary of engineering focus and mentorship..."
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>GitHub URL</label>
                  <input
                    type="url"
                    value={formData.github_url}
                    placeholder="https://github.com/..."
                    onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    placeholder="https://linkedin.com/in/..."
                    onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 100 })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingMember ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="lightbox-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="aesthetic-card" style={{ maxWidth: '420px', width: '90%', padding: '2rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <AlertTriangle size={42} color="#dc2626" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Remove Member?</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to remove <strong>{deleteTarget.name}</strong> from the club roster?
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
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}