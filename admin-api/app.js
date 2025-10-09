/**
 * Express server for Admin API (PORT=4002)
 * CORS is enabled for frontend access.
 */
require('module-alias/register');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); 
const { WebSocketServer } = require('ws');


// Initialization & Middleware
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


// Import routes
const userRoutes = require('@routes/users')(broadcastUserUpdate);
const roleRoutes = require('@routes/roles')(broadcastUserUpdate);
const authRoutes = require('@routes/auth');

// Mount routes
app.use('/api/admin', userRoutes);
app.use('/api/admin', roleRoutes);
app.use('/api/admin', authRoutes);


/**
 * GET /health
 * Simple health check endpoint.
 */
app.get('/health', (req, res) => {
  res.send('OK');
});

// WebSocket setup
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  console.log('WebSocket client connected');
  socket.on('close', () => console.log('WebSocket client disconnected'));
});

// Broadcast helper
function broadcastUserUpdate(username) {
  const message = JSON.stringify({ type: 'userUpdate', username });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}



// Server Startup
const PORT = 4002;
server.listen(PORT, () => {
  console.log(`Admin API + WS running on port ${PORT}`);
});
