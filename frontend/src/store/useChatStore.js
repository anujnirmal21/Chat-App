import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "./../lib/axios";

export const useChatStore = create((set, get) => {
  return {
    messages: [],
    users: [],
    selectedUser: null,
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
        set({ messages: res.data.messages });
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isMessageLoading: false });
      }
    },
    setSelectedUser: (userID) => {
      set({ selectedUser: userID });
    },
    sendMessage: async (messageData) => {
      const { selectedUser, messages } = get();

      try {
        let res = await axiosInstance.post(
          `/message/send/${selectedUser._id}`,
          messageData
        );

        set({
          messages: [...messages, res.data.messages],
        });
      } catch (error) {
        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred";
        toast.error(errorMsg);
      }
    },
  };
});
