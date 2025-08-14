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

  // Track a visit
  const trackVisit = async () => {
    try {
      const sessionId = getSessionId();
      const { error } = await supabase.functions.invoke('visitor-analytics', {
        body: {
          sessionId,
          pagePath: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer
        }
      });

      if (error) {
        console.error('Error tracking visit:', error);
      }
    } catch (err) {
      console.error('Error tracking visit:', err);
    }
  };

  useEffect(() => {
    // Track this visit when component mounts
    trackVisit();
  }, []);

  return { trackVisit };
};