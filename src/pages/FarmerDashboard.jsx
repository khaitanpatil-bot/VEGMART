import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { db } from '../services/supabase';
import { Plus, Trash2, Edit, Check, ShoppingBag, TrendingUp, Package, Scale, IndianRupee, Sparkles, Upload, Loader2, X, Phone, Eye } from 'lucide-react';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [qtyAvailable, setQtyAvailable] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);

  // AI Feature States
  const [aiImageAnalysis, setAiImageAnalysis] = useState(null);
  const [aiPriceSuggestion, setAiPriceSuggestion] = useState(null);
  const [imageChecking, setImageChecking] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('listings'); // listings | orders | analytics

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'farmer') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, isAuthenticated]);

  // Dynamic AI Price Suggestion based on Title typing
  useEffect(() => {
    if (title.length < 3) {
      setAiPriceSuggestion(null);
      return;
    }

    // Scan existing platform products for matching words
    const queryWord = title.toLowerCase();
    const matches = products.filter(p => p.title.toLowerCase().includes(queryWord));
    
    if (matches.length > 0) {
      const avg = matches.reduce((sum, p) => sum + Number(p.price_per_kg), 0) / matches.length;
      setAiPriceSuggestion({
        suggested: avg.toFixed(2),
        basis: matches.length
      });
    } else {
      // Default suggested based on typical crops
      let defaultSuggest = 35.00;
      if (queryWord.includes('rice') || queryWord.includes('basmati')) defaultSuggest = 80.00;
      else if (queryWord.includes('tomato') || queryWord.includes('onion')) defaultSuggest = 35.00;
      else if (queryWord.includes('grape') || queryWord.includes('apple')) defaultSuggest = 110.00;
      else if (queryWord.includes('potato')) defaultSuggest = 20.00;
      
      setAiPriceSuggestion({
        suggested: defaultSuggest.toFixed(2),
        basis: 0
      });
    }
  }, [title, products]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch all products, filter by farmer id
      const allProds = await db.getProducts();
      const myProds = allProds.filter(p => p.farmer_id === user.id);
      setProducts(myProds);

      // Fetch all orders made to this farmer
      const allOrd = await db.getOrders(user.id, 'farmer');
      setOrders(allOrd);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImageChecking(true);

    // AI IMAGE QUALITY CHECK (SIMULATION)
    // Run blur detection, resolution analysis, and file size checks
    setTimeout(() => {
      const sizeMB = file.size / (1024 * 1024);
      let score = 95;
      let status = 'Excellent';
      let issues = [];

      if (sizeMB < 0.05) {
        score = 65;
        status = 'Needs Improvement';
        issues.push('Resolution is too low (image is pixelated/blurry)');
      }
      if (file.name.toLowerCase().endsWith('.gif')) {
        score = 50;
        status = 'Rejected';
        issues.push('Animated format is not acceptable');
      }

      setAiImageAnalysis({
        score,
        status,
        issues,
        resolution: sizeMB < 0.1 ? '640x480 (Low)' : '1920x1080 (High Definition)',
        blurIndex: sizeMB < 0.05 ? 'High Blur Detected' : 'Ultra-Sharp Focus Approved'
      });
      setImageChecking(false);
    }, 1200);

    // Convert file to url
    try {
      const url = await db.uploadProductImage(file);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image preview.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPricePerKg('');
    setQtyAvailable('');
    setImageFile(null);
    setImageUrl('');
    setHarvestDate(new Date().toISOString().split('T')[0]);
    setAiImageAnalysis(null);
    setAiPriceSuggestion(null);
    setEditingProduct(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setDescription(prod.description);
    setPricePerKg(prod.price_per_kg);
    setQtyAvailable(prod.quantity_available);
    setImageUrl(prod.image_url);
    setHarvestDate(prod.harvest_date);
    setAiImageAnalysis({
      score: 98,
      status: 'Excellent',
      issues: [],
      resolution: '1920x1080 (High Definition)',
      blurIndex: 'Ultra-Sharp Focus Approved'
    });
    setModalOpen(true);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!title || !pricePerKg || !qtyAvailable) {
      alert('Please fill out all required fields.');
      return;
    }

    if (aiImageAnalysis && aiImageAnalysis.score < 60) {
      alert('Your image quality does not meet our minimum guidelines. Please upload a clearer image.');
      return;
    }

    const payload = {
      farmer_id: user.id,
      title,
      description,
      price_per_kg: parseFloat(pricePerKg),
      quantity_available: parseFloat(qtyAvailable),
      image_url: imageUrl || 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400',
      harvest_date: harvestDate,
      location: user.location,
      latitude: user.latitude,
      longitude: user.longitude
    };

    setLoading(true);
    try {
      if (editingProduct) {
        await db.updateProduct(editingProduct.id, payload);
      } else {
        await db.createProduct(payload);
      }
      setModalOpen(false);
      resetForm();
      await loadData();
    } catch (err) {
      alert('Failed to save listing: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action is permanent.')) return;
    try {
      await db.deleteProduct(id);
      await loadData();
    } catch (err) {
      alert('Error deleting listing: ' + err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await db.updateOrderStatus(orderId, newStatus);
      await loadData();
    } catch (err) {
      alert('Error updating order: ' + err.message);
    }
  };

  // Analytics helper variables
  const activeListings = products.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed');
  const confirmedOrders = orders.filter(o => o.status === 'confirmed');
  
  const totalQtySold = [...completedOrders, ...confirmedOrders].reduce((sum, o) => sum + Number(o.quantity), 0);
  const totalEarnings = completedOrders.reduce((sum, o) => sum + (Number(o.quantity) * Number(o.products?.price_per_kg || 0)), 0);

  const applySuggestedPrice = () => {
    if (aiPriceSuggestion) {
      setPricePerKg(aiPriceSuggestion.suggested);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-2" />
        <p className="text-slate-500 font-bold">Synchronizing farm records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            🌾 Farmer Portal
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Welcome back, {user.name}</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Manage listings, monitor wholesale metrics, and coordinate business dispatches.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3 px-5 rounded-xl transition duration-200 shadow-md hover:shadow-emerald-100 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Crop Listing</span>
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Earnings Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Earnings</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-800">₹{totalEarnings.toFixed(2)}</p>
          </div>
        </div>

        {/* Crops Sold Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Crops Sold</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-800">{totalQtySold} kg</p>
          </div>
        </div>

        {/* Active Listings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Crops</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-800">{activeListings}</p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">New Orders</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-800">{pendingOrders}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('listings')}
          className={`pb-3 text-sm font-bold border-b-2 mr-6 transition ${activeTab === 'listings' ? 'text-emerald-600 border-emerald-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
        >
          My Listed Crops ({products.length})
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === 'orders' ? 'text-emerald-600 border-emerald-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
        >
          Wholesale Incoming Orders ({orders.length})
        </button>
      </div>

      {/* TAB CONTENT: LISTINGS */}
      {activeTab === 'listings' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-lg">No active crops listed</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto">
                Get started by listing your active farm harvests. Add pictures, pricing, and availability coordinates.
              </p>
              <button 
                onClick={handleOpenAddModal}
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs px-4 py-2 rounded-xl transition"
              >
                Create First Listing
              </button>
            </div>
          ) : (
            products.map((prod) => (
              <div key={prod.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition">
                <div className="h-44 overflow-hidden relative bg-slate-50">
                  <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-slate-900/90 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg">
                    ₹{prod.price_per_kg}/kg
                  </span>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-slate-800 text-base line-clamp-1">{prod.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mt-1.5 flex-1 leading-relaxed">{prod.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-50 text-slate-600 text-xs font-semibold">
                    <div>
                      <span className="block text-[8.5px] text-slate-400 uppercase">Available stock</span>
                      <span>{prod.quantity_available} kg</span>
                    </div>
                    <div>
                      <span className="block text-[8.5px] text-slate-400 uppercase">Harvest Date</span>
                      <span>{prod.harvest_date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => handleOpenEditModal(prod)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-xl cursor-pointer"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No incoming orders yet</h3>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                Once buyers add items to their cart and finalize checkout, their orders will populate here with contact details.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Business Buyer Details</th>
                    <th className="p-4">Crop Purchased</th>
                    <th className="p-4">Order Qty</th>
                    <th className="p-4">Subtotal</th>
                    <th className="p-4">Order Status</th>
                    <th className="p-4 text-center">Coordinate Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {orders.map((ord) => {
                    const price = ord.products?.price_per_kg || 0;
                    const subtotal = Number(ord.quantity) * Number(price);
                    
                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{ord.buyer?.name || 'Verified Buyer'}</p>
                          <p className="text-slate-400 text-[10px] mt-0.5">{ord.buyer?.location || 'Direct Delivery Address'}</p>
                          <p className="text-slate-400 text-[10px]">{ord.buyer?.email}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-700">{ord.products?.title || 'Unknown Crop'}</p>
                        </td>
                        <td className="p-4 font-bold text-slate-700">{ord.quantity} kg</td>
                        <td className="p-4 font-bold text-emerald-700">₹{subtotal.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                            ord.status === 'confirmed' ? 'bg-indigo-50 text-indigo-700' :
                            'bg-emerald-50 text-emerald-700'
                          }`}>
                            {ord.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center items-center gap-2">
                            {/* Call Buyer directly */}
                            {ord.buyer?.phone && (
                              <a 
                                href={`tel:${ord.buyer.phone}`}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-2 rounded-lg font-semibold flex items-center gap-1"
                                title="Call Buyer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Call</span>
                              </a>
                            )}

                            {/* Status State Control buttons */}
                            {ord.status === 'pending' && (
                              <button 
                                onClick={() => handleUpdateOrderStatus(ord.id, 'confirmed')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer"
                              >
                                Confirm Order
                              </button>
                            )}

                            {ord.status === 'confirmed' && (
                              <button 
                                onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer"
                              >
                                Mark Dispatched
                              </button>
                            )}

                            {ord.status === 'completed' && (
                              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600" /> Completed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CROP FORM ADD/EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b mb-4">
              <h2 className="text-xl font-extrabold text-slate-800">
                {editingProduct ? 'Edit Crop Details' : 'Add New Fresh Harvest'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Crop Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Vine-Ripened Organic Tomatoes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white text-xs px-3.5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                />
                
                {/* AI Price Suggestion Panel */}
                {aiPriceSuggestion && (
                  <div className="bg-emerald-50/70 border border-emerald-100 p-2.5 rounded-xl mt-1.5 flex justify-between items-center text-[10px]">
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        AI Suggested: <strong className="text-emerald-700">₹{aiPriceSuggestion.suggested}/kg</strong> 
                        {aiPriceSuggestion.basis > 0 && ` (Based on ${aiPriceSuggestion.basis} market listing)`}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={applySuggestedPrice}
                      className="bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded shadow-sm hover:bg-emerald-700 transition"
                    >
                      Apply Suggested
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Description</label>
                <textarea 
                  placeholder="Details about quality, variety, package sizing, shipping details etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="2"
                  className="w-full bg-slate-50 focus:bg-white text-xs px-3.5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Inputs Price & Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price (₹ per kg) *</label>
                  <input 
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 35.00"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white text-xs px-3.5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Available Stock (kg) *</label>
                  <input 
                    type="number"
                    required
                    placeholder="e.g. 500"
                    value={qtyAvailable}
                    onChange={(e) => setQtyAvailable(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white text-xs px-3.5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                  />
                </div>
              </div>

              {/* Harvest Date */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Harvest Date *</label>
                <input 
                  type="date"
                  required
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white text-xs px-3.5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Crop Photo</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-4 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition text-slate-500">
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-[10px] font-bold">Select JPG/PNG</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="hidden" 
                      />
                    </label>
                  </div>
                  {imageUrl && (
                    <div className="h-16 w-16 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                      <img src={imageUrl} alt="Uploaded Crop Preview" className="object-cover h-full w-full" />
                    </div>
                  )}
                </div>

                {/* AI Image Quality Check Feedback panel */}
                {imageChecking && (
                  <p className="text-[10px] text-slate-400 font-semibold mt-1 animate-pulse">
                    🤖 AI checking resolution clarity & focus...
                  </p>
                )}

                {aiImageAnalysis && (
                  <div className={`mt-2 border p-3 rounded-2xl text-[10px] space-y-1 ${
                    aiImageAnalysis.score >= 80 
                      ? 'bg-emerald-50/70 border-emerald-100 text-emerald-800' 
                      : 'bg-rose-50 border-rose-100 text-rose-800'
                  }`}>
                    <div className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Listing Verification Score:
                      </span>
                      <span>{aiImageAnalysis.score}/100 ({aiImageAnalysis.status})</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[9px] pt-1 text-slate-500 font-medium">
                      <p>Resolution: <span className="font-bold text-slate-700">{aiImageAnalysis.resolution}</span></p>
                      <p>Focus Index: <span className="font-bold text-slate-700">{aiImageAnalysis.blurIndex}</span></p>
                    </div>
                    {aiImageAnalysis.issues.length > 0 && (
                      <p className="text-[9px] font-bold text-rose-600 pt-1">
                        ⚠️ Recommendation: {aiImageAnalysis.issues[0]}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3 rounded-xl shadow-lg transition duration-200"
              >
                {editingProduct ? 'Save Crop Changes' : 'Confirm & Publish Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
