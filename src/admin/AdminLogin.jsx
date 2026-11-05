import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isIdle = searchParams.get('reason') === 'idle' || location.state?.reason === 'idle';

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = (email || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please enter both your email and password.');
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (onLoginSuccess) {
        await onLoginSuccess({ email: cleanEmail, password: cleanPassword });
      } else {
        await signIn(cleanEmail, cleanPassword);
      }
      navigate('/admin');
    } catch (err) {
      setErrorMessage(err.message || 'Wrong email or password');
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
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
            <p className="admin-login-desc">Sign in with your administrative credentials</p>
          </div>

          {isIdle && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.75rem 1rem',
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              borderRadius: '8px',
              color: '#fbbf24',
              fontSize: '0.88rem',
              marginBottom: '1.25rem'
            }}>
              <Clock size={18} style={{ color: '#eab308', flexShrink: 0 }} />
              <span>You were logged out because of inactivity. Please log in again.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            {errorMessage && (
              <div className="login-error-banner" role="alert">
                <AlertCircle size={16} className="login-error-icon" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="form-group-login">
              <label htmlFor="admin-email" className="input-field-label">
                Email Address
              </label>
              <div className={`login-input-wrapper ${isShaking ? 'login-shake' : ''}`}>
                <input
                  id="admin-email"
                  type="email"
                  autoFocus
                  autoComplete="email"
                  placeholder="admin@abes.ac.in"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className={`login-field-input ${errorMessage ? 'has-error' : ''}`}
                  required
                />
              </div>
            </div>

            <div className="form-group-login">
              <label htmlFor="admin-password" className="input-field-label">
                Password
              </label>
              <div className={`login-input-wrapper ${isShaking ? 'login-shake' : ''}`}>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  aria-invalid={!!errorMessage}
                  className={`login-field-input ${errorMessage ? 'has-error' : ''}`}
                  required
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
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
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
