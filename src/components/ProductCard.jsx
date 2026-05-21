import React, { useState } from 'react';
import { Calendar, MapPin, Scale, Plus, Sparkles, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function ProductCard({ product, onAddToCart, onShowFarmer }) {
  const { user } = useAuthStore();
  const [qty, setQty] = useState(10); // default buy 10kg
  const [adding, setAdding] = useState(false);

  const { title, description, price_per_kg, quantity_available, image_url, harvest_date, location } = product;
  const farmerName = product.users?.name || 'Verified Farmer';

  // AI/Dynamic Freshness Score Calculation
  // 100% fresh on harvest date, losing 5% freshness every day up to a minimum of 60%
  const calculateFreshness = (dateStr) => {
    if (!dateStr) return 90;
    const harvested = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today - harvested);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Freshness decay factor: 4% per day
    const freshness = 100 - (diffDays * 4);
    return Math.max(60, Math.min(100, freshness));
  };

  const freshness = calculateFreshness(harvest_date);

  const getFreshnessColor = (score) => {
    if (score >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (score >= 75) return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-rose-50 text-rose-700 border-rose-100';
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in as a Buyer to add items to your cart.');
      return;
    }
    if (user.role !== 'buyer') {
      alert('Only Buyers can purchase products.');
      return;
    }
    if (qty <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }
    if (qty > quantity_available) {
      alert(`Only ${quantity_available}kg is available in stock.`);
      return;
    }

    setAdding(true);
    try {
      await onAddToCart(product.id, qty);
      setQty(10); // reset
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col h-full group">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-slate-50">
        <img 
          src={image_url || 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600'} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600';
          }}
        />
        
        {/* Dynamic Freshness Badge */}
        <div className={`absolute top-3 left-3 border px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-sm flex items-center gap-1 ${getFreshnessColor(freshness)}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{freshness}% Freshness Index</span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 bg-slate-900/95 text-white font-extrabold text-sm px-3 py-1.5 rounded-xl shadow-md flex items-baseline gap-0.5">
          <span className="text-emerald-400">₹</span>
          <span className="text-base">{price_per_kg}</span>
          <span className="text-[10px] text-slate-300 font-normal">/kg</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Farmer Profile Button */}
        <button 
          onClick={() => onShowFarmer && onShowFarmer(product)}
          className="self-start flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg mb-2.5 transition"
        >
          <User className="w-3 h-3" />
          <span>{farmerName}</span>
        </button>

        <h3 className="font-extrabold text-slate-800 text-lg line-clamp-1 leading-tight group-hover:text-emerald-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed flex-1">
          {description || 'Directly sourced organic farm products harvested under clean environments.'}
        </p>

        {/* Product specs details */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-50 text-slate-600 text-xs">
          <div className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-slate-400" />
            <div>
              <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Available</span>
              <span className="font-bold text-slate-700">{quantity_available} kg</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Harvested</span>
              <span className="font-bold text-slate-700">{harvest_date}</span>
            </div>
          </div>
        </div>

        {/* Location info */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-3.5">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{location || 'Punjab Fields, India'}</span>
        </div>

        {/* Add to Cart Actions */}
        {user?.role === 'buyer' && (
          <form onSubmit={handleAdd} className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
            <div className="flex items-center border border-slate-200 rounded-xl px-2.5 bg-slate-50">
              <input 
                type="number" 
                value={qty} 
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                className="w-12 text-center text-xs font-extrabold bg-transparent py-2 focus:outline-none"
                min="1"
                max={quantity_available}
              />
              <span className="text-[10px] text-slate-400 font-bold uppercase">kg</span>
            </div>
            
            <button
              type="submit"
              disabled={adding || quantity_available <= 0}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-extrabold text-xs transition duration-300 shadow-sm ${
                quantity_available <= 0 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-md'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{adding ? 'Adding...' : quantity_available <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
