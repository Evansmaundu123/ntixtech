import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CustomerCheckoutProps {
  cart: CartItem[];
  user: any;
  onPlaceOrder: (order: Order) => void;
  onNavigate: (view: string) => void;
}

export default function CustomerCheckout({
  cart,
  user,
  onPlaceOrder,
  onNavigate
}: CustomerCheckoutProps) {
  const [fullName, setFullName] = useState(user ? user.fullName : 'John Doe');
  const [email, setEmail] = useState(user ? user.email : 'maunduevans2004@gmail.com');
  const [phone, setPhone] = useState(user ? user.phone : '0111915606');
  const [address, setAddress] = useState('Kibwezi Town, Near Highway');
  const [city, setCity] = useState('Kibwezi');
  const [county, setCounty] = useState('Makueni');
  const [paymentMethod, setPaymentMethod] = useState<'M-PESA' | 'Card Payment' | 'Airtel Money'>('M-PESA');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isOrdered, setIsOrdered] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 300 : 0;
  const total = subtotal + deliveryFee;

  const countiesList = [
    'Makueni', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Kajiado', 'Machakos', 'Uasin Gishu'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('You must accept the terms of service.');
      return;
    }

    const orderId = `#TH${Math.floor(1004 + Math.random() * 8000)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: fullName,
      email,
      phone,
      address,
      city,
      county,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      subtotal,
      deliveryFee,
      total,
      status: 'Pending',
      paymentMethod,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    onPlaceOrder(newOrder);
    setCreatedOrder(newOrder);
    setIsOrdered(true);
  };

  if (isOrdered && createdOrder) {
    return (
      <div className="w-full bg-slate-50 py-16 font-sans flex-1" id="customer-checkout-success">
        <div className="max-w-md mx-auto bg-white border border-gray-100 rounded-3xl p-8 text-center shadow-sm space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-xl text-slate-900">Order Placed Successfully!</h2>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              We received your order. Standard delivery is scheduled within 2 to 4 hours in Makueni County and surrounding regions.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs space-y-2 text-left font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Order ID:</span>
              <span className="font-bold text-slate-800">{createdOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Grand Total:</span>
              <span className="font-bold text-blue-600">KSh {createdOrder.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment:</span>
              <span className="font-bold text-slate-800">{createdOrder.paymentMethod}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('user-dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer"
            >
              Go to My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 py-10 font-sans flex-1" id="customer-checkout">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header link */}
        <button
          onClick={() => onNavigate('cart')}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 font-bold mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping Cart</span>
        </button>

        <h1 className="font-display font-extrabold text-2xl text-slate-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Billing Details pane (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
            <h2 className="font-display font-bold text-base text-slate-900 pb-2 border-b border-gray-50">Billing Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Phone Number *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-mono text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Delivery Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, apartment number, block..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Town / City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">County *</label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-semibold cursor-pointer bg-white"
                >
                  {countiesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'M-PESA', label: 'M-PESA', color: 'bg-green-600' },
                  { id: 'Card Payment', label: 'Card Payment', color: 'bg-blue-600' },
                  { id: 'Airtel Money', label: 'Airtel Money', color: 'bg-red-600' }
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? 'border-blue-600 bg-blue-50/20 font-bold text-blue-700'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <span className="text-[10px] font-bold">{pm.label}</span>
                    <input
                      type="radio"
                      name="checkout-payment-method"
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id as any)}
                      className="mt-2 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Your Order pane (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h2 className="font-display font-bold text-base text-slate-900 pb-2 border-b border-gray-50">Your Order</h2>

              <div className="divide-y divide-gray-50 text-xs">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between py-3 items-center">
                    <div className="max-w-[70%]">
                      <h4 className="font-bold text-slate-800 truncate">{item.product.name}</h4>
                      <span className="text-gray-400 font-medium">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-slate-800 font-mono">
                      KSh {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between py-3 pt-4 font-bold text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-800 font-mono">KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 font-bold text-slate-500">
                  <span>Delivery</span>
                  <span className="text-slate-800 font-mono">KSh {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-4 text-sm font-bold border-t border-gray-100 text-slate-800">
                  <span>Total</span>
                  <span className="text-blue-600 font-mono">KSh {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Data disclaimer */}
              <label className="flex items-start gap-2.5 text-[10px] text-gray-500 font-medium cursor-pointer leading-snug">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <span>Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.</span>
              </label>

              <button
                type="submit"
                className="w-full bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold py-3.5 rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider text-center"
              >
                Place Order
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
