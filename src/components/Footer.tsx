import React from 'react';
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#030712] text-gray-300 font-sans mt-auto border-t border-gray-950" id="app-footer">
      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        
        {/* Column 1: About */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">
            ABOUT NTIX TECH SOLUTIONS
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            We provide top-notch electronics, cyber services, computer repairs, and IT solutions.
            Our mission is to deliver quality, reliability, and excellent customer satisfaction.
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center gap-2.5 pt-2">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all hover:scale-105"
              title="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-all hover:scale-105"
              title="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center transition-all hover:scale-105"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://wa.me/254111915606" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-all hover:scale-105"
              title="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">
            QUICK LINKS
          </h3>
          <ul className="space-y-2 text-xs text-gray-400">
            <li><a href="#customer-home" className="hover:text-blue-400 transition-colors">Home</a></li>
            <li><a href="#customer-shop" className="hover:text-blue-400 transition-colors">Shop</a></li>
            <li><a href="#services" className="hover:text-blue-400 transition-colors">Services</a></li>
            <li><a href="#repairs" className="hover:text-blue-400 transition-colors">Repairs</a></li>
            <li><a href="#cctv" className="hover:text-blue-400 transition-colors">CCTV Installation</a></li>
            <li><a href="#blog" className="hover:text-blue-400 transition-colors">Blog</a></li>
          </ul>
        </div>

        {/* Column 3: Customer Service */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">
            CUSTOMER SERVICE
          </h3>
          <ul className="space-y-2 text-xs text-gray-400">
            <li><a href="#track-repair" className="hover:text-blue-400 transition-colors">Track Repair</a></li>
            <li><a href="#book-service" className="hover:text-blue-400 transition-colors">Book a Service</a></li>
            <li><a href="#shipping" className="hover:text-blue-400 transition-colors">Shipping & Delivery</a></li>
            <li><a href="#returns" className="hover:text-blue-400 transition-colors">Returns & Refunds</a></li>
            <li><a href="#faqs" className="hover:text-blue-400 transition-colors">FAQs</a></li>
            <li><a href="#support" className="hover:text-blue-400 transition-colors">Support Center</a></li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">
            CONTACT INFORMATION
          </h3>
          <ul className="space-y-3 text-xs text-gray-400">
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <a href="tel:0111915606" className="hover:text-blue-400 transition-colors">0111915606</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <a href="mailto:maunduevans2004@gmail.com" className="hover:text-blue-400 transition-colors">
                maunduevans2004@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>Kibwezi, Makueni - Kenya</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
            </li>
          </ul>
        </div>

        {/* Column 5: Newsletter */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">
            NEWSLETTER
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Subscribe to get updates on new products, offers and services.
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing to our newsletter!');
              (e.target as HTMLFormElement).reset();
            }}
            className="flex flex-col gap-2 mt-2"
          >
            <input 
              type="email" 
              required
              placeholder="Enter your email" 
              className="w-full px-3.5 py-2 text-xs bg-white text-slate-900 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="w-full bg-[#02040a] border-t border-gray-950 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left text-xs text-gray-500">
          <p>© 2024 NTIX TECH SOLUTIONS. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <a href="#privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</a>
            <span>|</span>
            <a href="#refund" className="hover:text-blue-400 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
