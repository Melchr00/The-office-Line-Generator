/**
 * Utility functions for interacting with Keycloak Admin REST API.
 * Includes user management helpers.
 */

const axios = require('axios'); 

// TODO
// Get all users (GET /api/admin/users)


/**
 * Retrieve a specific user by username from Keycloak.
 * (GET /api/admin/users/id/:userId)
 */
async function get_user(base_url, access_token, userName) {
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
// Update user info (GET /api/admin/users/:userName)


/**
 * Create a new user in Keycloak.
 * (POST api/admin/createUser)
 */
async function createUser(base_url, access_token, userObj) {
  const headers = { Authorization: `Bearer ${access_token}`,
'Content-Type': 'application/json' };
  const URL = `${base_url}/users`;

  // Create payload from userObj
  const payload = {
  username: userObj.username,
  enabled: true,
  firstName: userObj.firstName,
  lastName: userObj.lastName,
  email: userObj.email,
  emailVerified: true,
  credentials: [
    { type: "password", value: userObj.credentials[0].value, temporary: false }
  ]
};

  try {
    console.log('Payload for creating user:', payload);
    console.log(`Creating user: ${userObj.username}`);
    const response = await axios.post(URL, payload, { headers });
    console.log('Response:', response.status, response.data);
    
    // Keycloak returns 201 Created 
    if (response.status === 201) {
      console.log(`User "${userObj.username}" created successfully.`);
      return { success: true };
    } else {
      throw new Error(`Unexpected response: ${response.status}`);
    }
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Delete a user from Keycloak.
 * (DELETE api/admin/users/:userName)
 */
async function deleteUser(base_url, access_token, userObj) {
  const headers = {
    'Authorization': `Bearer ${access_token}`,
  };

  const URL = `${base_url}/users/${userObj.id}`;

  try {
    console.log(`Deleting user: ${userObj.username}`);
    await axios.delete(URL, { headers });
    console.log(`User ${userObj.username} deleted successfully.`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error.response?.data || error.message);
    throw error;
  }
}


// Reset password (PUT /api/admin/users/:userName/reset-password)
// Verify email (PUT /api/admin/users/:userName/verify-email)


// Export utility functions
module.exports = {
  get_user,
  createUser,
  deleteUser
};