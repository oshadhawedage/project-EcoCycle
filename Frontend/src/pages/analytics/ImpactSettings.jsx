import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getSettings, updateSettings } from '../../services/api';

const ImpactSettings = () => {
  const [formData, setFormData] = useState({ co2FactorPerKg: '', monthlyTargetKg: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        setFormData({ co2FactorPerKg: response.data.co2FactorPerKg, monthlyTargetKg: response.data.monthlyTargetKg });
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateSettings({ co2FactorPerKg: Number(formData.co2FactorPerKg), monthlyTargetKg: Number(formData.monthlyTargetKg) });
      setMessage({ type: 'success', text: 'Settings updated. Historical data recalculation initialized.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to save configuration.' });
    }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span
          aria-label="Loading"
          className="inline-block h-10 w-10 rounded-full from-sky-600 to-emerald-500 animate-spin"
          style={{
            backgroundImage: 'conic-gradient(from 90deg, var(--tw-gradient-from), var(--tw-gradient-to), transparent 70%)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-300 mx-auto px-4 py-12 font-sans bg-slate-50 min-h-screen animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <p className="text-sky-700 font-semibold text-sm mb-2 uppercase tracking-widest">EcoCycle Admin Portal</p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Configuration</h2>
        <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Update the calculation factor and the national monthly target used across analytics and progress tracking.</p>
      </div>

      {message && (
        <div className="max-w-3xl mx-auto mb-8">
          <div className={`p-4 rounded-xl flex items-center shadow-inner ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-red-50 text-red-800 ring-1 ring-red-200'
          }`}>
            {message.type === 'success'
              ? <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-600" />
              : <AlertTriangle className="w-5 h-5 mr-3 text-red-600" />}
            <span className="font-semibold">{message.text}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200 flex flex-col md:flex-row relative z-10 min-h-112.5">
        <div className="p-8 md:p-12 md:w-1/3 flex flex-col justify-center bg-white">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Global settings</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            These values affect the dashboard KPIs, goal progress, and CO₂ impact calculations.
            Use stable numbers and update only when policy changes.
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500 font-medium">Admin-only</p>
                <p className="text-sm text-slate-700 font-semibold">Administrative Authorization Required</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">CO₂ Factor</p>
              <p className="text-2xl font-black text-sky-700">
                {formData.co2FactorPerKg || '—'} <span className="text-sm text-slate-400">kg CO₂ / kg</span>
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Monthly Target</p>
              <p className="text-2xl font-black text-emerald-600">
                {formData.monthlyTargetKg || '—'} <span className="text-sm text-slate-400">kg</span>
              </p>
            </div>
          </div>
        </div>

        <div className="md:w-2/3 p-8 bg-slate-50 border-l border-slate-100">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="grid grid-cols-1 gap-6">
              {[
                {
                  id: 'co2FactorPerKg',
                  title: 'CO₂ Equivalency Factor',
                  sub: 'How many kilograms of emissions are averted per 1kg e‑waste?',
                  unit: 'kg CO₂',
                  step: '0.1',
                },
                {
                  id: 'monthlyTargetKg',
                  title: 'National Monthly Goal',
                  sub: 'Sets the dashboard goal progress for the current month.',
                  unit: 'kg',
                  step: '1',
                },
              ].map((field) => (
                <div key={field.id} className="grid md:grid-cols-5 gap-4 items-start">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-900 mb-1">{field.title}</label>
                    <p className="text-sm text-slate-500 leading-relaxed">{field.sub}</p>
                  </div>

                  <div className="md:col-span-3">
                    <div className="relative w-full max-w-md">
                      <input
                        type="number"
                        step={field.step}
                        required
                        name={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        className="w-full pl-4 pr-20 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-900"
                      />
                      <span className="absolute right-4 top-3.5 text-sm font-bold text-slate-400">{field.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-slate-500">Changes apply immediately to analytics calculations.</div>

              <button
                type="submit"
                disabled={saving}
                className="bg-amber-300 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-full transition-colors flex items-center gap-2 shadow-sm w-max disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="inline-block h-4 w-4 rounded-full from-sky-600 to-emerald-500 animate-spin"
                      style={{
                        backgroundImage: 'conic-gradient(from 90deg, var(--tw-gradient-from), var(--tw-gradient-to), transparent 70%)',
                        WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)',
                        mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)',
                      }}
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    Save Configuration <Save className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImpactSettings;