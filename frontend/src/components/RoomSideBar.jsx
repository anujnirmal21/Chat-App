import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import useRoomStore from "../store/useRoomStore";
import toast from "react-hot-toast";

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

  useEffect(() => {
    if (!socket) return;

    const handleMembersUpdate = (members) => {
      useRoomStore.setState((state) => {
        const prevMembers = state.roomMembers;
        let message = "";

        if (members.length > prevMembers.length) {
          // Find the new member
          const newMember = members.find(
            (m) => !prevMembers.some((p) => p._id === m._id)
          );
          message = `${newMember?.fullName || "Someone"} joined the group`;
        } else if (members.length < prevMembers.length) {
          // Find the member who left
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
    getUsers();
    checkRoom();
  }, [getUsers, checkRoom]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Members</span>
          </div>

          <button
            className={`btn btn-sm gap-2`}
            onClick={() => setActiveRoom()}
          >
            <div className="h-2 w-2 bg-green-600 mr-1 rounded-full"></div>
            <span className="hidden sm:inline text-sm">Switch to Chat</span>
          </button>
        </div>
        {/*  Online filter toggle */}

        {activeRoom && (
          <div className=" flex justify-between items-center mt-4">
            <div className=" hidden lg:flex items-center gap-1">
              <span>ID: </span>
              <span className=" text-lg font-semibold">
                {currentRoom?.roomId}
              </span>
            </div>
            {authUser._id === currentRoom?.hostId ? (
              <button
                className={`btn btn-sm gap-2 bg-red-600 text-white`}
                onClick={() => {
                  setCloseRoom();
                }}
              >
                Close Room
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

      <div className="overflow-y-auto w-full py-3">
        {activeRoom &&
          roomMembers?.length > 0 &&
          roomMembers[0]?._id &&
          roomMembers?.map((user) => (
            <button
              key={user._id}
              className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
        
            `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>
              {/* User info - only visible on larger screens */}
              <div className=" flex justify-between w-full items-center px-2">
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{user.fullName}</div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
                {user._id === hostId && (
                  <span className=" border-gray-500 border text-green-500 text-xs font-semibold h-5 w-8 flex items-center justify-center rounded-xl">
                    Host
                  </span>
                )}{" "}
              </div>
            </button>
          ))}
      </div>
    </aside>
  );
};
export default RoomSideBar;
