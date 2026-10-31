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
import { projectsService, domainsService } from '../lib/dataService';
import ImageUpload from '../components/ImageUpload';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    domain_id: 'ai-ml',
    description: '',
    image_url: '/abes/bottom-banner.webp',
    technologies: '',
    team_members: '',
    github_url: '',
    demo_url: '',
    featured: false
  });

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [pData, dData] = await Promise.all([
        projectsService.getAll(),
        domainsService.getAll()
      ]);
      const safeProjects = import.meta.env.PROD
        ? pData.filter(p => !String(p.id).startsWith('proj-') && !p.isDemo)
        : pData;
      setProjects(safeProjects);
      setDomains(dData);
    } catch (err) {
      console.error('Failed to load projects/domains:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormError('');
    setFormData({
      title: '',
      domain_id: domains[0]?.id || 'ai-ml',
      description: '',
      image_url: '/abes/bottom-banner.webp',
      technologies: 'ROS 2, C++, Python',
      team_members: 'Student Lead',
      github_url: 'https://github.com/drone-robotics-abes',
      demo_url: '',
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    if (import.meta.env.PROD && (String(proj.id).startsWith('proj-') || proj.isDemo)) {
      alert('Local demo items cannot be edited in production.');
      return;
    }
    setEditingProject(proj);
    setFormError('');
    setFormData({
      title: proj.title || proj.name || '',
      domain_id: proj.domain_id || 'ai-ml',
      description: proj.description || proj.desc || '',
      image_url: proj.image_url || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '',
      team_members: Array.isArray(proj.team_members) ? proj.team_members.join(', ') : '',
      github_url: proj.github_url || '',
      demo_url: proj.demo_url || '',
      featured: !!proj.featured
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    const techArr = formData.technologies
      ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    const membersArr = formData.team_members
      ? formData.team_members.split(',').map(m => m.trim()).filter(Boolean)
      : [];

    const payload = {
      title: formData.title,
      domain_id: formData.domain_id,
      description: formData.description,
      image_url: formData.image_url,
      technologies: techArr,
      team_members: membersArr,
      github_url: formData.github_url,
      demo_url: formData.demo_url,
      featured: Boolean(formData.featured)
    };

    try {
      if (editingProject) {
        if (!editingProject.id) throw new Error('Missing project ID for update');
        const updated = await projectsService.update(editingProject.id, payload);
        if (updated) {
          setProjects(prev => prev.map(p => p.id === editingProject.id ? updated : p));
        }
      } else {
        const created = await projectsService.create(payload);
        if (created) {
          setProjects(prev => [created, ...prev.filter(p => p.id !== created.id)]);
        }
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save project:', err);
      setFormError(err.message || 'Error saving project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    if (!deleteTarget.id) {
      setDeleteError('Missing project ID for deletion');
      return;
    }
    if (import.meta.env.PROD && (String(deleteTarget.id).startsWith('proj-') || deleteTarget.isDemo)) {
      setDeleteError('Local demo items cannot be deleted in production.');
      return;
    }
    setDeleteError('');
    try {
      await projectsService.delete(deleteTarget.id);
      setProjects(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete project:', err);
      setDeleteError(err.message || 'Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(p => {
    if (import.meta.env.PROD && (String(p.id).startsWith('proj-') || p.isDemo)) {
      return false;
    }
    const matchesDomain = selectedDomain === 'all' || p.domain_id === selectedDomain;
    const q = search.toLowerCase();
    const matchesSearch = 
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q);
    return matchesDomain && matchesSearch;
  });

  const getDomainBadge = (domId) => {
    const d = domains.find(x => x.id === domId);
    return d ? d.name : domId?.toUpperCase();
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Project Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Catalog, update, and manage hardware and software engineering initiatives across technical verticals.
          </p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary" style={{ gap: '0.4rem' }}>
          <Plus size={16} /> Add New Project
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search projects..."
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

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn btn-secondary ${selectedDomain === 'all' ? 'btn-primary' : ''}`}
            onClick={() => setSelectedDomain('all')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
          >
            All Domains ({projects.length})
          </button>
          {domains.map(d => (
            <button
              key={d.id}
              type="button"
              className={`btn btn-secondary ${selectedDomain === d.id ? 'btn-primary' : ''}`}
              onClick={() => setSelectedDomain(d.id)}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
            >
              {d.name.split('(')[0].trim()} ({projects.filter(p => p.domain_id === d.id).length})
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="aesthetic-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project Title &amp; Image</th>
                <th>Domain Vertical</th>
                <th>Technologies</th>
                <th>Contributors</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading projects...</td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                    No projects found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredProjects.map(proj => (
                  <tr key={proj.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={proj.image_url || '/abes/bottom-banner.webp'} 
                          alt="" 
                          style={{ width: '52px', height: '38px', objectFit: 'cover', borderRadius: '4px' }} 
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/abes/bottom-banner.webp';
                          }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <strong>{proj.title || proj.name}</strong>
                            {import.meta.env.DEV && proj.isDemo && (
                              <span className="tag-pill" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', fontSize: '0.68rem', padding: '0.1rem 0.35rem' }}>
                                Local demo mode
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {proj.description || proj.desc}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="tag-pill">{getDomainBadge(proj.domain_id)}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', maxWidth: '200px' }}>
                        {(proj.technologies || []).slice(0, 3).map((t, idx) => (
                          <span key={idx} className="tag-pill" style={{ fontSize: '0.72rem' }}>{t}</span>
                        ))}
                        {(proj.technologies || []).length > 3 && (
                          <span className="tag-pill" style={{ fontSize: '0.72rem' }}>+{proj.technologies.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>
                        {(proj.team_members || []).join(', ') || '—'}
                      </div>
                    </td>
                    <td>
                      {proj.featured ? (
                        <span className="tag-pill" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', fontWeight: 600 }}>
                          Featured
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Standard</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          onClick={() => handleOpenEdit(proj)}
                          className="btn btn-secondary" 
                          style={{ padding: '0.35rem 0.6rem' }} 
                          title="Edit project"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => setDeleteTarget(proj)}
                          className="btn btn-secondary" 
                          style={{ padding: '0.35rem 0.6rem', color: '#dc2626' }} 
                          title="Delete project"
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
              <h2 style={{ fontSize: '1.35rem' }}>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  placeholder="e.g. AeroHawk Search & Rescue Hexacopter"
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Technical Domain Vertical *</label>
                <select
                  value={formData.domain_id}
                  onChange={e => setFormData({ ...formData, domain_id: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                >
                  {domains.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Description *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  placeholder="Technical description of architecture, hardware components, and results..."
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={formData.technologies}
                    placeholder="PyTorch, ROS2, Jetson, KiCAD"
                    onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Team Members / Contributors</label>
                  <input
                    type="text"
                    value={formData.team_members}
                    placeholder="Ayush Tyagi, Vishal, Asra Kamal"
                    onChange={e => setFormData({ ...formData, team_members: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <ImageUpload
                label="Project Cover Photo"
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                fallbackImage="/abes/bottom-banner.webp"
                presets={[
                  { label: 'Flight Arena', url: '/abes/bottom-banner.webp' },
                  { label: 'Circuit Hardware', url: '/abes/circuit-bid.webp' },
                  { label: 'Proteus Simulation', url: '/abes/proteus-simulink.webp' },
                  { label: 'FPV Quad', url: '/abes/fpv-assembly.webp' },
                  { label: 'Bootcamp Drone', url: '/abes/bootcamp.webp' }
                ]}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>GitHub Repository URL</label>
                  <input
                    type="url"
                    value={formData.github_url}
                    placeholder="https://github.com/..."
                    onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Live Demo / Schematic Link</label>
                  <input
                    type="url"
                    value={formData.demo_url}
                    placeholder="https://..."
                    onChange={e => setFormData({ ...formData, demo_url: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div style={{ padding: '0.5rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span>Mark as Featured Project on Homepage / Showcase</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
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
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Project?</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete <strong>{deleteTarget.title || deleteTarget.name}</strong>?
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