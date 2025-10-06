/**
 * Utility functions for interacting with Keycloak Admin REST API.
 * Includes role management helpers.
 */

const axios = require('axios');



// TODO 
// Get all roles  (GET /api/admin/roles)

/**
 * Retrieve a specific role by name from Keycloak.
 * (GET /api/admin/roles/:roleName)
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
// Get user roles (GET /api/admin/users/:userName/roles)




/**
 * Assign a realm-level role to a user in Keycloak.
 * (POST /api/admin/users/:userName/roles/:roleName)
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
 * (DELETE /api/admin/users/:userName/roles/:roleName)
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


// Update subscription (Handle upgrde/downgrade) (PUT /api/admin/users/:userName/subscription)
// Get subscription status (GET /api/admin/users/:userName/subscription)


// Export utility functions
module.exports = {
  get_role,
  appendRole_to_User,
  removeRole_from_User
};