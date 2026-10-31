import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  RefreshCw, 
  ShieldAlert, 
  ExternalLink, 
  Save,
  Check,
  Calendar,
  AlertCircle,
  PlusCircle,
  Lock,
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { recruitmentService } from '../lib/dataService';

export default function SettingsAdmin() {
  const { adminProfile } = useAuth();
  const isSuperAdmin = adminProfile?.role === 'super_admin';

  const [copied, setCopied] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Recruitment Cycle state
  const [cycle, setCycle] = useState(null);
  const [loadingCycle, setLoadingCycle] = useState(true);
  const [savingCycle, setSavingCycle] = useState(false);
  const [cycleError, setCycleError] = useState(null);
  const [cycleSuccess, setCycleSuccess] = useState(null);
  const [cycleForm, setCycleForm] = useState({
    id: '',
    title: '',
    subtitle: '',
    target_years: '',
    deadline: '',
    is_active: true,
    closed_message: '',
    instructions: ''
  });

  const isSupabaseConfigured = !!supabase;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'Not configured';
  const isProd = import.meta.env.PROD;

  const loadCycle = async () => {
    setLoadingCycle(true);
    setCycleError(null);
    try {
      const data = await recruitmentService.getLatestCycle();
      if (data) {
        setCycle(data);
        setCycleForm({
          id: data.id || '',
          title: data.title || '',
          subtitle: data.subtitle || '',
          target_years: data.target_years || '',
          deadline: data.deadline ? String(data.deadline).split('T')[0] : '',
          is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
          closed_message: data.closed_message || '',
          instructions: data.instructions || ''
        });
      } else {
        setCycle(null);
        setCycleForm({
          id: 'cycle-2026-2027',
          title: 'Recruitment Drive 2026-2027',
          subtitle: 'Innovate. Design. Build. Fly.',
          target_years: '1st & 2nd Year B.Tech',
          deadline: '',
          is_active: true,
          closed_message: 'Applications for this recruitment cycle are now officially closed. Stay tuned for future rounds!',
          instructions: 'Fill out this application with accurate information. Domain-specific portfolio or projects are strongly encouraged.'
        });
      }
    } catch (err) {
      console.error('Failed to load recruitment cycle:', err);
      setCycleError(err.message || 'Failed to load recruitment cycle.');
    } finally {
      setLoadingCycle(false);
    }
  };

  useEffect(() => {
    loadCycle();
  }, []);

  const handleSaveCycle = async (e) => {
    e.preventDefault();
    if (!cycle?.id) return;
    setSavingCycle(true);
    setCycleError(null);
    setCycleSuccess(null);
    try {
      const updated = await recruitmentService.updateCycle(cycle.id, {
        title: cycleForm.title,
        subtitle: cycleForm.subtitle,
        target_years: cycleForm.target_years,
        deadline: cycleForm.deadline,
        is_active: cycleForm.is_active,
        closed_message: cycleForm.closed_message,
        instructions: cycleForm.instructions
      });
      setCycle(updated);
      setCycleForm({
        id: updated.id,
        title: updated.title || '',
        subtitle: updated.subtitle || '',
        target_years: updated.target_years || '',
        deadline: updated.deadline ? String(updated.deadline).split('T')[0] : '',
        is_active: Boolean(updated.is_active),
        closed_message: updated.closed_message || '',
        instructions: updated.instructions || ''
      });
      setCycleSuccess(`Recruitment cycle "${updated.title}" updated successfully.`);
      setTimeout(() => setCycleSuccess(null), 5000);
    } catch (err) {
      console.error('Failed to save cycle:', err);
      setCycleError(err.message || 'Failed to update recruitment cycle in database.');
    } finally {
      setSavingCycle(false);
    }
  };

  const handleCreateCycle = async (e) => {
    e.preventDefault();
    if (!cycleForm.id || !cycleForm.title || !cycleForm.target_years) {
      setCycleError('Cycle ID (e.g. cycle-2026-2027), title, and target years are required.');
      return;
    }
    setSavingCycle(true);
    setCycleError(null);
    setCycleSuccess(null);
    try {
      const created = await recruitmentService.createCycle({
        id: cycleForm.id,
        title: cycleForm.title,
        subtitle: cycleForm.subtitle,
        target_years: cycleForm.target_years,
        deadline: cycleForm.deadline,
        is_active: cycleForm.is_active,
        closed_message: cycleForm.closed_message,
        instructions: cycleForm.instructions
      });
      setCycle(created);
      setCycleForm({
        id: created.id,
        title: created.title || '',
        subtitle: created.subtitle || '',
        target_years: created.target_years || '',
        deadline: created.deadline ? String(created.deadline).split('T')[0] : '',
        is_active: Boolean(created.is_active),
        closed_message: created.closed_message || '',
        instructions: created.instructions || ''
      });
      setCycleSuccess(`Recruitment cycle "${created.title}" created successfully.`);
      setTimeout(() => setCycleSuccess(null), 5000);
    } catch (err) {
      console.error('Failed to create cycle:', err);
      setCycleError(err.message || 'Failed to create recruitment cycle in database.');
    } finally {
      setSavingCycle(false);
    }
  };

  const handleCopySchema = () => {
    fetch('/supabase_schema.sql')
      .then(res => res.text())
      .then(sql => {
        navigator.clipboard.writeText(sql);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {
        navigator.clipboard.writeText('-- Run supabase_schema.sql in your Supabase SQL Editor');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
  };

  const handleResetSeedData = () => {
    if (window.confirm('This will clear your local browser demo data. Continue?')) {
      const keys = ['domains', 'projects', 'events', 'event_registrations', 'members', 'applications', 'announcements', 'recruitment_cycle'];
      keys.forEach(k => localStorage.removeItem('drc_' + k));
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        window.location.reload();
      }, 1200);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Platform Settings &amp; Infrastructure</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Configure recruitment cycles, monitor database health, manage environment connections, and review system configuration.
        </p>
      </div>

      {/* Recruitment Cycle Management Card */}
      <div className="aesthetic-card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Active Recruitment Cycle</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Configure cycle status, application deadline, and instructions
              </span>
            </div>
          </div>
          {cycle && (
            <span className="tag-pill" style={{
              background: cycle.is_active ? '#ecfdf5' : '#fef2f2',
              color: cycle.is_active ? '#059669' : '#dc2626',
              border: `1px solid ${cycle.is_active ? '#a7f3d0' : '#fecaca'}`,
              fontWeight: 600
            }}>
              {cycle.is_active ? '● Cycle Active' : '○ Applications Closed'}
            </span>
          )}
        </div>

        {!isSuperAdmin ? (
          <div style={{ padding: '1.25rem', background: 'var(--color-bg-elevated)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-secondary)' }}>
            <Lock size={18} style={{ color: 'var(--color-text-muted)' }} />
            <span>Only super admins can change recruitment cycles. Contact a platform administrator to update drive settings.</span>
          </div>
        ) : loadingCycle ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading recruitment cycle configuration...
          </div>
        ) : (
          <div>
            {cycleError && (
              <div style={{ padding: '0.85rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.9rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>{cycleError}</span>
              </div>
            )}

            {cycleSuccess && (
              <div style={{ padding: '0.85rem 1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#059669', fontSize: '0.9rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} />
                <span>{cycleSuccess}</span>
              </div>
            )}

            <form onSubmit={cycle ? handleSaveCycle : handleCreateCycle}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                {!cycle && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                      Cycle ID (Text slug) *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={cycleForm.id}
                      onChange={(e) => setCycleForm({ ...cycleForm, id: e.target.value })}
                      placeholder="e.g. cycle-2026-2027"
                      required
                      style={{ width: '100%' }}
                    />
                    <small style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Unique text identifier for this recruitment drive</small>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Drive Title *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={cycleForm.title}
                    onChange={(e) => setCycleForm({ ...cycleForm, title: e.target.value })}
                    placeholder="e.g. Recruitment Drive 2026-2027"
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Subtitle / Theme
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={cycleForm.subtitle}
                    onChange={(e) => setCycleForm({ ...cycleForm, subtitle: e.target.value })}
                    placeholder="e.g. Innovate. Design. Build. Fly."
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Target Batches / Years *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={cycleForm.target_years}
                    onChange={(e) => setCycleForm({ ...cycleForm, target_years: e.target.value })}
                    placeholder="e.g. 1st & 2nd Year B.Tech"
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={cycleForm.deadline}
                    onChange={(e) => setCycleForm({ ...cycleForm, deadline: e.target.value })}
                    style={{ width: '100%' }}
                  />
                  <small style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.35rem' }}>
                    <Clock size={12} /> Deadline day is inclusive (applications stay open through the end of this date in India time, IST).
                  </small>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={cycleForm.is_active}
                    onChange={(e) => setCycleForm({ ...cycleForm, is_active: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Recruitment Open / Active (uncheck to manually close applications immediately)</span>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Closed Message (shown to candidates when drive is closed)
                  </label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={cycleForm.closed_message}
                    onChange={(e) => setCycleForm({ ...cycleForm, closed_message: e.target.value })}
                    placeholder="Applications for this cycle are now officially closed..."
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Candidate Instructions &amp; Advice
                  </label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={cycleForm.instructions}
                    onChange={(e) => setCycleForm({ ...cycleForm, instructions: e.target.value })}
                    placeholder="Provide accurate portfolio links, GitHub, and details..."
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="submit"
                  disabled={savingCycle}
                  className="btn btn-primary"
                  style={{ gap: '0.5rem', minWidth: '160px', justifyContent: 'center' }}
                >
                  {savingCycle ? (
                    'Saving...'
                  ) : cycle ? (
                    <>
                      <Save size={16} /> Save Recruitment Cycle
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} /> Create Cycle
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Backend & Infrastructure Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {/* Backend Status Card */}
        <div className="aesthetic-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Database Health</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Supabase PostgreSQL Engine</span>
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'var(--color-bg-elevated)', borderRadius: '8px', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Connection Mode:</span>
              {isSupabaseConfigured ? (
                <span className="tag-pill" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                  <CheckCircle2 size={12} /> Supabase Live Cloud (connected)
                </span>
              ) : isProd ? (
                <span className="tag-pill" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                  <XCircle size={12} /> Supabase not connected. Check environment variables on Vercel.
                </span>
              ) : (
                <span className="tag-pill" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                  <CheckCircle2 size={12} /> Local demo mode (DEV only)
                </span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', flexWrap: 'wrap', gap: '0.35rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Target Host:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', wordBreak: 'break-all' }}>
                {supabaseUrl.includes('your-project-id') ? 'Not set in .env' : supabaseUrl}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            {isProd 
              ? 'The platform connects directly to Supabase PostgreSQL for all real-time club operations, team records, announcements, and events.'
              : 'Development environment. Connects to Supabase PostgreSQL when credentials exist in .env, or runs in local mock mode for offline testing.'}
          </p>

          <a 
            href="https://supabase.com/dashboard" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            Open Supabase Dashboard <ExternalLink size={14} />
          </a>
        </div>

        {/* Database Migration Script (Shown in DEV, or replaced with note in PROD) */}
        <div className="aesthetic-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Copy size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Database Schema SQL</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>PostgreSQL Schema Management</span>
            </div>
          </div>

          {isProd ? (
            <div style={{ padding: '1rem', background: 'var(--color-bg-elevated)', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Database schema is managed in the Supabase SQL Editor. See <code>supabase_schema.sql</code> in the repository.
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Copy the complete SQL migration file (<code>supabase_schema.sql</code>) containing all normalized tables, foreign keys, and indexes.
              </p>

              <div style={{ background: '#0a0d14', color: '#94a3b8', padding: '0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '1.25rem', overflowX: 'auto' }}>
                <code>
                  -- Run in Supabase SQL Editor<br />
                  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";<br />
                  CREATE TABLE public.domains (...);<br />
                  CREATE TABLE public.projects (...);<br />
                  CREATE TABLE public.events (...);
                </code>
              </div>

              <button 
                onClick={handleCopySchema} 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
              >
                {copied ? <><Check size={16} /> Copied to Clipboard!</> : <><Copy size={16} /> Copy SQL Schema Script</>}
              </button>
            </>
          )}
        </div>

        {/* Platform Reset & Cache (Only shown in DEV) */}
        {!isProd && (
          <div className="aesthetic-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#fef2f2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldAlert size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Reset Demo Local Cache</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Restore Original Records</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Development environment tool: Clears browser mock data and reloads default seed data for local testing.
            </p>

            {resetSuccess && (
              <div style={{ padding: '0.65rem 1rem', background: '#ecfdf5', color: '#059669', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Cache cleared! Reloading original data...
              </div>
            )}

            <button 
              onClick={handleResetSeedData} 
              className="btn btn-secondary" 
              style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#dc2626' }}
            >
              <RefreshCw size={14} /> Re-seed Original Club Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
