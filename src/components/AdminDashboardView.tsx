import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Laptop, Users, Calendar, Wrench, 
  Settings, Database, Bell, Search, Globe, LogOut, Plus, 
  TrendingUp, TrendingDown, DollarSign, Package, Activity, AlertCircle, FileText,
  CheckCircle, Clock, Grid, CreditCard, BarChart3, Layers, Truck, Warehouse,
  FolderOpen, Award, Tag, UserCheck, Contact, Percent, Ticket, BookOpen,
  History, Terminal, ArrowRight, ShieldAlert, Moon, Sun, Filter, MoreVertical,
  Sparkles, ClipboardList, Info, HelpCircle
} from 'lucide-react';
import { Order, Booking, Repair, Product } from '../types';
import Logo from './Logo';

interface AdminDashboardViewProps {
  orders: Order[];
  bookings: Booking[];
  repairs: Repair[];
  products: Product[];
  onNavigate: (view: string) => void;
  onAddProduct: (prod: Product) => void;
  onEditProduct?: (prod: Product) => void;
  onDeleteProduct?: (id: string) => void;
  onAddRepair: (rep: Repair) => void;
  onUpdateRepairStatus?: (id: string, status: Repair['status']) => void;
  onDeleteRepair?: (id: string) => void;
  onUpdateBookingStatus?: (id: string, status: Booking['status']) => void;
  onDeleteBooking?: (id: string) => void;
  onUpdateOrderStatus?: (id: string, status: Order['status']) => void;
  onDeleteOrder?: (id: string) => void;
}

