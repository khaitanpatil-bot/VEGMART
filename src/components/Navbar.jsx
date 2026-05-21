import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, LogOut, User, Menu, X, Sprout, Bell, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Check role dashboard path
  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'farmer') return '/farmer';
    if (user.role === 'buyer') return '/buyer';
    if (user.role === 'admin') return '/admin';
    return '/';
  };

  const hasRoleDashboard = user && location.pathname !== getDashboardPath() && location.pathname !== '/';

  // Demo Notifications
  const mockNotifications = [
    { id: 1, text: 'Order #ORD-7389 confirmed by Rajesh Kumar!', time: '2 mins ago' },
    { id: 2, text: 'Admin approved Savitri Devi’s farm listing.', time: '1 hr ago' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-600 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-800">
                  Farm<span className="text-emerald-600">Direct</span>
                </span>
                <span className="block text-[9px] font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
                  B2B AI Marketplace
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`text-sm font-semibold hover:text-emerald-600 transition-colors ${location.pathname === '/' ? 'text-emerald-600' : 'text-slate-600'}`}>
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} className={`text-sm font-semibold hover:text-emerald-600 transition-colors flex items-center gap-1.5 ${location.pathname.startsWith('/farmer') || location.pathname.startsWith('/buyer') || location.pathname.startsWith('/admin') ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {user.role === 'admin' && <ShieldCheck className="w-4 h-4 text-amber-500" />}
                  My Dashboard
                </Link>

                {/* Notifications Icon */}
                <div className="relative">
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-50 transition relative"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                  </button>

                  {/* Notifications Dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                      <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                        <span className="font-bold text-slate-800 text-sm">Notifications</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">New</span>
                      </div>
                      <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto">
                        {mockNotifications.map((notif) => (
                          <div key={notif.id} className="p-3 hover:bg-slate-50 transition text-xs">
                            <p className="text-slate-700 font-medium">{notif.text}</p>
                            <p className="text-slate-400 text-[10px] mt-1">{notif.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Buyer Cart Icon */}
                {user.role === 'buyer' && (
                  <Link to="/buyer" className="relative p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-50 transition">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-extrabold text-[10px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                )}

                {/* Profile Widget */}
                <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-800">{user.name}</span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600 -mt-0.5">
                      {user.role}
                    </span>
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login"
                  className="text-sm font-bold text-slate-700 hover:text-emerald-600 transition"
                >
                  Sign In
                </Link>
                <Link 
                  to="/login?tab=signup"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-sm hover:shadow"
                >
                  Join FarmDirect
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {isAuthenticated && user.role === 'buyer' && cartItems.length > 0 && (
              <Link to="/buyer" className="relative mr-4 p-1.5 text-slate-500">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white">
                  {cartItems.length}
                </span>
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-4 space-y-2">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to={getDashboardPath()} 
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard ({user.role})
              </Link>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between px-3">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                  <p className="text-slate-400 text-xs">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-sm font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <Link 
                to="/login"
                className="text-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                to="/login?tab=signup"
                className="text-center px-4 py-2 bg-emerald-600 rounded-lg text-sm font-bold text-white shadow-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
