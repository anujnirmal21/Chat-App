import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

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
    signUp: async (data) => {
      set({ isSigningUp: true });
      try {
        const res = await axiosInstance.post("/auth/signup", data);
        set({ authUser: res.data });
        toast.success("account created successfully");
      } catch (error) {
        toast.error("error in signup : " + error.data.message);
      } finally {
        set({ isSigningUp: false });
      }
    },
  };
});
