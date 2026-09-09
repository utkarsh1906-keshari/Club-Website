import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  RefreshCw, 
  ShieldAlert, 
  ExternalLink, 
  Save,
  Check
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SettingsAdmin() {
  const [copied, setCopied] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const isSupabaseConfigured = !!supabase;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'Not configured';

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
    if (window.confirm('Reset all local data back to the default ABES Drone & Robotics Club state? This clears any demo modifications saved in this browser.')) {
      const keys = ['domains', 'projects', 'events', 'event_registrations', 'members', 'gallery', 'applications', 'announcements'];
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
          Monitor database health, configure Supabase credentials, view SQL migration scripts, and manage platform cache.
        </p>
      </div>

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Connection Mode:</span>
              {isSupabaseConfigured ? (
                <span className="tag-pill" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                  <CheckCircle2 size={12} /> Supabase Live Cloud
                </span>
              ) : (
                <span className="tag-pill" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                  <CheckCircle2 size={12} /> Offline Cache (Active)
                </span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Target Host:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                {supabaseUrl.includes('your-project-id') ? 'Not set in .env' : supabaseUrl}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            The website is engineered with a dual-mode service adapter. It connects to Supabase PostgreSQL when credentials exist in <code>.env</code>, or gracefully stores modifications locally in the browser with zero downtime.
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

        {/* Database Migration Script */}
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
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Ready-to-run PostgreSQL DDL</span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
            Copy the complete SQL migration file (<code>supabase_schema.sql</code>) containing all 8 normalized tables, foreign keys, timestamps, indexes, RLS policies, and seed data.
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
        </div>

        {/* Platform Reset & Cache */}
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
            If you have created test events, test applications, or modified domain cards during demonstration and wish to restore the authentic ABES club data, click below.
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
      </div>
    </div>
  );
}
