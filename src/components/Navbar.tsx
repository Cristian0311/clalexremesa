import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { AppConfig } from '../types';
import logoUrl from '../assets/images/clalex_logo_dark_1785381983172.jpg';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
      })
      .catch(console.error);

    // Check if user is an admin via Supabase
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user && session.user.email === 'clalexremesa@gmail.com') {
           setIsAdmin(true);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user && session.user.email === 'clalexremesa@gmail.com') {
           setIsAdmin(true);
        } else {
           setIsAdmin(false);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  // Also fallback to checking local storage for the static token if Supabase isn't configured
  useEffect(() => {
    if (!supabase) {
      const token = localStorage.getItem('adminToken');
      if (token) setIsAdmin(true);
    }
  }, []);

  const navLinks = [
    { name: 'Cómo funciona', href: '/#how-it-works' },
    { name: 'Beneficios', href: '/#benefits' },
    { name: 'Entrega', href: '/#delivery' },
    { name: 'FAQ', href: '/#faq' },
  ];

  const handleWhatsApp = () => {
    if (config?.whatsapp) {
      window.open(`https://wa.me/${config.whatsapp}`, '_blank');
    }
  };

  return (
    <>
      {config?.promoBannerActive && config.promoBannerText && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-4 py-2.5 text-center text-xs sm:text-sm font-black tracking-wide flex items-center justify-center gap-3 shadow-md border-b border-amber-400">
          <Sparkles size={18} className="text-amber-900 animate-bounce flex-shrink-0" />
          <span className="relative z-10 animate-pulse">{config.promoBannerText}</span>
          <Sparkles size={18} className="text-amber-900 animate-bounce flex-shrink-0" />
        </div>
      )}
      <nav className="bg-slate-950/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-white/5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-amber-500/30 after:to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-black border border-white/10 shadow-inner">
                  <img src={logoUrl} alt="Clalex Divisa Logo" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 mix-blend-screen scale-110" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-black text-xl tracking-widest text-white">
                    {config ? config.companyName.split(' ')[0]?.toUpperCase() : 'CLALEX'}
                  </span>
                  <span className="text-[0.6rem] font-bold tracking-[0.25em] text-amber-500 uppercase">
                    {config && config.companyName.split(' ').length > 1 ? config.companyName.split(' ').slice(1).join(' ').toUpperCase() : 'DIVISAS'}
                  </span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-slate-400 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-amber-500 after:transition-all hover:after:w-full">
                  {link.name}
                </a>
              ))}
            </div>
            
            <div className="hidden lg:flex items-center space-x-4">
              <button 
                onClick={handleWhatsApp}
                className="flex items-center gap-2 text-slate-900 bg-white hover:bg-slate-100 px-4 py-2.5 rounded-xl font-bold transition-colors text-sm shadow-sm"
              >
                <MessageCircle size={18} className="text-emerald-500" />
                WhatsApp
              </button>
              <a 
                href="/#calculator"
                className="flex items-center gap-2 text-slate-950 bg-amber-500 hover:bg-amber-400 px-5 py-2.5 rounded-xl font-bold transition-colors text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                Solicitar Remesa
                <ArrowRight size={18} />
              </a>
              {isAdmin && (
               <Link to="/admin" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors p-2 ml-2 bg-white/5 rounded-lg border border-white/10" title="Panel Administrativo">
                  <ShieldCheck size={18} className="text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Admin</span>
               </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden items-center gap-3">
              {isAdmin && (
                <Link to="/admin" className="text-slate-400 hover:text-white transition-colors p-2 bg-white/5 rounded-lg border border-white/10">
                   <ShieldCheck size={18} className="text-blue-400" />
                </Link>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-300 hover:text-white p-2"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-slate-950 border-t border-white/5 px-4 pt-4 pb-6 space-y-4 shadow-xl">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="block text-slate-400 hover:text-amber-500 transition-colors text-sm font-bold tracking-widest uppercase py-3 border-b border-white/5"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <button 
                onClick={() => {
                  handleWhatsApp();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full text-slate-900 bg-white hover:bg-slate-100 px-4 py-3.5 rounded-xl font-bold transition-colors text-sm"
              >
                <MessageCircle size={18} className="text-emerald-500" />
                Contactar por WhatsApp
              </button>
              <a 
                href="/#calculator"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-slate-950 bg-amber-500 hover:bg-amber-400 px-4 py-3.5 rounded-xl font-bold transition-colors text-sm"
              >
                Solicitar Remesa
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

