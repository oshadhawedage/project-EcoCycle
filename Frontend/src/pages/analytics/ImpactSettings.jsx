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

  if (loading) return <div className="text-center p-12 text-slate-500 animate-pulse">Accessing configuration...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <main className="pb-16 max-w-4xl mx-auto">
        {message && (
          <div className={`mb-8 p-4 rounded-xl flex items-center shadow-inner ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-red-50 text-red-800 ring-1 ring-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 mr-3 text-red-600" />}
            <span className="font-semibold">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          {[
            { id: "co2FactorPerKg", title: "CO₂ Equivalency Factor", sub: "How many kilograms of emissions are averted per 1kg e-waste?", unit: "kg CO₂", step: "0.1" },
            { id: "monthlyTargetKg", title: "National Monthly Goal", sub: "Set the divert target to active dashboard progress bars.", unit: "kg", step: "1" }
          ].map(field => (
            <div key={field.id} className="grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-slate-950 uppercase tracking-widest mb-1.5">{field.title}</label>
                <p className="text-sm text-slate-500">{field.sub}</p>
              </div>
              <div className="md:col-span-2">
                <div className="relative w-full max-w-sm">
                  <input type="number" step={field.step} required name={field.id} value={formData[field.id]} onChange={handleChange}
                    className="w-full pl-5 pr-20 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                  <span className="absolute right-5 top-3.5 text-sm font-bold text-slate-400">{field.unit}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center text-sm text-slate-500"><ShieldCheck className="w-5 h-5 mr-2 text-slate-400" /> Administrative Authorization Required</div>
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center px-6 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-xl font-semibold shadow-sm disabled:opacity-70">
              {saving ? <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Global Configuration</>}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ImpactSettings;