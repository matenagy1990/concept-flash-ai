import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VisitorStats {
  totalVisitors: number;
  recentVisitors: number;
  dailyStats: Array<{
    date: string;
    visitors: number;
    views: number;
  }>;
  hourlyStats: Array<{
    hour: number;
    visitors: number;
    views: number;
  }>;
}

export const useVisitorAnalytics = () => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch visitor statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('visitor-analytics');

      if (error) {
        setError(error.message);
        return;
      }

      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Track this visit
    trackVisit();
    
    // Fetch initial stats
    fetchStats();

    // Set up interval to refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};