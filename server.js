const express = require('express');
const https = require('https');

// Create an Express app
const app = express();

// Use the port provided by Render or default to 8080 for local development
const PORT = process.env.PORT || 8080;

// Define the `/api` endpoint
app.get('/api', (req, res) => {
    const uid = req.query.uid;

    if (!uid) {
        return res.status(400).json({ error: "UID is required" });
    }

    const options = {
        hostname: 'graph.facebook.com',
        port: 443,
        path: `/${uid}/picture?type=normal`,
        method: 'GET',
        rejectUnauthorized: true,
    };

    https.get(options, fbRes => {
        // Check if the account exists
        if (fbRes.statusCode === 200 || fbRes.statusCode === 302) {
            // Account is found; proceed with the checking process
            res.status(200).json({ 
                status: "Alive", 
                message: "Account found. Starting checking process..." 
            });

            // Example: Add further processing logic here
            console.log(`Checking process started for UID: ${uid}`);
        } else if (fbRes.statusCode === 404) {
            // Account not found
            res.status(404).json({ 
                status: "Not Found", 
                message: "Account not found." 
            });
        } else {
            res.status(500).json({ error: `Unexpected response: ${fbRes.statusCode}` });
        }
    }).on('error', error => {
        res.status(500).json({ error: "Request failed", details: error.message });
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: "OK" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
