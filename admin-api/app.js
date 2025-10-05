/***Express server for admin-API (PORT=4002), Cors enabled so frontend have easy access.  ***/
const express = require('express');
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors())

const dotenv = require('dotenv');
dotenv.config();

const { get_role, get_access_token, get_users, appendRole_to_User, removeRole_from_User } = require('./utils/auth');

//Environment variable declerations
// Environment variable declarations
const admin_keycloak_url = process.env.ADMIN_KEYCLOAK_URL;
const admin_keycloak_clientId = process.env.ADMIN_KEYCLOAK_CLIENT_ID;
const keycloak_admin_api_base_url = process.env.KEYCLOAK_ADMIN_API_BASE_URL;
const keycloak_admin_username = process.env.KEYCLOAK_ADMIN_USERNAME;
const keycloak_admin_password = process.env.KEYCLOAK_ADMIN_PASSWORD;

app.get('/api/admin/accessToken', async(req, res)=> {
  try {
    const token = await get_access_token(admin_keycloak_url,admin_keycloak_clientId,keycloak_admin_username, keycloak_admin_password)
    console.log('Access token: ', token);
    res.status(200).json({ access_token: token });
  } catch(err) {
    console.error("Failed to get token");
     res.status(500).json({
      message: 'Could not fetch access token',
      error: err.response?.data || err.message || err
    });
  }
})

app.get('/api/admin/roles/:roleName', async (req, res) => {
  try {
    // Extract the role name from the route parameter
    const roleName = req.params.roleName;
    console.log(`Fetching role: ${roleName}`);

    // Get admin access token
    const token = await get_access_token(
      admin_keycloak_url,
      admin_keycloak_clientId,
      keycloak_admin_username,
      keycloak_admin_password
    );

    // Build the URL to query roles
    const url = `${keycloak_admin_api_base_url}/roles`;

    // Call your get_role helper function
    const role = await get_role(url, token, roleName);

    if (!role) {
      return res.status(404).json({ message: `Role "${roleName}" not found` });
    }

    res.status(200).json(role);
  } catch (err) {
    console.error("Failed to get role:", err.response?.data || err.message || err);
    res.status(500).json({
      message: 'Could not fetch role',
      error: err.response?.data || err.message || err
    });
  }
});

app.get('/api/admin/users/:userName', async(req, res)=> {
  try {
    // Extract the userName from the user parameter
    const userName = req.params.userName;
    console.log(`Fetching user: ${userName}`);

    const token = await get_access_token(admin_keycloak_url,admin_keycloak_clientId,keycloak_admin_username, keycloak_admin_password)
    console.log('Access token: ', token);
    url = keycloak_admin_api_base_url + "/users"
    // Call your get_role helper function
    const user = await get_users(url, token, userName);

    if (!user) {
      return res.status(404).json({ message: `User "${userName}" not found` });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Failed to get user:", err.response?.data || err.message || err);
    res.status(500).json({
      message: 'Could not fetch user',
      error: err.response?.data || err.message || err
    });
  }
});

app.post('/api/admin/users/:userName/roles/:roleName', async (req, res) => {
  try {
    const { userName, roleName } = req.params;
    console.log(`Assigning role "${roleName}" to user "${userName}"`);

    // Get admin access token
    const token = await get_access_token(admin_keycloak_url, admin_keycloak_clientId, keycloak_admin_username, keycloak_admin_password );

    // Fetch the user object by username
    const userUrl = `${keycloak_admin_api_base_url}/users`;
    const user = await get_users(userUrl, token, userName);
    if (!user) {
      return res.status(404).json({ message: `User "${userName}" not found` });
    }

    // Fetch the role object by name
    const rolesUrl = `${keycloak_admin_api_base_url}/roles`;
    const role = await get_role(rolesUrl, token, roleName);
    if (!role) {
      return res.status(404).json({ message: `Role "${roleName}" not found` });
    }

    // Assign the role to the user
    await appendRole_to_User(keycloak_admin_api_base_url, token, user.id, role);

    console.log(`Role "${roleName}" assigned to user "${userName}".`);
    res.status(200).json({
      message: `Role "${roleName}" successfully assigned to user "${userName}".`
    });

  } catch (err) {
    console.error('Failed to assign role:', err.response?.data || err.message || err);
    res.status(500).json({
      message: 'Failed to assign role to user',
      error: err.response?.data || err.message || err
    });
  }
});

app.delete('/api/admin/users/:userName/roles/:roleName', async (req, res) => {
  try {
    const { userName, roleName } = req.params;
    console.log(`Removing role "${roleName}" from user "${userName}"`);

    // Get admin access token
    const token = await get_access_token(admin_keycloak_url, admin_keycloak_clientId, keycloak_admin_username, keycloak_admin_password );

    // Fetch the user object by username
    const userUrl = `${keycloak_admin_api_base_url}/users`;
    const user = await get_users(userUrl, token, userName);
    if (!user) {
      return res.status(404).json({ message: `User "${userName}" not found` });
    }

    // Fetch the role object by name
    const rolesUrl = `${keycloak_admin_api_base_url}/roles`;
    const role = await get_role(rolesUrl, token, roleName);
    if (!role) {
      return res.status(404).json({ message: `Role "${roleName}" not found` });
    }

    // Remove the role from the user
    await removeRole_from_User(keycloak_admin_api_base_url, token, user.id, role);

    console.log(`Role "${roleName}" removed from user "${userName}".`);
    res.status(200).json({
      message: `Role "${roleName}" successfully removed from user "${userName}".`
    });

  } catch (err) {
    console.error('Failed to remove role:', err.response?.data || err.message || err);
    res.status(500).json({
      message: 'Failed to remove role from user',
      error: err.response?.data || err.message || err
    });
  }
});



/**
 * Health check endpoint.
 * Used to verify the service is running without errors.
 */
app.get('/health', (req, res) => {
  res.send('OK');
})

app.post('/api/admin/createUser', (req, res) => {


  res.json({
    message: 'Environment variables printed to server console!',
  });
});





/**
 * Start the microservice API on port 4002.
 */
const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Microservice running on port ${PORT}`);
});
