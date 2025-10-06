require('module-alias/register');
const express = require('express');
const router = express.Router();
const { get_access_token } = require('@utils/auth');
const { get_users, get_user, updateUser, createUser, deleteUser, updateUserPassword, verifyUserEmail } = require('@utils/userManagement');

// ENV
const admin_keycloak_url = process.env.ADMIN_KEYCLOAK_URL;
const admin_keycloak_clientId = process.env.ADMIN_KEYCLOAK_CLIENT_ID;
const base_url = process.env.KEYCLOAK_ADMIN_API_BASE_URL;
const keycloak_admin_username = process.env.KEYCLOAK_ADMIN_USERNAME;
const keycloak_admin_password = process.env.KEYCLOAK_ADMIN_PASSWORD;

/**
 * GET /api/admin/users
 * Fetches details for all users.
 */
router.get('/users', async (req, res) => {
  try {
    console.log(`Fetching users.`);

    const token = await get_access_token(
      admin_keycloak_url,
      admin_keycloak_clientId,
      keycloak_admin_username,
      keycloak_admin_password
    );

    const users = await get_users(base_url, token);
    if (!users) return res.status(404).json({ message: `Could not fetch Users` });

    res.status(200).json(users);
  } catch (err) {
    console.error('Failed to get users:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Could not fetch users',
      error: err.response?.data || err.message || err
    });
  }
});

/**
 * GET /api/admin/users/:userName
 * Fetches details for a specific user.
 */ 
router.get('/users/:userName', async (req, res) => {
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
 * PUT /api/admin/updateUser
 * Updates an existing user
 */
router.put('/updateUser', async (req, res) => {
  try {
    const { username, firstName, lastName, email } = req.body;

    // Validate request body
    if (!username || !firstName || !lastName || !email) {
      return res.status(400).json({ message: 'User infor are required, (username, firstName, lastnName, email).' });
    }

    const token = await get_access_token(
      admin_keycloak_url,
      admin_keycloak_clientId,
      keycloak_admin_username,
      keycloak_admin_password
    );

    // Check if user exists
    const existingUser = await get_user(base_url, token, username);
    if (!existingUser) {
      return res.status(404).json({ message: `User "${username}" not found.` });
    }

    // Prepare user data for Keycloak
    const updatedUser = {
      id: existingUser.id,
      username,
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      enabled: true
    };

    // Call updateUser helper
    await updateUser(base_url, token, updatedUser);

    console.log(`User "${username}" successfully updated.`);
    res.status(200).json({
      message: `User "${username}" successfully updated.`
    });
  } catch (err) {
    console.error('Failed to update user:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Failed to update user',
      error: err.response?.data || err.message || err
    });
  }
});


/**
 * POST /api/admin/createUser
 * Creates a new User
 */
router.post('/createUser', async (req, res) => {
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
router.delete('/users/:userName', async (req, res) => {
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

/**
 * PUT /api/admin/users/:userName/reset-password
 * Updates an existing users password
 */
router.put('/users/:userName/reset-password', async (req, res) => {
  try {
    const { userName } = req.params;
    const { password } = req.body;

    // Validate request body
    if (!password) {
      return res.status(400).json({ message: 'New password is required.' });
    }

    const token = await get_access_token(
      admin_keycloak_url,
      admin_keycloak_clientId,
      keycloak_admin_username,
      keycloak_admin_password
    );

    // Check if user exists
    const existingUser = await get_user(base_url, token, userName);
    if (!existingUser) {
      return res.status(404).json({ message: `User "${userName}" not found.` });
    }

    // Call updateUserPassword helper
    await updateUserPassword(base_url, token, existingUser, password );

    console.log(`User "${userName}"s password successfully updated.`);
    res.status(200).json({
      message: `User "${userName}"s password successfully updated.`
    });
  } catch (err) {
    console.error('Failed to update user password:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Failed to update user password',
      error: err.response?.data || err.message || err
    });
  }
});

/**
 * PUT /api/admin/users/:userName/verify-email
 * Verifies the email of an existing user.
 */
router.put('/users/:userName/verify-email', async (req, res) => {
  try {
    const { userName } = req.params;

    const token = await get_access_token(
      admin_keycloak_url,
      admin_keycloak_clientId,
      keycloak_admin_username,
      keycloak_admin_password
    );

    const existingUser = await get_user(base_url, token, userName);
    if (!existingUser) {
      return res.status(404).json({ message: `User "${userName}" not found.` });
    }

    await verifyUserEmail(base_url, token, existingUser);

    console.log(`User "${userName}"'s email verified successfully.`);
    res.status(200).json({
      message: `User "${userName}"'s email verified successfully.`
    });
  } catch (err) {
    console.error('Failed to verify user email:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Failed to verify user email',
      error: err.response?.data || err.message || err
    });
  }
});



module.exports = router;