import React, { useState, useEffect } from 'react';
import { 
  X, 
  Maximize2, 
  Calendar 
} from 'lucide-react';
import { galleryService } from '../lib/dataService';
import './Gallery.css';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'All', label: 'All' },
    { id: 'Drones', label: 'Drones' },
    { id: 'Robotics', label: 'Robotics' },
    { id: 'AI/ML', label: 'AI/ML' },
    { id: 'VLSI', label: 'VLSI' },
    { id: 'Events', label: 'Events' },
    { id: 'Workshops', label: 'Workshops' }
  ];

  useEffect(() => {
    async function loadGallery() {
      setLoading(true);
      try {
        const data = await galleryService.getAll();
        setGalleryItems(data);
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="gallery-page">
      {/* Hero */}
      <section className="gallery-hero">
        <div className="container">
          <span className="section-label">Media &amp; Archives</span>
          <h1 className="gallery-title">Club Media Gallery</h1>
          <div className="heading-line-maroon" style={{ margin: '0.5rem auto 1.25rem auto' }}></div>
          <p className="gallery-subtitle">
            A visual showcase of our hardware fabrications, autonomous flight tests, national hackathons, and laboratory sessions at ABES Engineering College.
          </p>

          {/* Premium Filter Buttons Bar */}
          <div className="gallery-filter-bar">
            {categories.map(cat => {
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  className={`gallery-filter-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  type="button"
                  aria-pressed={isActive}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="gallery-grid">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="aesthetic-card gallery-card"
                onClick={() => setSelectedImage(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedImage(item);
                  }
                }}
              >
                <div className="gallery-image-container">
                  <img 
                    src={item.image_url || item.image || '/abes/bootcamp.webp'} 
                    alt={item.title} 
                    className="gallery-card-img" 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/abes/bootcamp.webp';
                    }}
                  />
                  <span className="gallery-badge-tag">{item.badge}</span>
                  
                  <div className="gallery-hover-overlay">
                    <Maximize2 size={22} />
                    <span>View Full Media</span>
                  </div>
                </div>

                <div className="gallery-info">
                  <div className="gallery-meta-row">
                    <span className="tag-pill">{item.category}</span>
                    <span className="gallery-date">
                      <Calendar size={12} /> {item.date_label || item.date}
                    </span>
                  </div>
                  <h3 className="gallery-card-title">{item.title}</h3>
                  <p className="gallery-card-desc">{item.description || item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox-backdrop" onClick={() => setSelectedImage(null)} role="dialog" aria-modal="true">
          <div className="lightbox-content aesthetic-card" onClick={e => e.stopPropagation()}>
            <button 
              className="lightbox-close" 
              onClick={() => setSelectedImage(null)}
              aria-label="Close image preview"
              type="button"
            >
              <X size={20} />
            </button>
            
            <div className="lightbox-image-wrapper">
              <img 
                src={selectedImage.image_url || selectedImage.image || '/abes/bootcamp.webp'} 
                alt={selectedImage.title} 
                className="lightbox-full-img" 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/abes/bootcamp.webp';
                }}
              />
            </div>

            <div className="lightbox-details">
              <div className="lightbox-meta">
                <span className="tag-pill">{selectedImage.category}</span>
                <span className="gallery-date">
                  <Calendar size={13} /> {selectedImage.date_label || selectedImage.date}
                </span>
              </div>
              <h2>{selectedImage.title}</h2>
              <p>{selectedImage.description || selectedImage.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}