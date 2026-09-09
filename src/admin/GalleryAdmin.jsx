import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import { galleryService } from '../lib/dataService';

export default function GalleryAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Drones',
    date_label: '',
    description: '',
    image_url: '',
    badge: 'Hardware Build'
  });

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  const categories = ['All', 'Drones', 'Robotics', 'AI/ML', 'VLSI', 'Events', 'Workshops'];

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await galleryService.getAll();
      setItems(data);
    } catch (err) {
      console.error('Failed to load gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      category: 'Drones',
      date_label: 'OCTOBER 2026',
      description: '',
      image_url: '/abes/bootcamp.webp',
      badge: 'Hardware Build'
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await galleryService.create(formData);
      setIsModalOpen(false);
      loadGallery();
    } catch (err) {
      console.error('Failed to add gallery item:', err);
      alert('Error adding media: ' + err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await galleryService.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadGallery();
    } catch (err) {
      console.error('Failed to delete media:', err);
    }
  };

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Gallery Media Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Upload, tag, and curate high-resolution lab photographs, drone flight captures, and hackathon highlights.
          </p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary" style={{ gap: '0.4rem' }}>
          <Plus size={16} /> Add Media
        </button>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            className={`btn btn-secondary ${activeCategory === cat ? 'btn-primary' : ''}`}
            onClick={() => setActiveCategory(cat)}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
          >
            {cat} {cat === 'All' ? `(${items.length})` : `(${items.filter(i => i.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <p>Loading media items...</p>
      ) : filteredItems.length === 0 ? (
        <div className="aesthetic-card text-center" style={{ padding: '3rem' }}>
          <ImageIcon size={44} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No media in this category</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Upload photos or switch categories above.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredItems.map(item => (
            <div key={item.id} className="aesthetic-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '170px', background: 'var(--color-bg-elevated)' }}>
                <img 
                  src={item.image_url || item.image || '/abes/bootcamp.webp'} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <span className="tag-pill" style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.75)', color: '#fff', border: 'none' }}>
                  {item.category}
                </span>
                <button
                  onClick={() => setDeleteTarget(item)}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'rgba(220, 38, 38, 0.9)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Delete media"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                  {item.date_label || item.date}
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem', lineHeight: 1.35 }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, marginTop: 'auto' }}>
                  {item.description || item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Media Modal */}
      {isModalOpen && (
        <div className="lightbox-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="aesthetic-card" style={{ maxWidth: '580px', width: '90%', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem' }}>Add Gallery Media</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  placeholder="e.g. FPV Flight Calibration in Flight Cage"
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  >
                    <option value="Drones">Drones</option>
                    <option value="Robotics">Robotics</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="VLSI">VLSI</option>
                    <option value="Events">Events</option>
                    <option value="Workshops">Workshops</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Date Label</label>
                  <input
                    type="text"
                    value={formData.date_label}
                    placeholder="e.g. OCTOBER 2026"
                    onChange={e => setFormData({ ...formData, date_label: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.image_url}
                  placeholder="/abes/fpv-assembly.webp or https://supabase-storage/..."
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Badge Tag</label>
                <input
                  type="text"
                  value={formData.badge}
                  placeholder="e.g. Hardware Build or Flight Test"
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  placeholder="Brief description of the build, workshop, or competition captured..."
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Media
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
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Media?</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete <strong>{deleteTarget.title}</strong> from the public gallery?
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