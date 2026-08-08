import { useState, useEffect } from 'react';
import { useConfig } from "../hooks/useConfig";
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { AppConfig } from '../types';
import logoUrl from '../assets/images/clalex_logo_dark_1785381983172.jpg';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { config } = useConfig();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is an admin via Supabase
    if (supabase) {
      const adminEmails = ['clalexremesa@gmail.com', 'cristianmarco2003@gmail.com'];
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email && adminEmails.includes(session.user.email)) {
           setIsAdmin(true);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user?.email && adminEmails.includes(session.user.email)) {
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
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-center text-[11px] sm:text-xs font-semibold tracking-wide flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-amber-800 flex-shrink-0" />
          <span>{config.promoBannerText}</span>
        </div>
      )}

      <nav className="bg-slate-950/90 backdrop-blur-lg text-white sticky top-0 z-50 border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-black border border-white/10 shadow-inner">
                  <img src={logoUrl} alt="Clalex Divisa Logo" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xl tracking-wide text-white">
                    {config ? config.companyName.split(' ')[0] : 'Clalex'}
                  </span>
                  <span className="font-medium text-xl tracking-wide text-amber-500">
                    {config && config.companyName.split(' ').length > 1 ? config.companyName.split(' ').slice(1).join(' ') : 'Divisa'}
                  </span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors relative group">
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={handleWhatsApp}
                className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium"
              >
                <MessageCircle size={16} />
                <span>Soporte</span>
              </button>
              <a 
                href="/#calculator"
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-400 hover:to-amber-500 px-5 py-2 rounded-lg font-bold transition-all text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5"
              >
                Calculadora
              </a>
              {/* Admin link removed for security */}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-3">
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
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-4 py-4 space-y-2 shadow-2xl"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="block text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all rounded-lg text-sm font-medium py-3 px-4 border border-transparent hover:border-white/5"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3 px-2">
              <button 
                onClick={() => {
                  handleWhatsApp();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-3 rounded-xl font-bold transition-all text-sm border border-amber-500/20"
              >
                <MessageCircle size={18} />
                Soporte por WhatsApp
              </button>
              <a 
                href="/#calculator"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-4 py-3 rounded-xl font-bold transition-all text-sm shadow-lg shadow-amber-500/20"
              >
                Calculadora
              </a>
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
}

