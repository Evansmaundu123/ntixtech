import React, { useState } from 'react';
import { Check, Calendar as CalendarIcon, Upload, User, CreditCard, ChevronRight, AlertCircle, FileText, Wifi, Printer, Copy, Cpu } from 'lucide-react';
import { Service, Booking } from '../types';

interface CustomerBookingProps {
  services: Service[];
  initialSelectedService?: Service | null;
  user: any;
  onBookingComplete: (booking: Booking) => void;
  onNavigate: (view: string) => void;
}

export default function CustomerBooking({
  services,
  initialSelectedService,
  user,
  onBookingComplete,
  onNavigate
}: CustomerBookingProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(
    initialSelectedService || services[1] // defaults to Printing Services as a good standard
  );
  const [date, setDate] = useState('2026-07-15');
  const [time, setTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [custName, setCustName] = useState(user ? user.fullName : 'John Doe');
  const [custEmail, setCustEmail] = useState(user ? user.email : 'maunduevans2004@gmail.com');
  const [custPhone, setCustPhone] = useState(user ? user.phone : '0111915606');
  const [paymentMethod, setPaymentMethod] = useState<'M-PESA' | 'Card'>('M-PESA');
  const [dragActive, setDragActive] = useState(false);

  const stepsList = [
    { num: 1, name: 'Choose Service' },
    { num: 2, name: 'Date & Time' },
    { num: 3, name: 'Upload Files' },
    { num: 4, name: 'Your Details' },
    { num: 5, name: 'Payment' },
    { num: 6, name: 'Confirmation' }
  ];

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', 
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const names = Array.from(e.dataTransfer.files).map((f: any) => f.name);
      setUploadedFiles([...uploadedFiles, ...names]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const names = Array.from(e.target.files).map((f: any) => f.name);
      setUploadedFiles([...uploadedFiles, ...names]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, idx) => idx !== index));
  };

  const handleNext = () => {
    if (step === 1 && !selectedService) {
      alert('Please choose a service to proceed.');
      return;
    }
    if (step === 5) {
      // Trigger booking save
      const refId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking: Booking = {
        id: refId,
        serviceId: selectedService?.id || 'general',
        serviceName: selectedService?.name || 'General Service Inquiry',
        customerName: custName,
        customerEmail: custEmail,
        customerPhone: custPhone,
        date,
        time,
        status: 'Confirmed',
        notes: notes,
        files: uploadedFiles
      };
      onBookingComplete(newBooking);
    }
    setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="w-full bg-slate-50 py-8 font-sans flex-1" id="customer-booking">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Booking Card Frame */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
          
          {/* Steps Progress Sidebar (left pane) */}
          <div className="bg-[#030712] text-white p-6 md:col-span-1 flex flex-col justify-between border-r border-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.1),transparent_50%)] pointer-events-none" />
            <div className="space-y-6 relative z-10">
              <h2 className="font-display font-bold text-sm tracking-wider uppercase text-cyan-400">Step Progress</h2>
              <div className="space-y-4">
                {stepsList.map((st) => (
                  <div key={st.num} className="flex items-center gap-3">
                    <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                      step > st.num 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-transparent text-white' 
                        : step === st.num 
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 font-bold scale-105 filter drop-shadow-[0_0_4px_rgba(6,182,212,0.4)]' 
                          : 'border-slate-800 text-slate-600'
                    }`}>
                      {step > st.num ? <Check className="w-3.5 h-3.5" /> : st.num}
                    </div>
                    <span className={`text-[11px] font-semibold tracking-wide ${
                      step === st.num ? 'text-white font-bold' : step > st.num ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {st.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 text-[10px] text-slate-500 font-medium">
              <p>Need custom rates?</p>
              <a href="tel:+254712345678" className="text-blue-400 font-bold hover:underline">+254 712 345 678</a>
            </div>
          </div>

          {/* Form Content Pane (right 3 cols) */}
          <div className="p-6 sm:p-8 md:col-span-3 flex flex-col justify-between">
            
            <div>
              {/* Step 1: Choose Service */}
              {step === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <h2 className="font-display font-bold text-base text-slate-900">Choose Service</h2>
                    <p className="text-xs text-gray-400 mt-1">Select the technology service you require to continue</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-72 overflow-y-auto pr-1">
                    {services.map((serv) => (
                      <div
                        key={serv.id}
                        onClick={() => setSelectedService(serv)}
                        className={`p-4 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[100px] select-none ${
                          selectedService?.id === serv.id
                            ? 'border-cyan-500 bg-cyan-50/30 ring-1 ring-cyan-500 shadow-sm'
                            : 'border-gray-100 bg-white hover:border-cyan-200 hover:shadow-sm'
                        }`}
                      >
                        <span className="text-2xl mb-1.5 filter drop-shadow-sm">
                          {serv.icon === 'Wifi' ? '🌐' : serv.icon === 'Printer' ? '🖨️' : serv.icon === 'Copy' ? '📄' : serv.icon === 'Cpu' ? '💻' : '⚙️'}
                        </span>
                        <h4 className="text-[11px] font-bold text-slate-800 leading-snug line-clamp-2">{serv.name}</h4>
                        <span className="text-[9px] text-gray-400 mt-1 font-semibold">{serv.priceDetails}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <h2 className="font-display font-bold text-base text-slate-900">Date & Time</h2>
                    <p className="text-xs text-gray-400 mt-1">Select your preferred date and convenient time slot</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">Select Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-mono"
                        />
                        <CalendarIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">Preferred Time Slot</label>
                      <div className="grid grid-cols-3 gap-2 max-h-[180px] overflow-y-auto pr-1">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setTime(slot)}
                            className={`py-1.5 rounded-lg text-[10px] font-bold font-mono border transition-all ${
                              time === slot
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-white border-gray-200 text-slate-600 hover:border-gray-400'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Upload Files */}
              {step === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <h2 className="font-display font-bold text-base text-slate-900">Upload Files</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Upload PDFs, images, or documents for printing, graphic design or firmware files (optional)
                    </p>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                      dragActive ? 'border-blue-600 bg-blue-50/20' : 'border-gray-200 hover:border-blue-500'
                    }`}
                  >
                    <input
                      type="file"
                      multiple
                      id="booking-file-upload"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="booking-file-upload" className="cursor-pointer w-full flex flex-col items-center justify-center">
                      <Upload className="w-10 h-10 text-slate-400 mb-3" />
                      <p className="text-xs font-bold text-slate-800">Drag and drop your files here</p>
                      <p className="text-[10px] text-gray-400 mt-1">or click to browse from your device</p>
                    </label>
                  </div>

                  {/* Uploaded files list */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Selected Files ({uploadedFiles.length})</h4>
                      <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
                        {uploadedFiles.map((name, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2 rounded-lg text-xs">
                            <div className="flex items-center gap-2 overflow-hidden text-slate-700">
                              <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="truncate max-w-[200px] font-mono text-[11px]">{name}</span>
                            </div>
                            <button
                              onClick={() => removeFile(i)}
                              className="text-red-500 hover:text-red-700 font-bold px-1.5 cursor-pointer text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Your Details */}
              {step === 4 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <h2 className="font-display font-bold text-base text-slate-900">Your Details</h2>
                    <p className="text-xs text-gray-400 mt-1">Please provide correct contact information so we can coordinate your request</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name *</label>
                      <input
                        type="text"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Phone Number *</label>
                      <input
                        type="text"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="e.g. +254 712 345 678"
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address *</label>
                      <input
                        type="email"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        placeholder="e.g. user@domain.com"
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                        required
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Additional Instructions / Notes</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        placeholder="Explain any details, pages count, design dimensions or computer hardware parameters here..."
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Payment */}
              {step === 5 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <h2 className="font-display font-bold text-base text-slate-900">Confirm & Pay</h2>
                    <p className="text-xs text-gray-400 mt-1">Review the service booking sum and choose a convenient payment gateway</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-500">Service selected:</span>
                      <span className="font-bold text-slate-900">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-500">Schedule Date/Time:</span>
                      <span className="font-bold text-slate-900 font-mono">{date} @ {time}</span>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500">Files attached:</span>
                        <span className="font-mono bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{uploadedFiles.length} file(s)</span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-3.5 flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">Booking Cost:</span>
                      <span className="font-bold text-blue-600 font-mono">
                        {selectedService?.id === 'serv-printing' ? 'KSh 150 (est)' : selectedService?.priceDetails}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Option */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Select Payment Gateway</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer select-none ${
                        paymentMethod === 'M-PESA' ? 'border-green-600 bg-green-50/20' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-600 text-white font-black text-[10px] flex items-center justify-center">M</div>
                          <span className="text-xs font-bold text-slate-800">M-PESA</span>
                        </div>
                        <input
                          type="radio"
                          name="booking-payment"
                          checked={paymentMethod === 'M-PESA'}
                          onChange={() => setPaymentMethod('M-PESA')}
                          className="text-green-600 focus:ring-green-500 w-4 h-4"
                        />
                      </label>

                      <label className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer select-none ${
                        paymentMethod === 'Card' ? 'border-blue-600 bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-bold text-slate-800">Card Payment</span>
                        </div>
                        <input
                          type="radio"
                          name="booking-payment"
                          checked={paymentMethod === 'Card'}
                          onChange={() => setPaymentMethod('Card')}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Confirmation */}
              {step === 6 && (
                <div className="text-center space-y-5 py-6 animate-fadeIn">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-lg text-slate-900">Booking Confirmed!</h2>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      Your tech hub slot has been logged in our databases. We will coordinate via SMS/email shortly.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 max-w-xs mx-auto text-xs space-y-2 text-left font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ref ID:</span>
                      <span className="font-bold text-slate-800">BK-{Math.floor(1000 + Math.random() * 9000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Service:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[120px]">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Schedule:</span>
                      <span className="font-bold text-slate-800">{date} @ {time}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onNavigate('user-dashboard')}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      Go to My Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Nav controls */}
            {step < 6 && (
              <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-6">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 1}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    step === 1 
                      ? 'text-gray-300 pointer-events-none' 
                      : 'text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer'
                  }`}
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer uppercase tracking-wider border border-cyan-400/10"
                >
                  <span>{step === 5 ? 'Place Booking' : 'Next Step'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
