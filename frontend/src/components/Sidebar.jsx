import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import useRoomStore from "../store/useRoomStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const {
    currentRoom,
    setActiveRoom,
    activeRoom,
    checkRoom,
    roomMembers,
    hostId,
  } = useRoomStore();
  console.log("members : " + roomMembers);

  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
    checkRoom();
  }, [getUsers, checkRoom]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">
              {activeRoom ? "Members" : "Contacts"}
            </span>
          </div>
          {currentRoom && (
            <button
              className={`btn btn-sm gap-2`}
              onClick={() => setActiveRoom()}
            >
              <div className="h-2 w-2 bg-green-600 mr-1 rounded-full"></div>
              <span className="hidden sm:inline text-sm">
                {activeRoom ? "Switch to Chat" : "Active Room"}
              </span>
            </button>
          )}
        </div>
        {/*  Online filter toggle */}
        {!activeRoom && (
          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">
              ({onlineUsers.length - 1} online)
            </span>
          </div>
        )}

        {activeRoom && (
          <div className=" flex justify-between items-center mt-4">
            <div className=" hidden lg:flex items-center gap-1">
              <span>ID: </span>
              <span className=" text-lg font-semibold">
                {currentRoom.roomId}
              </span>
            </div>
            <button
              className={`btn btn-sm gap-2 bg-red-600 text-white`}
              onClick={() => setActiveRoom()}
            >
              Close Room
            </button>
          </div>
        )}
      </div>

      <div className="overflow-y-auto w-full py-3">
        {!activeRoom &&
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
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
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
        {activeRoom &&
          roomMembers.length > 0 &&
          roomMembers.map((user) => (
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
                {authUser._id === hostId && (
                  <span className=" border-gray-500 border text-green-500 text-xs font-semibold h-5 w-8 flex items-center justify-center rounded-xl">
                    Host
                  </span>
                )}{" "}
              </div>
            </button>
          ))}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
