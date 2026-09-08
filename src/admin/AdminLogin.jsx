import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Crown, 
  ArrowLeft, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import './AdminLogin.css';

// Default authorized credentials (can be overridden via Vite environment variables)
const FACULTY_PASSKEY = import.meta.env.VITE_FACULTY_PASSKEY || 'Faculty@ABES2026';
const CLUBHEAD_PASSKEY = import.meta.env.VITE_CLUBHEAD_PASSKEY || 'ClubHead@ABES2026';
const MASTER_KEY = import.meta.env.VITE_ADMIN_MASTER_KEY || 'ABES#DRC2026';

export default function AdminLogin({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('faculty'); // 'faculty' | 'club_head'
  const [passkey, setPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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
            designation: 'Faculty Coordinator & Assistant Professor',
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
          expiresAt: Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000)
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
        setErrorMsg('Access Denied: Invalid security passkey. Only authorized Faculty Advisors and Executive Club Heads may log in.');
      }
    }, 450);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-overlay"></div>
      
      <div className="admin-login-container">
        {/* Back Link */}
        <div className="login-top-bar">
          <Link to="/" className="login-back-link">
            <ArrowLeft size={16} />
            <span>Return to Public Website</span>
          </Link>
          <span className="restricted-pill">
            <ShieldAlert size={14} />
            <span>RESTRICTED ACCESS</span>
          </span>
        </div>

        {/* Main Card */}
        <div className="aesthetic-card admin-login-card">
          {/* Header */}
          <div className="admin-login-header">
            <div className="login-dual-logos">
              <img 
                src="/college-logo.png" 
                alt="ABES Engineering College" 
                className="login-institution-logo" 
              />
              <div className="login-logo-sep" aria-hidden="true"></div>
              <img 
                src="/club-emblem.png" 
                alt="Drone & Robotics Club" 
                className="login-club-logo" 
              />
            </div>
            
            <h1 className="admin-login-title">Admin Control Center</h1>
            <p className="admin-login-desc">
              Institutional authorization gateway for <strong>ABES Engineering College</strong> Drones &amp; Robotics Club leadership.
            </p>

            {/* Notice Alert Box */}
            <div className="security-notice-box">
              <AlertTriangle size={18} className="notice-icon" />
              <div className="notice-text">
                <strong>Leadership &amp; Faculty Only</strong>
                <p>New members, student applicants, and general visitors are not permitted into this management console.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="admin-login-form">
            {/* Role Switcher */}
            <div className="role-selector-group">
              <label className="input-field-label">Select Authorized Role</label>
              <div className="role-selector-grid">
                <button
                  type="button"
                  className={`role-option-btn ${selectedRole === 'faculty' ? 'selected' : ''}`}
                  onClick={() => { setSelectedRole('faculty'); setErrorMsg(''); }}
                >
                  <div className="role-btn-icon">
                    <GraduationCap size={20} />
                  </div>
                  <div className="role-btn-info">
                    <span className="role-btn-title">Faculty Advisor</span>
                    <span className="role-btn-sub">Ms. Unnati Mehta / Mentors</span>
                  </div>
                  {selectedRole === 'faculty' && <CheckCircle2 size={16} className="role-check-icon" />}
                </button>

                <button
                  type="button"
                  className={`role-option-btn ${selectedRole === 'club_head' ? 'selected' : ''}`}
                  onClick={() => { setSelectedRole('club_head'); setErrorMsg(''); }}
                >
                  <div className="role-btn-icon">
                    <Crown size={20} />
                  </div>
                  <div className="role-btn-info">
                    <span className="role-btn-title">Club Head</span>
                    <span className="role-btn-sub">Executive Core Leadership</span>
                  </div>
                  {selectedRole === 'club_head' && <CheckCircle2 size={16} className="role-check-icon" />}
                </button>
              </div>
            </div>

            {/* Passkey Input */}
            <div className="form-group-login">
              <label htmlFor="passkey" className="input-field-label">
                Security Passkey / Access PIN
              </label>
              <div className="passkey-input-wrapper">
                <Lock size={18} className="input-lead-icon" />
                <input
                  id="passkey"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder={
                    selectedRole === 'faculty' 
                      ? 'Enter Faculty Advisor passkey...' 
                      : 'Enter Club Head access key...'
                  }
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="login-error-alert" role="alert">
                <ShieldAlert size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Remember Me & Submit */}
            <div className="login-form-options">
              <label className="remember-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Keep session active on this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !passkey}
              className="btn btn-primary login-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="login-spinner"></span>
                  <span>Authenticating Authorization...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Authenticate &amp; Open Control Center</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="admin-login-footer">
            <p className="login-footer-warning">
              All unauthorized access attempts are monitored for security compliance. Only designated Faculty Advisors and Executive Club Heads hold authorized passkeys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
