import React, { useState, useEffect } from 'react';
import { Filter, Search } from 'lucide-react';
import { getImpactLogs } from '../../services/api';

const ImpactLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await getImpactLogs({ actionType: actionFilter || undefined, category: categoryFilter || undefined });
        setLogs(response.data);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };

    fetchLogs();
  }, [actionFilter, categoryFilter]);

  const getBadgeStyle = (action) => {
    switch(action) {
      case 'RECYCLE': return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/10';
      case 'DONATE': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10';
      case 'SELL': return 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/10';
      default: return 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/10';
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <main className="pb-16 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Query Bar */}
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex items-center text-slate-900 font-semibold text-lg">
              Query Ledger
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-2.5 rounded-xl border-slate-200 bg-white text-sm focus:ring-sky-500" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
                <option value="">All Actions</option><option value="RECYCLE">Recycle</option><option value="DONATE">Donate</option><option value="SELL">Sell</option>
              </select>
              <select className="px-4 py-2.5 rounded-xl border-slate-200 bg-white text-sm focus:ring-sky-500" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="">All Categories</option><option value="Laptop">Laptop</option><option value="Phone">Phone</option><option value="Battery">Battery</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-slate-500 text-xs uppercase tracking-widest font-bold">
                  <th className="py-4 px-6">Timestamp</th><th className="py-4 px-6">Public Citizen</th><th className="py-4 px-6">Action</th><th className="py-4 px-6">Category</th><th className="py-4 px-6 text-right">Weight (kg)</th><th className="py-4 px-6 text-right">CO₂ Averted</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="6" className="p-12 text-center text-slate-400">Loading ledger...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan="6" className="p-16 text-center text-slate-400">No records found matching query.</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-slate-500">{new Date(log.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6 font-semibold text-slate-950">{log.userName}</td>
                      <td className="py-4 px-6"><span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeStyle(log.actionType)}`}>{log.actionType}</span></td>
                      <td className="py-4 px-6 text-slate-700">{log.category}</td>
                      <td className="py-4 px-6 text-right font-medium text-slate-800">{log.weightKg}</td>
                      <td className="py-4 px-6 text-right font-bold text-emerald-600">+{log.co2SavedKg} kg</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImpactLogs;