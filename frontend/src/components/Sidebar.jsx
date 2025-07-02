import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Menu } from "lucide-react";
import useRoomStore from "../store/useRoomStore";
import toast from "react-hot-toast";
import { TbSwitch2 } from "react-icons/tb";
import Button from "./room/Button";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers, socket } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { setActiveRoom, checkRoom, currentRoom } = useRoomStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getUsers();
    checkRoom();
  }, [getUsers, checkRoom]);

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

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

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
              <Users className=" opacity-0 lg:opacity-100 size-6" />
              <span className="font-medium hidden lg:block">Contacts</span>
            </div>

            {currentRoom && <Button text={"Room"} event={setSelectedUser} />}
          </div>

          {/* Online toggle */}
          <div className="mt-5 flex items-center gap-2 text-xs lg:text-sm">
            <label className="cursor-pointer flex items-center gap-2 ">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span>Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">
              ({Math.max(0, onlineUsers.length - 1)} online)
            </span>
          </div>
        </div>

        {/* User List */}
        <div className="overflow-y-auto w-full py-3 flex-1">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                if (sidebarOpen) {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              {/* Info (visible on all devices) */}
              <div className="flex justify-between w-full items-center px-2 overflow-hidden">
                <div className="text-left min-w-0">
                  <div className="font-medium truncate">{user.fullName}</div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
            </button>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No users found</div>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
