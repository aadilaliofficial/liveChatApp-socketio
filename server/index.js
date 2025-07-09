const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://livechatapp-socketio.vercel.app'],
    methods: ['GET', 'POST'],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send-message", (message) => {
    console.log("Server received message:", message);
    io.emit("received-messages", message); // ✅ Fixed event name
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

server.listen(3000, () => console.log("Server running at port 3000"));
