import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLogin from '../admin/AdminLogin';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, adminProfile, loading, signIn } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#07090e',
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid rgba(56, 189, 248, 0.2)',
          borderTopColor: '#38bdf8',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '1rem'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Verifying security session...</p>
      </div>
    );
  }

  // Not signed in or no valid admin profile
  if (!user || !adminProfile) {
    return <AdminLogin onLoginSuccess={async ({ email, password }) => {
      await signIn(email, password);
    }} />;
  }

  // Role check: super_admin has access to everything
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    adminProfile.role !== 'super_admin' &&
    !allowedRoles.includes(adminProfile.role)
  ) {
    return (
      <div style={{
        padding: '3rem 1.5rem',
        maxWidth: '600px',
        margin: '4rem auto',
        textAlign: 'center',
        background: 'var(--color-bg-surface, #101522)',
        borderRadius: '16px',
        border: '1px solid var(--color-border, rgba(255, 255, 255, 0.08))'
      }}>
        <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
          Access Restricted
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          Your role (<strong>{adminProfile.role}</strong>) does not have authorization to view or manage this administrative section.
        </p>
        <Link
          to="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            background: '#0284c7',
            color: '#ffffff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={16} /> Return to Dashboard
        </Link>
      </div>
    );
  }

  return children ? children : <Outlet />;
}

