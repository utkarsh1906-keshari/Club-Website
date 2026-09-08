import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [formSent, setFormSent] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="container">
          <span className="section-label">Get in Touch</span>
          <h1 className="contact-title">Contact Drone & Robotics Club</h1>
          <p className="contact-subtitle">
            Have questions about workshops, industry sponsorships, research collaborations, or joining our labs? Reach out.
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="contact-layout-grid">
            {/* Contact Details & Lab Info */}
            <div className="contact-info-col">
              <div className="aesthetic-card contact-detail-card">
                <h3>Official Communication Channels</h3>
                <p>Feel free to visit our dedicated student lab or send an official email inquiry.</p>

                <div className="contact-channels-list">
                  <div className="channel-item">
                    <div className="channel-icon-box">
                      <Mail size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <span className="channel-label">Official Club Email</span>
                      <a href="mailto:contact@droneandrobotics.club" className="channel-val">
                        contact@droneandrobotics.club
                      </a>
                    </div>
                  </div>

                  <div className="channel-item">
                    <div className="channel-icon-box">
                      <MapPin size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <span className="channel-label">Club Lab & Flight Cage</span>
                      <span className="channel-val">
                        Robotics Innovation Hub, Lab 304, Aerospace & ECE Block
                      </span>
                    </div>
                  </div>

                  <div className="channel-item">
                    <div className="channel-icon-box">
                      <MessageSquare size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <span className="channel-label">Community & Discussion</span>
                      <span className="channel-val">
                        Campus Discord & Weekly Open Lab Hours (Fri 4:00 PM)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="social-links-block">
                  <h4>Official Platforms</h4>
                  <div className="contact-social-row">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="social-pill">
                      GitHub
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-pill">
                      LinkedIn
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-pill">
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="contact-form-col">
              <div className="aesthetic-card contact-form-card">
                <h3>Send Us A Message</h3>
                <p>For external workshop inquiries, event sponsorships, or campus partnerships.</p>

                {formSent ? (
                  <div className="contact-success-msg">
                    <CheckCircle2 size={36} color="var(--color-accent-emerald)" />
                    <h4>Message Dispatched</h4>
                    <p>Thank you. A club administrator will reply to your email shortly.</p>
                    <button className="btn btn-secondary" onClick={() => setFormSent(false)}>
                      Send Another Note
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="quick-contact-form">
                    <div className="form-group">
                      <label htmlFor="contact-name">Your Name *</label>
                      <input 
                        type="text" 
                        id="contact-name" 
                        required 
                        placeholder="e.g. Jordan Lee"
                        value={contactData.name}
                        onChange={(e) => setContactData({...contactData, name: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact-email">Your Email *</label>
                      <input 
                        type="email" 
                        id="contact-email" 
                        required 
                        placeholder="e.g. jordan@example.com"
                        value={contactData.email}
                        onChange={(e) => setContactData({...contactData, email: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact-subj">Subject *</label>
                      <input 
                        type="text" 
                        id="contact-subj" 
                        required 
                        placeholder="e.g. Workshop Collaboration / Lab Visit"
                        value={contactData.subject}
                        onChange={(e) => setContactData({...contactData, subject: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact-msg">Message *</label>
                      <textarea 
                        id="contact-msg" 
                        rows="4" 
                        required 
                        placeholder="Your inquiry or proposal details..."
                        value={contactData.message}
                        onChange={(e) => setContactData({...contactData, message: e.target.value})}
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary submit-contact-btn">
                      Send Message <Send size={15} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}