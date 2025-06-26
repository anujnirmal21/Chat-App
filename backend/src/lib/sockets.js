import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const socketServer = new Server(server, {
  cors: ["http://localhost:5173/"],
});

const userSocketMap = {};

const getUserSocketId = (userId) => userSocketMap[userId];

socketServer.on("connection", (socket) => {
  console.log("User Connected " + socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  socketServer.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected " + socket.id);
    delete userSocketMap[userId];
    socketServer.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, socketServer, server, getUserSocketId };
