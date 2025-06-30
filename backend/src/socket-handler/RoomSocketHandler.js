import Room from "../models/Room.model.js";

export const RoomSocketHandler = (socket, io) => {
  socket.on("join-room", async ({ roomId }) => {
    try {
      const room = await Room.findOne({ roomId }).populate({
        path: "members",
        select: "-password",
      });

      if (!room) return socket.emit("room-error", "Room not found");

      socket.join(roomId); // Socket joins room

      // ✅ Send latest members to all in the room
      io.to(roomId).emit("room-members", room.members);
    } catch (error) {
      console.error("Join-room error:", error);
      socket.emit("room-error", "Something went wrong.");
    }
  });

  socket.on("leave-room", async ({ roomId }) => {
    try {
      const room = await Room.findOne({ roomId }).populate({
        path: "members",
        select: "-password",
      });

      if (room) {
        io.to(roomId).emit("room-members", room.members);
      }
    } catch (error) {
      console.error("Leave-room error:", error);
    }
  });
};
