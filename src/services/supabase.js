import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid and not placeholder values
const isRealSupabase = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

export const supabase = isRealSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

console.log(
  isRealSupabase 
    ? '🚀 FarmDirect: Connected to Supabase Real-time Cloud!' 
    : '📦 FarmDirect: Running in Simulated Local Database Mode (Zero Backend Friction).'
);

// ====================================================
// SEED DATA FOR MOCK BACKEND
// ====================================================
const defaultMockUsers = [
  {
    id: 'f1-uuid-1',
    name: 'Rajesh Kumar',
    email: 'farmer1@farmdirect.com',
    role: 'farmer',
    phone: '+91 98765 43210',
    location: 'Punjab Fields, India',
    latitude: 30.9010,
    longitude: 75.8573,
    status: 'approved',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'f2-uuid-2',
    name: 'Savitri Devi',
    email: 'farmer2@farmdirect.com',
    role: 'farmer',
    phone: '+91 87654 32109',
    location: 'Nashik Vineyards, Maharashtra',
    latitude: 19.9975,
    longitude: 73.7898,
    status: 'approved',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'f3-uuid-3',
    name: 'Anil Patil',
    email: 'farmer3@farmdirect.com',
    role: 'farmer',
    phone: '+91 76543 21098',
    location: 'Ooty Organic Farms, Tamil Nadu',
    latitude: 11.4102,
    longitude: 76.6950,
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'b1-uuid',
    name: 'HyperCity Supermarket',
    email: 'buyer@farmdirect.com',
    role: 'buyer',
    phone: '+91 90001 90002',
    location: 'Connaught Place, New Delhi',
    latitude: 28.6304,
    longitude: 77.2177,
    status: 'approved',
    created_at: new Date().toISOString()
  },
  {
    id: 'a1-uuid',
    name: 'FarmDirect Admin',
    email: 'admin@farmdirect.com',
    role: 'admin',
    phone: '+91 99999 99999',
    location: 'Headquarters, Delhi',
    latitude: 28.6139,
    longitude: 77.2090,
    status: 'approved',
    created_at: new Date().toISOString()
  }
];

const defaultMockProducts = [
  {
    id: 'p1',
    farmer_id: 'f1-uuid-1',
    title: 'Premium Basmati Rice (Pusa 1121)',
    description: 'Long grain, highly aromatic Basmati rice. Freshly harvested and processed with minimal moisture. Ideal for commercial retailers and fine dining restaurants.',
    price_per_kg: 85.00,
    quantity_available: 500,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    harvest_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: 'Punjab Fields, India',
    latitude: 30.9010,
    longitude: 75.8573,
    created_at: new Date().toISOString()
  },
  {
    id: 'p2',
    farmer_id: 'f2-uuid-2',
    title: 'Fresh Organic Vine Tomatoes',
    description: 'Bright red, juicy vine-ripened tomatoes grown under organic farming conditions in Nashik. Excellent shelf life and perfect for salads or purees.',
    price_per_kg: 40.00,
    quantity_available: 300,
    image_url: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    harvest_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: 'Nashik Vineyards, Maharashtra',
    latitude: 19.9975,
    longitude: 73.7898,
    created_at: new Date().toISOString()
  },
  {
    id: 'p3',
    farmer_id: 'f1-uuid-1',
    title: 'Organic Potatoes (Jyoti Variety)',
    description: 'Directly sourced from potato hubs of Punjab. Free from heavy chemicals, stored in optimal temperature. Ideal for grocery chains and packaging factories.',
    price_per_kg: 22.00,
    quantity_available: 1200,
    image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    harvest_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: 'Punjab Fields, India',
    latitude: 30.9010,
    longitude: 75.8573,
    created_at: new Date().toISOString()
  },
  {
    id: 'p4',
    farmer_id: 'f2-uuid-2',
    title: 'Sweet Export-Quality Seedless Grapes',
    description: 'Juicy green seedless grapes with crunchy texture. Rigorous size sorting done. Packaged in breathable 500g boxes. Straight from India\'s grape capital Nashik.',
    price_per_kg: 120.00,
    quantity_available: 250,
    image_url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
    harvest_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: 'Nashik Vineyards, Maharashtra',
    latitude: 19.9975,
    longitude: 73.7898,
    created_at: new Date().toISOString()
  }
];

