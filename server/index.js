const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://livechatapp-socketio.vercel.app'
];

// ✅ Express CORS for REST requests
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Socket.IO CORS config
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ Basic health check
app.get('/', (req, res) => {
  res.send('Socket.IO server is up.');
});

// ✅ Socket.IO events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('send-message', (data) => {
    io.emit('received-messages', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
