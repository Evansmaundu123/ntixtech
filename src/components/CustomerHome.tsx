import React from 'react';
import { 
  ShoppingBag, Calendar, Truck, ShieldCheck, Award, Headphones, 
  RotateCcw, DollarSign, ArrowRight, Star, Heart, Laptop, 
  Monitor, Smartphone, Headphones as AccessoriesIcon, Wifi, Printer, 
  HardDrive, Eye, Wrench, Gamepad2, Zap, Sparkles
} from 'lucide-react';
import { Product } from '../types';

interface CustomerHomeProps {
  products: Product[];
  onNavigate: (view: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}

export default function CustomerHome({
  products,
  onNavigate,
  onSelectProduct,
  onAddToCart,
  onAddToWishlist
}: CustomerHomeProps) {
  // Take first 5 featured items for the home page showcase
  const featured = products.slice(0, 5);

  // 6 Value propositions matching the mockup exactly
  const valueProps = [
    {
      title: 'Free Delivery',
      desc: 'On orders over KSh 5,000',
      icon: Truck,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Secure Payments',
      desc: '100% secure payments',
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Quality Products',
      desc: 'Genuine products',
      icon: Award,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Expert Support',
      desc: '24/7 customer support',
      icon: Headphones,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Easy Returns',
      desc: '7-day return policy',
      icon: RotateCcw,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Best Prices',
      desc: 'Affordable always',
      icon: DollarSign,
      color: 'text-blue-600 bg-blue-50'
    }
  ];

  // 10 Popular categories matching the mockup exactly
  const popularCategories = [
    { name: 'Laptops', icon: Laptop, count: '120 products', slug: 'laptops' },
    { name: 'Desktops', icon: Monitor, count: '35 products', slug: 'desktops' },
    { name: 'Phones', icon: Smartphone, count: '85 products', slug: 'phones' },
    { name: 'Accessories', icon: AccessoriesIcon, count: '150 products', slug: 'accessories' },
    { name: 'Networking', icon: Wifi, count: '38 products', slug: 'networking' },
    { name: 'Printers', icon: Printer, count: '42 products', slug: 'printers' },
    { name: 'Storage', icon: HardDrive, count: '54 products', slug: 'storage' },
    { name: 'CCTV', icon: Eye, count: '29 products', slug: 'cctv' },
    { name: 'Repairs', icon: Wrench, count: 'Store Service', slug: 'repairs' },
    { name: 'Gaming', icon: Gamepad2, count: '64 products', slug: 'gaming' }
  ];


  return (
    <div className="w-full bg-[#f8fafc] dark:bg-[#030712] text-slate-800 dark:text-slate-100 font-sans flex-1 transition-colors duration-300" id="customer-home">
      
      {/* 1. HERO BANNER (Cyberpunk dark tech vibe matching the screenshot) */}
      <div className="relative w-full overflow-hidden bg-[#020617] text-white py-12 md:py-20 border-b border-slate-950">
        {/* Glowing background meshes */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,240,255,0.22),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.18),transparent_50%)] pointer-events-none" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 items-center gap-10 relative z-10">
          
          {/* Left Text Column */}
          <div className="md:col-span-5 space-y-6 text-left">
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight uppercase">
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">TECHNOLOGY SOLUTIONS</span> <br />
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(168,85,247,0.2)]">FOR A BETTER TOMORROW</span>
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal max-w-md">
              Your one-stop shop for high-performance electronics, professional computer repairs, secure networking, and modern cyber services.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-lg transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 cursor-pointer text-xs tracking-wider border border-blue-400/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>SHOP NOW</span>
              </button>
              
              <button
                onClick={() => onNavigate('booking')}
                className="bg-slate-900/60 hover:bg-slate-800/80 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white font-bold px-6 py-3 rounded-lg transition-all flex items-center gap-2 cursor-pointer text-xs tracking-wider shadow-md shadow-cyan-950/40"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>BOOK A SERVICE</span>
              </button>
            </div>
          </div>

          {/* Right Showcase Column (Stunning animated images of phones, chargers, laptops, routers, earphones) */}
          <div className="md:col-span-7 relative w-full h-[380px] md:h-[450px] flex items-center justify-center overflow-visible mt-8 md:mt-0" id="hero-hardware-composition">
            
            {/* Glowing backdrop neon rings and auras */}
            <div className="absolute inset-0 bg-cyan-500/5 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute w-[300px] h-[300px] bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none" />
            
            {/* 1. LAPTOP - The Majestic Anchor (Center) */}
            <div className="absolute w-[180px] h-[135px] sm:w-[240px] sm:h-[180px] md:w-[280px] md:h-[210px] z-20 left-[24%] top-[25%] animate-float-1 transition-all duration-300">
              <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.35)] bg-[#030712] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80" 
                  alt="Premium laptop" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-2 left-3 bg-cyan-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 font-mono text-[9px] font-bold px-2 py-0.5 rounded tracking-wider">LAPTOP</span>
              </div>
            </div>

            {/* 2. PHONE - The Portal (Top Left) */}
            <div className="absolute w-[110px] h-[150px] sm:w-[130px] sm:h-[180px] md:w-[150px] md:h-[210px] z-10 left-[2%] top-[5%] animate-float-2 transition-all duration-300">
              <div className="w-full h-full rounded-2xl overflow-hidden border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.25)] bg-[#030712] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80" 
                  alt="Premium phone" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-2 left-3 bg-purple-950/80 backdrop-blur-md text-purple-300 border border-purple-500/30 font-mono text-[9px] font-bold px-2 py-0.5 rounded tracking-wider">SMARTPHONE</span>
              </div>
            </div>

            {/* 3. WI-FI ROUTER - Network Hub (Bottom Right) */}
            <div className="absolute w-[130px] h-[110px] sm:w-[170px] sm:h-[140px] md:w-[200px] md:h-[160px] z-10 right-[2%] bottom-[5%] animate-float-4 transition-all duration-300">
              <div className="w-full h-full rounded-2xl overflow-hidden border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)] bg-[#030712] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=600&auto=format&fit=crop&q=80" 
                  alt="High-speed router" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-2 left-3 bg-cyan-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 font-mono text-[9px] font-bold px-2 py-0.5 rounded tracking-wider">WI-FI ROUTER</span>
              </div>
            </div>

            {/* 4. CHARGER - GaN Block (Top Right) */}
            <div className="absolute w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[130px] md:h-[130px] z-30 right-[5%] top-[8%] animate-float-3 transition-all duration-300">
              <div className="w-full h-full rounded-2xl overflow-hidden border border-amber-500/40 shadow-[0_0_18px_rgba(245,158,11,0.25)] bg-[#030712] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80" 
                  alt="Fast GaN charger" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-2 left-3 bg-amber-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 font-mono text-[9px] font-bold px-2 py-0.5 rounded tracking-wider">FAST CHARGER</span>
              </div>
            </div>

            {/* 5. EARPHONES - Audio Portal (Bottom Left) */}
            <div className="absolute w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[130px] md:h-[130px] z-30 left-[5%] bottom-[8%] animate-float-5 transition-all duration-300">
              <div className="w-full h-full rounded-2xl overflow-hidden border border-fuchsia-500/40 shadow-[0_0_18px_rgba(217,70,239,0.25)] bg-[#030712] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80" 
                  alt="Hi-Fi Earphones" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-2 left-3 bg-fuchsia-950/80 backdrop-blur-md text-fuchsia-300 border border-fuchsia-500/30 font-mono text-[9px] font-bold px-2 py-0.5 rounded tracking-wider">EARPHONES</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. VALUE PROPOSITIONS ROW (Centered, matching the screenshot with 6 items) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-6 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-gray-100 dark:divide-slate-800">
          {valueProps.map((prop, idx) => {
            const IconComponent = prop.icon;
            return (
              <div 
                key={idx} 
                className={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 p-2.5 sm:p-2 ${
                  idx >= 2 ? 'pt-4 sm:pt-2' : ''
                } ${idx >= 3 ? 'sm:border-t lg:border-t-0 lg:pt-2' : ''} ${
                  idx > 0 ? 'lg:pl-5' : ''
                }`}
              >
                <div className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 p-2.5 rounded-lg shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight leading-tight">
                    {prop.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 dark:text-slate-400 mt-0.5 truncate">
                    {prop.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. POPULAR CATEGORIES (Horizontal layout matching the screenshot exactly) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h2 className="font-display font-extrabold text-lg text-slate-900 dark:text-white tracking-wide uppercase">
            POPULAR CATEGORIES
          </h2>
          <div className="w-12 h-1 bg-blue-600 mt-1.5 rounded-full" />
        </div>

        {/* Responsive grid mapping for the 10 popular categories */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3.5">
          {popularCategories.map((cat, i) => {
            const CatIcon = cat.icon;
            return (
              <div
                key={i}
                onClick={() => onNavigate('shop')}
                className="bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800/80 p-4 rounded-xl shadow-sm flex flex-col items-center text-center cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-11 h-11 rounded-full bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-50 transition-transform duration-200 shrink-0">
                  <CatIcon className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>





      {/* 4. FEATURED PRODUCTS (With direct local store warranty) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-end justify-between mb-6 border-b border-gray-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white uppercase tracking-wide">
              FEATURED PRODUCTS
            </h2>
            <p className="text-xs text-gray-400 dark:text-slate-400 mt-1">Highly requested technology devices with direct local store warranty</p>
          </div>
          <button 
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0 cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic products mapping with clean display styling */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {featured.map((prod) => (
            <div 
              key={prod.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-gray-200 dark:hover:border-slate-700 transition-all duration-200 group"
            >
              {/* Image box */}
              <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
                <img 
                  src={prod.image} 
                  alt={prod.name}
                  onClick={() => onSelectProduct(prod)}
                  className="object-contain max-h-full max-w-full cursor-pointer group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                
                <button
                  onClick={() => onAddToWishlist(prod)}
                  className="absolute top-2.5 right-2.5 p-2 bg-white/90 dark:bg-slate-850/90 hover:bg-white dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500 hover:text-rose-500 rounded-full shadow-sm transition-colors cursor-pointer z-10"
                  title="Add to wishlist"
                >
                  <Heart className="w-4 h-4" />
                </button>
                
                {prod.oldPrice && (
                  <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Sale
                  </span>
                )}
              </div>

              {/* Info text */}
              <div className="p-4 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900 border-t border-gray-50 dark:border-slate-800/80">
                <div>
                  <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase">{prod.category}</span>
                  <h3 
                    onClick={() => onSelectProduct(prod)}
                    className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {prod.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1.5">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star 
                          key={idx} 
                          className={`w-3 h-3 ${idx < Math.floor(prod.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 dark:text-slate-700'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">({prod.reviewsCount})</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                      KSh {prod.price.toLocaleString()}
                    </span>
                    {prod.oldPrice && (
                      <span className="text-[10px] text-gray-400 dark:text-slate-500 line-through font-mono">
                        KSh {prod.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onAddToCart(prod)}
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
