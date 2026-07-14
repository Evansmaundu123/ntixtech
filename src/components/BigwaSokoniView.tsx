import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Flame, TrendingUp, Percent, ShoppingBag, 
  Wrench, Clock, ArrowRight, Star, Volume2, ShieldCheck, 
  ChevronRight, Laptop, Smartphone, Wifi, Zap, RefreshCw,
  Phone, User, CreditCard, CheckCircle2, AlertCircle, Info, Send
} from 'lucide-react';
import { Product, Service } from '../types';

interface BigwaSokoniViewProps {
  products: Product[];
  services: Service[];
  onNavigate: (view: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}

interface DealItem {
  id: string;
  type: 'DATA' | 'MINUTES' | 'MONTHLY' | 'SMS' | 'MULTIPLE';
  price: number;
  value: string;
  duration: string;
}

export default function BigwaSokoniView({
  products,
  services,
  onNavigate,
  onSelectProduct,
  onAddToCart,
  onAddToWishlist
}: BigwaSokoniViewProps) {
  const [filter, setFilter] = useState<string>('all');
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 48, seconds: 19 });

  // Interactive NTIX Tech state
  const [selectedDeal, setSelectedDeal] = useState<DealItem>({
    id: 'data-2',
    type: 'DATA',
    price: 19,
    value: '1GB',
    duration: '1hr'
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mpesaName, setMpesaName] = useState('');
  const [paymentStep, setPaymentStep] = useState<'idle' | 'prompt' | 'processing' | 'success'>('idle');
  const [mpesaPin, setMpesaPin] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  // Raw NTIX Tech Solutions flyer deals data
  const dataDeals: DealItem[] = [
    { id: 'data-1', type: 'DATA', price: 20, value: '250mbs', duration: '24hrs' },
    { id: 'data-2', type: 'DATA', price: 19, value: '1GB', duration: '1hr' },
    { id: 'data-3', type: 'DATA', price: 47, value: '350mb', duration: '7days' },
    { id: 'data-4', type: 'DATA', price: 49, value: '1.5GB', duration: '3hrs' },
    { id: 'data-5', type: 'DATA', price: 55, value: '1.25GB', duration: 'Till midnight' },
    { id: 'data-6', type: 'DATA', price: 99, value: '1GB', duration: '24hrs' },
    { id: 'data-7', type: 'DATA', price: 120, value: '2GB', duration: '24hrs' },
    { id: 'data-8', type: 'DATA', price: 300, value: '2.5GB', duration: '7days' },
    { id: 'data-9', type: 'DATA', price: 700, value: '6GB', duration: '7days' },
  ];

  const minutesDeals: DealItem[] = [
    { id: 'min-1', type: 'MINUTES', price: 21, value: '45 minutes', duration: '3 hours' },
    { id: 'min-2', type: 'MINUTES', price: 51, value: '50 minutes', duration: 'Midnight' },
    { id: 'min-3', type: 'MINUTES', price: 110, value: '100 minutes', duration: '2 days' },
  ];

  const monthlyDeals: DealItem[] = [
    { id: 'month-1', type: 'MONTHLY', price: 249, value: '1.2 GB', duration: '30 days' },
    { id: 'month-2', type: 'MONTHLY', price: 999, value: '800 minutes', duration: '30 days' },
    { id: 'month-3', type: 'MONTHLY', price: 1000, value: '10 GB', duration: '30 days' },
    { id: 'month-4', type: 'MONTHLY', price: 1001, value: '8 GB + 400 min', duration: '30 days' },
  ];

  const smsDeals: DealItem[] = [
    { id: 'sms-1', type: 'SMS', price: 5, value: '20 SMS', duration: '24 hours' },
    { id: 'sms-2', type: 'SMS', price: 10, value: '200 SMS', duration: '24 hours' },
    { id: 'sms-3', type: 'SMS', price: 30, value: '1000 SMS', duration: '7 days' },
    { id: 'sms-4', type: 'SMS', price: 101, value: '1500 SMS', duration: '30 days' },
    { id: 'sms-5', type: 'SMS', price: 201, value: '3500 SMS', duration: '30 days' },
  ];

  const multipleDeals: DealItem[] = [
    { id: 'mult-1', type: 'MULTIPLE', price: 22, value: '1GB', duration: '1hr' },
    { id: 'mult-2', type: 'MULTIPLE', price: 52, value: '1.5GB', duration: '3hrs' },
  ];

  // Swahili announcements ticker
  const announcements = [
    "NTIX TECH SOLUTIONS: Relax and Browse with lightning fast internet bundles!",
    "Lipa na M-Pesa kwa urahisi ukitumia Buy Goods Till Number nchini kote.",
    "Wahi Ofa! Ofa ya flash ya 1GB kwa KSh 19 / 1hr inamalizika hivi punde!",
    "Pata Ofa za Minutes, SMS, na data bila wasiwasi, iwe unatumia au hutumii Okoa Jahazi!"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromoIndex(prev => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const startPaymentSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    setNameError('');

    if (!phoneNumber) {
      setPhoneError('Nambari ya simu inahitajika!');
      return;
    }
    if (!/^(07|01|\+254)[0-9]{8}$/.test(phoneNumber.trim().replace(/\s+/g, ''))) {
      setPhoneError('Weka nambari halali ya Safaricom (Mfano: 0712345678)');
      return;
    }
    if (!mpesaName) {
      setNameError('Jina kamili la M-Pesa linahitajika kwa uthibitisho!');
      return;
    }

    setSimulationLogs([
      `Anzisha muamala wa KSh ${selectedDeal.price} kwenda kwa NTIX TECH SOLUTIONS...`,
      `Inatuma ombi la STK Push kwenda kwa nambari ${phoneNumber}...`
    ]);
    setPaymentStep('prompt');
  };

  const confirmPinPayment = () => {
    if (!mpesaPin || mpesaPin.length < 4) {
      alert('Tafadhali weka PIN halali ya nambari 4!');
      return;
    }

    setPaymentStep('processing');
    setSimulationLogs(prev => [...prev, `Mtumiaji amethibitisha na PIN. Inakamilisha malipo...`]);

    setTimeout(() => {
      setSimulationLogs(prev => [
        ...prev,
        `M-Pesa imethibitisha muamala! Rejea ya Muamala: MP${Math.floor(Math.random() * 900000 + 100000)}TX`,
        `KSh ${selectedDeal.price} imetumwa kwa NTIX TECH SOLUTIONS.`,
        `Inatuma kifurushi cha ${selectedDeal.value} (${selectedDeal.duration}) kwenda kwa ${phoneNumber}...`,
        `Hongera! Kifurushi chako kimeamilishwa kikamilifu.`
      ]);
      setPaymentStep('success');
    }, 2000);
  };

  // Convert products from general inventory to special curated deals
  const sokoniDeals = products.map(p => {
    const oldPrice = p.oldPrice || Math.floor(p.price * 1.25);
    const discountPercent = Math.round(((oldPrice - p.price) / oldPrice) * 100);
    return {
      ...p,
      oldPrice,
      discountPercent,
      isHot: p.rating >= 4.5 || p.price > 40000
    };
  });

  const filteredDeals = filter === 'all' 
    ? sokoniDeals 
    : sokoniDeals.filter(d => d.category.toLowerCase().includes(filter) || d.name.toLowerCase().includes(filter));

  return (
    <div className="w-full bg-[#fcfdfe] dark:bg-[#030712] text-slate-800 dark:text-slate-100 font-sans flex-1 transition-colors duration-300" id="bigwa-sokoni-view">
      
      {/* 1. SWAHILI ANNOUNCEMENT TICKER */}
      <div className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white py-2 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-bold gap-3">
          <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
            <Volume2 className="w-4 h-4 text-emerald-200 shrink-0 animate-bounce" />
            <span className="text-[10px] uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded font-black shrink-0">BINGWA NEWS:</span>
            <p className="truncate animate-fadeIn select-none text-emerald-50">
              {announcements[activePromoIndex]}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-[10px] uppercase tracking-widest text-emerald-100">
            <Clock className="w-3.5 h-3.5 text-emerald-300 animate-spin-slow" />
            <span>Wahi Sasa: </span>
            <span className="font-mono font-black text-white bg-black/40 px-1.5 py-0.5 rounded">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAJESTIC BETTY BINGWA INTERACTIVE POSTER CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: THE BEAUTIFUL DIGITAL POSTER RECREATION */}
          <div className="lg:col-span-7 bg-[#fcfdfa] border-4 border-green-600 rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden select-none" id="betty-bingwa-solutions-flyer">
            
            {/* Background Texture Vibe */}
            <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04] pointer-events-none" />
            
            {/* Poster Header */}
            <div className="text-center space-y-1 relative z-10">
              <h1 className="font-sans font-black text-4xl sm:text-6xl text-green-600 tracking-tight leading-none uppercase filter drop-shadow-[0_2px_1px_rgba(0,0,0,0.15)] animate-pulse">
                RELAX &amp; BROWSE
              </h1>
              
              <div className="inline-block bg-green-600 text-white font-black text-xs sm:text-base px-4 py-1.5 rounded-md tracking-wider uppercase shadow-md">
                NTIX TECH SOLUTIONS
              </div>
              
              <p className="text-[11px] sm:text-xs font-extrabold text-slate-500 tracking-widest uppercase pt-1">
                WITH OR WITHOUT OKOA JAHAZI
              </p>
            </div>

            {/* Poster Grid of deals */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              
              {/* Column 1: DATA DEALS */}
              <div className="border border-green-600 rounded-xl p-3 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="bg-green-600 text-white text-[10px] font-black tracking-widest uppercase text-center py-1.5 px-3 rounded mb-3">
                    DATA DEALS
                  </div>
                  <div className="space-y-1.5">
                    {dataDeals.map((deal) => (
                      <div 
                        key={deal.id}
                        onClick={() => setSelectedDeal(deal)}
                        className={`flex items-center justify-between text-[11px] p-1.5 rounded-lg border transition-all cursor-pointer ${
                          selectedDeal.id === deal.id 
                            ? 'bg-green-50 border-green-500 scale-[1.02] shadow-sm font-extrabold text-green-700' 
                            : 'border-slate-100 hover:bg-slate-50 text-slate-700 hover:border-slate-200'
                        }`}
                      >
                        <span className="font-mono text-green-600 font-bold bg-green-50 dark:bg-green-950/20 px-1.5 py-0.5 rounded">
                          Ksh {deal.price}
                        </span>
                        <span className="uppercase text-slate-900 font-black">
                          = {deal.value}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {deal.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2: OTHER CATEGORIES */}
              <div className="space-y-4">
                
                {/* MINUTES DEALS */}
                <div className="border border-green-600 rounded-xl p-3 bg-white shadow-sm">
                  <div className="bg-green-600 text-white text-[10px] font-black tracking-widest uppercase text-center py-1.5 px-3 rounded mb-2.5">
                    MINUTES DEALS
                  </div>
                  <div className="space-y-1.5">
                    {minutesDeals.map((deal) => (
                      <div 
                        key={deal.id}
                        onClick={() => setSelectedDeal(deal)}
                        className={`flex items-center justify-between text-[11px] p-1.5 rounded-lg border transition-all cursor-pointer ${
                          selectedDeal.id === deal.id 
                            ? 'bg-green-50 border-green-500 scale-[1.02] shadow-sm font-extrabold text-green-700' 
                            : 'border-slate-100 hover:bg-slate-50 text-slate-700 hover:border-slate-200'
                        }`}
                      >
                        <span className="font-mono text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                          Ksh {deal.price}
                        </span>
                        <span className="uppercase text-slate-900 font-black">
                          = {deal.value}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {deal.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MONTHLY DEALS */}
                <div className="border border-green-600 rounded-xl p-3 bg-white shadow-sm">
                  <div className="bg-green-600 text-white text-[10px] font-black tracking-widest uppercase text-center py-1.5 px-3 rounded mb-2.5">
                    MONTHLY DEALS
                  </div>
                  <div className="space-y-1.5">
                    {monthlyDeals.map((deal) => (
                      <div 
                        key={deal.id}
                        onClick={() => setSelectedDeal(deal)}
                        className={`flex items-center justify-between text-[11px] p-1.5 rounded-lg border transition-all cursor-pointer ${
                          selectedDeal.id === deal.id 
                            ? 'bg-green-50 border-green-500 scale-[1.02] shadow-sm font-extrabold text-green-700' 
                            : 'border-slate-100 hover:bg-slate-50 text-slate-700 hover:border-slate-200'
                        }`}
                      >
                        <span className="font-mono text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                          Ksh {deal.price}
                        </span>
                        <span className="uppercase text-slate-900 font-black">
                          = {deal.value}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {deal.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Row of Poster: SMS & MULTIPLE PURCHASE */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              
              {/* SMS DEALS */}
              <div className="border border-green-600 rounded-xl p-3 bg-white shadow-sm">
                <div className="bg-green-600 text-white text-[10px] font-black tracking-widest uppercase text-center py-1.5 px-3 rounded mb-2.5">
                  SMS DEALS
                </div>
                <div className="space-y-1.5">
                  {smsDeals.map((deal) => (
                    <div 
                      key={deal.id}
                      onClick={() => setSelectedDeal(deal)}
                      className={`flex items-center justify-between text-[11px] p-1.5 rounded-lg border transition-all cursor-pointer ${
                        selectedDeal.id === deal.id 
                          ? 'bg-green-50 border-green-500 scale-[1.02] shadow-sm font-extrabold text-green-700' 
                          : 'border-slate-100 hover:bg-slate-50 text-slate-700 hover:border-slate-200'
                      }`}
                    >
                      <span className="font-mono text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                        Ksh {deal.price}
                      </span>
                      <span className="uppercase text-slate-900 font-black">
                        = {deal.value}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {deal.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* MULTIPLE PURCHASE PER DAY */}
              <div className="border border-green-600 rounded-xl p-3 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="bg-green-600 text-white text-[9px] font-black tracking-widest uppercase text-center py-1.5 px-3 rounded mb-2.5">
                    MULTIPLE PURCHASE PER DAY
                  </div>
                  <div className="space-y-1.5">
                    {multipleDeals.map((deal) => (
                      <div 
                        key={deal.id}
                        onClick={() => setSelectedDeal(deal)}
                        className={`flex items-center justify-between text-[11px] p-1.5 rounded-lg border transition-all cursor-pointer ${
                          selectedDeal.id === deal.id 
                            ? 'bg-green-50 border-green-500 scale-[1.02] shadow-sm font-extrabold text-green-700' 
                            : 'border-slate-100 hover:bg-slate-50 text-slate-700 hover:border-slate-200'
                        }`}
                      >
                        <span className="font-mono text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                          Ksh {deal.price}
                        </span>
                        <span className="uppercase text-slate-900 font-black">
                          = {deal.value}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {deal.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Styled Afro man vector representation block */}
                <div className="mt-4 bg-green-50 p-2.5 rounded-xl border border-green-100 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-black text-xl shadow shrink-0 animate-bounce">
                    🕶️
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8.5px] text-green-600 font-black tracking-widest block">CHAMPION DEALS</span>
                    <span className="text-[10px] text-slate-700 font-extrabold block truncate">Instant Safaricom Delivery!</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Poster Payment details: LIPA NA M-PESA & BUY GOODS TILL NUMBER */}
            <div className="mt-6 border-t-2 border-dashed border-green-300 pt-5 space-y-3 relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-green-600 text-white p-4 rounded-2xl shadow-md">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-black tracking-widest text-emerald-100 block">LIPA NA M-PESA</span>
                  <h3 className="text-sm font-black uppercase tracking-wide">BUY GOODS TILL NUMBER</h3>
                </div>
                
                {/* Visual Boxes for Till Number digits: empty/blank */}
                <div className="flex items-center gap-1">
                  {['', '', '', '', '', '', ''].map((digit, idx) => (
                    <span 
                      key={idx}
                      className="w-8 h-8 rounded bg-white text-green-600 font-black text-lg flex items-center justify-center shadow-inner border border-green-500 animate-fadeIn"
                    >
                      {digit}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-black text-green-600 tracking-wide px-1">
                <span>Nafasi/Jina: NTIX TECH SOLUTIONS</span>
                <span>Piga: +254 703 500 814</span>
              </div>
            </div>

          </div>

          {/* RIGHT: INSTANT SAFARICOM M-PESA INTERACTIVE SIMULATOR */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-xl p-6 relative">
              <div className="absolute top-0 right-0 bg-gradient-to-bl from-green-500/15 to-transparent w-24 h-24 rounded-bl-full pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-50 dark:bg-green-950/40 p-2 rounded-xl text-green-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">Portal ya Malipo (M-Pesa)</h2>
                  <p className="text-[10px] text-slate-400 font-bold">Lipa kwa Mbofyo Mmoja Salama kabisa</p>
                </div>
              </div>

              {/* Selected Bundle Info */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 mb-5 text-left">
                <span className="text-[9px] text-green-600 font-black tracking-wider uppercase block">KIFURUSHI CHAKO KILICHOCHAGULIWA</span>
                <div className="flex items-baseline justify-between mt-1.5">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                    {selectedDeal.value} {selectedDeal.type} bundle ({selectedDeal.duration})
                  </h3>
                  <span className="text-sm font-black text-green-600 font-mono">
                    KSh {selectedDeal.price}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Kikaguliwe na kuwasilishwa mara moja punde malipo yanapothibitishwa kwenda kwa till ya <strong>NTIX Tech Solutions</strong>.
                </p>
              </div>

              {paymentStep === 'idle' && (
                <form onSubmit={startPaymentSimulation} className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                      NAMBARI YAKO YA SAFARICOM (Safaricom Phone No.)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Mfano: 0712345678"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-9 text-xs font-mono font-bold focus:outline-none focus:border-green-500 dark:focus:border-green-500"
                      />
                    </div>
                    {phoneError && (
                      <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{phoneError}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                      JINA LAKO LA M-PESA (Verification Name)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={mpesaName}
                        onChange={(e) => setMpesaName(e.target.value)}
                        placeholder="Mfano: Evans Maundu"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-9 text-xs font-bold focus:outline-none focus:border-green-500 dark:focus:border-green-500"
                      />
                    </div>
                    {nameError && (
                      <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{nameError}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>LIPA NA M-PESA Sasa</span>
                  </button>
                </form>
              )}

              {/* STEP 2: SIMULATED STK PIN PROMPT (M-PESA SIMULATION SCREEN) */}
              {paymentStep === 'prompt' && (
                <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 text-white font-mono space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">SIMULATOR: M-Pesa SIM Popup</span>
                    <span className="text-[9px] text-slate-500">Till: </span>
                  </div>

                  <div className="space-y-2 text-xs leading-relaxed text-center py-4 bg-slate-900/50 rounded-xl border border-slate-800/60">
                    <p className="font-bold text-slate-200">
                      Do you want to pay KSh {selectedDeal.price} to Buy Goods for <strong className="text-emerald-400">NTIX TECH SOLUTIONS</strong>?
                    </p>
                    <p className="text-[10px] text-slate-400">Enter your 4-digit PIN:</p>
                    
                    <div className="max-w-[120px] mx-auto mt-2">
                      <input 
                        type="password" 
                        maxLength={4}
                        value={mpesaPin}
                        onChange={(e) => setMpesaPin(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="••••"
                        className="w-full bg-slate-950 border border-slate-700 text-center py-1.5 rounded-lg text-lg tracking-widest text-emerald-400 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setPaymentStep('idle')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmPinPayment}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[11px] py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Confirm Pay
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PROCESSING PAYMENT */}
              {paymentStep === 'processing' && (
                <div className="py-12 text-center space-y-4">
                  <RefreshCw className="w-12 h-12 text-green-500 mx-auto animate-spin" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300 animate-pulse">Inakamilisha malipo yako na M-Pesa. Tafadhali subiri kidogo...</p>
                </div>
              )}

              {/* STEP 4: TRANSACTION COMPLETED SUCCESSFULLY */}
              {paymentStep === 'success' && (
                <div className="text-center space-y-4 animate-fadeIn py-4">
                  <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto border border-green-200 shadow-sm">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Kifurushi Kimeamilishwa!</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Umekwishapokea kifurushi chako cha {selectedDeal.value} kikamilifu.</p>
                  </div>

                  {/* Visual Receipt */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-left text-[11px] space-y-1.5 font-mono">
                    <div className="flex justify-between"><span className="text-slate-400">Jina:</span><span className="font-bold text-slate-700 dark:text-slate-200">{mpesaName}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Nambari:</span><span className="font-bold text-slate-700 dark:text-slate-200">{phoneNumber}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Kiasi:</span><span className="font-bold text-slate-700 dark:text-slate-200">KSh {selectedDeal.price}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Duka Till:</span><span className="font-bold text-slate-700 dark:text-slate-200"> (NTIX Tech)</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Kifurushi:</span><span className="font-bold text-green-600">{selectedDeal.value} ({selectedDeal.duration})</span></div>
                  </div>

                  <button
                    onClick={() => {
                      setPaymentStep('idle');
                      setMpesaPin('');
                    }}
                    className="w-full bg-slate-950 dark:bg-slate-800 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider py-2.5 rounded-xl cursor-pointer"
                  >
                    Nunua Kifurushi Cingine
                  </button>
                </div>
              )}

              {/* Simulator Logs Box */}
              {simulationLogs.length > 0 && (
                <div className="mt-5 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-left">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block mb-2">Simulated Device Logs:</span>
                  <div className="bg-slate-950 rounded-xl p-3 text-[9.5px] font-mono text-emerald-400/90 space-y-1 max-h-24 overflow-y-auto">
                    {simulationLogs.map((log, idx) => (
                      <p key={idx}>&gt; {log}</p>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Helpline helper card */}
            <div className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 rounded-2xl p-4 flex gap-3 text-left">
              <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">Msaada na Maswali?</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Huduma hii inafanya kazi nchini kote. Ikiwa una swali au hitaji lolote, piga simu au wasiliana nasi moja kwa moja kwa <strong>+254 703 500 814</strong> au kupitia barua pepe ya msaada wa mabigwa.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. CATEGORY FILTERS ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800/80 pb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500 animate-pulse" />
            <h2 className="font-display font-black text-base uppercase tracking-tight">Bidhaa Zingine za Mabigwa</h2>
          </div>
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {[
              { id: 'all', label: 'Zote (All)' },
              { id: 'laptop', label: 'Laptop' },
              { id: 'phone', label: 'Simu (Phones)' },
              { id: 'wi-fi', label: 'Mtandao (Wi-Fi)' },
              { id: 'charger', label: 'Vifaa vya Chaji' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border cursor-pointer transition-all shrink-0 ${
                  filter === btn.id
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-transparent shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
            <RefreshCw className="w-10 h-10 text-slate-400 mx-auto animate-spin mb-4" />
            <p className="text-xs text-slate-500 font-bold">Hakuna bidhaa inayolingana na kichujio hicho kwa sasa.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDeals.map((prod) => (
              <div 
                key={prod.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-850 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:border-emerald-500/20 dark:hover:border-emerald-400/20 transition-all duration-300 group relative"
              >
                {/* Discount Badge */}
                <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md z-10 flex items-center gap-1">
                  <Percent className="w-3 h-3 text-white" />
                  <span>{prod.discountPercent}% OFF</span>
                </div>

                {/* Hot Badge */}
                {prod.isHot && (
                  <div className="absolute top-2.5 right-2.5 bg-emerald-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-md z-10 flex items-center gap-1 shadow-sm">
                    <Flame className="w-3 h-3 text-red-600 fill-red-600 animate-pulse" />
                    <span>POPULAR</span>
                  </div>
                )}

                {/* Image Wrapper */}
                <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
                  <img 
                    src={prod.image} 
                    alt={prod.name}
                    className="w-full h-full object-contain max-h-[160px] transform group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Hover action overlay */}
                  <div className="absolute inset-0 bg-slate-950/10 dark:bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <button
                      onClick={() => onSelectProduct(prod)}
                      className="bg-white text-slate-900 text-[10px] font-bold tracking-wider uppercase py-2 px-4 rounded-xl shadow-md hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Kagua Sifa
                    </button>
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-4 flex-1 flex flex-col justify-between border-t border-gray-50 dark:border-slate-800/50">
                  <div className="space-y-1">
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold tracking-wider uppercase">
                      {prod.category}
                    </span>
                    <h3 
                      onClick={() => onSelectProduct(prod)}
                      className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2 cursor-pointer hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                    >
                      {prod.name}
                    </h3>
                    
                    {/* Stars */}
                    <div className="flex items-center gap-1 pt-1">
                      <div className="flex text-amber-400 shrink-0">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx} 
                            className={`w-3 h-3 ${idx < Math.floor(prod.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 dark:text-slate-700'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">({prod.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Buy / CTA section */}
                  <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/40">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xs font-black text-slate-900 dark:text-slate-100 font-mono">
                        KSh {prod.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through font-mono">
                        KSh {prod.oldPrice.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => onAddToCart(prod)}
                      className="w-full bg-slate-950 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-700 text-white text-[11px] font-black uppercase tracking-wider py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ongeza kwenye Kikapu</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. MABINGWA WA HUDUMA CORNER (Cyber Cafe & Tech Services Showcase) */}
      <div className="bg-slate-100 dark:bg-slate-950/40 py-12 border-t border-b border-gray-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="mb-8">
            <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-3 py-1 font-bold uppercase rounded-full tracking-wider mb-2.5 inline-block border border-emerald-300/30">
              Ufungaji na Matengenezo (Our Expert Services)
            </span>
            <h2 className="font-display font-black text-xl sm:text-2xl tracking-tight uppercase">
              HUDUMA ZA KIJANJA & CYBER EXPERTISE
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Tuna timu ya mabingwa waliothibitishwa kuunda mifumo ya cyber cafe, mitandao salama, na ufungaji wa kisasa wa software nchini. Weka miadi leo uone faida!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(0, 3).map((srv) => (
              <div 
                key={srv.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-850 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Mabingwa
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Uhakika 100%
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {srv.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-2 line-clamp-3">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-850/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Gharama Kuanzia</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                      {srv.priceDetails}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => onNavigate('booking')}
                    className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group cursor-pointer"
                  >
                    <span>Weka Nafasi</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
