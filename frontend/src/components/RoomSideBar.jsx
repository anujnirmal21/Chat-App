import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Menu } from "lucide-react";
import useRoomStore from "../store/useRoomStore";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

import Button from "./room/Button";

const RoomSideBar = () => {
  const { getUsers, isUsersLoading } = useChatStore();
  const {
    currentRoom,
    setActiveRoom,
    activeRoom,
    checkRoom,
    roomMembers,
    hostId,
    setCloseRoom,
    setLeaveRoom,
  } = useRoomStore();

  const { onlineUsers, authUser, socket } = useAuthStore();

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleMembersUpdate = (members) => {
      useRoomStore.setState((state) => {
        const prevMembers = state.roomMembers;
        let message = "";

        if (members.length > prevMembers.length) {
          const newMember = members.find(
            (m) => !prevMembers.some((p) => p._id === m._id)
          );
          message = `${newMember?.fullName || "Someone"} joined the group`;
        } else if (members.length < prevMembers.length) {
          const leftMember = prevMembers.find(
            (p) => !members.some((m) => m._id === p._id)
          );
          message = `${leftMember?.fullName || "Someone"} left the group`;
        }

        if (message) toast.success(message);
        return { roomMembers: members };
      });
    };

    socket.on("room-members", handleMembersUpdate);

    return () => socket.off("room-members", handleMembersUpdate);
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleCloseRoom = () => {
      useRoomStore.setState(() => ({
        roomMembers: [],
        activeRoom: false,
        currentRoom: null,
        hostId: null,
      }));
      toast.success("Room is closed by host.");
    };

    socket.on("room-closed", handleCloseRoom);

    return () => socket.off("room-closed", handleCloseRoom);
  }, [socket]);

  useEffect(() => {
    getUsers();
    checkRoom();
  }, [getUsers, checkRoom]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-[0.55rem] left-[0.60rem] z-50 p-2 bg-base-100"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Toggle sidebar"
      >
        <Menu className="size-8" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 bg-base-100 border-r border-base-300 flex flex-col transition-all duration-200
          w-64
          lg:static lg:w-72
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="opacity-0 lg:opacity-100 size-6" />
              <span className="font-medium hidden lg:block">Members</span>
            </div>

            <Button text={"Chat"} />
          </div>

          {activeRoom && (
            <div className="flex justify-between items-center mt-4">
              <div className=" lg:flex items-center gap-1">
                <span>ID: </span>
                <span className="text-lg font-semibold">
                  {currentRoom?.roomId}
                </span>
              </div>
              {authUser._id === currentRoom?.hostId ? (
                <button
                  className={`btn btn-sm gap-1 bg-red-600 text-white flex justify-center items-center`}
                  onClick={() => setCloseRoom()}
                >
                  <IoClose size={20} /> <span>Close</span>
                </button>
              ) : (
                <button
                  className={`btn btn-sm gap-2 bg-red-600 text-white`}
                  onClick={() => setLeaveRoom()}
                >
                  Leave Room
                </button>
              )}
            </div>
          )}
        </div>

        <div className="overflow-y-auto w-full py-3 flex-1">
          {activeRoom &&
            roomMembers?.length > 0 &&
            roomMembers[0]?._id &&
            roomMembers?.map((user) => (
              <button
                key={user._id}
                className="w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors"
              >
                <div className="relative">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="size-12 object-cover rounded-full"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span
                      className="absolute bottom-0 right-0 size-3 bg-green-500 
              rounded-full ring-2 ring-zinc-900"
                    />
                  )}
                </div>

                {/* User info - now always visible */}
                <div className="flex justify-between w-full items-center px-2 overflow-hidden">
                  <div className="text-left min-w-0">
                    <div className="font-medium truncate">{user.fullName}</div>
                    <div className="text-sm text-zinc-400">
                      {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                  {user._id === hostId && (
                    <span className="border-gray-500 border text-green-500 text-xs font-semibold h-5 w-8 flex items-center justify-center rounded-xl">
                      Host
                    </span>
                  )}
                </div>
              </button>
            ))}
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default RoomSideBar;
