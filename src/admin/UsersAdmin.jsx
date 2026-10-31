import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Edit, 
  Trash2, 
  Crown, 
  Layers, 
  Calendar, 
  Image as ImageIcon, 
  X, 
  AlertTriangle,
  AlertCircle,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const DEFAULT_USERS = [
  {
    id: 'u-1',
    name: 'Ms. Unnati Mehta',
    email: 'unnati.mehta@abes.ac.in',
    role: 'super_admin',
    domain_scope: null,
    is_active: true
  },
  {
    id: 'u-2',
    name: 'Executive Club Leadership',
    email: 'leadership@droneandrobotics.club',
    role: 'super_admin',
    domain_scope: null,
    is_active: true
  },
  {
    id: 'u-3',
    name: 'Asra Kamal',
    email: 'asra.aiml@abes.ac.in',
    role: 'domain_lead',
    domain_scope: 'ai-ml',
    is_active: true
  },
  {
    id: 'u-4',
    name: 'Akshat Modanwal',
    email: 'akshat.vlsi@abes.ac.in',
    role: 'domain_lead',
    domain_scope: 'vlsi',
    is_active: true
  },
  {
    id: 'u-5',
    name: 'Pratham Singh',
    email: 'pratham.events@abes.ac.in',
    role: 'event_manager',
    domain_scope: null,
    is_active: true
  },
  {
    id: 'u-6',
    name: 'Divyansh Goel',
    email: 'divyansh.media@abes.ac.in',
    role: 'social_media',
    domain_scope: null,
    is_active: true
  }
];

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'domain_lead',
    domain_scope: 'ai-ml',
    is_active: true
  });
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setPageError(null);
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id, auth_user_id, name, email, role, domain_scope, is_active, created_at')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Supabase admin_users fetch error:', error);
          if (import.meta.env.PROD) {
            setPageError(error.message || 'Failed to fetch admin users from database.');
            setLoading(false);
            return;
          }
        } else if (data && data.length > 0) {
          setUsers(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Failed to load admin users:', err);
        if (import.meta.env.PROD) {
          setPageError(err.message || 'Failed to fetch admin users from database.');
          setLoading(false);
          return;
        }
      }
    }

    if (import.meta.env.DEV) {
      try {
        const saved = localStorage.getItem('drc_admin_users');
        setUsers(saved ? JSON.parse(saved) : DEFAULT_USERS);
      } catch {
        setUsers(DEFAULT_USERS);
      }
    } else {
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'domain_lead',
      domain_scope: 'ai-ml',
      is_active: true
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData({
      name: u.name || '',
      email: u.email || '',
      role: u.role || 'domain_lead',
      domain_scope: u.domain_scope || 'ai-ml',
      is_active: u.is_active !== undefined ? Boolean(u.is_active) : true
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const cleanName = (formData.name || '').trim();
    const cleanEmail = (formData.email || '').trim().toLowerCase();

    if (!cleanName) {
      setFormError('Name is required.');
      setSaving(false);
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setFormError('A valid email address is required.');
      setSaving(false);
      return;
    }

    const payload = {
      name: cleanName,
      email: cleanEmail,
      role: formData.role,
      domain_scope: formData.role === 'domain_lead' ? (formData.domain_scope || null) : null,
      is_active: Boolean(formData.is_active)
    };

    if (supabase) {
      try {
        if (editingUser) {
          const { data, error } = await supabase
            .from('admin_users')
            .update(payload)
            .eq('id', editingUser.id)
            .select()
            .single();

          if (error) throw error;
          setUsers(prev => prev.map(u => u.id === editingUser.id ? data : u));
        } else {
          const { data, error } = await supabase
            .from('admin_users')
            .insert([payload])
            .select()
            .single();

          if (error) throw error;
          setUsers(prev => [...prev, data]);
        }
        setIsModalOpen(false);
      } catch (err) {
        console.error('Failed to save admin user in Supabase:', err);
        setFormError(err.message || 'Failed to save admin user in database.');
      } finally {
        setSaving(false);
      }
      return;
    }

    if (import.meta.env.DEV) {
      if (editingUser) {
        const updated = users.map(u => u.id === editingUser.id ? { ...u, ...payload } : u);
        setUsers(updated);
        localStorage.setItem('drc_admin_users', JSON.stringify(updated));
      } else {
        const newUser = {
          id: 'u-' + Date.now(),
          ...payload
        };
        const updated = [...users, newUser];
        setUsers(updated);
        localStorage.setItem('drc_admin_users', JSON.stringify(updated));
      }
      setIsModalOpen(false);
    } else {
      setFormError('Supabase client is not available in production.');
    }
    setSaving(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (supabase) {
      try {
        const { error } = await supabase
          .from('admin_users')
          .delete()
          .eq('id', deleteTarget.id);

        if (error) throw error;
      } catch (err) {
        console.error('Failed to delete admin user:', err);
        alert(err.message || 'Failed to delete admin user from database.');
        return;
      }
    }

    const filtered = users.filter(u => u.id !== deleteTarget.id);
    setUsers(filtered);
    if (import.meta.env.DEV) {
      localStorage.setItem('drc_admin_users', JSON.stringify(filtered));
    }
    setDeleteTarget(null);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin':
        return <span className="tag-pill" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}><Crown size={12} /> Super Admin</span>;
      case 'domain_lead':
        return <span className="tag-pill" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}><Layers size={12} /> Domain Lead</span>;
      case 'event_manager':
        return <span className="tag-pill" style={{ background: '#fefce8', color: '#a16207', border: '1px solid #fef08a' }}><Calendar size={12} /> Event Manager</span>;
      case 'social_media':
        return <span className="tag-pill" style={{ background: '#faf5ff', color: '#7e22ce', border: '1px solid #e9d5ff' }}><ImageIcon size={12} /> Media Team</span>;
      default:
        return <span className="tag-pill">{role}</span>;
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Role &amp; Access Control</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Manage authorized staff credentials, assign permissions, and restrict administrative capabilities per vertical.
          </p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary" style={{ gap: '0.4rem' }}>
          <UserPlus size={16} /> Add Administrator
        </button>
      </div>

      {pageError && (
        <div style={{ padding: '0.85rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{pageError}</span>
        </div>
      )}

      {/* Permissions Guide Card */}
      <div className="aesthetic-card" style={{ marginBottom: '1.75rem', background: 'var(--color-bg-elevated)', padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={16} color="var(--color-primary)" /> Role-Based Access Rules
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
          <div><strong>Super Admin:</strong> Full database read/write access across all modules, settings &amp; users.</div>
          <div><strong>Domain Lead:</strong> Scoped exclusively to managing projects &amp; roster in their assigned technical domain.</div>
          <div><strong>Event Manager:</strong> Authorized to create events, manage schedules &amp; view participant registrations.</div>
          <div><strong>Social Media:</strong> Authorized to publish announcements and club notification banners.</div>
        </div>
      </div>

      {/* Table */}
      <div className="aesthetic-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading administrators...
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Administrator</th>
                  <th>Assigned Role</th>
                  <th>Scope</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                      No administrator profiles configured in admin_users.
                    </td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {u.email}
                        </div>
                      </td>
                      <td>{getRoleBadge(u.role)}</td>
                      <td>
                        {u.domain_scope ? (
                          <span className="tag-pill">{u.domain_scope.toUpperCase()}</span>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Global</span>
                        )}
                      </td>
                      <td>
                        {u.is_active ? (
                          <span className="tag-pill" style={{ background: '#ecfdf5', color: '#059669' }}>Active</span>
                        ) : (
                          <span className="tag-pill" style={{ background: '#f1f5f9', color: '#64748b' }}>Disabled</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button 
                            onClick={() => handleOpenEdit(u)}
                            className="btn btn-secondary" 
                            style={{ padding: '0.35rem 0.6rem' }} 
                            title="Edit administrator"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => setDeleteTarget(u)}
                            disabled={users.length <= 1}
                            className="btn btn-secondary" 
                            style={{ padding: '0.35rem 0.6rem', color: '#dc2626' }} 
                            title="Delete administrator"
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
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="lightbox-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="aesthetic-card" style={{ maxWidth: '540px', width: '90%', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem' }}>{editingUser ? 'Edit Administrator' : 'Add Administrator'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Clear note required by Phase 7 */}
            <div style={{
              padding: '0.85rem 1rem',
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: '8px',
              color: 'var(--color-text-secondary)',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '0.65rem'
            }}>
              <Info size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
              <div>
                First create the login in <strong>Supabase &gt; Authentication &gt; Users</strong>, then add the email here. Adding an email here only grants the role; it does not create the Supabase auth user.
              </div>
            </div>

            {formError && (
              <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.88rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asra Kamal"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@abes.ac.in"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Role *</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                >
                  <option value="super_admin">Super Admin (Full Database Access)</option>
                  <option value="domain_lead">Domain Lead (Scoped to Technical Vertical)</option>
                  <option value="event_manager">Event Manager (Events &amp; Registrations)</option>
                  <option value="social_media">Social Media Team (Announcements &amp; Notices)</option>
                </select>
              </div>

              {formData.role === 'domain_lead' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Assigned Domain</label>
                  <select
                    value={formData.domain_scope}
                    onChange={e => setFormData({ ...formData, domain_scope: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  >
                    <option value="ai-ml">AI &amp; Machine Learning</option>
                    <option value="vlsi">Very Large Scale Integration (VLSI)</option>
                    <option value="robotics-iot">Robotics &amp; IoT</option>
                    <option value="drone-tech">Drone Technology</option>
                  </select>
                </div>
              )}

              <div style={{ paddingTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <span>Account Active</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : editingUser ? 'Save Updates' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="lightbox-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="aesthetic-card" style={{ maxWidth: '400px', width: '90%', padding: '2rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <AlertTriangle size={40} color="#dc2626" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Revoke Admin Privileges?</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to remove administrator <strong>{deleteTarget.name}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button onClick={() => setDeleteTarget(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="btn btn-primary" style={{ background: '#dc2626', borderColor: '#dc2626', color: '#fff' }}>
                Yes, Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
