import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

// Configurable timing constants
export const IDLE_MS = 30 * 60 * 1000; // 30 minutes until automatic logout
export const WARNING_MS = 60 * 1000;    // Show warning during the final 60 seconds

export function useIdleLogout() {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(Math.ceil(WARNING_MS / 1000));

  const lastActivityRef = useRef(0);
  const throttleRef = useRef(0);
  const isLoggingOutRef = useRef(false);
  const isWarningVisibleRef = useRef(false);

  // Keep ref in sync with state for zero-rerender activity handlers
  useEffect(() => {
    isWarningVisibleRef.current = showWarning;
  }, [showWarning]);

  const performLogout = useCallback(async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    setShowWarning(false);
    isWarningVisibleRef.current = false;

    // Navigate client-side to login with reason=idle query param and router state
    try {
      navigate('/admin?reason=idle', { replace: true, state: { reason: 'idle' } });
    } catch (err) {
      console.warn('Navigation error during idle logout:', err);
    }

    // Call Supabase auth sign out and clear session state
    try {
      if (signOut) {
        await signOut();
      } else if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Sign out during idle logout error:', err);
    }

    try {
      localStorage.removeItem('drc_admin_session');
      sessionStorage.removeItem('drc_admin_session');
    } catch {
      // Ignore storage access errors
    }
  }, [navigate, signOut]);

  const stayLoggedIn = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    throttleRef.current = now;
    isWarningVisibleRef.current = false;
    setShowWarning(false);
    setRemainingSeconds(Math.ceil(WARNING_MS / 1000));
  }, []);

  useEffect(() => {
    // If no admin is authenticated, do not attach timers or listeners
    if (!isAuthenticated) {
      return;
    }

    // Reset trackers when admin becomes authenticated
    lastActivityRef.current = Date.now();
    throttleRef.current = Date.now();
    isLoggingOutRef.current = false;

    // Throttle user activity: ignore if less than 1 second has passed
    const handleUserActivity = () => {
      const now = Date.now();
      if (now - throttleRef.current < 1000) {
        return;
      }
      throttleRef.current = now;
      lastActivityRef.current = now;

      // If warning is currently visible, user activity immediately resets it
      if (isWarningVisibleRef.current) {
        isWarningVisibleRef.current = false;
        setShowWarning(false);
        setRemainingSeconds(Math.ceil(WARNING_MS / 1000));
      }
    };

    const activityEvents = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'click'
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Check elapsed time immediately on tab visibility change (e.g. laptop wake, tab switch)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const elapsed = now - lastActivityRef.current;
        if (elapsed >= IDLE_MS) {
          performLogout();
        } else if (IDLE_MS - elapsed <= WARNING_MS) {
          const remaining = Math.max(1, Math.ceil((IDLE_MS - elapsed) / 1000));
          setShowWarning(true);
          setRemainingSeconds(remaining);
        } else {
          setShowWarning(false);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Periodic timer checking every second
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;
      const remaining = IDLE_MS - elapsed;

      if (remaining <= 0) {
        performLogout();
      } else if (remaining <= WARNING_MS) {
        setShowWarning(true);
        setRemainingSeconds(Math.max(1, Math.ceil(remaining / 1000)));
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [isAuthenticated, performLogout]);

  return {
    showWarning,
    remainingSeconds,
    stayLoggedIn
  };
}
