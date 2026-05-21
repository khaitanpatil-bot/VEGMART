import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { ShieldAlert, Loader2, Sprout } from 'lucide-react';

// PROTECTED ROUTE WRAPPER
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-2" />
        <p className="text-slate-500 font-bold text-sm">Authenticating secure session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Farmer approval checks
  if (user.role === 'farmer' && user.status !== 'approved') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// UNAUTHORIZED / 404 PAGE
function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 px-4 text-center">
      <div className="bg-rose-50 text-rose-600 p-4 rounded-3xl mb-4 border border-rose-100 shadow-sm">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Unauthorized Access</h1>
      <p className="text-slate-500 text-xs sm:text-sm max-w-sm mt-2 leading-relaxed">
        Your account role does not have authorization clearance to view this dashboard segment. Please sign out and sign back in with proper credentials.
      </p>
      <Link 
        to="/" 
        className="mt-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition shadow"
      >
        Return to Safety
      </Link>
    </div>
  );
}

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="bg-emerald-600 p-3 rounded-2xl text-white animate-bounce mb-3 shadow-md">
          <Sprout className="w-8 h-8" />
        </div>
        <p className="text-slate-700 font-extrabold text-sm tracking-wider">FARMDRECT PORTALS</p>
        <p className="text-slate-400 text-xs mt-1 animate-pulse">Initializing direct-buy marketplace engines...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* Navigation Bar */}
        <Navbar />

        {/* Dynamic Route Viewports */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            {/* Farmer dashboard segment */}
            <Route 
              path="/farmer" 
              element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <FarmerDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Buyer dashboard segment */}
            <Route 
              path="/buyer" 
              element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <BuyerDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Admin dashboard segment */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
