/**
 * Utility functions for interacting with Keycloak Admin REST API.
 * Includes role and user management helpers.
 */

const axios = require('axios');
const qs = require('qs'); // For x-www-form-urlencoded requests


/**
 * Retrieve a specific role by name from Keycloak.
 */
async function get_role(base_url, access_token, roleName) {
  const headers = { Authorization: `Bearer ${access_token}` };

  try {
    const URL = `${base_url}/roles`;
    const response = await axios.get(URL, { headers });

    // Find the role by name
    const role = response.data.find((r) => r.name === roleName);

    if (role) {
      console.log(`Found role: ${role.name}`);
      return role;
    } else {
      console.warn(`Role "${roleName}" not found.`);
      return null;
    }
  } catch (error) {
    console.error('Error getting roles:', error.response?.data || error.message);
    throw error;
  }
}


/**
 * Retrieve a specific user by username from Keycloak.
 */
async function get_users(base_url, access_token, userName) {
  const headers = { Authorization: `Bearer ${access_token}` };

  try {
    const URL = `${base_url}/users`;
    const response = await axios.get(URL, { headers });

    // Find the user by username
    const user = response.data.find((u) => u.username === userName);

    if (user) {
      console.log(`Found user: ${user.username}`);
      return user;
    } else {
      console.warn(`User "${userName}" not found.`);
      return null;
    }
  } catch (error) {
    console.error('Error getting users:', error.response?.data || error.message);
    throw error;
  }
}


/**
 * Assign a realm-level role to a user in Keycloak.
 */
async function appendRole_to_User(base_url, access_token, userId, roleObj) {
  const headers = { Authorization: `Bearer ${access_token}` };
  const URL = `${base_url}/users/${userId}/role-mappings/realm`;

  // Keycloak expects an array of roles
  const payload = [{ id: roleObj.id, name: roleObj.name }];

  try {
    console.log(`Assigning role "${roleObj.name}" to user ID: ${userId}`);
    await axios.post(URL, payload, { headers });
    console.log(`Role "${roleObj.name}" assigned successfully.`);
    return { success: true };
  } catch (error) {
    console.error('Error assigning role:', error.response?.data || error.message);
    throw error;
  }
}


/**
 * Remove a realm-level role from a user in Keycloak.
 */
async function removeRole_from_User(base_url, access_token, userId, roleObj) {
  const headers = { Authorization: `Bearer ${access_token}` };
  const URL = `${base_url}/users/${userId}/role-mappings/realm`;

  // Keycloak expects an array of roles
  const payload = [{ id: roleObj.id, name: roleObj.name }];

  try {
    console.log(`Removing role "${roleObj.name}" from user ID: ${userId}`);
    await axios.delete(URL, { headers, data: payload });
    console.log(`Role "${roleObj.name}" removed successfully.`);
    return { success: true };
  } catch (error) {
    console.error('Error removing role:', error.response?.data || error.message);
    throw error;
  }
}


/**
 * Obtain an admin access token using the password grant.
 */
async function get_access_token(token_url, client_id, username, password) {
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

  const payload = qs.stringify({
    client_id,
    username,
    password,
    grant_type: 'password',
  });

  try {
    console.log('Requesting Keycloak access token...');
    const response = await axios.post(token_url, payload, { headers });
    console.log('Access token retrieved successfully.');
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
  }
}


// Export all utility functions
module.exports = {
  get_role,
  get_access_token,
  get_users,
  appendRole_to_User,
  removeRole_from_User,
};
