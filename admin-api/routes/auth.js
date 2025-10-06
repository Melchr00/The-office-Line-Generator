require('module-alias/register');
const express = require('express');
const router = express.Router();
const { get_access_token } = require('@utils/auth');

//ENV
//ENV
const admin_keycloak_url = process.env.ADMIN_KEYCLOAK_URL;
const admin_keycloak_clientId = process.env.ADMIN_KEYCLOAK_CLIENT_ID;
const keycloak_admin_username = process.env.KEYCLOAK_ADMIN_USERNAME;
const keycloak_admin_password = process.env.KEYCLOAK_ADMIN_PASSWORD;

/**
 * GET /api/admin/accessToken
 * Retrieves an admin access token from Keycloak.
 */
router.get('/accessToken', async (req, res) => {
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

module.exports = router;