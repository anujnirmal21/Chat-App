import { Router } from "express";
import { protectRoute } from "./../middleware/auth.middleware.js";
import {
  getMessages,
  sendMessage,
} from "../controllers/roomMessage.controller.js";

const roomMessageRoutes = Router();

roomMessageRoutes.get("/get/:id", protectRoute, getMessages);
roomMessageRoutes.post("/send", protectRoute, sendMessage);

export default roomMessageRoutes;
