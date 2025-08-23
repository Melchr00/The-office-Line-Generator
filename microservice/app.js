/***Express server for backend-API (PORT=4000), Cors enabled so frontend have easy access.  ***/
const express = require('express');
const app = express();
const { getRandomEntry } = require('./utils/csvUtil');
app.use(express.json());
const cors = require('cors');
app.use(cors())

/**
 * Health check endpoint.
 * Used to verify the service is running without errors.
 */
app.get('/health', (req, res) => {
  res.send('OK');
})

/**
 * Endpoint to fetch a random line from the dataset.
 * Wrapped in try/catch to ensure server responds gracefully
 */
app.get('/random', async (req, res) => {
  try {
    const randomData = await getRandomEntry();
    res.json(randomData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read CSV' });
  }
});

/**
 * Start the microservice on port 4000.
 */
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Microservice running on port ${PORT}`);
});
