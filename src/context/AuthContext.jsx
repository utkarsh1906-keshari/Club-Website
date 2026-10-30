import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch verified active admin profile directly from database
  const fetchAdminProfile = async (authUserId) => {
    if (!supabase || !authUserId) return null;
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, auth_user_id, name, email, role, domain_scope, is_active')
        .eq('auth_user_id', authUserId)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        return null;
      }
      return data;
    } catch (err) {
      console.error('Failed to fetch admin profile:', err);
      return null;
    }
  };

  // Restore authenticated session on mount and listen to auth state changes
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      // Clean up any legacy passkey tokens from localStorage/sessionStorage
      try {
        localStorage.removeItem('drc_admin_session');
        sessionStorage.removeItem('drc_admin_session');
      } catch (e) {
        // Ignore storage access errors
      }

      if (!supabase) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const profile = await fetchAdminProfile(session.user.id);
          if (profile && mounted) {
            setUser(session.user);
            setAdminProfile(profile);
          } else if (mounted) {
            // User exists in auth but has no active admin_users record -> terminate session
            await supabase.auth.signOut();
            setUser(null);
            setAdminProfile(null);
          }
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();

    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setAdminProfile(null);
        setLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          const profile = await fetchAdminProfile(session.user.id);
          if (profile && mounted) {
            setUser(session.user);
            setAdminProfile(profile);
          } else if (mounted) {
            await supabase.auth.signOut();
            setUser(null);
            setAdminProfile(null);
          }
        }
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    if (!supabase) {
      throw new Error('Supabase client is not configured. Please check environment variables.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });

    if (error || !data?.user) {
      // Generic error message for security
      throw new Error('Wrong email or password');
    }

    // Verify authorized active admin record exists in public.admin_users
    const profile = await fetchAdminProfile(data.user.id);
    if (!profile) {
      await supabase.auth.signOut();
      throw new Error('You are not an admin');
    }

    setUser(data.user);
    setAdminProfile(profile);
    return { user: data.user, profile };
  };

  const signOut = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('SignOut warning:', err);
    } finally {
      setUser(null);
      setAdminProfile(null);
      try {
        localStorage.removeItem('drc_admin_session');
        sessionStorage.removeItem('drc_admin_session');
      } catch (e) {
        // Ignore storage access errors
      }
    }
  };

  const value = {
    user,
    adminProfile,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user && !!adminProfile,
    role: adminProfile?.role || null
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
