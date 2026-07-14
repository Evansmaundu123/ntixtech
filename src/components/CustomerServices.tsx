import React from 'react';
import { Wifi, Printer, Copy, FileText, Cpu, MonitorCheck, Gamepad2, Palette, Video, Network, HardDrive, PlusCircle, Phone } from 'lucide-react';
import { Service } from '../types';

interface CustomerServicesProps {
  services: Service[];
  onBookService: (service: Service) => void;
  onContactSupport: () => void;
}

export default function CustomerServices({
  services,
  onBookService,
  onContactSupport
}: CustomerServicesProps) {

  // Map icon strings to actual Lucide component icons
  const getIcon = (iconName: string, className: string = '') => {
    switch (iconName) {
      case 'Wifi': return <Wifi className={className} />;
      case 'Printer': return <Printer className={className} />;
      case 'Copy': return <Copy className={className} />;
      case 'FileText': return <FileText className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'MonitorCheck': return <MonitorCheck className={className} />;
      case 'Gamepad2': return <Gamepad2 className={className} />;
      case 'Palette': return <Palette className={className} />;
      case 'Video': return <Video className={className} />;
      case 'Network': return <Network className={className} />;
      case 'HardDrive': return <HardDrive className={className} />;
      default: return <PlusCircle className={className} />;
    }
  };

  return (
    <div className="w-full bg-slate-50 py-12 font-sans flex-1" id="customer-services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-display font-extrabold text-3xl text-slate-900">Our Services</h1>
          <p className="text-sm text-gray-500 mt-2">
            Professional computer, internet, graphic design, and hardware solutions to power your daily personal or business needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-cyan-500/35 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="bg-cyan-50/40 text-cyan-600 p-3 rounded-xl w-fit mb-4 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:via-blue-500 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  {getIcon(service.icon, "w-6 h-6")}
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              <div>
                <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-600 font-bold bg-cyan-50/50 px-2 py-0.5 rounded uppercase border border-cyan-200/30">
                    {service.priceDetails}
                  </span>
                  <button
                    onClick={() => onBookService(service)}
                    className="text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer px-3.5 py-1.5 rounded-lg shadow-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* More services card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between border-dashed border-2 hover:border-cyan-400 hover:bg-slate-50/50 transition-colors">
            <div>
              <div className="bg-slate-100 p-3 rounded-xl w-fit mb-4 text-slate-600">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 mb-2">More Services</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Exam registration, KRA returns filing, passport applications, laminate bindings, smart TV setups, and custom office ICT solutions.
              </p>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-end">
              <button 
                onClick={onContactSupport}
                className="text-xs font-bold text-slate-600 hover:text-cyan-600 cursor-pointer"
              >
                Inquire Support →
              </button>
            </div>
          </div>
        </div>

        {/* CTA Contact banner */}
        <div className="bg-gradient-to-r from-[#030712] via-[#091128] to-[#1e1b4b] rounded-2xl border border-cyan-500/30 p-6 md:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none" />
          <div className="text-left relative z-10">
            <h3 className="font-display font-bold text-lg text-white">Need a service not listed here?</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Our professional cyber attendants and senior systems engineers are ready to assist you. Contact us and we will be happy to assist you in any customized IT solutions!
            </p>
          </div>
          <button
            onClick={onContactSupport}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-md shadow-cyan-950/50 flex items-center gap-2 cursor-pointer uppercase tracking-wider shrink-0 border border-cyan-400/20 relative z-10"
          >
            <Phone className="w-4 h-4" />
            <span>CONTACT US</span>
          </button>
        </div>

      </div>
    </div>
  );
}
