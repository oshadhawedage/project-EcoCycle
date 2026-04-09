import React, { useEffect, useMemo, useState } from 'react';
import {
  Database,
  Recycle,
  HeartHandshake,
  BadgeDollarSign,
  Scale,
  Leaf,
  FileText,
  Filter,
} from 'lucide-react';
import { getImpactLogs } from '../../services/api';

import recordBanner from '../../assets/RecordBanner.png';
import { PageShell, SummaryCard } from '../../shared/PageShell';

const ImpactLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await getImpactLogs({
          actionType: actionFilter || undefined,
          category: categoryFilter || undefined,
        });
        setLogs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to load impact logs:', error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [actionFilter, categoryFilter]);

  const formatNum = (value) =>
    Number(value || 0).toLocaleString(undefined, {
      maximumFractionDigits: 1,
    });

  const stats = useMemo(() => {
    const totalLogs = logs.length;
    const totalWeight = logs.reduce((sum, item) => sum + (Number(item.weightKg) || 0), 0);
    const totalCo2 = logs.reduce((sum, item) => sum + (Number(item.co2SavedKg) || 0), 0);
    const recycleCount = logs.filter((item) => item.actionType === 'RECYCLE').length;

    return {
      totalLogs,
      totalWeight,
      totalCo2,
      recycleCount,
    };
  }, [logs]);

  const getBadgeStyle = (action) => {
    switch (action) {
      case 'RECYCLE':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
      case 'DONATE':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
      case 'SELL':
        return 'bg-violet-50 text-violet-700 ring-1 ring-violet-200';
      default:
        return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'RECYCLE':
        return <Recycle className="w-4 h-4" />;
      case 'DONATE':
        return <HeartHandshake className="w-4 h-4" />;
      case 'SELL':
        return <BadgeDollarSign className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <PageShell
      banner={recordBanner}
      bannerAlt="Impact records banner"
      loading={loading}
    >
      <div className="text-center mb-10">
        <p className="text-[#0f55a7] font-semibold text-sm mb-2 uppercase tracking-widest">
          EcoCycle Admin Portal
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Impact Logs</h2>
        <p className="mt-3 text-slate-600 max-w-3xl mx-auto">
          Review platform-wide impact records with a clean operational view of material movement,
          action types, and environmental savings.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden mb-8">
        <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
          <div className="p-8 md:p-10">
            <div className="inline-flex items-center rounded-full bg-sky-50 text-sky-700 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em]">
              Operations Overview
            </div>

            <h3 className="mt-5 text-3xl font-bold text-slate-950">
              Track every impact entry with clarity
            </h3>

            <p className="mt-4 text-slate-600 leading-8 max-w-2xl">
              Filter impact activities, monitor environmental savings, and review material flows
              across the system in one clean administrative space.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                Action:
                <span className="ml-2 font-semibold text-slate-900">
                  {actionFilter || 'All'}
                </span>
              </div>

              <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                Category:
                <span className="ml-2 font-semibold text-slate-900">
                  {categoryFilter || 'All'}
                </span>
              </div>

              <div className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
                {logs.length} result{logs.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div className="border-t lg:border-t-0 lg:border-l border-slate-100 bg-slate-50 p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Current Snapshot
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Current Records</span>
                  <Database className="w-4 h-4 text-slate-300" />
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {formatNum(stats.totalLogs)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Total Weight</span>
                  <Scale className="w-4 h-4 text-slate-300" />
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {formatNum(stats.totalWeight)} kg
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">CO₂ Averted</span>
                  <Leaf className="w-4 h-4 text-slate-300" />
                </div>
                <p className="mt-2 text-2xl font-bold text-emerald-600">
                  {formatNum(stats.totalCo2)} kg
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <SummaryCard
          title="Total Records"
          value={formatNum(stats.totalLogs)}
          subtitle="Matched entries in current result set"
          tone="text-sky-700"
        />
        <SummaryCard
          title="Total Weight"
          value={`${formatNum(stats.totalWeight)} kg`}
          subtitle="Processed material weight"
          tone="text-emerald-600"
        />
        <SummaryCard
          title="CO₂ Averted"
          value={`${formatNum(stats.totalCo2)} kg`}
          subtitle="Estimated environmental savings"
          tone="text-teal-700"
        />
        <SummaryCard
          title="Recycle Actions"
          value={formatNum(stats.recycleCount)}
          subtitle="Entries marked as recycle"
          tone="text-violet-600"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5 md:px-8 md:py-6 bg-white">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Records Explorer
              </p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">
                Operational Ledger
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Filter impact activities by action type and category.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <select
                  className="min-w-[190px] rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                >
                  <option value="">All Actions</option>
                  <option value="RECYCLE">Recycle</option>
                  <option value="DONATE">Donate</option>
                  <option value="SELL">Sell</option>
                </select>
              </div>

              <select
                className="min-w-[190px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Laptop">Laptop</option>
                <option value="Phone">Phone</option>
                <option value="Battery">Battery</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Timestamp
                </th>
                <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Public Citizen
                </th>
                <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Action
                </th>
                <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Category
                </th>
                <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 text-right">
                  Weight
                </th>
                <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 text-right">
                  CO₂ Averted
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="mx-auto max-w-md">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <FileText className="w-7 h-7" />
                      </div>
                      <h4 className="mt-5 text-lg font-bold text-slate-900">
                        No records found
                      </h4>
                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        There are no impact logs matching the current filter selection.
                        Adjust the filters to broaden the result set.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log._id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-8 py-5 text-sm text-slate-500">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-8 py-5">
                      <div className="font-semibold text-slate-950">
                        {log.userName}
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${getBadgeStyle(
                          log.actionType
                        )}`}
                      >
                        {getActionIcon(log.actionType)}
                        {log.actionType}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-sm text-slate-700">
                      {log.category}
                    </td>

                    <td className="px-8 py-5 text-right text-sm font-semibold text-slate-900">
                      {formatNum(log.weightKg)} kg
                    </td>

                    <td className="px-8 py-5 text-right text-sm font-bold text-emerald-600">
                      +{formatNum(log.co2SavedKg)} kg
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
};

export default ImpactLogs;