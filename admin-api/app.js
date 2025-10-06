/**
 * Express server for Admin API (PORT=4002)
 * CORS is enabled for frontend access.
 */
require('module-alias/register');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Initialization & Middleware
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


// Import routes
const userRoutes = require('@routes/users');
const roleRoutes = require('@routes/roles');
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


// Server Startup
const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Admin API microservice running on port ${PORT}`);
});
