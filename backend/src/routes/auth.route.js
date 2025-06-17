import { Router } from "express";
import {
  userLogin,
  userLogout,
  userSignup,
  checkAuth,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/signup", userSignup);
authRoutes.post("/login", userLogin);
authRoutes.post("/logout", userLogout);
authRoutes.put("/update-profile", protectRoute, updateProfile);
authRoutes.get("/check", protectRoute, checkAuth);
export default authRoutes;
