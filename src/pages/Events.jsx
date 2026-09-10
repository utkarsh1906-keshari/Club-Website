import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  CreditCard,
  Building,
  Users,
  Sparkles,
  Ticket
} from 'lucide-react';
import { eventsService, eventRegistrationsService } from '../lib/dataService';
import './Events.css';

export default function Events() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Registration form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    rollNo: '',
    branch: 'Computer Science & Engineering',
    year: '1st Year',
    participationType: 'Solo',
    teamName: '',
    teamSize: '2',
    teamMembers: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState('');

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const data = await eventsService.getAll();
        setEvents(data);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedEvent) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedEvent]);

  const handleOpenRegister = (evt) => {
    setSelectedEvent(evt);
    setIsSubmitted(false);
    setIsSubmitting(false);
    const cat = (evt?.category || '').toLowerCase();
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      rollNo: '',
      branch: 'Computer Science & Engineering',
      year: '1st Year',
      participationType: cat.includes('hackathon') ? 'Team' : 'Solo',
      teamName: '',
      teamSize: '2',
      teamMembers: '',
      notes: ''
    });
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const refCode = 'ABES-EVT-' + Math.floor(100000 + Math.random() * 900000);

    try {
      await eventRegistrationsService.create({
        event_id: selectedEvent.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        roll_no: formData.rollNo,
        branch: formData.branch,
        year: formData.year,
        participation_type: formData.participationType,
        team_name: formData.teamName,
        team_size: parseInt(formData.teamSize || '1', 10),
        team_members: formData.teamMembers,
        notes: formData.notes
      });
      setRegistrationId(refCode);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Registration submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const safeEvents = Array.isArray(events) ? events : [];
  const filteredEvents = activeTab === 'all' 
    ? safeEvents 
    : safeEvents.filter(e => (e?.category || '').toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="events-page">
      {/* Hero */}
      <section className="events-hero">
        <div className="container">
          <span className="section-label">Campus Engineering</span>
          <h1 className="events-title">Events &amp; Workshops</h1>
          <p className="events-subtitle">
            Hands-on bootcamps, competitive hardware challenges, simulation masterclasses, and national hackathons organized by the Drone &amp; Robotics Club at ABES Engineering College.
          </p>

          <div className="events-tab-buttons">
            {['all', 'bootcamp', 'competition', 'workshop', 'hackathon'].map((tab) => (
              <button 
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding">
        <div className="container">
          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-secondary)' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No events found in this category.</p>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab('all')}
              >
                View All Events
              </button>
            </div>
          ) : (
            <div className="events-official-grid">
              {filteredEvents.map((evt) => {
                const highlights = Array.isArray(evt.highlights)
                  ? evt.highlights
                  : typeof evt.highlights === 'string'
                    ? evt.highlights.split(',').map(s => s.trim()).filter(Boolean)
                    : [];

                return (
                  <div key={evt.id} className="aesthetic-card event-official-card">
                    <div className="event-poster-container">
                      <img 
                        src={evt.image_url || evt.image || '/abes/bootcamp.webp'} 
                        alt={evt.title || 'Event poster'} 
                        className="event-poster-image"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/abes/bootcamp.webp';
                        }}
                      />
                      <span className="event-badge-tag">{evt.badge || evt.category || 'Event'}</span>
                    </div>

                    <div className="event-card-content">
                      <div className="event-meta-header">
                        <span className="event-date-text">
                          <Calendar size={14} /> {evt.event_date || evt.date || 'Upcoming'}
                        </span>
                        <span className="event-venue-text">
                          <MapPin size={14} /> {evt.venue || 'Robotics Lab & Flight Cage, ABESEC'}
                        </span>
                      </div>

                      <h3 className="event-heading">{evt.title || 'Untitled Event'}</h3>
                      <p className="event-description">{evt.description || evt.desc || 'No description provided.'}</p>

                      <div className="event-chips-wrapper">
                        {highlights.map((h, idx) => (
                          <span key={idx} className="event-highlight-chip">{h}</span>
                        ))}
                      </div>

                      <div className="event-card-footer">
                        <button 
                          type="button" 
                          className="btn btn-primary btn-sm event-register-trigger"
                          onClick={() => handleOpenRegister(evt)}
                        >
                          <span>Register for Event</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ======================================================================
          Dedicated Event Registration Modal
          ====================================================================== */}
      {selectedEvent && (
        <div className="event-modal-backdrop" onClick={handleCloseModal} role="dialog" aria-modal="true">
          <div className="aesthetic-card event-modal-container" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="event-modal-header">
              <div className="modal-header-info">
                <span className="modal-event-badge">{selectedEvent.badge || selectedEvent.category || 'Event'}</span>
                <h3 className="modal-event-title">{selectedEvent.title || 'Event Details'}</h3>
                <div className="modal-event-meta">
                  <span><Calendar size={13} /> {selectedEvent.event_date || selectedEvent.date || 'Upcoming'}</span>
                  <span><Clock size={13} /> {selectedEvent.time || '10:00 AM – 4:30 PM'}</span>
                  <span><MapPin size={13} /> {selectedEvent.venue || 'Robotics Lab, ABESEC'}</span>
                </div>
              </div>

              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={handleCloseModal}
                aria-label="Close registration modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="event-modal-body">
              {!isSubmitted ? (
                <form onSubmit={handleSubmitRegistration} className="event-registration-form">
                  <div className="form-intro-note">
                    <Sparkles size={16} />
                    <span>Enter your student details below to reserve your entry pass for this session.</span>
                  </div>

                  {/* Name & Email Row */}
                  <div className="form-row-grid">
                    <div className="form-field-group">
                      <label htmlFor="reg-name">Full Name *</label>
                      <input 
                        id="reg-name"
                        type="text" 
                        name="fullName"
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Rahul Sharma"
                        required 
                      />
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="reg-email">College / Personal Email *</label>
                      <input 
                        id="reg-email"
                        type="email" 
                        name="email"
                        value={formData.email} 
                        onChange={handleInputChange} 
                        placeholder="e.g. rahul@abes.ac.in"
                        required 
                      />
                    </div>
                  </div>

                  {/* Phone & Student Roll No Row */}
                  <div className="form-row-grid">
                    <div className="form-field-group">
                      <label htmlFor="reg-phone">WhatsApp / Contact Number *</label>
                      <input 
                        id="reg-phone"
                        type="tel" 
                        name="phone"
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        placeholder="e.g. +91 9876543210"
                        required 
                      />
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="reg-roll">Student Roll No. / Admission ID *</label>
                      <input 
                        id="reg-roll"
                        type="text" 
                        name="rollNo"
                        value={formData.rollNo} 
                        onChange={handleInputChange} 
                        placeholder="e.g. 2300320100089"
                        required 
                      />
                    </div>
                  </div>

                  {/* Branch & Year Row */}
                  <div className="form-row-grid">
                    <div className="form-field-group">
                      <label htmlFor="reg-branch">Department / Branch *</label>
                      <select 
                        id="reg-branch"
                        name="branch" 
                        value={formData.branch} 
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                        <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                        <option value="Information Technology">Information Technology (IT)</option>
                        <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                        <option value="Electrical & Electronics">Electrical & Electronics (EN)</option>
                        <option value="CSE - AI & ML">CSE - AI & ML</option>
                        <option value="CSE - Data Science">CSE - Data Science</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Other Department">Other Department</option>
                      </select>
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="reg-year">Academic Year *</label>
                      <select 
                        id="reg-year"
                        name="year" 
                        value={formData.year} 
                        onChange={handleInputChange}
                        required
                      >
                        <option value="1st Year">1st Year (Batch of 2029)</option>
                        <option value="2nd Year">2nd Year (Batch of 2028)</option>
                        <option value="3rd Year">3rd Year (Batch of 2027)</option>
                        <option value="4th Year">4th Year (Batch of 2026)</option>
                      </select>
                    </div>
                  </div>

                  {/* Participation Type */}
                  <div className="form-field-group">
                    <label>Participation Format *</label>
                    <div className="participation-toggle-grid">
                      <button
                        type="button"
                        className={`participation-pill ${formData.participationType === 'Solo' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, participationType: 'Solo' }))}
                      >
                        <User size={15} />
                        <span>Individual (Solo)</span>
                      </button>

                      <button
                        type="button"
                        className={`participation-pill ${formData.participationType === 'Team' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, participationType: 'Team' }))}
                      >
                        <Users size={15} />
                        <span>Team Entry</span>
                      </button>
                    </div>
                  </div>

                  {/* Team Details if Team Entry */}
                  {formData.participationType === 'Team' && (
                    <div className="team-subform-box">
                      <div className="form-row-grid">
                        <div className="form-field-group">
                          <label htmlFor="reg-teamname">Team Name *</label>
                          <input 
                            id="reg-teamname"
                            type="text" 
                            name="teamName"
                            value={formData.teamName} 
                            onChange={handleInputChange} 
                            placeholder="e.g. AeroKnights"
                            required={formData.participationType === 'Team'}
                          />
                        </div>

                        <div className="form-field-group">
                          <label htmlFor="reg-teamsize">Team Size *</label>
                          <select 
                            id="reg-teamsize"
                            name="teamSize" 
                            value={formData.teamSize} 
                            onChange={handleInputChange}
                          >
                            <option value="2">2 Members</option>
                            <option value="3">3 Members</option>
                            <option value="4">4 Members</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-field-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="reg-teammembers">Other Teammates (Names &amp; Roll Nos.) *</label>
                        <input 
                          id="reg-teammembers"
                          type="text" 
                          name="teamMembers"
                          value={formData.teamMembers} 
                          onChange={handleInputChange} 
                          placeholder="e.g. Ankit (23003201...), Priya (23003201...)"
                          required={formData.participationType === 'Team'}
                        />
                      </div>
                    </div>
                  )}

                  {/* Notes / Queries */}
                  <div className="form-field-group">
                    <label htmlFor="reg-notes">Special Requirements / Queries (Optional)</label>
                    <textarea 
                      id="reg-notes"
                      name="notes"
                      rows={2}
                      value={formData.notes} 
                      onChange={handleInputChange} 
                      placeholder="Any specific questions or prior experience relevant to this event..."
                    />
                  </div>

                  {/* Modal Footer Actions */}
                  <div className="event-modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary modal-cancel-btn" 
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary modal-submit-btn" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>Processing Registration...</span>
                      ) : (
                        <>
                          <span>Confirm Registration</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Success Confirmation Screen */
                <div className="event-success-view">
                  <div className="success-badge-icon">
                    <CheckCircle2 size={44} />
                  </div>
                  <h4 className="success-headline">Registration Confirmed!</h4>
                  <p className="success-subtext">
                    You have successfully registered for <strong>{selectedEvent.title}</strong>.
                  </p>

                  <div className="event-pass-card">
                    <div className="pass-top-row">
                      <div className="pass-logo-title">
                        <Ticket size={18} />
                        <span>EVENT ENTRY PASS</span>
                      </div>
                      <span className="pass-ref-code">{registrationId}</span>
                    </div>

                    <div className="pass-details-grid">
                      <div className="pass-detail-cell">
                        <span className="cell-label">PARTICIPANT</span>
                        <span className="cell-value">{formData.fullName}</span>
                      </div>
                      <div className="pass-detail-cell">
                        <span className="cell-label">ROLL NUMBER</span>
                        <span className="cell-value">{formData.rollNo}</span>
                      </div>
                      <div className="pass-detail-cell">
                        <span className="cell-label">DATE &amp; TIME</span>
                        <span className="cell-value">{selectedEvent.event_date || selectedEvent.date || 'Upcoming'} ({selectedEvent.time || 'TBA'})</span>
                      </div>
                      <div className="pass-detail-cell">
                        <span className="cell-label">LOCATION</span>
                        <span className="cell-value">{selectedEvent.venue || 'Robotics Lab, ABESEC'}</span>
                      </div>
                    </div>
                  </div>

                  <p className="success-instruction">
                    Please bring your physical ABES college ID card on the event day. Confirmation details have also been recorded.
                  </p>

                  <button 
                    type="button" 
                    className="btn btn-primary success-done-btn"
                    onClick={handleCloseModal}
                  >
                    Done &bull; Back to Events
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}