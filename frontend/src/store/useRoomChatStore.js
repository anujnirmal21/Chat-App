import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

const useRoomChatStore = create((set, get) => {
  return {
    messages: [],
    senderId: null,
    isMessagesLoading: false,
    getMessages: async (roomId) => {
      set({ isMessagesLoading: true });
      try {
        const res = await axiosInstance.get(`/room/message/get/${roomId}`);
        set({ messages: res.data });
      } catch (error) {
        toast.error(error.response?.data?.message);
        console.log(error);
      } finally {
        set({ isMessagesLoading: false });
      }
    },

    sendRoomMessage: async (messageData) => {
      const { messages } = get();
      const { socket } = useAuthStore.getState();
      try {
        const res = await axiosInstance.post(`/room/message/send`, messageData);
        socket.emit("send-room-message", {
          ...messageData,
          senderId: res.data.senderId,
        });
        set({ senderId: res.data.senderId });
      } catch (error) {
        toast.error(error.response.data.message);
        toast.error(error.response);
      }
    },
  };
});

export { useRoomChatStore };
