import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";
import { act } from "react";

const useRoomStore = create((set, get) => {
  return {
    hostId: null,
    activeRoom: false,
    roomMembers: [],
    currentRoom: null,

    setCreateRoom: async () => {
      const { _id: userId } = useAuthStore.getState().authUser;
      const { socket } = useAuthStore.getState();
      try {
        const res = await axiosInstance.get(`/room/create/${userId}`);
        const newRoom = res.data.room;

        set({ currentRoom: newRoom });
        set({ roomMembers: newRoom.members });
        set({ hostId: userId });
        if (socket?.connected) {
          setTimeout(() => {
            socket.emit("join-room", { roomId: newRoom.roomId });
          }, 100); // Delay to ensure backend is ready
        }
        toast.success("Room Created Successfully");
      } catch (error) {
        console.log("error:", error);
        toast.error(error?.response?.data?.message);
      }
    },
    setJoinRoom: async (roomId) => {
      const { _id: userId } = useAuthStore.getState().authUser;
      const { socket } = useAuthStore.getState();
      try {
        const res = await axiosInstance.post("/room/join", { roomId, userId });
        const room = res.data.room;
        set({ currentRoom: room });
        set({ hostId: room.hostId });

        // console.log(room.members);
        set({ roomMembers: room.members });

        toast.success("Joined Room Successfully");

        if (socket?.connected) {
          socket.emit("join-room", { roomId });
        }
      } catch (error) {
        console.log("Error: " + error?.response?.data);
        toast("Error: " + error?.response?.data?.message);
      }
    },

    setCloseRoom: async () => {
      const { _id: userId } = useAuthStore.getState().authUser;
      const { socket } = useAuthStore.getState();
      try {
        const res = await axiosInstance.post("/room/close", { userId });

        if (socket?.connected) {
          socket.emit("close-room", get().currentRoom.roomId);
        }
        set({ currentRoom: null });
        set({ roomMembers: [] });
        set({ activeRoom: false });
        toast.success("Room closed successfully");
      } catch (error) {
        console.log("Error: " + error?.response.data);
        toast("Error: " + error?.response?.data.message);
      }
    },
    setLeaveRoom: async () => {
      const { _id: userId } = useAuthStore.getState().authUser;
      const { socket } = useAuthStore.getState();
      try {
        const res = await axiosInstance.put("/room/leave", { userId });
        const newMembers = get().roomMembers.filter(
          (user) => user._id !== userId
        );
        const roomId = get().currentRoom?.roomId;

        if (socket?.connected && roomId) {
          socket.emit("leave-room", { roomId });
        }
        set({ roomMembers: newMembers });
        set({ currentRoom: null });
        set({ activeRoom: false });

        toast.success("Left the room successfully");
      } catch (error) {
        console.log("Error: " + error?.response.data);
        toast("Error: " + error?.response?.data.message);
      }
    },
    setCurrentRoom: (val) => set({ currentRoom: val }),
    setActiveRoom: () => set({ activeRoom: !get().activeRoom }),
    checkRoom: async () => {
      const { _id: userId } = useAuthStore.getState().authUser;
      try {
        const res = await axiosInstance.get(`/room/check/${userId}`);
        if (res.data.room) {
          const room = res.data.room;
          set({ hostId: room.hostId });
          set({ currentRoom: room });
          set({ roomMembers: room.members });
        }
      } catch (error) {
        console.log(error.response);
      }
    },
  };
});

export default useRoomStore;
