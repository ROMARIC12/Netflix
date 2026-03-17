// src/store/authStore.js

import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "https://netflixback-go5x.onrender.com/api";

export const useAuthStore = create((set, get) => ({
  // États initiaux
  user: null,
  isSubscribed: false, // NOUVEAU: État d'abonnement
  subscriptionExpiryDate: null, // NOUVEAU: Date d'expiration
  isLoading: false,
  error: null,
  message: null,
  fetchingUser: true,

  // Fonctions
  signup: async (username, email, password) => {
    set({ isLoading: true, message: null, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        username,
        email,
        password,
      });
      set({ user: response.data.user, isLoading: false, isSubscribed: response.data.user.isSubscribed });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Erreur lors de l'inscription",
      });
      throw error;
    }
  },

  login: async (username, email, password) => {
    set({ isLoading: true, message: null, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        email,
        password,
      });
      const { user, message } = response.data;
      set({
        user,
        message,
        isLoading: false,
        isSubscribed: user.isSubscribed,
        subscriptionExpiryDate: user.subscriptionExpiryDate
      });
      return { user, message };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Erreur lors de la connexion",
      });
      throw error;
    }
  },

  fetchUser: async () => {
    set({ fetchingUser: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/fetch-user`);
      const { user } = response.data;
      set({
        user,
        fetchingUser: false,
        isSubscribed: user.isSubscribed,
        subscriptionExpiryDate: user.subscriptionExpiryDate
      });
    } catch (error) {
      set({
        fetchingUser: false,
        error: null,
        user: null,
        isSubscribed: false,
        subscriptionExpiryDate: null,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/logout`);
      const { message } = response.data;
      set({
        message,
        isLoading: false,
        user: null,
        error: null,
        isSubscribed: false,
        subscriptionExpiryDate: null,
      });
      return { message };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Erreur lors de la déconnexion",
      });
      throw error;
    }
  },
}));
