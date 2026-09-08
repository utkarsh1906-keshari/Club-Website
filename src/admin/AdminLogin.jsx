import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import './AdminLogin.css';

const FACULTY_PASSKEY = import.meta.env.VITE_FACULTY_PASSKEY || 'Faculty@ABES2026';
const CLUBHEAD_PASSKEY = import.meta.env.VITE_CLUBHEAD_PASSKEY || 'ClubHead@ABES2026';
const MASTER_KEY = import.meta.env.VITE_ADMIN_MASTER_KEY || 'ABES#DRC2026';

export default function AdminLogin({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('faculty'); // 'faculty' | 'club_head'
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
        setErrorMsg('Invalid passkey. Please try again.');
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
            <h1 className="admin-login-title">Admin Login</h1>
            <p className="admin-login-desc">Sign in to access the management portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="admin-login-form">
            {/* Clean Segmented Role Switcher */}
            <div className="role-tabs">
              <button
                type="button"
                className={`role-tab ${selectedRole === 'faculty' ? 'active' : ''}`}
                onClick={() => { setSelectedRole('faculty'); setErrorMsg(''); }}
              >
                Faculty Advisor
              </button>
              <button
                type="button"
                className={`role-tab ${selectedRole === 'club_head' ? 'active' : ''}`}
                onClick={() => { setSelectedRole('club_head'); setErrorMsg(''); }}
              >
                Club Head
              </button>
            </div>

            {/* Passkey Input */}
            <div className="form-group-login">
              <label htmlFor="passkey" className="input-field-label">
                Passkey
              </label>
              <div className="passkey-input-wrapper">
                <input
                  id="passkey"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  autoComplete="current-password"
                  placeholder="Enter passkey"
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
              {isSubmitting ? 'Signing in...' : 'Sign In'}
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
