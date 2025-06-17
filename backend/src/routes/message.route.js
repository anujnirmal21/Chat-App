import { Router } from "express";
import { protectRoute } from "./../middleware/auth.middleware.js";
import {
  getMessages,
  getSidebarUsers,
  sendMessage,
} from "../controllers/message.controller.js";

const messageRoutes = Router();

messageRoutes.get("/users", protectRoute, getSidebarUsers);
messageRoutes.get("/:id", protectRoute, getMessages);
messageRoutes.post("/send/:id", protectRoute, sendMessage);
export default messageRoutes;
