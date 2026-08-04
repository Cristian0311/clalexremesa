import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, Settings, AlertCircle, Building, Calculator, Truck, HelpCircle, Lock, Plus, Trash2, LayoutTemplate, Wallet, Banknote, DollarSign } from 'lucide-react';
import { AppConfig, FAQ, Benefit } from '../types';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState<'general' | 'content' | 'rates' | 'delivery' | 'faqs' | 'security'>('general');
  const navigate = useNavigate();

  useEffect(() => {
    const adminEmails = ['clalexremesa@gmail.com', 'cristianmarco2003@gmail.com'];
    
    const checkAuth = async () => {
      let token = localStorage.getItem('adminToken');
      
      // If we don't have a token, check if we're authenticated via Supabase OAuth
      if (!token && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user.email && adminEmails.includes(session.user.email)) {
          token = session.access_token;
          localStorage.setItem('adminToken', token);
        }
      }

      if (!token) {
        navigate('/admin');
        return;
      }

      fetch('/api/config')
        .then(res => res.json())
        .then(data => {
          setConfig(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('adminToken');
    if (supabase) {
      await supabase.auth.signOut();
    }
    navigate('/admin');
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!config) return;
    
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          configUpdates: config,
          newPassword: newPassword || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Configuración guardada exitosamente.', type: 'success' });
        setNewPassword(''); // Clear password field after save
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: data.message || 'Error al guardar.', type: 'error' });
        if (res.status === 401) {
           handleLogout();
        }
      }
    } catch (err) {
      setMessage({ text: 'Error de conexión.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const addFaq = () => {
    if (!config) return;
    const newFaq: FAQ = { id: Date.now().toString(), q: '', a: '' };
    setConfig({ ...config, faqs: [...config.faqs, newFaq] });
  };

  const updateFaq = (index: number, field: keyof FAQ, value: string) => {
    if (!config) return;
    const updatedFaqs = [...config.faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setConfig({ ...config, faqs: updatedFaqs });
  };

  const removeFaq = (index: number) => {
    if (!config) return;
    const updatedFaqs = [...config.faqs];
    updatedFaqs.splice(index, 1);
    setConfig({ ...config, faqs: updatedFaqs });
  };

  const addBenefit = () => {
    if (!config) return;
    const newBenefit: Benefit = { id: Date.now().toString(), title: '', description: '' };
    setConfig({ ...config, benefits: [...config.benefits, newBenefit] });
  };

  const updateBenefit = (index: number, field: keyof Benefit, value: string) => {
    if (!config) return;
    const updatedBenefits = [...config.benefits];
    updatedBenefits[index] = { ...updatedBenefits[index], [field]: value };
    setConfig({ ...config, benefits: updatedBenefits });
  };

  const removeBenefit = (index: number) => {
    if (!config) return;
    const updatedBenefits = [...config.benefits];
    updatedBenefits.splice(index, 1);
    setConfig({ ...config, benefits: updatedBenefits });
  };

  if (isLoading || !config) {
    return <div className="p-12 text-center text-slate-500 animate-pulse">Cargando panel...</div>;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutTemplate size={18} /> },
    { id: 'general', label: 'Configuración General', icon: <Building size={18} /> },
    { id: 'rates', label: 'Tasas de Cambio', icon: <Calculator size={18} /> },
    { id: 'delivery', label: 'Métodos de Entrega', icon: <Truck size={18} /> },
    { id: 'faqs', label: 'Preguntas Frecuentes', icon: <HelpCircle size={18} /> },
    { id: 'promos', label: 'Promociones', icon: <Plus size={18} /> },
    { id: 'appearance', label: 'Apariencia (Hero)', icon: <Settings size={18} /> },
    { id: 'security', label: 'Seguridad', icon: <Lock size={18} /> },
  ] as const;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-16 lg:w-72 bg-slate-950 text-white flex-shrink-0 fixed top-0 left-0 h-screen z-40 border-r border-slate-800 transition-all duration-300">
        <div className="flex flex-col h-full p-3 lg:p-6">
          <div className="flex items-center gap-3 mb-8 px-1 lg:px-2">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-xl text-slate-950 shadow-lg shadow-amber-500/20">
              C
            </div>
            <div className="hidden lg:block overflow-hidden">
              <h1 className="font-black text-lg leading-tight tracking-tight uppercase tracking-widest truncate">CLALEX</h1>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] opacity-80 truncate">Admin Panel</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar -mx-1 lg:-mx-2 px-1 lg:px-2">
            <div>
              <p className="hidden lg:block px-3 mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Gestión</p>
              <nav className="space-y-1">
                {tabs.filter(t => ['dashboard', 'rates', 'delivery'].includes(t.id)).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 rounded-2xl text-sm font-bold transition-all duration-300 group ${
                      activeTab === tab.id 
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 lg:translate-x-1' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={tab.label}
                  >
                    <span className={`${activeTab === tab.id ? 'text-slate-950' : 'text-slate-500 group-hover:text-amber-500'} transition-colors flex-shrink-0`}>
                      {tab.icon}
                    </span>
                    <span className="hidden lg:block truncate">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <p className="hidden lg:block px-3 mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Configuración</p>
              <nav className="space-y-1">
                {tabs.filter(t => ['general', 'appearance', 'faqs', 'promos'].includes(t.id)).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 rounded-2xl text-sm font-bold transition-all duration-300 group ${
                      activeTab === tab.id 
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 lg:translate-x-1' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={tab.label}
                  >
                    <span className={`${activeTab === tab.id ? 'text-slate-950' : 'text-slate-500 group-hover:text-amber-500'} transition-colors flex-shrink-0`}>
                      {tab.icon}
                    </span>
                    <span className="hidden lg:block truncate">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <p className="hidden lg:block px-3 mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Sistema</p>
              <nav className="space-y-1">
                {tabs.filter(t => ['security'].includes(t.id)).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 rounded-2xl text-sm font-bold transition-all duration-300 group ${
                      activeTab === tab.id 
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 lg:translate-x-1' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={tab.label}
                  >
                    <span className={`${activeTab === tab.id ? 'text-slate-950' : 'text-slate-500 group-hover:text-amber-500'} transition-colors flex-shrink-0`}>
                      {tab.icon}
                    </span>
                    <span className="hidden lg:block truncate">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 rounded-2xl text-sm font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
              title="Cerrar Sesión"
            >
              <LogOut size={18} className="group-hover:rotate-12 transition-transform flex-shrink-0" />
              <span className="hidden lg:block">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-16 lg:ml-72 transition-all duration-300 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
            </div>
          </div>
          
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="bg-slate-950 hover:bg-slate-900 text-amber-500 font-black py-2 px-4 lg:px-6 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 border border-amber-500/20 text-xs uppercase tracking-wider"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
            ) : (
              <Save size={14} />
            )}
            {isSaving ? 'Guardando' : 'Guardar'}
          </button>
        </header>

        <div className="p-4 lg:p-6 pb-24 flex-1">
          <div className="max-w-5xl mx-auto">

          {message.text && (
            <div className={`p-3 rounded-xl mb-6 flex items-center gap-3 border animate-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              <AlertCircle size={18} className={message.type === 'success' ? 'text-emerald-500' : 'text-red-500'} />
              <p className="font-bold text-xs">{message.text}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 lg:p-6">
            
            {/* Dashboard / Overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Tasa CUP</p>
                    <p className="text-xl font-black text-slate-900">{config.rates.transferCUP} <span className="text-xs font-bold opacity-50">PEN</span></p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">WhatsApp</p>
                    <p className="text-sm font-black text-slate-900 truncate">{config.whatsapp}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Activos</p>
                    <p className="text-xl font-black text-slate-900">
                      {Object.values(config.deliveryMethods).filter(Boolean).length}
                    </p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 mb-3">Estado del Sistema</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="font-bold text-xs text-slate-700">Banner Promocional</span>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${config.promoBannerActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {config.promoBannerActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General Tab */}
            {(activeTab === 'general' || activeTab === ('Empresa' as any)) && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nombre de la Marca</label>
                    <input
                      type="text"
                      value={config.companyName}
                      onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all text-sm font-bold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Descripción (Footer)</label>
                    <textarea
                      rows={2}
                      value={config.description}
                      onChange={(e) => setConfig({ ...config, description: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all text-xs leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Teléfono WhatsApp</label>
                    <input
                      type="text"
                      value={config.whatsapp}
                      onChange={(e) => setConfig({ ...config, whatsapp: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Email de Soporte</label>
                    <input
                      type="email"
                      value={config.email}
                      onChange={(e) => setConfig({ ...config, email: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Facebook URL</label>
                    <input
                      type="text"
                      value={config.socials.facebook}
                      onChange={(e) => setConfig({ ...config, socials: { ...config.socials, facebook: e.target.value } })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all text-sm font-bold"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Instagram URL</label>
                    <input
                      type="text"
                      value={config.socials.instagram}
                      onChange={(e) => setConfig({ ...config, socials: { ...config.socials, instagram: e.target.value } })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all text-sm font-bold"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Rates Tab */}
            {activeTab === 'rates' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Compact Rate Cards */}
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Transferencia Bancaria (CUP)', key: 'transferCUP' as const, color: 'blue' },
                    { label: 'Efectivo en Cuba (CUP)', key: 'cashCUP' as const, color: 'emerald' },
                    { label: 'Tasa base 1 SOL a USD', key: 'penToUsd' as const, color: 'amber' }
                  ].map((rate) => (
                    <div key={rate.key} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{rate.label}</p>
                        <p className="text-[10px] font-medium text-slate-400">Por 1 PEN</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-400">1 PEN =</span>
                        <input
                          type="number"
                          step="0.01"
                          value={config.rates[rate.key] ?? 0}
                          onChange={(e) => setConfig({ ...config, rates: { ...config.rates, [rate.key]: Number(e.target.value) } })}
                          className="w-20 text-lg font-black text-slate-900 outline-none bg-transparent"
                        />
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                          rate.color === 'blue' ? 'bg-blue-100 text-blue-700' : 
                          rate.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {rate.key.includes('Usd') || rate.key.includes('USD') ? 'USD' : 'CUP'}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comisión Efectivo USD (%)</p>
                      <p className="text-[10px] font-medium text-slate-400">Se resta al monto en USD enviado por efectivo</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                      <span className="text-xs font-bold text-slate-400">Comisión =</span>
                      <input
                        type="number"
                        step="0.1"
                        value={config.rates.usdCashFee ?? 5}
                        onChange={(e) => setConfig({ ...config, rates: { ...config.rates, usdCashFee: Number(e.target.value) } })}
                        className="w-20 text-lg font-black text-slate-900 outline-none bg-transparent"
                      />
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase bg-red-100 text-red-700">
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Methods Tab */}
            {activeTab === 'delivery' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { key: 'transferCUP' as const, label: 'Transferencia CUP', icon: <Wallet size={16} /> },
                    { key: 'cashCUP' as const, label: 'Efectivo CUP', icon: <Banknote size={16} /> },
                    { key: 'cashUSD' as const, label: 'Efectivo USD', icon: <DollarSign size={16} /> }
                  ].map((method) => (
                    <label key={method.key} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-amber-600 transition-colors border border-slate-100">
                          {method.icon}
                        </div>
                        <div>
                          <span className="block font-bold text-sm text-slate-900">{method.label}</span>
                          <span className="text-[10px] text-slate-500 font-medium">Calculadora</span>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.deliveryMethods[method.key]}
                          onChange={(e) => setConfig({ ...config, deliveryMethods: { ...config.deliveryMethods, [method.key]: e.target.checked } })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-amber-500 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Preguntas</h3>
                  <button
                    onClick={addFaq}
                    className="flex items-center gap-2 bg-amber-500 text-slate-950 px-4 py-2 rounded-lg hover:bg-amber-400 font-black text-xs transition-all uppercase tracking-wider"
                  >
                    <Plus size={14} /> Nueva
                  </button>
                </div>
                
                <div className="space-y-3">
                  {config.faqs.map((faq, index) => (
                    <div key={faq.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl relative group">
                      <button
                        onClick={() => removeFaq(index)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="space-y-3 pr-8">
                        <div>
                          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pregunta</label>
                          <input
                            type="text"
                            value={faq.q}
                            onChange={(e) => updateFaq(index, 'q', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Respuesta</label>
                          <textarea
                            rows={2}
                            value={faq.a}
                            onChange={(e) => updateFaq(index, 'a', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Promociones Tab */}
            {activeTab === 'promos' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-amber-500 rounded-xl p-4 text-slate-950 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-sm font-black mb-1 uppercase tracking-wider">Banner Superior</h3>
                    <p className="text-slate-900/60 text-[10px] mb-4 font-bold">Aparecerá en la parte superior de la web.</p>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.promoBannerActive}
                          onChange={(e) => setConfig({ ...config, promoBannerActive: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-950/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-slate-950 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                      </div>
                      <span className="font-black text-[9px] uppercase tracking-widest">{config.promoBannerActive ? 'ACTIVADO' : 'DESACTIVADO'}</span>
                    </div>

                    <textarea
                      rows={2}
                      value={config.promoBannerText}
                      onChange={(e) => setConfig({ ...config, promoBannerText: e.target.value })}
                      className="w-full px-4 py-2 bg-white/20 border border-white/20 rounded-lg outline-none transition-all text-slate-950 font-bold text-xs placeholder:text-slate-950/40"
                      placeholder="Mensaje promocional..."
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Más Promociones (Texto)</label>
                  <textarea
                    rows={3}
                    value={config.promotions}
                    onChange={(e) => setConfig({ ...config, promotions: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none text-xs leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b pb-2">Sección Bienvenida</h3>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Título</label>
                    <input
                      type="text"
                      value={config.heroText.title}
                      onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, title: e.target.value } })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Subtítulo</label>
                    <textarea
                      rows={2}
                      value={config.heroText.subtitle}
                      onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, subtitle: e.target.value } })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b pb-2">Horarios</h3>
                  <textarea
                    rows={2}
                    value={config.schedules}
                    onChange={(e) => setConfig({ ...config, schedules: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs"
                  />
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                      <Lock size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Seguridad</h3>
                    </div>
                  </div>
                  
                  <div className="max-w-xs">
                    <label className="block text-[9px] font-black text-red-800/50 uppercase tracking-widest mb-1">Nueva Contraseña</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-red-100 rounded-lg outline-none text-xs font-bold text-red-900"
                      placeholder="Sin cambios"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
    </div>
  );
}
