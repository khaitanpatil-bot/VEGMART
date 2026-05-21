import { create } from 'zustand';
import { db } from '../services/supabase';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = await db.getCurrentUser();
      if (currentUser) {
        set({ user: currentUser, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (err) {
      console.error('Error initializing auth:', err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await db.login(email, password, role);
      set({ user: profile, isAuthenticated: true, error: null });
      return profile;
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (name, email, password, role, phone, location, lat, lng) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await db.signup(name, email, password, role, phone, location, lat, lng);
      // For buyers and admins, they are logged in automatically.
      // Farmers will remain pending approval, so we don't automatically set them as logged in, or we do if they are pre-approved.
      // According to specifications: "farmers are pending admin approval"
      if (role !== 'farmer') {
        set({ user: profile, isAuthenticated: true, error: null });
      }
      return profile;
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await db.logout();
      set({ user: null, isAuthenticated: false, error: null });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null })
}));
