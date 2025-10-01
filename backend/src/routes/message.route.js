import express from "express";
import { protectRoutes } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controller/message.controller.js";

const router = express.Router();

router.get("/users", protectRoutes, getUsersForSidebar);
router.get("/:id", protectRoutes, getMessages);
router.put("/send/:id", protectRoutes, sendMessage);

export default router;
