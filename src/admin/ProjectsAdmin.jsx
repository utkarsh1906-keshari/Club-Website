import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import { projectsService, domainsService } from '../lib/dataService';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
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

  const loadData = async () => {
    setLoading(true);
    try {
      const [pData, dData] = await Promise.all([
        projectsService.getAll(),
        domainsService.getAll()
      ]);
      setProjects(pData);
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
    setEditingProject(proj);
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
      featured: formData.featured
    };

    try {
      if (editingProject) {
        await projectsService.update(editingProject.id, payload);
      } else {
        await projectsService.create(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Error saving project: ' + err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await projectsService.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const filteredProjects = projects.filter(p => {
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
                        />
                        <div>
                          <strong>{proj.title || proj.name}</strong>
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

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Project Poster / Image URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  placeholder="/abes/bootcamp.webp or https://..."
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

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
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProject ? 'Save Changes' : 'Create Project'}
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