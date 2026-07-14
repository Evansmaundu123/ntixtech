import React from 'react';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';

interface CustomerCartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onNavigate: (view: string) => void;
}

export default function CustomerCart({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate
}: CustomerCartProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 300 : 0; // Flat flat delivery fee as in checkout screens
  const total = subtotal + deliveryFee;

  return (
    <div className="w-full bg-slate-50 py-10 font-sans flex-1" id="customer-cart">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="font-display font-extrabold text-2xl text-slate-900 mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm max-w-lg mx-auto">
            <ShoppingBag className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800">Your shopping cart is empty</h3>
            <p className="text-xs text-gray-400 mt-1">
              Add some certified tech hardware or accessories from our storefront to start purchasing.
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go to Shop Store</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Products Table Pane */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 overflow-x-auto">
                <table className="w-full min-w-[500px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-3">
                      <th className="pb-3 w-1/2">Product</th>
                      <th className="pb-3 text-center">Price</th>
                      <th className="pb-3 text-center">Quantity</th>
                      <th className="pb-3 text-right">Subtotal</th>
                      <th className="pb-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {cart.map((item) => (
                      <tr key={item.product.id} className="group">
                        <td className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 border border-gray-100 rounded-lg p-1.5 flex items-center justify-center shrink-0">
                              <img src={item.product.image} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{item.product.name}</h4>
                              <p className="text-[10px] text-gray-400 mt-0.5">{item.product.brand} · {item.product.category}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 text-center font-mono font-bold text-slate-800">
                          KSh {item.product.price.toLocaleString()}
                        </td>

                        <td className="py-4">
                          <div className="flex items-center justify-between bg-slate-50 p-1 rounded-lg border border-slate-200 w-24 mx-auto">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-white rounded transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-xs font-bold text-slate-800">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-white rounded transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        <td className="py-4 text-right font-mono font-bold text-slate-800">
                          KSh {(item.product.price * item.quantity).toLocaleString()}
                        </td>

                        <td className="py-4 text-right pl-4">
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons underneath */}
              <div className="border-t border-gray-100 p-6 flex justify-between items-center bg-slate-50/50">
                <button
                  onClick={() => onNavigate('shop')}
                  className="bg-white border border-gray-200 hover:border-gray-400 text-slate-700 text-[11px] font-bold py-2.5 px-5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </button>
              </div>
            </div>

            {/* Cart Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider">Cart Totals</h3>

              <div className="divide-y divide-gray-50 text-xs">
                <div className="flex justify-between py-3">
                  <span className="font-bold text-slate-500">Subtotal</span>
                  <span className="font-bold text-slate-800 font-mono">KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-bold text-slate-500">Delivery Fee</span>
                  <span className="font-bold text-slate-800 font-mono">KSh {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-4 text-sm font-bold border-t border-gray-100">
                  <span className="text-slate-800">Grand Total</span>
                  <span className="text-blue-600 font-mono">KSh {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3.5 rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider text-center block"
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
