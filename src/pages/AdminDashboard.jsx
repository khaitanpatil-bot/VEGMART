import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { db } from '../services/supabase';
import { Users, Sprout, ShoppingBag, ShieldAlert, Check, X, Trash2, ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState('users'); // users | listings | orders

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadAdminData();
  }, [user, isAuthenticated]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const allUsers = await db.getAllUsers();
      setUsers(allUsers || []);

      const allProds = await db.getProducts();
      setProducts(allProds || []);

      const allOrders = await db.getOrders(null, 'admin');
      setOrders(allOrders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRejectFarmer = async (userId, newStatus) => {
    try {
      await db.updateUserStatus(userId, newStatus);
      // Reload lists
      await loadAdminData();
      alert(`Farmer account updated to ${newStatus.toUpperCase()} successfully.`);
    } catch (err) {
      alert('Error updating user status: ' + err.message);
    }
  };

  const handleDeleteListing = async (productId) => {
    if (!window.confirm('Delete listing as moderator? This action is permanent.')) return;
    try {
      await db.deleteProduct(productId);
      await loadAdminData();
      alert('Inappropriate listing successfully moderated and deleted.');
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  // Stats helper
  const totalUsers = users.length;
  const pendingFarmers = users.filter(u => u.role === 'farmer' && u.status === 'pending').length;
  const activeProductsCount = products.length;
  const totalTransactionsCount = orders.length;

  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-2" />
        <p className="text-slate-500 font-bold">Connecting security databases...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            🛡️ Admin Control Panel
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Platform Overseer Control Room</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Moderate listings, approve/reject farmer profiles, and view B2B order transaction ledgers.</p>
        </div>
      </div>

      {/* Admin stats counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Global Users</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-800">{totalUsers}</p>
          </div>
        </div>

        {/* Pending Farmers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Farmers</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-850 text-amber-600">{pendingFarmers}</p>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Catalog Items</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-800">{activeProductsCount}</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">B2B Orders</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-800">{totalTransactionsCount}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold border-b-2 mr-6 transition ${activeTab === 'users' ? 'text-emerald-600 border-emerald-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
        >
          User Accounts ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab('listings')}
          className={`pb-3 text-sm font-bold border-b-2 mr-6 transition ${activeTab === 'listings' ? 'text-emerald-600 border-emerald-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
        >
          Catalog Moderation ({products.length})
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === 'orders' ? 'text-emerald-600 border-emerald-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
        >
          Global Transactions Ledger ({orders.length})
        </button>
      </div>

      {/* TAB CONTENT: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Name & Email</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Platform Role</th>
                  <th className="p-4">Farm Address Coordinates</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-center">Security Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{u.name}</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">{u.email}</p>
                    </td>
                    <td className="p-4">{u.phone || 'Secured'}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-800' :
                        u.role === 'farmer' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 truncate max-w-[200px]" title={u.location}>
                      {u.location || 'N/A'} {u.latitude ? `(${u.latitude.toFixed(2)}, ${u.longitude.toFixed(2)})` : ''}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                        u.status === 'rejected' ? 'bg-rose-50 text-rose-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {u.role === 'farmer' && u.status !== 'approved' && (
                          <button
                            onClick={() => handleApproveRejectFarmer(u.id, 'approved')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve Farmer
                          </button>
                        )}
                        {u.role === 'farmer' && u.status === 'approved' && (
                          <button
                            onClick={() => handleApproveRejectFarmer(u.id, 'rejected')}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" /> Revoke Approval
                          </button>
                        )}
                        {u.role !== 'farmer' && (
                          <span className="text-[10px] text-slate-400 italic">No action needed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CATALOG MODERATION */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {products.length === 0 ? (
            <p className="p-12 text-center text-slate-400 font-bold">No listed products found on platform database.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Crop Listing Photo & Title</th>
                    <th className="p-4">Farmer Details</th>
                    <th className="p-4">Price Per Kg</th>
                    <th className="p-4">Current Stock</th>
                    <th className="p-4">Harvest Date</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={prod.image_url} alt={prod.title} className="h-10 w-10 object-cover rounded-lg shrink-0 border" />
                          <div>
                            <p className="font-bold text-slate-800">{prod.title}</p>
                            <p className="text-slate-400 text-[10px] truncate max-w-[200px] mt-0.5">{prod.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{prod.users?.name || 'Verified Punjab Farmer'}</p>
                        <p className="text-slate-400 text-[10px]">{prod.location || 'India fields'}</p>
                      </td>
                      <td className="p-4 font-bold text-slate-700">₹{prod.price_per_kg}/kg</td>
                      <td className="p-4">{prod.quantity_available} kg</td>
                      <td className="p-4">{prod.harvest_date}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDeleteListing(prod.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-xl"
                          title="Purge Listing"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: TRANSACTIONS LEDGER */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {orders.length === 0 ? (
            <p className="p-12 text-center text-slate-400 font-bold">No orders placed on platform ledger.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Business Buyer</th>
                    <th className="p-4">Sourcing Farmer</th>
                    <th className="p-4">Crop Title</th>
                    <th className="p-4">Weight Qty</th>
                    <th className="p-4">Total Subtotal</th>
                    <th className="p-4">Dispatch Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {orders.map((ord) => {
                    const price = ord.products?.price_per_kg || 0;
                    const subtotal = Number(ord.quantity) * Number(price);
                    
                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-mono font-bold text-slate-500">{ord.id?.substring(0,8).toUpperCase()}</td>
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{ord.buyer?.name || 'HyperCity'}</p>
                          <p className="text-slate-400 text-[10px]">{ord.buyer?.email}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-850">{ord.farmer?.name || 'Verified Farmer'}</p>
                          <p className="text-slate-400 text-[10px]">{ord.farmer?.phone}</p>
                        </td>
                        <td className="p-4">{ord.products?.title || 'Unknown crop'}</td>
                        <td className="p-4 font-bold text-slate-700">{ord.quantity} kg</td>
                        <td className="p-4 font-extrabold text-emerald-700">₹{subtotal.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
                            ord.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                            ord.status === 'confirmed' ? 'bg-indigo-50 text-indigo-700' :
                            'bg-emerald-50 text-emerald-700'
                          }`}>
                            {ord.status}
                          </span>
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

    </div>
  );
}
