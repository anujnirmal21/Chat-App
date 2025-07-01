import React, { useState, useEffect } from "react";
import { MdGroupAdd } from "react-icons/md";
import { FaPlus, FaSignInAlt, FaRegCopy } from "react-icons/fa";
import useRoomStore from "../../store/useRoomStore";
import toast from "react-hot-toast";

const Modal = () => {
  const [mode, setMode] = useState("create");
  const [roomId, setRoomId] = useState("");

  const { setCreateRoom, currentRoom, setJoinRoom } = useRoomStore();

  const handleCreateRoom = async () => {
    await setCreateRoom();
  };

  const handleJoinRoom = async () => {
    await setJoinRoom(roomId);
  };

  const handleCopy = () => {
    if (currentRoom?.roomId) {
      navigator.clipboard.writeText(currentRoom.roomId);
      toast.success("Room ID copied to clipboard");
    }
  };

  const handleModalClose = () => {
    setMode("create");
    setRoomId("");
  };

  useEffect(() => {
    const modal = document.getElementById("room_modal");
    if (modal) {
      modal.addEventListener("close", handleModalClose);
    }
    return () => {
      if (modal) {
        modal.removeEventListener("close", handleModalClose);
      }
    };
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <button
        className="btn btn-sm flex items-center gap-2"
        onClick={() => document.getElementById("room_modal").showModal()}
      >
        <MdGroupAdd size={20} />
        <span className="hidden sm:inline">Create Room</span>
      </button>

      {/* Modal */}
      <dialog id="room_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="text-xl font-bold mb-6 text-center">
            {currentRoom
              ? "You are in active room!"
              : mode === "create"
              ? "Create a New Room"
              : "Join a Room"}
          </h3>

          {/* === Created Room === */}
          {currentRoom ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-600">Share this Room ID with others:</p>
              <div className=" flex gap-3 justify-center items-center">
                <div className="flex items-center gap-2 border border-gray-400 px-4 py-2 rounded-md h-[40px]">
                  <span className="font-mono text-2xl font-bold text-gray-200">
                    {currentRoom.roomId}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="btn btn-sm btn-outline tooltip h-full"
                  data-tip="Copy Room ID"
                >
                  <FaRegCopy className=" h-[40px] w-[15px]" />
                </button>
              </div>
              <form method="dialog" className="w-full">
                <button className="btn btn-outline w-full mt-4">Close</button>
              </form>
            </div>
          ) : mode === "create" ? (
            // === Create Room UI ===
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleCreateRoom}
                className="btn btn-primary w-2/3 flex items-center gap-2"
              >
                <FaPlus /> Create Room
              </button>
              <p className="text-sm text-gray-500">
                Or{" "}
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => setMode("join")}
                >
                  join an existing room
                </button>
              </p>
            </div>
          ) : (
            // === Join Room UI ===
            <div className="flex flex-col items-center gap-4">
              <input
                type="text"
                placeholder="Enter Room ID"
                className="input input-bordered w-full"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button
                onClick={handleJoinRoom}
                className="btn btn-success w-full flex items-center gap-2"
              >
                <FaSignInAlt /> Join Room
              </button>
              <p className="text-sm text-gray-500">
                Or{" "}
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => setMode("create")}
                >
                  create a new room
                </button>
              </p>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

export default Modal;
