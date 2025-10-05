const axios = require('axios');
const qs = require('qs'); // For URL-encoded payload

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

module.exports = { get_access_token };