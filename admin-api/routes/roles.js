require('module-alias/register');
const express = require('express');
const router = express.Router();
const { get_access_token } = require('@utils/auth');
const { get_user } = require('@utils/userManagement');
const { get_roles, get_role, get_userRoles, appendRole_to_User, removeRole_from_User } = require('@utils/subscriptionManagement');

//ENV
const admin_keycloak_url = process.env.ADMIN_KEYCLOAK_URL;
const admin_keycloak_clientId = process.env.ADMIN_KEYCLOAK_CLIENT_ID;
const base_url = process.env.KEYCLOAK_ADMIN_API_BASE_URL;
const keycloak_admin_username = process.env.KEYCLOAK_ADMIN_USERNAME;
const keycloak_admin_password = process.env.KEYCLOAK_ADMIN_PASSWORD;

/**
 * Get /api/admin/roles
 * Retrieves all roles from Keycloak.
 */
router.get('/roles', async (req, res) => {
  try {
    console.log(`Fetching roles`);

    const token = await get_access_token(
      admin_keycloak_url,
      admin_keycloak_clientId,
      keycloak_admin_username,
      keycloak_admin_password
    );

    const roles = await get_roles(base_url, token);
    if (!roles) return res.status(404).json({ message: `Roles not found` });

    res.status(200).json(roles);
  } catch (err) {
    console.error('Failed to get roles:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Could not fetch roles',
      error: err.response?.data || err.message || err
    });
  }
});

/**
 * GET /api/admin/roles/:roleName
 * Retrieve a specific role by name from Keycloak.
 */
router.get('/roles/:roleName', async (req, res) => {
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
 * GET /api/admin/users/:userName/roles
 * Retrieve a specific users' roles from Keycloak.
 */
router.get('/users/:userName/roles', async (req, res) => {
  try {
    const { userName } = req.params;
    console.log(`Fetching roles for user "${userName}"`);

    const token = await get_access_token(
      admin_keycloak_url,
      admin_keycloak_clientId,
      keycloak_admin_username,
      keycloak_admin_password
    );

    // Get user object
    const user = await get_user(base_url, token, userName);
    if (!user) {
      return res.status(404).json({ message: `User "${userName}" not found.` });
    }

    // Get roles for this user
    const roles = await get_userRoles(base_url, token, user);

    res.status(200).json({
      user: user.username,
      roles
    });
  } catch (err) {
    console.error('Failed to get user roles:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Failed to get user roles',
      error: err.response?.data || err.message || err
    });
  }
});



/**
 * POST /api/admin/users/:userName/roles/:roleName
 * Assigns a role to a user.
 */
router.post('/users/:userName/roles/:roleName', async (req, res) => {
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
router.delete('/users/:userName/roles/:roleName', async (req, res) => {
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

module.exports = router;