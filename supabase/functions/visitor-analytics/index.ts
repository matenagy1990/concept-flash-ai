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
      // Simple stats endpoint for potential admin use
      console.log('Fetching visitor statistics');
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: allVisits, error: visitsError } = await supabase
        .from('page_visits')
        .select('session_id, created_at')
        .gte('created_at', sevenDaysAgo.toISOString());

      if (visitsError) {
        console.error('Error fetching visits:', visitsError);
        return new Response(JSON.stringify({ error: visitsError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const uniqueVisitors = new Set(allVisits?.map(v => v.session_id) || []).size;
      const totalVisits = allVisits?.length || 0;

      const stats = {
        totalVisitors: uniqueVisitors,
        totalVisits: totalVisits,
        period: '7 days'
      };

      console.log('Returning basic stats:', stats);
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