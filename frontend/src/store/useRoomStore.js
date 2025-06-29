import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

const useRoomStore = create((set, get) => {
  return {
    hostId: null,
    currentRoomId: null,
    roomMembers: [],
    allCreatedRooms: [],
    createdRoom: null,
    setCreatedRoom: (val) => set({ createdRoom: val }),
    setCreateRoom: async () => {
      const { _id: userId } = useAuthStore.getState().authUser;

      try {
        const res = await axiosInstance.get(`/room/create/${userId}`);
        const newRoom = res.data.room;
        console.log(newRoom);

        set({ createdRoom: newRoom });
        set({ currentRoomId: newRoom._id });
        set((state) => ({
          allCreatedRooms: [...state.allCreatedRooms, newRoom],
        }));
        set({ hostId: userId });

        toast.success("Room Created Successfully");
      } catch (error) {
        console.log("error:", error);
        toast.error(error?.response?.data?.message);
      }
    },
  };
});

export default useRoomStore;
