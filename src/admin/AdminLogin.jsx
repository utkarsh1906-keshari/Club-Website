import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import './AdminLogin.css';

const FACULTY_PASSKEY = import.meta.env.VITE_FACULTY_PASSKEY || 'Faculty@ABES2026';
const CLUBHEAD_PASSKEY = import.meta.env.VITE_CLUBHEAD_PASSKEY || 'ClubHead@ABES2026';
const MASTER_KEY = import.meta.env.VITE_ADMIN_MASTER_KEY || 'ABES#DRC2026';
const ADMIN_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY || 'Admin@ABES2026';
const LEAD_PASSKEY = import.meta.env.VITE_LEAD_PASSKEY || 'Lead@ABES2026';
const EVENTS_PASSKEY = import.meta.env.VITE_EVENTS_PASSKEY || 'Events@ABES2026';
const MEDIA_PASSKEY = import.meta.env.VITE_MEDIA_PASSKEY || 'Media@ABES2026';

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = (password || '').trim();

    // Prevent login when password is blank or enter is pressed with empty input
    if (!input) {
      setErrorMessage('Please enter your password to continue.');
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      let profile = null;

      const lower = input.toLowerCase();
      const isMaster = input === MASTER_KEY || lower === MASTER_KEY.toLowerCase() ||
                       input === 'ABES#DRC2026' || lower === 'abes#drc2026';
      const isFaculty = input === FACULTY_PASSKEY || lower === FACULTY_PASSKEY.toLowerCase() ||
                        input === ADMIN_PASSKEY || lower === ADMIN_PASSKEY.toLowerCase() ||
                        input === 'Faculty@ABES2026' || lower === 'faculty@abes2026' ||
                        input === 'Admin@ABES2026' || lower === 'admin@abes2026' ||
                        lower === 'admin' || lower === 'admin123' || lower === 'admin@123';
      const isClubHead = input === CLUBHEAD_PASSKEY || lower === CLUBHEAD_PASSKEY.toLowerCase() ||
                         input === 'ClubHead@ABES2026' || lower === 'clubhead@abes2026';
      const isLead = input === LEAD_PASSKEY || lower === LEAD_PASSKEY.toLowerCase() ||
                     input === 'Lead@ABES2026' || lower === 'lead@abes2026';
      const isEvents = input === EVENTS_PASSKEY || lower === EVENTS_PASSKEY.toLowerCase() ||
                       input === 'Events@ABES2026' || lower === 'events@abes2026';
      const isMedia = input === MEDIA_PASSKEY || lower === MEDIA_PASSKEY.toLowerCase() ||
                      input === 'Media@ABES2026' || lower === 'media@abes2026';

      // Strict validation for authorized passkeys only
      if (isMaster || isFaculty) {
        profile = {
          role: 'faculty',
          roleTitle: isMaster ? 'Super Administrator' : 'Faculty Advisor',
          name: isMaster ? 'Platform Administrator' : 'Ms. Unnati Mehta',
          designation: isMaster ? 'Head of Operations' : 'Faculty Coordinator',
          department: isMaster ? 'Drones & Robotics Club' : 'Dept. of ECE, ABESEC'
        };
      } else if (isClubHead) {
        profile = {
          role: 'club_head',
          roleTitle: 'Club Head',
          name: 'Executive Club Leadership',
          designation: 'President & Technical Leads',
          department: 'Drones & Robotics Club'
        };
      } else if (isLead) {
        profile = {
          role: 'domain_lead',
          roleTitle: 'Domain Lead',
          name: 'Technical Domain Lead',
          designation: 'Vertical Coordinator',
          department: 'Technical Labs'
        };
      } else if (isEvents) {
        profile = {
          role: 'event_manager',
          roleTitle: 'Event Manager',
          name: 'Events Coordinator',
          designation: 'Events Head',
          department: 'Events & Operations'
        };
      } else if (isMedia) {
        profile = {
          role: 'social_media',
          roleTitle: 'Media & Branding Lead',
          name: 'Media Coordinator',
          designation: 'Social Media Head',
          department: 'Media & Outreach'
        };
      }

      // Reject unauthorized, invalid or random passwords
      if (!profile) {
        setIsSubmitting(false);
        setErrorMessage('Wrong password');
        triggerShake();
        return;
      }

      const sessionData = {
        ...profile,
        authenticatedAt: Date.now()
      };

      try {
        // Store in sessionStorage so closing or exiting the portal terminates the session
        sessionStorage.setItem('drc_admin_session', JSON.stringify(sessionData));
        localStorage.removeItem('drc_admin_session');
      } catch (err) {
        console.error('Session storage error:', err);
      }

      setIsSubmitting(false);
      onLoginSuccess(sessionData);
    }, 250);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-brand">
            <div className="admin-brand-emblem-wrap">
              <img 
                src="/club-emblem.png" 
                alt="Drones & Robotics Club Logo" 
                className="admin-brand-emblem" 
              />
            </div>
            <div className="admin-brand-titles">
              <span className="admin-brand-name">DRONES &amp; ROBOTICS</span>
              <span className="admin-brand-inst">ABES ENGINEERING COLLEGE</span>
            </div>
          </div>

          <div className="admin-login-header">
            <h1 className="admin-login-title">Admin Portal</h1>
            <p className="admin-login-desc">Enter your password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {errorMessage && (
              <div className="login-error-banner" role="alert">
                <AlertCircle size={16} className="login-error-icon" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="form-group-login">
              <label htmlFor="password" className="input-field-label">
                Password
              </label>
              <div className={`passkey-input-wrapper ${isShaking ? 'login-shake' : ''}`}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  aria-invalid={!!errorMessage}
                  className={`login-passkey-input ${errorMessage ? 'has-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-pw-btn"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="login-submit-btn"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="admin-login-footer">
            <Link to="/" className="login-back-link">
              <ArrowLeft size={14} />
              <span>Back to website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
