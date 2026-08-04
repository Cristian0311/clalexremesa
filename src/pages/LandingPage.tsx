import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  ThumbsUp, 
  Zap, 
  MapPin, 
  Phone, 
  ChevronDown, 
  CheckCircle2, 
  Banknote, DollarSign,
  Building2,
  Wallet,
  ArrowRight,
  Timer,
  HeartHandshake,
  Headphones,
  TrendingUp,
  Globe,
  MessageCircle,
  Star,
  Sparkles
} from 'lucide-react';
import Calculator from '../components/Calculator';
import { AppConfig } from '../types';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error);
      
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
    } else {
      const token = localStorage.getItem('adminToken');
      if (token) setIsAdmin(true);
    }
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.2 }
  };

  return (
    <div className="flex flex-col bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-slate-900 pt-10 pb-12 lg:pt-16 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/30"></div>
          
          {/* Animated Orbs */}
          <motion.div 
            animate={{ y: [0, -30, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] right-[10%] w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-10%] left-[-5%] w-[25rem] h-[25rem] bg-emerald-500/10 rounded-full blur-[80px]"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div 
            className="flex-1 text-center lg:text-left z-10"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.2] py-2">
              {config?.heroText?.title.split(' ').map((word, i, arr) => (
                <span key={i}>
                  {i >= arr.length - 2 ? (
                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 pb-1">{word}</span>
                  ) : (
                    word
                  )}
                  {i !== arr.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light">
              {config?.heroText?.subtitle || 'Transferencias internacionales de manera segura, transparente y con la mejor tasa del mercado. Envía tranquilidad a tus seres queridos hoy mismo.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#calculator" className="bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20">
                Calcular Envío <ArrowRight size={20} />
              </a>
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-2 font-medium px-6 py-3 border border-slate-700 rounded-xl hover:bg-slate-800">
                Conoce cómo funciona <ChevronDown size={20} />
              </a>
              {isAdmin && (
                <Link to="/admin/dashboard" className="bg-amber-500 hover:bg-amber-400 text-slate-900 transition-colors flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20">
                  Panel Administrativo <ShieldCheck size={20} />
                </Link>
              )}
            </div>
            
            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 lg:gap-10">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <CheckCircle2 size={16} className="text-blue-500" />
                <span className="uppercase tracking-widest">Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Zap size={16} className="text-blue-500" />
                <span className="uppercase tracking-widest">Rápido</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <ShieldCheck size={16} className="text-blue-500" />
                <span className="uppercase tracking-widest">Confiable</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex-1 w-full max-w-lg z-10" id="calculator"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-3xl blur opacity-20"></div>
              <Calculator />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tu Remesa en Simples Pasos (Timeline 3D) */}
      <section className="py-24 bg-slate-50 relative overflow-hidden" id="how-it-works">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-20"
            {...fadeIn}
          >
            <h2 className="text-amber-500 font-black tracking-widest uppercase text-xs mb-3">Proceso Simple</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Tu remesa en <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">simples pasos</span></h3>
            <p className="text-slate-600 text-lg">Un proceso diseñado para ser rápido, transparente y 100% seguro.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Calcula tu envío',
                desc: 'Dirígete a la calculadora, introduce el monto a enviar y consulta al instante cuánto recibirá tu familiar.',
                icon: <Banknote size={26} className="text-amber-600" />
              },
              {
                step: '02',
                title: 'Completa el formulario',
                desc: 'Una vez calculado, completa los datos del remitente y destinatario para generar tu solicitud.',
                icon: <CheckCircle2 size={26} className="text-amber-600" />
              },
              {
                step: '03',
                title: 'Atención WhatsApp',
                desc: 'Tu solicitud será enviada a un asesor que te guiará personalmente para finalizar el proceso.',
                icon: <MessageCircle size={26} className="text-amber-600" />
              },
              {
                step: '04',
                title: 'Realiza el depósito',
                desc: 'Realiza el pago seguro siguiendo las instrucciones brindadas por nuestro equipo.',
                icon: <Wallet size={26} className="text-amber-600" />
              },
              {
                step: '05',
                title: 'Entrega confirmada',
                desc: 'Procesamos tu remesa rápidamente y te notificamos en cuanto el dinero sea entregado.',
                icon: <Zap size={26} className="text-amber-600" />
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeIn} 
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/30 hover:-translate-y-1 transition-all duration-300 group flex items-center gap-5"
              >
                <div className="flex-shrink-0 relative">
                  <div className="absolute -top-2 -left-2 w-7 h-7 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center text-[10px] font-black z-10 border-2 border-white shadow-sm">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{item.title}</h4>
                  <p className="text-slate-500 text-sm leading-snug">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promociones */}
      {config && config.promotions && config.promotions.trim() !== '' && (
        <section className="py-16 bg-slate-50 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              {...fadeIn}
              className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-500 p-8 md:p-12 shadow-2xl shadow-amber-500/20 text-center md:text-left flex flex-col md:flex-row items-center gap-8 border border-amber-300"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl mix-blend-overlay pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex-1 relative z-10">
                <div className="inline-flex items-center gap-2 bg-slate-950 text-amber-400 font-black tracking-widest uppercase text-xs mb-4 px-4 py-2 rounded-full shadow-lg">
                  <Sparkles size={14} className="animate-pulse" /> ¡Promoción Especial!
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-950 mb-4 tracking-tight leading-tight whitespace-pre-line drop-shadow-sm">
                  {config.promotions}
                </h2>
                <p className="text-amber-950/80 font-bold max-w-lg mb-0 text-sm md:text-base">
                  No pierdas la oportunidad de ganar y ahorrar con nuestros beneficios exclusivos.
                </p>
              </div>

              <div className="flex-shrink-0 relative z-10 hidden md:block">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center p-6 backdrop-blur-sm border border-white/30 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-slate-950 drop-shadow-md">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Nuestra Promesa / Beneficios */}
      <section className="py-24 bg-white relative overflow-hidden" id="benefits">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center max-w-3xl mx-auto mb-16" {...fadeIn}>
            <h2 className="text-amber-600 font-black tracking-widest uppercase text-xs mb-3">Nuestra Promesa</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Excelencia en cada <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">remesa</span>
            </h3>
            <p className="text-slate-600 text-lg">
              Nos enfocamos en brindar el servicio más seguro y rápido del mercado. Tu tranquilidad es nuestra prioridad.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
          >
            {(config?.benefits?.length ? config.benefits : [
              {
                title: "Seguridad y confianza",
                desc: "Protegemos tu información y acompañamos todo el proceso hasta la entrega final."
              },
              {
                title: "Atención personalizada",
                desc: "Comunicación directa mediante WhatsApp con asesores reales 100% disponibles."
              },
              {
                title: "Tasas transparentes",
                desc: "Conoce la tasa aplicada y el monto exacto antes de realizar cualquier envío."
              },
              {
                title: "Proceso sencillo",
                desc: "Diseñamos una plataforma intuitiva para que envíes dinero sin complicaciones."
              },
              {
                title: "Soporte cercano",
                desc: "Atención y seguimiento constante en cada etapa de tu proceso de remesa."
              },
              {
                title: "Múltiples opciones",
                desc: "Entregas en efectivo o transferencia, adaptándonos a lo que tu familia necesite."
              }
            ]).map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeIn} 
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg shadow-slate-200/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center gap-6 group"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-amber-600">
                    <CheckCircle2 size={26} />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{item.title}</h4>
                  <p className="text-slate-600 text-sm leading-snug">{'description' in item ? item.description : (item as any).desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Opciones de Entrega */}
      <section className="py-24 bg-slate-950 relative overflow-hidden" id="delivery">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-amber-900/10 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16 max-w-3xl mx-auto" {...fadeIn}>
            <h2 className="text-amber-500 font-black tracking-widest uppercase text-xs mb-3">Múltiples Opciones</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">Métodos de Entrega</h3>
            <p className="text-slate-400 text-lg mb-4">Adaptamos nuestras entregas a sus necesidades para asegurar que su familia reciba el dinero de la forma más conveniente.</p>
            <p className="text-sm text-amber-200/80 bg-amber-900/20 inline-block px-4 py-2 rounded-full border border-amber-800/30">
              * Los métodos pueden variar según disponibilidad del servicio.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col md:flex-row gap-4 justify-center items-stretch max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {/* Transferencia CUP */}
            <motion.div variants={fadeIn} className={`flex-1 bg-slate-900 p-5 rounded-2xl border ${config?.deliveryMethods.transferCUP ? 'border-slate-800 hover:border-amber-500/30' : 'border-slate-800/50 opacity-75'} transition-all duration-300 group flex items-center gap-4 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-16 h-16 ${config?.deliveryMethods.transferCUP ? 'bg-amber-500/5' : 'bg-slate-500/5'} rounded-full blur-xl`}></div>
              <div className={`w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shadow-inner border border-slate-700 ${config?.deliveryMethods.transferCUP ? 'group-hover:scale-110 text-amber-500' : 'text-slate-500'} transition-transform duration-300 flex-shrink-0`}>
                <Wallet size={24} />
              </div>
              <div className="text-left flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-base font-bold ${config?.deliveryMethods.transferCUP ? 'text-white' : 'text-slate-400'}`}>Transferencia CUP</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed mb-2">Directo a tarjeta bancaria en moneda nacional.</p>
                <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider ${config?.deliveryMethods.transferCUP ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                  <span className={`w-1 h-1 rounded-full ${config?.deliveryMethods.transferCUP ? 'bg-amber-500 animate-pulse' : 'bg-slate-500'}`}></span>
                  {config?.deliveryMethods.transferCUP ? 'Disponible' : 'No disponible'}
                </div>
              </div>
            </motion.div>

            {/* Efectivo CUP */}
            <motion.div variants={fadeIn} className={`flex-1 bg-slate-900 p-5 rounded-2xl border ${config?.deliveryMethods.cashCUP ? 'border-slate-800 hover:border-amber-500/30' : 'border-slate-800/50 opacity-75'} transition-all duration-300 group flex items-center gap-4 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-16 h-16 ${config?.deliveryMethods.cashCUP ? 'bg-amber-500/5' : 'bg-slate-500/5'} rounded-full blur-xl`}></div>
              <div className={`w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shadow-inner border border-slate-700 ${config?.deliveryMethods.cashCUP ? 'group-hover:scale-110 text-amber-500' : 'text-slate-500'} transition-transform duration-300 flex-shrink-0`}>
                <Banknote size={24} />
              </div>
              <div className="text-left flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-base font-bold ${config?.deliveryMethods.cashCUP ? 'text-white' : 'text-slate-400'}`}>Efectivo CUP</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed mb-2">Entrega en efectivo en moneda nacional.</p>
                <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider ${config?.deliveryMethods.cashCUP ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                  <span className={`w-1 h-1 rounded-full ${config?.deliveryMethods.cashCUP ? 'bg-amber-500 animate-pulse' : 'bg-slate-500'}`}></span>
                  {config?.deliveryMethods.cashCUP ? 'Disponible' : 'No disponible'}
                </div>
              </div>
            </motion.div>

            {/* Efectivo USD */}
            <motion.div variants={fadeIn} className={`flex-1 bg-slate-900 p-5 rounded-2xl border ${config?.deliveryMethods.cashUSD ? 'border-slate-800 hover:border-amber-500/30' : 'border-slate-800/50 opacity-75'} transition-all duration-300 group flex items-center gap-4 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-16 h-16 ${config?.deliveryMethods.cashUSD ? 'bg-amber-500/5' : 'bg-slate-500/5'} rounded-full blur-xl`}></div>
              <div className={`w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shadow-inner border border-slate-700 ${config?.deliveryMethods.cashUSD ? 'group-hover:scale-110 text-amber-500' : 'text-slate-500'} transition-transform duration-300 flex-shrink-0`}>
                <DollarSign size={24} />
              </div>
              <div className="text-left flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-base font-bold ${config?.deliveryMethods.cashUSD ? 'text-white' : 'text-slate-400'}`}>Efectivo USD</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed mb-2">Entrega segura de efectivo en dólares.</p>
                <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider ${config?.deliveryMethods.cashUSD ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                  <span className={`w-1 h-1 rounded-full ${config?.deliveryMethods.cashUSD ? 'bg-amber-500 animate-pulse' : 'bg-slate-500'}`}></span>
                  {config?.deliveryMethods.cashUSD ? 'Disponible' : 'No disponible'}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50 relative overflow-hidden" id="testimonials">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-12" {...fadeIn}>
            <h2 className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-2">Prueba Social</h2>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Lo que dicen nuestros clientes</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: "Carlos M.",
                review: "Excelente servicio, la entrega fue súper rápida y la tasa muy competitiva. Lo recomiendo totalmente.",
                stars: 5
              },
              {
                name: "María T.",
                review: "La atención por WhatsApp es inmejorable. Te acompañan en todo momento hasta que tu familia recibe el dinero.",
                stars: 5
              },
              {
                name: "Jorge L.",
                review: "Me daba miedo enviar dinero por primera vez, pero el proceso es muy seguro y transparente. ¡Gracias!",
                stars: 5
              }
            ].map((testimonial, idx) => (
              <motion.div 
                key={idx}
                variants={fadeIn}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex items-start gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <Star key={i} size={14} className="text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-3">"{testimonial.review}"</p>
                  <h4 className="font-bold text-slate-900 text-xs truncate">{testimonial.name}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {config && config.faqs && config.faqs.length > 0 && (
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden" id="faq">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center mb-10" {...fadeIn}>
              <h2 className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-2">Soporte</h2>
              <h3 className="text-3xl font-bold mb-6">Preguntas Frecuentes</h3>
            </motion.div>
            
            <div className="space-y-3">
              {config.faqs.map((faq, idx) => (
                <motion.div 
                  key={faq.id} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden hover:border-amber-500/30 transition-colors"
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center focus:outline-none"
                  >
                    <span className="font-semibold text-sm">{faq.q}</span>
                    <ChevronDown className={`transform transition-transform duration-300 text-amber-500 flex-shrink-0 ml-4 ${openFaq === idx ? 'rotate-180' : ''}`} size={16} />
                  </button>
                  <div 
                    className={`px-5 transition-all duration-300 ease-in-out ${openFaq === idx ? 'py-4 border-t border-slate-700/50 opacity-100 max-h-40' : 'max-h-0 opacity-0 overflow-hidden py-0'}`}
                  >
                    <p className="text-slate-300 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-24 bg-slate-950 overflow-hidden border-t border-amber-500/20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40"></div>
          {/* Dynamic 3D/ambient lighting effects */}
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-100 rotate-12 scale-150 transform-gpu">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
        </div>
        
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div {...fadeIn}>
            <div className="inline-flex items-center gap-2 bg-slate-800/80 backdrop-blur-md border border-amber-500/30 text-amber-400 font-bold tracking-widest uppercase text-xs mb-6 px-4 py-2 rounded-full shadow-2xl">
              <Zap size={14} className="text-amber-400" /> Operaciones Rápidas
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-md">
              ¿Listo para enviar dinero?
            </h2>
            <p className="text-slate-300 text-lg md:text-xl mb-10 font-medium max-w-2xl mx-auto">
              Usa nuestra calculadora y un asesor te atenderá de <span className="text-amber-400 font-bold">inmediato</span> por WhatsApp.
            </p>
            <a 
              href="#calculator" 
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 px-10 py-4 rounded-full font-black text-lg hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] transition-all hover:-translate-y-1 active:scale-95 group border border-amber-300"
            >
              Comenzar ahora 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      {config?.whatsapp && (
        <a
          href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent('Hola, tengo una consulta sobre las remesas.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg shadow-green-500/30 hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
          aria-label="Contactar por WhatsApp"
        >
          <span className="absolute inset-0 w-full h-full rounded-full border-2 border-green-400 opacity-0 group-hover:animate-ping"></span>
          <MessageCircle size={28} />
        </a>
      )}
    </div>
  );
}
