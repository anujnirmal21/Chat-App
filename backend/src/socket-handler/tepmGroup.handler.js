import Message from "../models/Message.model.js";
import TempGroup from "../models/Room.model.js";
import { v4 as uuidv4 } from "uuid";

const tempGroupHandler = async (Socket, io) => {
  //create temp group
  Socket.on("create-group", async (userId) => {
    const groupId = uuidv4().slice(0, 6).toUpperCase();
    try {
      const tempGroup = await TempGroup.create({
        hostId: userId,
        groupId,
        member: [userId],
      });
    } catch (error) {}
  });
};
