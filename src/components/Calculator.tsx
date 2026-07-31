import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, Info, MessageCircle, AlertCircle, RefreshCw, CreditCard, Banknote, ChevronLeft, Send, ArrowRight, HelpCircle, X, CheckCircle2 } from 'lucide-react';
import { AppConfig } from '../types';
import { peruDepartments, cubaProvinces } from '../data/locations';

type DeliveryMethod = 'transferCUP' | 'cashCUP' | 'cashUSD';

const HelpBubble = ({ title, description }: { title: string; description: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block ml-1">
      <motion.button
        type="button"
        whileHover={{ scale: 1.2, color: '#f59e0b' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="text-amber-500/50 hover:text-amber-500 transition-colors p-0.5 rounded-full"
      >
        <HelpCircle size={10} />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-[2px]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-[280px] bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-slate-100"
              >
                <div className="bg-amber-500 px-4 py-3 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">{title}</span>
                  <button onClick={() => setIsOpen(false)} className="text-slate-950/50 hover:text-slate-950 transition-colors">
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"{description}"</p>
                </div>
                <div className="bg-slate-50 px-4 py-2 flex justify-end">
                  <button onClick={() => setIsOpen(false)} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-600 transition-colors">Entendido</button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const BrandLogo = ({ brand }: { brand: 'YAPE' | 'PLIN' | 'DALE' }) => {
  if (brand === 'YAPE') {
    return (
      <div className="h-7 w-7 flex items-center justify-center bg-white rounded-lg overflow-hidden shadow-sm p-1 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="20" fill="#742284" />
          <path d="M25 25L50 55L75 25M50 55V85" stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="80" cy="80" r="15" fill="#00D1D1" />
        </svg>
      </div>
    );
  }
  if (brand === 'PLIN') {
    return (
      <div className="h-7 w-7 flex items-center justify-center bg-white rounded-lg overflow-hidden shadow-sm p-1 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="#00D1D1" />
          <path d="M35 25V75M35 25H55C65 25 70 32 70 42C70 52 65 59 55 59H35" stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    );
  }
  return (
    <div className="h-7 w-7 flex items-center justify-center bg-white rounded-lg overflow-hidden shadow-sm p-1 flex-shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#10B981" />
        <path d="M65 25V75M65 75H45C35 75 30 68 30 58C30 48 35 41 45 41H65" stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
};

export default function Calculator() {
  const [penAmount, setPenAmount] = useState<number | ''>('');
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<DeliveryMethod | null>(null);
  const [step, setStep] = useState(1);

  // Form State
  const [senderData, setSenderData] = useState({ name: '', document: '', city: '', phone: '' });
  const [receiverData, setReceiverData] = useState({ name: '', province: '', municipality: '', phone: '', card: '' });
  const [observations, setObservations] = useState('');

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        if (data.deliveryMethods.transferCUP) setSelectedMethod('transferCUP');
        else if (data.deliveryMethods.cashCUP) setSelectedMethod('cashCUP');
        else if (data.deliveryMethods.cashUSD) setSelectedMethod('cashUSD');
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const getActiveRate = () => {
    if (!config || !selectedMethod) return 0;
    return config.rates[selectedMethod];
  };

  const getCurrency = () => {
    if (selectedMethod === 'cashUSD') return 'USD';
    return 'CUP';
  };

  const getMethodName = () => {
    if (selectedMethod === 'transferCUP') return 'Transferencia (CUP)';
    if (selectedMethod === 'cashCUP') return 'Efectivo (CUP)';
    if (selectedMethod === 'cashUSD') return 'Efectivo (USD)';
    return '';
  };

  const receiveAmount = typeof penAmount === 'number' && config && selectedMethod
    ? (penAmount * getActiveRate()).toFixed(2) 
    : '0.00';

  const [processState, setProcessState] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config || typeof penAmount !== 'number' || penAmount <= 0 || !selectedMethod) return;
    
    setProcessState('processing');

    const message = `*Hola ${config.companyName}, deseo realizar una remesa.*

*Remitente:*
- Nombre: ${senderData.name}
- Documento: ${senderData.document}
- Ciudad: ${senderData.city}
- Teléfono: ${senderData.phone}

*Destinatario:*
- Nombre: ${receiverData.name}
- Provincia: ${receiverData.province}
- Municipio: ${receiverData.municipality}
- Teléfono: ${receiverData.phone}
${selectedMethod === 'transferCUP' ? `- Tarjeta: ${receiverData.card}` : ''}

*Remesa:*
- Monto enviado: S/ ${penAmount} PEN
- Método: ${getMethodName()}
- Tasa aplicada: S/ 1 = $${getActiveRate()} ${getCurrency()}
- A recibir: $${receiveAmount} ${getCurrency()}

*Observaciones:*
${observations || 'Ninguna'}`;

    setTimeout(() => {
      setProcessState('success');
      setTimeout(() => {
        setProcessState('idle');
        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${config.whatsapp}?text=${encodedMessage}`;
        window.open(waUrl, '_blank');
      }, 800);
    }, 1200);
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white/50 w-full min-h-[350px] flex flex-col items-center justify-center">
        <RefreshCw className="animate-spin text-blue-500 mb-4" size={32} />
        <p className="text-slate-500 font-medium tracking-wide animate-pulse">Obteniendo tasa actual...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-red-100 w-full min-h-[350px] flex flex-col items-center justify-center text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Servicio no disponible</h3>
        <p className="text-slate-500">No se pudo cargar la configuración de la tasa de cambio en este momento.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden w-full relative z-10 flex flex-col h-auto"
    >
      {/* Moving Banner */}
      <div className="bg-slate-950 py-3 overflow-hidden whitespace-nowrap relative flex-shrink-0 border-b border-white/10">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-16 text-[10px] font-black text-white uppercase tracking-[0.2em] w-max"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-16">
              <span className="flex items-center gap-3">
                <BrandLogo brand="YAPE" />
                YAPE → <span className="text-emerald-500">DALE!</span>
              </span>
              <span className="flex items-center gap-3">
                <BrandLogo brand="PLIN" />
                PLIN → <span className="text-emerald-500">DALE!</span>
              </span>
              <span className="flex items-center gap-3">
                <BrandLogo brand="DALE" />
                DALE! → <span className="text-emerald-500">DALE!</span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="bg-slate-900 px-5 py-3 text-white flex justify-between items-center relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="text-slate-300 hover:text-white transition-colors p-1 -ml-2 rounded-full hover:bg-white/10">
                <ChevronLeft size={20} />
              </button>
            )}
            <h3 className="text-base font-bold tracking-wide">{step === 1 ? 'Calculadora' : 'Detalles de Envío'}</h3>
          </div>
          {step === 1 && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-[10px] text-slate-400 font-medium">Tasa en vivo</p>
            </div>
          )}
        </div>
        {step === 1 && (
          <div className="text-right">
            <p className="text-[0.6rem] text-slate-400 font-bold uppercase tracking-wider mb-0.5">1 PEN =</p>
            <p className="text-lg font-black text-blue-400 tracking-tight">${getActiveRate()} <span className="text-[10px] text-white font-medium">{getCurrency()}</span></p>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-3"
            >
              {/* Method Selection */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-start gap-2 shadow-sm">
                <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={14} />
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-amber-900 uppercase tracking-tight">¡AVISO IMPORTANTE!</p>
                  <p className="text-[8px] font-bold text-amber-800 leading-tight">
                    Las transferencias son <span className="underline">OBLIGATORIAS</span> de: <span className="font-black">YAPE A DALE</span>, <span className="font-black">PLIN A DALE</span> y <span className="font-black">DALE A DALE</span>. <span className="text-amber-900 font-black">NO SE ACEPTA OTRO TIPO DE TRANSFERENCIA.</span>
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Método de entrega</label>
                  <HelpBubble title="Métodos" description="Selecciona cómo deseas que el dinero sea entregado en Cuba (Transferencia o Efectivo)." />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {config.deliveryMethods.transferCUP && (
                    <button
                      onClick={() => setSelectedMethod('transferCUP')}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center gap-1.5 ${selectedMethod === 'transferCUP' ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <CreditCard className={selectedMethod === 'transferCUP' ? 'text-blue-600' : 'text-slate-400'} size={18} />
                      <span className={`text-[9px] leading-tight font-bold ${selectedMethod === 'transferCUP' ? 'text-blue-900' : 'text-slate-600'}`}>Transferencia (CUP)</span>
                    </button>
                  )}
                  
                  {config.deliveryMethods.cashCUP && (
                    <button
                      onClick={() => setSelectedMethod('cashCUP')}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center gap-1.5 ${selectedMethod === 'cashCUP' ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <Banknote className={selectedMethod === 'cashCUP' ? 'text-blue-600' : 'text-slate-400'} size={18} />
                      <span className={`text-[9px] leading-tight font-bold ${selectedMethod === 'cashCUP' ? 'text-blue-900' : 'text-slate-600'}`}>Efectivo (CUP)</span>
                    </button>
                  )}

                  {config.deliveryMethods.cashUSD && (
                    <button
                      onClick={() => setSelectedMethod('cashUSD')}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center gap-1.5 ${selectedMethod === 'cashUSD' ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <Banknote className={selectedMethod === 'cashUSD' ? 'text-blue-600' : 'text-slate-400'} size={18} />
                      <span className={`text-[9px] leading-tight font-bold ${selectedMethod === 'cashUSD' ? 'text-blue-900' : 'text-slate-600'}`}>Efectivo (USD)</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Envías de Perú</label>
                    <HelpBubble title="Monto" description="Ingresa la cantidad en Soles (PEN) que deseas enviar." />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold text-sm">S/</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={penAmount}
                      onChange={(e) => setPenAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      className="block w-full pl-7 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <div className="bg-slate-200 text-slate-600 text-[8px] font-bold px-1 py-0.5 rounded">PEN</div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-[-1.15rem] top-1/2 -translate-y-1/2 z-10 pointer-events-none hidden md:flex items-center justify-center w-6 h-6 bg-white rounded-full border border-slate-200 shadow-sm text-blue-500 bg-blue-50">
                    <ArrowRight size={12} />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Reciben Cuba</label>
                    <HelpBubble title="Cálculo" description="Monto aproximado a recibir según la tasa." />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <span className="text-emerald-500 font-bold text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={receiveAmount}
                      className="block w-full pl-7 pr-10 py-2 bg-emerald-50/30 border border-emerald-100 rounded-lg text-sm font-bold text-emerald-700 cursor-not-allowed outline-none"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <div className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1 py-0.5 rounded">{getCurrency()}</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!penAmount || penAmount <= 0 || !selectedMethod}
                className="w-full relative group disabled:opacity-50 disabled:cursor-not-allowed pt-1"
              >
                <div className="relative w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                  Siguiente <ArrowRight size={14} />
                </div>
              </button>
              <p className="text-center text-[9px] text-slate-400 font-medium uppercase tracking-widest -mt-1">Sin comisiones ocultas</p>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-5"
            >
              <form onSubmit={handleWhatsApp} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Remitente Section */}
                  <div className="space-y-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-0.5 border-b border-slate-100 pb-0.5">
                      <div className="w-1 h-2.5 bg-amber-500 rounded-full"></div>
                      <h4 className="font-black text-[9px] uppercase tracking-wider text-slate-800">Tus Datos</h4>
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="flex items-center justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest px-0.5">
                          Nombre Completo
                          <HelpBubble title="Ayuda" description="Ingresa tus nombres y apellidos completos tal como figuran en tu documento." />
                        </label>
                        <input required type="text" placeholder="Ej: Juan Pérez" value={senderData.name} onChange={e => setSenderData({...senderData, name: e.target.value})} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-[10px] font-bold" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="flex items-center justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest px-0.5">
                            DNI / Pasaporte
                            <HelpBubble title="Documento" description="Ingresa solo los números de tu DNI, Pasaporte o Carnet de Extranjería." />
                          </label>
                          <input required type="text" placeholder="Número" value={senderData.document} onChange={e => setSenderData({...senderData, document: e.target.value.replace(/\D/g, '')})} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-[10px] font-bold" />
                        </div>
                        <div className="space-y-1">
                          <label className="flex items-center justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest px-0.5">
                            WhatsApp
                            <HelpBubble title="Contacto" description="Tu número de WhatsApp para enviarte el comprobante de la operación." />
                          </label>
                          <input required type="text" placeholder="999..." value={senderData.phone} onChange={e => setSenderData({...senderData, phone: e.target.value.replace(/\D/g, '')})} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-[10px] font-bold" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="flex items-center justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest px-0.5">
                          Ciudad (Perú)
                          <HelpBubble title="Ubicación" description="Selecciona la ciudad o provincia desde donde realizas el envío." />
                        </label>
                        <select required value={senderData.city} onChange={e => setSenderData({...senderData, city: e.target.value})} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-[10px] font-bold appearance-none">
                          <option value="" disabled>Seleccionar</option>
                          {peruDepartments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Destinatario Section */}
                  <div className="space-y-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between mb-0.5 border-b border-slate-100 pb-0.5">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-2.5 bg-emerald-500 rounded-full"></div>
                          <h4 className="font-black text-[9px] uppercase tracking-wider text-slate-800">Recibe en Cuba</h4>
                        </div>
                        <div className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                          {getMethodName()}
                        </div>
                      </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="flex items-center justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest px-0.5">
                          Nombre Beneficiario
                          <HelpBubble title="Destinatario" description="Nombre y apellidos de la persona que recibirá el dinero en Cuba." />
                        </label>
                        <input required type="text" placeholder="Ej: María García" value={receiverData.name} onChange={e => setReceiverData({...receiverData, name: e.target.value})} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-[10px] font-bold" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="flex items-center justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest px-0.5">
                            Provincia
                            <HelpBubble title="Cuba" description="Selecciona la provincia de destino en Cuba." />
                          </label>
                          <select required value={receiverData.province} onChange={e => setReceiverData({...receiverData, province: e.target.value, municipality: ''})} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-[10px] font-bold appearance-none">
                            <option value="" disabled>Prov.</option>
                            {Object.keys(cubaProvinces).map(prov => <option key={prov} value={prov}>{prov}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="flex items-center justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest px-0.5">
                            Municipio
                            <HelpBubble title="Cuba" description="Selecciona el municipio correspondiente a la provincia." />
                          </label>
                          <select required value={receiverData.municipality} onChange={e => setReceiverData({...receiverData, municipality: e.target.value})} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-[10px] font-bold appearance-none disabled:opacity-50" disabled={!receiverData.province}>
                            <option value="" disabled>Mun.</option>
                            {receiverData.province && cubaProvinces[receiverData.province]?.map(mun => <option key={mun} value={mun}>{mun}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {selectedMethod === 'transferCUP' && (
                          <div className="space-y-1 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                            <label className="flex items-center justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest px-0.5">
                              Número de Tarjeta (CUP)
                              <HelpBubble title="Tarjeta Bancaria" description="Ingresa los 16 números de la tarjeta de destino en Cuba (CUP)." />
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                <CreditCard size={12} className="text-emerald-500" />
                              </div>
                              <input 
                                required 
                                type="text" 
                                maxLength={19}
                                placeholder="92xx-xxxx-xxxx-xxxx" 
                                value={receiverData.card} 
                                onChange={e => {
                                  const rawValue = e.target.value.replace(/\D/g, '').slice(0, 16);
                                  const formattedValue = rawValue.match(/.{1,4}/g)?.join('-') || rawValue;
                                  setReceiverData({...receiverData, card: formattedValue});
                                }} 
                                className="w-full pl-8 pr-2 py-1.5 bg-white border border-emerald-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-[11px] font-black text-emerald-700 placeholder:text-emerald-200" 
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="flex items-center justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest px-0.5">
                            Teléfono Cuba
                            <HelpBubble title="Contacto Cuba" description="Número móvil o fijo de la persona que recibe (con código 53)." />
                          </label>
                          <input required type="text" placeholder="53..." value={receiverData.phone} onChange={e => setReceiverData({...receiverData, phone: e.target.value.replace(/\D/g, '')})} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-[10px] font-bold" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <label className="flex items-center justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest px-0.5">
                    Observaciones (Opcional)
                  </label>
                  <textarea rows={1} value={observations} onChange={e => setObservations(e.target.value)} className="w-full px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none text-[9px] font-medium" placeholder="Escribe aquí..."></textarea>
                </div>

                <div className="flex items-center justify-between bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black uppercase tracking-wider text-emerald-600">Total Recibe</span>
                    <span className="text-sm font-black leading-none text-slate-900">${receiveAmount} <span className="text-[9px] opacity-70">{getCurrency()}</span></span>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setStep(1)} className="bg-white hover:bg-slate-50 text-slate-500 p-1 rounded-md border border-slate-200 transition-all active:scale-95 disabled:opacity-50" disabled={processState !== 'idle'}>
                      <ChevronLeft size={12} />
                    </button>
                    <button type="submit" disabled={processState !== 'idle'} className={`text-white font-black px-3 py-1 rounded-md shadow-md transition-all active:scale-95 flex items-center gap-1.5 text-[9px] uppercase tracking-wider border ${processState === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600' : 'bg-green-600 hover:bg-green-700 border-green-700'}`}>
                      {processState === 'idle' && <><MessageCircle size={10} /> Enviar por WhatsApp</>}
                      {processState === 'processing' && <><RefreshCw size={10} className="animate-spin" /> Procesando...</>}
                      {processState === 'success' && <><CheckCircle2 size={10} /> ¡Listo!</>}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
