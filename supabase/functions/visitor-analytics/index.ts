import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      // Track a new visit
      const { sessionId, pagePath, userAgent, referrer } = await req.json();
      
      console.log('Tracking visit for session:', sessionId);
      
      const { error } = await supabase
        .from('page_visits')
        .insert({
          session_id: sessionId,
          page_path: pagePath || '/',
          user_agent: userAgent,
          referrer: referrer
        });

      if (error) {
        console.error('Error tracking visit:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Successfully tracked visit');
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET') {
      // Get visitor statistics
      console.log('Fetching visitor statistics');
      
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      // Get all visits from the last 7 days
      const { data: allVisits, error: visitsError } = await supabase
        .from('page_visits')
        .select('session_id, created_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (visitsError) {
        console.error('Error fetching visits:', visitsError);
        return new Response(JSON.stringify({ error: visitsError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Found visits:', allVisits?.length || 0);

      // Calculate unique visitors
      const uniqueVisitors = new Set(allVisits?.map(v => v.session_id) || []).size;
      
      // Calculate recent visitors (last hour)
      const recentVisits = allVisits?.filter(visit => 
        new Date(visit.created_at) >= oneHourAgo
      ) || [];
      const recentVisitors = new Set(recentVisits.map(v => v.session_id)).size;

      // Group by day for daily stats
      const dailyGroups: { [key: string]: Set<string> } = {};
      allVisits?.forEach(visit => {
        const date = new Date(visit.created_at).toISOString().split('T')[0];
        if (!dailyGroups[date]) {
          dailyGroups[date] = new Set();
        }
        dailyGroups[date].add(visit.session_id);
      });

      const dailyStats = Object.entries(dailyGroups)
        .map(([date, sessionIds]) => ({
          date,
          visitors: sessionIds.size
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Group by hour for today's hourly stats
      const today = new Date().toISOString().split('T')[0];
      const todayVisits = allVisits?.filter(visit => 
        visit.created_at.startsWith(today)
      ) || [];
      
      const hourlyGroups: { [key: number]: Set<string> } = {};
      todayVisits.forEach(visit => {
        const hour = new Date(visit.created_at).getHours();
        if (!hourlyGroups[hour]) {
          hourlyGroups[hour] = new Set();
        }
        hourlyGroups[hour].add(visit.session_id);
      });

      const hourlyStats = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        visitors: hourlyGroups[hour]?.size || 0
      }));

      const stats = {
        totalVisitors: uniqueVisitors,
        recentVisitors,
        dailyStats,
        hourlyStats
      };

      console.log('Returning stats:', stats);
      return new Response(JSON.stringify(stats), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Error in visitor-analytics function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});