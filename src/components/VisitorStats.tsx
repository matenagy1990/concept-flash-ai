import React from 'react';
import { Eye, Users, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useVisitorAnalytics } from '@/hooks/useVisitorAnalytics';

export const VisitorStats: React.FC = () => {
  const { stats, loading, error } = useVisitorAnalytics();

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-muted h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-sm">Unable to load visitor stats</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare daily chart data
  const dailyChartData = stats.dailyStats.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    visitors: day.visitors
  })).reverse();

  // Prepare hourly chart data (fill missing hours with 0)
  const hourlyChartData = Array.from({ length: 24 }, (_, i) => {
    const hourData = stats.hourlyStats.find(h => h.hour === i);
    return {
      hour: `${i}:00`,
      visitors: hourData?.visitors || 0
    };
  });

  return (
    <div className="w-full space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Visitors</p>
              <p className="text-lg font-bold">{stats.totalVisitors}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Recent</p>
              <div className="flex items-center gap-1">
                <p className="text-lg font-bold">{stats.recentVisitors}</p>
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  Live
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-3 lg:col-span-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">7-Day Trend</p>
              <div className="h-8 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyChartData}>
                    <Line 
                      type="monotone" 
                      dataKey="visitors" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Daily Visitors (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyChartData}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Hourly Pattern (Today)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyChartData}>
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="visitors" 
                  fill="hsl(var(--accent))" 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};