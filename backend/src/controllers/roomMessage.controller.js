import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.model.js";
import Room from "../models/Room.model.js";
import User from "../models/user.model.js";

// Get all messages from a specific room
export const getMessages = async (req, res) => {
  try {
    const { id: roomId } = req.params;
    // console.log(roomId);
    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 })
      .populate({
        path: "senderId",
        select: "-password", // exclude password
      });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Send a message to a specific room
export const sendMessage = async (req, res) => {
  try {
    const { text, image, roomId } = req.body;
    const senderId = req.user._id;

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "/ChatApp/Messages",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      roomId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Optionally emit to socket
    // const receiverSocketId = getReceiverSocketId(receiverId);
    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("newMessage", newMessage);
    // }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