export default function AdminDashboardView({
  orders,
  bookings,
  repairs,
  products,
  onNavigate,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddRepair,
  onUpdateRepairStatus,
  onDeleteRepair,
  onUpdateBookingStatus,
  onDeleteBooking,
  onUpdateOrderStatus,
  onDeleteOrder
}: AdminDashboardViewProps) {
  // Navigation internal active panel
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Search query within the administrative table view
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  
  // Theme state (Visual only mockup for night-mode switcher)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for editing items
  const [editProdName, setEditProdName] = useState('');
  const [editProdPrice, setEditProdPrice] = useState('0');
  const [editProdCategory, setEditProdCategory] = useState('');
  const [editProdBrand, setEditProdBrand] = useState('');
  const [editProdInStock, setEditProdInStock] = useState(true);

  // Form states for adding items
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('45000');
  const [newProdCategory, setNewProdCategory] = useState('Laptops');
  const [newProdBrand, setNewProdBrand] = useState('HP');

  const [newRepCust, setNewRepCust] = useState('');
  const [newRepPhone, setNewRepPhone] = useState('');
  const [newRepDevice, setNewRepDevice] = useState('');
  const [newRepIssue, setNewRepIssue] = useState('');

  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustType, setNewCustType] = useState('Regular');

  const [newBookCust, setNewBookCust] = useState('');
  const [newBookService, setNewBookService] = useState('Cyber Cafe (Internet)');
  const [newBookDate, setNewBookDate] = useState('');
  const [newBookTime, setNewBookTime] = useState('10:00 AM');

  // Multi-item lists built directly for rich, premium LEDGERS
  // (We use state here so admins can dynamically create/edit them in session)
  const [mockCustomers, setMockCustomers] = useState([
    { id: 'CUST-001', name: 'John Mwangi', email: 'john.mwangi@gmail.com', phone: '+254 712 345 678', type: 'Regular', joined: '12 Jun 2024', status: 'Active' },
    { id: 'CUST-002', name: 'Mary Wanjiku', email: 'mary.wanjiku@yahoo.com', phone: '+254 722 987 654', type: 'VIP', joined: '12 Jun 2024', status: 'Active' },
    { id: 'CUST-003', name: 'Peter Mutua', email: 'peter.mutua@outlook.com', phone: '+254 733 111 222', type: 'Regular', joined: '11 Jun 2024', status: 'Inactive' },
    { id: 'CUST-004', name: 'Grace Muthoni', email: 'grace.m@muthoniconsulting.co.ke', phone: '+254 701 444 888', type: 'Corporate', joined: '11 Jun 2024', status: 'Active' },
    { id: 'CUST-005', name: 'David Kilonzo', email: 'david.kilonzo@gmail.com', phone: '+254 715 555 999', type: 'VIP', joined: '10 Jun 2024', status: 'Active' },
  ]);

  const [mockServices, setMockServices] = useState([
    { id: 'SRV-001', name: 'Cyber Cafe (Internet)', category: 'Cyber Services', price: 'KSh 50/hr', speed: '100 Mbps', status: 'Active' },
    { id: 'SRV-002', name: 'Printing Services', category: 'Printing/Copying', price: 'KSh 10/pg', speed: 'High Speed Laser', status: 'Active' },
    { id: 'SRV-003', name: 'Computer Rentals', category: 'Hardware Rental', price: 'KSh 1,500/day', speed: 'Core i7 Specs', status: 'Active' },
    { id: 'SRV-004', name: 'Graphic Design', category: 'Creative Studio', price: 'KSh 3,000/job', speed: 'Expert Designers', status: 'Active' },
    { id: 'SRV-005', name: 'Software Installation', category: 'Technical Support', price: 'KSh 1,200/device', speed: 'Fully Licensed', status: 'Active' },
    { id: 'SRV-006', name: 'Network Troubleshooting', category: 'Enterprise Network', price: 'KSh 5,000/hr', speed: 'On-site Support', status: 'Active' },
  ]);

  const [mockPayments, setMockPayments] = useState([
    { id: 'TXN-9041', customer: 'John Mwangi', amount: 45000, method: 'M-Pesa', status: 'Completed', date: '12 Jun 2024', ref: 'RFX82H19K9' },
    { id: 'TXN-9040', customer: 'Mary Wanjiku', amount: 12500, method: 'Credit Card', status: 'Completed', ref: 'CC_78219461' },
    { id: 'TXN-9039', customer: 'Peter Mutua', amount: 8900, method: 'M-Pesa', status: 'Completed', ref: 'RGC55T90L2' },
    { id: 'TXN-9038', customer: 'Grace Muthoni', amount: 15250, method: 'Cash', status: 'Pending', ref: 'CASH_DIRECT' },
    { id: 'TXN-9037', customer: 'David Kilonzo', amount: 23000, method: 'M-Pesa', status: 'Completed', ref: 'RHD11Y34R0' },
  ]);

  const [mockSuppliers, setMockSuppliers] = useState([
    { id: 'SUP-01', name: 'Computech Kenya Ltd', contact: 'sales@computech.co.ke', phone: '+254 20 444 9000', items: 'Laptops, Desktops, Servers', rating: '4.8/5' },
    { id: 'SUP-02', name: 'Red Dot Distribution', contact: 'orders@reddot.com', phone: '+254 733 800 200', items: 'HP, Dell Authorized Spares', rating: '4.9/5' },
    { id: 'SUP-03', name: 'Copy Cat East Africa', contact: 'printers@copycat.com', phone: '+254 20 222 4111', items: 'Canon/Epson Printers & Toner', rating: '4.5/5' },
    { id: 'SUP-04', name: 'Western Digital Africa', contact: 'wd.support@wdc.com', phone: '0800 110 220', items: 'SSD, HDD, Storage Drives', rating: '4.7/5' },
  ]);

  const [mockEmployees, setMockEmployees] = useState([
    { id: 'EMP-01', name: 'Evans Maundu', role: 'Super Administrator', email: 'maunduevans2004@gmail.com', phone: '+254 712 000 111', status: 'Full-Time' },
    { id: 'EMP-02', name: 'Alice Njeri', role: 'Senior Hardware Tech', email: 'alice.njeri@ntix.co.ke', phone: '+254 722 333 444', status: 'Full-Time' },
    { id: 'EMP-03', name: 'Brian Kiprop', role: 'Cyber Services Attendant', email: 'brian.k@ntix.co.ke', phone: '+254 733 555 666', status: 'Part-Time' },
    { id: 'EMP-04', name: 'Mercy Chebet', role: 'Accounts Assistant', email: 'mercy.c@ntix.co.ke', phone: '+254 701 777 888', status: 'Full-Time' },
  ]);

  const [mockCoupons, setMockCoupons] = useState([
    { code: 'WELCOME10', discount: '10% Off Entire Catalog', usage: '48 times', status: 'Active', expiry: '31 Dec 2026' },
    { code: 'MADARAKA20', discount: 'KSh 2,000 Off Services', usage: '12 times', status: 'Active', expiry: '20 Oct 2026' },
    { code: 'REPAIR15', discount: '15% Off Hardware Repairs', usage: '85 times', status: 'Expired', expiry: '01 Jun 2026' },
  ]);

  const [mockAuditLogs, setMockAuditLogs] = useState([
    { time: '13:02:11', event: 'Admin User logged in from Nairobi HQ Office IP 197.248.55.19', operator: 'E. Maundu', severity: 'Info' },
    { time: '12:45:30', event: 'New hardware repair job #RP1208 created in database successfully', operator: 'A. Njeri', severity: 'Success' },
    { time: '11:20:15', event: 'Updated pricing specifications for HP ProBook 450 G9 retail unit', operator: 'E. Maundu', severity: 'Warning' },
    { time: '09:15:00', event: 'Hourly incremental database backup verified on secure S3 Cloud target', operator: 'System Cron', severity: 'Success' },
    { time: '08:00:00', event: 'Triggered systemic automated inventory reconciliation check', operator: 'System Cron', severity: 'Info' },
  ]);

  // Handle Form Submissions
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const id = `prod-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProd: Product = {
      id,
      name: newProdName,
      price: Number(newProdPrice),
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80',
      category: newProdCategory,
      brand: newProdBrand,
      rating: 4.5,
      reviewsCount: 1,
      inStock: true,
      specs: ['Intel Core i5 Processor', '8GB High-Speed RAM', '256GB NVMe SSD', '1 Year Shop Warranty'],
      description: 'Newly listed retail item configured via the administrator console.'
    };

    onAddProduct(newProd);
    setShowProductModal(false);
    setNewProdName('');
    
    // Log audit event
    const logTime = new Date().toLocaleTimeString();
    setMockAuditLogs(prev => [
      { time: logTime, event: `Product "${newProd.name}" successfully added to retail catalog!`, operator: 'E. Maundu', severity: 'Success' },
      ...prev
    ]);
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditProdName(prod.name);
    setEditProdPrice(prod.price.toString());
    setEditProdCategory(prod.category);
    setEditProdBrand(prod.brand);
    setEditProdInStock(prod.inStock);
    setShowEditProductModal(true);
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editProdName) return;

    const updatedProd: Product = {
      ...editingProduct,
      name: editProdName,
      price: Number(editProdPrice),
      category: editProdCategory,
      brand: editProdBrand,
      inStock: editProdInStock,
    };

    onEditProduct?.(updatedProd);
    setShowEditProductModal(false);
    setEditingProduct(null);

    // Log audit event
    const logTime = new Date().toLocaleTimeString();
    setMockAuditLogs(prev => [
      { time: logTime, event: `Product "${updatedProd.name}" successfully edited in catalog!`, operator: 'Admin', severity: 'Success' },
      ...prev
    ]);
  };

  const handleRepairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepDevice || !newRepIssue) return;

    const ticketId = `RP${Math.floor(1000 + Math.random() * 9000)}`;
    const newRep: Repair = {
      id: ticketId,
      device: newRepDevice,
      issue: newRepIssue,
      status: 'Pending',
      receivedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      customerName: newRepCust || 'Guest Customer',
      customerPhone: newRepPhone || '+254 700 000 000',
      history: [
        { title: 'Repair Request Logged', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), completed: true },
        { title: 'Device Diagnosis & Inspection', date: 'Pending', time: '', completed: false },
        { title: 'Parts Assembly & Soldering', date: 'Pending', time: '', completed: false },
        { title: 'Quality Assurance Check', date: 'Pending', time: '', completed: false },
        { title: 'Ready for Collection', date: 'Pending', time: '', completed: false }
      ]
    };

    onAddRepair(newRep);
    setShowRepairModal(false);
    setNewRepDevice('');
    setNewRepIssue('');
    setNewRepCust('');
    setNewRepPhone('');

    // Log audit event
    const logTime = new Date().toLocaleTimeString();
    setMockAuditLogs(prev => [
      { time: logTime, event: `Repair ticket "${newRep.id}" created for ${newRep.customerName}!`, operator: 'A. Njeri', severity: 'Success' },
      ...prev
    ]);
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName) return;

    const newCust = {
      id: `CUST-00${mockCustomers.length + 1}`,
      name: newCustName,
      email: newCustEmail || `${newCustName.toLowerCase().replace(' ', '.')}@gmail.com`,
      phone: newCustPhone || '+254 700 000 000',
      type: newCustType,
      joined: 'Today',
      status: 'Active'
    };

    setMockCustomers([newCust, ...mockCustomers]);
    setShowCustomerModal(false);
    setNewCustName('');
    setNewCustEmail('');
    setNewCustPhone('');

    // Log audit
    const logTime = new Date().toLocaleTimeString();
    setMockAuditLogs(prev => [
      { time: logTime, event: `Admin onboarded new customer ${newCust.name} (${newCust.type})`, operator: 'E. Maundu', severity: 'Success' },
      ...prev
    ]);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookCust) return;

    alert(`New booking slots locked for ${newBookCust} on ${newBookDate || 'tomorrow'}!`);
    setShowBookingModal(false);
    setNewBookCust('');

    // Log audit
    const logTime = new Date().toLocaleTimeString();
    setMockAuditLogs(prev => [
      { time: logTime, event: `Created scheduled workspace slot for client ${newBookCust}`, operator: 'B. Kiprop', severity: 'Success' },
      ...prev
    ]);
  };

  // Sidebar Menu structure corresponding directly with the provided UI snapshot
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" />, badge: '23', badgeColor: 'bg-[#581c87]/60 text-purple-300 border-[#6b21a8]' },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-4 h-4" /> },
    { id: 'repairs', label: 'Repairs', icon: <Wrench className="w-4 h-4" />, badge: '12', badgeColor: 'bg-[#7c2d12]/60 text-orange-300 border-[#9a3412]' },
    { id: 'services', label: 'Services', icon: <Layers className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const inventoryNavItems = [
    { id: 'inventory', label: 'Inventory', icon: <Database className="w-4 h-4" /> },
    { id: 'suppliers', label: 'Suppliers', icon: <Truck className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'brands', label: 'Brands', icon: <Award className="w-4 h-4" /> },
  ];

  const managementNavItems = [
    { id: 'employees', label: 'Employees', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'technicians', label: 'Technicians', icon: <Contact className="w-4 h-4" /> },
    { id: 'coupons', label: 'Coupons', icon: <Percent className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: '8', badgeColor: 'bg-[#1e1b4b]/60 text-indigo-300 border-[#312e81]' },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'audit-logs', label: 'Audit Logs', icon: <History className="w-4 h-4" /> },
  ];

  // Dynamically filter database results inside other ledger tabs based on query search
  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.id.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(tableSearchQuery.toLowerCase())
    );
  }, [orders, tableSearchQuery]);

  const filteredRepairs = useMemo(() => {
    return repairs.filter(r => 
      r.id.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      r.device.toLowerCase().includes(tableSearchQuery.toLowerCase())
    );
  }, [repairs, tableSearchQuery]);

  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter(c => 
      c.name.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      c.phone.includes(tableSearchQuery)
    );
  }, [mockCustomers, tableSearchQuery]);

  return (
    <div className="w-full bg-[#020617] text-[#94a3b8] min-h-screen font-sans flex flex-col lg:flex-row relative" id="admin-dashboard-root">
      
      {/* 1. LEFT SIDEBAR PANEL (Matching visual style of snapshot) */}
      <aside className="w-full lg:w-[260px] bg-[#030712] border-r border-[#1e293b]/50 flex flex-col justify-between shrink-0 z-20">
        <div className="flex flex-col">
          {/* Cybernetic Header Logo wrapper */}
          <div className="p-5 border-b border-[#1e293b]/40 flex items-center justify-between">
            <Logo size="md" textClassName="text-white" />
          </div>

          {/* Scrollable Navigation Sidebar Lists */}
          <div className="p-3.5 space-y-6 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-none">
            
            {/* Nav Group 1: MAIN */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] block px-3 mb-2">Main</span>
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setTableSearchQuery('');
                  }}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-[12px] font-semibold tracking-wide transition-all duration-150 group cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-blue-600/10 text-blue-400 font-extrabold border-l-2 border-blue-500 shadow-sm shadow-blue-950/20'
                      : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={activeTab === item.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Nav Group 2: INVENTORY */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] block px-3 mb-2">Inventory</span>
              {inventoryNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setTableSearchQuery('');
                  }}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-[12px] font-semibold tracking-wide transition-all duration-150 group cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-blue-600/10 text-blue-400 font-extrabold border-l-2 border-blue-500 shadow-sm shadow-blue-950/20'
                      : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={activeTab === item.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Nav Group 3: MANAGEMENT */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] block px-3 mb-2">Management</span>
              {managementNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setTableSearchQuery('');
                  }}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-[12px] font-semibold tracking-wide transition-all duration-150 group cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-blue-600/10 text-blue-400 font-extrabold border-l-2 border-blue-500 shadow-sm shadow-blue-950/20'
                      : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={activeTab === item.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Professional Profile section at bottom of sidebar */}
        <div className="p-4 border-t border-[#1e293b]/50 bg-[#02050c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" 
                alt="Admin Profile" 
                className="w-9 h-9 rounded-full object-cover border border-[#1e293b] shadow-inner"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10b981] rounded-full border-2 border-[#02050c]" />
            </div>
            <div className="text-left">
              <h4 className="text-[12px] font-bold text-white tracking-wide">Evans Maundu</h4>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider leading-none mt-0.5">Admin</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('home')} 
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            title="Return to Shop Storefront"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION GRID WORKSPACE */}
      <main className="flex-1 bg-[#020617] overflow-x-hidden min-h-screen flex flex-col justify-between">
        
        {/* TOP STATUS ROW (Nav-header inside admin space) */}
        <header className="bg-[#030712] border-b border-[#1e293b]/40 px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
          
          {/* Universal Command Search Bar mockup */}
          <div className="flex items-center gap-3 flex-1 max-w-md w-full bg-[#090f1d] border border-[#1e293b]/60 rounded-xl px-3 py-2 text-xs text-slate-400">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input 
              type="text" 
              placeholder="Search anything... (Ctrl + /)" 
              value={tableSearchQuery}
              onChange={(e) => setTableSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none w-full placeholder-slate-600 font-medium"
            />
            <span className="text-[9px] bg-[#1e293b]/50 text-slate-400 border border-[#1e293b]/30 px-1.5 py-0.5 rounded font-mono select-none">Ctrl + /</span>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            
            {/* "View Website" link button */}
            <button
              onClick={() => onNavigate('home')}
              className="bg-black hover:bg-slate-900 text-slate-300 hover:text-white border border-[#1e293b] text-xs font-semibold py-1.5 px-3 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>View Website</span>
              <span className="text-[9px] text-slate-500 ml-0.5">↗</span>
            </button>

            {/* Simulated Night Mode toggle button */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-400 hover:text-white bg-[#090f1d] hover:bg-slate-900 border border-[#1e293b]/60 rounded-xl transition-all"
              title="Toggle Theme Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification system */}
            <button className="p-2 text-slate-400 hover:text-white bg-[#090f1d] hover:bg-slate-900 border border-[#1e293b]/60 rounded-xl transition-all relative">
              <Bell className="w-4 h-4 text-indigo-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
              <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-indigo-600 text-white font-black px-1 rounded-full border border-indigo-950">8</span>
            </button>

            {/* Quick Profile Dropdown trigger */}
            <div className="flex items-center gap-2 border-l border-[#1e293b]/40 pl-4 py-1">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" 
                alt="Avatar" 
                className="w-7 h-7 rounded-full object-cover border border-[#1e293b]"
              />
              <span className="text-xs font-bold text-white hidden sm:inline-block">Admin</span>
              <span className="text-[10px] text-slate-500">▼</span>
            </div>

          </div>
        </header>

        {/* MAIN LEDGER SCENARIOS */}
        <div className="p-6 md:p-8 space-y-8 flex-1">
          
          {/* RENDER VIEW 1: DYNAMIC LEDGER SHEETS (If not activeTab === 'dashboard') */}
          {activeTab !== 'dashboard' ? (
            <div className="bg-[#070b19] border border-[#1e293b]/30 rounded-2xl p-6 space-y-6 animate-fadeIn">
              
              {/* Header inside specific Ledger */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1e293b]/30">
                <div>
                  <div className="flex items-center gap-2 text-[10px] text-blue-400 font-bold tracking-widest uppercase mb-1">
                    <Database className="w-3.5 h-3.5" />
                    <span>Administrative Ledger</span>
                  </div>
                  <h2 className="font-display font-extrabold text-lg text-white uppercase tracking-wider">
                    {activeTab === 'audit-logs' ? 'System Audit History' : `${activeTab} Management`}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="text-xs text-slate-400 hover:text-white bg-[#0e172a] border border-[#1e293b] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    ← Back to Dashboard
                  </button>
                  
                  {activeTab === 'products' && (
                    <button 
                      onClick={() => setShowProductModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-blue-900/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Product</span>
                    </button>
                  )}

                  {activeTab === 'repairs' && (
                    <button 
                      onClick={() => setShowRepairModal(true)}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-amber-900/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Repair Job</span>
                    </button>
                  )}

                  {activeTab === 'customers' && (
                    <button 
                      onClick={() => setShowCustomerModal(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-emerald-900/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Onboard Customer</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filtering Search row */}
              <div className="flex items-center justify-between bg-[#040814] border border-[#1e293b]/40 rounded-xl p-3.5">
                <div className="flex items-center gap-2.5 text-xs text-slate-400">
                  <Filter className="w-4 h-4 text-blue-500" />
                  <span>Interactive Search Query Filter:</span>
                </div>
                <input 
                  type="text"
                  placeholder={`Filter list records...`}
                  value={tableSearchQuery}
                  onChange={(e) => setTableSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-[#1e293b] text-xs text-white rounded-lg px-3 py-1.5 w-60 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* RENDER SUBTAB: ORDERS */}
              {activeTab === 'orders' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#94a3b8] min-w-[700px]">
                    <thead>
                      <tr className="text-slate-400 border-b border-[#1e293b]/40 pb-2 text-[10px] uppercase font-bold tracking-wider">
                        <th className="pb-3 pl-2">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Purchased Items</th>
                        <th className="pb-3 text-right">Payment Total</th>
                        <th className="pb-3 text-right">Fulfillment</th>
                        <th className="pb-3 text-right pr-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b]/30">
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((o) => (
                          <tr key={o.id} className="hover:bg-[#0b1329]/30 transition-colors">
                            <td className="py-3.5 pl-2 font-mono text-white font-bold">{o.id}</td>
                            <td className="py-3.5 text-slate-200 font-semibold">{o.customerName}</td>
                            <td className="py-3.5 text-slate-400 truncate max-w-[200px]">{o.items.map(i => i.productName).join(', ')}</td>
                            <td className="py-3.5 text-right font-mono text-white font-semibold">KSh {o.total.toLocaleString()}</td>
                            <td className="py-3.5 text-right">
                              <select
                                value={o.status}
                                onChange={(e) => onUpdateOrderStatus?.(o.id, e.target.value as Order['status'])}
                                className="bg-[#0b1329] text-xs text-white border border-[#1e293b] rounded px-2 py-1 font-mono uppercase focus:outline-none focus:border-blue-500 cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                            <td className="py-3.5 text-right pr-2">
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete order ${o.id}?`)) {
                                    onDeleteOrder?.(o.id);
                                  }
                                }}
                                className="text-red-400 hover:text-red-300 font-mono text-[10px] uppercase font-bold border border-red-900/30 bg-red-950/20 px-2 py-1 rounded cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={6} className="py-8 text-center text-slate-600">No matching orders found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* RENDER SUBTAB: PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map((p) => (
                      <div key={p.id} className="bg-[#050917] border border-[#1e293b]/30 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-500/40 transition-all group">
                        <div>
                          <div className="flex items-start gap-3">
                            <img src={p.image} className="w-12 h-12 rounded-xl bg-[#090f1f] object-contain p-2 shrink-0 border border-[#1e293b]/40" />
                            <div className="text-left overflow-hidden">
                              <span className="text-[9px] font-black text-blue-500 uppercase font-mono tracking-wider">{p.brand}</span>
                              <h4 className="text-xs font-bold text-white truncate" title={p.name}>{p.name}</h4>
                              <span className="text-[10px] text-slate-500 block">{p.category}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1e293b]/30">
                            <span className="text-xs font-mono font-bold text-blue-400">KSh {p.price.toLocaleString()}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border ${p.inStock ? 'bg-green-950/20 text-green-400 border-green-900/30' : 'bg-red-950/20 text-red-400 border-red-900/30'}`}>{p.inStock ? 'In Stock' : 'Out Of Stock'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 pt-2 border-t border-[#1e293b]/20">
                          <button
                            onClick={() => startEditProduct(p)}
                            className="flex-1 text-center bg-blue-950/30 hover:bg-blue-900/40 text-blue-400 text-[10px] font-bold py-1.5 rounded-lg border border-blue-900/30 uppercase font-mono cursor-pointer transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete product "${p.name}"?`)) {
                                onDeleteProduct?.(p.id);
                              }
                            }}
                            className="flex-1 text-center bg-red-950/30 hover:bg-red-900/40 text-red-400 text-[10px] font-bold py-1.5 rounded-lg border border-red-900/30 uppercase font-mono cursor-pointer transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RENDER SUBTAB: BOOKINGS */}
              {activeTab === 'bookings' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead>
                      <tr className="text-slate-400 border-b border-[#1e293b]/40 pb-2 text-[10px] uppercase font-bold tracking-wider">
                        <th className="pb-3 pl-2">Booking ID</th>
                        <th className="pb-3">Client</th>
                        <th className="pb-3">Service Reserved</th>
                        <th className="pb-3">Scheduled Date</th>
                        <th className="pb-3 text-right">Fulfillment Status</th>
                        <th className="pb-3 text-right pr-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b]/30">
                      {bookings.length > 0 ? (
                        bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-[#0b1329]/30 transition-colors">
                            <td className="py-3.5 pl-2 font-mono text-white font-bold">{b.id}</td>
                            <td className="py-3.5 text-slate-200 font-semibold">{b.customerName}</td>
                            <td className="py-3.5 text-white font-bold">{b.serviceName}</td>
                            <td className="py-3.5 font-mono text-slate-400">{b.date} @ {b.time}</td>
                            <td className="py-3.5 text-right">
                              <select
                                value={b.status}
                                onChange={(e) => onUpdateBookingStatus?.(b.id, e.target.value as Booking['status'])}
                                className="bg-[#0b1329] text-xs text-white border border-[#1e293b] rounded px-2 py-1 font-mono uppercase focus:outline-none focus:border-blue-500 cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3.5 text-right pr-2">
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete booking ${b.id}?`)) {
                                    onDeleteBooking?.(b.id);
                                  }
                                }}
                                className="text-red-400 hover:text-red-300 font-mono text-[10px] uppercase font-bold border border-red-900/30 bg-red-950/20 px-2 py-1 rounded cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={6} className="py-8 text-center text-slate-600">No active bookings.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* RENDER SUBTAB: REPAIRS */}
              {activeTab === 'repairs' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead>
                      <tr className="text-slate-400 border-b border-[#1e293b]/40 pb-2 text-[10px] uppercase font-bold tracking-wider">
                        <th className="pb-3 pl-2">Ticket ID</th>
                        <th className="pb-3">Client Name</th>
                        <th className="pb-3">Hardware Device</th>
                        <th className="pb-3">Reported Fault Description</th>
                        <th className="pb-3 text-right">Current Status</th>
                        <th className="pb-3 text-right pr-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b]/30">
                      {filteredRepairs.length > 0 ? (
                        filteredRepairs.map((r) => (
                          <tr key={r.id} className="hover:bg-[#0b1329]/30 transition-colors">
                            <td className="py-3.5 pl-2 font-mono text-white font-bold">{r.id}</td>
                            <td className="py-3.5 text-slate-200 font-semibold">{r.customerName}</td>
                            <td className="py-3.5 text-white font-bold">{r.device}</td>
                            <td className="py-3.5 text-slate-400 truncate max-w-[200px]">{r.issue}</td>
                            <td className="py-3.5 text-right">
                              <select
                                value={r.status}
                                onChange={(e) => onUpdateRepairStatus?.(r.id, e.target.value as Repair['status'])}
                                className="bg-[#0b1329] text-xs text-white border border-[#1e293b] rounded px-2 py-1 font-mono uppercase focus:outline-none focus:border-blue-500 cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
                              </select>
                            </td>
                            <td className="py-3.5 text-right pr-2">
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete repair ticket ${r.id}?`)) {
                                    onDeleteRepair?.(r.id);
                                  }
                                }}
                                className="text-red-400 hover:text-red-300 font-mono text-[10px] uppercase font-bold border border-red-900/30 bg-red-950/20 px-2 py-1 rounded cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={6} className="py-8 text-center text-slate-600">No matching repairs logged.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* RENDER SUBTAB: CUSTOMERS */}
              {activeTab === 'customers' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead>
                      <tr className="text-slate-400 border-b border-[#1e293b]/40 pb-2 text-[10px] uppercase font-bold tracking-wider">
                        <th className="pb-3 pl-2">User ID</th>
                        <th className="pb-3">Full Name</th>
                        <th className="pb-3">Email Address</th>
                        <th className="pb-3">Phone Line</th>
                        <th className="pb-3">Client Type</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b]/30">
                      {filteredCustomers.map((c) => (
                        <tr key={c.id} className="hover:bg-[#0b1329]/30 transition-colors">
                          <td className="py-3.5 pl-2 font-mono text-white font-bold">{c.id}</td>
                          <td className="py-3.5 text-white font-bold">{c.name}</td>
                          <td className="py-3.5 text-slate-400">{c.email}</td>
                          <td className="py-3.5 text-slate-400 font-mono">{c.phone}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              c.type === 'VIP' ? 'bg-[#581c87]/30 text-purple-400 border border-purple-800' :
                              c.type === 'Corporate' ? 'bg-blue-950/40 text-blue-400 border border-blue-800' :
                              'bg-slate-850 text-slate-300'
                            }`}>{c.type}</span>
                          </td>
                          <td className="py-3.5 text-right">
                            <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${c.status === 'Active' ? 'bg-green-500' : 'bg-slate-500'}`} />
                            <span className="text-slate-300 font-semibold">{c.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* RENDER SUBTAB: SERVICES */}
              {activeTab === 'services' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {mockServices.map((s) => (
                    <div key={s.id} className="bg-[#050917] border border-[#1e293b]/30 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black font-mono text-blue-400 uppercase tracking-widest">{s.category}</span>
                        <h4 className="text-sm font-extrabold text-white">{s.name}</h4>
                        <p className="text-xs text-slate-500">Capability: {s.speed}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-[#1e293b]/20">
                        <span className="text-xs font-bold text-white font-mono">{s.price}</span>
                        <span className="text-[10px] text-green-400 font-bold bg-green-950/20 px-2 py-0.5 rounded">Operational</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* RENDER SUBTAB: PAYMENTS */}
              {activeTab === 'payments' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead>
                      <tr className="text-slate-400 border-b border-[#1e293b]/40 pb-2 text-[10px] uppercase font-bold tracking-wider">
                        <th className="pb-3 pl-2">Transaction ID</th>
                        <th className="pb-3">Client</th>
                        <th className="pb-3">Payment Provider</th>
                        <th className="pb-3">Payment Reference</th>
                        <th className="pb-3 text-right">Payment Amount</th>
                        <th className="pb-3 text-right">Settlement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b]/30">
                      {mockPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-[#0b1329]/30 transition-colors">
                          <td className="py-3.5 pl-2 font-mono text-white font-bold">{p.id}</td>
                          <td className="py-3.5 text-slate-200 font-semibold">{p.customer}</td>
                          <td className="py-3.5 font-bold text-white">{p.method}</td>
                          <td className="py-3.5 font-mono text-slate-400">{p.ref || 'Pending'}</td>
                          <td className="py-3.5 text-right font-mono text-white font-semibold">KSh {p.amount.toLocaleString()}</td>
                          <td className="py-3.5 text-right">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                              p.status === 'Completed' ? 'bg-green-950/40 text-green-400 border-green-900' : 'bg-blue-950/40 text-blue-400 border-blue-900'
                            }`}>{p.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* RENDER SUBTAB: REPORTS */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#050917] border border-[#1e293b]/30 rounded-2xl p-5 space-y-2">
                      <span className="text-slate-500 text-[10px] font-bold uppercase font-mono">Gross Margins</span>
                      <h4 className="text-xl font-black text-white font-mono">82.4%</h4>
                      <p className="text-xs text-slate-400">Retail sales margins are operating at premium targets for this business cycle.</p>
                    </div>
                    <div className="bg-[#050917] border border-[#1e293b]/30 rounded-2xl p-5 space-y-2">
                      <span className="text-slate-500 text-[10px] font-bold uppercase font-mono">Customer Acquisition</span>
                      <h4 className="text-xl font-black text-white font-mono">+11.2%</h4>
                      <p className="text-xs text-slate-400">New corporate and retail accounts listed increase monthly subscription projections.</p>
                    </div>
                    <div className="bg-[#050917] border border-[#1e293b]/30 rounded-2xl p-5 space-y-2">
                      <span className="text-slate-500 text-[10px] font-bold uppercase font-mono">Hardware Repairs</span>
                      <h4 className="text-xl font-black text-white font-mono">KSh 385,000</h4>
                      <p className="text-xs text-slate-400">Total technical service repairs revenue billed over the ongoing 30 days window.</p>
                    </div>
                  </div>
                  <div className="bg-[#050917] border border-[#1e293b]/30 rounded-2xl p-6 text-center text-slate-500 text-xs py-12">
                    <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <span>Comprehensive analytics and reports synchronization ready for cloud accounting.</span>
                  </div>
                </div>
              )}

              {/* RENDER SUBTAB: INVENTORY */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="bg-[#050917] border border-[#1e293b]/30 rounded-2xl p-6 text-center py-12">
                    <Database className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-white font-bold text-sm mb-1">Local & Cloud Inventory Sync</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">Database verified. Fully matched with {products.length} current retail lines and {repairs.length} active service parts.</p>
                  </div>
                </div>
              )}

              {/* RENDER SUBTAB: SUPPLIERS */}
              {activeTab === 'suppliers' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead>
                      <tr className="text-slate-400 border-b border-[#1e293b]/40 pb-2 text-[10px] uppercase font-bold tracking-wider">
                        <th className="pb-3 pl-2">Supplier ID</th>
                        <th className="pb-3">Supplier Name</th>
                        <th className="pb-3">Authorized Spares & Items</th>
                        <th className="pb-3">Corporate Contact Email</th>
                        <th className="pb-3 font-mono text-right">Reliability Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b]/30">
                      {mockSuppliers.map((s) => (
                        <tr key={s.id} className="hover:bg-[#0b1329]/30 transition-colors">
                          <td className="py-3.5 pl-2 font-mono text-white font-bold">{s.id}</td>
                          <td className="py-3.5 text-white font-bold">{s.name}</td>
                          <td className="py-3.5 text-slate-300 font-semibold">{s.items}</td>
                          <td className="py-3.5 text-slate-400 font-mono">{s.contact}</td>
                          <td className="py-3.5 text-right font-bold text-blue-400">{s.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* RENDER SUBTAB: CATEGORIES & BRANDS */}
              {(activeTab === 'categories' || activeTab === 'brands') && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  {['Laptops', 'Printers', 'Accessories', 'Storage', 'Repairs', 'Cyber Services'].map((c, i) => (
                    <div key={i} className="bg-[#050917] border border-[#1e293b]/30 rounded-2xl p-5">
                      <Grid className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                      <h4 className="text-xs font-bold text-white">{c}</h4>
                      <span className="text-[10px] text-slate-500">Active Node</span>
                    </div>
                  ))}
                </div>
              )}

              {/* RENDER SUBTAB: EMPLOYEES & TECHNICIANS */}
              {(activeTab === 'employees' || activeTab === 'technicians') && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead>
                      <tr className="text-slate-400 border-b border-[#1e293b]/40 pb-2 text-[10px] uppercase font-bold tracking-wider">
                        <th className="pb-3 pl-2">Employee ID</th>
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Assigned Role</th>
                        <th className="pb-3">Corporate Email</th>
                        <th className="pb-3 font-mono text-right">Job Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b]/30">
                      {mockEmployees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-[#0b1329]/30 transition-colors">
                          <td className="py-3.5 pl-2 font-mono text-white font-bold">{emp.id}</td>
                          <td className="py-3.5 text-white font-bold">{emp.name}</td>
                          <td className="py-3.5 text-blue-400 font-semibold">{emp.role}</td>
                          <td className="py-3.5 text-slate-400 font-mono">{emp.email}</td>
                          <td className="py-3.5 text-right">
                            <span className="bg-slate-900 text-slate-300 text-[9px] font-bold border border-slate-800 rounded px-2 py-0.5 uppercase">{emp.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* RENDER SUBTAB: COUPONS */}
              {activeTab === 'coupons' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {mockCoupons.map((c, i) => (
                    <div key={i} className="bg-[#050917] border border-[#1e293b]/30 rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="bg-blue-950/40 text-blue-400 border border-blue-900/40 text-[11px] font-mono font-bold px-2 py-1 rounded-lg uppercase tracking-wider">{c.code}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${c.status === 'Active' ? 'bg-green-950/20 text-green-400' : 'bg-rose-950/20 text-rose-400'}`}>{c.status}</span>
                      </div>
                      <p className="text-xs font-bold text-white">{c.discount}</p>
                      <div className="flex justify-between text-[10px] text-slate-500 pt-3 border-t border-[#1e293b]/20">
                        <span>Used: {c.usage}</span>
                        <span>Exp: {c.expiry}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* RENDER SUBTAB: BLOG */}
              {activeTab === 'blog' && (
                <div className="space-y-4 text-left">
                  <div className="bg-[#050917] border border-[#1e293b]/30 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Why SSD Upgrades Are Essential for Slow Office Laptops</h4>
                      <p className="text-xs text-slate-500">Listed under retail technical hardware advice. 450 views in last 7 days.</p>
                    </div>
                    <span className="text-[10px] bg-green-950/20 text-green-400 px-2.5 py-1 rounded font-bold uppercase">Published</span>
                  </div>
                  <div className="bg-[#050917] border border-[#1e293b]/30 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Securing Your Home WiFi Router: A Quick Cyber Guide</h4>
                      <p className="text-xs text-slate-500">Listed under cyber networking support advice. 210 views in last 7 days.</p>
                    </div>
                    <span className="text-[10px] bg-green-950/20 text-green-400 px-2.5 py-1 rounded font-bold uppercase">Published</span>
                  </div>
                </div>
              )}

              {/* RENDER SUBTAB: SYSTEM SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6 text-left">
                  <div className="bg-[#050917] border border-[#1e293b]/30 rounded-2xl p-6 space-y-4">
                    <h3 className="text-white text-sm font-bold border-b border-[#1e293b]/30 pb-2">Business Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block">Store Base Name</label>
                        <input type="text" value="NTIX Tech Solutions" className="w-full bg-[#030712] border border-[#1e293b] rounded-lg p-2.5 text-white font-bold" readOnly />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block">Default Base Currency</label>
                        <input type="text" value="Kenyan Shilling (KSh)" className="w-full bg-[#030712] border border-[#1e293b] rounded-lg p-2.5 text-white font-bold" readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RENDER SUBTAB: AUDIT LOGS */}
              {activeTab === 'audit-logs' && (
                <div className="bg-[#050917] border border-[#1e293b]/30 rounded-2xl p-5 font-mono text-[11px] space-y-3.5">
                  <div className="flex justify-between items-center pb-2 border-b border-[#1e293b]/30 text-slate-400 uppercase text-[10px]">
                    <span>Event Timestamp</span>
                    <span>System Administration Event Description</span>
                    <span>Operator Identity</span>
                  </div>
                  {mockAuditLogs.map((log, i) => (
                    <div key={i} className="flex justify-between items-start hover:bg-[#0e172a] p-2 rounded transition-colors gap-4">
                      <span className="text-slate-500 shrink-0">{log.time}</span>
                      <span className={`flex-1 text-left ${log.severity === 'Success' ? 'text-green-400' : log.severity === 'Warning' ? 'text-amber-400' : 'text-slate-300'}`}>
                        {log.event}
                      </span>
                      <span className="text-blue-400 font-bold shrink-0">{log.operator}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            /* RENDER VIEW 2: CORE DASHBOARD LANDSCAPE (Pixel-perfect matching of the snapshot) */
            <div className="space-y-8 animate-fadeIn">
              
              {/* DATE RANGE & GREETING HEADER */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="text-left">
                  <h1 className="font-display font-extrabold text-2xl tracking-tight text-white mb-1.5 uppercase">Dashboard</h1>
                  <p className="text-xs text-slate-400 font-medium">Welcome back, Admin! Here's what's happening with your store today.</p>
                </div>
                {/* Simulated Datepicker picker matching screenshot */}
                <div className="bg-[#070b19] border border-[#1e293b]/60 px-4 py-2 rounded-xl flex items-center gap-2.5 text-xs text-white hover:border-[#1e293b] transition-all cursor-pointer font-medium">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>May 12, 2024 - June 12, 2024</span>
                  <span className="text-[10px] text-slate-500">▼</span>
                </div>
              </div>

              {/* FIVE COLUMN TOTAL KPI METRICS GRID (Exactly matching snapshot) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* Card 1: Total Sales */}
                <div className="bg-[#070b19] border border-[#1e293b]/50 rounded-2xl p-4.5 flex flex-col justify-between hover:border-[#1e293b] transition-all group">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
                      <div className="w-7 h-7 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <DollarSign className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight pt-1 font-mono">KSh 1,250,000</h3>
                  </div>
                  {/* Growth & Sparkline */}
                  <div className="space-y-3.5 pt-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-emerald-400">↑ 15.6%</span>
                      <span className="text-[9px] text-slate-500 font-medium">vs last 30 days</span>
                    </div>
                    {/* Small Wave Sparkline */}
                    <div className="h-6 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                      <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                        <path d="M0,15 Q15,5 30,12 T60,5 T90,18 T100,6" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card 2: Orders */}
                <div className="bg-[#070b19] border border-[#1e293b]/50 rounded-2xl p-4.5 flex flex-col justify-between hover:border-[#1e293b] transition-all group">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Orders</span>
                      <div className="w-7 h-7 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight pt-1 font-mono">320</h3>
                  </div>
                  {/* Growth & Sparkline */}
                  <div className="space-y-3.5 pt-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-purple-400">↑ 12.5%</span>
                      <span className="text-[9px] text-slate-500 font-medium">vs last 30 days</span>
                    </div>
                    {/* Small Wave Sparkline */}
                    <div className="h-6 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                      <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                        <path d="M0,18 Q20,10 40,20 T70,8 T100,12" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card 3: Customers */}
                <div className="bg-[#070b19] border border-[#1e293b]/50 rounded-2xl p-4.5 flex flex-col justify-between hover:border-[#1e293b] transition-all group">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customers</span>
                      <div className="w-7 h-7 rounded-lg bg-teal-600/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight pt-1 font-mono">1,245</h3>
                  </div>
                  {/* Growth & Sparkline */}
                  <div className="space-y-3.5 pt-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-emerald-400">↑ 8.7%</span>
                      <span className="text-[9px] text-slate-500 font-medium">vs last 30 days</span>
                    </div>
                    {/* Small Wave Sparkline */}
                    <div className="h-6 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                      <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                        <path d="M0,12 Q25,18 50,6 T75,15 T100,4" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card 4: Products */}
                <div className="bg-[#070b19] border border-[#1e293b]/50 rounded-2xl p-4.5 flex flex-col justify-between hover:border-[#1e293b] transition-all group">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Products</span>
                      <div className="w-7 h-7 rounded-lg bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                        <Package className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight pt-1 font-mono">580</h3>
                  </div>
                  {/* Growth & Sparkline */}
                  <div className="space-y-3.5 pt-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-rose-400">↓ 2.4%</span>
                      <span className="text-[9px] text-slate-500 font-medium">vs last 30 days</span>
                    </div>
                    {/* Small Wave Sparkline */}
                    <div className="h-6 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                      <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                        <path d="M0,4 Q25,8 50,15 T75,10 T100,16" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card 5: Pending Repairs */}
                <div className="bg-[#070b19] border border-[#1e293b]/50 rounded-2xl p-4.5 flex flex-col justify-between hover:border-[#1e293b] transition-all group">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Repairs</span>
                      <div className="w-7 h-7 rounded-lg bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                        <Wrench className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight pt-1 font-mono">12</h3>
                  </div>
                  {/* Growth & Sparkline */}
                  <div className="space-y-3.5 pt-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-emerald-400">↑ 20.0%</span>
                      <span className="text-[9px] text-slate-500 font-medium">vs last 30 days</span>
                    </div>
                    {/* Small Wave Sparkline */}
                    <div className="h-6 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                      <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                        <path d="M0,20 Q30,6 60,16 T100,5" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

              {/* MIDDLE ROW LAYOUT: SALES OVERVIEW LINE CHART & RECENT ORDERS TABLE */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Line Chart Panel (Col Span 2) */}
                <div className="lg:col-span-2 bg-[#070b19] border border-[#1e293b]/40 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4">
                    <div className="text-left">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Sales Overview</h3>
                      <p className="text-[10px] text-slate-500 font-medium">KSh Revenue trends over the ongoing 30 days window</p>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-md shadow-blue-500/20" />
                        <span className="text-slate-300">This Month</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                        <span>Last Month</span>
                      </div>
                      {/* Dropdown select mock */}
                      <div className="bg-[#040814] border border-[#1e293b]/50 px-2 py-1 rounded text-slate-400 flex items-center gap-1 ml-2 font-semibold">
                        <span>Monthly</span>
                        <span className="text-[8px]">▼</span>
                      </div>
                    </div>
                  </div>

                  {/* Elegant High-Contrast Line Chart Shading */}
                  <div className="relative h-48 w-full pt-4">
                    <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                      {/* Grid guidelines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="0" y1="60" x2="500" y2="60" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />

                      {/* Line chart: This Month (Solid royal blue with drop-glow) */}
                      <path
                        d="M 10 95 L 80 80 L 150 72 L 220 50 L 290 55 L 360 38 L 430 35 L 490 12"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Under-shading area */}
                      <path
                        d="M 10 95 L 80 80 L 150 72 L 220 50 L 290 55 L 360 38 L 430 35 L 490 12 L 490 120 L 10 120 Z"
                        fill="url(#this-month-glow)"
                        opacity="0.12"
                      />

                      {/* Line chart: Last Month (Dashed dark slate/grey) */}
                      <path
                        d="M 10 110 L 80 98 L 150 92 L 220 84 L 290 74 L 360 76 L 430 62 L 490 58"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="4 4"
                      />

                      {/* Definitions for gorgeous gradients */}
                      <defs>
                        <linearGradient id="this-month-glow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Timeline axis labels (Precisely matching snapshot dates) */}
                    <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase mt-2.5 font-mono">
                      <span>May 12</span>
                      <span>May 17</span>
                      <span>May 22</span>
                      <span>May 27</span>
                      <span>Jun 1</span>
                      <span>Jun 6</span>
                      <span>Jun 12</span>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Panel (Col Span 1) */}
                <div className="bg-[#070b19] border border-[#1e293b]/40 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-center pb-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Recent Orders</h3>
                    <button 
                      onClick={() => setActiveTab('orders')} 
                      className="text-[10px] font-bold text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {/* High-fidelity custom table */}
                  <div className="overflow-x-auto text-xs font-medium">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-[#1e293b]/30 pb-2 text-[9px] uppercase font-bold tracking-wider">
                          <th className="pb-2">Order ID</th>
                          <th className="pb-2">Customer</th>
                          <th className="pb-2 text-right">Amount</th>
                          <th className="pb-2 text-right">Status</th>
                          <th className="pb-2 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e293b]/20">
                        {[
                          { id: '#NTX1205', name: 'John Mwangi', amount: 'KSh 45,000', status: 'Completed', color: 'bg-green-950/30 text-green-400 border-green-900', date: '12 Jun 2024' },
                          { id: '#NTX1204', name: 'Mary Wanjiku', amount: 'KSh 12,500', status: 'Processing', color: 'bg-amber-950/30 text-amber-400 border-amber-900', date: '12 Jun 2024' },
                          { id: '#NTX1203', name: 'Peter Mutua', amount: 'KSh 8,900', status: 'Completed', color: 'bg-green-950/30 text-green-400 border-green-900', date: '11 Jun 2024' },
                          { id: '#NTX1202', name: 'Grace Muthoni', amount: 'KSh 15,250', status: 'Pending', color: 'bg-blue-950/30 text-blue-400 border-blue-900', date: '11 Jun 2024' },
                          { id: '#NTX1201', name: 'David Kilonzo', amount: 'KSh 23,000', status: 'Completed', color: 'bg-green-950/30 text-green-400 border-green-900', date: '10 Jun 2024' },
                        ].map((o, idx) => (
                          <tr key={idx} className="hover:bg-[#0b1329]/20 transition-colors">
                            <td className="py-2.5 font-mono text-white font-bold">{o.id}</td>
                            <td className="py-2.5 text-slate-300 font-semibold">{o.name}</td>
                            <td className="py-2.5 text-right font-mono text-slate-100">{o.amount}</td>
                            <td className="py-2.5 text-right">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${o.color}`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-right text-[10px] font-mono text-slate-500">{o.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* FOURTH COLUMN ROW: 4 COOPERATIVE INTENSITY WIDGETS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Card 4.1: Top Selling Products */}
                <div className="bg-[#070b19] border border-[#1e293b]/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-[#1e293b] transition-all">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Top Selling Products</h3>
                    <button onClick={() => setActiveTab('products')} className="text-[9px] font-bold text-blue-400 hover:underline uppercase">View All</button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'HP ProBook 450 G9', count: 120, width: 'w-[90%]', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100&auto=format&fit=crop&q=80' },
                      { name: 'Dell Latitude 7420', count: 95, width: 'w-[75%]', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&auto=format&fit=crop&q=80' },
                      { name: 'iPhone 14 Pro Max', count: 80, width: 'w-[62%]', img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=100&auto=format&fit=crop&q=80' },
                      { name: 'Samsung Galaxy S23', count: 75, width: 'w-[58%]', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&auto=format&fit=crop&q=80' },
                      { name: 'Logitech Wireless Mouse', count: 60, width: 'w-[45%]', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&auto=format&fit=crop&q=80' }
                    ].map((p, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs text-left group/item">
                        <img src={p.img} className="w-8 h-8 rounded-lg bg-[#040814] object-contain p-1 border border-[#1e293b]/40 shrink-0" alt="" />
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-slate-200 group-hover/item:text-blue-400 transition-colors truncate">{p.name}</span>
                            <span className="font-mono text-[10px] font-bold text-slate-400 shrink-0">{p.count} sold</span>
                          </div>
                          {/* Horizontal progression bar */}
                          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                            <div className={`h-full bg-blue-500 rounded-full ${p.width} transition-all duration-300`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 4.2: Repair Status Overview (Circular Donut matching snapshot) */}
                <div className="bg-[#070b19] border border-[#1e293b]/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-[#1e293b] transition-all">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider text-left">Repair Status Overview</h3>
                  
                  {/* Real visual SVG Donut chart circle */}
                  <div className="flex items-center gap-4 py-1">
                    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {/* Under base circle */}
                        <circle cx="18" cy="18" r="16" fill="transparent" stroke="#10172a" strokeWidth="3" />
                        
                        {/* Donut sectors matching screenshot percentages */}
                        {/* In Progress - Blue (37.5%) -> length: 37.5 * 1.005 = 37.7 */}
                        <circle cx="18" cy="18" r="16" fill="transparent" stroke="#3b82f6" strokeWidth="3" strokeDasharray="37.7 100" strokeDashoffset="0" />
                        
                        {/* Pending - Amber (25.0%) -> length: 25 * 1.005 = 25.1 */}
                        <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f59e0b" strokeWidth="3" strokeDasharray="25.1 100" strokeDashoffset="-37.7" />
                        
                        {/* Completed - Green (31.3%) -> length: 31.3 * 1.005 = 31.5 */}
                        <circle cx="18" cy="18" r="16" fill="transparent" stroke="#10b981" strokeWidth="3" strokeDasharray="31.5 100" strokeDashoffset="-62.8" />
                        
                        {/* On Hold - Red (6.2%) -> length: 6.2 * 1.005 = 6.2 */}
                        <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f43f5e" strokeWidth="3" strokeDasharray="6.2 100" strokeDashoffset="-94.3" />
                      </svg>
                      {/* Inside center text block */}
                      <div className="absolute text-center">
                        <span className="text-base font-extrabold text-white block leading-none font-mono">48</span>
                        <span className="text-[7.5px] text-slate-500 block font-bold uppercase tracking-wider mt-0.5">Total Repairs</span>
                      </div>
                    </div>

                    <div className="text-[10px] space-y-1.5 w-full text-left font-medium">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="text-slate-400">Pending</span>
                        </div>
                        <span className="font-bold text-white font-mono">12 (25%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-slate-400">In Progress</span>
                        </div>
                        <span className="font-bold text-white font-mono">18 (37.5%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span className="text-slate-400">Completed</span>
                        </div>
                        <span className="font-bold text-white font-mono">15 (31.3%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <span className="text-slate-400">On Hold</span>
                        </div>
                        <span className="font-bold text-white font-mono">3 (6.2%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 4.3: Bookings Overview (Horizontal matching progress) */}
                <div className="bg-[#070b19] border border-[#1e293b]/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-[#1e293b] transition-all">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Bookings Overview</h3>
                    <button onClick={() => setActiveTab('bookings')} className="text-[9px] font-bold text-blue-400 hover:underline uppercase">View All</button>
                  </div>
                  <div className="space-y-2.5 text-[10px] text-left">
                    {[
                      { name: 'Cyber Cafe (Internet)', count: 24, width: 'w-[85%]', color: 'bg-blue-500' },
                      { name: 'Printing Services', count: 18, width: 'w-[68%]', color: 'bg-purple-500' },
                      { name: 'Computer Rentals', count: 12, width: 'w-[52%]', color: 'bg-cyan-500' },
                      { name: 'Graphic Design', count: 8, width: 'w-[38%]', color: 'bg-pink-500' },
                      { name: 'Other Services', count: 6, width: 'w-[28%]', color: 'bg-slate-500' },
                    ].map((b, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-slate-300 font-semibold">
                          <span className="truncate max-w-[130px]">{b.name}</span>
                          <span className="font-bold text-white font-mono">{b.count}</span>
                        </div>
                        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                          <div className={`h-full ${b.color} rounded-full ${b.width} transition-all duration-300`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 4.4: Quick Actions panel with gorgeous color gradient action buttons */}
                <div className="bg-[#070b19] border border-[#1e293b]/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-[#1e293b] transition-all">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider text-left">Quick Actions</h3>
                  
                  <div className="space-y-2 flex-1 flex flex-col justify-center">
                    
                    {/* Action 1: Add New Product */}
                    <button 
                      onClick={() => setShowProductModal(true)}
                      className="w-full py-2 px-3 bg-[#0f172a] hover:bg-blue-600 border border-[#1e293b]/80 hover:border-blue-500 text-slate-300 hover:text-white rounded-xl text-[11px] font-bold tracking-wide transition-all duration-150 cursor-pointer flex items-center gap-2"
                    >
                      <div className="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                      <span>Add New Product</span>
                    </button>

                    {/* Action 2: New Service Booking */}
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      className="w-full py-2 px-3 bg-[#0f172a] hover:bg-purple-600 border border-[#1e293b]/80 hover:border-purple-500 text-slate-300 hover:text-white rounded-xl text-[11px] font-bold tracking-wide transition-all duration-150 cursor-pointer flex items-center gap-2"
                    >
                      <div className="w-5 h-5 rounded bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <span>New Service Booking</span>
                    </button>

                    {/* Action 3: Create Repair Ticket */}
                    <button 
                      onClick={() => setShowRepairModal(true)}
                      className="w-full py-2 px-3 bg-[#0f172a] hover:bg-amber-600 border border-[#1e293b]/80 hover:border-amber-500 text-slate-300 hover:text-white rounded-xl text-[11px] font-bold tracking-wide transition-all duration-150 cursor-pointer flex items-center gap-2"
                    >
                      <div className="w-5 h-5 rounded bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <span>Create Repair Ticket</span>
                    </button>

                    {/* Action 4: Add New Customer */}
                    <button 
                      onClick={() => setShowCustomerModal(true)}
                      className="w-full py-2 px-3 bg-[#0f172a] hover:bg-emerald-600 border border-[#1e293b]/80 hover:border-emerald-500 text-slate-300 hover:text-white rounded-xl text-[11px] font-bold tracking-wide transition-all duration-150 cursor-pointer flex items-center gap-2"
                    >
                      <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span>Add New Customer</span>
                    </button>

                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* METICULOUS SYSTEM FOOTER BAR (Precisely matching bottom row in screenshot) */}
        <footer className="bg-[#030712] py-4 px-6 border-t border-[#1e293b]/30 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-semibold tracking-wide shrink-0">
          <p>© 2026 NTIX TECH SOLUTIONS. All rights reserved.</p>
          <p className="font-mono mt-1 sm:mt-0 text-[10px]">Version 1.0.0</p>
        </footer>

      </main>

      {/* --- ADD PRODUCT MODAL --- */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#070b19] border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 animate-scaleUp">
            <h3 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">Add New Product</h3>
            <form onSubmit={handleProductSubmit} className="space-y-3.5 text-xs text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Product Name</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. HP EliteBook 840 G10"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 font-semibold text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Retail Price (KSh)</label>
                <input
                  type="number"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 font-mono text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Brand</label>
                <input
                  type="text"
                  value={newProdBrand}
                  onChange={(e) => setNewProdBrand(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Category</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white bg-slate-900 cursor-pointer"
                >
                  <option value="Laptops">Laptops</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Printers">Printers</option>
                  <option value="Storage">Storage</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 rounded-xl font-bold cursor-pointer transition-colors text-center text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md shadow-blue-900/20 text-center"
                >
                  Add Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PRODUCT MODAL --- */}
      {showEditProductModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#070b19] border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 animate-scaleUp">
            <h3 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">Edit Product Specifications</h3>
            <form onSubmit={handleEditProductSubmit} className="space-y-3.5 text-xs text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Product Name</label>
                <input
                  type="text"
                  value={editProdName}
                  onChange={(e) => setEditProdName(e.target.value)}
                  placeholder="e.g. HP EliteBook 840 G10"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 font-semibold text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Retail Price (KSh)</label>
                <input
                  type="number"
                  value={editProdPrice}
                  onChange={(e) => setEditProdPrice(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 font-mono text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Brand</label>
                <input
                  type="text"
                  value={editProdBrand}
                  onChange={(e) => setEditProdBrand(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Category</label>
                <select
                  value={editProdCategory}
                  onChange={(e) => setEditProdCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white bg-slate-900 cursor-pointer"
                >
                  <option value="Laptops">Laptops</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Printers">Printers</option>
                  <option value="Storage">Storage</option>
                </select>
              </div>

              <div className="space-y-1 flex items-center justify-between pt-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono cursor-pointer select-none">
                  In Stock Availability
                </label>
                <input
                  type="checkbox"
                  checked={editProdInStock}
                  onChange={(e) => setEditProdInStock(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProductModal(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 rounded-xl font-bold cursor-pointer transition-colors text-center text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md shadow-blue-900/20 text-center"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CREATE REPAIR TICKET MODAL --- */}
      {showRepairModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#070b19] border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 animate-scaleUp">
            <h3 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">Create Repair Ticket</h3>
            <form onSubmit={handleRepairSubmit} className="space-y-3.5 text-xs text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Customer Name</label>
                <input
                  type="text"
                  value={newRepCust}
                  onChange={(e) => setNewRepCust(e.target.value)}
                  placeholder="e.g. Peter Mutua"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 font-semibold text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Customer Phone</label>
                <input
                  type="text"
                  value={newRepPhone}
                  onChange={(e) => setNewRepPhone(e.target.value)}
                  placeholder="e.g. +254 712 345 678"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 font-mono text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Device / Model</label>
                <input
                  type="text"
                  value={newRepDevice}
                  onChange={(e) => setNewRepDevice(e.target.value)}
                  placeholder="e.g. MacBook Pro M2"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Reported Issue</label>
                <textarea
                  value={newRepIssue}
                  onChange={(e) => setNewRepIssue(e.target.value)}
                  placeholder="e.g. Screen replacement & motherboard short diagnosis"
                  rows={2}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRepairModal(false)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 rounded-xl font-bold cursor-pointer transition-colors text-center text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md shadow-amber-900/20 text-center"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD CUSTOMER MODAL --- */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#070b19] border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 animate-scaleUp">
            <h3 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">Onboard New Customer</h3>
            <form onSubmit={handleCustomerSubmit} className="space-y-3.5 text-xs text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Customer Full Name</label>
                <input
                  type="text"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Florence Otieno"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 font-semibold text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Email Address</label>
                <input
                  type="email"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  placeholder="e.g. florence.otieno@gmail.com"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 font-semibold text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Mobile Number</label>
                <input
                  type="text"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="e.g. +254 712 999 888"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Client Level / Type</label>
                <select
                  value={newCustType}
                  onChange={(e) => setNewCustType(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white bg-slate-900 cursor-pointer"
                >
                  <option value="Regular">Regular Walk-in</option>
                  <option value="VIP">VIP Client</option>
                  <option value="Corporate">Corporate Account</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 rounded-xl font-bold cursor-pointer transition-colors text-center text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md shadow-emerald-900/20 text-center"
                >
                  Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SERVICE BOOKING MODAL --- */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#070b19] border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 animate-scaleUp">
            <h3 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">Book Cyber Service Slot</h3>
            <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Client Name</label>
                <input
                  type="text"
                  value={newBookCust}
                  onChange={(e) => setNewBookCust(e.target.value)}
                  placeholder="e.g. Mary Wanjiku"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500 font-semibold text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Selected Service</label>
                <select
                  value={newBookService}
                  onChange={(e) => setNewBookService(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500 text-white bg-slate-900 cursor-pointer"
                >
                  <option value="Cyber Cafe (Internet)">Cyber Cafe (Internet Workstation)</option>
                  <option value="Printing Services">Bulk Laser Printing</option>
                  <option value="Computer Rentals">High-Speed Laptop Rental</option>
                  <option value="Graphic Design">Custom Poster / Card Design</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Date</label>
                <input
                  type="date"
                  value={newBookDate}
                  onChange={(e) => setNewBookDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500 text-white font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Locked Time Slot</label>
                <input
                  type="text"
                  value={newBookTime}
                  onChange={(e) => setNewBookTime(e.target.value)}
                  placeholder="e.g. 10:00 AM - 12:00 PM"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500 text-white"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 rounded-xl font-bold cursor-pointer transition-colors text-center text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md shadow-purple-900/20 text-center"
                >
                  Lock Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
