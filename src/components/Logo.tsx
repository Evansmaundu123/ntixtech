import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  textClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
}

export default function Logo({
  className = '',
  textClassName = '',
  size = 'md',
  hideText = false
}: LogoProps) {
  const [imgError, setImgError] = useState(false);

  // Core logo image generated via AI Studio image generator
  const logoSrc = '/src/assets/images/ntix_logo_1783968836387.jpg';

  const sizeClasses = {
    sm: {
      box: 'w-8 h-8 rounded-lg',
      text: 'text-sm font-black tracking-wide',
      sub1: 'text-[7px] tracking-wide',
      sub2: 'text-[6px] tracking-widest'
    },
    md: {
      box: 'w-12 h-12 rounded-xl',
      text: 'text-xl font-extrabold tracking-tight',
      sub1: 'text-[9px] tracking-wider font-semibold',
      sub2: 'text-[7px] tracking-widest font-mono font-medium'
    },
    lg: {
      box: 'w-16 h-16 rounded-2xl',
      text: 'text-2xl font-black tracking-tighter',
      sub1: 'text-[11px] tracking-widest font-bold',
      sub2: 'text-[8.5px] tracking-[0.2em] font-mono font-semibold'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`} id="ntix-brand-logo">
      {/* Logo Icon Wrapper */}
      <div className={`relative ${currentSize.box} flex items-center justify-center bg-[#030712] border border-cyan-500/50 overflow-hidden shadow-md shadow-cyan-950/40 shrink-0 rounded-xl hover:border-purple-500/50 hover:shadow-purple-950/30 transition-all duration-300`}>
        {!imgError ? (
          <img
            src={logoSrc}
            alt="NTIX Logo"
            className="w-full h-full object-cover scale-[1.05]"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          /* High Fidelity SVG Fallback that mimics the shield mockup exactly if image fails */
          <svg
            className="w-4/5 h-4/5"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer glow aura */}
            <circle cx="50" cy="50" r="40" fill="url(#shield-aura)" opacity="0.15" />
            
            {/* Main Shield Path */}
            <path
              d="M50 15C59 15 78 20 78 20C78 20 80 50 72 70C64 90 50 95 50 95C50 95 36 90 28 70C20 50 22 20 22 20C22 20 41 15 50 15Z"
              fill="#030712"
              stroke="url(#shield-stroke)"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            
            {/* Glowing Inner Shield Design */}
            <path
              d="M50 22C57 22 71 26 71 26C71 26 73 48 66 64C59 80 50 84 50 84C50 84 41 80 34 64C27 48 29 26 29 26C29 26 43 22 50 22Z"
              fill="#030712"
              stroke="url(#inner-shield-stroke)"
              strokeWidth="2"
              opacity="0.8"
            />
            
            {/* Cyber circuit trace in right half */}
            <path d="M51 32H63V44M51 48H57V58H61" stroke="#00f0ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            
            {/* Metallic Letter N inside shield */}
            <path
              d="M38 72V35L62 68V28"
              stroke="url(#letter-gradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <defs>
              <radialGradient id="shield-aura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#a855f7" stopColorOpacity="0" />
              </radialGradient>
              <linearGradient id="shield-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="40%" stopColor="#0066ff" />
                <stop offset="70%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="inner-shield-stroke" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="letter-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      {/* Brand Text */}
      {!hideText && (
        <div className="flex flex-col text-left justify-center">
          <div className="flex items-center gap-0.5">
            <span className={`font-sans font-black leading-none tracking-tight ${currentSize.text}`}>
              <span className="bg-gradient-to-r from-[#00f0ff] via-[#3b82f6] to-[#0055ff] bg-clip-text text-transparent filter drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">NTI</span>
              <span className="bg-gradient-to-r from-[#a855f7] via-[#c084fc] to-[#e879f9] bg-clip-text text-transparent filter drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">X</span>
            </span>
          </div>
          <span className={`font-bold uppercase mt-0.5 leading-none block text-[8px] sm:text-[9.5px] tracking-[0.18em] ${
            textClassName.includes('text-[#050b1d]') || textClassName.includes('text-slate-900')
              ? 'text-slate-700'
              : 'text-slate-400'
          }`}>
            TECH SOLUTIONS
          </span>
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent font-black uppercase tracking-[0.22em] mt-0.5 leading-none block font-mono text-[7px] sm:text-[8px] filter drop-shadow-[0_0_4px_rgba(34,211,238,0.15)]">
            CYBER SERVICES
          </span>
          <div className="mt-1 flex items-center">
            <span className="text-[7px] sm:text-[7.5px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-500/20 dark:border-amber-400/20 leading-none">
              BIGWA SOKONI
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
