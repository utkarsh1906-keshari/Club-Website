import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  X, 
  AlertTriangle,
  Search,
  Upload,
  RotateCcw
} from 'lucide-react';
import { eventsService, eventRegistrationsService, normalizeImageUrl } from '../lib/dataService';

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Workshop',
    event_date: '',
    time: '',
    venue: '',
    description: '',
    image_url: '/abes/bootcamp.webp',
    badge: 'Hardware Workshop',
    highlights: '',
    is_past: false,
    registration_open: true,
    registration_url: ''
  });

  // Registrations inspection modal
  const [activeRegistrationsEvent, setActiveRegistrationsEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Image upload & preview state
  const fileInputRef = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize on canvas to max 900px to ensure it fits safely in localStorage
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 900;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/webp', 0.82) || canvas.toDataURL('image/jpeg', 0.82);
        setFormData(prev => ({ ...prev, image_url: compressedDataUrl }));
        setImageError(false);
        setIsUploading(false);
      };
      img.onerror = () => {
        alert('Could not process this image file. Please try another image.');
        setIsUploading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Are you sure you want to restore official club events and posters? This will fix any broken or corrupted event data.')) {
      setLoading(true);
      try {
        await eventsService.resetToDefault();
        await loadEvents();
        alert('Official club events and verified posters restored successfully!');
      } catch (err) {
        console.error('Failed to reset default events:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventsService.getAll();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      category: 'Workshop',
      event_date: '',
      time: '',
      venue: 'Robotics Lab, ABESEC',
      description: '',
      image_url: '/abes/bootcamp.webp',
      badge: 'Workshop',
      highlights: 'Hardware Prototyping, Live Flights, Mentorship',
      is_past: false,
      registration_open: true,
      registration_url: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title || '',
      category: evt.category || 'Workshop',
      event_date: evt.event_date || evt.date || '',
      time: evt.time || '',
      venue: evt.venue || '',
      description: evt.description || evt.desc || '',
      image_url: evt.image_url || evt.image || '',
      badge: evt.badge || '',
      highlights: Array.isArray(evt.highlights) ? evt.highlights.join(', ') : (evt.highlights || ''),
      is_past: !!evt.is_past,
      registration_open: evt.registration_open !== false,
      registration_url: evt.registration_url || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const highlightsArr = formData.highlights
      ? formData.highlights.split(',').map(h => h.trim()).filter(Boolean)
      : [];

    const cleanImageUrl = normalizeImageUrl(formData.image_url);

    const payload = {
      ...formData,
      image_url: cleanImageUrl,
      highlights: highlightsArr
    };

    try {
      if (editingEvent) {
        await eventsService.update(editingEvent.id, payload);
      } else {
        await eventsService.create(payload);
      }
      setIsModalOpen(false);
      loadEvents();
    } catch (err) {
      console.error('Failed to save event:', err);
      alert('Error saving event: ' + err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await eventsService.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadEvents();
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const handleViewRegistrations = async (evt) => {
    setActiveRegistrationsEvent(evt);
    setLoadingRegs(true);
    try {
      const data = await eventRegistrationsService.getAll(evt.id);
      setRegistrations(data);
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoadingRegs(false);
    }
  };

  const filteredEvents = events.filter(e => {
    const q = search.toLowerCase();
    return (
      e.title?.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Event Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Create, schedule, update and monitor participant registrations for club bootcamps and competitions.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            onClick={handleResetDefaults} 
            className="btn btn-secondary" 
            style={{ gap: '0.4rem', fontSize: '0.88rem' }}
            title="Restore official seed events if event data was corrupted"
          >
            <RotateCcw size={15} /> Restore Default Events
          </button>
          <button onClick={handleOpenCreate} className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <Plus size={16} /> Add New Event
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem', maxWidth: '400px', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input
          type="text"
          placeholder="Filter events by title, category, venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
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

      {/* Events Table */}
      <div className="aesthetic-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Category</th>
                <th>Date &amp; Venue</th>
                <th>Timeline Status</th>
                <th>Registrations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading events...</td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                    No events found. Click "+ Add New Event" to publish one.
                  </td>
                </tr>
              ) : (
                filteredEvents.map(evt => (
                  <tr key={evt.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={evt.image_url || evt.image || '/abes/bootcamp.webp'} 
                          alt="" 
                          style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} 
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/abes/bootcamp.webp';
                          }}
                        />
                        <div>
                          <strong>{evt.title}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            {evt.badge || evt.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="tag-pill">{evt.category}</span>
                    </td>
                    <td>
                      <div>{evt.event_date || evt.date}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {evt.venue}
                      </div>
                    </td>
                    <td>
                      {evt.is_past ? (
                        <span className="tag-pill" style={{ background: '#f1f5f9', color: '#64748b' }}>
                          Past Event
                        </span>
                      ) : (
                        <span className="tag-pill" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                          Upcoming
                        </span>
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleViewRegistrations(evt)}
                        className="btn btn-secondary" 
                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem', gap: '0.3rem' }}
                      >
                        <Users size={12} /> View Registrations
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          onClick={() => handleOpenEdit(evt)}
                          className="btn btn-secondary" 
                          style={{ padding: '0.35rem 0.6rem' }} 
                          title="Edit event"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => setDeleteTarget(evt)}
                          className="btn btn-secondary" 
                          style={{ padding: '0.35rem 0.6rem', color: '#dc2626' }} 
                          title="Delete event"
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
              <h2 style={{ fontSize: '1.35rem' }}>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
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
                    <option value="Workshop">Workshop</option>
                    <option value="Flagship Bootcamp">Flagship Bootcamp</option>
                    <option value="Competition">Competition</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Masterclass">Masterclass</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Badge Label</label>
                  <input
                    type="text"
                    value={formData.badge}
                    placeholder="e.g. Flagship Event"
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Date *</label>
                  <input
                    type="text"
                    required
                    value={formData.event_date}
                    placeholder="e.g. OCTOBER 2026 or Oct 15, 2026"
                    onChange={e => setFormData({ ...formData, event_date: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    placeholder="e.g. 10:00 AM – 4:30 PM"
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Venue *</label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  placeholder="e.g. Robotics Lab & Flight Cage, ABESEC"
                  onChange={e => setFormData({ ...formData, venue: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Poster / Image URL or Upload
                </label>
                
                {/* Image controls: URL input + Upload File button */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={formData.image_url}
                    placeholder="/abes/bootcamp.webp or https://..."
                    onChange={e => {
                      setFormData({ ...formData, image_url: e.target.value });
                      setImageError(false);
                    }}
                    onBlur={e => {
                      if (e.target.value) {
                        setFormData(prev => ({ ...prev, image_url: normalizeImageUrl(prev.image_url) }));
                      }
                    }}
                    style={{ flex: 1, padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleImageFileUpload} 
                    style={{ display: 'none' }} 
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()} 
                    className="btn btn-secondary" 
                    style={{ gap: '0.4rem', whiteSpace: 'nowrap', fontSize: '0.85rem' }}
                    disabled={isUploading}
                  >
                    <Upload size={14} /> {isUploading ? 'Compressing...' : 'Upload Photo'}
                  </button>
                </div>

                {/* Preset Club Posters Quick Selection */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    Quick Select Verified Posters:
                  </span>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Bootcamp', url: '/abes/bootcamp.webp' },
                      { label: 'Circuit Bid', url: '/abes/circuit-bid.webp' },
                      { label: 'FPV Assembly', url: '/abes/fpv-assembly.webp' },
                      { label: 'Proteus Simulink', url: '/abes/proteus-simulink.webp' },
                      { label: 'RobotoHack', url: '/abes/robotohack.webp' },
                      { label: 'Lab Arena', url: '/abes/bottom-banner.webp' }
                    ].map(p => (
                      <button
                        key={p.url}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, image_url: p.url }));
                          setImageError(false);
                        }}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          border: formData.image_url === p.url ? '1px solid #8b1d24' : '1px solid var(--color-border)',
                          background: formData.image_url === p.url ? 'rgba(139, 29, 36, 0.12)' : 'var(--color-bg-base)',
                          color: formData.image_url === p.url ? '#8b1d24' : 'var(--color-text-secondary)',
                          cursor: 'pointer'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Image Preview */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '0.75rem', 
                  borderRadius: '6px', 
                  background: 'var(--color-bg-elevated)', 
                  border: '1px solid var(--color-border)' 
                }}>
                  <div style={{ width: '80px', height: '52px', borderRadius: '4px', overflow: 'hidden', background: '#000', flexShrink: 0 }}>
                    <img 
                      src={formData.image_url || '/abes/bootcamp.webp'} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/abes/bootcamp.webp';
                        setImageError(true);
                      }}
                      onLoad={() => setImageError(false)}
                    />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {imageError ? (
                      <span style={{ color: '#e11d48', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertTriangle size={13} /> URL failed to load. Fallback poster (/abes/bootcamp.webp) will be used.
                      </span>
                    ) : (
                      <span>Live Poster Preview &bull; Ready to display on site</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Highlights (comma separated)</label>
                <input
                  type="text"
                  value={formData.highlights}
                  placeholder="Multirotor Aerodynamics, Brushless ESCs, Telemetry"
                  onChange={e => setFormData({ ...formData, highlights: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '2rem', padding: '0.5rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_past}
                    onChange={e => setFormData({ ...formData, is_past: e.target.checked })}
                  />
                  <span>Mark as Past Event</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.registration_open}
                    onChange={e => setFormData({ ...formData, registration_open: e.target.checked })}
                  />
                  <span>Registration Open</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="lightbox-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="aesthetic-card" style={{ maxWidth: '420px', width: '90%', padding: '2rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <AlertTriangle size={42} color="#dc2626" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Event?</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>? This will also remove any associated registrations.
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

      {/* Registrations View Modal */}
      {activeRegistrationsEvent && (
        <div className="lightbox-backdrop" onClick={() => setActiveRegistrationsEvent(null)}>
          <div className="aesthetic-card" style={{ maxWidth: '750px', width: '90%', maxHeight: '85vh', overflowY: 'auto', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem' }}>Registrations: {activeRegistrationsEvent.title}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Total Enrolled: {registrations.length} participant(s)
                </p>
              </div>
              <button onClick={() => setActiveRegistrationsEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {loadingRegs ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>Loading registrations...</p>
            ) : registrations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                No registrations logged yet for this event.
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Participant</th>
                      <th>Email &amp; Phone</th>
                      <th>Roll No / Branch</th>
                      <th>Type</th>
                      <th>Team Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(reg => (
                      <tr key={reg.id}>
                        <td><strong>{reg.full_name}</strong></td>
                        <td>
                          <div>{reg.email}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{reg.phone}</div>
                        </td>
                        <td>
                          <div>{reg.roll_no}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{reg.branch} ({reg.year})</div>
                        </td>
                        <td><span className="tag-pill">{reg.participation_type}</span></td>
                        <td>
                          {reg.team_name ? (
                            <div>
                              <strong>{reg.team_name}</strong> ({reg.team_size} members)
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{reg.team_members}</div>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}