const defaultMockReviews = [
  {
    id: 'rev1',
    buyer_id: 'b1-uuid',
    farmer_id: 'f1-uuid-1',
    rating: 5,
    comment: 'Superb quality Basmati! Our customers loved the long grains and intense aroma. Rajesh is highly responsive.',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rev2',
    buyer_id: 'b1-uuid',
    farmer_id: 'f2-uuid-2',
    rating: 4,
    comment: 'Very fresh tomatoes, though 5% suffered minor damage during transport. Overall extremely happy with direct sourcing!',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Helper to initialize local storage
const initLocalStorage = () => {
  if (!localStorage.getItem('fd_users')) {
    localStorage.setItem('fd_users', JSON.stringify(defaultMockUsers));
  }
  if (!localStorage.getItem('fd_products')) {
    localStorage.setItem('fd_products', JSON.stringify(defaultMockProducts));
  }
  if (!localStorage.getItem('fd_reviews')) {
    localStorage.setItem('fd_reviews', JSON.stringify(defaultMockReviews));
  }
  if (!localStorage.getItem('fd_cart')) {
    localStorage.setItem('fd_cart', JSON.stringify([]));
  }
  if (!localStorage.getItem('fd_orders')) {
    localStorage.setItem('fd_orders', JSON.stringify([]));
  }
};

initLocalStorage();

// ====================================================
// UNIFIED DATA SERVICE (SUPABASE OR MOCK)
// ====================================================
export const db = {
  isMock: !isRealSupabase,

  // --- AUTH SERVICES ---
  async login(email, password, role) {
    if (isRealSupabase) {
      // For standard Supabase auth (mock OTP / Password login depends on settings, let's use signInWithPassword)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Get user profile role
      const { data: profile, error: pError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (pError) throw new Error('Profile does not exist. Contact Admin.');
      if (profile.role !== role) {
        throw new Error(`Invalid role. This account is registered as a ${profile.role}.`);
      }
      if (profile.role === 'farmer' && profile.status !== 'approved') {
        throw new Error('Your farmer application status is currently: ' + profile.status.toUpperCase() + '. Please wait for Admin approval.');
      }
      return profile;
    } else {
      // Mock Authentication
      const users = JSON.parse(localStorage.getItem('fd_users') || '[]');
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('No account found with this email. Please sign up!');
      }
      if (user.role !== role) {
        throw new Error(`Invalid role. This account is registered as a ${user.role}.`);
      }
      if (user.role === 'farmer' && user.status !== 'approved') {
        throw new Error(`Your farmer application status is currently: ${user.status.toUpperCase()}. Please wait for Admin approval.`);
      }
      
      // Return user profile
      localStorage.setItem('fd_current_user', JSON.stringify(user));
      return user;
    }
  },

  async signup(name, email, password, role, phone, location, lat, lng) {
    if (isRealSupabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            phone,
            location,
            latitude: lat,
            longitude: lng,
          }
        }
      });
      if (error) throw error;

      // When RLS allows public profiles, or trigger handles it, wait a bit
      // Return profile
      let retry = 0;
      let profile = null;
      while (retry < 5) {
        const { data: pData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (pData) {
          profile = pData;
          break;
        }
        await new Promise(r => setTimeout(r, 500));
        retry++;
      }
      
      if (!profile) {
        // Fallback profile upsert manually (safeguard against trigger delay or duplicate key conflicts)
        const { data: insData, error: insError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            name,
            email,
            role,
            phone,
            location,
            latitude: lat,
            longitude: lng,
            status: role === 'farmer' ? 'pending' : 'approved'
          })
          .select()
          .single();
        if (insError) throw insError;
        profile = insData;
      }
      
      return profile;
    } else {
      // Mock Sign Up
      const users = JSON.parse(localStorage.getItem('fd_users') || '[]');
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email already exists.');
      }
      
      const newProfile = {
        id: `mock-uuid-${Date.now()}`,
        name,
        email,
        role,
        phone,
        location,
        latitude: lat || 28.6139,
        longitude: lng || 77.2090,
        status: role === 'farmer' ? 'pending' : 'approved',
        created_at: new Date().toISOString()
      };
      
      users.push(newProfile);
      localStorage.setItem('fd_users', JSON.stringify(users));
      
      // Store current user if they are automatically logged in (only for buyers/admins since farmers need approval)
      if (role !== 'farmer') {
        localStorage.setItem('fd_current_user', JSON.stringify(newProfile));
      }
      
      return newProfile;
    }
  },

  async getCurrentUser() {
    if (isRealSupabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      return data;
    } else {
      return JSON.parse(localStorage.getItem('fd_current_user') || 'null');
    }
  },

  async logout() {
    if (isRealSupabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('fd_current_user');
    }
  },

  // --- PRODUCTS CRUD SERVICES ---
  async getProducts() {
    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          users:farmer_id (name, email, phone, location, latitude, longitude, status)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const products = JSON.parse(localStorage.getItem('fd_products') || '[]');
      const users = JSON.parse(localStorage.getItem('fd_users') || '[]');
      
      return products.map(prod => {
        const farmer = users.find(u => u.id === prod.farmer_id);
        return {
          ...prod,
          users: farmer ? {
            name: farmer.name,
            email: farmer.email,
            phone: farmer.phone,
            location: farmer.location,
            latitude: farmer.latitude,
            longitude: farmer.longitude,
            status: farmer.status
          } : null
        };
      }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },

  async createProduct(productData) {
    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const products = JSON.parse(localStorage.getItem('fd_products') || '[]');
      const newProduct = {
        id: `prod-${Date.now()}`,
        ...productData,
        created_at: new Date().toISOString()
      };
      products.push(newProduct);
      localStorage.setItem('fd_products', JSON.stringify(products));
      return newProduct;
    }
  },

  async updateProduct(id, productData) {
    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const products = JSON.parse(localStorage.getItem('fd_products') || '[]');
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('Product not found');
      
      products[idx] = { ...products[idx], ...productData };
      localStorage.setItem('fd_products', JSON.stringify(products));
      return products[idx];
    }
  },

  async deleteProduct(id) {
    if (isRealSupabase) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } else {
      let products = JSON.parse(localStorage.getItem('fd_products') || '[]');
      products = products.filter(p => p.id !== id);
      localStorage.setItem('fd_products', JSON.stringify(products));
      
      // Clean from cart if present
      let cart = JSON.parse(localStorage.getItem('fd_cart') || '[]');
      cart = cart.filter(c => c.product_id !== id);
      localStorage.setItem('fd_cart', JSON.stringify(cart));
      return true;
    }
  },

  // --- IMAGE UPLOAD SUPPORT ---
  async uploadProductImage(file) {
    if (isRealSupabase) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } else {
      // Mock Upload: Convert to Base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    }
  },

  // --- CART SERVICES ---
  async getCart(buyerId) {
    if (isRealSupabase) {
      // Trigger cleans up expired before select automatically, but query just in case
      const { data, error } = await supabase
        .from('cart')
        .select(`
          *,
          products (*)
        `)
        .eq('buyer_id', buyerId);
      if (error) throw error;
      return data;
    } else {
      // Sync expires
      let cart = JSON.parse(localStorage.getItem('fd_cart') || '[]');
      const now = Date.now();
      const beforeLength = cart.length;
      cart = cart.filter(item => new Date(item.expires_at).getTime() > now);
      if (cart.length !== beforeLength) {
        localStorage.setItem('fd_cart', JSON.stringify(cart));
      }

      const products = JSON.parse(localStorage.getItem('fd_products') || '[]');
      return cart
        .filter(item => item.buyer_id === buyerId)
        .map(item => ({
          ...item,
          products: products.find(p => p.id === item.product_id)
        }))
        .filter(item => item.products !== undefined); // product still exists
    }
  },

  async addToCart(buyerId, productId, quantity) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    if (isRealSupabase) {
      // Check if product already in cart
      const { data: existing } = await supabase
        .from('cart')
        .select('*')
        .eq('buyer_id', buyerId)
        .eq('product_id', productId)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('cart')
          .update({ 
            quantity: Number(existing.quantity) + Number(quantity),
            expires_at: expiresAt 
          })
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('cart')
          .insert({
            buyer_id: buyerId,
            product_id: productId,
            quantity: Number(quantity),
            expires_at: expiresAt
          })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    } else {
      const cart = JSON.parse(localStorage.getItem('fd_cart') || '[]');
      const existing = cart.find(c => c.buyer_id === buyerId && c.product_id === productId);

      if (existing) {
        existing.quantity = Number(existing.quantity) + Number(quantity);
        existing.expires_at = expiresAt;
      } else {
        cart.push({
          id: `cart-${Date.now()}`,
          buyer_id: buyerId,
          product_id: productId,
          quantity: Number(quantity),
          expires_at: expiresAt,
          created_at: new Date().toISOString()
        });
      }

      localStorage.setItem('fd_cart', JSON.stringify(cart));
      return true;
    }
  },

  async removeFromCart(cartId) {
    if (isRealSupabase) {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartId);
      if (error) throw error;
      return true;
    } else {
      let cart = JSON.parse(localStorage.getItem('fd_cart') || '[]');
      cart = cart.filter(c => c.id !== cartId);
      localStorage.setItem('fd_cart', JSON.stringify(cart));
      return true;
    }
  },

  async clearCart(buyerId) {
    if (isRealSupabase) {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('buyer_id', buyerId);
      if (error) throw error;
      return true;
    } else {
      let cart = JSON.parse(localStorage.getItem('fd_cart') || '[]');
      cart = cart.filter(c => c.buyer_id !== buyerId);
      localStorage.setItem('fd_cart', JSON.stringify(cart));
      return true;
    }
  },

  // --- ORDERS SERVICES ---
  async getOrders(userId, role) {
    if (isRealSupabase) {
      let query = supabase.from('orders').select(`
        *,
        products (*),
        buyer:buyer_id (name, email, phone, location),
        farmer:farmer_id (name, email, phone, location)
      `);

      if (role === 'farmer') {
        query = query.eq('farmer_id', userId);
      } else if (role === 'buyer') {
        query = query.eq('buyer_id', userId);
      } // admin gets all

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const orders = JSON.parse(localStorage.getItem('fd_orders') || '[]');
      const users = JSON.parse(localStorage.getItem('fd_users') || '[]');
      const products = JSON.parse(localStorage.getItem('fd_products') || '[]');

      let filtered = orders;
      if (role === 'farmer') {
        filtered = orders.filter(o => o.farmer_id === userId);
      } else if (role === 'buyer') {
        filtered = orders.filter(o => o.buyer_id === userId);
      }

      return filtered.map(order => {
        const buyer = users.find(u => u.id === order.buyer_id);
        const farmer = users.find(u => u.id === order.farmer_id);
        const product = products.find(p => p.id === order.product_id);
        return {
          ...order,
          products: product || { title: 'Unknown Product', price_per_kg: order.price || 0 },
          buyer: buyer ? { name: buyer.name, email: buyer.email, phone: buyer.phone, location: buyer.location } : null,
          farmer: farmer ? { name: farmer.name, email: farmer.email, phone: farmer.phone, location: farmer.location } : null
        };
      }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },

  async placeOrder(buyerId, cartItems) {
    // cartItems has product detail
    if (isRealSupabase) {
      const orderInserts = cartItems.map(item => ({
        buyer_id: buyerId,
        farmer_id: item.products.farmer_id,
        product_id: item.product_id,
        quantity: item.quantity,
        status: 'pending'
      }));

      const { data, error } = await supabase
        .from('orders')
        .insert(orderInserts)
        .select();

      if (error) throw error;

      // Update product quantities remaining
      for (const item of cartItems) {
        const newQty = Math.max(0, Number(item.products.quantity_available) - Number(item.quantity));
        await supabase
          .from('products')
          .update({ quantity_available: newQty })
          .eq('id', item.product_id);
      }

      // Clear buyer cart
      await this.clearCart(buyerId);
      return data;
    } else {
      const orders = JSON.parse(localStorage.getItem('fd_orders') || '[]');
      const products = JSON.parse(localStorage.getItem('fd_products') || '[]');

      const placedOrders = [];

      for (const item of cartItems) {
        const ord = {
          id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          buyer_id: buyerId,
          farmer_id: item.products.farmer_id,
          product_id: item.product_id,
          quantity: item.quantity,
          status: 'pending',
          created_at: new Date().toISOString()
        };
        orders.push(ord);
        placedOrders.push(ord);

        // Deduct quantities
        const pIdx = products.findIndex(p => p.id === item.product_id);
        if (pIdx !== -1) {
          products[pIdx].quantity_available = Math.max(0, Number(products[pIdx].quantity_available) - Number(item.quantity));
        }
      }

      localStorage.setItem('fd_orders', JSON.stringify(orders));
      localStorage.setItem('fd_products', JSON.stringify(products));

      // Clear cart
      this.clearCart(buyerId);
      return placedOrders;
    }
  },

  async updateOrderStatus(orderId, status) {
    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const orders = JSON.parse(localStorage.getItem('fd_orders') || '[]');
      const idx = orders.findIndex(o => o.id === orderId);
      if (idx === -1) throw new Error('Order not found');
      
      orders[idx].status = status;
      localStorage.setItem('fd_orders', JSON.stringify(orders));
      return orders[idx];
    }
  },

  // --- REVIEWS SERVICES ---
  async getReviews(farmerId) {
    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          buyer:buyer_id (name, email)
        `)
        .eq('farmer_id', farmerId);
      if (error) throw error;
      return data;
    } else {
      const reviews = JSON.parse(localStorage.getItem('fd_reviews') || '[]');
      const users = JSON.parse(localStorage.getItem('fd_users') || '[]');
      
      return reviews
        .filter(r => r.farmer_id === farmerId)
        .map(r => {
          const buyer = users.find(u => u.id === r.buyer_id);
          return {
            ...r,
            buyer: buyer ? { name: buyer.name, email: buyer.email } : { name: 'Verified Buyer', email: '' }
          };
        });
    }
  },

  async addReview(buyerId, farmerId, rating, comment) {
    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          buyer_id: buyerId,
          farmer_id: farmerId,
          rating,
          comment
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const reviews = JSON.parse(localStorage.getItem('fd_reviews') || '[]');
      const newReview = {
        id: `rev-${Date.now()}`,
        buyer_id: buyerId,
        farmer_id: farmerId,
        rating: Number(rating),
        comment,
        created_at: new Date().toISOString()
      };
      reviews.push(newReview);
      localStorage.setItem('fd_reviews', JSON.stringify(reviews));
      return newReview;
    }
  },

  // --- ADMIN SPECIAL SERVICES ---
  async getAllUsers() {
    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      return JSON.parse(localStorage.getItem('fd_users') || '[]');
    }
  },

  async updateUserStatus(userId, status) {
    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const users = JSON.parse(localStorage.getItem('fd_users') || '[]');
      const idx = users.findIndex(u => u.id === userId);
      if (idx === -1) throw new Error('User not found');

      users[idx].status = status;
      localStorage.setItem('fd_users', JSON.stringify(users));
      
      // If we are currently updating the logged in mock user, reflect it
      const current = JSON.parse(localStorage.getItem('fd_current_user') || 'null');
      if (current && current.id === userId) {
        current.status = status;
        localStorage.setItem('fd_current_user', JSON.stringify(current));
      }
      return users[idx];
    }
  }
};
