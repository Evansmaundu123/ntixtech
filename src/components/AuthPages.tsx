import React, { useState, useEffect } from 'react';
import { ShieldCheck, Laptop, Lock, User, Phone, Mail, ArrowLeft, Key } from 'lucide-react';
import { User as UserType } from '../types';

export function getNameFromEmail(email: string): string {
  if (!email) return 'Valued Customer';
  const lowerEmail = email.toLowerCase();
  
  if (lowerEmail === 'maunduevans2004@gmail.com' || lowerEmail.includes('maunduevans')) {
    return 'Maunde Evans';
  }
  if (lowerEmail === 'john@domain.com' || lowerEmail.includes('john.doe')) {
    return 'John Doe';
  }
  
  const prefix = email.split('@')[0];
  const clean = prefix.replace(/[._\-0-9]+/g, ' ').trim();
  if (!clean) return prefix;
  
  return clean
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

interface AuthPagesProps {
  onLogin: (user: UserType) => void;
  onNavigate: (view: string) => void;
  type: 'login' | 'register' | 'admin-login';
}

export default function AuthPages({ onLogin, onNavigate, type }: AuthPagesProps) {
  // Common states
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  // Listen for Google OAuth callback message
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const oauthUser = event.data.user;
        if (oauthUser) {
          onLogin(oauthUser);
          onNavigate('user-dashboard');
        }
      } else if (event.data?.type === 'OAUTH_AUTH_FAILURE') {
        setError(event.data.error || 'Google authentication failed.');
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => {
      window.removeEventListener('message', handleOAuthMessage);
    };
  }, [onLogin, onNavigate]);

  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    setError('');
    try {
      const response = await fetch('/api/auth/google/url');
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Google OAuth credentials not configured on the server yet.');
      }
      const { url } = await response.json();

      // Open the OAuth popup
      const width = 500;
      const height = 650;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const authWindow = window.open(
        url,
        'google_oauth_popup',
        `width=${width},height=${height},top=${top},left=${left},status=0,menubar=0,toolbar=0,location=0`
      );

      if (!authWindow) {
        setError('Popup blocker active. Please allow popups for this site.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to start Google sign-in.');
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    // Default credential check for seamless test login, otherwise accept any valid formatted input
    const isSpecial = email.toLowerCase() === 'maunduevans2004@gmail.com' || email.toLowerCase() === 'john@domain.com';
    const loggedUser: UserType = {
      id: isSpecial ? (email.toLowerCase() === 'maunduevans2004@gmail.com' ? 'usr-maunduevans' : 'usr-johndoe') : `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: fullName || getNameFromEmail(email),
      email: email,
      phone: phone || '+254 712 345 678',
      isAdmin: false
    };

    onLogin(loggedUser);
    onNavigate('user-dashboard');
  };

  const handleUserRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const newUser: UserType = {
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName,
      email,
      phone,
      isAdmin: false
    };

    onLogin(newUser);
    onNavigate('user-dashboard');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('All administrative credentials are required.');
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    if (cleanEmail === 'ntixtechsolutions@gmail.com') {
      if (password !== 'Evansoboy123') {
        setError('Invalid administrative password.');
        return;
      }
    } else if (cleanEmail === 'admin@ntix.co.ke') {
      if (password !== 'masterkey') {
        setError('Invalid administrative password.');
        return;
      }
    } else {
      setError('Unauthorized administrator email address.');
      return;
    }

    const adminUser: UserType = {
      id: cleanEmail === 'ntixtechsolutions@gmail.com' ? 'usr-admin-ntix' : 'usr-admin',
      fullName: cleanEmail === 'ntixtechsolutions@gmail.com' ? 'NTIX Administrator' : 'Super Administrator',
      email: email,
      phone: '+254 711 222 333',
      isAdmin: true
    };

    onLogin(adminUser);
    onNavigate('admin-dashboard');
  };

  return (
    <div className="w-full bg-slate-50 py-12 font-sans flex-1 flex items-center justify-center" id="auth-pages">
      <div className="max-w-4xl w-full px-4 sm:px-6">
        
        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 font-bold mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* User Login Screen */}
        {type === 'login' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[500px] animate-fadeIn">
            {/* Left Info Pane */}
            <div className="bg-blue-600 p-8 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-800 pointer-events-none" />
              <div className="absolute -right-1/4 -bottom-1/4 w-3/4 h-3/4 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                <Laptop className="w-12 h-12 text-blue-200" />
                <h2 className="font-display font-extrabold text-2xl leading-tight">Welcome Back!</h2>
                <p className="text-sm text-blue-100 font-light leading-relaxed">
                  Login to your account and continue managing your technical assets, checking order logs & scheduling device repair tasks.
                </p>

                <div className="space-y-3 pt-4 text-xs font-semibold text-blue-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-blue-200 shrink-0" />
                    <span>Secure & Fast Encrypted Login</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-blue-200 shrink-0" />
                    <span>Access your orders, bookings and more</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-blue-200 shrink-0" />
                    <span>Track active repairs & cyber services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-blue-200 shrink-0" />
                    <span>Manage your personal profile settings</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 text-[10px] text-blue-200 font-medium pt-8">
                <p>© 2026 TechHub Solutions. Secure portal gate.</p>
              </div>
            </div>

            {/* Right Form Pane */}
            <div className="p-8 flex flex-col justify-center">
              <div className="max-w-sm w-full mx-auto space-y-6">
                <div className="text-left">
                  <h3 className="font-display font-extrabold text-xl text-slate-900">Login to Your Account</h3>
                  <p className="text-xs text-gray-400 mt-1">Enter email and password below to enter your dashboard</p>
                </div>

                {error && (
                  <p className="text-red-500 text-[11px] font-bold bg-red-50 p-2.5 rounded-lg border border-red-100">{error}</p>
                )}

                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Password *</label>
                      <button type="button" className="text-[10px] font-bold text-blue-600 hover:underline">Forgot Password?</button>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember-me-user"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <label htmlFor="remember-me-user" className="ml-2 text-[11px] text-gray-500 font-medium cursor-pointer">Remember me</label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-xl shadow-md transition-all uppercase tracking-wider text-center"
                  >
                    LOGIN
                  </button>
                </form>

                {/* Social logins */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Or continue with</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <button 
                      onClick={handleGoogleSignIn}
                      disabled={isLoadingGoogle}
                      type="button" 
                      className="border border-gray-200 rounded-xl py-2 px-3 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold text-slate-700 disabled:opacity-50"
                    >
                      <span className="text-red-500 font-black">G</span> {isLoadingGoogle ? '...' : 'Google'}
                    </button>
                    <button 
                      onClick={() => {
                        setEmail('maunduevans2004@gmail.com');
                        setPassword('password');
                      }}
                      type="button" 
                      className="border border-gray-200 rounded-xl py-2 px-3 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold text-slate-700"
                    >
                      <span className="text-blue-600 font-black">f</span> Facebook
                    </button>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-400 pt-2">
                  <span>Don't have an account? </span>
                  <button onClick={() => onNavigate('register')} className="text-blue-600 font-bold hover:underline">Register</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Register Screen */}
        {type === 'register' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[500px] animate-fadeIn">
            {/* Left Pane */}
            <div className="bg-blue-600 p-8 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-800 pointer-events-none" />
              <div className="absolute -right-1/4 -bottom-1/4 w-3/4 h-3/4 bg-white/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <User className="w-12 h-12 text-blue-200" />
                <h2 className="font-display font-extrabold text-2xl leading-tight">Create Account</h2>
                <p className="text-sm text-blue-100 font-light leading-relaxed">
                  Join our technology ecosystem to enjoy high speed internet credits, instant online support, repair tracking, and loyal member deals.
                </p>

                <div className="space-y-3 pt-4 text-xs font-semibold text-blue-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-blue-200 shrink-0" />
                    <span>Easy & Secure Registration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-blue-200 shrink-0" />
                    <span>Faster checkout & delivery booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-blue-200 shrink-0" />
                    <span>Track active orders and repair status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-blue-200 shrink-0" />
                    <span>Exclusive loyalty program offers & discounts</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 text-[10px] text-blue-200 font-medium pt-8">
                <p>© 2026 TechHub Solutions. Secure portal gate.</p>
              </div>
            </div>

            {/* Right Pane */}
            <div className="p-8 flex flex-col justify-center">
              <div className="max-w-sm w-full mx-auto space-y-5">
                <div className="text-left">
                  <h3 className="font-display font-extrabold text-xl text-slate-900">Create Your Account</h3>
                  <p className="text-xs text-gray-400 mt-1">Please fill in correct details to register</p>
                </div>

                {error && (
                  <p className="text-red-500 text-[11px] font-bold bg-red-50 p-2.5 rounded-lg border border-red-100">{error}</p>
                )}

                <form onSubmit={handleUserRegister} className="space-y-3">
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
                      required
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
                      required
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Phone Number *</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-mono text-slate-800"
                      required
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Password *</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Confirm Password *</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                      required
                    />
                  </div>

                  <label className="flex items-start gap-2 text-[10px] text-gray-500 font-medium cursor-pointer pt-1 leading-snug">
                    <input type="checkbox" required defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5" />
                    <span>I agree to the <strong className="text-blue-600 hover:underline">Terms & Conditions</strong> and <strong className="text-blue-600 hover:underline">Privacy Policy</strong></span>
                  </label>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-xl shadow-md transition-all uppercase tracking-wider text-center mt-2"
                  >
                    REGISTER
                  </button>
                </form>

                {/* Social logins */}
                <div className="space-y-3 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-semibold">Or register with</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  <button 
                    onClick={handleGoogleSignIn}
                    disabled={isLoadingGoogle}
                    type="button" 
                    className="w-full border border-gray-200 rounded-xl py-2.5 px-3 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer font-bold text-slate-700 disabled:opacity-50"
                  >
                    <span className="text-red-500 font-black">G</span> 
                    <span>{isLoadingGoogle ? 'Connecting Google...' : 'Register with Google'}</span>
                  </button>
                </div>

                <div className="text-center text-xs text-gray-400 pt-2">
                  <span>Already have an account? </span>
                  <button onClick={() => onNavigate('login')} className="text-blue-600 font-bold hover:underline">Login</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Login Screen */}
        {type === 'admin-login' && (
          <div className="bg-[#030712] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[500px] animate-fadeIn">
            {/* Left Admin Access Pane */}
            <div className="bg-[#0a122c] p-8 text-white flex flex-col justify-between relative overflow-hidden border-r border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-br from-[#020617] to-[#1e1b4b] pointer-events-none opacity-50" />
              
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="font-display font-extrabold text-2xl leading-tight">Admin Access</h2>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Secure access gate for administrators, staff and senior technical engineers. System activity is cryptographically logged.
                </p>

                <div className="space-y-3.5 pt-4 text-[11px] font-semibold text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>100% Cryptographically Secure & Protected</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>Manage Storefront Products & Orders</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>Track Cyber Café Services & Repairs</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>View Real-time Activity Logs & Reports</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 text-[9px] text-slate-500 font-mono pt-8">
                <p>NTIX TECH SOLUTIONS · ADMINISTRATIVE SERVICES</p>
              </div>
            </div>

            {/* Right Admin Form Pane */}
            <div className="p-8 flex flex-col justify-center bg-[#070b19]">
              <div className="max-w-sm w-full mx-auto space-y-6">
                <div className="text-left">
                  <h3 className="font-display font-extrabold text-xl text-white">Admin Login</h3>
                  <p className="text-xs text-slate-400 mt-1">Provide administrator credentials to gain portal entry</p>
                </div>

                {error && (
                  <p className="text-red-400 text-[11px] font-bold bg-red-950/20 p-2.5 rounded-lg border border-red-900/40">{error}</p>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Username</label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter admin username / email"
                      className="w-full p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-white placeholder-slate-600 font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter secret pass"
                      className="w-full p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-white placeholder-slate-600 font-mono"
                      required
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <label className="flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span className="ml-1.5">Remember session</span>
                    </label>
                    <button type="button" className="hover:underline">Reset keys</button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-xl shadow-lg shadow-blue-900/25 transition-all uppercase tracking-wider font-mono cursor-pointer"
                  >
                    LOGIN TO PORTAL
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
