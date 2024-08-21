import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];

const findUserIndexById = (userId) =>
  onlineUsers.findIndex((user) => user.userId === userId);

io.on("connection", (socket) => {
  // Add user when they come online
  socket.on("addUserIsOnline", (userId) => {
    if (!userId) return;

    const userIndex = findUserIndexById(userId);

    // Remove old socket if user reconnects
    if (userIndex !== -1) {
      onlineUsers.splice(userIndex, 1);
    }

    // Add the new user with socketId
    onlineUsers.push({ userId, socketId: socket.id });
    io.emit("getOnlineUsers", onlineUsers);
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

// Get the socket ID of a user by their userId
export const getUserSocketId = (userId) => {
  const user = onlineUsers.find((user) => user.userId === userId);
  return user ? user.socketId : null;
};

export { app, io, server };
