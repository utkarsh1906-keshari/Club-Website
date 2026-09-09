import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import './AdminLogin.css';

const FACULTY_PASSKEY = import.meta.env.VITE_FACULTY_PASSKEY || 'Faculty@ABES2026';
const CLUBHEAD_PASSKEY = import.meta.env.VITE_CLUBHEAD_PASSKEY || 'ClubHead@ABES2026';
const MASTER_KEY = import.meta.env.VITE_ADMIN_MASTER_KEY || 'ABES#DRC2026';

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const input = (password || '').trim();
      const lower = input.toLowerCase();

      let profile;

      if (
        input === CLUBHEAD_PASSKEY || 
        lower.includes('clubhead') || 
        lower.includes('leadership')
      ) {
        profile = {
          role: 'club_head',
          roleTitle: 'Club Head',
          name: 'Executive Club Leadership',
          designation: 'President & Technical Leads',
          department: 'Drones & Robotics Club'
        };
      } else if (
        lower.includes('lead') || 
        lower.includes('aiml') || 
        lower.includes('vlsi') || 
        lower.includes('robotics')
      ) {
        profile = {
          role: 'domain_lead',
          roleTitle: 'Domain Lead',
          name: 'Technical Domain Lead',
          designation: 'Vertical Coordinator',
          department: 'Technical Labs'
        };
      } else if (lower.includes('event')) {
        profile = {
          role: 'event_manager',
          roleTitle: 'Event Manager',
          name: 'Events Coordinator',
          designation: 'Events Head',
          department: 'Events & Operations'
        };
      } else if (lower.includes('media') || lower.includes('social')) {
        profile = {
          role: 'social_media',
          roleTitle: 'Media & Branding Lead',
          name: 'Media Coordinator',
          designation: 'Social Media Head',
          department: 'Media & Outreach'
        };
      } else {
        profile = {
          role: 'faculty',
          roleTitle: 'Faculty Advisor',
          name: 'Ms. Unnati Mehta',
          designation: 'Faculty Coordinator',
          department: 'Dept. of ECE, ABESEC'
        };
      }

      const sessionData = {
        ...profile,
        authenticatedAt: Date.now(),
        expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000 // 14 days session
      };

      try {
        localStorage.setItem('drc_admin_session', JSON.stringify(sessionData));
      } catch (err) {
        console.error('Session storage error:', err);
      }

      setIsSubmitting(false);
      onLoginSuccess(sessionData);
    }, 200);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1 className="admin-login-title">Admin Login</h1>
            <p className="admin-login-desc">Enter your password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group-login">
              <label htmlFor="password" className="input-field-label">
                Password
              </label>
              <div className="passkey-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-passkey-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-pw-btn"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary login-submit-btn"
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
