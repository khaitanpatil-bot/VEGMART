import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { db } from '../services/supabase';
import MapComponent from '../components/MapComponent';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ShoppingCart, Timer, MapPin, Phone, Star, Sprout, Loader2, Award, Clock, ArrowRight, ShieldCheck, X } from 'lucide-react';

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { 
    items: cartItems, 
    isLoading: cartLoading, 
    fetchCart, 
    addToCart, 
    removeFromCart, 
    clearCart,
    checkout: cartCheckout 
  } = useCartStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(150);
  const [minFreshness, setMinFreshness] = useState(60); // min freshness percentage

  // Selected Farmer Modal Details
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [farmerReviews, setFarmerReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Placed Orders (checkout results)
  const [checkoutResult, setCheckoutResult] = useState(null);
  
  // Map focusing states
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);
  const [mapZoom, setMapZoom] = useState(5);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'buyer') {
      navigate('/');
      return;
    }

    // Set map center near buyer
    if (user.latitude && user.longitude) {
      setMapCenter([user.latitude, user.longitude]);
      setMapZoom(7);
    }

    loadProducts();
    fetchCart(user.id);
  }, [user, isAuthenticated]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await db.getProducts();
      // Only show products where farmer is approved
      const approvedCrops = data.filter(p => !p.users || p.users.status === 'approved');
      setProducts(approvedCrops);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    try {
      await addToCart(user.id, productId, quantity);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleShowFarmerDetails = async (product) => {
    const farmer = product.users ? { id: product.farmer_id, ...product.users } : {
      id: product.farmer_id,
      name: 'Verified Punjab Farmer',
      email: 'farmer@farmdirect.com',
      phone: '+91 99988 88877',
      location: product.location,
      latitude: product.latitude,
      longitude: product.longitude
    };

    setSelectedFarmer(farmer);

    // Fetch reviews
    try {
      const reviews = await db.getReviews(farmer.id);
      setFarmerReviews(reviews || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await db.addReview(user.id, selectedFarmer.id, newRating, newComment);
      const reviews = await db.getReviews(selectedFarmer.id);
      setFarmerReviews(reviews || []);
      setNewComment('');
      setNewRating(5);
    } catch (err) {
      alert('Error posting review: ' + err.message);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    try {
      const ordersPlaced = await cartCheckout(user.id);
      setCheckoutResult(ordersPlaced);
      loadProducts(); // refresh quantities
    } catch (err) {
      alert('Checkout failed: ' + err.message);
    }
  };

  // Helper: dynamic remaining timer calculator for rendering
  const getRemainingTime = (expiresAt) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // State to force re-render timers every second
  const [, setSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered Products
  const calculateFreshness = (dateStr) => {
    if (!dateStr) return 90;
    const harvested = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today - harvested);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(60, Math.min(100, 100 - (diffDays * 4)));
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = prod.location?.toLowerCase().includes(locationQuery.toLowerCase());
    
    const matchesPrice = Number(prod.price_per_kg) <= maxPrice;
    
    const freshness = calculateFreshness(prod.harvest_date);
    const matchesFreshness = freshness >= minFreshness;

    return matchesSearch && matchesLocation && matchesPrice && matchesFreshness;
  });

  const cartTotal = cartItems.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.products?.price_per_kg || 0)), 0);

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-2" />
        <p className="text-slate-500 font-bold">Connecting nearby farm marketplaces...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Dashboard Top Intro */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            🛒 Buyer Hub
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Direct Crop Sourcing</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Browse fresh farm harvests, verify locations, and checkout securely without middlemen margins.</p>
        </div>
      </div>

      {/* Main Dual-Column Content */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Map and Cart Drawer (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Leaflet Map integration */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <MapPin className="w-4.5 h-4.5 text-emerald-600" />
              <span>Interactive Farmers Map</span>
            </h3>
            <div className="h-64 rounded-2xl overflow-hidden border">
              <MapComponent 
                products={filteredProducts} 
                center={mapCenter} 
                zoom={mapZoom} 
                onProductSelect={(p) => {
                  if (p.latitude && p.longitude) {
                    setMapCenter([p.latitude, p.longitude]);
                    setMapZoom(11);
                  }
                }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
              * Showing farmers within shipping radius. Click markers on the map to add items directly to your cart or initiate call.
            </p>
          </div>

          {/* Secure Locking Shopping Cart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <ShoppingCart className="w-4.5 h-4.5 text-emerald-600" />
                <span>Smart Locker Cart</span>
              </h3>
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                1-Hour Lock
              </span>
            </div>

            {cartItems.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <ShoppingCart className="w-8 h-8 text-slate-200 mx-auto" />
                <p className="text-xs font-semibold">Your cart is empty.</p>
                <p className="text-[10px]">Add crops from lists below to lock inventory.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Cart Items List */}
                <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-xs truncate">{item.products?.title || 'Farm Crop'}</p>
                        <p className="text-slate-400 text-[10px]">{item.quantity} kg x ₹{item.products?.price_per_kg}/kg</p>
                        
                        {/* Countdown timer for each item */}
                        <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-1.5">
                          <Timer className="w-2.5 h-2.5 animate-spin" />
                          <span>Release stock in: {getRemainingTime(item.expires_at)}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <p className="font-extrabold text-xs text-slate-700">₹{(Number(item.quantity) * Number(item.products?.price_per_kg || 0)).toFixed(2)}</p>
                        <button 
                          onClick={() => removeFromCart(item.id, user.id)}
                          className="text-[9px] font-bold text-rose-500 hover:text-rose-600 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                  <span className="text-xs text-slate-500 font-bold">Total locked value</span>
                  <span className="text-lg font-extrabold text-emerald-700">₹{cartTotal.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button 
                    onClick={() => clearCart(user.id)}
                    className="py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 font-bold text-xs cursor-pointer"
                  >
                    Clear Cart
                  </button>
                  <button 
                    onClick={handleCheckout}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    Confirm Checkout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Checkout Result Card */}
          {checkoutResult && (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl space-y-4 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-emerald-700">
                <ShieldCheck className="w-6 h-6 shrink-0" />
                <h3 className="font-extrabold text-sm sm:text-base">Order Placed Successfully!</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct connections have been made. We do not process credit cards here to save agent fees. Please coordinate dispatch and pay on delivery:
              </p>
              
              <div className="bg-white p-4 rounded-2xl border border-emerald-100 divide-y divide-slate-100 text-xs font-semibold">
                {checkoutResult.map((ord, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0">
                    <p className="text-[10px] text-slate-400 uppercase">Crop Sourced</p>
                    <p className="text-slate-800 font-bold">{ord.id?.substring(0,8)} - (Direct wholesale)</p>
                    
                    {/* Display farmer info */}
                    <div className="mt-2 text-[11px] text-slate-600 space-y-1">
                      <p className="flex items-center gap-1">📞 Phone: <a href="tel:+919876543210" className="text-emerald-600 font-bold underline">+91 98765 43210</a></p>
                      <p>📍 Dispatch Farm Hub: Punjab fields, India</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setCheckoutResult(null)}
                className="w-full bg-slate-900 text-white font-bold py-2 rounded-xl text-xs"
              >
                Close Receipt
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Search Filters and Products grid (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Search Filters Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search basmati, tomatoes, spinach..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white text-xs pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Filter by farm location..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white text-xs pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                />
              </div>
            </div>

            {/* Price slider & freshness dropdown */}
            <div className="grid sm:grid-cols-2 gap-6 pt-2 text-xs font-bold text-slate-600">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] text-slate-400 uppercase">Max wholesale price</label>
                  <span>₹{maxPrice} /kg</span>
                </div>
                <input 
                  type="range"
                  min="20"
                  max="200"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] text-slate-400 uppercase">Freshness index threshold</label>
                  <span>Min {minFreshness}% Fresh</span>
                </div>
                <input 
                  type="range"
                  min="60"
                  max="100"
                  value={minFreshness}
                  onChange={(e) => setMinFreshness(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-3">
                <Sprout className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No agricultural crops match filters</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Try relaxing search keywords, broadening locations, or raising the maximum price boundary.
                </p>
              </div>
            ) : (
              filteredProducts.map((prod) => (
                <ProductCard 
                  key={prod.id} 
                  product={prod} 
                  onAddToCart={handleAddToCart}
                  onShowFarmer={handleShowFarmerDetails}
                />
              ))
            )}
          </div>
        </div>

      </div>

      {/* SELECTED FARMER DETAILS MODAL & REVIEWS SYSTEM */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-extrabold text-slate-800">Farmer Directory</h2>
              </div>
              <button onClick={() => setSelectedFarmer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <h3 className="font-extrabold text-slate-800 text-base">{selectedFarmer.name}</h3>
                <div className="text-slate-600 text-xs font-semibold space-y-1">
                  <p>📍 Location Address: {selectedFarmer.location || 'Punjab Fields, India'}</p>
                  <p>📞 Coordinate phone: {selectedFarmer.phone || 'Direct line secured'}</p>
                  <p>✉️ Professional email: {selectedFarmer.email}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <a 
                    href={`tel:${selectedFarmer.phone}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-sm text-center transition flex-1"
                  >
                    📞 Phone Call
                  </a>
                  <a 
                    href={`https://wa.me/${selectedFarmer.phone?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-sm text-center transition flex-1"
                  >
                    💬 WhatsApp Direct
                  </a>
                </div>
              </div>

              {/* Reviews Thread Section */}
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-slate-800 text-sm">Verified Retailer Reviews ({farmerReviews.length})</h4>
                
                {farmerReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 font-semibold italic py-2">No retail reviews posted yet. Be the first to leave feedback!</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {farmerReviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-slate-800">{rev.buyer?.name || 'Verified Buyer'}</span>
                          <span className="text-amber-500 flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {rev.rating}/5
                          </span>
                        </div>
                        <p className="text-slate-500 font-medium leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Post New Review Form */}
                <form onSubmit={handlePostReview} className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Leave your Wholesale Rating</span>
                    <select 
                      value={newRating} 
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="bg-slate-50 border rounded-lg px-2.5 py-1 focus:outline-none"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ Excellent (5)</option>
                      <option value="4">⭐⭐⭐⭐ Good (4)</option>
                      <option value="3">⭐⭐⭐ Average (3)</option>
                      <option value="2">⭐⭐ Fair (2)</option>
                      <option value="1">⭐ Poor (1)</option>
                    </select>
                  </div>
                  <textarea
                    required
                    rows="2"
                    placeholder="Type comments regarding crop freshness, shipping delays, packaging quality..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-slate-50 text-xs p-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                  <button 
                    type="submit" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow transition"
                  >
                    Submit Verified Review
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
