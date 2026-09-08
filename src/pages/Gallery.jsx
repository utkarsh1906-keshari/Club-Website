import React, { useState } from 'react';
import { 
  X, 
  Maximize2, 
  Calendar 
} from 'lucide-react';
import './Gallery.css';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = [
    { id: 'All', label: 'All' },
    { id: 'Drones', label: 'Drones' },
    { id: 'Robotics', label: 'Robotics' },
    { id: 'AI/ML', label: 'AI/ML' },
    { id: 'VLSI', label: 'VLSI' },
    { id: 'Events', label: 'Events' },
    { id: 'Workshops', label: 'Workshops' }
  ];

  const galleryItems = [
    {
      id: 1,
      title: 'FPV Racing Quad Assembly & Flight Calibration',
      category: 'Drones',
      date: 'NOVEMBER 2026',
      desc: 'Hands-on carbon-fiber racing quadcopter fabrication, Betaflight motor configuration, and line-of-sight test hovers.',
      image: '/abes/fpv-assembly.webp',
      badge: 'Hardware Build'
    },
    {
      id: 2,
      title: 'RobotoHack 48-Hour National Hackathon',
      category: 'Events',
      date: 'JANUARY 2027',
      desc: 'Inter-collegiate hardware marathon bringing together engineering squads to construct autonomous rovers and drone payloads.',
      image: '/abes/robotohack.webp',
      badge: 'National Hackathon'
    },
    {
      id: 3,
      title: 'Circuit Bid Hardware & Telemetry Competition',
      category: 'VLSI',
      date: 'OCTOBER 2026',
      desc: 'Real-time schematic debugging, component bidding, and oscilloscope telemetry validation under competitive time limits.',
      image: '/abes/circuit-bid.webp',
      badge: 'Hardware Challenge'
    },
    {
      id: 4,
      title: 'Drone & Multirotor Flight Bootcamp',
      category: 'Workshops',
      date: 'SEPTEMBER 2026',
      desc: 'Immersive flight aerodynamics session covering ESCs, brushless thrust dynamics, and radio telemetry bind procedures.',
      image: '/abes/bootcamp.webp',
      badge: 'Flagship Bootcamp'
    },
    {
      id: 5,
      title: 'Proteus & MATLAB Control Loop Simulation',
      category: 'AI/ML',
      date: 'DECEMBER 2026',
      desc: 'Advanced software simulation sessions focusing on model-based control algorithms, virtual instruments, and PID tuning.',
      image: '/abes/proteus-simulink.webp',
      badge: 'Simulation Masterclass'
    },
    {
      id: 6,
      title: 'Autonomous Rover & Campus Robotics Lab',
      category: 'Robotics',
      date: 'AUGUST 2026',
      desc: 'Indoor obstacle traversal tests, LiDAR point-cloud mapping, and ROS2 mobile rover locomotion in the club flight arena.',
      image: '/abes/bottom-banner.webp',
      badge: 'Lab Research'
    }
  ];

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
                  <img src={item.image} alt={item.title} className="gallery-card-img" />
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
                      <Calendar size={12} /> {item.date}
                    </span>
                  </div>
                  <h3 className="gallery-card-title">{item.title}</h3>
                  <p className="gallery-card-desc">{item.desc}</p>
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
              <img src={selectedImage.image} alt={selectedImage.title} className="lightbox-full-img" />
            </div>

            <div className="lightbox-details">
              <div className="lightbox-meta">
                <span className="tag-pill">{selectedImage.category}</span>
                <span className="gallery-date">
                  <Calendar size={13} /> {selectedImage.date}
                </span>
              </div>
              <h2>{selectedImage.title}</h2>
              <p>{selectedImage.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}