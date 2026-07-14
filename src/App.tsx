import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getDataStore, saveDataStore, 
  INITIAL_PRODUCTS, INITIAL_SERVICES, INITIAL_REPAIRS, INITIAL_BOOKINGS, INITIAL_ORDERS 
} from './data';
import { Product, Service, Repair, Booking, Order, User, CartItem } from './types';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import CustomerHome from './components/CustomerHome';
import CustomerShop from './components/CustomerShop';
import CustomerProductDetail from './components/CustomerProductDetail';
import CustomerServices from './components/CustomerServices';
import CustomerBooking from './components/CustomerBooking';
import CustomerCart from './components/CustomerCart';
import CustomerCheckout from './components/CustomerCheckout';
import CustomerRepairTracking from './components/CustomerRepairTracking';
import CustomerDashboard from './components/CustomerDashboard';
import AuthPages from './components/AuthPages';
import AdminDashboardView from './components/AdminDashboardView';
import AICopilot from './components/AICopilot';
import BigwaSokoniView from './components/BigwaSokoniView';

import { Play, Layers, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  // --- CORE DATABASE STATES ---
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // --- CART & WISHLIST CLIENT STATES ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // --- NAVIGATION STATE ---
  // Default view is the home page
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [shopSearchQuery, setShopSearchQuery] = useState<string>('');
  const [demoOpen, setDemoOpen] = useState<boolean>(false);

  // --- DARK MODE STATE ---
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('nt_dark_mode') === 'true';
  });

  // Synchronize dark mode class with root html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nt_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nt_dark_mode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle interactive demo switcher on Alt + D
      if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setDemoOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- INITIAL LOAD ---
  useEffect(() => {
    const store = getDataStore();
    setProducts(store.products);
    setServices(store.services);
    setRepairs(store.repairs);
    setBookings(store.bookings);
    setOrders(store.orders);
    setUser(store.user);

    // Load cart/wishlist
    const savedCart = localStorage.getItem('nt_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedWishlist = localStorage.getItem('nt_wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save cart changes
  const updateCartAndPersist = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('nt_cart', JSON.stringify(newCart));
  };

  const updateWishlistAndPersist = (newWishlist: Product[]) => {
    setWishlist(newWishlist);
    localStorage.setItem('nt_wishlist', JSON.stringify(newWishlist));
  };

  // --- ACTION HANDLERS ---
  const handleAddToCart = (product: Product, quantity = 1) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      const updated = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      updateCartAndPersist(updated);
    } else {
      updateCartAndPersist([...cart, { product, quantity }]);
    }
    alert(`Added ${quantity}x "${product.name}" to your cart!`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    const updated = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    updateCartAndPersist(updated);
  };

  const handleRemoveCartItem = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    updateCartAndPersist(updated);
  };

  const handleAddToWishlist = (product: Product) => {
    const exists = wishlist.find((p) => p.id === product.id);
    if (exists) {
      updateWishlistAndPersist(wishlist.filter((p) => p.id !== product.id));
      alert(`Removed "${product.name}" from your wishlist.`);
    } else {
      updateWishlistAndPersist([...wishlist, product]);
      alert(`Added "${product.name}" to your wishlist!`);
    }
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (!existing) {
      updateCartAndPersist([...cart, { product, quantity }]);
    }
    setActiveView('checkout');
  };

  const handlePlaceOrder = (newOrder: Order) => {
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveDataStore({ orders: updatedOrders });
    
    // Clear cart
    updateCartAndPersist([]);
  };

  const handleBookingComplete = (newBooking: Booking) => {
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    saveDataStore({ bookings: updatedBookings });
  };

  const handleAddProduct = (newProduct: Product) => {
    const updatedProducts = [newProduct, ...products];
    setProducts(updatedProducts);
    saveDataStore({ products: updatedProducts });
  };

  const handleEditProduct = (updatedProduct: Product) => {
    const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updatedProducts);
    saveDataStore({ products: updatedProducts });
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    saveDataStore({ products: updatedProducts });
  };

  const handleAddRepair = (newRepair: Repair) => {
    const updatedRepairs = [newRepair, ...repairs];
    setRepairs(updatedRepairs);
    saveDataStore({ repairs: updatedRepairs });
  };

  const handleUpdateRepairStatus = (repairId: string, status: Repair['status']) => {
    const updatedRepairs = repairs.map(r => r.id === repairId ? { ...r, status } : r);
    setRepairs(updatedRepairs);
    saveDataStore({ repairs: updatedRepairs });
  };

  const handleDeleteRepair = (repairId: string) => {
    const updatedRepairs = repairs.filter(r => r.id !== repairId);
    setRepairs(updatedRepairs);
    saveDataStore({ repairs: updatedRepairs });
  };

  const handleUpdateBookingStatus = (bookingId: string, status: Booking['status']) => {
    const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status } : b);
    setBookings(updatedBookings);
    saveDataStore({ bookings: updatedBookings });
  };

  const handleDeleteBooking = (bookingId: string) => {
    const updatedBookings = bookings.filter(b => b.id !== bookingId);
    setBookings(updatedBookings);
    saveDataStore({ bookings: updatedBookings });
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updatedOrders);
    saveDataStore({ orders: updatedOrders });
  };

  const handleDeleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter(o => o.id !== orderId);
    setOrders(updatedOrders);
    saveDataStore({ orders: updatedOrders });
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    saveDataStore({ user: loggedInUser });
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    saveDataStore({ user: updatedUser });
  };

  const handleLogout = () => {
    setUser(null);
    saveDataStore({ user: null });
    setActiveView('home');
  };

  // Switcher support
  const handleSelectProductFromGrid = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product-detail');
  };

  // List of all screens to display in demo bar
  const demoScreens = [
    { id: 'home', label: '1. Home Page' },
    { id: 'bigwa-sokoni', label: '🔥 Bigwa Sokoni' },
    { id: 'shop', label: '2. Shop Category' },
    { id: 'product-detail', label: '3. Product Detail' },
    { id: 'services', label: '4. Services Page' },
    { id: 'booking', label: '5. Service Booking' },
    { id: 'login', label: '6. User Login' },
    { id: 'register', label: '7. User Register' },
    { id: 'admin-login', label: '8. Admin Login' },
    { id: 'admin-dashboard', label: '9. Admin Dashboard' },
    { id: 'cart', label: '10. Cart Page' },
    { id: 'checkout', label: '11. Checkout Page' },
    { id: 'repair-tracking', label: '12. Repair Tracking' },
    { id: 'user-dashboard', label: '13. User Dashboard' },
    { id: 'ai-copilot', label: '14. AI Copilot (Search)' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-100 relative transition-colors duration-300" id="app-root-frame">
      
      {/* 🖥️ DYNAMIC ROUTER VIEW CONTAINER */}
      <div className="flex-1 flex flex-col">
        {activeView === 'admin-dashboard' ? (
          /* Render admin dashboard alone with its custom dark theme */
          <AdminDashboardView
            orders={orders}
            bookings={bookings}
            repairs={repairs}
            products={products}
            onNavigate={setActiveView}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddRepair={handleAddRepair}
            onUpdateRepairStatus={handleUpdateRepairStatus}
            onDeleteRepair={handleDeleteRepair}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onDeleteBooking={handleDeleteBooking}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
          />
        ) : (
          /* Render full customer layout */
          <>
            <Header
              activeView={activeView}
              onNavigate={setActiveView}
              cart={cart}
              wishlistCount={wishlist.length}
              user={user}
              onLogout={handleLogout}
              onSearch={setShopSearchQuery}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />

            {/* View Switching Router */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="flex-grow flex flex-col"
                >
                  {activeView === 'home' && (
                    <CustomerHome
                      products={products}
                      onNavigate={setActiveView}
                      onSelectProduct={handleSelectProductFromGrid}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  )}

                  {activeView === 'bigwa-sokoni' && (
                    <BigwaSokoniView
                      products={products}
                      services={services}
                      onNavigate={setActiveView}
                      onSelectProduct={handleSelectProductFromGrid}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  )}

                  {activeView === 'shop' && (
                    <CustomerShop
                      products={products}
                      services={services}
                      onSelectProduct={handleSelectProductFromGrid}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      searchQuery={shopSearchQuery}
                      onSearchQueryChange={setShopSearchQuery}
                      onNavigate={setActiveView}
                    />
                  )}

                  {activeView === 'product-detail' && (
                    <CustomerProductDetail
                      product={selectedProduct || products[0]}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      onNavigate={setActiveView}
                      onBuyNow={handleBuyNow}
                    />
                  )}

                  {activeView === 'services' && (
                    <CustomerServices
                      services={services}
                      onBookService={(s) => {
                        setSelectedProduct(null); // Clear selected if booking
                        setActiveView('booking');
                      }}
                      onContactSupport={() => {
                        alert('Contacting NTIX Tech Solutions support: 0111915606 / ntixtechsolutions@gmail.com');
                      }}
                    />
                  )}

                  {activeView === 'booking' && (
                    <CustomerBooking
                      services={services}
                      initialSelectedService={null}
                      user={user}
                      onBookingComplete={handleBookingComplete}
                      onNavigate={setActiveView}
                    />
                  )}

                  {activeView === 'cart' && (
                    <CustomerCart
                      cart={cart}
                      onUpdateQuantity={handleUpdateCartQuantity}
                      onRemoveItem={handleRemoveCartItem}
                      onNavigate={setActiveView}
                    />
                  )}

                  {activeView === 'checkout' && (
                    <CustomerCheckout
                      cart={cart}
                      user={user}
                      onPlaceOrder={handlePlaceOrder}
                      onNavigate={setActiveView}
                    />
                  )}

                  {activeView === 'repair-tracking' && (
                    <CustomerRepairTracking repairs={repairs} />
                  )}

                  {activeView === 'ai-copilot' && (
                    <AICopilot onNavigate={setActiveView} />
                  )}

                  {activeView === 'user-dashboard' && (
                    user ? (
                      <CustomerDashboard
                        user={user}
                        orders={orders}
                        bookings={bookings}
                        repairs={repairs}
                        wishlist={wishlist}
                        onLogout={handleLogout}
                        onNavigate={setActiveView}
                        onUpdateProfile={handleUpdateProfile}
                      />
                    ) : (
                      <AuthPages
                        onLogin={handleLogin}
                        onNavigate={setActiveView}
                        type="login"
                      />
                    )
                  )}

                  {activeView === 'login' && (
                    <AuthPages
                      onLogin={handleLogin}
                      onNavigate={setActiveView}
                      type="login"
                    />
                  )}

                  {activeView === 'register' && (
                    <AuthPages
                      onLogin={handleLogin}
                      onNavigate={setActiveView}
                      type="register"
                    />
                  )}

                  {activeView === 'admin-login' && (
                    <AuthPages
                      onLogin={handleLogin}
                      onNavigate={setActiveView}
                      type="admin-login"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

            <Footer />
          </>
        )}
      </div>

      {/* 🛠️ BOTTOM FLOATING INTERACTIVE DEMO CONTROLLER */}
      <div 
        className={`fixed bottom-4 right-4 z-40 text-white font-sans transition-all duration-300 select-none ${
          demoOpen 
            ? 'left-4 md:left-auto bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-4 max-w-sm md:max-w-md backdrop-blur-md animate-fadeIn' 
            : 'bg-slate-900/90 border border-slate-800 rounded-full shadow-lg px-4 py-2 flex items-center gap-2 hover:bg-slate-900 cursor-pointer backdrop-blur-sm scale-95 hover:scale-100'
        }`} 
        id="demo-controller-floating"
        onDoubleClick={() => {
          if (!demoOpen) {
            setDemoOpen(true);
          }
        }}
        title={!demoOpen ? "Double-click to Maximize or Alt+D" : undefined}
      >
        {demoOpen ? (
          <>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs font-black tracking-wider uppercase">Demo Switcher</h3>
                  <kbd className="text-[8.5px] bg-slate-800/80 text-amber-400 font-mono font-bold px-1.5 py-0.5 rounded border border-slate-700/60 shadow-sm" title="Press Alt + D to toggle">Alt + D</kbd>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded">{demoScreens.length} screens</span>
                <button 
                  onClick={() => setDemoOpen(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold px-1 py-0.5 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                >
                  Hide
                </button>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-snug mb-3">
              This demo implements <strong>all {demoScreens.length} screens</strong>. Toggle views instantly:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-32 overflow-y-auto pr-1">
              {demoScreens.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    if (sc.id === 'product-detail' && !selectedProduct) {
                      setSelectedProduct(products[0]);
                    }
                    setActiveView(sc.id);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-[9px] font-bold text-left transition-all truncate border cursor-pointer ${
                    activeView === sc.id
                      ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <button 
            onClick={() => setDemoOpen(true)}
            className="flex items-center gap-2 w-full text-left"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold tracking-tight text-slate-200">Demo Screens ({demoScreens.length})</span>
            <kbd className="text-[8.5px] bg-slate-850 text-slate-400 font-mono px-1 py-0.5 rounded border border-slate-850">Alt + D</kbd>
          </button>
        )}
      </div>

    </div>
  );
}
