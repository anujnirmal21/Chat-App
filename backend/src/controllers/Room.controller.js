import Room from "../models/Room.model.js";
import { v4 as uuidv4 } from "uuid";

const createRoom = async (req, res) => {
  try {
    const { id: userId } = req.params;
    if (!userId) return res.status(400).json({ message: "userId not found" });

    const roomIdExist = await Room.findOne({ hostId: userId });
    // console.log(roomIdExist);
    if (roomIdExist) {
      return res
        .status(200)
        .json({ message: "User has already active room ", room: roomIdExist });
    }

    const roomId = uuidv4().slice(0, 6).toUpperCase();
    const newRoom = new Room({
      roomId,
      hostId: userId,
      members: [userId],
    });

    if (newRoom) {
      await newRoom.save();
      return res
        .status(200)
        .json({ message: "Room created successfully..", room: newRoom });
    } else {
      res.status(400).json({ message: "Failed to create room" });
    }
  } catch (error) {
    console.log("Error : " + error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { roomId } = req.body;

    if (!userId) return res.status(400).json({ message: "userId not found" });
    if (!roomId) return res.status(400).json({ message: "room id not found" });

    // Find the room
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Avoid duplicate members
    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }

    return res
      .status(200)
      .json({ message: "User added to room successfully", room });
  } catch (error) {
    console.log("Error : " + error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const closeRoom = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { roomId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId not found" });
    }

    // Find the room where this user is host
    const room = await Room.findOne({ hostId: userId, roomId });

    if (!room) {
      return res
        .status(403)
        .json({ message: "User is not authorized to perform this action" });
    }

    // Delete the room
    await room.deleteOne(); // No need to pass filter, it's already a doc

    return res.status(200).json({ message: "Room closed successfully." });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
const checkRoom = async (req, res) => {
  try {
    const { id: userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId not found" });
    }

    // Populate members with full user info (excluding password)
    const room = await Room.findOne({ hostId: userId }).populate({
      path: "members",
      select: "-password",
    });

    if (!room) {
      return res.status(200).json({
        message: "User does not have any active rooms.",
        room: null,
      });
    }

    return res.status(200).json({
      message: "Room fetched successfully.",
      room,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export { createRoom, joinRoom, closeRoom, checkRoom };
