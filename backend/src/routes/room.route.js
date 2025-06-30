import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createRoom,
  joinRoom,
  closeRoom,
  checkRoom,
  leaveRoom,
} from "../controllers/Room.controller.js";

const roomRoutes = Router();

roomRoutes.get("/create/:id", protectRoute, createRoom);
roomRoutes.post("/join", protectRoute, joinRoom);
roomRoutes.post("/close", protectRoute, closeRoom);
roomRoutes.put("/leave", protectRoute, leaveRoom);
roomRoutes.get("/check/:id", protectRoute, checkRoom);

export default roomRoutes;
