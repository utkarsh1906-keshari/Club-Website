import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import './AdminLogin.css';

const FACULTY_PASSKEY = import.meta.env.VITE_FACULTY_PASSKEY || 'Faculty@ABES2026';
const CLUBHEAD_PASSKEY = import.meta.env.VITE_CLUBHEAD_PASSKEY || 'ClubHead@ABES2026';
const MASTER_KEY = import.meta.env.VITE_ADMIN_MASTER_KEY || 'ABES#DRC2026';

export default function AdminLogin({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('faculty');
  const [passkey, setPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const trimmedKey = passkey.trim();
      let authorized = false;
      let userProfile = null;

      if (selectedRole === 'faculty') {
        if (trimmedKey === FACULTY_PASSKEY || trimmedKey === MASTER_KEY) {
          authorized = true;
          userProfile = {
            role: 'faculty',
            roleTitle: 'Faculty Advisor',
            name: 'Ms. Unnati Mehta',
            designation: 'Faculty Coordinator',
            department: 'Dept. of ECE, ABESEC'
          };
        }
      } else if (selectedRole === 'club_head') {
        if (trimmedKey === CLUBHEAD_PASSKEY || trimmedKey === MASTER_KEY) {
          authorized = true;
          userProfile = {
            role: 'club_head',
            roleTitle: 'Club Head',
            name: 'Executive Club Leadership',
            designation: 'President & Technical Leads',
            department: 'Drones & Robotics Club'
          };
        }
      } else if (selectedRole === 'domain_lead') {
        if (trimmedKey === 'Lead@ABES2026' || trimmedKey === MASTER_KEY || trimmedKey === FACULTY_PASSKEY) {
          authorized = true;
          userProfile = {
            role: 'domain_lead',
            roleTitle: 'Domain Lead',
            name: 'Technical Domain Lead',
            designation: 'Vertical Coordinator',
            department: 'AI/ML & Robotics Labs'
          };
        }
      } else if (selectedRole === 'event_manager') {
        if (trimmedKey === 'Events@ABES2026' || trimmedKey === MASTER_KEY || trimmedKey === FACULTY_PASSKEY) {
          authorized = true;
          userProfile = {
            role: 'event_manager',
            roleTitle: 'Event Manager',
            name: 'Pratham Singh',
            designation: 'Events Coordinator',
            department: 'Events & Operations'
          };
        }
      } else if (selectedRole === 'social_media') {
        if (trimmedKey === 'Media@ABES2026' || trimmedKey === MASTER_KEY || trimmedKey === FACULTY_PASSKEY) {
          authorized = true;
          userProfile = {
            role: 'social_media',
            roleTitle: 'Media & Branding Lead',
            name: 'Divyansh Goel',
            designation: 'Social Media Head',
            department: 'Media & Outreach'
          };
        }
      }

      if (authorized && userProfile) {
        const sessionData = {
          ...userProfile,
          authenticatedAt: Date.now(),
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days session
        };

        try {
          localStorage.setItem('drc_admin_session', JSON.stringify(sessionData));
        } catch (err) {
          console.error('Session storage error:', err);
        }

        setIsSubmitting(false);
        onLoginSuccess(sessionData);
      } else {
        setIsSubmitting(false);
        setErrorMsg('Invalid passkey. You can use master key ABES#DRC2026 for testing.');
      }
    }, 300);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          {/* Minimal Header */}
          <div className="admin-login-header">
            <div className="admin-lock-icon">
              <Lock size={22} />
            </div>
            <h1 className="admin-login-title">Admin Console</h1>
            <p className="admin-login-desc">Sign in with authorized role passkey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="admin-login-form">
            {/* Clean Segmented Role Switcher */}
            <div className="role-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              <button
                type="button"
                className={`role-tab ${selectedRole === 'faculty' ? 'active' : ''}`}
                onClick={() => { setSelectedRole('faculty'); setErrorMsg(''); }}
                style={{ flex: '1 1 45%', fontSize: '0.8rem', padding: '0.4rem 0.5rem' }}
              >
                Faculty Advisor
              </button>
              <button
                type="button"
                className={`role-tab ${selectedRole === 'club_head' ? 'active' : ''}`}
                onClick={() => { setSelectedRole('club_head'); setErrorMsg(''); }}
                style={{ flex: '1 1 45%', fontSize: '0.8rem', padding: '0.4rem 0.5rem' }}
              >
                Club Head
              </button>
              <button
                type="button"
                className={`role-tab ${selectedRole === 'domain_lead' ? 'active' : ''}`}
                onClick={() => { setSelectedRole('domain_lead'); setErrorMsg(''); }}
                style={{ flex: '1 1 30%', fontSize: '0.75rem', padding: '0.35rem 0.4rem' }}
              >
                Domain Lead
              </button>
              <button
                type="button"
                className={`role-tab ${selectedRole === 'event_manager' ? 'active' : ''}`}
                onClick={() => { setSelectedRole('event_manager'); setErrorMsg(''); }}
                style={{ flex: '1 1 30%', fontSize: '0.75rem', padding: '0.35rem 0.4rem' }}
              >
                Events
              </button>
              <button
                type="button"
                className={`role-tab ${selectedRole === 'social_media' ? 'active' : ''}`}
                onClick={() => { setSelectedRole('social_media'); setErrorMsg(''); }}
                style={{ flex: '1 1 30%', fontSize: '0.75rem', padding: '0.35rem 0.4rem' }}
              >
                Media
              </button>
            </div>

            {/* Passkey Input */}
            <div className="form-group-login">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <label htmlFor="passkey" className="input-field-label">
                  Passkey
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Default: <code>{selectedRole === 'faculty' ? 'Faculty@ABES2026' : selectedRole === 'club_head' ? 'ClubHead@ABES2026' : 'ABES#DRC2026'}</code>
                </span>
              </div>
              <div className="passkey-input-wrapper">
                <input
                  id="passkey"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  autoComplete="current-password"
                  placeholder="Enter role passkey"
                  value={passkey}
                  onChange={(e) => { setPasskey(e.target.value); setErrorMsg(''); }}
                  className="login-passkey-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-pw-btn"
                  title={showPassword ? 'Hide passkey' : 'Show passkey'}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="login-error-alert" role="alert">
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || !passkey}
              className="btn btn-primary login-submit-btn"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          {/* Back Link */}
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
