import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

const useRoomStore = create((set, get) => {
  return {
    hostId: null,
    activeRoom: false,
    roomMembers: [],
    currentRoom: null,

    setCreateRoom: async () => {
      const { _id: userId } = useAuthStore.getState().authUser;

      try {
        const res = await axiosInstance.get(`/room/create/${userId}`);
        const newRoom = res.data.room;
        console.log(newRoom);

        set({ currentRoom: newRoom });
        set({ hostId: userId });

        toast.success("Room Created Successfully");
      } catch (error) {
        console.log("error:", error);
        toast.error(error?.response?.data?.message);
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
