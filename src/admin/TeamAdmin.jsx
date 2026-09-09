import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import { membersService } from '../lib/dataService';

export default function TeamAdmin() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
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
    sort_order: 10
  });

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const mList = await membersService.getAll();
      setMembers(mList);
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
    setFormData({
      name: '',
      role: 'Domain Coordinator',
      designation: 'Technical Coordinator',
      category: 'technical',
      department: 'Technical Verticals',
      domain_id: 'ai-ml',
      image_url: '',
      badge: 'Domain Lead',
      bio: 'Mentoring student projects and leading domain workshops.',
      github_url: 'https://github.com',
      linkedin_url: 'https://linkedin.com',
      sort_order: members.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMember(m);
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
      sort_order: m.sort_order || 10
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      sort_order: parseInt(formData.sort_order || '10', 10)
    };

    try {
      if (editingMember) {
        await membersService.update(editingMember.id, payload);
      } else {
        await membersService.create(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save team member:', err);
      alert('Error saving member: ' + err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await membersService.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  const filteredMembers = members.filter(m => {
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

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            className={`btn btn-secondary ${categoryFilter === 'all' ? 'btn-primary' : ''}`}
            onClick={() => setCategoryFilter('all')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
          >
            All Members ({members.length})
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${categoryFilter === 'leadership' ? 'btn-primary' : ''}`}
            onClick={() => setCategoryFilter('leadership')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
          >
            Executive Leadership ({members.filter(m => m.category === 'leadership').length})
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${categoryFilter === 'technical' ? 'btn-primary' : ''}`}
            onClick={() => setCategoryFilter('technical')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
          >
            Technical Leads ({members.filter(m => m.category === 'technical').length})
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${categoryFilter === 'management' ? 'btn-primary' : ''}`}
            onClick={() => setCategoryFilter('management')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
          >
            Creative &amp; Management ({members.filter(m => m.category === 'management').length})
          </button>
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
                        />
                        <div>
                          <strong>{m.name}</strong>
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
                        background: m.category === 'leadership' ? '#eff6ff' : m.category === 'technical' ? '#f0fdf4' : '#fefce8',
                        color: m.category === 'leadership' ? '#1d4ed8' : m.category === 'technical' ? '#15803d' : '#a16207'
                      }}>
                        {m.category.toUpperCase()}
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
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Category *</label>
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Photo / Avatar URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  placeholder="/abes/vishal.jpeg or https://..."
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMember ? 'Save Changes' : 'Add Member'}
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