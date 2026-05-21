import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Sprout, User, Mail, Lock, Phone, MapPin, Loader2, Sparkles, LogIn, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loginTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  const initialRole = searchParams.get('role') || 'buyer';

  const [tab, setTab] = useState(loginTab);
  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [locationStr, setLocationStr] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  
  const { login: storeLogin, signup: storeSignup, isLoading, error, clearError } = useAuthStore();
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    setTab(loginTab);
  }, [loginTab]);

  useEffect(() => {
    clearError();
  }, [tab, role]);

  // Quick Mock Fill helper for easy evaluation
  const handleQuickFill = (selectedRole) => {
    setRole(selectedRole);
    setTab('login');
    if (selectedRole === 'farmer') {
      setEmail('farmer1@farmdirect.com');
      setPassword('farmer123'); // any value is fine for local simulation
    } else if (selectedRole === 'buyer') {
      setEmail('buyer@farmdirect.com');
      setPassword('buyer123');
    } else if (selectedRole === 'admin') {
      setEmail('admin@farmdirect.com');
      setPassword('admin123');
    }
  };

  const handleAutoGeolocate = () => {
    // Generate random realistic coords in India if geolocation fails, or use standard browser geo
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(4));
          setLongitude(pos.coords.longitude.toFixed(4));
          setLocationStr(`Gps Location (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`);
        },
        () => {
          // Fallback random coords inside India hubs
          const hubs = [
            { name: 'Punjab Agricultural Hub', lat: 30.9010, lng: 75.8573 },
            { name: 'Nashik Grape Hub', lat: 19.9975, lng: 73.7898 },
            { name: 'Ooty Vegetables Hub', lat: 11.4102, lng: 76.6950 },
            { name: 'Delhi Sourcing Point', lat: 28.6304, lng: 77.2177 }
          ];
          const chosen = hubs[Math.floor(Math.random() * hubs.length)];
          setLatitude(chosen.lat.toString());
          setLongitude(chosen.lng.toString());
          setLocationStr(chosen.name);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      if (tab === 'login') {
        const profile = await storeLogin(email, password, role);
        if (profile.role === 'farmer') navigate('/farmer');
        else if (profile.role === 'buyer') navigate('/buyer');
        else if (profile.role === 'admin') navigate('/admin');
      } else {
        // Sign Up
        const latVal = latitude ? parseFloat(latitude) : 28.6139;
        const lngVal = longitude ? parseFloat(longitude) : 77.2090;
        
        await storeSignup(
          name, 
          email, 
          password, 
          role, 
          phone || '+91 99999 99999', 
          locationStr || 'New Delhi, India',
          latVal,
          lngVal
        );
        
        if (role === 'farmer') {
          setSignupSuccess(true);
        } else {
          // Logged in automatically
          navigate('/buyer');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-100/60 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 relative">
        
        {/* Logo and Greeting */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex bg-emerald-600 p-2.5 rounded-2xl text-white mb-2">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            Welcome to FarmDirect
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            AI-powered B2B wholesale marketplace
          </p>
        </div>

        {/* Evaluation quick fill panel */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-2.5 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Demo Autofill Profile
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button 
              type="button"
              onClick={() => handleQuickFill('buyer')}
              className={`text-[10px] font-bold py-1.5 px-2 rounded-lg border transition ${role === 'buyer' && tab === 'login' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'}`}
            >
              Test Buyer
            </button>
            <button 
              type="button"
              onClick={() => handleQuickFill('farmer')}
              className={`text-[10px] font-bold py-1.5 px-2 rounded-lg border transition ${role === 'farmer' && tab === 'login' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'}`}
            >
              Test Farmer
            </button>
            <button 
              type="button"
              onClick={() => handleQuickFill('admin')}
              className={`text-[10px] font-bold py-1.5 px-2 rounded-lg border transition ${role === 'admin' && tab === 'login' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'}`}
            >
              Test Admin
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-100 mb-6">
          <button
            onClick={() => { setTab('login'); setSignupSuccess(false); }}
            className={`flex-1 pb-3 text-sm font-extrabold border-b-2 transition ${tab === 'login' ? 'text-emerald-600 border-emerald-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('signup'); setSignupSuccess(false); }}
            className={`flex-1 pb-3 text-sm font-extrabold border-b-2 transition ${tab === 'signup' ? 'text-emerald-600 border-emerald-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
          >
            Register Profile
          </button>
        </div>

        {/* Signup Success screen for Farmer */}
        {signupSuccess ? (
          <div className="text-center space-y-4 py-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl inline-block">
              <Sprout className="w-12 h-12" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-xl">Application Submitted!</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Thanks for registering as a Farmer, <span className="font-bold text-slate-700">{name}</span>! Your account status is currently <span className="text-amber-500 font-bold">PENDING ADMIN APPROVAL</span>. 
            </p>
            <p className="text-[11px] text-slate-400">
              An administrator will review your farm coordinates and details shortly. Please sign in as an admin or test buyer in the meantime!
            </p>
            <button 
              onClick={() => { setTab('login'); setSignupSuccess(false); handleQuickFill('admin'); }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5 text-sm"
            >
              <span>Switch to Admin Panel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl border border-rose-100 font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Role Radio Selectors */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Choose Platform Role</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${role === 'buyer' ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm' : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'}`}
                >
                  <User className="w-4 h-4" />
                  <span>Buyer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${role === 'farmer' ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm' : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'}`}
                >
                  <Sprout className="w-4 h-4" />
                  <span>Farmer</span>
                </button>

                <button
                  type="button"
                  disabled={tab === 'signup'}
                  onClick={() => setRole('admin')}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${tab === 'signup' ? 'opacity-40 cursor-not-allowed' : ''} ${role === 'admin' ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm' : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'}`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              </div>
              {role === 'farmer' && tab === 'signup' && (
                <p className="text-[10px] text-amber-600 font-bold mt-1.5">
                  ℹ️ Farmers require Admin approval before listing products.
                </p>
              )}
            </div>

            {/* Input Name (Signup only) */}
            {tab === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition duration-200 font-medium"
                  />
                </div>
              </div>
            )}

            {/* Input Email */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition duration-200 font-medium"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition duration-200 font-medium"
                />
              </div>
            </div>

            {/* Signup specific fields */}
            {tab === 'signup' && (
              <>
                {/* Input Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition duration-200 font-medium"
                    />
                  </div>
                </div>

                {/* Input Location String */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Geographic Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nashik, Maharashtra"
                      value={locationStr}
                      onChange={(e) => setLocationStr(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition duration-200 font-medium"
                    />
                  </div>
                </div>

                {/* Latitude & Longitude with autofill button */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="e.g. 19.9975"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs px-3.5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition duration-200 font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="e.g. 73.7898"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs px-3.5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition duration-200 font-semibold"
                    />
                  </div>
                </div>

                {/* Auto Coords Button */}
                <button
                  type="button"
                  onClick={handleAutoGeolocate}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-[10px] font-bold text-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fetch GPS / Mock Location Coordinates</span>
                </button>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl transition duration-300 shadow-lg hover:shadow-emerald-200/50 flex items-center justify-center gap-1.5 text-sm cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Configuring Account...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4.5 h-4.5" />
                  <span>{tab === 'login' ? 'Sign In to Portal' : 'Create Business Profile'}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
