const axios = require('axios');
const qs = require('qs'); // For URL-encoded payload

async function get_role(token_url, access_token, roleName) {
    const headers = {
        'Authorization': "Bearer " +access_token
    };

    try {
        const response = await axios.get(token_url, { headers });

       // Find the specific role by name
    const role = response.data.find(r => r.name === roleName);

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

async function get_users(token_url, access_token) {
    const headers = {
        'Authorization': "Bearer " +access_token
    };

    try {
        const response = await axios.get(token_url, { headers });
        return response.data;
    } catch (error) {
        console.error('Error getting users:', error.response?.data || error.message);
        throw error;
    }
}

async function get_access_token(token_url, client_id, username, password) {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const payload = qs.stringify({
        client_id: client_id,
        username: username,
        password: password,
        grant_type: 'password'
    });

    try {
        console.log('Sending request to Keycloak with payload:', payload); // debug
        const response = await axios.post(token_url, payload, { headers });
        console.log('Received response:', response.data); // debug
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = { get_role, get_access_token, get_users };