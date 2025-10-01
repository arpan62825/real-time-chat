import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../library/utils.js";
import cloudinary from "../library/cloudinary.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

// SIGNUP
export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "All the three fields are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "The password must be at least 6 characters long." });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "The user already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);
      res.status(200).json({ message: "User successfully registered" });
    } else {
      res.status(400).json({ message: "Invalid user credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both the credentials" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Your entered email or password is incorrect" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Your entered email or password is incorrect." });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.fullName,
      email: user.email,
    });
  } catch (error) {
    console.log(
      `An error occurred while performing the task: ${error.message}`
    );
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User successfully logged out" });
  } catch (error) {
    console.log(
      `An error occurred while performing the task: ${error.message}`
    );
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required." });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(
      `An error occurred while performing the task: ${error.message}`
    );
  }
};

// CHECK IF AUTHENTICATED
export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(200).json(null); // not logged in
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(200).json(null);
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Auth check failed:", error.message);
    res.status(200).json(null); // fail safe
  }
};
