import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "./../lib/axios";

export const useChatStore = create((set) => {
  return {
    messages: [],
    users: [],
    selecedUser: null,
    isMessageLoading: false,
    isUserLoading: false,
    setMessages: async (message) => {
      set({ messages: message });
    },
    getUsers: async () => {
      set({ isUserLoading: true });
      try {
        let res = await axiosInstance.get("/message/users");
        set({ users: res.data.users });
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isUserLoading: false });
      }
    },
    getMessages: async (userId) => {
      set({ isMessageLoading: true });
      try {
        let res = await axiosInstance.get(`/message/${userId}`);
        set({ messages: res.data });
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isMessageLoading: false });
      }
    },
    setSelectedUser: (userID) => {
      set({ selecedUser: userID });
    },
  };
});
