import React, { useEffect, useMemo, useState } from 'react';
import {
  Database,
  Recycle,
  HeartHandshake,
  BadgeDollarSign,
  Scale,
  Leaf,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { getImpactLogs } from '../../services/api';

import recordBanner from '../../assets/RecordBanner.png';


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
        console.error(error);
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

  const summaryCards = [
    {
      id: 'records',
      eyebrow: 'Total Records',
      value: formatNum(stats.totalLogs),
      note: 'Matched entries in current result set',
      icon: Database,
      iconWrap: 'bg-sky-50 text-sky-700',
    },
    {
      id: 'weight',
      eyebrow: 'Total Weight',
      value: `${formatNum(stats.totalWeight)} kg`,
      note: 'Total processed material weight',
      icon: Scale,
      iconWrap: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'co2',
      eyebrow: 'CO₂ Averted',
      value: `${formatNum(stats.totalCo2)} kg`,
      note: 'Estimated environmental savings',
      icon: Leaf,
      iconWrap: 'bg-teal-50 text-teal-700',
    },
    {
      id: 'recycle',
      eyebrow: 'Recycle Actions',
      value: formatNum(stats.recycleCount),
      note: 'Entries marked as recycle actions',
      icon: Recycle,
      iconWrap: 'bg-violet-50 text-violet-700',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] animate-in fade-in duration-500">
        <div className="w-full">
          <img
            src={recordBanner}
            alt="Impact records banner"
            className="block w-full h-auto"
          />
        </div>

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex justify-center items-center min-h-[60vh]">
            <span
              aria-label="Loading"
              className="inline-block h-10 w-10 rounded-full from-sky-600 to-emerald-500 animate-spin"
              style={{
                backgroundImage:
                  'conic-gradient(from 90deg, var(--tw-gradient-from), var(--tw-gradient-to), transparent 70%)',
                WebkitMask:
                  'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
                mask:
                  'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
              }}
            />
          </div>
        </div>

      
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] animate-in fade-in duration-500">
      <div className="w-full">
        <img
          src={recordBanner}
          alt="Impact records banner"
          className="block w-full h-auto"
        />
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <section className="mb-10">
          <div className="rounded-xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)] overflow-hidden">
            <div className="grid lg:grid-cols-[1.4fr_0.9fr]">
              <div className="px-7 py-8 md:px-10 md:py-10">
                <div className="inline-flex items-center rounded-full bg-sky-50 text-sky-700 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em]">
                  EcoCycle Admin Portal
                </div>

                <h1 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
                  Impact Logs
                </h1>

                <p className="mt-4 max-w-2xl text-slate-600 leading-8">
                  Review platform-wide impact records with a cleaner operational view of
                  community activity, material movement, and environmental outcomes.
                  Filter entries instantly and monitor sustainability performance with clarity.
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

              <div className="border-t lg:border-t-0 lg:border-l border-slate-100 bg-gradient-to-br from-slate-50 to-white px-7 py-8 md:px-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Current Snapshot
                </p>

                <div className="mt-5 space-y-4">
                  <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Current Records</span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-950">
                      {formatNum(stats.totalLogs)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Total Weight</span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-950">
                      {formatNum(stats.totalWeight)} kg
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">CO₂ Averted</span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-emerald-600">
                      {formatNum(stats.totalCo2)} kg
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.id}
                  className="rounded-xl border border-slate-200/80 bg-white px-6 py-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        {card.eyebrow}
                      </p>
                      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                        {card.value}
                      </p>
                    </div>

                    <div
                      className={`h-11 w-11 rounded-lg flex items-center justify-center ${card.iconWrap}`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {card.note}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="rounded-xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)] overflow-hidden">
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
                  <select
                    className="min-w-[190px] rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                  >
                    <option value="">All Actions</option>
                    <option value="RECYCLE">Recycle</option>
                    <option value="DONATE">Donate</option>
                    <option value="SELL">Sell</option>
                  </select>

                  <select
                    className="min-w-[190px] rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
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
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
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
        </section>
      </div>

  
    </div>
  );
};

export default ImpactLogs;