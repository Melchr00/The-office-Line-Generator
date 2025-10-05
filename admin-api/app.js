/***Express server for admin-API (PORT=4002), Cors enabled so frontend have easy access.  ***/
const express = require('express');
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors())

const dotenv = require('dotenv');
dotenv.config();

const { get_access_token } = require('./utils/auth');

//Environment variable declerations
// Environment variable declarations
const admin_keycloak_url = process.env.ADMIN_KEYCLOAK_URL;
const admin_keycloak_clientId = process.env.ADMIN_KEYCLOAK_CLIENT_ID;
const keycloak_admin_api_base_url = process.env.KEYCLOAK_ADMIN_API_BASE_URL;
const keycloak_admin_username = process.env.KEYCLOAK_ADMIN_USERNAME;
const keycloak_admin_password = process.env.KEYCLOAK_ADMIN_PASSWORD;

app.get('/api/admin/accessToken', async(req, res)=> {
  try {
    const token = await get_access_token(admin_keycloak_url,admin_keycloak_clientId,keycloak_admin_username, keycloak_admin_password)
    console.log('Access token: ', token);
    res.status(200).json({ access_token: token });
  } catch(err) {
    console.error("Failed to get token");
     res.status(500).json({
      message: 'Could not fetch access token',
      error: err.response?.data || err.message || err
    });
  }
})




/**
 * Health check endpoint.
 * Used to verify the service is running without errors.
 */
app.get('/health', (req, res) => {
  res.send('OK');
})

app.post('/api/admin/createUser', (req, res) => {


  res.json({
    message: 'Environment variables printed to server console!',
  });
});





/**
 * Start the microservice API on port 4002.
 */
const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Microservice running on port ${PORT}`);
});
