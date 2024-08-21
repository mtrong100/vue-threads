import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getUserSocketId } from "../socket/socket.js";

const getMessages = async (senderId, receiverId) => {
  const conversation = await Conversation.findOne({
    members: { $all: [senderId, receiverId] },
  }).populate({
    path: "messages",
    options: { sort: { createdAt: -1 } },
    populate: [
      {
        path: "sender",
        select: "_id username profilePicture",
      },
      {
        path: "receiver",
        select: "_id username profilePicture",
      },
    ],
  });

  return conversation.messages;
};

const sendMessage = async (senderId, receiverId, text) => {
  let conversation = await Conversation.findOne({
    members: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      members: [senderId, receiverId],
    });
  }

  const newMessage = await Message.create({
    sender: senderId,
    receiver: receiverId,
    text,
  });

  conversation.messages.push(newMessage._id);
  await conversation.save();

  const results = await Message.findById(newMessage._id).populate([
    {
      path: "sender",
      select: "_id username profilePicture",
    },
    {
      path: "receiver",
      select: "_id username profilePicture",
    },
  ]);

  // Get receiver's socket ID
  const receiverSocketId = getUserSocketId(receiverId);

  // Emit the message to client by socket
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", results);
  }

  return results;
};

export { sendMessage, getMessages };
