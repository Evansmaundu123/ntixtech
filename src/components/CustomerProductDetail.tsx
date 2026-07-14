import React, { useState } from 'react';
import { Star, Heart, Share2, Shuffle, Check, Plus, Minus, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface CustomerProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onAddToWishlist: (product: Product) => void;
  onNavigate: (view: string) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export default function CustomerProductDetail({
  product,
  onAddToCart,
  onAddToWishlist,
  onNavigate,
  onBuyNow
}: CustomerProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [mainImage, setMainImage] = useState(product.image);

  // Reset state when product changes
  React.useEffect(() => {
    setMainImage(product.image);
    setQuantity(1);
  }, [product]);

  // Generate simulated category-specific secondary images for thumbnails
  const thumbnails = React.useMemo(() => {
    const img = product.image;
    const cat = product.category.toLowerCase();
    if (cat === 'laptops') {
      return [
        img,
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&auto=format&fit=crop&q=80'
      ];
    } else if (cat === 'accessories') {
      return [
        img,
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1541140111813-8222e9d90981?w=400&auto=format&fit=crop&q=80'
      ];
    } else if (cat === 'storage') {
      return [
        img,
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1628557118391-46820ef0d859?w=400&auto=format&fit=crop&q=80'
      ];
    }
    return [img, img, img, img];
  }, [product]);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="w-full bg-slate-50 py-8 font-sans flex-1" id="customer-product-detail">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button & Breadcrumbs */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => onNavigate('shop')}
            className="p-2 bg-white hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer border border-gray-100 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-xs text-gray-500 font-medium">
            <span>Home</span> <span className="mx-1">/</span> 
            <span>Computers</span> <span className="mx-1">/</span> 
            <span>Laptops</span> <span className="mx-1">/</span> 
            <span className="text-slate-800 font-semibold">{product.name}</span>
          </div>
        </div>

        {/* Product Box */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-8">
          
          {/* Images Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-slate-50 border border-gray-100 rounded-2xl flex items-center justify-center p-6 overflow-hidden">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain transform hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {thumbnails.map((thumb, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(thumb)}
                  className={`aspect-square bg-slate-50 border rounded-xl overflow-hidden p-2 flex items-center justify-center cursor-pointer transition-all ${
                    mainImage === thumb 
                      ? 'border-blue-600 ring-2 ring-blue-100' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={thumb} alt={`Thumbnail ${index}`} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Core Info Details */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-2.5 py-1 rounded-md">
                {product.brand}
              </span>
              <h1 className="font-display font-bold text-2xl text-slate-900 mt-3 leading-tight">
                {product.name}
              </h1>

              {/* Reviews & Star Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star 
                      key={idx} 
                      className={`w-4 h-4 ${idx < Math.floor(product.rating) ? 'fill-yellow-400' : 'text-gray-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-800">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewsCount} reviews)</span>
              </div>

              {/* Price Tag */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-bold font-mono text-blue-600">
                  KSh {product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="text-base text-gray-400 line-through font-mono">
                    KSh {product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* In Stock Badge */}
              <div className="mt-3">
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-700 font-bold px-2.5 py-0.5 rounded-full border border-green-200 uppercase">
                    <Check className="w-3.5 h-3.5" />
                    <span>In Stock</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-red-50 text-red-700 font-bold px-2.5 py-0.5 rounded-full border border-red-200 uppercase">
                    <span>Out of Stock</span>
                  </span>
                )}
              </div>

              {/* Specifications snippet */}
              <ul className="mt-6 space-y-2 border-t border-b border-gray-100 py-4">
                {product.specs.map((spec, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 space-y-4">
              {/* Quantity Selector and Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Quantity picker */}
                <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-xl border border-slate-200 sm:w-32 shrink-0">
                  <button 
                    onClick={handleDecrease}
                    className="p-1.5 text-slate-500 hover:bg-white rounded-lg hover:text-slate-800 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-sm font-bold text-slate-800">{quantity}</span>
                  <button 
                    onClick={handleIncrease}
                    className="p-1.5 text-slate-500 hover:bg-white rounded-lg hover:text-slate-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={() => onAddToCart(product, quantity)}
                  className="flex-1 bg-[#1e3a8a] hover:bg-[#172554] text-white text-xs font-bold py-3.5 px-6 rounded-xl shadow-md transition-all cursor-pointer text-center uppercase tracking-wider"
                >
                  Add To Cart
                </button>

                {/* Buy Now button */}
                <button
                  onClick={() => onBuyNow(product, quantity)}
                  className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold py-3.5 px-6 rounded-xl shadow-md transition-all cursor-pointer text-center uppercase tracking-wider"
                >
                  Buy Now
                </button>

              </div>

              {/* Compare, wishlist, share actions */}
              <div className="flex items-center gap-6 text-xs text-slate-500 font-semibold pt-2">
                <button 
                  onClick={() => onAddToWishlist(product)}
                  className="flex items-center gap-1.5 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-50" />
                  <span>Add to Wishlist</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer">
                  <Shuffle className="w-4 h-4" />
                  <span>Compare</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Bottom Tabs Section (Description, Specs, Reviews) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100 bg-slate-50/50">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: `Reviews (${product.reviewsCount})` },
              { id: 'shipping', label: 'Shipping & Returns' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'description' && (
              <div className="space-y-4 text-xs leading-relaxed text-slate-600">
                <p>{product.description}</p>
                <p>
                  Equipped with cutting-edge cooling tech, long-lasting battery capacity, and crisp display quality, it delivers an immersive user experience whether you are designing creative assets, compiling heavy codes, playing top tier games, or typing documents.
                </p>
                <div className="flex items-center gap-2 mt-6 text-[11px] font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 w-fit">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Includes 1 Year Local Shop Warranty & Free Consultation</span>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {product.specs.map((spec, idx) => {
                  const parts = spec.split(/(?<=^[A-Za-z0-9 ]+)(?=:| )/);
                  return (
                    <div key={idx} className="flex border-b border-gray-50 pb-2">
                      <span className="w-1/3 font-bold text-slate-500">Feature {idx + 1}</span>
                      <span className="w-2/3 text-slate-800">{spec}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="text-center shrink-0">
                    <span className="text-3xl font-extrabold text-slate-900 block font-mono">{product.rating}</span>
                    <span className="text-[10px] text-gray-400 block mt-1 uppercase tracking-wider font-bold">Out of 5 Stars</span>
                  </div>
                  <div className="flex-1 w-full space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-slate-500 font-bold">5 Stars</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: '85%' }} />
                      </div>
                      <span className="text-slate-400 w-8 text-right">85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-slate-500 font-bold">4 Stars</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: '10%' }} />
                      </div>
                      <span className="text-slate-400 w-8 text-right">10%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-slate-500 font-bold">3 Stars</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: '5%' }} />
                      </div>
                      <span className="text-slate-400 w-8 text-right">5%</span>
                    </div>
                  </div>
                </div>

                {/* Review items */}
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">Evans Maundu</span>
                      <span className="text-gray-400 text-[10px]">12 Jun, 2026</span>
                    </div>
                    <div className="flex text-yellow-400 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Excellent laptop with high performance. The SSD is extremely fast and boots up in seconds. Serves all my programming and tech solution requirements perfectly!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs leading-relaxed text-slate-600">
                <p><strong>Local Pickup:</strong> Available for free at our TechHub cyber cafe/showroom in Nairobi, Kenya.</p>
                <p><strong>Nairobi Delivery:</strong> Flat rate delivery fee of KSh 300 across Nairobi County, with immediate dispatch within 2-4 hours.</p>
                <p><strong>Countrywide Shipping:</strong> Dispatched via reliable shuttle services or parcel services to other counties within 24 hours.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
