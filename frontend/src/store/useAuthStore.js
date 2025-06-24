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
    onlineUsers: [],
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
        toast.error(error.response.data.message);
      } finally {
        set({ isSigningUp: false });
      }
    },
    logOut: async () => {
      try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logout Successfully");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
    login: async (data) => {
      try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Login Successfully");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
    updateProfile: async (data) => {
      try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({
          authuser: { ...authUser, profile_pic: res.data.user.profile_pic },
        });
        toast.success("Profile Updated Successfully");
      } catch (error) {
        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";
        toast.error(errorMsg);
      }
    },
  };
});
