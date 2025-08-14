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

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (req.method === 'POST' && action === 'track') {
      // Track a new visit
      const { sessionId, pagePath, userAgent, referrer } = await req.json();
      
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

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET' && action === 'stats') {
      // Get visitor statistics
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Total visitors (unique sessions)
      const { data: totalData, error: totalError } = await supabase
        .from('page_visits')
        .select('session_id')
        .gte('created_at', sevenDaysAgo.toISOString());

      if (totalError) {
        console.error('Error fetching total stats:', totalError);
        return new Response(JSON.stringify({ error: totalError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const uniqueVisitors = new Set(totalData?.map(v => v.session_id) || []).size;

      // Daily stats for the last 7 days
      const dailyStatsQuery = `
        SELECT 
          DATE(created_at) as date,
          COUNT(DISTINCT session_id) as visitors,
          COUNT(*) as views
        FROM page_visits 
        WHERE created_at >= $1
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `;

      const { data: dailyData, error: dailyError } = await supabase.rpc('execute_sql', {
        query: dailyStatsQuery,
        params: [sevenDaysAgo.toISOString()]
      });

      // Hourly stats for today
      const hourlyStatsQuery = `
        SELECT 
          EXTRACT(HOUR FROM created_at) as hour,
          COUNT(DISTINCT session_id) as visitors,
          COUNT(*) as views
        FROM page_visits 
        WHERE created_at >= $1
        GROUP BY EXTRACT(HOUR FROM created_at)
        ORDER BY hour
      `;

      const { data: hourlyData, error: hourlyError } = await supabase.rpc('execute_sql', {
        query: hourlyStatsQuery,
        params: [today.toISOString()]
      });

      // Recent visitors (last hour)
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const { data: recentData, error: recentError } = await supabase
        .from('page_visits')
        .select('session_id')
        .gte('created_at', oneHourAgo.toISOString());

      const recentVisitors = new Set(recentData?.map(v => v.session_id) || []).size;

      const stats = {
        totalVisitors: uniqueVisitors,
        recentVisitors,
        dailyStats: dailyData || [],
        hourlyStats: hourlyData || []
      };

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