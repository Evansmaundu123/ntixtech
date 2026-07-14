import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, Wrench, ShieldCheck, HelpCircle } from 'lucide-react';
import { Repair } from '../types';

interface CustomerRepairTrackingProps {
  repairs: Repair[];
}

export default function CustomerRepairTracking({ repairs }: CustomerRepairTrackingProps) {
  const [trackingId, setTrackingId] = useState('RP123456'); // Defaults to the ID in the screenshot
  const [activeRepair, setActiveRepair] = useState<Repair | null>(
    repairs.find(r => r.id === 'RP123456') || null
  );
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const found = repairs.find(
      (r) => r.id.toLowerCase() === trackingId.trim().toLowerCase()
    );

    if (found) {
      setActiveRepair(found);
    } else {
      setActiveRepair(null);
      setError(`No repair found with Tracking ID "${trackingId}".`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full bg-slate-50 py-12 font-sans flex-1" id="customer-repair-tracking">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 text-center max-w-2xl mx-auto mb-8">
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">Track Your Repair</h1>
          <p className="text-xs text-gray-400 mt-1">Enter your tracking ID to get the latest real-time service log updates</p>

          <form onSubmit={handleTrack} className="mt-6 flex gap-2.5 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="e.g. RP123456, RP987654"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 pl-4 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-mono text-sm uppercase tracking-wider font-bold"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-200 cursor-pointer tracking-wider uppercase shrink-0"
            >
              TRACK
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-[11px] font-bold mt-3">{error}</p>
          )}

          {/* Helper tags to guide testing */}
          <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-400">
            <span>Try testing default IDs:</span>
            {repairs.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setTrackingId(r.id);
                  setActiveRepair(r);
                  setError('');
                }}
                className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-bold px-2 py-0.5 rounded transition-all cursor-pointer font-mono"
              >
                {r.id}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking Details Display Grid */}
        {activeRepair && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-fadeIn">
            
            {/* Left Card: Repair Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h3 className="font-display font-bold text-sm text-slate-900 pb-2.5 border-b border-gray-50 uppercase tracking-wider">Repair Details</h3>

              <div className="space-y-4 text-xs font-medium">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Tracking ID</span>
                  <span className="font-mono font-bold text-slate-800 tracking-wider">{activeRepair.id}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Customer Name</span>
                  <span className="font-bold text-slate-800">{activeRepair.customerName}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Device</span>
                  <span className="font-bold text-slate-800">{activeRepair.device}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Reported Issue</span>
                  <span className="font-bold text-slate-600 truncate max-w-[200px]" title={activeRepair.issue}>
                    {activeRepair.issue}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(activeRepair.status)}`}>
                    {activeRepair.status}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Received On</span>
                  <span className="font-mono font-bold text-slate-800">{activeRepair.receivedOn}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Estimated Delivery</span>
                  <span className="font-mono font-bold text-slate-800">{activeRepair.estimatedDelivery}</span>
                </div>
              </div>
            </div>

            {/* Right Card: Repair Status timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h3 className="font-display font-bold text-sm text-slate-900 pb-2.5 border-b border-gray-50 uppercase tracking-wider">Repair Status Log</h3>

              <div className="relative pl-6 border-l-2 border-dashed border-gray-100 space-y-6.5">
                {activeRepair.history.map((step, idx) => {
                  // Determine status styling
                  const isDone = step.completed;
                  const isCurrent = isDone && (!activeRepair.history[idx + 1] || !activeRepair.history[idx + 1].completed);

                  return (
                    <div key={idx} className="relative text-xs">
                      {/* Status timeline node dot */}
                      <div className={`absolute -left-9.5 top-0.5 rounded-full w-6.5 h-6.5 flex items-center justify-center transition-all ${
                        isCurrent 
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : isDone 
                            ? 'bg-green-600 text-white' 
                            : 'bg-slate-100 border border-slate-200 text-slate-400'
                      }`}>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className={`font-bold ${isCurrent ? 'text-blue-600' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.title}
                        </h4>
                        {step.date !== 'Pending' ? (
                          <p className="text-[10px] text-gray-400 mt-1 font-mono">
                            {step.date} · {step.time}
                          </p>
                        ) : (
                          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">
                            Pending
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer notification */}
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-[10px] text-blue-700 font-medium flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>You will receive an automated SMS & Email notification on your phone ({activeRepair.customerPhone}) immediately when your device passes quality checks.</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
