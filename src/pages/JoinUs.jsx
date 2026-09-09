import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Brain,
  Cpu,
  Bot,
  Plane
} from 'lucide-react';
import { applicationsService, recruitmentService, DEFAULT_FORM_QUESTIONS } from '../lib/dataService';
import './JoinUs.css';

export default function JoinUs() {
  const [cycleConfig, setCycleConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [checkingCycle, setCheckingCycle] = useState(true);
  const [alreadySubmittedEmail, setAlreadySubmittedEmail] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    branch: '',
    year: '1st Year (Freshman)',
    domain: 'AI/ML',
    role: 'Technical Developer / Engineer',
    reason: '',
    portfolio: ''
  });

  const [customAnswers, setCustomAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    async function loadCycle() {
      try {
        const [config, qList] = await Promise.all([
          recruitmentService.getCycleConfig(),
          recruitmentService.getQuestions()
        ]);
        setCycleConfig(config);
        setQuestions(qList || config.questions || DEFAULT_FORM_QUESTIONS);
        
        if (config && config.id) {
          const prior = localStorage.getItem(`drc_applied_${config.id}`);
          if (prior) {
            setAlreadySubmittedEmail(prior);
          }
        }
      } catch (err) {
        console.error('Failed to load recruitment cycle:', err);
      } finally {
        setCheckingCycle(false);
      }
    }
    loadCycle();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
    if (isDuplicate) setIsDuplicate(false);
  };

  const handleCustomChange = (label, value) => {
    setCustomAnswers(prev => ({ ...prev, [label]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setIsDuplicate(false);

    try {
      const cleanEmail = (formData.email || '').trim().toLowerCase();

      // Duplicate email check
      if (cycleConfig?.id) {
        const exists = await applicationsService.checkEmailExists(cleanEmail, cycleConfig.id);
        if (exists) {
          setIsDuplicate(true);
          setErrorMsg(
            `An application with email "${formData.email}" has already been submitted for ${cycleConfig.title || 'this cycle'}. Multiple submissions are not permitted.`
          );
          setLoading(false);
          return;
        }
      }

      await applicationsService.create({
        name: formData.name || 'Candidate Applicant',
        email: cleanEmail,
        student_id: formData.studentId || 'N/A',
        branch: formData.branch || 'N/A',
        year: formData.year || '1st Year',
        domain: formData.domain || 'AI/ML',
        role: formData.role || 'Technical',
        reason: formData.reason || '',
        portfolio_url: formData.portfolio || '',
        custom_answers: customAnswers
      });

      if (cycleConfig?.id) {
        localStorage.setItem(`drc_applied_${cycleConfig.id}`, cleanEmail);
        setAlreadySubmittedEmail(cleanEmail);
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Application submission error:', err);
      const msg = err.message || 'Failed to submit application. Please check your details and try again.';
      if (msg.toLowerCase().includes('already been submitted') || msg.toLowerCase().includes('multiple submissions')) {
        setIsDuplicate(true);
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  if (checkingCycle) {
    return (
      <div className="join-page">
        <div className="container" style={{ padding: '7rem 1.5rem', textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1.5rem' }}></div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Checking recruitment status...</p>
        </div>
      </div>
    );
  }

  const isClosed = !cycleConfig?.is_active;
  const activeQuestions = questions.filter(q => q.active !== false);

  // Group active questions: grid-compatible vs full-width
  const isQuestionActive = (id) => activeQuestions.some(q => q.id === id);

  return (
    <div className="join-page">
      {/* Institutional Hero Header */}
      <section className="join-hero">
        <div className="container">
          <div className="join-hero-crest-wrapper">
            <div className="join-hero-crest-box">
              <img 
                src="/club-emblem.png" 
                alt="Drone & Robotics Club - ABES Logo" 
                className="join-hero-crest-img" 
              />
            </div>
          </div>

          <span className="section-label">Club Membership</span>
          <h1 className="join-title">Join The Club</h1>
          <div className="heading-line-maroon" style={{ margin: '0.5rem auto 1.25rem auto' }}></div>
          <p className="join-subtitle">
            Be a part of our multidisciplinary technical domains and creative management squads at ABES Engineering College.
          </p>

          <div style={{ marginTop: '1.25rem' }}>
            {isClosed ? (
              <span className="status-pill status-closed">
                <span className="status-dot status-dot-inactive"></span> Applications Currently Closed
              </span>
            ) : (
              <span className="status-pill status-active">
                <span className="status-dot"></span> Applications Open &bull; {cycleConfig?.title}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: isClosed ? '920px' : '820px' }}>
          {isClosed ? (
            /* CLOSED RECRUITMENT VIEW */
            <div className="aesthetic-card closed-recruitment-card">
              <div className="closed-banner-inner">
                <div className="closed-header-content">
                  <h2 className="closed-heading">Recruitment Window Closed</h2>
                  <p className="closed-description">
                    {cycleConfig?.closed_message || 
                      'Recruitment for the Drones & Robotics Club takes place in scheduled semester drives. Submissions are currently paused while our technical squads review applications and run project labs.'}
                  </p>
                </div>
              </div>

              {/* Four Technical Domains Preview Cards */}
              <div className="closed-prep-section">
                <h3 className="closed-prep-title">Prepare for the next induction round</h3>
                <p className="closed-prep-desc">
                  Review our four technical verticals to see what tools, hardware, and skillsets our projects focus on:
                </p>

                <div className="domain-prep-grid">
                  <div className="domain-prep-card">
                    <div className="domain-prep-icon">
                      <Brain size={22} color="var(--color-primary)" />
                    </div>
                    <h4>AI &amp; Machine Learning</h4>
                    <p>Computer vision, object detection, ROS2 navigation, and edge neural inference.</p>
                  </div>

                  <div className="domain-prep-card">
                    <div className="domain-prep-icon">
                      <Cpu size={22} color="var(--color-primary)" />
                    </div>
                    <h4>VLSI &amp; Chip Design</h4>
                    <p>FPGA telemetry, synthesizable Verilog, digital logic, and custom hardware accelerators.</p>
                  </div>

                  <div className="domain-prep-card">
                    <div className="domain-prep-icon">
                      <Bot size={22} color="var(--color-primary)" />
                    </div>
                    <h4>Robotics &amp; IoT</h4>
                    <p>Autonomous mobile rovers, LiDAR sensors, embedded microcontrollers, and actuators.</p>
                  </div>

                  <div className="domain-prep-card">
                    <div className="domain-prep-icon">
                      <Plane size={22} color="var(--color-primary)" />
                    </div>
                    <h4>Drone Technology</h4>
                    <p>Aerodynamics, carbon airframe assembly, Betaflight ESC tuning, and flight autonomy.</p>
                  </div>
                </div>

                <div className="closed-actions-bar">
                  <Link to="/domains" className="btn btn-primary">
                    Explore Technical Domains &rarr;
                  </Link>
                  <Link to="/projects" className="btn btn-secondary">
                    Browse Club Projects
                  </Link>
                  <Link to="/events" className="btn btn-secondary">
                    View Workshops &amp; Events
                  </Link>
                </div>
              </div>
            </div>
          ) : submitted ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="aesthetic-card success-card">
              <div className="success-icon-box">
                <CheckCircle2 size={48} color="var(--color-accent-emerald)" />
              </div>
              <h2>Application Received!</h2>
              <p>
                Thank you for applying, <strong>{formData.name}</strong>. Your recruitment submission has been recorded successfully.
              </p>
              <p className="success-subtext">
                Club domain leads review applications iteratively. You will receive an interview / lab briefing invitation via <strong>{formData.email}</strong>.
              </p>
              
              <div className="success-note">
                <strong>Notice:</strong> Your application is registered with email <code>{formData.email}</code>. Duplicate submissions are not accepted.
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/" className="btn btn-primary">
                  Return to Home
                </Link>
                <Link to="/projects" className="btn btn-secondary">
                  Explore Club Projects &rarr;
                </Link>
              </div>
            </div>
          ) : (
            /* DYNAMIC APPLICATION FORM (Questions controlled by Admin) */
            <form onSubmit={handleSubmit} className="aesthetic-card application-form">
              <div className="form-header">
                <h2>Candidate Application Form</h2>
                <p>
                  Please fill out the authentic details below. Only one submission is permitted per student email.
                </p>

                {alreadySubmittedEmail && (
                  <div className="already-applied-banner">
                    <Clock size={16} />
                    <span>
                      Notice: You previously submitted an application with <strong>{alreadySubmittedEmail}</strong>. Submitting again with the same email will be rejected.
                    </span>
                  </div>
                )}

                {errorMsg && (
                  <div className={`form-alert-box ${isDuplicate ? 'alert-duplicate' : 'alert-error'}`}>
                    <AlertCircle size={20} className="alert-icon" />
                    <div>
                      <strong>{isDuplicate ? 'Duplicate Submission Blocked' : 'Application Error'}</strong>
                      <p>{errorMsg}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-grid">
                {/* 1. Full Name */}
                {isQuestionActive('name') && (
                  <div className="form-group">
                    <label htmlFor="name">
                      {activeQuestions.find(q => q.id === 'name')?.label || 'Full Name'} *
                    </label>
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
                )}

                {/* 2. College Email Address */}
                {isQuestionActive('email') && (
                  <div className="form-group">
                    <label htmlFor="email">
                      {activeQuestions.find(q => q.id === 'email')?.label || 'College Email Address'} *
                      <span className="input-hint-inline">(1 submission per email)</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="e.g. student@college.edu"
                      value={formData.email}
                      onChange={handleChange}
                      className={isDuplicate ? 'input-error-highlight' : ''}
                    />
                  </div>
                )}

                {/* 3. Student ID / Roll Number */}
                {isQuestionActive('studentId') && (
                  <div className="form-group">
                    <label htmlFor="studentId">
                      {activeQuestions.find(q => q.id === 'studentId')?.label || 'Student ID / Roll Number'}
                      {activeQuestions.find(q => q.id === 'studentId')?.required && ' *'}
                    </label>
                    <input
                      type="text"
                      id="studentId"
                      name="studentId"
                      required={activeQuestions.find(q => q.id === 'studentId')?.required}
                      placeholder="e.g. 2300320100012"
                      value={formData.studentId}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {/* 4. Branch */}
                {isQuestionActive('branch') && (
                  <div className="form-group">
                    <label htmlFor="branch">
                      {activeQuestions.find(q => q.id === 'branch')?.label || 'Department / Academic Branch'}
                      {activeQuestions.find(q => q.id === 'branch')?.required && ' *'}
                    </label>
                    <input
                      type="text"
                      id="branch"
                      name="branch"
                      required={activeQuestions.find(q => q.id === 'branch')?.required}
                      placeholder="e.g. Computer Science, Electronics, Mechanical"
                      value={formData.branch}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {/* 5. Year */}
                {isQuestionActive('year') && (
                  <div className="form-group">
                    <label htmlFor="year">
                      {activeQuestions.find(q => q.id === 'year')?.label || 'Current Year of Study'} *
                    </label>
                    <select id="year" name="year" value={formData.year} onChange={handleChange}>
                      <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                      <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                      <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                      <option value="4th Year (Senior)">4th Year (Senior)</option>
                    </select>
                  </div>
                )}

                {/* 6. Domain */}
                {isQuestionActive('domain') && (
                  <div className="form-group">
                    <label htmlFor="domain">
                      {activeQuestions.find(q => q.id === 'domain')?.label || 'Preferred Technical Domain'} *
                    </label>
                    <select id="domain" name="domain" value={formData.domain} onChange={handleChange}>
                      <option value="AI/ML">AI & Machine Learning</option>
                      <option value="VLSI">Very Large Scale Integration (VLSI)</option>
                      <option value="Robotics & IoT">Robotics & IoT</option>
                      <option value="Drone Technology">Drone Technology</option>
                      <option value="None / Pure Management">None / Pure Management Role</option>
                    </select>
                  </div>
                )}

                {/* 7. Role */}
                {isQuestionActive('role') && (
                  <div className="form-group">
                    <label htmlFor="role">
                      {activeQuestions.find(q => q.id === 'role')?.label || 'Functional or Technical Role'} *
                    </label>
                    <select id="role" name="role" value={formData.role} onChange={handleChange}>
                      <option value="Technical Developer / Engineer">Technical Developer / Engineer</option>
                      <option value="Creative & UI/UX Design">Creative & UI/UX Design</option>
                      <option value="Social Media & Communications">Social Media & Communications</option>
                      <option value="Events & Operations">Events & Operations</option>
                      <option value="PR & Corporate Outreach">PR & Corporate Outreach</option>
                      <option value="Technical Content & Documentation">Technical Content & Documentation</option>
                      <option value="Other Functional Role">Other Functional Role</option>
                    </select>
                  </div>
                )}

                {/* 8. Portfolio */}
                {isQuestionActive('portfolio') && (
                  <div className="form-group">
                    <label htmlFor="portfolio">
                      {activeQuestions.find(q => q.id === 'portfolio')?.label || 'GitHub / Portfolio Link'}
                      {activeQuestions.find(q => q.id === 'portfolio')?.required && ' *'}
                    </label>
                    <input
                      type="url"
                      id="portfolio"
                      name="portfolio"
                      required={activeQuestions.find(q => q.id === 'portfolio')?.required}
                      placeholder="https://github.com/username"
                      value={formData.portfolio}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {/* Custom Single-Line Fields Added by Admin */}
                {activeQuestions.filter(q => !q.is_default && q.type !== 'textarea').map(q => (
                  <div key={q.id} className="form-group">
                    <label htmlFor={q.id}>
                      {q.label} {q.required && '*'}
                    </label>

                    {q.type === 'select' ? (
                      <select
                        id={q.id}
                        required={q.required}
                        value={customAnswers[q.label] || ''}
                        onChange={e => handleCustomChange(q.label, e.target.value)}
                      >
                        <option value="">Select an option</option>
                        {(q.options || []).map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : q.type === 'url' ? (
                      <input
                        type="url"
                        id={q.id}
                        required={q.required}
                        placeholder="https://"
                        value={customAnswers[q.label] || ''}
                        onChange={e => handleCustomChange(q.label, e.target.value)}
                      >
                      </input>
                    ) : q.type === 'tel' ? (
                      <input
                        type="tel"
                        id={q.id}
                        required={q.required}
                        placeholder="e.g. +91 98765 43210"
                        value={customAnswers[q.label] || ''}
                        onChange={e => handleCustomChange(q.label, e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        id={q.id}
                        required={q.required}
                        placeholder={`Enter ${q.label}...`}
                        value={customAnswers[q.label] || ''}
                        onChange={e => handleCustomChange(q.label, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* 9. Reason (Textarea) */}
              {isQuestionActive('reason') && (
                <div className="form-group full-width">
                  <label htmlFor="reason">
                    {activeQuestions.find(q => q.id === 'reason')?.label || 'Why do you want to join the Drone & Robotics Club?'}
                    {activeQuestions.find(q => q.id === 'reason')?.required && ' *'}
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows="4"
                    required={activeQuestions.find(q => q.id === 'reason')?.required}
                    placeholder="Tell us about your interests, past projects, or what skills you want to develop with the club..."
                    value={formData.reason}
                    onChange={handleChange}
                  ></textarea>
                </div>
              )}

              {/* Custom Paragraph Questions Added by Admin */}
              {activeQuestions.filter(q => !q.is_default && q.type === 'textarea').map(q => (
                <div key={q.id} className="form-group full-width">
                  <label htmlFor={q.id}>
                    {q.label} {q.required && '*'}
                  </label>
                  <textarea
                    id={q.id}
                    rows="3"
                    required={q.required}
                    placeholder={`Write your answer for ${q.label}...`}
                    value={customAnswers[q.label] || ''}
                    onChange={e => handleCustomChange(q.label, e.target.value)}
                  ></textarea>
                </div>
              ))}

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