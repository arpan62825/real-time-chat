import User from "../models/user.model.js";
import Message from "../models/messages.model.js";
import pkg from "cloudinary";
const { cloudinary } = pkg;

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUser = await req.user._id;
    const findUsers = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );
    res.send(findUsers);
  } catch (error) {
    console.log(
      `An error occurred while performing the task: ${error.message}`
    );
    res.status(500).json({ message: "Internal Server error." });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.param;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Status error while fetching the messages." });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.param;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResource = await cloudinary.uploader.upload(image);
      imageUrl = uploadResource.secure_url;
    }

    const newMessage = new Message({
      receiverId,
      senderId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // todo: create real time feature-> using socket.io

    res.status(200).json({ message: newMessage });
  } catch (error) {
    console.error("An error occurred: " + error.message);
    res
      .status(500)
      .json({ message: "An error occurred while doing the stuff." });
  }
};
