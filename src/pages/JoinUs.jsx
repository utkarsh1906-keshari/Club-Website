import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { applicationsService } from '../lib/dataService';
import './JoinUs.css';

export default function JoinUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    branch: '',
    year: '1',
    domain: 'AI/ML',
    role: 'Technical',
    reason: '',
    portfolio: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await applicationsService.create({
        name: formData.name,
        email: formData.email,
        student_id: formData.studentId,
        branch: formData.branch,
        year: formData.year,
        domain: formData.domain,
        role: formData.role,
        reason: formData.reason,
        portfolio_url: formData.portfolio
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Application submission error:', err);
      setErrorMsg('Failed to submit application. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-page">
      {/* Hero */}
      <section className="join-hero">
        <div className="container">
          <span className="section-label">Recruitment 2026–2027</span>
          <h1 className="join-title">Apply to Join The Club</h1>
          <p className="join-subtitle">
            Whether your passion lies in computer vision, drone aerodynamics, custom silicon, or creative design and media management, build with us.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding">
        <div className="container form-container">
          {submitted ? (
            <div className="aesthetic-card success-card">
              <div className="success-icon-box">
                <CheckCircle2 size={48} color="var(--color-accent-emerald)" />
              </div>
              <h2>Application Received!</h2>
              <p>
                Thank you for applying, <strong>{formData.name}</strong>. Your recruitment submission for the <strong>{formData.domain}</strong> domain ({formData.role} role) has been logged.
              </p>
              <p className="success-subtext">
                Club domain leads review applications iteratively. You will receive an interview / lab briefing invitation via <strong>{formData.email}</strong>.
              </p>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '', email: '', studentId: '', branch: '', year: '1',
                    domain: 'AI/ML', role: 'Technical', reason: '', portfolio: ''
                  });
                }}
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="aesthetic-card application-form">
              <div className="form-header">
                <h2>Candidate Application Form</h2>
                <p>Please fill out your authentic academic and interest details.</p>
                {errorMsg && (
                  <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', marginTop: '1rem', fontSize: '0.9rem' }}>
                    {errorMsg}
                  </div>
                )}
              </div>

              <div className="form-grid">
                {/* Name */}
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">College Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="e.g. student@college.edu"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Student ID */}
                <div className="form-group">
                  <label htmlFor="studentId">Student ID / Roll Number *</label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    required
                    placeholder="e.g. 2024CSB1042"
                    value={formData.studentId}
                    onChange={handleChange}
                  />
                </div>

                {/* Branch */}
                <div className="form-group">
                  <label htmlFor="branch">Department / Academic Branch *</label>
                  <input
                    type="text"
                    id="branch"
                    name="branch"
                    required
                    placeholder="e.g. Computer Science, Electronics, Mechanical"
                    value={formData.branch}
                    onChange={handleChange}
                  />
                </div>

                {/* Year */}
                <div className="form-group">
                  <label htmlFor="year">Current Year of Study *</label>
                  <select id="year" name="year" value={formData.year} onChange={handleChange}>
                    <option value="1">1st Year (Freshman)</option>
                    <option value="2">2nd Year (Sophomore)</option>
                    <option value="3">3rd Year (Junior)</option>
                    <option value="4">4th Year (Senior)</option>
                  </select>
                </div>

                {/* Interested Domain */}
                <div className="form-group">
                  <label htmlFor="domain">Preferred Technical Domain *</label>
                  <select id="domain" name="domain" value={formData.domain} onChange={handleChange}>
                    <option value="AI/ML">AI & Machine Learning</option>
                    <option value="VLSI">Very Large Scale Integration(VLSI)</option>
                    <option value="Robotics & IoT">Robotics & IOT</option>
                    <option value="Drone Technology">Drone Technology</option>
                    <option value="None / Pure Management">None / Pure Functional Role</option>
                  </select>
                </div>

                {/* Interested Role */}
                <div className="form-group">
                  <label htmlFor="role">Functional or Technical Role *</label>
                  <select id="role" name="role" value={formData.role} onChange={handleChange}>
                    <option value="Technical">Technical Developer / Engineer</option>
                    <option value="Design">Creative & UI/UX Design</option>
                    <option value="Social Media">Social Media & Communications</option>
                    <option value="Events">Events & Operations</option>
                    <option value="PR/Outreach">PR & Corporate Outreach</option>
                    <option value="Content">Technical Content & Documentation</option>
                    <option value="Other">Other Role</option>
                  </select>
                </div>

                {/* Portfolio link */}
                <div className="form-group">
                  <label htmlFor="portfolio">GitHub / LinkedIn / Portfolio Link (Optional)</label>
                  <input
                    type="url"
                    id="portfolio"
                    name="portfolio"
                    placeholder="https://github.com/username"
                    value={formData.portfolio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="form-group full-width">
                <label htmlFor="reason">Why do you want to join the Drone & Robotics Club? *</label>
                <textarea
                  id="reason"
                  name="reason"
                  rows="4"
                  required
                  placeholder="Tell us about your interests, past hardware/software projects, or what skills you want to develop with the club..."
                  value={formData.reason}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                  {loading ? 'Submitting Application...' : (
                    <>Submit Membership Application <Send size={15} /></>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}