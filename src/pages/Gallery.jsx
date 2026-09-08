import React, { useState } from 'react';
import { Camera, Image as ImageIcon, X, Maximize2 } from 'lucide-react';
import './Gallery.css';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['All', 'Drones', 'Robotics', 'AI/ML', 'VLSI', 'Events', 'Workshops'];

  const galleryItems = [
    {
      id: 1,
      title: 'AeroHawk Hexacopter Field Testing',
      category: 'Drones',
      date: 'SEPTEMBER 2026',
      desc: 'Outdoor GPS waypoint flight calibration and live telemetry link verification.',
      aspectRatio: 'landscape'
    },
    {
      id: 2,
      title: 'Titan Quadruped SLAM Mapping Lab Session',
      category: 'Robotics',
      date: 'AUGUST 2026',
      desc: 'Indoor obstacle traversal test run using 3D point-cloud LiDAR sensor fusion.',
      aspectRatio: 'landscape'
    },
    {
      id: 3,
      title: 'FPGA Hardware Acceleration Vivado Demo',
      category: 'VLSI',
      date: 'JULY 2026',
      desc: 'Real-time oscilloscope validation of RTL telemetry filter on Artix-7 development board.',
      aspectRatio: 'portrait'
    },
    {
      id: 4,
      title: 'Autonomous Drone Flight Bootcamp',
      category: 'Workshops',
      date: 'JUNE 2026',
      desc: 'Junior members assembling custom brushless motor arms and soldering power distribution boards.',
      aspectRatio: 'landscape'
    },
    {
      id: 5,
      title: 'Edge AI Object Detection Live Demonstration',
      category: 'AI/ML',
      date: 'MAY 2026',
      desc: 'Running 60 FPS YOLO models on NVIDIA Jetson mounted to an indoor mobile rover.',
      aspectRatio: 'portrait'
    },
    {
      id: 6,
      title: 'National Robotics Championship Team Showcase',
      category: 'Events',
      date: 'APRIL 2026',
      desc: 'Club competition squad representing our university in the autonomous line-maze sprint.',
      aspectRatio: 'landscape'
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
          <span className="section-label">Media & Archives</span>
          <h1 className="gallery-title">Club Media Gallery</h1>
          <p className="gallery-subtitle">
            A visual documentation of lab builds, flight tests, competition arenas, and technical workshops.
          </p>

          <div className="gallery-filter-bar">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
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
              >
                <div className="gallery-image-placeholder">
                  <div className="placeholder-art">
                    <Camera size={32} color="var(--color-primary)" />
                    <span className="placeholder-tag">{item.category}</span>
                  </div>
                  <div className="gallery-hover-overlay">
                    <Maximize2 size={20} />
                    <span>View Image</span>
                  </div>
                </div>

                <div className="gallery-info">
                  <div className="gallery-meta-row">
                    <span className="tag-pill">{item.category}</span>
                    <span className="gallery-date">{item.date}</span>
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
        <div className="lightbox-backdrop" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content aesthetic-card" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
              <X size={20} />
            </button>
            <div className="lightbox-image-preview">
              <Camera size={48} color="var(--color-primary)" />
              <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Image Preview Placeholder</p>
            </div>
            <div className="lightbox-details">
              <span className="tag-pill">{selectedImage.category} &bull; {selectedImage.date}</span>
              <h2>{selectedImage.title}</h2>
              <p>{selectedImage.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}