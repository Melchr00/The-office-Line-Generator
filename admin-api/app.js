/***Express server for admin-API (PORT=4002), Cors enabled so frontend have easy access.  ***/
const express = require('express');
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors())

const dotenv = require('dotenv');
dotenv.config();

//Environment variable declerations
// Environment variable declarations
const admin_keycloak_url = process.env.ADMIN_KEYCLOAK_URL;
const admin_keycloak_clientId = process.env.ADMIN_KEYCLOAK_CLIENT_ID;
const keycloak_admin_api_base_url = process.env.KEYCLOAK_ADMIN_API_BASE_URL;
const keycloak_admin_username = process.env.KEYCLOAK_ADMIN_USERNAME;
const keycloak_admin_password = process.env.KEYCLOAK_ADMIN_PASSWORD;






/**
 * Health check endpoint.
 * Used to verify the service is running without errors.
 */
app.get('/health', (req, res) => {
  res.send('OK');
})

app.post('/api/admin/createUser', (req, res) => {
 console.log('Loaded Environment Variables:');
  console.log('ADMIN_KEYCLOAK_URL:', admin_keycloak_url);
  console.log('ADMIN_KEYCLOAK_CLIENT_ID:', admin_keycloak_clientId);
  console.log('KEYCLOAK_ADMIN_API_BASE_URL:', keycloak_admin_api_base_url);
  console.log('KEYCLOAK_ADMIN_USERNAME:', keycloak_admin_username);
  console.log('KEYCLOAK_ADMIN_PASSWORD:', keycloak_admin_password);

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
