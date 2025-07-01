import Room from "../models/Room.model.js";

export const RoomSocketHandler = (socket, io) => {
  socket.on("join-room", async ({ roomId }) => {
    try {
      const room = await Room.findOne({ roomId }).populate(
        "members",
        "-password"
      );
      if (!room) return socket.emit("room-error", "Room not found");

      socket.join(roomId);

      io.to(roomId).emit("room-members", room.members);
    } catch (error) {
      console.error("Join-room error:", error);
      socket.emit("room-error", "Something went wrong.");
    }
  });

  // Real-time message sending
  socket.on("send-room-message", async ({ roomId, text, image, senderId }) => {
    try {
      const newMessage = {
        roomId,
        senderId,
        text,
        image,
      };

      io.emit("room-message", newMessage);
    } catch (error) {
      console.error("send-room-message error:", error.message);
      socket.emit("room-error", "Message send failed");
    }
  });

  socket.on("leave-room", async ({ roomId }) => {
    try {
      const room = await Room.findOne({ roomId }).populate(
        "members",
        "-password"
      );
      if (room) {
        io.to(roomId).emit("room-members", room.members);
      }
    } catch (error) {
      console.error("Leave-room error:", error);
    }
  });
};
