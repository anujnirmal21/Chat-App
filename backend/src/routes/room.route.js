import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createRoom,
  joinRoom,
  closeRoom,
} from "../controllers/Room.controller.js";

const roomRoutes = Router();

roomRoutes.get("/create/:id", protectRoute, createRoom);
roomRoutes.post("/join/:id", protectRoute, joinRoom);
roomRoutes.get("/close/:id", protectRoute, closeRoom);

export default roomRoutes;
