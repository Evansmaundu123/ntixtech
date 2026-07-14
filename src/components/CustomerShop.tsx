import React, { useState, useMemo } from 'react';
import { 
  Star, Heart, SlidersHorizontal, ChevronRight, ShoppingCart, Search, X, 
  Layers, Laptop, Mouse, Wrench, Calendar, Wifi, Printer, Copy, FileText, Cpu, 
  MonitorCheck, Gamepad2, Palette, Video, Network, HardDrive, PlusCircle 
} from 'lucide-react';
import { Product, Service } from '../types';
import { INITIAL_SERVICES } from '../data';

interface CustomerShopProps {
  products: Product[];
  services?: Service[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  onNavigate?: (view: string) => void;
}

export default function CustomerShop({
  products,
  services,
  onSelectProduct,
  onAddToCart,
  onAddToWishlist,
  searchQuery: propSearchQuery,
  onSearchQueryChange: propOnSearchQueryChange,
  onNavigate
}: CustomerShopProps) {
  const [selectedCategory, setSelectedCategory] = useState('Laptops');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState('All');
  
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : localSearchQuery;
  const setSearchQuery = propOnSearchQueryChange !== undefined ? propOnSearchQueryChange : setLocalSearchQuery;

  const shopServices = services || INITIAL_SERVICES;

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

  const counts = useMemo(() => {
    const electronicsCategories = ['laptops', 'desktops', 'mini pcs', 'networking', 'storage', 'printers', 'gaming', 'cctv & security', 'computers'];
    const electronicsCount = products.filter(p => electronicsCategories.includes(p.category.toLowerCase())).length;
    const accessoriesCount = products.filter(p => p.category.toLowerCase() === 'accessories').length;
    const servicesCount = shopServices.length;

    return {
      all: products.length,
      electronics: electronicsCount,
      accessories: accessoriesCount,
      services: servicesCount
    };
  }, [products, shopServices]);

  const categories = [
    { name: 'Computers', count: 48 },
    { name: 'Laptops', count: 120 },
    { name: 'Desktops', count: 35 },
    { name: 'Mini PCs', count: 18 },
    { name: 'Accessories', count: 150 },
    { name: 'Networking', count: 38 },
    { name: 'Storage', count: 54 },
    { name: 'Printers', count: 42 },
    { name: 'Gaming', count: 64 },
    { name: 'CCTV & Security', count: 29 },
  ];

  const brandsList = ['HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'Apple', 'Logitech', 'Canon', 'Kingston'];

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Quick-Filter Tag
    if (selectedQuickFilter === 'Electronics') {
      const electronicsCategories = ['laptops', 'desktops', 'mini pcs', 'networking', 'storage', 'printers', 'gaming', 'cctv & security', 'computers'];
      result = result.filter(p => electronicsCategories.includes(p.category.toLowerCase()));
    } else if (selectedQuickFilter === 'Accessories') {
      result = result.filter(p => p.category.toLowerCase() === 'accessories');
    }

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'Computers' && selectedQuickFilter !== 'Services') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Filter by Brands
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Filter by Price
    result = result.filter((p) => p.price <= maxPrice);

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, searchQuery, selectedBrands, maxPrice, sortBy]);

  return (
    <div className="w-full bg-slate-50 py-8 font-sans flex-1" id="customer-shop">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb, Search, & Sort Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h1 className="font-display font-bold text-2xl text-slate-900">
              {searchQuery ? `Search: "${searchQuery}"` : selectedCategory}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} of {products.length} products
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            {/* Search Input */}
            <div className="relative w-full sm:w-72" id="product-search-container">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </span>
              <input
                type="text"
                id="product-search-input"
                placeholder="Search products in shop..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  id="product-search-clear"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort selection */}
            <div className="flex items-center gap-2 justify-between bg-slate-50 border border-gray-100 p-2 rounded-xl">
              <span className="text-xs text-gray-500 font-medium px-2">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-slate-800 bg-transparent border-0 focus:ring-0 cursor-pointer focus:outline-none pr-2"
              >
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick-Filter Tag System */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4" id="quick-filter-tags">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Quick Filters:</span>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-1 max-w-full">
            {[
              { id: 'All', label: 'All Products', icon: <Layers className="w-3.5 h-3.5" />, count: counts.all },
              { id: 'Electronics', label: 'Electronics', icon: <Laptop className="w-3.5 h-3.5" />, count: counts.electronics },
              { id: 'Accessories', label: 'Accessories', icon: <Mouse className="w-3.5 h-3.5" />, count: counts.accessories },
              { id: 'Services', label: 'Services', icon: <Wrench className="w-3.5 h-3.5" />, count: counts.services },
            ].map((tag) => {
              const isActive = selectedQuickFilter === tag.id;
              return (
                <button
                  key={tag.id}
                  onClick={() => {
                    setSelectedQuickFilter(tag.id);
                    setCurrentPage(1);
                    if (tag.id === 'All') {
                      setSelectedCategory('Computers');
                    } else if (tag.id === 'Electronics') {
                      setSelectedCategory('Computers');
                    } else if (tag.id === 'Accessories') {
                      setSelectedCategory('Accessories');
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-50 border border-gray-100 text-slate-600 hover:bg-slate-100/80 hover:text-blue-600'
                  }`}
                  id={`quick-filter-${tag.id.toLowerCase()}`}
                >
                  {tag.icon}
                  <span>{tag.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-500'
                  }`}>
                    {tag.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Body */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Categories list */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <h2 className="font-display font-bold text-sm text-slate-900 mb-4 uppercase tracking-wider">Categories</h2>
              <div className="space-y-1">
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setCurrentPage(1);
                      if (cat.name === 'Computers') {
                        setSelectedQuickFilter('All');
                      } else if (cat.name === 'Accessories') {
                        setSelectedQuickFilter('Accessories');
                      } else {
                        setSelectedQuickFilter('Electronics');
                      }
                    }}
                    className={`w-full flex items-center justify-between text-xs font-medium py-2 px-3 rounded-lg transition-all ${
                      selectedCategory === cat.name
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${selectedCategory === cat.name ? 'text-white' : 'text-gray-400'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <h2 className="font-display font-bold text-sm text-slate-900 mb-4 uppercase tracking-wider">Filter By Price</h2>
              <div className="space-y-4">
                <input
                  type="range"
                  min="1000"
                  max="200000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                />
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span className="font-mono">KSh 1,000</span>
                  <span className="font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                    Up to KSh {maxPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <h2 className="font-display font-bold text-sm text-slate-900 mb-4 uppercase tracking-wider">Brands</h2>
              <div className="space-y-2.5">
                {brandsList.map((brand, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer select-none text-xs font-medium text-slate-700 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {selectedQuickFilter === 'Services' ? (
              <div className="space-y-6">
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3.5">
                  <div className="bg-blue-600 text-white p-2.5 rounded-xl shrink-0">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Our Cyber & ICT Services</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Need high-speed browsing, document scanning, laptop diagnostics, or professional logo design? Book online with local NTIX Tech experts.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="services-shop-grid">
                  {shopServices.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col justify-between group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                          {getIcon(service.icon, "w-5 h-5")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {service.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-50 mt-4 pt-3 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded uppercase">
                          {service.priceDetails}
                        </span>
                        <button
                          onClick={() => {
                            if (onNavigate) {
                              onNavigate('booking');
                            } else {
                              alert(`Booking for "${service.name}" is coming soon!`);
                            }
                          }}
                          className="text-xs font-bold bg-slate-50 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book Now</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-800">No products match your filters</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your price slider, unchecking some brands, or switching the product category.
                </p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setMaxPrice(200000);
                    setSearchQuery('');
                    setSelectedQuickFilter('All');
                    setSelectedCategory('Computers');
                  }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  Reset Filters & Search
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
                    >
                      {/* Image Box */}
                      <div className="relative aspect-square w-full bg-slate-50 flex items-center justify-center p-4 overflow-hidden shrink-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          onClick={() => onSelectProduct(prod)}
                          className="object-contain max-h-full max-w-full cursor-pointer group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          onClick={() => onAddToWishlist(prod)}
                          className="absolute top-2.5 right-2.5 p-2 bg-white/90 hover:bg-white text-gray-400 hover:text-rose-500 rounded-full shadow-sm transition-colors cursor-pointer"
                          title="Add to wishlist"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        {prod.oldPrice && (
                          <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Sale
                          </span>
                        )}
                      </div>

                      {/* Info Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-blue-600 font-bold tracking-wider uppercase">{prod.category}</span>
                          <h3
                            onClick={() => onSelectProduct(prod)}
                            className="text-xs font-semibold text-slate-800 mt-1 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                          >
                            {prod.name}
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mt-1.5">
                            <div className="flex text-yellow-400">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star
                                  key={idx}
                                  className={`w-3 h-3 ${idx < Math.floor(prod.rating) ? 'fill-yellow-400' : 'text-gray-200'}`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-400">({prod.reviewsCount})</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-bold text-slate-900 font-mono">
                              KSh {prod.price.toLocaleString()}
                            </span>
                            {prod.oldPrice && (
                              <span className="text-[10px] text-gray-400 line-through font-mono">
                                KSh {prod.oldPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => onAddToCart(prod)}
                            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-2 pt-4">
                  <button className="px-3.5 py-1.5 bg-white border border-gray-100 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Prev</button>
                  <button className="w-8.5 h-8.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer">1</button>
                  <button className="w-8.5 h-8.5 bg-white border border-gray-100 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer">2</button>
                  <button className="w-8.5 h-8.5 bg-white border border-gray-100 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer">3</button>
                  <span className="text-gray-400 px-1 text-xs">...</span>
                  <button className="w-8.5 h-8.5 bg-white border border-gray-100 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer">10</button>
                  <button className="px-3.5 py-1.5 bg-white border border-gray-100 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Next</button>
                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
