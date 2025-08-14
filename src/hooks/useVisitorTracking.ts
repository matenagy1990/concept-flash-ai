import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitorTracking = () => {
  // Generate a session ID for this visitor
  const getSessionId = () => {
    let sessionId = localStorage.getItem('visitor_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('visitor_session_id', sessionId);
    }
    return sessionId;
  };

  // Track a visit silently
  const trackVisit = async () => {
    try {
      const sessionId = getSessionId();
      await supabase.functions.invoke('visitor-analytics', {
        body: {
          sessionId,
          pagePath: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer
        }
      });
    } catch (err) {
      // Silently handle errors - don't show to user
      console.error('Visitor tracking error:', err);
    }
  };

  useEffect(() => {
    // Track this visit on component mount
    trackVisit();
  }, []);
};