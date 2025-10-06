/**
 * Express server for Admin API (PORT=4002)
 * Provides endpoints for Keycloak user and role management.
 * CORS is enabled for frontend access.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const {
  get_role,
  get_access_token,
  get_users,
  appendRole_to_User,
  removeRole_from_User
} = require('./utils/auth');

// -----------------------------------------------------------------------------
// Initialization & Middleware
// -----------------------------------------------------------------------------
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// -----------------------------------------------------------------------------
// Environment Variables
// -----------------------------------------------------------------------------
const admin_keycloak_url = process.env.ADMIN_KEYCLOAK_URL;
const admin_keycloak_clientId = process.env.ADMIN_KEYCLOAK_CLIENT_ID;
const base_url = process.env.KEYCLOAK_ADMIN_API_BASE_URL;
const keycloak_admin_username = process.env.KEYCLOAK_ADMIN_USERNAME;
const keycloak_admin_password = process.env.KEYCLOAK_ADMIN_PASSWORD;

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

/**
 * GET /api/admin/accessToken
 * Retrieves an admin access token from Keycloak.
 */
app.get('/api/admin/accessToken', async (req, res) => {
  try {
    const token = await get_access_token(
      admin_keycloak_url,
      admin_keycloak_clientId,
      keycloak_admin_username,
      keycloak_admin_password
    );

    console.log('Access token retrieved successfully.');
    res.status(200).json({ access_token: token });
  } catch (err) {
    console.error('Failed to get access token:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Could not fetch access token',
      error: err.response?.data || err.message || err
    });
  }
});

/**
 * GET /api/admin/roles/:roleName
 * Fetches details for a specific role.
 */
app.get('/api/admin/roles/:roleName', async (req, res) => {
  try {
    const { roleName } = req.params;
    console.log(`Fetching role: ${roleName}`);

    const token = await get_access_token(
      admin_keycloak_url,
      admin_keycloak_clientId,
      keycloak_admin_username,
      keycloak_admin_password
    );

    const role = await get_role(base_url, token, roleName);
    if (!role) return res.status(404).json({ message: `Role "${roleName}" not found` });

    res.status(200).json(role);
  } catch (err) {
    console.error('Failed to get role:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Could not fetch role',
      error: err.response?.data || err.message || err
    });
  }
});

/**
 * GET /api/admin/users/:userName
 * Fetches details for a specific user.
 */
app.get('/api/admin/users/:userName', async (req, res) => {
  try {
    const { userName } = req.params;
    console.log(`Fetching user: ${userName}`);

    const token = await get_access_token(
      admin_keycloak_url,
      admin_keycloak_clientId,
      keycloak_admin_username,
      keycloak_admin_password
    );

    const user = await get_users(base_url, token, userName);
    if (!user) return res.status(404).json({ message: `User "${userName}" not found` });

    res.status(200).json(user);
  } catch (err) {
    console.error('Failed to get user:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Could not fetch user',
      error: err.response?.data || err.message || err
    });
  }
});

/**
 * POST /api/admin/users/:userName/roles/:roleName
 * Assigns a role to a user.
 */
app.post('/api/admin/users/:userName/roles/:roleName', async (req, res) => {
  try {
    const { userName, roleName } = req.params;
    console.log(`Assigning role "${roleName}" to user "${userName}"`);

    const token = await get_access_token(
      admin_keycloak_url,
      admin_keycloak_clientId,
      keycloak_admin_username,
      keycloak_admin_password
    );

    const user = await get_users(base_url, token, userName);
    if (!user) return res.status(404).json({ message: `User "${userName}" not found` });

    const role = await get_role(base_url, token, roleName);
    if (!role) return res.status(404).json({ message: `Role "${roleName}" not found` });

    await appendRole_to_User(base_url, token, user.id, role);

    console.log(`Role "${roleName}" successfully assigned to "${userName}".`);
    res.status(200).json({
      message: `Role "${roleName}" successfully assigned to user "${userName}".`
    });
  } catch (err) {
    console.error('Failed to assign role:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Failed to assign role to user',
      error: err.response?.data || err.message || err
    });
  }
});

/**
 * DELETE /api/admin/users/:userName/roles/:roleName
 * Removes a role from a user.
 */
app.delete('/api/admin/users/:userName/roles/:roleName', async (req, res) => {
  try {
    const { userName, roleName } = req.params;
    console.log(`Removing role "${roleName}" from user "${userName}"`);

    const token = await get_access_token(
      admin_keycloak_url,
      admin_keycloak_clientId,
      keycloak_admin_username,
      keycloak_admin_password
    );

    const user = await get_users(base_url, token, userName);
    if (!user) return res.status(404).json({ message: `User "${userName}" not found` });

    const role = await get_role(base_url, token, roleName);
    if (!role) return res.status(404).json({ message: `Role "${roleName}" not found` });

    await removeRole_from_User(base_url, token, user.id, role);

    console.log(`Role "${roleName}" successfully removed from "${userName}".`);
    res.status(200).json({
      message: `Role "${roleName}" successfully removed from user "${userName}".`
    });
  } catch (err) {
    console.error('Failed to remove role:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Failed to remove role from user',
      error: err.response?.data || err.message || err
    });
  }
});

/**
 * GET /health
 * Simple health check endpoint.
 */
app.get('/health', (req, res) => {
  res.send('OK');
});

/**
 * POST /api/admin/createUser
 * Placeholder endpoint for user creation.
 */
app.post('/api/admin/createUser', (req, res) => {
  res.json({
    message: 'Environment variables printed to server console!',
  });
});

// -----------------------------------------------------------------------------
// Server Startup
// -----------------------------------------------------------------------------
const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Admin API microservice running on port ${PORT}`);
});
