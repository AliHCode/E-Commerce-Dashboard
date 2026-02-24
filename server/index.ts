import express from 'express';
// We use CORS so our React frontend (running on port 3000) can talk to our Express backend (running on port 5000)
import cors from 'cors';

// Set up the Express application
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Allow the server to understand JSON data in the body of requests

// --- OUR FIRST API ROUTE ---
// When someone goes to http://localhost:5000/api/health in their browser, the server responds with this JSON message!
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to the Aether Backend API!',
        timestamp: new Date().toISOString()
    });
});

// Start the server listening on PORT 5000
app.listen(PORT, () => {
    console.log(`\n======================================`);
    console.log(`🚀 Aether Backend running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`======================================\n`);
});
