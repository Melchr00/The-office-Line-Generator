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

async function get_users(base_url, access_token, userName) {
    const headers = {
        'Authorization': "Bearer " +access_token
    };

    try {
        const response = await axios.get(base_url, { headers });
        // Find the specific role by name
    const user = response.data.find(r => r.username === userName);

    if (user) {
      console.log(`Found user: ${user.name}`);
      return user;
    } else {
      console.warn(`user "${userName}" not found.`);
      return null;
    }
  } catch (error) {
    console.error('Error getting Users:', error.response?.data || error.message);
    throw error;
  }
}

async function appendRole_to_User(base_url, access_token, userId, roleObj) {
  const headers = {
    'Authorization': `Bearer ${access_token}`,
  };

  // Endpoint to assign realm-level roles
  const url = `${base_url}/users/${userId}/role-mappings/realm`;

  // Keycloak expects an array of roles 
  const payload = [
    {
      id: roleObj.id,
      name: roleObj.name
    }
  ];

  try {
    console.log(`Assigning role "${roleObj.name}" to user ID: ${userId}`);
    await axios.post(url, payload, { headers });
    console.log(`Role "${roleObj.name}" assigned successfully.`);
    return { success: true };
  } catch (error) {
    console.error('Error assigning role:', error.response?.data || error.message);
    throw error;
  }
}

async function removeRole_from_User(base_url, access_token, userId, roleObj) {
  const headers = {
    'Authorization': `Bearer ${access_token}`,
  };

  // Endpoint to assign realm-level roles
  const url = `${base_url}/users/${userId}/role-mappings/realm`;

  // Keycloak expects an array of roles 
  const payload = [
    {
      id: roleObj.id,
      name: roleObj.name
    }
  ];

  try {
    console.log(`Removing role "${roleObj.name}" from user ID: ${userId}`);
    await axios.delete(url, { headers, data: payload });
    console.log(`Role "${roleObj.name}" removed successfully.`);
    return { success: true };
  } catch (error) {
    console.error('Error removing role:', error.response?.data || error.message);
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

module.exports = { get_role, get_access_token, get_users, appendRole_to_User, removeRole_from_User };