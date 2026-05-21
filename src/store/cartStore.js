import { create } from 'zustand';
import { db } from '../services/supabase';

export const useCartStore = create((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  timerInterval: null,

  fetchCart: async (buyerId) => {
    if (!buyerId) return;
    set({ isLoading: true, error: null });
    try {
      const data = await db.getCart(buyerId);
      set({ items: data || [] });
      get().startExpirationTimer(buyerId);
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (buyerId, productId, quantity, productDetails) => {
    if (!buyerId) return;
    set({ isLoading: true, error: null });
    try {
      await db.addToCart(buyerId, productId, quantity);
      
      // Refresh cart to get updated expires_at and db integrity
      const data = await db.getCart(buyerId);
      set({ items: data || [] });
      
      get().startExpirationTimer(buyerId);
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  removeFromCart: async (cartId, buyerId) => {
    set({ isLoading: true, error: null });
    try {
      await db.removeFromCart(cartId);
      set((state) => ({
        items: state.items.filter((item) => item.id !== cartId),
      }));
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async (buyerId) => {
    if (!buyerId) return;
    set({ isLoading: true, error: null });
    try {
      await db.clearCart(buyerId);
      set({ items: [] });
      get().stopExpirationTimer();
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  checkout: async (buyerId) => {
    const { items } = get();
    if (items.length === 0) return;
    set({ isLoading: true, error: null });
    try {
      await db.placeOrder(buyerId, items);
      set({ items: [] });
      get().stopExpirationTimer();
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // Start checking every second for expired items
  startExpirationTimer: (buyerId) => {
    get().stopExpirationTimer();

    const interval = setInterval(async () => {
      const { items } = get();
      if (items.length === 0) {
        get().stopExpirationTimer();
        return;
      }

      const now = Date.now();
      let hasExpired = false;
      const unexpiredItems = [];
      const expiredItemIds = [];

      for (const item of items) {
        const expiryTime = new Date(item.expires_at).getTime();
        if (expiryTime <= now) {
          hasExpired = true;
          expiredItemIds.push(item.id);
        } else {
          unexpiredItems.push(item);
        }
      }

      if (hasExpired) {
        // Remove expired from state immediately for snappy UI
        set({ items: unexpiredItems });
        
        // Remove from DB/LocalStorage asynchronously
        for (const id of expiredItemIds) {
          try {
            await db.removeFromCart(id);
          } catch (e) {
            console.error('Failed to remove expired item from DB:', e);
          }
        }
        
        // Push simple reactive browser notification or alert if possible
        console.warn('⚠️ Some items in your cart have expired and were automatically removed.');
      }
    }, 1000);

    set({ timerInterval: interval });
  },

  stopExpirationTimer: () => {
    const { timerInterval } = get();
    if (timerInterval) {
      clearInterval(timerInterval);
      set({ timerInterval: null });
    }
  }
}));
