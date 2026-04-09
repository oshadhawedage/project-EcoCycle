import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  TrendingUp,
  PieChart as PieIcon,
  Trophy,
  List,
  ArrowRight,
  Download,
} from 'lucide-react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import {
  getCategoryDistribution,
  getLeaderboard,
  getMonthlyTrend,
  getOverview,
} from '../../services/api';

import dashboardBanner from '../../assets/AdminBanner1.png';
import footerBanner from '../../assets/27.png';
import { PageShell, SummaryCard, SectionPanel } from '../../shared/PageShell';

const AnalyticsDashboard = () => {
  const [data, setData] = useState({
    overview: null,
    trend: [],
    categories: [],
    leaderboard: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          getOverview(),
          getMonthlyTrend(),
          getCategoryDistribution(),
          getLeaderboard(),
        ]);

        setData({
          overview: results[0].status === 'fulfilled' ? results[0].value.data : null,
          trend: results[1].status === 'fulfilled' ? results[1].value.data : [],
          categories: results[2].status === 'fulfilled' ? results[2].value.data : [],
          leaderboard: results[3].status === 'fulfilled' ? results[3].value.data : [],
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { overview, trend, categories, leaderboard } = data;

  const formatNum = (num) =>
    Number(num || 0).toLocaleString(undefined, {
      maximumFractionDigits: 1,
    });

  const computed = useMemo(() => {
    if (!overview) {
      return {
        chartTrend: [],
        chartCategories: [],
        top5: [],
        recent: [],
      };
    }

    const chartTrend = (Array.isArray(trend) ? trend : []).slice(-6).map((item) => {
      const parts = item.month ? item.month.split('-') : [];
      const monthName =
        parts.length === 2
          ? new Date(parts[0], parts[1] - 1).toLocaleString('default', {
              month: 'short',
            })
          : item.month || '';

      return {
        name: monthName,
        Weight: Number(item.weightKg) || 0,
      };
    });

    const chartCategories = (Array.isArray(categories) ? categories : [])
      .slice()
      .sort((a, b) => (b.weightKg || 0) - (a.weightKg || 0))
      .slice(0, 5)
      .map((item) => ({
        name: item.category || 'Unknown',
        value: Number(item.weightKg) || 0,
      }));

    const top5 = (Array.isArray(leaderboard) ? leaderboard : []).slice(0, 5);
    const recent = (Array.isArray(overview.recentLogs) ? overview.recentLogs : []).slice(0, 5);

    return {
      chartTrend,
      chartCategories,
      top5,
      recent,
    };
  }, [overview, trend, categories, leaderboard]);

  const progress = Math.min(
    100,
    Math.max(0, ((overview?.thisMonthWeightKg || 0) / (overview?.monthlyTargetKg || 1)) * 100)
  );

  const COLORS = ['#0ea5e9', '#10b981', '#6366f1', '#f59e0b', '#8b5cf6'];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'materials', label: 'Materials', icon: PieIcon },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'activity', label: 'Recent Logs', icon: List },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trends':
        return (
          <SectionPanel
            left={
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Collection Trends</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Analyze the volume of e-waste collected over the last 6 months. Use this data to
                  forecast future collection goals and operational capacity.
                </p>

                <div className="flex gap-6 border-b border-slate-200 mb-8">
                  <button className="pb-2 border-b-2 border-yellow-400 text-slate-900 font-semibold text-sm">
                    6 Months
                  </button>
                  <button className="pb-2 border-b-2 border-transparent text-slate-500 text-sm cursor-not-allowed">
                    1 Year
                  </button>
                </div>

                <button className="bg-[#fcd34d] hover:bg-[#f59e0b] text-slate-900 font-bold px-6 py-3 rounded-full transition-colors flex items-center gap-2 shadow-sm w-max">
                  Export Chart <Download className="w-4 h-4" />
                </button>
              </>
            }
            right={
              <div className="flex items-center justify-center min-h-[400px]">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={computed.chartTrend}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f55a7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0f55a7" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b' }}
                      dy={10}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="Weight"
                      stroke="#0f55a7"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorWeight)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            }
          />
        );

      case 'materials':
        return (
          <SectionPanel
            left={
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Material Breakdown</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Understand the composition of your collected e-waste. This chart highlights the
                  top 5 most frequently recycled categories in your network.
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8">
                  <p className="text-sm text-slate-500 font-medium">Top Category</p>
                  <p className="text-xl font-bold text-[#0f55a7]">
                    {computed.chartCategories[0]?.name || 'N/A'}
                  </p>
                </div>
              </>
            }
            right={
              <div className="flex items-center justify-center min-h-[400px]">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={computed.chartCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {computed.chartCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>

                    <RechartsTooltip
                      formatter={(value) => [`${formatNum(value)} kg`, 'Weight']}
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '14px', color: '#475569' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            }
          />
        );

      case 'leaderboard':
        return (
          <SectionPanel
            left={
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Top Performers</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Recognize the top contributors in the EcoCycle network. These users are leading
                  the charge in diverting weight from landfills.
                </p>

                <button className="bg-[#fcd34d] hover:bg-[#f59e0b] text-slate-900 font-bold px-6 py-3 rounded-full transition-colors flex items-center gap-2 shadow-sm w-max">
                  View Full Report <ArrowRight className="w-4 h-4" />
                </button>
              </>
            }
            right={
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0f55a7]/5 text-[#0f55a7]">
                    <tr>
                      <th className="px-6 py-4 font-bold">Rank</th>
                      <th className="px-6 py-4 font-bold">User</th>
                      <th className="px-6 py-4 font-bold text-right">Diverted (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {computed.top5.map((user, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">#{index + 1}</td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {user.userName || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-[#0f55a7]">
                          {formatNum(user.weightKg)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          />
        );

      case 'activity':
        return (
          <SectionPanel
            left={
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Recent Logs</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  A live feed of the most recent transactions within the system. Monitor activity
                  as it happens in real-time.
                </p>
              </>
            }
            right={
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0f55a7]/5 text-[#0f55a7]">
                    <tr>
                      <th className="px-6 py-4 font-bold">Date</th>
                      <th className="px-6 py-4 font-bold">Material</th>
                      <th className="px-6 py-4 font-bold text-right">Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {computed.recent.map((log, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {log.category || '—'}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                          {formatNum(log.weightKg)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          />
        );

      default:
        return (
          <SectionPanel
            left={
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">System Overview</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  A high-level summary of your network&apos;s impact. Use this dashboard to quickly
                  assess environmental benefits and goal progress.
                </p>

                <div className="flex gap-6 border-b border-slate-200 mb-8">
                  <button className="pb-2 border-b-2 border-yellow-400 text-slate-900 font-semibold text-sm">
                    All Time
                  </button>
                  <button className="pb-2 border-b-2 border-transparent text-slate-500 text-sm cursor-not-allowed">
                    This Year
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <button className="text-slate-600 font-semibold text-sm hover:text-[#0f55a7] transition-colors flex items-center gap-1 group">
                    Detailed Report
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </>
            }
            right={
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <SummaryCard
                  title="Total Diverted"
                  value={
                    <>
                      {formatNum(overview?.totalWeightKg)}
                      <span className="text-lg text-slate-400"> kg</span>
                    </>
                  }
                  tone="text-[#0f55a7]"
                />

                <SummaryCard
                  title="CO₂ Averted"
                  value={
                    <>
                      {formatNum(overview?.totalCo2SavedKg)}
                      <span className="text-lg text-slate-400"> kg</span>
                    </>
                  }
                  tone="text-emerald-600"
                />

                <SummaryCard
                  title="Hazardous Items"
                  value={
                    <>
                      {formatNum(overview?.hazardousCount)}
                      <span className="text-lg text-slate-400"> units</span>
                    </>
                  }
                  tone="text-amber-600"
                />

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                    <span>Monthly Target</span>
                    <span className="text-[#0f55a7]">{formatNum(progress)}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-700 to-emerald-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            }
          />
        );
    }
  };

  return (
    <PageShell
      banner={dashboardBanner}
      bannerAlt="Admin dashboard banner"
      footerBanner={footerBanner}
      footerBannerAlt="Admin dashboard footer banner"
      loading={loading}
    >
      <div className="text-center mb-10">
        <p className="text-[#0f55a7] font-semibold text-sm mb-2 uppercase tracking-widest">
          EcoCycle Admin Portal
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
          What data do you want to view today?
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300 ease-out outline-none ${
                isActive
                  ? 'bg-[#0f55a7] text-white shadow-md scale-105 z-10'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-[#0f55a7] hover:bg-blue-50 hover:-translate-y-1 hover:shadow-lg'
              }`}
            >
              <tab.icon
                className={`w-8 h-8 mb-3 transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-[#0f55a7]'
                }`}
                strokeWidth={1.5}
              />
              <span className="font-semibold text-sm">{tab.label}</span>

              {isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0f55a7] rotate-45 z-0" />
              )}
            </button>
          );
        })}
      </div>

      {renderTabContent()}
    </PageShell>
  );
};

export default AnalyticsDashboard;