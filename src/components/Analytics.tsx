import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp } from 'lucide-react';

export default function Analytics({ projectId }: { projectId?: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [projectId]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?projectId=${projectId || 'all'}`);
      const result = await response.json();
      const chartData = result.labels.map((label: string, i: number) => ({
        name: label,
        visits: result.visits[i],
        conversions: result.conversions[i]
      }));
      setData(chartData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold">Traffic Overview</h3>
          <p className="text-sm text-white/40">Real-time performance metrics</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-xs font-bold">
          <TrendingUp className="w-3 h-3" />
          +12.5%
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#ffffff40" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#ffffff40" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="visits" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorVisits)" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
