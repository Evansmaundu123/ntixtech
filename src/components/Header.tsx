import React, { useState } from 'react';
import { Search, ShoppingCart, Heart, User, MapPin, Phone, Mail, Menu, X, LogOut, ShieldAlert, Calendar, ClipboardCheck, ChevronDown, Sparkles, Sun, Moon } from 'lucide-react';
import { CartItem } from '../types';
import Logo from './Logo';

interface HeaderProps {
  activeView: string;
  onNavigate: (view: string) => void;
  cart: CartItem[];
  wishlistCount: number;
  user: any;
  onLogout: () => void;
  onSearch?: (query: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({
  activeView,
  onNavigate,
  cart,
  wishlistCount,
  user,
  onLogout,
  onSearch,
  isDarkMode,
  toggleDarkMode
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    onNavigate('shop');
  };

  return (
    <header className="w-full bg-white dark:bg-[#070b14] font-sans shrink-0 border-b border-gray-100 dark:border-slate-800/80 transition-colors" id="app-header">
      
      {/* Top Bar Removed per User Intent */}

      {/* 2. MAIN HEADER ROW (White background, with Search and Wishlist/Cart) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        
        {/* Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="cursor-pointer shrink-0"
        >
          <Logo size="md" textClassName="text-[#050b1d] dark:text-white" />
        </div>

        {/* Search Bar - Matching Mockup exactly */}
        <form 
          onSubmit={handleSearchSubmit}
          className="order-last md:order-none w-full md:flex-1 max-w-2xl bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 rounded-lg flex items-stretch overflow-hidden shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500"
        >
          {/* Dropdown Category */}
          <div className="relative flex items-center bg-gray-50 dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800/60 px-3.5 shrink-0 select-none">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-transparent border-none pr-6 pl-0 py-2 focus:ring-0 cursor-pointer focus:outline-none appearance-none"
            >
              <option value="All Categories" className="dark:bg-slate-950 dark:text-slate-100">All Categories</option>
              <option value="Laptops" className="dark:bg-slate-950 dark:text-slate-100">Laptops</option>
              <option value="Desktops" className="dark:bg-slate-950 dark:text-slate-100">Desktops</option>
              <option value="Phones" className="dark:bg-slate-950 dark:text-slate-100">Phones</option>
              <option value="Accessories" className="dark:bg-slate-950 dark:text-slate-100">Accessories</option>
              <option value="Networking" className="dark:bg-slate-950 dark:text-slate-100">Networking</option>
              <option value="Printers" className="dark:bg-slate-950 dark:text-slate-100">Printers</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search for products or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none bg-transparent"
          />

          {/* Search Button */}
          <button 
            type="submit"
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white px-5 flex items-center justify-center transition-all cursor-pointer shadow-sm relative group"
          >
            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </form>

        {/* Right Side Icons: Theme, Wishlist & Cart */}
        <div className="flex items-center gap-5 sm:gap-6 shrink-0">
          
          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="flex flex-col items-center justify-center text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-450 transition-colors relative group cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="relative p-1">
              {isDarkMode ? (
                <Sun className="w-5.5 h-5.5 text-amber-400 group-hover:rotate-90 transition-transform duration-500" />
              ) : (
                <Moon className="w-5.5 h-5.5 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </div>
            <span className="text-[11px] font-bold tracking-tight text-slate-800 dark:text-slate-300 mt-1">Theme</span>
          </button>

          {/* Wishlist Button with label below */}
          <button 
            onClick={() => onNavigate('user-dashboard')}
            className="flex flex-col items-center justify-center text-slate-700 dark:text-slate-300 hover:text-[#a855f7] dark:hover:text-[#c084fc] transition-colors relative group cursor-pointer"
            title="My Wishlist"
          >
            <div className="relative p-1">
              <Heart className="w-5.5 h-5.5 group-hover:scale-105 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-sm animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold tracking-tight text-slate-800 dark:text-slate-300 mt-1">Wishlist</span>
          </button>

          {/* Cart Button with label below */}
          <button 
            onClick={() => onNavigate('cart')}
            className="flex flex-col items-center justify-center text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors relative group cursor-pointer"
            title="Shopping Cart"
          >
            <div className="relative p-1">
              <ShoppingCart className="w-5.5 h-5.5 group-hover:scale-105 transition-transform" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-sm">
                  {totalCartItems}
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold tracking-tight text-slate-800 dark:text-slate-300 mt-1">Cart</span>
          </button>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. MENU NAVIGATION BAR ROW (Solid dark blue with Home active status) */}
      <div className="w-full bg-[#0a1128] border-t border-b border-slate-900 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            
            {/* HOME */}
            <button
              onClick={() => onNavigate('home')}
              className={`text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 transition-all cursor-pointer ${
                activeView === 'home' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border-b-2 border-cyan-400' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              HOME
            </button>

            {/* BIGWA SOKONI */}
            <button
              onClick={() => onNavigate('bigwa-sokoni')}
              className={`text-[11px] font-black uppercase tracking-wider px-4 py-3.5 flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'bigwa-sokoni' 
                  ? 'bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 text-white shadow-md border-b-2 border-amber-300' 
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/50'
              }`}
            >
              <span className="animate-pulse">🔥</span>
              <span>BIGWA SOKONI</span>
            </button>

            {/* SHOP v */}
            <button
              onClick={() => onNavigate('shop')}
              className={`text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 flex items-center gap-1 transition-all cursor-pointer ${
                activeView === 'shop' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border-b-2 border-cyan-400' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>SHOP</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* SERVICES v */}
            <button
              onClick={() => onNavigate('services')}
              className={`text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 flex items-center gap-1 transition-all cursor-pointer ${
                activeView === 'services' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border-b-2 border-cyan-400' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>SERVICES</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* REPAIRS v */}
            <button
              onClick={() => onNavigate('repair-tracking')}
              className={`text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 flex items-center gap-1 transition-all cursor-pointer ${
                activeView === 'repair-tracking' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border-b-2 border-cyan-400' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>REPAIRS</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* CYBER CAFE */}
            <button
              onClick={() => {
                onNavigate('services');
                setTimeout(() => {
                  const el = document.getElementById('cyber-services-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 text-gray-300 hover:text-white hover:bg-slate-800/50 transition-all cursor-pointer"
            >
              CYBER CAFE
            </button>

            {/* BOOKINGS */}
            <button
              onClick={() => onNavigate('booking')}
              className={`text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 transition-all cursor-pointer ${
                activeView === 'booking' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border-b-2 border-cyan-400' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              BOOKINGS
            </button>

            {/* AI COPILOT */}
            <button
              onClick={() => onNavigate('ai-copilot')}
              className={`text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'ai-copilot' 
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md border-b-2 border-cyan-400' 
                  : 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI COPILOT</span>
            </button>

            {/* SOFTWARE */}
            <button
              onClick={() => {
                if (onSearch) onSearch('software');
                onNavigate('shop');
              }}
              className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 text-gray-300 hover:text-white hover:bg-slate-800/50 transition-all cursor-pointer"
            >
              SOFTWARE
            </button>

            {/* ABOUT US */}
            <button
              onClick={() => {
                const el = document.getElementById('app-footer');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 text-gray-300 hover:text-white hover:bg-slate-800/50 transition-all cursor-pointer"
            >
              ABOUT US
            </button>

            {/* CONTACT US */}
            <button
              onClick={() => {
                const el = document.getElementById('app-footer');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 text-gray-300 hover:text-white hover:bg-slate-800/50 transition-all cursor-pointer"
            >
              CONTACT US
            </button>

          </div>

          {/* Right Side: Account & Admin */}
          <div className="flex items-center gap-4 py-1.5 shrink-0 pr-4">
            {user ? (
              <div className="flex items-center gap-3 border-r border-slate-800 pr-4">
                <button 
                  onClick={() => onNavigate('user-dashboard')}
                  className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Hi, {user.fullName.split(' ')[0]}</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')} 
                className="text-[11px] font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer border-r border-slate-800 pr-4"
              >
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Login / Register</span>
              </button>
            )}

            <button 
              onClick={() => onNavigate('admin-login')} 
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-blue-400 font-semibold px-2.5 py-1 rounded transition-colors border border-slate-700/50 cursor-pointer"
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-[#070b14] px-4 py-4 space-y-2 animate-fadeIn shadow-inner text-slate-800 dark:text-slate-100 transition-colors">
          
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold ${
              activeView === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            HOME
          </button>

          <button
            onClick={() => {
              onNavigate('bigwa-sokoni');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 ${
              activeView === 'bigwa-sokoni' ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300' : 'text-orange-600 dark:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-slate-800/40'
            }`}
          >
            <span>🔥</span>
            <span>BIGWA SOKONI</span>
          </button>

          <button
            onClick={() => {
              onNavigate('shop');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold ${
              activeView === 'shop' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            SHOP
          </button>

          <button
            onClick={() => {
              onNavigate('services');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold ${
              activeView === 'services' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            SERVICES
          </button>

          <button
            onClick={() => {
              onNavigate('repair-tracking');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold ${
              activeView === 'repair-tracking' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            REPAIRS
          </button>

          <button
            onClick={() => {
              onNavigate('booking');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold ${
              activeView === 'booking' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            BOOKINGS
          </button>

          <button
            onClick={() => {
              onNavigate('ai-copilot');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              activeView === 'ai-copilot' ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300' : 'text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
            <span>AI COPILOT (CHAT & SEARCH)</span>
          </button>

          {/* Mobile Dark Theme Switcher Toggle */}
          <button
            onClick={() => {
              toggleDarkMode();
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-500" />
              )}
              <span>Theme: {isDarkMode ? "Dark Theme" : "Light Theme"}</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-cyan-500 font-bold bg-cyan-50 dark:bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-100 dark:border-cyan-900/50">
              Toggle
            </span>
          </button>

          {/* Mobile User/Admin Options */}
          <div className="pt-4 border-t border-gray-100 mt-4 space-y-2">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
                <button 
                  onClick={() => {
                    onNavigate('user-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-blue-600 flex items-center gap-1.5"
                >
                  <User className="w-4 h-4" />
                  <span>Hi, {user.fullName}</span>
                </button>
                <button 
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-blue-500" />
                <span>Login / Register</span>
              </button>
            )}

            <button
              onClick={() => {
                onNavigate('admin-login');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
