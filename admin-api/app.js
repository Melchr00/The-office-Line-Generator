/**
 * Express server for Admin API (PORT=4002)
 * Provides endpoints for Keycloak user and role management.
 * CORS is enabled for frontend access.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { get_access_token } = require('./utils/auth');
const { get_user, createUser, deleteUser } = require('./utils/userManagement');
const { get_role, appendRole_to_User, removeRole_from_User } = require('./utils/subscriptionManagement');

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
 * Retrieve a specific role by name from Keycloak.
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

    const user = await get_user(base_url, token, userName);
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

    const user = await get_user(base_url, token, userName);
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

    const user = await get_user(base_url, token, userName);
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
 * Creates a new User
 */
app.post('/api/admin/createUser', async (req, res) => {
  try {
    const { username, firstName, lastName, email, password } = req.body;

    // Validate request body
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const token = await get_access_token(
      admin_keycloak_url,
      admin_keycloak_clientId,
      keycloak_admin_username,
      keycloak_admin_password
    );

    // Check if user already exists
    const existingUser = await get_user(base_url, token, username);
    if (existingUser) {
      return res.status(409).json({ message: `User "${username}" already exists.` });
    }

    // Prepare user data for Keycloak
    const newUser = {
      username,
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      enabled: true,
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false
        }
      ]
    };

    // Call createUser helper
    await createUser(base_url, token, newUser);

    console.log(`User "${username}" successfully created.`);
    res.status(201).json({
      message: `User "${username}" successfully created.`
    });
  } catch (err) {
    console.error('Failed to create user:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Failed to create user',
      error: err.response?.data || err.message || err
    });
  }
});




/**
 * DELETE /api/admin/users/:userName/roles/:roleName
 * Deletes a user
 */
app.delete('/api/admin/users/:userName', async (req, res) => {
  try {
    const { userName} = req.params;
    console.log(`Removing user "${userName}" from Keycloak"`);

    const token = await get_access_token(
      admin_keycloak_url,
      admin_keycloak_clientId,
      keycloak_admin_username,
      keycloak_admin_password
    );

    const user = await get_user(base_url, token, userName);
    if (!user) return res.status(404).json({ message: `User "${userName}" not found` });

    await deleteUser(base_url, token, user);

    console.log(`User "${userName}" successfully deleted.`);
    res.status(200).json({
      message: `User "${userName}" successfully deleted.`
    });
  } catch (err) {
    console.error('Failed to delete user:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Failed to delete user',
      error: err.response?.data || err.message || err
    });
  }
});

// -----------------------------------------------------------------------------
// Server Startup
// -----------------------------------------------------------------------------
const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Admin API microservice running on port ${PORT}`);
});
