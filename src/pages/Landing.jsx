import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, ArrowRight, DollarSign, LineChart, Shield, MapPin, Truck, ChevronRight } from 'lucide-react';

export default function Landing() {
  const stats = [
    { value: '10,000+', label: 'Verified Farmers' },
    { value: '₹12 Cr+', label: 'Middleman Margins Saved' },
    { value: '500+', label: 'Partner Supermarkets' },
    { value: '1 Hr', label: 'Cart Lock Guarantee' },
  ];

  const features = [
    {
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      title: 'AI Price Suggestion',
      description: 'Our proprietary, open-source models analyze historical transactions to suggest the optimal, fair market prices for both sides.'
    },
    {
      icon: <MapPin className="w-6 h-6 text-emerald-600" />,
      title: 'Geospatial Map Routing',
      description: 'Find nearby farming hubs instantly via integrated Leaflet OSM routing. Reduces supply chain carbon footprint and transit time.'
    },
    {
      icon: <Truck className="w-6 h-6 text-emerald-600" />,
      title: 'Zero Middleman Margins',
      description: 'Farmers upload crops directly; supermarkets buy them directly. No commission agents, no hidden commissions, maximum earnings.'
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      title: '1-Hour Order Assurance',
      description: 'Carts automatically reserve farmer inventory for exactly 60 minutes with dynamic countdown timers, guaranteeing availability.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pb-28 lg:pb-32 bg-gradient-to-b from-emerald-50/60 to-slate-50">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-60 transform translate-x-20 -translate-y-20"></div>
        <div className="absolute top-1/2 left-0 -z-10 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-40 transform -translate-x-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Premium Announcement Tag */}
              <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 border border-emerald-200/50 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 backdrop-blur-sm animate-pulse-gentle">
                <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                <span>Bridging the Gap: Direct Farm-to-Business Commerce</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Empowering Farmers. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-700">
                  Fueling Businesses.
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
                FarmDirect is a revolutionary, decentralized B2B marketplace. We connect local farmers directly to supermarkets, wholesale distributors, and restaurants. By integrating smart mapping, automated stock locking, and AI price optimization, we ensure crop freshness and superior margins.
              </p>

              {/* Call to Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link 
                  to="/login?tab=signup&role=buyer"
                  className="group bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition duration-300 shadow-lg hover:shadow-slate-300"
                >
                  <span>Register as Buyer</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
                
                <Link 
                  to="/login?tab=signup&role=farmer"
                  className="bg-white hover:bg-slate-50 text-emerald-700 border-2 border-emerald-100 hover:border-emerald-200 font-extrabold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition duration-300 shadow-sm"
                >
                  <Sprout className="w-5 h-5 text-emerald-600" />
                  <span>Join as Farmer</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500 pt-6 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                  No Hidden Fees
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                <span className="flex items-center gap-1.5">
                  <LineChart className="w-4.5 h-4.5 text-emerald-600" />
                  AI Suggested Prices
                </span>
              </div>
            </div>

            {/* Hero Right Media */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[420px] lg:max-w-none">
                {/* Main Premium Floating Visual */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-square bg-slate-100 relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80" 
                    alt="Fresh Farm Tomatoes Sourced Direct" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-transparent"></div>
                </div>

                {/* Floating Glass Widget 1: Farmer Pin */}
                <div className="absolute -top-4 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-3 animate-pulse-gentle">
                  <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nearby Farm</p>
                    <p className="text-xs font-bold text-slate-800">Punjab Fields (12 km away)</p>
                  </div>
                </div>

                {/* Floating Glass Widget 2: Price suggested */}
                <div className="absolute -bottom-6 -right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-xl text-amber-700">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Suggested Price</p>
                    <p className="text-xs font-bold text-slate-800">₹22/kg <span className="text-[10px] font-normal text-emerald-600">(-14% retail)</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-emerald-950 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-white font-sans">{stat.value}</p>
                <p className="text-emerald-300 text-xs sm:text-sm font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Streamlining the Fresh Produce Supply Chain
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            By leveraging basic AI, spatial maps, and a zero-middleman approach, FarmDirect provides a faster, cheaper, and cleaner marketplace.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition relative">
            <div className="bg-emerald-50 text-emerald-700 font-bold text-sm h-8 w-8 rounded-full flex items-center justify-center mb-6">
              1
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg mb-3">Farmers List Crops</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Farmers quickly upload crop information, quantities, and harvest dates. Our basic AI checks image resolution and detects blur, guaranteeing professional listings.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition relative">
            <div className="bg-emerald-50 text-emerald-700 font-bold text-sm h-8 w-8 rounded-full flex items-center justify-center mb-6">
              2
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg mb-3">Businesses Browse</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Buyers search items by distance, freshness index, or price. When they select products, the inventory locks for 1 hour to prevent double-booking.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition relative">
            <div className="bg-emerald-50 text-emerald-700 font-bold text-sm h-8 w-8 rounded-full flex items-center justify-center mb-6">
              3
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg mb-3">Direct Dispatch</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              No complex payment gates needed here. Confirming orders displays direct farmer phone and WhatsApp numbers. Dispatch, coordinate, and pay on delivery directly.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="bg-slate-100/50 py-20 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Graphics */}
            <div className="lg:col-span-5 relative order-last lg:order-first">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-video relative">
                <img 
                  src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80" 
                  alt="Aromatic basmati crop" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-video mt-6 ml-12 relative">
                <img 
                  src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80" 
                  alt="Harvested fresh potatoes" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            {/* Right Core Features List */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Marketplace Excellence
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                  Features Crafted for Direct Agricultural Wholesale
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feat, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 hover:shadow-md transition">
                    <div className="bg-emerald-50 p-2.5 rounded-xl inline-block">
                      {feat.icon}
                    </div>
                    <h3 className="font-bold text-slate-800 text-base">{feat.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{feat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Real Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Success Stories From Our Farms & Stores
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative space-y-4">
            <p className="text-slate-600 italic text-sm leading-relaxed">
              "Before FarmDirect, we were selling our Basmati rice to agents at the local grain market who kept over 35% as their commission. Now, I upload my harvest details here and HyperCity supermarket orders it directly. They get fresh crops, and I get paid 100% of my hard-earned work instantly on delivery!"
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                RK
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Rajesh Kumar</p>
                <p className="text-slate-400 text-xs">Rice Farmer, Ludhiana (Punjab)</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative space-y-4">
            <p className="text-slate-600 italic text-sm leading-relaxed">
              "Sourcing tomatoes and grapes for our 12 supermarkets in Mumbai was a logistic nightmare with quality fluctuating daily. FarmDirect lets us browse verified crop harvests, see the farm locations on an OpenStreetMap, and check quality beforehand. Direct delivery from Nashik saves us lakhs in agent fees!"
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                SD
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Savitri Devi</p>
                <p className="text-slate-400 text-xs">Sourcing Lead, HyperCity Supermarkets</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Wrapper */}
      <section className="bg-emerald-900 py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Ready to Cut Out the Middlemen?
          </h2>
          <p className="text-emerald-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Whether you are a farmer looking to maximize crop earnings, or a supermarket manager securing fresh stock, FarmDirect is built for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link 
              to="/login?tab=signup"
              className="bg-white hover:bg-slate-50 text-slate-900 font-extrabold px-8 py-3.5 rounded-xl transition shadow-lg"
            >
              Get Started Now
            </Link>
            <Link 
              to="/login"
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold px-8 py-3.5 rounded-xl border border-emerald-700 hover:border-emerald-600 transition"
            >
              Log In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="bg-slate-900 py-8 text-center text-xs font-semibold text-slate-500 border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()} FarmDirect Inc. AI-Powered Farmer-to-Business Marketplace. Open-source under MIT License.</p>
      </footer>
    </div>
  );
}
