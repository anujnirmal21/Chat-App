import axios from "axios";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => {
  return {
    authUser: null,
    isSigningUp: false,
    isLogingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    checkAuth: async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        set({ authUser: res.data });
      } catch (error) {
        console.log("check auth error : " + error);
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },
    signUp: async (data) => {},
  };
});
