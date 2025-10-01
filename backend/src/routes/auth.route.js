import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controller/auth.controller.js";
import { protectRoutes } from "../middleware/auth.middleware.js";

const route = express.Router();

route.post("/signup", signup);

route.post("/login", login);

route.post("/logout", logout);

route.put("/update-profile", protectRoutes, updateProfile);

route.get("/check", protectRoutes, checkAuth);

export default route;
