import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const protectRoutes = async (req, res, next) => {
  try {
    const token = await req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - no token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const user = await User.findById(decodedToken.userId).select("-password");

    req.user = user;
    next();
  } catch (error) {
    console.log(
      `An error occurred while performing the task: ${error.message}`
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
