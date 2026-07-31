import { ShieldCheck, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import logoUrl from '../assets/images/clalex_logo_dark_1785381983172.jpg';

export default function Footer() {
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error);
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-amber-500/5 rounded-[100%] blur-[80px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12 border-b border-white/10 pb-12">
          {/* Logo Column */}
          <div className="flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden bg-black border border-amber-500/30 shadow-inner">
                <img src={logoUrl} alt="Clalex Divisa Logo" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300 mix-blend-screen scale-110" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-2xl tracking-widest text-white">
                  {config ? config.companyName.split(' ')[0]?.toUpperCase() : 'CLALEX'}
                </span>
                <span className="text-[0.7rem] font-bold tracking-[0.25em] text-amber-500 uppercase">
                  {config && config.companyName.split(' ').length > 1 ? config.companyName.split(' ').slice(1).join(' ').toUpperCase() : 'DIVISAS'}
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-sm">
              {config ? config.description : 'Empresa líder en remesas internacionales, conectando familias con seguridad, rapidez y confianza.'}
            </p>
            <div className="flex items-center gap-2 text-amber-500 text-sm font-bold bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
              <ShieldCheck size={16} />
              <span>Plataforma 100% Segura</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#how-it-works" className="hover:text-amber-400 hover:translate-x-1 inline-block transition-all">Cómo funciona</a></li>
              <li><a href="#benefits" className="hover:text-amber-400 hover:translate-x-1 inline-block transition-all">Beneficios</a></li>
              <li><a href="#delivery" className="hover:text-amber-400 hover:translate-x-1 inline-block transition-all">Métodos de entrega</a></li>
              <li><a href="#faq" className="hover:text-amber-400 hover:translate-x-1 inline-block transition-all">Preguntas frecuentes</a></li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="text-white font-black mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Redes Sociales
            </h4>
            <ul className="space-y-3 text-sm">
              {config?.socials?.facebook && config.socials.facebook.trim() !== '' && (
                <li><a href={config.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 hover:translate-x-1 inline-block transition-all">Facebook</a></li>
              )}
              {config?.socials?.instagram && config.socials.instagram.trim() !== '' && (
                <li><a href={config.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 hover:translate-x-1 inline-block transition-all">Instagram</a></li>
              )}
              {(!config?.socials?.facebook && !config?.socials?.instagram) && <li className="text-slate-500 italic">Próximamente</li>}
            </ul>
          </div>
          
          {/* Contact */}
          <div className="flex flex-col items-start">
            <h4 className="text-white font-black mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Contacto
            </h4>
            <ul className="space-y-4 text-sm w-full">
              <li className="flex gap-3 items-start">
                <MapPin size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Lima, Perú<br/>Atención a nivel nacional</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={18} className="text-amber-500 flex-shrink-0" />
                <span className="truncate text-slate-300">{config?.email || 'soporte@clalexdivisas.com'}</span>
              </li>
              {config?.schedules && (
                <li className="pt-4 border-t border-white/5 mt-2">
                  <p className="text-[0.65rem] text-amber-500 font-bold mb-1.5 uppercase tracking-widest">Horario de Atención</p>
                  <p className="whitespace-pre-line text-slate-300 text-sm leading-relaxed">{config.schedules}</p>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} {config?.companyName || 'Clalex Divisas'}. Todos los derechos reservados.</p>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Creado por <a href="https://nexus-digital-studio.onrender.com/" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-400 hover:text-amber-400 transition-colors">NEXUS DIGITAL STUDIO</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
