import React, { useState, useEffect } from 'react';
import { Recycle, CloudRain, TrendingUp, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getOverview, getMonthlyTrend, getCategoryDistribution, getLeaderboard } from '../../services/api';

const COLORS = ['#10B981', '#0EA5E9', '#F59E0B', '#F43F5E', '#8B5CF6'];

const AnalyticsDashboard = () => {
  const [data, setData] = useState({ overview: null, trend: [], categories: [], leaderboard: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, trendRes, catRes, leadRes] = await Promise.all([
          getOverview(), getMonthlyTrend(), getCategoryDistribution(), getLeaderboard()
        ]);
        setData({ overview: overviewRes.data, trend: trendRes.data, categories: catRes.data, leaderboard: leadRes.data });
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-12 text-slate-500 animate-pulse">Aggregating public data...</div>;

  const { overview, trend, categories, leaderboard } = data;

  return (
    <div className="animate-in fade-in duration-500">
      <main className="pb-16 max-w-7xl mx-auto">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { title: "E-Waste Diverted", val: `${overview?.totalWeightKg || 0} kg`, icon: Recycle, color: "text-sky-500", bg: "bg-sky-50" },
            { title: "CO₂ Averted", val: `${overview?.totalCo2SavedKg || 0} kg`, icon: CloudRain, color: "text-emerald-500", bg: "bg-emerald-50" },
            { title: "Reuse Rate", val: `${overview?.reuseRatePercent?.toFixed(1) || 0}%`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" },
            { title: "Active Contributors", val: leaderboard?.length || 0, icon: Users, color: "text-purple-500", bg: "bg-purple-50" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-slate-950 mt-2 tracking-tight">{stat.val}</h3>
                </div>
                <div className={`p-3.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-950 mb-7">Community Recovery Trend</h2>
            <div className="h-[300px]">
              <ResponsiveContainer>
                <LineChart data={trend} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} style={{fontSize: '12px'}} />
                  <YAxis yAxisId="left" stroke="#94a3b8" axisLine={false} tickLine={false} dx={-10} style={{fontSize: '12px'}} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10B981" axisLine={false} tickLine={false} dx={10} style={{fontSize: '12px'}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  <Line yAxisId="left" type="monotone" dataKey="weightKg" name="E-Waste (kg)" stroke="#0ea5e9" strokeWidth={3} dot={{r: 5}} />
                  <Line yAxisId="right" type="monotone" dataKey="co2SavedKg" name="CO₂ Saved (kg)" stroke="#10b981" strokeWidth={3} dot={{r: 5}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-950 mb-7">Material Breakdown</h2>
            <div className="h-[300px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={categories} dataKey="weightKg" nameKey="category" cx="50%" cy="45%" innerRadius={70} outerRadius={90} paddingAngle={8} stroke="none">
                    {categories.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;