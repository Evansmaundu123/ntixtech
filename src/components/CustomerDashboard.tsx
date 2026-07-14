import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Calendar, Wrench, Heart, 
  MapPin, CreditCard, Settings, LogOut, ExternalLink, 
  ShieldAlert, Bell, Mail, Check, User, Pencil, Phone, X
} from 'lucide-react';
import { Order, Booking, Repair, Product, User as UserType } from '../types';

interface CustomerDashboardProps {
  user: UserType;
  orders: Order[];
  bookings: Booking[];
  repairs: Repair[];
  wishlist: Product[];
  onLogout: () => void;
  onNavigate: (view: string) => void;
  onUpdateProfile?: (updatedUser: UserType) => void;
}

export default function CustomerDashboard({
  user,
  orders,
  bookings,
  repairs,
  wishlist,
  onLogout,
  onNavigate,
  onUpdateProfile
}: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load initial states from localStorage with user email prefix
  const [fullName, setFullName] = useState(user?.fullName || '');
  
  // Sync local fullName when user prop changes
  React.useEffect(() => {
    if (user?.fullName) {
      setFullName(user.fullName);
    }
  }, [user]);

  const [emailBookingAlerts, setEmailBookingAlerts] = useState(() => {
    const saved = localStorage.getItem(`nt_notif_booking_${user?.email || 'anon'}`);
    return saved !== 'false'; // default to true
  });
  const [emailOrderAlerts, setEmailOrderAlerts] = useState(() => {
    const saved = localStorage.getItem(`nt_notif_order_${user?.email || 'anon'}`);
    return saved !== 'false'; // default to true
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit Profile Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);

  const openEditModal = () => {
    setEditFullName(user?.fullName || '');
    setEditEmail(user?.email || '');
    setEditPhone(user?.phone || '');
    setEditError('');
    setEditSuccess(false);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    
    if (!editFullName.trim()) {
      setEditError('Display name is required.');
      return;
    }
    if (!editEmail.trim() || !editEmail.includes('@')) {
      setEditError('Please enter a valid email address.');
      return;
    }
    if (!editPhone.trim()) {
      setEditError('Contact phone number is required.');
      return;
    }

    const updatedUser: UserType = {
      ...user,
      fullName: editFullName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim()
    };

    if (onUpdateProfile) {
      onUpdateProfile(updatedUser);
    }
    
    // Update local state
    setFullName(editFullName.trim());

    setEditSuccess(true);
    setTimeout(() => {
      setEditSuccess(false);
      setIsEditModalOpen(false);
    }, 1200);
  };

  const saveSettings = () => {
    localStorage.setItem(`nt_notif_booking_${user?.email || 'anon'}`, String(emailBookingAlerts));
    localStorage.setItem(`nt_notif_order_${user?.email || 'anon'}`, String(emailOrderAlerts));
    
    if (fullName && fullName !== user?.fullName) {
      user.fullName = fullName;
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-4 h-4" /> },
    { id: 'repairs', label: 'Repairs', icon: <Wrench className="w-4 h-4" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-4 h-4" /> },
    { id: 'payments', label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'settings', label: 'Account Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  // Filters user-specific records
  const userOrders = orders.filter((o) => o.email.toLowerCase() === user.email.toLowerCase());
  const userBookings = bookings.filter((b) => b.customerEmail.toLowerCase() === user.email.toLowerCase());
  const userRepairs = repairs.filter((r) => r.customerName.toLowerCase() === user.fullName.toLowerCase());

  // Aggregate user's recent activity feed (Orders, Bookings, Repairs) sorted chronologically
  const activityFeed = [
    ...userOrders.map((o) => ({
      id: `order-${o.id}`,
      type: 'order' as const,
      title: 'Hardware Order Placed',
      description: `Placed order ${o.id} containing ${o.items.map(i => i.productName).join(', ')}.`,
      date: o.date,
      time: 'M-Pesa / Card',
      status: o.status,
      badgeColor: o.status === 'Completed' || o.status === 'Delivered' 
        ? 'bg-green-50 text-green-700 border-green-200' 
        : 'bg-blue-50 text-blue-700 border-blue-200',
    })),
    ...userBookings.map((b) => ({
      id: `booking-${b.id}`,
      type: 'booking' as const,
      title: 'Service Appointment Booked',
      description: `Scheduled slot for "${b.serviceName}" under NTIX Tech solutions.`,
      date: b.date,
      time: b.time,
      status: b.status,
      badgeColor: b.status === 'Confirmed' || b.status === 'Completed'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-amber-50 text-amber-700 border-amber-200',
    })),
    ...userRepairs.map((r) => ({
      id: `repair-${r.id}`,
      type: 'repair' as const,
      title: 'Hardware Repair Lodged',
      description: `Lodged a ${r.device} repair request for issue: "${r.issue}".`,
      date: r.receivedOn,
      time: `Estimated: ${r.estimatedDelivery}`,
      status: r.status,
      badgeColor: r.status === 'Completed'
        ? 'bg-green-50 text-green-700 border-green-200'
        : r.status === 'In Progress'
        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
        : 'bg-slate-50 text-slate-700 border-slate-200',
    }))
  ].sort((a, b) => {
    const timeA = new Date(a.date).getTime() || 0;
    const timeB = new Date(b.date).getTime() || 0;
    return timeB - timeA;
  });

  return (
    <div className="w-full bg-slate-50 py-8 font-sans flex-1" id="customer-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Left Sidebar */}
          <div className="md:col-span-1 bg-[#0b1329] text-gray-300 rounded-2xl shadow-sm overflow-hidden border border-slate-800">
            {/* User profile brief card */}
            <div className="p-5 border-b border-slate-800 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-500/20 uppercase shrink-0">
                  {user.fullName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <h3 className="text-xs font-bold text-white truncate">{user.fullName}</h3>
                  <p className="text-[9px] text-gray-400 font-mono mt-0.5 truncate">{user.email}</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5 truncate">{user.phone || 'No phone set'}</p>
                </div>
              </div>
              <button 
                onClick={openEditModal}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-blue-400 hover:text-white rounded-lg border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer"
                id="edit-profile-sidebar-btn"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Sidebar list items */}
            <div className="p-3 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 py-2 px-3.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/10'
                      : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 py-2 px-3.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 transition-all text-left cursor-pointer mt-4"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="md:col-span-3 space-y-6">
            
            {/* Tab 1: Dashboard Home */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Welcome header */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-left">
                    <h1 className="font-display font-extrabold text-xl text-slate-900">Welcome, {user.fullName}!</h1>
                    <p className="text-xs text-gray-400 mt-1">Here's what's happening with your NTIX Tech Solutions account today.</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-[11px] font-medium text-slate-500">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {user.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {user.phone || 'No phone set'}</span>
                    </div>
                  </div>
                  <button
                    onClick={openEditModal}
                    className="sm:self-center bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
                    id="edit-profile-welcome-btn"
                  >
                    <Pencil className="w-3.5 h-3.5 text-blue-500" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Metric counters row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div 
                    onClick={() => setActiveTab('orders')}
                    className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-center cursor-pointer hover:border-blue-400 transition-all"
                  >
                    <span className="text-2xl font-mono font-extrabold text-slate-800 block">{userOrders.length}</span>
                    <span className="text-[10px] text-gray-400 font-bold block mt-1 uppercase tracking-wider">Orders</span>
                  </div>

                  <div 
                    onClick={() => setActiveTab('bookings')}
                    className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-center cursor-pointer hover:border-blue-400 transition-all"
                  >
                    <span className="text-2xl font-mono font-extrabold text-slate-800 block">{userBookings.length}</span>
                    <span className="text-[10px] text-gray-400 font-bold block mt-1 uppercase tracking-wider">Bookings</span>
                  </div>

                  <div 
                    onClick={() => setActiveTab('repairs')}
                    className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-center cursor-pointer hover:border-blue-400 transition-all"
                  >
                    <span className="text-2xl font-mono font-extrabold text-slate-800 block">{userRepairs.length}</span>
                    <span className="text-[10px] text-gray-400 font-bold block mt-1 uppercase tracking-wider">Repairs</span>
                  </div>

                  <div 
                    onClick={() => setActiveTab('wishlist')}
                    className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-center cursor-pointer hover:border-blue-400 transition-all"
                  >
                    <span className="text-2xl font-mono font-extrabold text-slate-800 block">{wishlist.length}</span>
                    <span className="text-[10px] text-gray-400 font-bold block mt-1 uppercase tracking-wider">Wishlist</span>
                  </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" id="customer-activity-feed">
                  <div className="border-b border-gray-150 pb-3 mb-5 flex items-center justify-between">
                    <div className="text-left">
                      <h2 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider">Recent Activity Feed</h2>
                      <p className="text-[10px] text-gray-400 mt-0.5">Chronological log of your latest interactions, orders, and appointments.</p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 py-1 px-2.5 rounded-full border border-blue-100">
                      {activityFeed.length} {activityFeed.length === 1 ? 'Interaction' : 'Interactions'}
                    </span>
                  </div>

                  {activityFeed.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-100">
                        <Bell className="w-5 h-5 text-slate-300" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">No recent activities on your account yet.</p>
                      <p className="text-[10px] text-gray-400">Order hardware, book cyber sessions, or lodge device repair requests to see them here.</p>
                    </div>
                  ) : (
                    <div className="relative pl-4 border-l-2 border-slate-100 space-y-6 text-left my-2">
                      {activityFeed.slice(0, 5).map((activity, idx) => (
                        <div key={activity.id} className="relative group" id={`activity-item-${activity.id}`}>
                          {/* Timeline bullet icon */}
                          <div className="absolute -left-[25px] top-0.5 bg-white p-1 rounded-full border border-slate-200 shadow-sm group-hover:border-blue-400 group-hover:scale-110 transition-all">
                            {activity.type === 'order' && (
                              <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-3 h-3" />
                              </div>
                            )}
                            {activity.type === 'booking' && (
                              <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                                <Calendar className="w-3 h-3" />
                              </div>
                            )}
                            {activity.type === 'repair' && (
                              <div className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                                <Wrench className="w-3 h-3" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="space-y-1 pl-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="text-xs font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                                {activity.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wide border ${activity.badgeColor}`}>
                                  {activity.status}
                                </span>
                                <span className="text-[9px] font-mono font-bold text-slate-400">
                                  {activity.date}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-[90%]">
                              {activity.description}
                            </p>
                            {activity.time && (
                              <p className="text-[9px] font-mono font-medium text-slate-400 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                                {activity.time}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Orders table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider">Recent Orders</h2>
                    <button onClick={() => setActiveTab('orders')} className="text-[11px] font-bold text-blue-600 hover:underline">View All</button>
                  </div>

                  {userOrders.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">No recent hardware orders logged yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-2">
                            <th className="pb-2">Order ID</th>
                            <th className="pb-2">Items</th>
                            <th className="pb-2 text-right">Amount</th>
                            <th className="pb-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {userOrders.slice(0, 3).map((o) => (
                            <tr key={o.id}>
                              <td className="py-3 font-mono font-bold text-slate-800">{o.id}</td>
                              <td className="py-3 text-slate-600 font-semibold truncate max-w-[200px]">
                                {o.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                              </td>
                              <td className="py-3 text-right font-mono font-bold text-slate-800">KSh {o.total.toLocaleString()}</td>
                              <td className="py-3 text-right">
                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                  o.status === 'Completed' || o.status === 'Delivered'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Recent Bookings table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider">Recent Bookings</h2>
                    <button onClick={() => setActiveTab('bookings')} className="text-[11px] font-bold text-blue-600 hover:underline">View All</button>
                  </div>

                  {userBookings.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">No active slots booked yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-2">
                            <th className="pb-2">Booking ID</th>
                            <th className="pb-2">Service</th>
                            <th className="pb-2 font-mono">Date / Time</th>
                            <th className="pb-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {userBookings.slice(0, 3).map((b) => (
                            <tr key={b.id}>
                              <td className="py-3 font-mono font-bold text-slate-800">{b.id}</td>
                              <td className="py-3 text-slate-800 font-bold">{b.serviceName}</td>
                              <td className="py-3 font-mono text-slate-600">{b.date} @ {b.time}</td>
                              <td className="py-3 text-right">
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-50 text-green-700 border border-green-200 uppercase">
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Tab 2: Orders List */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-fadeIn">
                <h2 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-gray-50">My Orders</h2>
                {userOrders.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">No orders registered on your profile.</p>
                ) : (
                  <div className="space-y-4.5">
                    {userOrders.map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-xl p-4 space-y-3 hover:border-gray-200 transition-colors">
                        <div className="flex flex-wrap justify-between items-center text-xs">
                          <div>
                            <span className="font-mono font-bold text-slate-900 mr-2">{order.id}</span>
                            <span className="text-gray-400">{order.date}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            order.status === 'Completed' || order.status === 'Delivered'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="divide-y divide-gray-50 text-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between py-2 items-center">
                              <span className="font-semibold text-slate-700">{item.productName} <span className="text-gray-400 text-[10px]">x{item.quantity}</span></span>
                              <span className="font-mono font-bold text-slate-800">KSh {item.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-50">
                          <span className="text-gray-400">Payment: <strong className="text-slate-700">{order.paymentMethod}</strong></span>
                          <span className="font-mono font-bold text-blue-600">Total: KSh {order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Bookings list */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-fadeIn">
                <h2 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-gray-50">My Bookings</h2>
                {userBookings.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">No bookings registered on your profile.</p>
                ) : (
                  <div className="space-y-4">
                    {userBookings.map((b) => (
                      <div key={b.id} className="border border-gray-100 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4 hover:border-gray-200 transition-all">
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase">{b.id}</span>
                          <h4 className="font-bold text-slate-800 text-xs pt-1">{b.serviceName}</h4>
                          <p className="text-[10px] text-gray-400 font-mono">{b.date} · {b.time}</p>
                          {b.notes && (
                            <p className="text-[11px] text-slate-500 max-w-md pt-1 italic">"{b.notes}"</p>
                          )}
                        </div>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 uppercase">
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Repairs list */}
            {activeTab === 'repairs' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-fadeIn">
                <h2 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-gray-50">My Hardware Repairs</h2>
                {userRepairs.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">No repairs listed under your name ({user.fullName}) in our systems.</p>
                ) : (
                  <div className="space-y-4">
                    {userRepairs.map((r) => (
                      <div key={r.id} className="border border-gray-100 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4 hover:border-gray-200 transition-all">
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded uppercase">{r.id}</span>
                          <h4 className="font-bold text-slate-800 text-xs pt-1">{r.device}</h4>
                          <p className="text-[10px] text-slate-500 font-semibold">Issue: {r.issue}</p>
                        </div>
                        <div className="text-right space-y-1.5">
                          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                            {r.status}
                          </span>
                          <button
                            onClick={() => onNavigate('repair-tracking')}
                            className="block text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                          >
                            <span>Live Tracker</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Wishlist list */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-fadeIn">
                <h2 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-gray-50">My Wishlist</h2>
                {wishlist.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">No favorite products added to wishlist yet.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlist.map((prod) => (
                      <div key={prod.id} className="border border-gray-50 rounded-xl p-3 flex flex-col justify-between hover:shadow-sm transition-all bg-slate-50/50">
                        <div className="aspect-square bg-white rounded-lg p-2 flex items-center justify-center border border-gray-100 mb-2">
                          <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <h4 className="text-[11px] font-bold text-slate-800 line-clamp-2">{prod.name}</h4>
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-blue-600">KSh {prod.price.toLocaleString()}</span>
                          <button
                            onClick={() => onNavigate('shop')}
                            className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                            title="View product details"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 8: Interactive Settings (Profile & Notification Settings) */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 animate-fadeIn text-left" id="notification-settings-panel">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider">Account Settings</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">Manage your personal profile and system notification preferences.</p>
                </div>

                {/* Profile form section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-wide flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      <span>Profile Details</span>
                    </h3>
                    <button
                      type="button"
                      onClick={openEditModal}
                      className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer bg-blue-50 hover:bg-blue-100 py-1.5 px-3.5 rounded-xl border border-blue-200 transition-all shadow-sm active:scale-95"
                      id="edit-profile-settings-header-btn"
                    >
                      <Pencil className="w-3 h-3 text-blue-500" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1 bg-slate-50 border border-slate-100 rounded-xl p-3.5 hover:bg-slate-100/50 transition-colors">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Full Name</span>
                      <span className="text-xs font-bold text-slate-700 block truncate">{user.fullName}</span>
                    </div>
                    
                    <div className="space-y-1 bg-slate-50 border border-slate-100 rounded-xl p-3.5 hover:bg-slate-100/50 transition-colors">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Email Address</span>
                      <span className="text-xs font-bold text-slate-700 block truncate">{user.email}</span>
                    </div>

                    <div className="space-y-1 bg-slate-50 border border-slate-100 rounded-xl p-3.5 hover:bg-slate-100/50 transition-colors">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Phone Number</span>
                      <span className="text-xs font-bold text-slate-700 block truncate">{user.phone || 'No phone set'}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Notification Settings section */}
                <div className="space-y-4" id="notification-settings-section">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-500 animate-pulse" />
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-wide">
                      Notification Settings
                    </h3>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    Choose which notifications you want to receive on your registered email address (<strong className="text-slate-600">{user?.email}</strong>):
                  </p>

                  <div className="space-y-3.5 pt-1">
                    {/* Toggle 1: Email alerts for order updates */}
                    <div className="flex items-start justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="space-y-0.5 max-w-[80%]">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer select-none" htmlFor="toggle-order-alerts">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>Order Status Updates</span>
                        </label>
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                          Receive instant automated status transitions, order confirmations, shipping logs, and delivery tracking alerts.
                        </p>
                      </div>
                      <button
                        id="toggle-order-alerts"
                        type="button"
                        onClick={() => setEmailOrderAlerts(!emailOrderAlerts)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          emailOrderAlerts ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            emailOrderAlerts ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle 2: Email alerts for booking confirmations */}
                    <div className="flex items-start justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="space-y-0.5 max-w-[80%]">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer select-none" htmlFor="toggle-booking-alerts">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>Booking Confirmations</span>
                        </label>
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                          Receive verification emails instantly when booking cyber cafe slots, repair schedules, or expert consultation sessions.
                        </p>
                      </div>
                      <button
                        id="toggle-booking-alerts"
                        type="button"
                        onClick={() => setEmailBookingAlerts(!emailBookingAlerts)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          emailBookingAlerts ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            emailBookingAlerts ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4 border-t border-gray-100">
                  {saveSuccess && (
                    <div className="text-xs font-bold text-green-600 flex items-center gap-1.5 animate-fadeIn">
                      <Check className="w-4 h-4 bg-green-50 text-green-500 rounded-full p-0.5 border border-green-200" />
                      <span>Preferences saved successfully!</span>
                    </div>
                  )}
                  <div className="ml-auto flex gap-3">
                    <button
                      onClick={saveSettings}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider py-2 px-5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Fallback Tabs (Addresses, Payments) */}
            {(activeTab === 'addresses' || activeTab === 'payments') && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-fadeIn text-center py-10">
                <Settings className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{activeTab} panel</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  This administrative settings block is pre-configured and managed under your active profile ({user.fullName}).
                </p>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" id="edit-profile-modal-overlay">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                  <User className="w-4 h-4 text-blue-600" />
                </span>
                <div className="text-left">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Edit Profile</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Update your personal account credentials.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              
              {editError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-shake text-left">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                  <span>{editError}</span>
                </div>
              )}

              {editSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center text-green-700 space-y-2 animate-fadeIn py-8">
                  <div className="w-12 h-12 bg-green-100 border-2 border-green-400 rounded-full flex items-center justify-center mx-auto text-green-600 mb-2">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-800">Profile Updated!</h4>
                  <p className="text-xs text-slate-500">Your display credentials have been modified and saved securely.</p>
                </div>
              ) : (
                <div className="text-left space-y-4">
                  {/* Field 1: Display Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Display Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input 
                        type="text" 
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                        required
                        id="edit-profile-fullname-input"
                      />
                    </div>
                  </div>

                  {/* Field 2: Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input 
                        type="email" 
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                        required
                        id="edit-profile-email-input"
                      />
                    </div>
                  </div>

                  {/* Field 3: Contact Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Contact Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input 
                        type="tel" 
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="+254 712 345 678"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                        required
                        id="edit-profile-phone-input"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 text-xs font-black uppercase tracking-wider py-2 px-4 rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider py-2 px-5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Save Profile</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
