const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

app.use(cors({
  origin: ['http://localhost:5173', 'https://livechatapp-socketio.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://livechatapp-socketio.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ Optional: Health check
app.get('/', (req, res) => {
  res.send('Live Chat App backend is running.');
});

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on('send-message', (message) => {
    console.log('📨 Message received:', message);
    io.emit('received-messages', message);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
