import { Message } from "../models/Message.model.js";
import { User } from "../models/User.model.js";
import cloudinary from "./../lib/cloudinary.js";

const getSidebarUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: currentUserId },
    }).select("-password");

    return res
      .status(200)
      .json({ message: "users feteched successfully.", users: filteredUser });
  } catch (error) {
    console.error("Error : " + error.message);
    return res.status(500).json({ message: "internal server error." });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const currentUserId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: currentUserId },
      ],
    });

    return res
      .status(200)
      .json({ message: "messages fetched successfully", messages });
  } catch {
    console.error("Error : " + error.message);
    return res.status(500).json({ message: "internal server error." });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text || !image) {
      return res.status(401).json({ message: "all fields cannot be empty." });
    }

    let imageUrl;
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }

    const newMessage = await Message({
      senderId,
      receiverId,
      text: text,
      image: imageUrl,
    });

    await newMessage.save();

    //future functionality

    return res
      .status(201)
      .json({ message: "messages send successfully", newMessage });
  } catch {
    console.error("Error : " + error.message);
    return res.status(500).json({ message: "internal server error." });
  }
};
export { getSidebarUsers, getMessages, sendMessage };
