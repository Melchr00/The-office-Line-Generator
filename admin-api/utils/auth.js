/**
 * Utility functions for interacting with Keycloak Admin REST API.
 * Includes Admin access-token retrieval
 */

const axios = require('axios');
const qs = require('qs'); 

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


// Export utility function
module.exports = {
  get_access_token,
};
