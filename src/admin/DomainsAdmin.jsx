import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Edit, 
  CheckCircle2, 
  Cpu, 
  Brain, 
  Bot, 
  Plane, 
  X, 
  Save 
} from 'lucide-react';
import { domainsService } from '../lib/dataService';

const DOMAIN_ICONS = {
  'ai-ml': <Brain size={22} />,
  'vlsi': <Cpu size={22} />,
  'robotics-iot': <Bot size={22} />,
  'drone-tech': <Plane size={22} />
};

export default function DomainsAdmin() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDomain, setEditingDomain] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lead_name: '',
    badge: '',
    description: '',
    focus_areas: '',
    technologies: '',
    image_url: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadDomains = async () => {
    setLoading(true);
    try {
      const data = await domainsService.getAll();
      setDomains(data);
    } catch (err) {
      console.error('Failed to load domains:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDomains();
  }, []);

  const handleOpenEdit = (dom) => {
    setEditingDomain(dom);
    setFormData({
      name: dom.name || '',
      lead_name: dom.lead_name || dom.lead || '',
      badge: dom.badge || '',
      description: dom.description || dom.desc || '',
      focus_areas: Array.isArray(dom.focus_areas || dom.focusAreas) 
        ? (dom.focus_areas || dom.focusAreas).join('\n') 
        : '',
      technologies: Array.isArray(dom.technologies) 
        ? dom.technologies.join(', ') 
        : '',
      image_url: dom.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const focusArr = formData.focus_areas
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const techArr = formData.technologies
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      lead_name: formData.lead_name,
      badge: formData.badge,
      description: formData.description,
      focus_areas: focusArr,
      technologies: techArr,
      image_url: formData.image_url
    };

    try {
      await domainsService.update(editingDomain.id, payload);
      setIsModalOpen(false);
      loadDomains();
    } catch (err) {
      console.error('Failed to update domain:', err);
      alert('Error updating domain: ' + err.message);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Technical Domains Management</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Update the focus areas, technical frameworks, syllabus, and assigned mentors for the 4 core verticals.
        </p>
      </div>

      {/* Domain Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <p>Loading technical domains...</p>
        ) : (
          domains.map(dom => (
            <div key={dom.id} className="aesthetic-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--color-primary-subtle)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {DOMAIN_ICONS[dom.id] || <Layers size={22} />}
                  </div>
                  <div>
                    <span className="tag-pill" style={{ marginBottom: '0.2rem' }}>{dom.badge}</span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{dom.name}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => handleOpenEdit(dom)}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', gap: '0.3rem' }}
                >
                  <Edit size={13} /> Edit
                </button>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
                {dom.description || dom.desc}
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Assigned Lead
                </strong>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{dom.lead_name || dom.lead}</span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Core Focus Areas
                </strong>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem' }}>
                  {(dom.focus_areas || dom.focusAreas || []).slice(0, 3).map((area, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={13} color="var(--color-primary)" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px dashed var(--color-border)' }}>
                <strong style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Tech Stack
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {(dom.technologies || []).map((t, idx) => (
                    <span key={idx} className="tag-pill" style={{ fontSize: '0.75rem' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="lightbox-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="aesthetic-card" style={{ maxWidth: '650px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem' }}>Edit Domain: {editingDomain?.name}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Domain Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Domain Lead / Mentor *</label>
                  <input
                    type="text"
                    required
                    value={formData.lead_name}
                    onChange={e => setFormData({ ...formData, lead_name: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Description *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Core Focus Areas (One per line)
                </label>
                <textarea
                  rows="4"
                  value={formData.focus_areas}
                  placeholder="Real-Time Computer Vision&#10;Deep Reinforcement Learning&#10;Visual SLAM"
                  onChange={e => setFormData({ ...formData, focus_areas: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Technologies &amp; Frameworks (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  placeholder="PyTorch, OpenCV, ROS2, CUDA, Python"
                  onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                  <Save size={15} /> Save Domain Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}