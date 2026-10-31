import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export const IDLE_MS = 30 * 60 * 1000; // 30 minutes
export const WARNING_MS = 60 * 1000;    // 60 seconds warning

export function useIdleLogout() {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(60);

  const lastActivityRef = useRef(Date.now());
  const throttleRef = useRef(0);
  const isLoggingOutRef = useRef(false);

  const performLogout = useCallback(async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Sign out during idle logout error:', err);
    }

    try {
      localStorage.removeItem('drc_admin_session');
      sessionStorage.removeItem('drc_admin_session');
    } catch {}

    window.location.href = '/admin?reason=idle';
  }, []);

  const stayLoggedIn = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    setRemainingSeconds(60);
  }, []);

  useEffect(() => {
    // Record user interaction, throttled to at most once per second
    const handleUserActivity = () => {
      const now = Date.now();
      if (now - throttleRef.current > 1000) {
        throttleRef.current = now;
        lastActivityRef.current = now;
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

    // Check elapsed time immediately when tab becomes visible (laptop wake, switching tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const elapsed = now - lastActivityRef.current;
        if (elapsed >= IDLE_MS) {
          performLogout();
        } else if (IDLE_MS - elapsed <= WARNING_MS) {
          setShowWarning(true);
          setRemainingSeconds(Math.max(1, Math.ceil((IDLE_MS - elapsed) / 1000)));
        } else {
          setShowWarning(false);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Interval checker running every second
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
  }, [performLogout]);

  return {
    showWarning,
    remainingSeconds,
    stayLoggedIn
  };
}
