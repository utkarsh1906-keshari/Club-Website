import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Key, 
  CheckCircle2 
} from 'lucide-react';
import './AdminLogin.css';

const FACULTY_PASSKEY = import.meta.env.VITE_FACULTY_PASSKEY || 'Faculty@ABES2026';
const CLUBHEAD_PASSKEY = import.meta.env.VITE_CLUBHEAD_PASSKEY || 'ClubHead@ABES2026';
const MASTER_KEY = import.meta.env.VITE_ADMIN_MASTER_KEY || 'ABES#DRC2026';

export default function AdminLogin({ onLoginSuccess }) {
  const [credentialInput, setCredentialInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoleHint, setSelectedRoleHint] = useState('faculty');

  const authorizeAndLogin = (profile) => {
    const sessionData = {
      ...profile,
      authenticatedAt: Date.now(),
      expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000 // 14 days active session
    };

    try {
      localStorage.setItem('drc_admin_session', JSON.stringify(sessionData));
    } catch (err) {
      console.error('Session storage error:', err);
    }

    onLoginSuccess(sessionData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const input = (credentialInput || '').trim();
      const lower = input.toLowerCase();

      let profile = null;

      // 1. Check if Club Head credential
      if (
        input === CLUBHEAD_PASSKEY || 
        lower === 'clubhead@abes2026' || 
        lower.includes('clubhead') || 
        lower.includes('leadership@droneandrobotics.club')
      ) {
        profile = {
          role: 'club_head',
          roleTitle: 'Club Head',
          name: 'Executive Club Leadership',
          designation: 'President & Technical Leads',
          department: 'Drones & Robotics Club'
        };
      }
      // 2. Check if Domain Lead credential
      else if (
        input === 'Lead@ABES2026' || 
        lower === 'lead@abes2026' || 
        lower.includes('lead') || 
        lower.includes('asra.aiml') || 
        lower.includes('akshat.vlsi')
      ) {
        profile = {
          role: 'domain_lead',
          roleTitle: 'Domain Lead',
          name: 'Technical Domain Lead',
          designation: 'Vertical Coordinator',
          department: 'AI/ML & Robotics Labs'
        };
      }
      // 3. Check if Event Manager credential
      else if (
        input === 'Events@ABES2026' || 
        lower === 'events@abes2026' || 
        lower.includes('event') || 
        lower.includes('pratham.events')
      ) {
        profile = {
          role: 'event_manager',
          roleTitle: 'Event Manager',
          name: 'Pratham Singh',
          designation: 'Events Coordinator',
          department: 'Events & Operations'
        };
      }
      // 4. Check if Social Media credential
      else if (
        input === 'Media@ABES2026' || 
        lower === 'media@abes2026' || 
        lower.includes('media') || 
        lower.includes('divyansh.media')
      ) {
        profile = {
          role: 'social_media',
          roleTitle: 'Media & Branding Lead',
          name: 'Divyansh Goel',
          designation: 'Social Media Head',
          department: 'Media & Outreach'
        };
      }
      // 5. Universal Master Key / Faculty / Admin / ANY password or ID entered
      else {
        profile = {
          role: 'faculty',
          roleTitle: 'Faculty Advisor (Super Admin)',
          name: 'Ms. Unnati Mehta',
          designation: 'Faculty Coordinator',
          department: 'Dept. of ECE, ABESEC'
        };
      }

      setIsSubmitting(false);
      authorizeAndLogin(profile);
    }, 200);
  };

  const handleQuickLogin = (role) => {
    setIsSubmitting(true);
    let profile = null;

    if (role === 'faculty') {
      profile = {
        role: 'faculty',
        roleTitle: 'Faculty Advisor (Super Admin)',
        name: 'Ms. Unnati Mehta',
        designation: 'Faculty Coordinator',
        department: 'Dept. of ECE, ABESEC'
      };
    } else if (role === 'club_head') {
      profile = {
        role: 'club_head',
        roleTitle: 'Club Head',
        name: 'Executive Club Leadership',
        designation: 'President & Technical Leads',
        department: 'Drones & Robotics Club'
      };
    } else if (role === 'domain_lead') {
      profile = {
        role: 'domain_lead',
        roleTitle: 'Domain Lead',
        name: 'Technical Domain Lead',
        designation: 'Vertical Coordinator',
        department: 'AI/ML & Robotics Labs'
      };
    } else if (role === 'event_manager') {
      profile = {
        role: 'event_manager',
        roleTitle: 'Event Manager',
        name: 'Pratham Singh',
        designation: 'Events Coordinator',
        department: 'Events & Operations'
      };
    } else {
      profile = {
        role: 'social_media',
        roleTitle: 'Media & Branding Lead',
        name: 'Divyansh Goel',
        designation: 'Social Media Head',
        department: 'Media & Outreach'
      };
    }

    setTimeout(() => {
      setIsSubmitting(false);
      authorizeAndLogin(profile);
    }, 200);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card" style={{ maxWidth: '480px' }}>
          {/* Header */}
          <div className="admin-login-header">
            <div className="admin-lock-icon">
              <Lock size={24} />
            </div>
            <h1 className="admin-login-title">Admin Control Center</h1>
            <p className="admin-login-desc">Sign in with any authorized password, passkey, or ID</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="admin-login-form">
            {/* Input */}
            <div className="form-group-login">
              <label htmlFor="credentialInput" className="input-field-label">
                Password, Passkey, or Admin ID
              </label>
              <div className="passkey-input-wrapper">
                <input
                  id="credentialInput"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="Enter any password (e.g. Faculty@ABES2026, admin, etc.)"
                  value={credentialInput}
                  onChange={(e) => setCredentialInput(e.target.value)}
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

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || !credentialInput.trim()}
              className="btn btn-primary login-submit-btn"
              style={{ width: '100%', marginBottom: '1.25rem' }}
            >
              {isSubmitting ? 'Unlocking Control Center...' : 'Unlock Control Center →'}
            </button>

            {/* Quick 1-Click Access Section */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={14} color="var(--color-primary)" /> One-Click Instant Sign In
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-emerald)', fontWeight: 600 }}>
                  Ready
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('faculty')}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'space-between', padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}
                >
                  <span><strong>Faculty Advisor</strong> (Ms. Unnati Mehta &bull; Super Admin)</span>
                  <span className="tag-pill" style={{ fontSize: '0.7rem' }}>Full Access</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('club_head')}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'space-between', padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}
                >
                  <span><strong>Club Head</strong> (Executive Leadership)</span>
                  <span className="tag-pill" style={{ fontSize: '0.7rem' }}>Super Admin</span>
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('domain_lead')}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem', fontSize: '0.75rem', textAlign: 'center' }}
                  >
                    Domain Lead
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('event_manager')}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem', fontSize: '0.75rem', textAlign: 'center' }}
                  >
                    Events Head
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('social_media')}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem', fontSize: '0.75rem', textAlign: 'center' }}
                  >
                    Media Head
                  </button>
                </div>
              </div>
            </div>

            {/* Accepted Credentials Hint */}
            <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: 'var(--color-bg-elevated)', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                Accepted Passwords / IDs:
              </div>
              <div>&bull; <code>Faculty@ABES2026</code> &bull; <code>ClubHead@ABES2026</code> &bull; <code>ABES#DRC2026</code></div>
              <div>&bull; <code>admin</code> &bull; <code>admin123</code> &bull; <code>Lead@ABES2026</code> &bull; <code>Events@ABES2026</code></div>
              <div style={{ marginTop: '0.25rem', color: 'var(--color-text-muted)' }}>Or enter any custom password / ID to open immediately.</div>
            </div>
          </form>

          {/* Back Link */}
          <div className="admin-login-footer" style={{ marginTop: '1.25rem' }}>
            <Link to="/" className="login-back-link">
              <ArrowLeft size={14} />
              <span>Back to public website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
