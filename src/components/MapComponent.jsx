import React, { useEffect, useRef } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function MapComponent({ products = [], center = [28.6139, 77.2090], zoom = 5, onProductSelect = null }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersGroup = useRef(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);

  // Set up a global quick add function that can be triggered from HTML popups
  useEffect(() => {
    window.quickAddToCart = async (productId, title, price) => {
      if (!user) {
        alert('Please login as a Buyer to add items to your cart.');
        return;
      }
      if (user.role !== 'buyer') {
        alert('Only buyers can add items to the cart.');
        return;
      }
      try {
        await addToCart(user.id, productId, 10); // default quantity 10kg
        alert(`🛒 Added 10kg of ${title} (Rs. ${price}/kg) to your cart!`);
      } catch (err) {
        alert('Failed to add to cart: ' + err.message);
      }
    };

    return () => {
      delete window.quickAddToCart;
    };
  }, [user, addToCart]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Check if Leaflet (L) is loaded on window
    const L = window.L;
    if (!L) {
      console.error('Leaflet is not loaded on window');
      return;
    }

    // Initialize map if not already done
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView(center, zoom);

      // Elegant premium dark-toned or warm-toned OpenStreetMap tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance.current);

      markersGroup.current = L.featureGroup().addTo(mapInstance.current);
    } else {
      // If map is already initialized, fly to new center
      mapInstance.current.setView(center, zoom);
    }

    // Clear existing markers
    if (markersGroup.current) {
      markersGroup.current.clearLayers();
    }

    // Custom Icon for Farmers
    const farmerIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1865/1865269.png', // Fresh Pin Icon
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    // Custom Icon for Buyer / User
    const buyerIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Red Pin
      iconSize: [35, 35],
      iconAnchor: [17, 35],
      popupAnchor: [0, -35]
    });

    // Draw Buyer position if available and centered
    if (user && user.latitude && user.longitude) {
      L.marker([user.latitude, user.longitude], { icon: buyerIcon })
        .addTo(markersGroup.current)
        .bindPopup(`
          <div class="p-2 text-slate-800">
            <h4 class="font-bold text-emerald-600 text-sm">📍 Your Location</h4>
            <p class="text-xs font-semibold">${user.name}</p>
          </div>
        `);
    }

    // Add product markers
    products.forEach((prod) => {
      const lat = prod.latitude || (prod.users && prod.users.latitude);
      const lng = prod.longitude || (prod.users && prod.users.longitude);

      if (!lat || !lng) return;

      const farmerName = prod.users ? prod.users.name : 'Verified Farmer';
      const farmerPhone = prod.users ? prod.users.phone : 'Contact info secured';
      
      const popupContent = `
        <div class="w-64 p-1 font-sans text-slate-800">
          <div class="relative h-28 w-full mb-2 rounded-lg overflow-hidden bg-slate-100">
            <img src="${prod.image_url || 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400'}" alt="${prod.title}" class="object-cover h-full w-full" />
            <span class="absolute top-2 right-2 bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
              ₹${prod.price_per_kg}/kg
            </span>
          </div>
          <h4 class="font-bold text-slate-900 text-sm mb-0.5 line-clamp-1">${prod.title}</h4>
          <p class="text-[11px] text-slate-500 mb-1">🧑🌾 Farmer: <span class="font-semibold text-slate-700">${farmerName}</span></p>
          <div class="flex justify-between items-center text-xs mb-2 border-t pt-1.5 border-slate-100">
            <div>
              <p class="text-slate-400 text-[10px] uppercase font-semibold">Available</p>
              <p class="font-bold text-emerald-700">${prod.quantity_available} kg</p>
            </div>
            <div>
              <p class="text-slate-400 text-[10px] uppercase font-semibold">Harvest Date</p>
              <p class="font-semibold text-slate-700 text-[11px]">${prod.harvest_date}</p>
            </div>
          </div>
          <div class="flex gap-1.5 mt-2">
            <button onclick="window.quickAddToCart('${prod.id}', '${prod.title.replace(/'/g, "\\'")}', ${prod.price_per_kg})" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1.5 px-2 rounded text-center transition shadow-sm cursor-pointer">
              🛒 Add 10kg
            </button>
            <a href="tel:${farmerPhone}" class="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] px-2.5 py-1.5 rounded text-center transition shadow-sm">
              📞 Call
            </a>
          </div>
        </div>
      `;

      const marker = L.marker([lat, lng], { icon: farmerIcon })
        .addTo(markersGroup.current)
        .bindPopup(popupContent);

      if (onProductSelect) {
        marker.on('click', () => {
          onProductSelect(prod);
        });
      }
    });

    // Auto fit map bounds if we have markers
    if (products.length > 0 && mapInstance.current) {
      const bounds = markersGroup.current.getBounds();
      if (bounds.isValid()) {
        mapInstance.current.fitBounds(bounds, { padding: [40, 40] });
      }
    }

  }, [products, center, zoom, user, onProductSelect]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[350px] overflow-hidden rounded-xl border border-emerald-100 shadow-md">
      <div ref={mapRef} className="w-full h-full min-h-[350px]" style={{ zIndex: 1 }} />
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm z-30 px-3 py-1.5 rounded-lg border border-emerald-50 shadow-sm flex items-center gap-4 text-xs font-semibold text-slate-700">
        <div className="flex items-center gap-1.5">
          <img src="https://cdn-icons-png.flaticon.com/512/1865/1865269.png" alt="Farm" className="w-4 h-4" />
          <span>Farms</span>
        </div>
        <div className="flex items-center gap-1.5 border-l pl-4 border-slate-200">
          <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="Buyer" className="w-3.5 h-3.5" />
          <span>Your Store</span>
        </div>
      </div>
    </div>
  );
}
