const express = require('express');
const app = express();
const { getRandomEntry } = require('./utils/csvUtil');
app.use(express.json());
const cors = require('cors');
app.use(cors())


//Health check
app.get('/health', (req, res) => {
  res.send('OK');
})

// Get random entry
app.get('/random', async (req, res) => {
  try {
    const randomData = await getRandomEntry();
    res.json(randomData);
  }catch (err) {
    res.status(500).json({ error: 'Failed to read CSV' });
  }
});


// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Microservice running on port ${PORT}`);
});
